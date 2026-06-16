#!/usr/bin/env python3
from __future__ import annotations

import os
import sys
from pathlib import Path

SKILL_DIR = Path("/Users/ikidk/.codex/skills/puredata-skills")
sys.path.insert(0, str(SKILL_DIR / "scripts"))

from pd_patch_builder import Patch  # noqa: E402


OUT = Path(__file__).with_name("just_two_of_us_phonk_jazz_test.pd")
BPM = 96
STEP_MS = 60000 / (BPM * 4)
BAR = 16
HALF = 8

BASE_DIR = Path(__file__).resolve().parent
SRC_DIR = BASE_DIR / "samples/KUSA NAGI PHONK V1"
READY_DIR = BASE_DIR / "samples/kusa_nagi_phonk_v1_pd_ready"
PATCH_READY_DIR = Path("samples/kusa_nagi_phonk_v1_pd_ready")

READY_LINKS = {
    "kick_1.wav": SRC_DIR / "KICKS/PHONKIN KICK 1.wav",
    "808_1.wav": SRC_DIR / "808s/PHONKIN 808 1.wav",
    "snare_3.wav": SRC_DIR / "SNARES/PHONKIN SNARE 3.wav",
    "clap_2.wav": SRC_DIR / "CLAPS/PHONKIN CLAP 2.wav",
    "hh_8.wav": SRC_DIR / "HH/PHONKIN HH 8.wav",
    "open_hat_4.wav": SRC_DIR / "OPEN HATS/PHONKIN OPEN H 4.wav",
    "crash_1.wav": SRC_DIR / "CRASHES/PHONKIN CRASH 1.wav",
    "cowbell_1.wav": SRC_DIR / "PERCS/PHONKIN COWBELL  1.wav",
    "cowbell_2.wav": SRC_DIR / "PERCS/PHONKIN COWBELL  2.wav",
    "chime_1.wav": SRC_DIR / "PERCS/PHONKIN CHIME 1.wav",
    "soft_chord_gsharp_minor.wav": BASE_DIR
    / "samples/soft-phonk-house-synth-chord-shot_115bpm_G#_minor.wav",
}

SAMPLES = {
    "kick": ("j2_kick", PATCH_READY_DIR / "kick_1.wav"),
    "808": ("j2_808", PATCH_READY_DIR / "808_1.wav"),
    "snare": ("j2_snare", PATCH_READY_DIR / "snare_3.wav"),
    "clap": ("j2_clap", PATCH_READY_DIR / "clap_2.wav"),
    "hat": ("j2_hat", PATCH_READY_DIR / "hh_8.wav"),
    "open_hat": ("j2_open_hat", PATCH_READY_DIR / "open_hat_4.wav"),
    "crash": ("j2_crash", PATCH_READY_DIR / "crash_1.wav"),
    "cowbell_a": ("j2_cowbell_a", PATCH_READY_DIR / "cowbell_1.wav"),
    "cowbell_b": ("j2_cowbell_b", PATCH_READY_DIR / "cowbell_2.wav"),
    "chime": ("j2_chime", PATCH_READY_DIR / "chime_1.wav"),
    "soft_chord": ("j2_soft_chord", PATCH_READY_DIR / "soft_chord_gsharp_minor.wav"),
}

CHORDS = {
    "C": {"tones": [60, 64, 67, 71, 74], "root": 36, "display": "Cmaj9"},
    "B7": {"tones": [59, 63, 66, 69, 72], "root": 35, "display": "B7b9"},
    "Em": {"tones": [52, 55, 59, 62, 66], "root": 40, "display": "Em9"},
    "Dm": {"tones": [50, 53, 57, 60, 64], "root": 38, "display": "Dm9"},
    "G": {"tones": [55, 59, 62, 65, 69], "root": 43, "display": "G13"},
    "Bb": {"tones": [58, 62, 65, 69, 72], "root": 46, "display": "Bbmaj9"},
    "A": {"tones": [57, 61, 64, 67, 70], "root": 45, "display": "A7b9"},
    "G#": {"tones": [56, 60, 63, 67, 70], "root": 44, "display": "Gsharp_Abmaj9"},
    "F": {"tones": [53, 57, 60, 64, 67], "root": 41, "display": "Fmaj9"},
}


