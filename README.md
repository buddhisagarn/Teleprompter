# Prompt Deck — Teleprompter for YouTube Documentaries

A teleprompter built for reading scripts in **Nepali (Devanagari)** and **English**, mixed or
separate, with full control over reading speed and text size while you record.

## Setup

You need [Node.js](https://nodejs.org) 18+ installed.

```bash
cd teleprompter-app
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To build a static production version you can host anywhere (Vercel, Netlify, or just open
locally):

```bash
npm run build
npm run preview   # preview the production build
```

The `dist/` folder after `npm run build` is a plain static site — you can also just double-click
`dist/index.html` or host it anywhere.

## How to use it

1. **Paste your script** into the editor on the right. Nepali and English text both render
   correctly in the same script — no need to switch fonts or modes.
2. **Adjust the controls** on the left panel:
   - **Font size** — how large the script text is
   - **Scroll speed** — how fast it scrolls, in pixels/second
   - **Line height** — spacing between lines
   - **Reading column** — how wide the text block is, so lines don't run edge-to-edge
   - **Countdown** — a 3/5/10 second countdown before scrolling starts, so you have time to get
     in position
   - **Alignment** — left or centered text
   - **Stage** — dark background (default, best for most rooms) or bright background (for very
     bright rooms/daylight monitors)
   - **Mirror rig** — flips the text horizontally and/or vertically, for physical teleprompter
     rigs that read text off a glass reflector
3. Click **Go to Stage** to enter fullscreen reading mode.
4. On stage, hit **Play** (or tap the space bar) to start scrolling.

## Keyboard shortcuts (while on stage)

| Key | Action |
|---|---|
| `Space` | Play / pause scrolling |
| `↑` / `↓` | Increase / decrease scroll speed |
| `←` / `→` | Decrease / increase font size |
| `M` | Toggle horizontal mirror |
| `R` | Reset scroll to the top |
| `Esc` | Exit back to the editor |

The control bar and top status bar auto-hide a couple of seconds after you stop moving your
mouse while scrolling, so nothing is in the shot — move the mouse or tap the screen to bring
them back.

## Notes

- Your script and settings are saved automatically to your browser's local storage, so closing
  the tab won't lose your work. This only lives on your own device — nothing is uploaded
  anywhere.
- The red dot ("tally light") in the top-left mirrors real camera tally lamps: solid/pulsing red
  means the prompter is actively scrolling ("on air"), dim means it's paused.
- The "~mm:ss at this speed" figure in the bottom-left of the control panel is a rough estimate
  based on your script length, font size, and scroll speed — treat it as a ballpark, not exact
  timing.
