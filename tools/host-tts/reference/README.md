# Private host reference

Keep the approved original WAV here as `original.wav`, and a separate clean mono
24 kHz segment as `host_ru_reference.wav`. Never overwrite the original.
`metadata.json` records the original SHA-256, segment start and duration.
All reference contents except this README are ignored by Git.

The approved fragment is `host_ru_icl_reference.wav` (0–8.3 seconds), with the
user's verified exact transcript in `host_ru_reference.txt`. The initial audio-only
sample was rejected for similarity and is not installed in gameplay.

The installed MLX Base implementation supports audio-only speaker embedding
cloning. This does not require a transcript. For its ICL workflow, supply an exact,
manually verified UTF-8 transcript of **the selected segment** in
`host_ru_reference.txt`, then set `transcript` and `transcriptApproved: true` in
the private local configuration. An ASR draft must never be marked approved
without checking it against the recording.