def core_phrase() -> list[tuple[str, int]]:
    return [
        ("C", BAR),
        ("B7", BAR),
        ("Em", BAR),
        ("Dm", HALF),
        ("G", HALF),
        ("C", BAR),
        ("B7", BAR),
        ("Em", BAR * 2),
    ]


def chromatic_chorus_phrase() -> list[tuple[str, int]]:
    return [
        ("C", BAR),
        ("B7", BAR),
        ("Bb", BAR),
        ("A", BAR),
        ("G#", BAR),
        ("G", BAR),
        ("C", BAR),
        ("F", BAR),
    ]


FORM = [
    ("Intro", core_phrase() * 2),
    ("Verse_1", core_phrase() * 2),
    ("Chorus_1", core_phrase() * 2),
    ("Verse_2", core_phrase() * 2),
    ("Chromatic_Chorus", chromatic_chorus_phrase() * 2 + core_phrase()),
    ("Verse_3", core_phrase() * 2),
    ("Final_Chorus", core_phrase() * 2),
]


def ensure_pd_ready_links() -> None:
    READY_DIR.mkdir(parents=True, exist_ok=True)
    for link_name, src in READY_LINKS.items():
        dst = READY_DIR / link_name
        if dst.exists() and not dst.is_symlink():
            continue
        if dst.is_symlink():
            dst.unlink()
        rel_src = os.path.relpath(src, READY_DIR)
        dst.symlink_to(rel_src)


def expanded_form() -> tuple[list[dict[str, int | str]], list[tuple[str, int]]]:
    events: list[dict[str, int | str]] = []
    starts: list[tuple[str, int]] = []
    cursor = 0
    for section, chords in FORM:
        starts.append((section, cursor))
        for chord_name, duration in chords:
            events.append(
                {
                    "section": section,
                    "chord": chord_name,
                    "start": cursor,
                    "duration": duration,
                }
            )
            cursor += duration
    return events, starts


def connect_all(patch: Patch, selector, target, outlet_count: int) -> None:
    for outlet in range(outlet_count):
        patch.connect(selector, outlet, target, 0)


def add_throw_pair(
    patch: Patch,
    x: int,
    y: int,
    signal_node,
    dry_gain: float,
    fx_gain: float,
    *,
    dry_bus: str = "j2_mix",
    fx_bus: str = "j2_fx",
) -> None:
    dry = patch.obj(x, y, f"*~ {dry_gain:g}")
    dry_throw = patch.obj(x + 96, y, f"throw~ {dry_bus}")
    patch.connect(signal_node, 0, dry, 0)
    patch.connect(dry, 0, dry_throw, 0)
    if fx_gain > 0:
        wet = patch.obj(x, y + 34, f"*~ {fx_gain:g}")
        wet_throw = patch.obj(x + 96, y + 34, f"throw~ {fx_bus}")
        patch.connect(signal_node, 0, wet, 0)
        patch.connect(wet, 0, wet_throw, 0)


def add_sample_loader(patch: Patch, loadbang, x: int, y: int) -> None:
    patch.comment(x, y, "KUSA NAGI sample loader: flat symlink names avoid spaces in Pd paths")
    soundfiler = patch.obj(x + 430, y + 28, "soundfiler")
    for idx, (key, (array_name, path)) in enumerate(SAMPLES.items()):
        yy = y + 28 + idx * 25
        msg = patch.msg(x, yy, f"read -resize {path.as_posix()} {array_name}")
        patch.obj(x + 570, yy, f"table {array_name} 44100")
        patch.connect(loadbang, 0, msg, 0)
        patch.connect(msg, 0, soundfiler, 0)
        patch.comment(x + 808, yy, key)


