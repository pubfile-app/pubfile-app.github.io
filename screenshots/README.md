# App screenshots (2026-09-18, build b58ca5b, macOS 26)

Window captures at 2x (Retina) with the standard macOS shadow on a transparent background, 2768×1918 px ≈ 1384×959 pt.
Document: research/raw/corpus/tdf67299_Cantico_dei_Cantici.pub (4-page parish newsletter, Publisher 2003 booklet) with two more
corpus files open as tabs.

- hero-light.png / hero-dark.png — page thumbnails sidebar open, page 1 at 70 % zoom, inspector closed.
- inspector-light.png / inspector-dark.png — same plus the inspector (file facts + fidelity report with Publisher's own preview).

Regenerate: open the three files in /Applications/PubFile.app, View ▸ Show Page Thumbnails, Zoom Out ×3, `screencapture -l<windowID>`.
Light variant via `defaults write app.pubfile.PubFile NSRequiresAquaSystemAppearance -bool YES` (delete afterwards).
