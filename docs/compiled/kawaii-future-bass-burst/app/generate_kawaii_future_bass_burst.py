#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path

SKILL_DIR = Path("/Users/ikidk/.codex/skills/puredata-skills")
sys.path.insert(0, str(SKILL_DIR / "scripts"))

from pd_patch_builder import Patch  # noqa: E402


OUT = Path(__file__).with_name("kawaii_future_bass_burst.pd")

SAMPLES = {
    "kick": ("kfb_kick", "samples/kawaii_future_bass/pd_ready/kick02.wav"),
    "snare": ("kfb_snare", "samples/kawaii_future_bass/pd_ready/snare03.wav"),
    "clap": ("kfb_clap", "samples/kawaii_future_bass/pd_ready/clap02.wav"),
    "hat": ("kfb_hat", "samples/kawaii_future_bass/pd_ready/hat02.wav"),
    "openhat": ("kfb_openhat", "samples/kawaii_future_bass/pd_ready/openhat02.wav"),
    "perc_a": ("kfb_perc_a", "samples/kawaii_future_bass/pd_ready/perc01.wav"),
    "perc_b": ("kfb_perc_b", "samples/kawaii_future_bass/pd_ready/perc03.wav"),
    "crash": ("kfb_crash", "samples/kawaii_future_bass/pd_ready/crash01.wav"),
    "flash": ("kfb_flash", "samples/kawaii_future_bass/pd_ready/sfx_flash.wav"),
    "sweep": ("kfb_sweep", "samples/kawaii_future_bass/pd_ready/sfx_mario_sweep.wav"),
    "cut": ("kfb_cut", "samples/kawaii_future_bass/pd_ready/sfx_cut_track.wav"),
    "konnichiwa": ("kfb_konnichiwa", "samples/kawaii_future_bass/pd_ready/vocal_konnichiwa.wav"),
    "giggle": ("kfb_giggle", "samples/kawaii_future_bass/pd_ready/vocal_giggle.wav"),
    "who": ("kfb_who", "samples/kawaii_future_bass/pd_ready/vocal_who.wav"),
}


def connect_all(patch: Patch, selector, target, outlet_count: int) -> None:
    for outlet in range(outlet_count):
        patch.connect(selector, outlet, target, 0)


def add_throw_pair(patch: Patch, x: int, y: int, signal_node, dry_gain: float, fx_gain: float) -> None:
    dry = patch.obj(x, y, f"*~ {dry_gain}")
    dry_throw = patch.obj(x + 96, y, "throw~ kfb_mix")
    patch.connect(signal_node, 0, dry, 0)
    patch.connect(dry, 0, dry_throw, 0)
    if fx_gain > 0:
        wet = patch.obj(x, y + 34, f"*~ {fx_gain}")
        wet_throw = patch.obj(x + 96, y + 34, "throw~ kfb_fx")
        patch.connect(signal_node, 0, wet, 0)
        patch.connect(wet, 0, wet_throw, 0)


def add_sample_loader(patch: Patch, loadbang, x: int, y: int) -> None:
    patch.comment(x, y, "Sample loader: pd_ready files have safe names and 16-bit mono 44.1 kHz WAV format")
    soundfiler = patch.obj(x + 420, y + 28, "soundfiler")
    for idx, (key, (array_name, rel_path)) in enumerate(SAMPLES.items()):
        yy = y + 28 + idx * 28
        msg = patch.msg(x, yy, f"read -resize {rel_path} {array_name}")
        patch.array_define(x + 552, yy, array_name, 44100)
        patch.connect(loadbang, 0, msg, 0)
        patch.connect(msg, 0, soundfiler, 0)
        patch.comment(x + 780, yy, key)


def add_sample_voice(
    patch: Patch,
    x: int,
    y: int,
    label: str,
    array_name: str,
    steps: list[int],
    dry_gain: float,
    fx_gain: float,
    random_chance: int | None = None,
) -> None:
    patch.comment(x, y, label)
    step = patch.obj(x, y + 28, "r kfb_step")
    selector = patch.obj(x, y + 60, "sel " + " ".join(str(step_no) for step_no in steps))
    player = patch.obj(x + 254, y + 90, f"tabplay~ {array_name}")
    patch.connect(step, 0, selector, 0)
    if random_chance is None:
        connect_all(patch, selector, player, len(steps))
    else:
        rand = patch.obj(x + 254, y + 28, "random 100")
        threshold = patch.obj(x + 254, y + 60, f"moses {random_chance}")
        bang = patch.obj(x + 354, y + 60, "t b")
        connect_all(patch, selector, rand, len(steps))
        patch.connect(rand, 0, threshold, 0)
        patch.connect(threshold, 0, bang, 0)
        patch.connect(bang, 0, player, 0)
    add_throw_pair(patch, x + 384, y + 90, player, dry_gain, fx_gain)