def add_transport(patch: Patch, total_steps: int) -> object:
    patch.comment(30, 78, "Transport: loadbang turns DSP on and starts the full-form sequencer.")
    patch.comment(30, 98, "Click 0 to stop, 1 to restart. Chord slots follow the supplied chart.")
    loadbang = patch.obj(30, 128, "loadbang")
    dsp_on = patch.msg(30, 160, "; pd dsp 1")
    start = patch.msg(138, 160, "1")
    stop = patch.msg(194, 160, "0")
    metro = patch.obj(138, 196, f"metro {STEP_MS:.3f}")
    counter = patch.obj(138, 232, "f 0")
    increment = patch.obj(198, 232, "+ 1")
    wrap = patch.obj(258, 232, f"mod {total_steps}")
    global_send = patch.obj(138, 268, "s j2_step_global")
    local_mod = patch.obj(342, 232, "mod 16")
    local_send = patch.obj(342, 268, "s j2_step16")
    view_send = patch.obj(520, 268, "s j2_step_view")

    patch.connect(loadbang, 0, dsp_on, 0)
    patch.connect(loadbang, 0, start, 0)
    patch.connect(start, 0, metro, 0)
    patch.connect(stop, 0, metro, 0)
    patch.connect(metro, 0, counter, 0)
    patch.connect(counter, 0, global_send, 0)
    patch.connect(counter, 0, local_mod, 0)
    patch.connect(counter, 0, view_send, 0)
    patch.connect(local_mod, 0, local_send, 0)
    patch.connect(counter, 0, increment, 0)
    patch.connect(increment, 0, wrap, 0)
    patch.connect(wrap, 0, counter, 1)
    return loadbang


def add_display(patch: Patch, x: int, y: int) -> None:
    patch.comment(x, y, "Current form position")
    patch.symbolatom(x, y + 30, width=20, label="section", receive="j2_section_name", send="-")
    patch.symbolatom(x + 254, y + 30, width=16, label="chord", receive="j2_chord_name", send="-")
    patch.floatatom(x + 470, y + 30, width=6, label="step", receive="j2_step_view", send="-")
    patch.comment(x, y + 70, "No melody or lyrics are encoded here; this is a chord-form and texture test.")


def add_chord_scheduler(
    patch: Patch,
    events: list[dict[str, int | str]],
    starts: list[tuple[str, int]],
    x: int,
    y: int,
) -> None:
    patch.comment(x, y, "Chord scheduler: chart sequence with jazz extensions for the Pd synth voices")
    receive = patch.obj(x, y + 30, "r j2_step_global")
    event_steps = [int(event["start"]) for event in events]
    selector = patch.obj(x, y + 64, "sel " + " ".join(str(step) for step in event_steps))
    chord_send = patch.obj(x + 438, y + 64, "s j2_chord")
    chord_name_send = patch.obj(x + 438, y + 98, "s j2_chord_name")
    section_send = patch.obj(x + 438, y + 132, "s j2_section_name")
    patch.connect(receive, 0, selector, 0)

    section_starts = {step for _section, step in starts}
    for idx, event in enumerate(events):
        chord_name = str(event["chord"])
        section = str(event["section"])
        data = CHORDS[chord_name]
        tones = data["tones"]
        root = data["root"]
        display = str(data["display"])
        col = idx % 4
        row = idx // 4
        yy = y + 120 + row * 24
        msg = patch.msg(x + col * 108, yy, " ".join(str(n) for n in [*tones, root]))
        chord_label = patch.msg(x + 520 + col * 116, yy, f"symbol {display}")
        section_label = patch.msg(x + 1010 + (idx % 3) * 150, yy, f"symbol {section}")
        patch.connect(selector, idx, msg, 0)
        patch.connect(msg, 0, chord_send, 0)
        patch.connect(selector, idx, chord_label, 0)
        patch.connect(chord_label, 0, chord_name_send, 0)
        patch.connect(selector, idx, section_label, 0)
        patch.connect(section_label, 0, section_send, 0)
        if int(event["start"]) in section_starts:
            patch.comment(x + 1480, yy, section)


