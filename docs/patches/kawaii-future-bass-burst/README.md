# Kawaii Future Bass Burst Pd Package

Open `kawaii_future_bass_burst.pd` in Pure Data from this folder.

The patch expects the included sample files at:

`samples/kawaii_future_bass/pd_ready/`

Contents:

- `kawaii_future_bass_burst.pd`: Pd Vanilla patch
- `generate_kawaii_future_bass_burst.py`: reproducible patch generator
- `samples/kawaii_future_bass/pd_ready/*.wav`: sample assets used by the patch
- `samples/kawaii_future_bass/pd_ready/README.md`: source-to-converted-file notes

The patch turns DSP on automatically via `[loadbang]` and starts a 160 BPM sequencer. Click the `0` message near the top-left transport area to stop, or `1` to restart.
