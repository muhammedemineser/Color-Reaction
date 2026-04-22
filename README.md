# Color Reaction

An interactive color reaction game to measure your sensorimotor reaction speed.

**Live:** https://muhammedemineser.github.io/Color-Reaction/

---

## How it works

A color appears on screen — you type its name as fast as possible. After 1 minute you receive a detailed evaluation:

- Your best reaction time
- Reaction time to unknown stimuli (first encounter of each color)
- Reaction time to known stimuli (subsequent encounters)
- Speed of rhythmization
- Self-assessment accuracy
- Attention span
- Time perception

A minimum of 20 correct colors is required for the full evaluation.

---

## Languages

| Page | Language |
|------|----------|
| `index.html` | German (default, GitHub Pages entry point) |
| `en.html` | English |

---

## Structure

```
color-reaction/
├── index.html              # German version (GitHub Pages entry)
├── en.html                 # English version
├── animation.html          # Standalone shader animation demo
├── css/
│   └── style.css           # All styles
├── js/
│   ├── main-de.js          # Game logic (German)
│   ├── main-en.js          # Game logic (English)
│   └── background-animation.js  # WebGL shader for start screen
└── assets/
    ├── sounds/             # All audio files (.mp3)
    ├── images/             # Image assets (.png)
    ├── fonts/              # Local font files (.otf, .ttf)
    └── wuerfelAnimation.json    # Lottie dice animation
```

---

## Tech

- Vanilla JS, HTML, CSS — no framework
- WebGL shader for the animated start screen background
- [Lottie (bodymovin)](https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.9.6/lottie.min.js) for the dice animation
- [Chart.js](https://cdn.jsdelivr.net/npm/chart.js) for the reaction time chart
- [MockAPI](https://mockapi.io) for score persistence and leaderboard
