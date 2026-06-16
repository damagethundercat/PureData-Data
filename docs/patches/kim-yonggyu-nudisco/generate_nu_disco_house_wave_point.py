#!/usr/bin/env python3
from __future__ import annotations

import shutil
import sys
from pathlib import Path

SKILL_DIR = Path("/Users/ikidk/.codex/skills/puredata-skills")
sys.path.insert(0, str(SKILL_DIR / "scripts"))

from pd_patch_builder import Patch  # noqa: E402


OUT = Path(__file__).with_name("nu_disco_house_wave_point.pd")
READY_DIR = Path("samples/wave_point_house_pd_ready")
SOURCE_ROOT = Path("samples/Wave Point - Sample Packs/Wave Point - House Essentials Vol. 1")

RAW_SAMPLES = {
    "kick": (
        "nd_kick",
        "kick_909_1.wav",
        SOURCE_ROOT / "DRUMS/DRUMS - ONE SHOTS/KICK/WavePoint-Kick909-1.wav",
    ),
    "kick_punch": (
        "nd_kick_punch",
        "kick_punchy.wav",
        SOURCE_ROOT / "DRUMS/DRUMS - ONE SHOTS/KICK/WavePoint-KickPunchy.wav",
    ),
    "clap": (
        "nd_clap",
        "clap_3.wav",
        SOURCE_ROOT / "DRUMS/DRUMS - ONE SHOTS/CLAP-SNARE/WavePoint-Clap3.wav",
    ),
    "snare": (
        "nd_snare",
        "snare_machine_2.wav",
        SOURCE_ROOT / "DRUMS/DRUMS - ONE SHOTS/CLAP-SNARE/WavePoint-SnareMachine2.wav",
    ),
    "closed_hat": (
        "nd_closed_hat",
        "closed_hat_tight.wav",
        SOURCE_ROOT / "DRUMS/DRUMS - ONE SHOTS/HAT/WavePoint-TightClosedHat.wav",
    ),
    "open_hat": (
        "nd_open_hat",
        "open_hat_live_2.wav",
        SOURCE_ROOT / "DRUMS/DRUMS - ONE SHOTS/HAT/WavePoint-OpenHatLive2.wav",
    ),
    "shaker": (
        "nd_shaker",
        "shaker_2.wav",
        SOURCE_ROOT / "DRUMS/DRUMS - ONE SHOTS/SHAKER-TAMBOURINE/WavePoint-Shaker2.wav",
    ),
    "crash": (
        "nd_crash",
        "crash_909.wav",
        SOURCE_ROOT / "DRUMS/DRUMS - ONE SHOTS/CYMBAL/WavePoint-Crash909.wav",
    ),
    "top_loop": (
        "nd_top_loop",
        "top_loop_01_123.wav",
        SOURCE_ROOT / "DRUMS/DRUMS - LOOPS/TOP DRUMS/WavePoint-TopLoop1-123bpm.wav",
    ),
    "top_loop_alt": (
        "nd_top_loop_alt",
        "top_loop_16_123.wav",
        SOURCE_ROOT / "DRUMS/DRUMS - LOOPS/TOP DRUMS/WavePoint-TopLoop16-123bpm.wav",
    ),
    "shaker_loop": (
        "nd_shaker_loop",
        "shaker_loop_02_123.wav",
        SOURCE_ROOT / "DRUMS/DRUMS - LOOPS/PERCUSSION/WavePoint-ShakerLoop2-123bpm.wav",
    ),
    "conga_loop": (
        "nd_conga_loop",
        "conga_loop_05_123.wav",
        SOURCE_ROOT / "DRUMS/DRUMS - LOOPS/PERCUSSION/WavePoint-CongaLoop5-123bpm.wav",
    ),
    "snare_build": (
        "nd_snare_build",
        "snare_build_03_123.wav",
        SOURCE_ROOT / "DRUMS/DRUMS - LOOPS/FILLS/WavePoint-SnareBuildUp3-123bpm.wav",
    ),
    "chord_cmaj7": (
        "nd_chord_cmaj7",
        "chord_cmaj7.wav",
        SOURCE_ROOT / "MUSIC/CHORD ONE SHOTS/WavePoint-Cmaj7-Chord.wav",
    ),
    "chord_amin7": (
        "nd_chord_amin7",
        "chord_amin7.wav",
        SOURCE_ROOT / "MUSIC/CHORD ONE SHOTS/WavePoint-Amin7-Chord.wav",
    ),
    "chord_fmaj7": (
        "nd_chord_fmaj7",
        "chord_fmaj7.wav",
        SOURCE_ROOT / "MUSIC/CHORD ONE SHOTS/WavePoint-Fmaj7-Chord.wav",
    ),
    "chord_dmin7": (
        "nd_chord_dmin7",
        "chord_dmin7.wav",
        SOURCE_ROOT / "MUSIC/CHORD ONE SHOTS/WavePoint-Dmin7-Chord.wav",
    ),
    "bass_hit_short": (
        "nd_bass_hit_short",
        "bass_hit_10_c.wav",
        SOURCE_ROOT / "MUSIC/BASS ONE SHOTS/WavePoint-C-BassHit10.wav",
    ),
    "bass_hit_round": (
        "nd_bass_hit_round",
        "bass_hit_01_c.wav",
        SOURCE_ROOT / "MUSIC/BASS ONE SHOTS/WavePoint-C-BassHit1.wav",
    ),
    "bass_hit_deep": (
        "nd_bass_hit_deep",
        "bass_hit_05_c.wav",
        SOURCE_ROOT / "MUSIC/BASS ONE SHOTS/WavePoint-C-BassHit5.wav",
    ),
    "vocal_1": (
        "nd_vocal_1",
        "vocal_chop_01_c.wav",
        SOURCE_ROOT / "VOCALS/VOCAL SHORT PITCHED/WavePoint-C-VocalChop1.wav",
    ),
    "vocal_6": (
        "nd_vocal_6",
        "vocal_chop_06_c.wav",
        SOURCE_ROOT / "VOCALS/VOCAL SHORT PITCHED/WavePoint-C-VocalChop6.wav",
    ),
    "vocal_11": (
        "nd_vocal_11",
        "vocal_chop_11_c.wav",
        SOURCE_ROOT / "VOCALS/VOCAL SHORT PITCHED/WavePoint-C-VocalChop11.wav",
    ),
    "vocal_3": (
        "nd_vocal_3",
        "vocal_chop_03_c.wav",
        SOURCE_ROOT / "VOCALS/VOCAL SHORT PITCHED/WavePoint-C-VocalChop3.wav",
    ),
    "vocal_8": (
        "nd_vocal_8",
        "vocal_chop_08_c.wav",
        SOURCE_ROOT / "VOCALS/VOCAL SHORT PITCHED/WavePoint-C-VocalChop8.wav",
    ),
    "vox_stab_1": (
        "nd_vox_stab_1",
        "vox_chop_stab_01.wav",
        SOURCE_ROOT / "VOCALS/VOCAL SHORT/WavePoint-VoxChopStab1.wav",
    ),
    "vox_chop_14": (
        "nd_vox_chop_14",
        "vox_chop_14.wav",
        SOURCE_ROOT / "VOCALS/VOCAL SHORT/WavePoint-VoxChop14.wav",
    ),
    "vocal_uh_2": (
        "nd_vocal_uh_2",
        "vocal_uh_02.wav",
        SOURCE_ROOT / "VOCALS/VOCAL SHORT/WavePoint-Vocal-Uh2.wav",
    ),
    "pad_amin9": (
        "nd_pad_amin9",
        "pad_amin9_01.wav",
        SOURCE_ROOT / "MUSIC/PAD ONE SHOTS/ WavePoint-Amin9-Pad1.wav",
    ),
    "perc_cowbell": (
        "nd_perc_cowbell",
        "perc_cowbell_top.wav",
        SOURCE_ROOT / "DRUMS/DRUMS - ONE SHOTS/PERC/WavePoint-CowbellTop.wav",
    ),
    "perc_clave": (
        "nd_perc_clave",
        "perc_clave.wav",
        SOURCE_ROOT / "DRUMS/DRUMS - ONE SHOTS/PERC/WavePoint-Clave.wav",
    ),
    "perc_rim": (
        "nd_perc_rim",
        "perc_rim_2.wav",
        SOURCE_ROOT / "DRUMS/DRUMS - ONE SHOTS/PERC/WavePoint-Rim2.wav",
    ),
    "perc_wood": (
        "nd_perc_wood",
        "perc_woodblock_1.wav",
        SOURCE_ROOT / "DRUMS/DRUMS - ONE SHOTS/PERC/WavePoint-WoodBlock1.wav",
    ),
    "vinyl_loop": (
        "nd_vinyl_loop",
        "foley_vinyl_crackle_loop.wav",
        SOURCE_ROOT / "FX & FOLEY/FOLEY/FOLEY LOOPS/WavePoint-VinylCrackle-Loop.wav",
    ),
    "riser": (
        "nd_riser",
        "riser.wav",
        SOURCE_ROOT / "FX & FOLEY/FX LONG/WavePoint-Riser.wav",
    ),
    "downer": (
        "nd_downer",
        "downer_1.wav",
        SOURCE_ROOT / "FX & FOLEY/FX LONG/WavePoint-Downer1.wav",
    ),
    "pshew": (
        "nd_pshew",
        "pshew.wav",
        SOURCE_ROOT / "FX & FOLEY/FX SHORT/WavePoint-Pshew.wav",
    ),
}


