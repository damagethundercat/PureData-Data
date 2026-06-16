#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path

SKILL_DIR = Path("/Users/ikidk/.codex/skills/puredata-skills")
sys.path.insert(0, str(SKILL_DIR / "scripts"))

from pd_patch_builder import Patch  # noqa: E402


OUT = Path(__file__).with_name("no_pain_inspired_progression.pd")
BPM = 94
STEP_MS = 60000 / (BPM * 4)
CHORD_STEPS = 16  # one chord slot is one bar at the sequencer tempo


CHORDS = {
    "Dbmaj7": ([61, 65, 68, 72], 37),
    "Eb7": ([63, 67, 70, 73], 39),
    "Cm7": ([60, 63, 67, 70], 36),
    "Fm7": ([65, 68, 72, 75], 41),
    "Bbm7": ([58, 61, 65, 68], 34),
    "A7": ([57, 61, 64, 67], 33),
}


def phrase(*names: str) -> list[str]:
    return list(names)


INTRO = phrase("Dbmaj7", "Eb7", "Cm7", "Fm7", "Dbmaj7", "Eb7", "Cm7", "Cm7") * 2
VERSE = phrase("Dbmaj7", "Eb7", "Cm7", "Fm7") * 2
PRE = phrase("Bbm7", "Cm7", "Dbmaj7", "Dbmaj7", "Bbm7", "Cm7", "Dbmaj7", "Eb7")
CHORUS = (
    phrase("Dbmaj7", "Eb7", "Cm7", "Fm7") * 2
    + phrase("Dbmaj7", "Eb7", "Cm7", "Fm7", "Dbmaj7", "Cm7", "Bbm7", "Eb7")
)
CHORUS_A7 = (
    phrase("Dbmaj7", "Eb7", "Cm7", "Fm7") * 2
    + phrase("Dbmaj7", "Eb7", "Cm7", "Fm7", "Cm7", "Bbm7", "A7", "A7")
)
CHORUS_2 = (
    phrase("Dbmaj7", "Eb7", "Fm7", "Cm7") * 2
    + phrase("Dbmaj7", "Eb7", "Fm7", "Fm7", "Dbmaj7", "Cm7", "Bbm7", "Eb7")
)

FORM = [
    ("Intro", INTRO),
    ("Verse 1", VERSE),
    ("Pre", PRE),
    ("Chorus", CHORUS),
    ("Interlude", INTRO),
    ("Verse 2", VERSE),
    ("Pre 2", PRE),
    ("Chorus A7", CHORUS_A7),
    ("Chorus 2", CHORUS_2),
    ("Outro", INTRO),
]


def display_name(name: str) -> str:
    return name.replace(" ", "_")


def section_receive_name(name: str) -> str:
    return "np_section_" + display_name(name).lower()


def chord_display_name(name: str) -> str:
    return {
        "Dbmaj7": "DbM7",
        "Eb7": "Eb7",
        "Cm7": "Cm7",
        "Fm7": "Fm7",
        "Bbm7": "Bbm7",
        "A7": "A7",
    }[name]


def expanded_form() -> tuple[list[tuple[str, str]], list[tuple[str, int]]]:
    slots: list[tuple[str, str]] = []
    starts: list[tuple[str, int]] = []
    for section, chords in FORM:
        starts.append((section, len(slots)))
        for chord in chords:
            slots.append((section, chord))
    return slots, starts


def connect_all(patch: Patch, selector, target, outlet_count: int) -> None:
    for outlet in range(outlet_count):
        patch.connect(selector, outlet, target, 0)


def add_throw_pair(patch: Patch, x: int, y: int, signal_node, dry_gain: float, fx_gain: float) -> None:
    dry = patch.obj(x, y, f"*~ {dry_gain}")
    dry_throw = patch.obj(x + 92, y, "throw~ np_mix")
    patch.connect(signal_node, 0, dry, 0)
    patch.connect(dry, 0, dry_throw, 0)
    if fx_gain > 0:
        wet = patch.obj(x, y + 34, f"*~ {fx_gain}")
        wet_throw = patch.obj(x + 92, y + 34, "throw~ np_fx")
        patch.connect(signal_node, 0, wet, 0)
        patch.connect(wet, 0, wet_throw, 0)


