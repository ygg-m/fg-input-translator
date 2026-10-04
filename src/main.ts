import "./style.css";
import { resolveGame } from "./core/games";
import { parse } from "./core/parse";
import { toView } from "./core/view";
import { registry } from "./data/index";
import { renderView } from "./ui/render";

// Vite turns each bundled SVG into a URL; definitions refer to them by file name.
const assetUrls = import.meta.glob("./assets/inputs/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const assets = (id: string) => assetUrls[`./assets/inputs/${id}.svg`];

const gameSelect = document.querySelector<HTMLSelectElement>("#game")!;
const notationInput = document.querySelector<HTMLTextAreaElement>("#notation")!;
const output = document.querySelector<HTMLElement>("#output")!;

for (const game of registry.games) {
  gameSelect.append(new Option(game.name, game.id));
}
gameSelect.value = "guilty-gear";

function update() {
  const resolved = resolveGame(gameSelect.value, registry);
  if (!resolved.ok) {
    output.textContent = `Could not load this game: ${JSON.stringify(resolved.errors)}`;
    return;
  }
  const nodes = parse(notationInput.value, resolved.definitions);
  output.replaceChildren(renderView(toView(nodes, resolved.definitions), document, assets));
}

gameSelect.addEventListener("change", update);
notationInput.addEventListener("input", update);
update();