SAMPLES = {
    key: (array_name, str(READY_DIR / dest_name))
    for key, (array_name, dest_name, _source) in RAW_SAMPLES.items()
}

STEM_SLIDERS = [
    ("kick", "kick", 1.0),
    ("kick_punch", "kick_punch", 1.0),
    ("clap", "clap", 1.0),
    ("snare", "snare", 1.0),
    ("closed_hat", "closed_hat", 1.0),
    ("open_hat", "open_hat", 1.0),
    ("shaker", "shaker", 1.0),
    ("crash", "crash", 1.0),
    ("top_loop_1", "top_loop_1", 1.0),
    ("top_loop_16", "top_loop_16", 1.0),
    ("shaker_loop", "shaker_loop", 1.0),
    ("conga_loop", "conga_loop", 1.0),
    ("chord_cmaj7", "chord_cmaj7", 1.0),
    ("chord_amin7", "chord_amin7", 1.0),
    ("chord_fmaj7", "chord_fmaj7", 1.0),
    ("chord_dmin7", "chord_dmin7", 1.0),
    ("vocal_1", "vocal_1", 1.0),
    ("vocal_6", "vocal_6", 1.0),
    ("vocal_11", "vocal_11", 1.0),
    ("bass", "bass", 1.0),
    ("lead", "lead", 1.0),
    ("vox_chop_14", "vox_chop_14", 1.0),
    ("vocal_uh", "vocal_uh", 1.0),
    ("pad_amin9", "pad_amin9", 1.0),
    ("cowbell", "cowbell", 1.0),
    ("clave", "clave", 1.0),
    ("rim", "rim", 1.0),
    ("woodblock", "woodblock", 1.0),
    ("vinyl", "vinyl", 1.0),
    ("riser", "riser", 1.0),
    ("downer", "downer", 1.0),
    ("snare_build", "snare_build", 1.0),
    ("pshew", "pshew", 1.0),
    ("delay", "delay_return", 1.0),
]