def add_sub_bass(patch: Patch, x: int, y: int) -> None:
    patch.comment(x, y, "Sub bass: F major bounce, clipped low harmonics kept under the sample kick")
    step = patch.obj(x, y + 28, "r kfb_step")
    selector = patch.obj(x, y + 60, "sel 0 4 8 12 16 20 24 28")
    notes = [41, 41, 36, 43, 38, 45, 34, 36]
    mtof = patch.obj(x + 290, y + 60, "mtof")
    pack = patch.obj(x + 290, y + 94, "pack f 18")
    line = patch.obj(x + 290, y + 128, "line~")
    sine = patch.obj(x + 290, y + 162, "osc~")
    saw = patch.obj(x + 386, y + 162, "phasor~")
    saw_low = patch.obj(x + 386, y + 196, "lop~ 210")
    saw_gain = patch.obj(x + 386, y + 230, "*~ 0.16")
    sine_gain = patch.obj(x + 290, y + 230, "*~ 0.84")
    sum_a = patch.obj(x + 340, y + 270, "+~")
    env_msg = patch.msg(x + 522, y + 60, "0.78 5, 0.58 82 8, 0 210 110")
    env = patch.obj(x + 522, y + 94, "vline~")
    amp = patch.obj(x + 430, y + 306, "*~")
    smooth = patch.obj(x + 520, y + 306, "lop~ 240")
    patch.connect(step, 0, selector, 0)
    for idx, note in enumerate(notes):
        note_msg = patch.msg(x + 74 + idx * 36, y + 100, str(note))
        patch.connect(selector, idx, note_msg, 0)
        patch.connect(note_msg, 0, mtof, 0)
        patch.connect(selector, idx, env_msg, 0)
    patch.connect(mtof, 0, pack, 0)
    patch.connect(pack, 0, line, 0)
    patch.connect(line, 0, sine, 0)
    patch.connect(line, 0, saw, 0)
    patch.connect(sine, 0, sine_gain, 0)
    patch.connect(saw, 0, saw_low, 0)
    patch.connect(saw_low, 0, saw_gain, 0)
    patch.connect(sine_gain, 0, sum_a, 0)
    patch.connect(saw_gain, 0, sum_a, 1)
    patch.connect(env_msg, 0, env, 0)
    patch.connect(sum_a, 0, amp, 0)
    patch.connect(env, 0, amp, 1)
    patch.connect(amp, 0, smooth, 0)
    add_throw_pair(patch, x + 610, y + 306, smooth, 0.28, 0)


def add_supersaw_chord(
    patch: Patch,
    x: int,
    y: int,
    label: str,
    steps: list[int],
    freqs: list[float],
    dry_gain: float,
    fx_gain: float,
) -> None:
    patch.comment(x, y, label)
    step = patch.obj(x, y + 28, "r kfb_step")
    selector = patch.obj(x, y + 60, "sel " + " ".join(str(step_no) for step_no in steps))
    env_msg = patch.msg(x + 176, y + 60, "0 0, 0 18, 0.5 95 18, 0.22 150 115, 0 80 260")
    env = patch.obj(x + 176, y + 96, "vline~")
    patch.connect(step, 0, selector, 0)
    connect_all(patch, selector, env_msg, len(steps))
    patch.connect(env_msg, 0, env, 0)

    partials = []
    for idx, freq in enumerate(freqs):
        xx = x + idx * 92
        osc_a = patch.obj(xx, y + 140, f"phasor~ {freq:.2f}")
        center_a = patch.obj(xx, y + 172, "-~ 0.5")
        osc_b = patch.obj(xx + 42, y + 140, f"phasor~ {freq * 1.006:.2f}")
        center_b = patch.obj(xx + 42, y + 172, "-~ 0.5")
        blend = patch.obj(xx + 16, y + 204, "+~")
        tone = patch.obj(xx + 16, y + 236, "lop~ 4200")
        weight = patch.obj(xx + 16, y + 268, "*~ 0.15")
        patch.connect(osc_a, 0, center_a, 0)
        patch.connect(osc_b, 0, center_b, 0)
        patch.connect(center_a, 0, blend, 0)
        patch.connect(center_b, 0, blend, 1)
        patch.connect(blend, 0, tone, 0)
        patch.connect(tone, 0, weight, 0)
        partials.append(weight)

    mix_a = patch.obj(x + 78, y + 310, "+~")
    mix_b = patch.obj(x + 170, y + 340, "+~")
    mix_c = patch.obj(x + 262, y + 370, "+~")
    amp = patch.obj(x + 360, y + 404, "*~")
    bright = patch.obj(x + 450, y + 404, "hip~ 120")
    patch.connect(partials[0], 0, mix_a, 0)
    patch.connect(partials[1], 0, mix_a, 1)
    patch.connect(mix_a, 0, mix_b, 0)
    patch.connect(partials[2], 0, mix_b, 1)
    patch.connect(mix_b, 0, mix_c, 0)
    patch.connect(partials[3], 0, mix_c, 1)
    patch.connect(mix_c, 0, amp, 0)
    patch.connect(env, 0, amp, 1)
    patch.connect(amp, 0, bright, 0)
    add_throw_pair(patch, x + 540, y + 404, bright, dry_gain, fx_gain)


