<div align="center">
    <h1>Fighting Game Input Translator</h1>
    <h3><strong style="color:#F2C94C">236P</strong> becomes <img src="./src/assets/inputs/Motion236.svg" style="width:2rem" /> + <img src="./src/assets/inputs/ActionAnyPunch.svg" style="width:2rem" /></h3>
</div>

# ✨ About this

Type fighting game numpad notation and see it as the visual inputs that guides use. Every Token is just data (name, image or text, caption, description), so anything can be shown by changing its properties.

# 🚀 Access

The website is hosted by GitHub Pages at: https://ygg-m.github.io/fg-input-translator/

# 🧰 What you can do

- **Pick a game**, because the same notation can mean different things in different games.
- **Make your own games** ("Your games"): a name, optionally based on a built-in game or another of yours, with their own saved definitions and tabs. Sharing or exporting a tab carries its game along.
- **Keep combos in tabs** for each game, with rows that have an optional label.
- **Click any input to change how it looks** (name, image, text or emoji, caption, description, link), for that row or saved for the whole game, or switch it to another definition.
- **Share** a row or a whole tab with a link. Plain notation links stay readable, and links from the previous version still open.
- **Export and import** tabs and saved definitions as text, or send them as a draft GitHub issue with "Request implementation".
- **Copy or download a row as a PNG**, with a green Chroma background if you want to cut it out.
- Your data lives in your browser. Notes saved by the previous version are imported automatically.

# ✍️ Notation at a glance

| Write | Meaning |
| --- | --- |
| `236P`, `2 3 6 P` | a motion followed by a button, spaces are ignored |
| `>`, `~`, `,` | then, cancel into, and so on |
| `P+K` | pressed at the same time |
| `[6]` | hold |
| `{236P}x3` or `[236P]x3` | repeat |
| ``` ``any text`` ``` | a comment |

The **All Inputs** button in the app lists every alias for every game.

# 🛠️ Develop

```bash
npm install
npm run dev        # local site
npm test           # unit tests (Vitest)
npm run typecheck
npm run build
npm run deploy     # builds and publishes to GitHub Pages
```

Plain HTML, CSS and TypeScript with Vite; the only runtime dependency is `html-to-image` for PNG export.

- `src/core/` is the pure engine with no DOM: parsing, Games and layers, rows, tabs, saved definitions, persistence, sharing, export and import.
- `src/ui/` builds DOM from properties only, with no special cases for any input.
- `src/data/` holds the Token Definitions for the shared base and each game, plus the golden tests that compare the engine with what the previous version showed.
- Vocabulary is in [GLOSSARY.md](GLOSSARY.md), the main design decision is in [docs/adr](docs/adr), and what changed from the previous React version is in [docs/legacy-port-notes.md](docs/legacy-port-notes.md).

# 🎯 Goals

- [x] Read inputs, basic and complex combos, groups, unique inputs
- [x] Support different games, with Tokens defined by data
- [x] Click a Token to change what it shows
- [x] Shareable links and exportable code
- [x] Custom Games (a user-defined game extending a built-in one)