def ensure_sample_copies() -> None:
    READY_DIR.mkdir(parents=True, exist_ok=True)
    for _key, (_array_name, dest_name, source) in RAW_SAMPLES.items():
        if not source.exists():
            raise FileNotFoundError(source)
        shutil.copy2(source, READY_DIR / dest_name)


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
    stem: str,
) -> None:
    dry = patch.obj(x, y, f"*~ {dry_gain}")
    dry_throw = patch.obj(x + 96, y, f"throw~ nd_stem_{stem}")
    patch.connect(signal_node, 0, dry, 0)
    patch.connect(dry, 0, dry_throw, 0)
    if fx_gain > 0:
        wet = patch.obj(x, y + 34, f"*~ {fx_gain}")
        wet_throw = patch.obj(x + 96, y + 34, f"throw~ nd_stemfx_{stem}")
        patch.connect(signal_node, 0, wet, 0)
        patch.connect(wet, 0, wet_throw, 0)


def add_sample_loader(patch: Patch, loadbang, x: int, y: int) -> None:
    patch.comment(x, y, "Wave Point sample loader: copied to flat pd_ready names for stable Pd paths")
    soundfiler = patch.obj(x + 512, y + 28, "soundfiler")
    for idx, (key, (array_name, rel_path)) in enumerate(SAMPLES.items()):
        yy = y + 28 + idx * 25
        msg = patch.msg(x, yy, f"read -resize {rel_path} {array_name}")
        patch.obj(x + 666, yy, f"table {array_name} 44100")
        patch.connect(loadbang, 0, msg, 0)
        patch.connect(msg, 0, soundfiler, 0)
        patch.comment(x + 910, yy, key)


def add_sample_voice(
    patch: Patch,
    x: int,
    y: int,
    label: str,
    array_name: str,
    steps: list[int],
    dry_gain: float,
    fx_gain: float,
    stem: str,
    *,
    delay_ms: int | None = None,
    random_chance: int | None = None,
) -> None:
    patch.comment(x, y, label)
    step = patch.obj(x, y + 28, "r nd_step")
    selector = patch.obj(x, y + 60, "sel " + " ".join(str(step_no) for step_no in steps))
    player = patch.obj(x + 282, y + 94, f"tabplay~ {array_name}")
    patch.connect(step, 0, selector, 0)

    target = player
    if delay_ms is not None:
        delay = patch.obj(x + 282, y + 60, f"delay {delay_ms}")
        target = delay
        patch.connect(delay, 0, player, 0)

    if random_chance is None:
        connect_all(patch, selector, target, len(steps))
    else:
        rand = patch.obj(x + 168, y + 94, "random 100")
        threshold = patch.obj(x + 168, y + 126, f"moses {random_chance}")
        bang = patch.obj(x + 282, y + 126, "t b")
        connect_all(patch, selector, rand, len(steps))
        patch.connect(rand, 0, threshold, 0)
        patch.connect(threshold, 0, bang, 0)
        patch.connect(bang, 0, target, 0)

    add_throw_pair(patch, x + 404, y + 94, player, dry_gain, fx_gain, stem)