def add_transport(patch: Patch, total_steps: int) -> None:
    patch.comment(30, 76, "Transport: loadbang turns DSP on and starts the 16th-note sequencer.")
    patch.comment(30, 96, "Click 0 to stop, 1 to restart. The full form loops automatically.")
    loadbang = patch.obj(30, 126, "loadbang")
    dsp_on = patch.msg(30, 158, "; pd dsp 1")
    start = patch.msg(138, 158, "1")
    stop = patch.msg(192, 158, "0")
    metro = patch.obj(138, 194, f"metro {STEP_MS:.3f}")
    counter = patch.obj(138, 230, "f 0")
    increment = patch.obj(198, 230, "+ 1")
    wrap = patch.obj(258, 230, f"mod {total_steps}")
    global_send = patch.obj(138, 266, "s np_step_global")
    local_mod = patch.obj(340, 230, "mod 16")
    local_send = patch.obj(340, 266, "s np_step16")

    patch.connect(loadbang, 0, dsp_on, 0)
    patch.connect(loadbang, 0, start, 0)
    patch.connect(start, 0, metro, 0)
    patch.connect(stop, 0, metro, 0)
    patch.connect(metro, 0, counter, 0)
    patch.connect(counter, 0, global_send, 0)
    patch.connect(counter, 0, local_mod, 0)
    patch.connect(local_mod, 0, local_send, 0)
    patch.connect(counter, 0, increment, 0)
    patch.connect(increment, 0, wrap, 0)
    patch.connect(wrap, 0, counter, 1)


def add_timeline_visualizer(
    patch: Patch,
    slots: list[tuple[str, str]],
    starts: list[tuple[str, int]],
    x: int,
    y: int,
) -> None:
    patch.comment(x, y, "Timeline visualizer: each row is a section; each bang is one bar/chord.")
    patch.symbolatom(x, y + 32, width=14, label="section", receive="np_section_name", send="-")
    patch.symbolatom(x + 192, y + 32, width=10, label="chord", receive="np_chord_name", send="-")
    patch.floatatom(x + 342, y + 32, width=4, label="section_id", receive="np_section_id", send="-")
    patch.comment(x + 444, y + 6, "Beat pulse")
    for beat in range(4):
        patch.obj(
            x + 444 + beat * 34,
            y + 32,
            f"bng 18 120 40 0 empty np_beat_{beat + 1} {beat + 1} 5 26 0 9 #f2f2f2 #111111 #111111",
        )

    section_lengths = {section: len(chords) for section, chords in FORM}
    for row, (section, first_slot) in enumerate(starts):
        row_y = y + 96 + row * 54
        patch.comment(x, row_y + 4, f"{display_name(section)}")
        for local_idx in range(section_lengths[section]):
            global_idx = first_slot + local_idx
            chord_name = slots[global_idx][1]
            patch.obj(
                x + 136 + local_idx * 34,
                row_y,
                "bng 16 120 35 0 "
                f"empty np_vis_{global_idx} {chord_display_name(chord_name)} "
                "0 24 0 8 #f7f7f7 #111111 #111111",
            )

    beat_receive = patch.obj(30, 318, "r np_step16")
    beat_sel = patch.obj(30, 352, "sel 0 4 8 12")
    patch.connect(beat_receive, 0, beat_sel, 0)
    for beat in range(4):
        beat_send = patch.obj(200 + beat * 90, 352, f"s np_beat_{beat + 1}")
        patch.connect(beat_sel, beat, beat_send, 0)


