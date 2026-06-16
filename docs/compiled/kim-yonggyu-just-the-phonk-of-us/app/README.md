# Just Two Of Us Phonk-Jazz Progression Test

Pd Vanilla package for testing the supplied chord-form sequence with phonk
drums and a sample-based soft phonk house chord pad.

## Contents

- `just_two_of_us_phonk_jazz_test.pd` - main Pd patch
- `generate_just_two_of_us_phonk_jazz_test.py` - regeneration script
- `samples/kusa_nagi_phonk_v1_pd_ready/` - required WAV files with stable names

## How to Run

1. Open `just_two_of_us_phonk_jazz_test.pd` in Pure Data Vanilla.
2. The patch turns DSP on and starts playback from `loadbang`.
3. Click the `0` message near the transport to stop, and `1` to restart.

## Notes

- The chord pad uses `soft_chord_gsharp_minor.wav` as a pitched sample source.
- The harmonic schedule still follows the supplied chord sequence.
- The sample chord pad is pitch-following by root, not separate recorded samples
  for every chord quality.
- No melody or lyrics from the reference song are encoded.
- Verify the licensing of any third-party samples before publishing or sharing.

## Compatibility

Target: Pd Vanilla. The patch uses Vanilla objects including `soundfiler`,
`tabplay~`, `tabread4~`, `vline~`, `throw~`, and `catch~`.