def add_gated_sample_voice(
    patch: Patch,
    x: int,
    y: int,
    label: str,
    array_name: str,
    steps: list[int],
    dry_gain: float,
    fx_gain: float,
    stem: str,
    env_text: str,
) -> None:
    patch.comment(x, y, label)
    step = patch.obj(x, y + 28, "r nd_step")
    selector = patch.obj(x, y + 60, "sel " + " ".join(str(step_no) for step_no in steps))
    player = patch.obj(x + 282, y + 94, f"tabplay~ {array_name}")
    env_msg = patch.msg(x + 282, y + 60, env_text)
    env = patch.obj(x + 404, y + 60, "vline~")
    amp = patch.obj(x + 404, y + 94, "*~")
    patch.connect(step, 0, selector, 0)
    connect_all(patch, selector, player, len(steps))
    connect_all(patch, selector, env_msg, len(steps))
    patch.connect(env_msg, 0, env, 0)
    patch.connect(player, 0, amp, 0)
    patch.connect(env, 0, amp, 1)
    add_throw_pair(patch, x + 500, y + 94, amp, dry_gain, fx_gain, stem)


def add_bass_voice(patch: Patch, x: int, y: int, events: list[tuple[int, int]]) -> None:
    patch.comment(x, y, "Synth bass: grid-locked C/A/F/D disco pattern, no loose bass-hit tail")
    step = patch.obj(x, y + 28, "r nd_step")
    selector = patch.obj(x, y + 60, "sel " + " ".join(str(step_no) for step_no, _note in events))
    patch.connect(step, 0, selector, 0)

    mtof = patch.obj(x + 380, y + 60, "mtof")
    pack = patch.obj(x + 380, y + 94, "pack f 18")
    line = patch.obj(x + 380, y + 128, "line~")
    saw = patch.obj(x + 380, y + 162, "phasor~")
    saw_center = patch.obj(x + 380, y + 196, "-~ 0.5")
    saw_tone = patch.obj(x + 380, y + 230, "lop~ 820")
    sub = patch.obj(x + 484, y + 162, "osc~")
    sub_gain = patch.obj(x + 484, y + 196, "*~ 0.35")
    bass_sum = patch.obj(x + 432, y + 268, "+~")
    env_msg = patch.msg(x + 610, y + 60, "0.9 4, 0.62 95 6, 0 170 112")
    env = patch.obj(x + 610, y + 94, "vline~")
    amp = patch.obj(x + 520, y + 306, "*~")
    low = patch.obj(x + 610, y + 306, "lop~ 540")

    for idx, (_step_no, note) in enumerate(events):
        note_msg = patch.msg(x + (idx % 8) * 42, y + 104 + (idx // 8) * 30, str(note))
        patch.connect(selector, idx, note_msg, 0)
        patch.connect(note_msg, 0, mtof, 0)
        patch.connect(selector, idx, env_msg, 0)

    patch.connect(mtof, 0, pack, 0)
    patch.connect(pack, 0, line, 0)
    patch.connect(line, 0, saw, 0)
    patch.connect(line, 0, sub, 0)
    patch.connect(saw, 0, saw_center, 0)
    patch.connect(saw_center, 0, saw_tone, 0)
    patch.connect(sub, 0, sub_gain, 0)
    patch.connect(saw_tone, 0, bass_sum, 0)
    patch.connect(sub_gain, 0, bass_sum, 1)
    patch.connect(env_msg, 0, env, 0)
    patch.connect(bass_sum, 0, amp, 0)
    patch.connect(env, 0, amp, 1)
    patch.connect(amp, 0, low, 0)
    add_throw_pair(patch, x + 700, y + 306, low, 0.36, 0, "bass")


def add_lead_voice(patch: Patch, x: int, y: int, events: list[tuple[int, int]]) -> None:
    patch.comment(x, y, "Bright hook synth: appears in build and final hook only")
    step = patch.obj(x, y + 28, "r nd_step")
    selector = patch.obj(x, y + 60, "sel " + " ".join(str(step_no) for step_no, _note in events))
    patch.connect(step, 0, selector, 0)

    mtof = patch.obj(x + 356, y + 60, "mtof")
    pack = patch.obj(x + 356, y + 94, "pack f 10")
    line = patch.obj(x + 356, y + 128, "line~")
    osc = patch.obj(x + 356, y + 162, "phasor~")
    center = patch.obj(x + 356, y + 196, "-~ 0.5")
    high = patch.obj(x + 356, y + 230, "hip~ 360")
    tone = patch.obj(x + 356, y + 264, "lop~ 4200")
    env_msg = patch.msg(x + 542, y + 60, "0.48 6, 0.36 80 8, 0 170 130")
    env = patch.obj(x + 542, y + 94, "vline~")
    amp = patch.obj(x + 448, y + 302, "*~")

    for idx, (_step_no, note) in enumerate(events):
        note_msg = patch.msg(x + (idx % 7) * 42, y + 104 + (idx // 7) * 30, str(note))
        patch.connect(selector, idx, note_msg, 0)
        patch.connect(note_msg, 0, mtof, 0)
        patch.connect(selector, idx, env_msg, 0)

    patch.connect(mtof, 0, pack, 0)
    patch.connect(pack, 0, line, 0)
    patch.connect(line, 0, osc, 0)
    patch.connect(osc, 0, center, 0)
    patch.connect(center, 0, high, 0)
    patch.connect(high, 0, tone, 0)
    patch.connect(env_msg, 0, env, 0)
    patch.connect(tone, 0, amp, 0)
    patch.connect(env, 0, amp, 1)
    add_throw_pair(patch, x + 538, y + 302, amp, 0.11, 0.16, "lead")


def add_section_display(patch: Patch, x: int, y: int) -> None:
    patch.comment(x, y, "Section display")
    step = patch.obj(x, y + 28, "r nd_step")
    section_sel = patch.obj(x, y + 60, "sel 0 32 64 96")
    send = patch.obj(x + 214, y + 116, "s nd_section")
    labels = [
        patch.msg(x, y + 96, "symbol intro"),
        patch.msg(x + 74, y + 96, "symbol groove"),
        patch.msg(x + 156, y + 96, "symbol build"),
        patch.msg(x + 230, y + 96, "symbol final_hook"),
    ]
    section_atom = patch.symbolatom(x, y + 146, width=16, label="section", receive="nd_section", send="-")
    step_atom = patch.floatatom(x, y + 176, width=5, label="step", receive="nd_step_view", send="-")
    patch.connect(step, 0, section_sel, 0)
    for idx, label in enumerate(labels):
        patch.connect(section_sel, idx, label, 0)
        patch.connect(label, 0, send, 0)
    patch.comment(x + 154, y + 146, "Current form section")
    patch.comment(x + 82, y + 176, "0-127 step position")
    _ = section_atom
    _ = step_atom


def add_stem_mixer(patch: Patch, loadbang, x: int, y: int) -> None:
    patch.comment(x, y, "Stem mixer: sliders set each source volume from mute to 150 percent")
    for idx, (stem, label, default) in enumerate(STEM_SLIDERS):
        col = idx // 12
        row = idx % 12
        xx = x + col * 720
        yy = y + 32 + row * 100

        patch.comment(xx, yy, label)
        patch.obj(
            xx,
            yy + 22,
            f"hsl 128 15 0 1.5 0 0 nd_vol_{stem} nd_vol_{stem}_set {label} "
            "4 8 0 10 #fcfcfc #000000 #000000 0 1",
        )
        default_msg = patch.msg(xx + 150, yy + 20, str(default))
        send_set = patch.obj(xx + 204, yy + 20, f"s nd_vol_{stem}_set")
        send_control = patch.obj(xx + 204, yy + 48, f"s nd_vol_{stem}")
        patch.connect(loadbang, 0, default_msg, 0)
        patch.connect(default_msg, 0, send_set, 0)
        patch.connect(default_msg, 0, send_control, 0)

        receive_control = patch.obj(xx + 330, yy + 20, f"r nd_vol_{stem}")
        pack = patch.obj(xx + 450, yy + 20, "pack f 35")
        line = patch.obj(xx + 540, yy + 20, "line~")
        dry_catch = patch.obj(xx + 330, yy + 48, f"catch~ nd_stem_{stem}")
        dry_amp = patch.obj(xx + 450, yy + 48, "*~")
        dry_throw = patch.obj(xx + 540, yy + 48, "throw~ nd_mix")
        wet_catch = patch.obj(xx + 330, yy + 74, f"catch~ nd_stemfx_{stem}")
        wet_amp = patch.obj(xx + 450, yy + 74, "*~")
        wet_throw = patch.obj(xx + 540, yy + 74, "throw~ nd_fx")

        patch.connect(receive_control, 0, pack, 0)
        patch.connect(pack, 0, line, 0)
        patch.connect(dry_catch, 0, dry_amp, 0)
        patch.connect(line, 0, dry_amp, 1)
        patch.connect(dry_amp, 0, dry_throw, 0)
        patch.connect(wet_catch, 0, wet_amp, 0)
        patch.connect(line, 0, wet_amp, 1)
        patch.connect(wet_amp, 0, wet_throw, 0)


def add_master_and_fx(patch: Patch, x: int, y: int):
    patch.comment(x, y, "Delay return: feed-forward only, no feedback loop")
    fx_catch = patch.obj(x, y + 28, "catch~ nd_fx")
    delay_write = patch.obj(x, y + 62, "delwrite~ nd_delay 920")
    delay_read = patch.obj(x + 230, y + 28, "delread~ nd_delay 243.902")
    delay_gain = patch.obj(x + 230, y + 62, "*~ 0.20")
    delay_throw = patch.obj(x + 330, y + 62, "throw~ nd_stem_delay")
    patch.connect(fx_catch, 0, delay_write, 0)
    patch.connect(delay_read, 0, delay_gain, 0)
    patch.connect(delay_gain, 0, delay_throw, 0)

    patch.comment(x + 602, y, "Master: direct gain is kept present but not overly reduced")
    mix_catch = patch.obj(x + 602, y + 28, "catch~ nd_mix")
    master_hip = patch.obj(x + 602, y + 62, "hip~ 24")
    master_clip = patch.obj(x + 700, y + 62, "clip~ -0.98 0.98")
    master_gain = patch.obj(x + 830, y + 62, "*~ 0.42")
    dac = patch.obj(x + 930, y + 62, "dac~")
    patch.connect(mix_catch, 0, master_hip, 0)
    patch.connect(master_hip, 0, master_clip, 0)
    patch.connect(master_clip, 0, master_gain, 0)
    patch.connect(master_gain, 0, dac, 0)
    patch.connect(master_gain, 0, dac, 1)
    return master_gain


def add_visualizer(patch: Patch, loadbang, master_signal, x: int, y: int) -> None:
    patch.comment(x, y, "Visualizer: waveform scope writes into the graph below")
    scope_tick = patch.obj(x, y + 30, "metro 45")
    scope_start = patch.msg(x + 96, y + 30, "1")
    scope_writer = patch.obj(x, y + 64, "tabwrite~ nd_scope")
    patch.connect(loadbang, 0, scope_start, 0)
    patch.connect(scope_start, 0, scope_tick, 0)
    patch.connect(scope_tick, 0, scope_writer, 0)
    patch.connect(master_signal, 0, scope_writer, 0)


def add_scope_graph(pd_text: str) -> str:
    zeros = " ".join("0" for _ in range(512))
    graph_lines = [
        "#N canvas 0 22 450 278 12;",
        "#X array nd_scope 512 float 3;",
        f"#A 0 {zeros};",
        "#X coords 0 1 511 -1 320 110 1 0 0;",
        "#X restore 1510 184 graph;",
    ]
    lines = pd_text.splitlines()
    try:
        insert_at = next(idx for idx, line in enumerate(lines) if line.startswith("#X connect"))
    except StopIteration:
        insert_at = len(lines)
    return "\n".join(lines[:insert_at] + graph_lines + lines[insert_at:]) + "\n"


def build() -> None:
    ensure_sample_copies()

    p = Patch(x=20, y=20, width=2260, height=4080, font_size=12)
    p.comment(28, 20, "Nu-disco / house sequence - Wave Point sample pack - Pd Vanilla")
    p.comment(28, 42, "123 BPM, 128-step arrangement: intro, groove, breakdown/build, final hook")
    p.comment(28, 62, "Wave Point samples drive drums, loops, chords, vocal chops, FX; synth bass/lead add sequence motion")
    p.comment(28, 82, "Stem mixer with per-source sliders is below the master section")

    p.comment(30, 102, "Transport: loadbang turns on DSP and starts. Click 0 to stop, 1 to restart, reset to bar 1.")
    loadbang = p.obj(30, 130, "loadbang")
    dsp_on = p.msg(30, 162, "; pd dsp 1")
    start = p.msg(138, 162, "1")
    stop = p.msg(194, 162, "0")
    reset = p.msg(250, 162, "0")
    metro = p.obj(138, 198, "metro 121.951")
    counter = p.obj(138, 234, "f 0")
    increment = p.obj(198, 234, "+ 1")
    wrap = p.obj(258, 234, "mod 128")
    step_send = p.obj(138, 270, "s nd_step")
    step_view = p.obj(250, 270, "s nd_step_view")
    p.connect(loadbang, 0, dsp_on, 0)
    p.connect(loadbang, 0, reset, 0)
    p.connect(loadbang, 0, start, 0)
    p.connect(start, 0, metro, 0)
    p.connect(stop, 0, metro, 0)
    p.connect(reset, 0, counter, 1)
    p.connect(metro, 0, counter, 0)
    p.connect(counter, 0, step_send, 0)
    p.connect(counter, 0, step_view, 0)
    p.connect(counter, 0, increment, 0)
    p.connect(increment, 0, wrap, 0)
    p.connect(wrap, 0, counter, 1)

    add_section_display(p, 30, 326)
    add_sample_loader(p, loadbang, 520, 92)

    kick_steps = [0, 8, 16, 24] + list(range(32, 64, 4)) + [80, 84, 88, 92] + list(range(96, 128, 4))
    kick_punch_steps = [32, 48, 96, 112]
    clap_steps = [28, 36, 44, 52, 60, 92, 100, 108, 116, 124]
    snare_steps = [31, 47, 63, 79, 95, 111, 127]
    closed_hat_steps = [34, 38, 42, 46, 50, 54, 58, 62, 82, 86, 90, 94, 98, 102, 106, 110, 114, 118, 122, 126]
    open_hat_steps = [18, 26, 34, 42, 50, 58, 90, 98, 106, 114, 122]
    shaker_steps = [35, 43, 51, 59, 83, 91, 99, 107, 115, 123]

    add_sample_voice(p, 30, 680, "Kick sample: four-on-floor expands after the intro", SAMPLES["kick"][0], kick_steps, 0.80, 0, "kick")
    add_sample_voice(p, 560, 680, "Punch kick layer: only at section downbeats", SAMPLES["kick_punch"][0], kick_punch_steps, 0.32, 0, "kick_punch")
    add_sample_voice(p, 1090, 680, "Clap sample: house backbeat with intro pickup", SAMPLES["clap"][0], clap_steps, 0.52, 0.04, "clap")
    add_sample_voice(p, 1620, 680, "Snare machine: end-of-phrase fills", SAMPLES["snare"][0], snare_steps, 0.34, 0.04, "snare")

    add_sample_voice(p, 30, 850, "Closed hat sample: offbeat drive with small skips", SAMPLES["closed_hat"][0], closed_hat_steps, 0.18, 0.02, "closed_hat", random_chance=92)
    add_sample_voice(p, 560, 850, "Open hat sample: disco lift on selected offbeats", SAMPLES["open_hat"][0], open_hat_steps, 0.23, 0.05, "open_hat")
    add_sample_voice(p, 1090, 850, "Shaker one-shot: late bar sparkle", SAMPLES["shaker"][0], shaker_steps, 0.16, 0.03, "shaker", random_chance=86)
    add_sample_voice(p, 1620, 850, "Crash sample: section arrivals", SAMPLES["crash"][0], [32, 96], 0.26, 0.08, "crash")

    add_sample_voice(p, 30, 1020, "Top drum loop 1: intro and first groove bed", SAMPLES["top_loop"][0], [0, 32], 0.25, 0.02, "top_loop_1")
    add_sample_voice(p, 560, 1020, "Top drum loop 16: four-bar build-to-final layer", SAMPLES["top_loop_alt"][0], [64], 0.22, 0.01, "top_loop_16")
    add_sample_voice(p, 1090, 1020, "Shaker loop: build and final movement", SAMPLES["shaker_loop"][0], [64, 96], 0.20, 0.03, "shaker_loop")
    add_sample_voice(p, 1620, 1020, "Conga loop: second half answer phrase", SAMPLES["conga_loop"][0], [48, 96], 0.18, 0.03, "conga_loop")

    add_sample_voice(p, 30, 1190, "Cmaj7 sampled chord: I color", SAMPLES["chord_cmaj7"][0], [0, 64], 0.30, 0.06, "chord_cmaj7")
    add_sample_voice(p, 560, 1190, "Amin7 sampled chord: vi answer", SAMPLES["chord_amin7"][0], [16, 80], 0.28, 0.06, "chord_amin7")
    add_sample_voice(p, 1090, 1190, "Fmaj7 sampled chord: IV lift", SAMPLES["chord_fmaj7"][0], [32, 96], 0.30, 0.07, "chord_fmaj7")
    add_sample_voice(p, 1620, 1190, "Dmin7 sampled chord: ii turnaround", SAMPLES["chord_dmin7"][0], [48, 112], 0.26, 0.07, "chord_dmin7")

    add_sample_voice(p, 560, 1360, "Vocal chop 1: call phrase", SAMPLES["vocal_1"][0], [40, 56, 104, 120], 0.18, 0.08, "vocal_1")
    add_sample_voice(p, 1090, 1360, "Vocal chop 6: response phrase", SAMPLES["vocal_6"][0], [46, 62, 110, 126], 0.16, 0.08, "vocal_6")
    add_sample_voice(p, 1620, 1360, "Vocal chop 11: build hook pickup", SAMPLES["vocal_11"][0], [76, 84, 92, 116, 124], 0.15, 0.08, "vocal_11")

    add_gated_sample_voice(
        p,
        30,
        1518,
        "Sample bass short: Wave Point C bass hit, clipped to the house offbeat grid",
        SAMPLES["bass_hit_short"][0],
        [34, 42, 50, 58, 66, 74, 82, 90, 98, 106, 114, 122],
        0.34,
        0,
        "bass",
        "0.95 3, 0.68 55 4, 0 105 118",
    )
    add_gated_sample_voice(
        p,
        560,
        1518,
        "Sample bass round: occasional lower answer, also gated short",
        SAMPLES["bass_hit_round"][0],
        [38, 54, 86, 102, 118],
        0.20,
        0,
        "bass",
        "0.78 4, 0.48 65 6, 0 110 135",
    )
    add_gated_sample_voice(
        p,
        1090,
        1518,
        "Sample bass deep: final-hook weight on phrase pickups",
        SAMPLES["bass_hit_deep"][0],
        [94, 110, 126],
        0.16,
        0.02,
        "bass",
        "0.70 5, 0.46 80 8, 0 130 145",
    )

    add_sample_voice(p, 30, 1712, "Sample lead vocal chop 3: build/final call hook", SAMPLES["vocal_3"][0], [72, 80, 88, 104, 112, 120], 0.18, 0.10, "lead")
    add_sample_voice(p, 560, 1712, "Sample lead vocal chop 8: short answer hook", SAMPLES["vocal_8"][0], [76, 92, 108, 124], 0.16, 0.10, "lead")
    add_sample_voice(p, 1090, 1712, "Sample lead vox stab: phrase marker replacing Pd synth lead", SAMPLES["vox_stab_1"][0], [96, 116], 0.16, 0.12, "lead")

    add_sample_voice(p, 30, 1888, "Extra vox chop 14: richer sampled hook layer", SAMPLES["vox_chop_14"][0], [84, 100, 116, 124], 0.14, 0.08, "vox_chop_14")
    add_sample_voice(p, 560, 1888, "Vocal uh 2: human pickup before phrase turns", SAMPLES["vocal_uh_2"][0], [60, 92, 124], 0.12, 0.07, "vocal_uh")
    add_gated_sample_voice(
        p,
        1090,
        1888,
        "Amin9 pad sample: warm sampled bed through the build and final hook",
        SAMPLES["pad_amin9"][0],
        [64],
        0.07,
        0.10,
        "pad_amin9",
        "0.10 650, 0.08 4200 650, 0 650 6850",
    )

    add_gated_sample_voice(p, 30, 2072, "Cowbell top: disco accent layer", SAMPLES["perc_cowbell"][0], [66, 74, 82, 90, 98, 106, 114, 122], 0.13, 0.03, "cowbell", "0.90 2, 0.34 70 4, 0 90 120")
    add_sample_voice(p, 560, 2072, "Clave: tight syncopated wood accent", SAMPLES["perc_clave"][0], [39, 55, 71, 87, 103, 119], 0.11, 0.03, "clave")
    add_sample_voice(p, 1090, 2072, "Rim: short phrase-end click", SAMPLES["perc_rim"][0], [63, 95, 127], 0.12, 0.04, "rim")
    add_sample_voice(p, 1620, 2072, "Woodblock: extra sampled percussion color", SAMPLES["perc_wood"][0], [47, 79, 111], 0.11, 0.03, "woodblock")

    add_sample_voice(p, 30, 2248, "Vinyl crackle loop: low sampled texture bed", SAMPLES["vinyl_loop"][0], [0, 64], 0.045, 0, "vinyl")
    add_gated_sample_voice(p, 560, 2248, "Riser sample: gated so it supports the build without wrapping loosely", SAMPLES["riser"][0], [64], 0.08, 0.10, "riser", "0.02 800, 0.12 4300 800, 0 350 7300")
    add_gated_sample_voice(p, 1090, 2248, "Downer sample: short final-hook impact tail", SAMPLES["downer"][0], [96], 0.08, 0.07, "downer", "0.12 8, 0.09 760 8, 0 420 1050")

    add_sample_voice(p, 30, 2424, "Snare build sample: four-bar build locked to loop end", SAMPLES["snare_build"][0], [64], 0.18, 0.03, "snare_build")
    add_sample_voice(p, 1620, 2424, "Short pshew FX: phrase punctuation without wraparound echo", SAMPLES["pshew"][0], [31, 63, 95], 0.12, 0.06, "pshew")

    master = add_master_and_fx(p, 30, 2668)
    add_stem_mixer(p, loadbang, 30, 2830)
    add_visualizer(p, loadbang, master, 1510, 92)

    OUT.write_text(add_scope_graph(p.to_pd()), encoding="utf-8")


if __name__ == "__main__":
    build()