def add_sample_chord_pad(patch: Patch, x: int, y: int) -> None:
    patch.comment(x, y, "Sample chord pad: soft phonk house Gsharp minor shot, pitch-following each root")
    receive = patch.obj(x, y + 30, "r j2_chord")
    unpack = patch.obj(x, y + 64, "unpack f f f f f f")
    root_send = patch.obj(x + 292, y + 98, "s j2_root_midi")
    root_select = patch.obj(x, y + 132, "sel 35 36 38 40 41 43 44 45 46")
    index_line = patch.obj(x + 420, y + 176, "vline~")
    player = patch.obj(x + 420, y + 210, "tabread4~ j2_soft_chord")
    env_msg = patch.msg(x + 420, y + 132, "0 0, 0.85 18, 0.56 1250 45, 0 650 1900")
    env = patch.obj(x + 612, y + 132, "vline~")
    amp = patch.obj(x + 420, y + 244, "*~")
    high = patch.obj(x + 510, y + 244, "hip~ 85")
    smooth = patch.obj(x + 610, y + 244, "lop~ 6200")
    patch.connect(receive, 0, unpack, 0)
    patch.connect(unpack, 5, root_send, 0)
    patch.connect(unpack, 5, root_select, 0)
    connect_all(patch, root_select, env_msg, 9)
    patch.connect(env_msg, 0, env, 0)

    # Source file is 3 seconds at 44.1 kHz. Durations transpose from Gsharp minor.
    source_frames = 132296
    source_root = 44
    roots = [35, 36, 38, 40, 41, 43, 44, 45, 46]
    for outlet, root in enumerate(roots):
        ratio = 2 ** ((root - source_root) / 12)
        duration = 3000 / ratio
        playback_msg = patch.msg(
            x + (outlet % 3) * 140,
            y + 176 + (outlet // 3) * 34,
            f"1, {source_frames} {duration:.1f}",
        )
        patch.connect(root_select, outlet, playback_msg, 0)
        patch.connect(playback_msg, 0, index_line, 0)

    patch.connect(index_line, 0, player, 0)
    patch.connect(player, 0, amp, 0)
    patch.connect(env, 0, amp, 1)
    patch.connect(amp, 0, high, 0)
    patch.connect(high, 0, smooth, 0)
    add_throw_pair(patch, x + 710, y + 244, smooth, 0.36, 0.16)


def add_sub_bass(patch: Patch, x: int, y: int) -> None:
    patch.comment(x, y, "Bass: root/fifth/octave follows each scheduled chord root")
    root_receive = patch.obj(x + 276, y + 30, "r j2_root_midi")
    root_store = patch.obj(x + 276, y + 66, "f")
    fifth_calc = patch.obj(x + 366, y + 30, "+ 7")
    fifth_store = patch.obj(x + 366, y + 66, "f")
    oct_calc = patch.obj(x + 456, y + 30, "+ 12")
    oct_store = patch.obj(x + 456, y + 66, "f")
    patch.connect(root_receive, 0, root_store, 1)
    patch.connect(root_receive, 0, fifth_calc, 0)
    patch.connect(fifth_calc, 0, fifth_store, 1)
    patch.connect(root_receive, 0, oct_calc, 0)
    patch.connect(oct_calc, 0, oct_store, 1)

    step = patch.obj(x, y + 30, "r j2_step16")
    root_sel = patch.obj(x, y + 64, "sel 0 8")
    oct_sel = patch.obj(x, y + 98, "sel 6 14")
    fifth_sel = patch.obj(x, y + 132, "sel 11")
    patch.connect(step, 0, root_sel, 0)
    patch.connect(step, 0, oct_sel, 0)
    patch.connect(step, 0, fifth_sel, 0)
    connect_all(patch, root_sel, root_store, 2)
    connect_all(patch, oct_sel, oct_store, 2)
    connect_all(patch, fifth_sel, fifth_store, 1)

    mtof = patch.obj(x + 276, y + 120, "mtof")
    pack = patch.obj(x + 276, y + 152, "pack f 18")
    line = patch.obj(x + 276, y + 184, "line~")
    sine = patch.obj(x + 276, y + 216, "osc~")
    saw = patch.obj(x + 374, y + 216, "phasor~")
    saw_center = patch.obj(x + 374, y + 248, "-~ 0.5")
    saw_low = patch.obj(x + 374, y + 280, "lop~ 360")
    sine_gain = patch.obj(x + 276, y + 314, "*~ 0.76")
    saw_gain = patch.obj(x + 374, y + 314, "*~ 0.24")
    tone = patch.obj(x + 328, y + 350, "+~")
    env_msg = patch.msg(x + 572, y + 120, "0.92 5, 0.66 96 8, 0 190 120")
    env = patch.obj(x + 572, y + 154, "vline~")
    amp = patch.obj(x + 418, y + 386, "*~")
    low = patch.obj(x + 508, y + 386, "lop~ 260")

    for store in (root_store, fifth_store, oct_store):
        patch.connect(store, 0, mtof, 0)
    for selector, count in ((root_sel, 2), (oct_sel, 2), (fifth_sel, 1)):
        connect_all(patch, selector, env_msg, count)
    patch.connect(mtof, 0, pack, 0)
    patch.connect(pack, 0, line, 0)
    patch.connect(line, 0, sine, 0)
    patch.connect(line, 0, saw, 0)
    patch.connect(saw, 0, saw_center, 0)
    patch.connect(saw_center, 0, saw_low, 0)
    patch.connect(sine, 0, sine_gain, 0)
    patch.connect(saw_low, 0, saw_gain, 0)
    patch.connect(sine_gain, 0, tone, 0)
    patch.connect(saw_gain, 0, tone, 1)
    patch.connect(env_msg, 0, env, 0)
    patch.connect(tone, 0, amp, 0)
    patch.connect(env, 0, amp, 1)
    patch.connect(amp, 0, low, 0)
    add_throw_pair(patch, x + 598, y + 386, low, 0.36, 0.02)


def add_guide_tone_arp(patch: Patch, x: int, y: int) -> None:
    patch.comment(x, y, "Main melody synth: prominent Pd Vanilla guide-tone line")
    chord_receive = patch.obj(x + 284, y + 30, "r j2_chord")
    unpack = patch.obj(x + 284, y + 64, "unpack f f f f f f")
    stores = []
    for idx in range(5):
        store = patch.obj(x + 284 + idx * 70, y + 100, "f")
        patch.connect(unpack, idx, store, 1)
        stores.append(store)

    step = patch.obj(x, y + 30, "r j2_step16")
    selector = patch.obj(x, y + 64, "sel 2 6 10 14")
    chosen = [stores[1], stores[3], stores[4], stores[2]]
    for outlet, store in enumerate(chosen):
        patch.connect(selector, outlet, store, 0)

    mtof = patch.obj(x + 284, y + 154, "mtof")
    pack = patch.obj(x + 284, y + 186, "pack f 20")
    line = patch.obj(x + 284, y + 218, "line~")
    sine = patch.obj(x + 284, y + 250, "osc~")
    buzz = patch.obj(x + 374, y + 250, "phasor~")
    buzz_center = patch.obj(x + 374, y + 282, "-~ 0.5")
    buzz_gain = patch.obj(x + 374, y + 314, "*~ 0.36")
    sine_gain = patch.obj(x + 284, y + 314, "*~ 0.82")
    tone = patch.obj(x + 330, y + 350, "+~")
    filter_a = patch.obj(x + 330, y + 382, "hip~ 420")
    filter_b = patch.obj(x + 330, y + 414, "lop~ 5200")
    env_msg = patch.msg(x + 580, y + 154, "0.88 4, 0.42 170 8, 0 260 180")
    env = patch.obj(x + 580, y + 188, "vline~")
    amp = patch.obj(x + 438, y + 450, "*~")

    for store in chosen:
        patch.connect(store, 0, mtof, 0)
    connect_all(patch, selector, env_msg, 4)
    patch.connect(mtof, 0, pack, 0)
    patch.connect(pack, 0, line, 0)
    patch.connect(line, 0, sine, 0)
    patch.connect(line, 0, buzz, 0)
    patch.connect(sine, 0, sine_gain, 0)
    patch.connect(buzz, 0, buzz_center, 0)
    patch.connect(buzz_center, 0, buzz_gain, 0)
    patch.connect(sine_gain, 0, tone, 0)
    patch.connect(buzz_gain, 0, tone, 1)
    patch.connect(tone, 0, filter_a, 0)
    patch.connect(filter_a, 0, filter_b, 0)
    patch.connect(env_msg, 0, env, 0)
    patch.connect(filter_b, 0, amp, 0)
    patch.connect(env, 0, amp, 1)
    add_throw_pair(patch, x + 528, y + 450, amp, 0.32, 0.18)


def add_sample_voice(
    patch: Patch,
    x: int,
    y: int,
    label: str,
    array_name: str,
    receive_name: str,
    steps: list[int],
    dry_gain: float,
    fx_gain: float,
    *,
    random_chance: int | None = None,
    delay_ms: int | None = None,
) -> None:
    patch.comment(x, y, label)
    step = patch.obj(x, y + 30, f"r {receive_name}")
    selector = patch.obj(x, y + 64, "sel " + " ".join(str(step_no) for step_no in steps))
    player = patch.obj(x + 282, y + 98, f"tabplay~ {array_name}")
    patch.connect(step, 0, selector, 0)

    target = player
    if delay_ms is not None:
        delay = patch.obj(x + 282, y + 64, f"delay {delay_ms}")
        target = delay
        patch.connect(delay, 0, player, 0)

    if random_chance is None:
        connect_all(patch, selector, target, len(steps))
    else:
        rand = patch.obj(x + 166, y + 98, "random 100")
        threshold = patch.obj(x + 166, y + 130, f"moses {random_chance}")
        bang = patch.obj(x + 282, y + 130, "t b")
        connect_all(patch, selector, rand, len(steps))
        patch.connect(rand, 0, threshold, 0)
        patch.connect(threshold, 0, bang, 0)
        patch.connect(bang, 0, target, 0)

    add_throw_pair(patch, x + 404, y + 98, player, dry_gain, fx_gain)


def add_phonk_samples(
    patch: Patch,
    starts: list[tuple[str, int]],
    x: int,
    y: int,
) -> None:
    patch.comment(x, y, "KUSA NAGI phonk one-shots: groove is restrained so the jazz changes remain clear")
    add_sample_voice(
        patch,
        x,
        y + 40,
        "Kick sample: boom-bap/phonk pocket",
        "j2_kick",
        "j2_step16",
        [0, 6, 10, 15],
        0.54,
        0,
    )
    add_sample_voice(
        patch,
        x + 620,
        y + 40,
        "808 sample transient: layered under the synth bass",
        "j2_808",
        "j2_step16",
        [0, 8],
        0.10,
        0,
    )
    add_sample_voice(
        patch,
        x + 1240,
        y + 40,
        "Snare sample: backbeat",
        "j2_snare",
        "j2_step16",
        [4, 12],
        0.35,
        0.04,
    )
    add_sample_voice(
        patch,
        x,
        y + 220,
        "Clap sample: slight slap after snare",
        "j2_clap",
        "j2_step16",
        [4, 12],
        0.22,
        0.06,
        delay_ms=16,
    )
    add_sample_voice(
        patch,
        x + 620,
        y + 220,
        "Closed hat sample: light 8th grid with small skips",
        "j2_hat",
        "j2_step16",
        [0, 2, 4, 6, 8, 10, 12, 14],
        0.14,
        0.015,
        random_chance=92,
    )
    add_sample_voice(
        patch,
        x + 1240,
        y + 220,
        "Open hat sample: phrase lift",
        "j2_open_hat",
        "j2_step16",
        [14],
        0.16,
        0.07,
    )
    add_sample_voice(
        patch,
        x,
        y + 400,
        "Cowbell sample A: phonk color, quiet and syncopated",
        "j2_cowbell_a",
        "j2_step16",
        [3, 11, 15],
        0.10,
        0.08,
        random_chance=64,
    )
    add_sample_voice(
        patch,
        x + 620,
        y + 400,
        "Cowbell sample B: alternate answer",
        "j2_cowbell_b",
        "j2_step16",
        [7],
        0.075,
        0.08,
        random_chance=50,
    )
    add_sample_voice(
        patch,
        x + 1240,
        y + 400,
        "Chime sample: section punctuation",
        "j2_chime",
        "j2_step16",
        [1, 13],
        0.055,
        0.13,
        random_chance=38,
    )

    section_steps = [step for _section, step in starts]
    add_sample_voice(
        patch,
        x,
        y + 580,
        "Crash sample: section boundaries",
        "j2_crash",
        "j2_step_global",
        section_steps,
        0.16,
        0.12,
    )


def add_fx_and_master(patch: Patch, x: int, y: int) -> None:
    patch.comment(x, y, "Delay return: feed-forward only, no feedback loop")
    fx_catch = patch.obj(x, y + 30, "catch~ j2_fx")
    delay_write = patch.obj(x, y + 64, "delwrite~ j2_delay 1000")
    delay_read_a = patch.obj(x + 252, y + 30, "delread~ j2_delay 312")
    delay_gain_a = patch.obj(x + 252, y + 64, "*~ 0.22")
    delay_read_b = patch.obj(x + 252, y + 100, "delread~ j2_delay 625")
    delay_gain_b = patch.obj(x + 252, y + 134, "*~ 0.12")
    delay_sum = patch.obj(x + 382, y + 100, "+~")
    delay_throw = patch.obj(x + 486, y + 100, "throw~ j2_mix")
    patch.connect(fx_catch, 0, delay_write, 0)
    patch.connect(delay_read_a, 0, delay_gain_a, 0)
    patch.connect(delay_read_b, 0, delay_gain_b, 0)
    patch.connect(delay_gain_a, 0, delay_sum, 0)
    patch.connect(delay_gain_b, 0, delay_sum, 1)
    patch.connect(delay_sum, 0, delay_throw, 0)

    patch.comment(x + 720, y, "Master: bus catch, cleanup, clip, safe attenuation, stereo dac")
    mix_catch = patch.obj(x + 720, y + 30, "catch~ j2_mix")
    hip = patch.obj(x + 720, y + 64, "hip~ 28")
    clip = patch.obj(x + 820, y + 64, "clip~ -0.9 0.9")
    gain = patch.obj(x + 936, y + 64, "*~ 0.14")
    dac = patch.obj(x + 1040, y + 64, "dac~")
    patch.connect(mix_catch, 0, hip, 0)
    patch.connect(hip, 0, clip, 0)
    patch.connect(clip, 0, gain, 0)
    patch.connect(gain, 0, dac, 0)
    patch.connect(gain, 0, dac, 1)


def build() -> None:
    ensure_pd_ready_links()
    events, starts = expanded_form()
    total_steps = sum(int(event["duration"]) for event in events)

    p = Patch(x=20, y=20, width=2420, height=3840, font_size=12)
    p.comment(28, 20, "Just The Two Of Us phonk-jazz progression test - Pd Vanilla")
    p.comment(
        28,
        42,
        f"{BPM} BPM, full chart sequence, extended jazz voicings, KUSA NAGI phonk samples.",
    )

    loadbang = add_transport(p, total_steps)
    add_display(p, 780, 78)
    add_sample_loader(p, loadbang, 1260, 78)
    add_sample_chord_pad(p, 30, 430)
    add_sub_bass(p, 1030, 430)
    add_guide_tone_arp(p, 30, 1040)
    add_phonk_samples(p, starts, 30, 1580)
    add_fx_and_master(p, 30, 2440)
    add_chord_scheduler(p, events, starts, 30, 2720)

    p.save(OUT)


if __name__ == "__main__":
    build()
