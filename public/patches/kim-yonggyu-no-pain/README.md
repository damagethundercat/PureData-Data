# NO PAIN-Inspired Progression Pd Package

Pd Vanilla patch package for a sample-free, synthesized band sketch based on the supplied chord progression.

## Files

- `no_pain_inspired_progression.pd` - main Pure Data patch
- `generate_no_pain_inspired_progression.py` - reproducible patch generator
- `README.md` - this package note

## How to Use

Open `no_pain_inspired_progression.pd` in Pure Data Vanilla. The patch starts DSP and playback from `loadbang`.

Top visual area:

- `section` shows the current song section.
- `chord` shows the current chord.
- Each section row is a one-bar-per-chord timeline.
- The 1-2-3-4 beat pulse flashes at quarter-note tempo.

## Musical Structure

The form plays sequentially:

Intro -> Verse 1 -> Pre -> Chorus -> Interlude -> Verse 2 -> Pre 2 -> Chorus A7 -> Chorus 2 -> Outro

After Outro, the full form loops back to Intro.

## Compatibility

Target: Pd Vanilla. No samples or external libraries are required.

Validated with:

```bash
python3 /Users/ikidk/.codex/skills/puredata-skills/scripts/pd_lint.py --strict no_pain_inspired_progression.pd
python3 -m py_compile generate_no_pain_inspired_progression.py
```

Both checks passed in the packaging environment. A live Pd load test was not run because `pd` was not available on PATH.