def add_chord_scheduler(
    patch: Patch,
    slots: list[tuple[str, str]],
    starts: list[tuple[str, int]],
    x: int,
    y: int,
) -> None:
    patch.comment(x, y, "Chord scheduler: user progression, enharmonic spelling Db/Eb for C#/D#.")
    patch.comment(x, y + 20, "Each message is four chord tones plus bass-root MIDI; no audio samples are used.")
    receive = patch.obj(x, y + 52, "r np_step_global")
    event_steps = [idx * CHORD_STEPS for idx in range(len(slots))]
    selector = patch.obj(x, y + 86, "sel " + " ".join(str(step) for step in event_steps))
    send = patch.obj(x + 408, y + 86, "s np_chord")
    chord_name_send = patch.obj(x + 408, y + 120, "s np_chord_name")
    section_name_send = patch.obj(x + 408, y + 154, "s np_section_name")
    section_id_send = patch.obj(x + 408, y + 188, "s np_section_id")
    patch.connect(receive, 0, selector, 0)

    section_ids: dict[str, int] = {}
    for section_idx, (section, _slot) in enumerate(starts, start=1):
        section_ids[section] = section_idx

    for idx, (section, chord_name) in enumerate(slots):
        tones, root = CHORDS[chord_name]
        msg = patch.msg(x + 200 + (idx % 4) * 78, y + 126 + (idx // 4) * 24, " ".join(str(n) for n in [*tones, root]))
        name_msg = patch.msg(x + 200 + (idx % 4) * 78, y + 914 + (idx // 4) * 24, f"symbol {chord_name}")
        section_msg = patch.msg(x + 540 + (idx % 2) * 154, y + 126 + (idx // 2) * 24, f"symbol {display_name(section)}")
        section_id_msg = patch.msg(x + 874 + (idx % 4) * 44, y + 126 + (idx // 4) * 24, str(section_ids[section]))
        visual_send = patch.obj(x + 1080 + (idx % 4) * 78, y + 126 + (idx // 4) * 24, f"s np_vis_{idx}")
        patch.connect(selector, idx, msg, 0)
        patch.connect(msg, 0, send, 0)
        patch.connect(selector, idx, name_msg, 0)
        patch.connect(name_msg, 0, chord_name_send, 0)
        patch.connect(selector, idx, section_msg, 0)
        patch.connect(section_msg, 0, section_name_send, 0)
        patch.connect(selector, idx, section_id_msg, 0)
        patch.connect(section_id_msg, 0, section_id_send, 0)
        patch.connect(selector, idx, visual_send, 0)
        if idx in {slot_index for _name, slot_index in starts}:
            patch.comment(x + 1220, y + 126 + (idx // 4) * 24, section)


def add_chord_pad(patch: Patch, x: int, y: int) -> None:
    patch.comment(x, y, "Chord pad: bright saw-like synth voicing with a short swell per chord slot")
    receive = patch.obj(x, y + 30, "r np_chord")
    order = patch.obj(x, y + 64, "t b l")
    unpack = patch.obj(x + 100, y + 98, "unpack f f f f f")
    root_send = patch.obj(x + 392, y + 132, "s np_root_midi")
    env_msg = patch.msg(x, y + 98, "0 0, 0.50 38, 0.34 1450 54, 0 420 2050")
    env = patch.obj(x, y + 132, "vline~")
    patch.connect(receive, 0, order, 0)
    patch.connect(order, 1, unpack, 0)
    patch.connect(order, 0, env_msg, 0)
    patch.connect(env_msg, 0, env, 0)
    patch.connect(unpack, 4, root_send, 0)

    partials = []
    for idx in range(4):
        xx = x + idx * 106
        mtof = patch.obj(xx, y + 174, "mtof")
        pack = patch.obj(xx, y + 206, "pack f 70")
        freq = patch.obj(xx, y + 238, "line~")
        osc = patch.obj(xx, y + 270, "phasor~")
        center = patch.obj(xx, y + 302, "-~ 0.5")
        soften = patch.obj(xx, y + 334, "lop~ 1800")
        weight = patch.obj(xx, y + 366, "*~ 0.22")
        patch.connect(unpack, idx, mtof, 0)
        patch.connect(mtof, 0, pack, 0)
        patch.connect(pack, 0, freq, 0)
        patch.connect(freq, 0, osc, 0)
        patch.connect(osc, 0, center, 0)
        patch.connect(center, 0, soften, 0)
        patch.connect(soften, 0, weight, 0)
        partials.append(weight)

    mix_a = patch.obj(x + 52, y + 408, "+~")
    mix_b = patch.obj(x + 158, y + 438, "+~")
    mix_c = patch.obj(x + 264, y + 468, "+~")
    amp = patch.obj(x + 374, y + 502, "*~")
    body = patch.obj(x + 464, y + 502, "lop~ 2400")
    patch.connect(partials[0], 0, mix_a, 0)
    patch.connect(partials[1], 0, mix_a, 1)
    patch.connect(mix_a, 0, mix_b, 0)
    patch.connect(partials[2], 0, mix_b, 1)
    patch.connect(mix_b, 0, mix_c, 0)
    patch.connect(partials[3], 0, mix_c, 1)
    patch.connect(mix_c, 0, amp, 0)
    patch.connect(env, 0, amp, 1)
    patch.connect(amp, 0, body, 0)
    add_throw_pair(patch, x + 558, y + 502, body, 0.22, 0.16)


def add_bass(patch: Patch, x: int, y: int) -> None:
    patch.comment(x, y, "Bass: root/fifth/octave pattern following the scheduler root")
    root_receive = patch.obj(x + 250, y + 26, "r np_root_midi")
    root_store = patch.obj(x + 250, y + 62, "f")
    fifth_store = patch.obj(x + 340, y + 62, "f")
    octave_store = patch.obj(x + 430, y + 62, "f")
    add_fifth = patch.obj(x + 340, y + 26, "+ 7")
    add_oct = patch.obj(x + 430, y + 26, "+ 12")
    patch.connect(root_receive, 0, root_store, 1)
    patch.connect(root_receive, 0, add_fifth, 0)
    patch.connect(add_fifth, 0, fifth_store, 1)
    patch.connect(root_receive, 0, add_oct, 0)
    patch.connect(add_oct, 0, octave_store, 1)

    step = patch.obj(x, y + 26, "r np_step16")
    root_sel = patch.obj(x, y + 60, "sel 0 8")
    oct_sel = patch.obj(x, y + 94, "sel 5 14")
    fifth_sel = patch.obj(x, y + 128, "sel 11")
    patch.connect(step, 0, root_sel, 0)
    patch.connect(step, 0, oct_sel, 0)
    patch.connect(step, 0, fifth_sel, 0)
    connect_all(patch, root_sel, root_store, 2)
    connect_all(patch, oct_sel, octave_store, 2)
    connect_all(patch, fifth_sel, fifth_store, 1)

    mtof = patch.obj(x + 250, y + 112, "mtof")
    pack = patch.obj(x + 250, y + 146, "pack f 18")
    freq = patch.obj(x + 250, y + 180, "line~")
    sine = patch.obj(x + 250, y + 214, "osc~")
    saw = patch.obj(x + 342, y + 214, "phasor~")
    saw_low = patch.obj(x + 342, y + 248, "lop~ 230")
    sine_gain = patch.obj(x + 250, y + 282, "*~ 0.78")
    saw_gain = patch.obj(x + 342, y + 282, "*~ 0.22")
    tone = patch.obj(x + 296, y + 318, "+~")
    env_msg = patch.msg(x + 548, y + 94, "0.95 5, 0.70 88 8, 0 210 95")
    env = patch.obj(x + 548, y + 128, "vline~")
    amp = patch.obj(x + 386, y + 354, "*~")
    low = patch.obj(x + 476, y + 354, "lop~ 320")

    for store in (root_store, fifth_store, octave_store):
        patch.connect(store, 0, mtof, 0)
    for selector, count in ((root_sel, 2), (oct_sel, 2), (fifth_sel, 1)):
        connect_all(patch, selector, env_msg, count)
    patch.connect(mtof, 0, pack, 0)
    patch.connect(pack, 0, freq, 0)
    patch.connect(freq, 0, sine, 0)
    patch.connect(freq, 0, saw, 0)
    patch.connect(sine, 0, sine_gain, 0)
    patch.connect(saw, 0, saw_low, 0)
    patch.connect(saw_low, 0, saw_gain, 0)
    patch.connect(sine_gain, 0, tone, 0)
    patch.connect(saw_gain, 0, tone, 1)
    patch.connect(env_msg, 0, env, 0)
    patch.connect(tone, 0, amp, 0)
    patch.connect(env, 0, amp, 1)
    patch.connect(amp, 0, low, 0)
    add_throw_pair(patch, x + 570, y + 354, low, 0.42, 0.02)


def add_lead(patch: Patch, x: int, y: int) -> None:
    patch.comment(x, y, "Lead: original narrow hook, filtered and clipped for a guitar/synth edge")
    step = patch.obj(x, y + 28, "r np_step16")
    selector = patch.obj(x, y + 62, "sel 0 3 6 8 11 14")
    notes = [68, 70, 72, 75, 72, 70]
    mtof = patch.obj(x + 262, y + 96, "mtof")
    pack = patch.obj(x + 262, y + 130, "pack f 22")
    freq = patch.obj(x + 262, y + 164, "line~")
    osc = patch.obj(x + 262, y + 198, "phasor~")
    center = patch.obj(x + 262, y + 232, "-~ 0.5")
    clip = patch.obj(x + 262, y + 266, "clip~ -0.24 0.24")
    filter_a = patch.obj(x + 262, y + 300, "bp~ 1700 4")
    filter_b = patch.obj(x + 262, y + 334, "lop~ 3600")
    env_msg = patch.msg(x + 468, y + 96, "0.82 4, 0.24 120 8, 0 180 132")
    env = patch.obj(x + 468, y + 130, "vline~")
    amp = patch.obj(x + 354, y + 372, "*~")

    patch.connect(step, 0, selector, 0)
    for idx, note in enumerate(notes):
        note_msg = patch.msg(x + 42 + idx * 36, y + 100, str(note))
        patch.connect(selector, idx, note_msg, 0)
        patch.connect(note_msg, 0, mtof, 0)
        patch.connect(selector, idx, env_msg, 0)
    patch.connect(mtof, 0, pack, 0)
    patch.connect(pack, 0, freq, 0)
    patch.connect(freq, 0, osc, 0)
    patch.connect(osc, 0, center, 0)
    patch.connect(center, 0, clip, 0)
    patch.connect(clip, 0, filter_a, 0)
    patch.connect(filter_a, 0, filter_b, 0)
    patch.connect(env_msg, 0, env, 0)
    patch.connect(filter_b, 0, amp, 0)
    patch.connect(env, 0, amp, 1)
    add_throw_pair(patch, x + 450, y + 372, amp, 0.13, 0.17)


def add_drums(patch: Patch, x: int, y: int) -> None:
    patch.comment(x, y, "Drums: synthesized kick, snare, hats, and section-boundary noise crash")

    step_kick = patch.obj(x, y + 32, "r np_step16")
    kick_sel = patch.obj(x, y + 66, "sel 0 6 8 11")
    kick_pitch_msg = patch.msg(x + 152, y + 66, "92 0, 48 76 1")
    kick_pitch = patch.obj(x + 152, y + 100, "line~")
    kick_osc = patch.obj(x + 152, y + 134, "osc~")
    kick_env_msg = patch.msg(x + 300, y + 66, "1 2, 0 150 4")
    kick_env = patch.obj(x + 300, y + 100, "vline~")
    kick_amp = patch.obj(x + 228, y + 172, "*~")
    kick_body = patch.obj(x + 228, y + 206, "lop~ 220")
    patch.connect(step_kick, 0, kick_sel, 0)
    connect_all(patch, kick_sel, kick_pitch_msg, 4)
    connect_all(patch, kick_sel, kick_env_msg, 4)
    patch.connect(kick_pitch_msg, 0, kick_pitch, 0)
    patch.connect(kick_pitch, 0, kick_osc, 0)
    patch.connect(kick_env_msg, 0, kick_env, 0)
    patch.connect(kick_osc, 0, kick_amp, 0)
    patch.connect(kick_env, 0, kick_amp, 1)
    patch.connect(kick_amp, 0, kick_body, 0)
    add_throw_pair(patch, x + 318, y + 206, kick_body, 0.62, 0)

    step_snare = patch.obj(x + 560, y + 32, "r np_step16")
    sn_sel = patch.obj(x + 560, y + 66, "sel 4 12")
    sn_noise = patch.obj(x + 560, y + 104, "noise~")
    sn_bp = patch.obj(x + 560, y + 138, "bp~ 1900 3")
    sn_env_msg = patch.msg(x + 704, y + 66, "0.82 3, 0 150 8")
    sn_env = patch.obj(x + 704, y + 100, "vline~")
    sn_amp = patch.obj(x + 624, y + 176, "*~")
    patch.connect(step_snare, 0, sn_sel, 0)
    connect_all(patch, sn_sel, sn_env_msg, 2)
    patch.connect(sn_noise, 0, sn_bp, 0)
    patch.connect(sn_env_msg, 0, sn_env, 0)
    patch.connect(sn_bp, 0, sn_amp, 0)
    patch.connect(sn_env, 0, sn_amp, 1)
    add_throw_pair(patch, x + 720, y + 176, sn_amp, 0.18, 0.05)

    step_hat = patch.obj(x + 1030, y + 32, "r np_step16")
    hat_sel = patch.obj(x + 1030, y + 66, "sel 2 4 6 10 12 14")
    hat_noise = patch.obj(x + 1030, y + 104, "noise~")
    hat_hip = patch.obj(x + 1030, y + 138, "hip~ 7200")
    hat_env_msg = patch.msg(x + 1214, y + 66, "0.45 2, 0 42 4")
    hat_env = patch.obj(x + 1214, y + 100, "vline~")
    hat_amp = patch.obj(x + 1094, y + 176, "*~")
    patch.connect(step_hat, 0, hat_sel, 0)
    connect_all(patch, hat_sel, hat_env_msg, 6)
    patch.connect(hat_noise, 0, hat_hip, 0)
    patch.connect(hat_env_msg, 0, hat_env, 0)
    patch.connect(hat_hip, 0, hat_amp, 0)
    patch.connect(hat_env, 0, hat_amp, 1)
    add_throw_pair(patch, x + 1190, y + 176, hat_amp, 0.08, 0.02)


def add_crash(patch: Patch, x: int, y: int, starts: list[tuple[str, int]]) -> None:
    patch.comment(x, y, "Section crash: filtered noise accents the form boundaries")
    receive = patch.obj(x, y + 30, "r np_step_global")
    steps = [slot * CHORD_STEPS for _name, slot in starts]
    selector = patch.obj(x, y + 64, "sel " + " ".join(str(step) for step in steps))
    noise = patch.obj(x + 310, y + 64, "noise~")
    hip = patch.obj(x + 310, y + 98, "hip~ 4600")
    env_msg = patch.msg(x + 170, y + 64, "0.58 8, 0 1550 12")
    env = patch.obj(x + 170, y + 98, "vline~")
    amp = patch.obj(x + 310, y + 132, "*~")
    patch.connect(receive, 0, selector, 0)
    connect_all(patch, selector, env_msg, len(steps))
    patch.connect(noise, 0, hip, 0)
    patch.connect(env_msg, 0, env, 0)
    patch.connect(hip, 0, amp, 0)
    patch.connect(env, 0, amp, 1)
    add_throw_pair(patch, x + 410, y + 132, amp, 0.05, 0.15)


def add_fx_and_master(patch: Patch, x: int, y: int) -> None:
    patch.comment(x, y, "Delay return: feed-forward delay only, no feedback loop")
    fx_catch = patch.obj(x, y + 30, "catch~ np_fx")
    delay_write = patch.obj(x, y + 64, "delwrite~ np_delay 900")
    delay_read_a = patch.obj(x + 250, y + 30, "delread~ np_delay 319")
    delay_gain_a = patch.obj(x + 250, y + 64, "*~ 0.22")
    delay_read_b = patch.obj(x + 250, y + 100, "delread~ np_delay 481")
    delay_gain_b = patch.obj(x + 250, y + 134, "*~ 0.14")
    delay_sum = patch.obj(x + 376, y + 100, "+~")
    delay_throw = patch.obj(x + 480, y + 100, "throw~ np_mix")
    patch.connect(fx_catch, 0, delay_write, 0)
    patch.connect(delay_read_a, 0, delay_gain_a, 0)
    patch.connect(delay_read_b, 0, delay_gain_b, 0)
    patch.connect(delay_gain_a, 0, delay_sum, 0)
    patch.connect(delay_gain_b, 0, delay_sum, 1)
    patch.connect(delay_sum, 0, delay_throw, 0)

    patch.comment(x + 730, y, "Master: bus catch, cleanup, clip, direct attenuation, stereo dac")
    mix_catch = patch.obj(x + 730, y + 30, "catch~ np_mix")
    hip = patch.obj(x + 730, y + 64, "hip~ 28")
    clip = patch.obj(x + 830, y + 64, "clip~ -0.9 0.9")
    gain = patch.obj(x + 946, y + 64, "*~ 0.15")
    dac = patch.obj(x + 1050, y + 64, "dac~")
    patch.connect(mix_catch, 0, hip, 0)
    patch.connect(hip, 0, clip, 0)
    patch.connect(clip, 0, gain, 0)
    patch.connect(gain, 0, dac, 0)
    patch.connect(gain, 0, dac, 1)


def build() -> None:
    slots, starts = expanded_form()
    total_steps = len(slots) * CHORD_STEPS

    p = Patch(x=20, y=20, width=2200, height=2900, font_size=12)
    p.comment(28, 20, "NO PAIN-inspired chord progression sketch - Pd Vanilla")
    p.comment(
        28,
        42,
        f"{BPM} BPM, one-bar chord slots, full form loops, synthesized band texture, no samples.",
    )

    add_transport(p, total_steps)
    add_timeline_visualizer(p, slots, starts, 520, 76)
    add_chord_pad(p, 30, 700)
    add_bass(p, 840, 700)
    add_lead(p, 1470, 700)
    add_drums(p, 30, 1240)
    add_crash(p, 1500, 1240, starts)
    add_fx_and_master(p, 30, 1660)
    add_chord_scheduler(p, slots, starts, 30, 1900)

    p.save(OUT)


if __name__ == "__main__":
    build()