def add_sparkle_arp(patch: Patch, x: int, y: int) -> None:
    patch.comment(x, y, "Sparkle arp: fast cute major-scale ping, intentionally varied away from a plain grid")
    steps = [1, 2, 5, 7, 9, 10, 13, 15, 17, 18, 21, 23, 25, 26, 29, 31]
    notes = [77, 81, 84, 86, 88, 89, 84, 81, 79, 83, 86, 89, 91, 88, 84, 93]
    step = patch.obj(x, y + 28, "r kfb_step")
    selector = patch.obj(x, y + 60, "sel " + " ".join(str(step_no) for step_no in steps))
    mtof = patch.obj(x + 424, y + 60, "mtof")
    pack = patch.obj(x + 424, y + 94, "pack f 8")
    line = patch.obj(x + 424, y + 128, "line~")
    tone = patch.obj(x + 424, y + 162, "osc~")
    env_msg = patch.msg(x + 598, y + 60, "0.58 3, 0 94 12")
    env = patch.obj(x + 598, y + 94, "vline~")
    amp = patch.obj(x + 512, y + 202, "*~")
    bright = patch.obj(x + 602, y + 202, "hip~ 900")
    patch.connect(step, 0, selector, 0)
    for idx, note in enumerate(notes):
        note_msg = patch.msg(x + 22 + (idx % 8) * 42, y + 104 + (idx // 8) * 32, str(note))
        patch.connect(selector, idx, note_msg, 0)
        patch.connect(note_msg, 0, mtof, 0)
        patch.connect(selector, idx, env_msg, 0)
    patch.connect(mtof, 0, pack, 0)
    patch.connect(pack, 0, line, 0)
    patch.connect(line, 0, tone, 0)
    patch.connect(env_msg, 0, env, 0)
    patch.connect(tone, 0, amp, 0)
    patch.connect(env, 0, amp, 1)
    patch.connect(amp, 0, bright, 0)
    add_throw_pair(patch, x + 692, y + 202, bright, 0.075, 0.12)


def build() -> None:
    p = Patch(x=20, y=20, width=1880, height=2600, font_size=12)
    p.comment(28, 20, "Kawaii future bass burst - Pd Vanilla")
    p.comment(28, 42, "160 BPM, bright F major loop, dense hats, cute vocal shots, sweep/crash candy, pumping supersaws")

    p.comment(30, 78, "Transport: loadbang turns on DSP and starts the sequencer. Click 0 to stop, 1 to restart.")
    loadbang = p.obj(30, 106, "loadbang")
    dsp_on = p.msg(30, 138, "; pd dsp 1")
    start = p.msg(138, 138, "1")
    stop = p.msg(194, 138, "0")
    metro = p.obj(138, 174, "metro 93.75")
    counter = p.obj(138, 210, "f 0")
    increment = p.obj(198, 210, "+ 1")
    wrap = p.obj(258, 210, "mod 32")
    step_send = p.obj(138, 246, "s kfb_step")
    p.connect(loadbang, 0, dsp_on, 0)
    p.connect(loadbang, 0, start, 0)
    p.connect(start, 0, metro, 0)
    p.connect(stop, 0, metro, 0)
    p.connect(metro, 0, counter, 0)
    p.connect(counter, 0, step_send, 0)
    p.connect(counter, 0, increment, 0)
    p.connect(increment, 0, wrap, 0)
    p.connect(wrap, 0, counter, 1)

    add_sample_loader(p, loadbang, 520, 78)

    add_sample_voice(p, 30, 520, "Kick sample: quick bouncy future-bass pattern", "kfb_kick", [0, 3, 6, 10, 16, 19, 22, 27, 30], 0.74, 0)
    add_sample_voice(p, 560, 520, "Snare sample: wide backbeat, still fast at 160 BPM", "kfb_snare", [8, 24], 0.38, 0.05)
    add_sample_voice(p, 1090, 520, "Clap sample: cute transient layer on the snare", "kfb_clap", [8, 24], 0.43, 0.06)

    add_sample_voice(p, 30, 710, "Closed hat sample: nearly constant 16ths with a few probabilistic skips", "kfb_hat", [2, 4, 5, 6, 9, 10, 12, 14, 18, 20, 21, 22, 25, 26, 28, 30], 0.18, 0.02, random_chance=92)
    add_sample_voice(p, 560, 710, "Open hat sample: bright offbeat lift", "kfb_openhat", [7, 15, 23, 31], 0.18, 0.04)
    add_sample_voice(p, 1090, 710, "Perc samples: toy-like accents around the drums", "kfb_perc_a", [5, 13, 18, 29], 0.22, 0.05, random_chance=76)

    add_sample_voice(p, 30, 900, "Perc response sample: extra pops before phrase turns", "kfb_perc_b", [11, 14, 21, 30], 0.18, 0.06, random_chance=70)
    add_sample_voice(p, 560, 900, "Crash sample: bright downbeat candy", "kfb_crash", [0, 16], 0.10, 0.10)
    add_sample_voice(p, 1090, 900, "SFX flash sample: sparkle impact before the hook loops", "kfb_flash", [15, 31], 0.14, 0.10)

    add_sample_voice(p, 30, 1090, "Mario sweep sample: long kawaii riser into the second half", "kfb_sweep", [24], 0.12, 0.12)
    add_sample_voice(p, 560, 1090, "Cut-the-track sample: tiny transition punctuation", "kfb_cut", [31], 0.18, 0.08)
    add_sample_voice(p, 1090, 1090, "Konnichiwa vocal: hook call at phrase starts", "kfb_konnichiwa", [0, 16], 0.22, 0.11)

    add_sample_voice(p, 30, 1280, "Giggle vocal: playful answer near the second bar", "kfb_giggle", [12, 28], 0.18, 0.12)
    add_sample_voice(p, 560, 1280, "Who vocal: short fill into snare hits", "kfb_who", [6, 22, 30], 0.16, 0.10)
    add_sub_bass(p, 1090, 1280)

    add_supersaw_chord(p, 30, 1620, "Pumping supersaw Fmaj9", [0, 4], [174.61, 220.00, 261.63, 392.00], 0.044, 0.08)
    add_supersaw_chord(p, 560, 1620, "Pumping supersaw Cadd9", [8, 12], [130.81, 196.00, 261.63, 293.66], 0.044, 0.08)
    add_supersaw_chord(p, 1090, 1620, "Pumping supersaw Dm7 to Bbmaj9 color", [16, 20, 24, 28], [146.83, 174.61, 220.00, 261.63], 0.042, 0.08)

    add_sparkle_arp(p, 30, 2110)

    p.comment(30, 2360, "Delay return: bright feed-forward echo, no feedback loop")
    fx_catch = p.obj(30, 2388, "catch~ kfb_fx")
    fx_hip = p.obj(30, 2420, "hip~ 700")
    delay_write = p.obj(30, 2452, "delwrite~ kfb_delay 620")
    delay_read = p.obj(260, 2388, "delread~ kfb_delay 187")
    delay_gain = p.obj(260, 2420, "*~ 0.23")
    delay_throw = p.obj(360, 2420, "throw~ kfb_mix")
    p.connect(fx_catch, 0, fx_hip, 0)
    p.connect(fx_hip, 0, delay_write, 0)
    p.connect(delay_read, 0, delay_gain, 0)
    p.connect(delay_gain, 0, delay_throw, 0)

    p.comment(760, 2360, "Master: mix bus, clip, direct attenuation, dac")
    mix_catch = p.obj(760, 2388, "catch~ kfb_mix")
    master_hip = p.obj(760, 2420, "hip~ 25")
    master_clip = p.obj(860, 2420, "clip~ -0.9 0.9")
    master_gain = p.obj(976, 2420, "*~ 0.13")
    dac = p.obj(1080, 2420, "dac~")
    p.connect(mix_catch, 0, master_hip, 0)
    p.connect(master_hip, 0, master_clip, 0)
    p.connect(master_clip, 0, master_gain, 0)
    p.connect(master_gain, 0, dac, 0)
    p.connect(master_gain, 0, dac, 1)

    p.save(OUT)


if __name__ == "__main__":
    build()
