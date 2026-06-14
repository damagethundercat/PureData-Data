Ambient Code Loop TouchDesigner OSC package

Open:
  ambient_code_loop_touchdesigner_osc.pd

Keep the samples folder next to the .pd file. The patch uses relative paths,
so moving the .pd file alone will break sample loading.

Included sample files:
  samples/easter_egg.wav
  samples/remix-sample/BRS_Crowd_Kids_Play_w-Teacher_Field_1.wav
  samples/remix-sample/FXZ_Percussive_FX_2.wav
  samples/remix-sample/SC_SP_field_recording_kids_laugh.wav
  samples/remix-sample/ma_drum_loop_form_percussion_100.wav
  samples/tonejs-piano/flute/C5.wav
  samples/tonejs-piano/piano/C5.wav
  samples/tonejs-piano/xylophone/C6.wav

TouchDesigner OSC notes:
  The patch sends/receives OSC according to its existing controls.
  If using BlackHole for TouchDesigner movie audio, set TouchDesigner audio
  output to BlackHole and set Pd/plugdata audio input to BlackHole.
