import "./style.css";
import { saveAsDefinition, deleteDefinition } from "./core/custom";
import { resolveGame } from "./core/games";
import type { CustomLayers } from "./core/games";
import {
  anchorFor,
  customizeToken,
  findCustomization,
  reassignToken,
  resetToken,
  resolveRow,
} from "./core/row";
import type { Anchor, Row, TokenChanges } from "./core/row";
import { toView } from "./core/view";
import type { ViewNode } from "./core/view";
import { registry } from "./data/index";
import { createEditor } from "./ui/editor";
import { renderView } from "./ui/render";
import { renderSavedList } from "./ui/saved-list";

// Vite turns each bundled SVG into a URL; definitions refer to them by file name.
const assetUrls = import.meta.glob("./assets/inputs/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const assets = (id: string) => assetUrls[`./assets/inputs/${id}.svg`];
const assetIds = Object.keys(assetUrls).map((path) => path.split("/").pop()!.replace(".svg", ""));

const gameSelect = document.querySelector<HTMLSelectElement>("#game")!;
const notationInput = document.querySelector<HTMLTextAreaElement>("#notation")!;
const output = document.querySelector<HTMLElement>("#output")!;
const status = document.querySelector<HTMLElement>("#status")!;
const savedSection = document.querySelector<HTMLElement>("#saved")!;

for (const game of registry.games) {
  const option = document.createElement("option");
  option.value = game.id;
  option.textContent = game.name;
  gameSelect.append(option);
}
gameSelect.value = "guilty-gear";

// In memory for now; persistence comes in a later slice.
let row: Row = { notation: notationInput.value, customizations: [] };
let customLayers: CustomLayers = {};

function resolve(rowToShow: Row) {
  const game = resolveGame(gameSelect.value, registry, customLayers);
  if (!game.ok) {
    return { ok: false as const, error: `Could not load this game: ${JSON.stringify(game.errors)}` };
  }
  return { ok: true as const, game, resolved: resolveRow(rowToShow, game.definitions) };
}

function render(preview?: Row) {
  const result = resolve(preview ?? row);
  if (!result.ok) {
    output.textContent = result.error;
    return;
  }
  const { resolved } = result;
  output.replaceChildren(
    renderView(toView(resolved.nodes, resolved.definitions), document, assets, { onSelect: openEditor }),
  );

  status.textContent =
    resolved.dropped.length > 0
      ? `${resolved.dropped.length} customization(s) no longer match the notation and are hidden.`
      : "";

  const gameId = gameSelect.value;
  savedSection.replaceChildren(
    renderSavedList(document, customLayers[gameId] ?? [], (id) => {
      customLayers = deleteDefinition(customLayers, gameId, id);
      render();
    }),
  );
}

function openEditor(node: ViewNode) {
  const result = resolve(row);
  if (!result.ok) return;
  const { game, resolved } = result;
  const gameId = gameSelect.value;

  const anchor: Anchor = anchorFor(resolved.nodes, node);
  const existing = findCustomization(row, anchor);
  const basedOn = existing?.basedOn ?? node.definitionId;

  // Dropping the preview and removing the dialog happens here directly for the buttons;
  // the close event covers Escape. Whichever runs first does the work once.
  const cleanup = () => {
    if (!dialog.isConnected) return;
    dialog.remove();
    render();
  };
  const finish = () => {
    dialog.close();
    cleanup();
  };
  const setRow = (next: Row) => {
    row = next;
    notationInput.value = row.notation;
  };

  const dialog = createEditor(
    document,
    {
      text: node.text,
      definitionId: basedOn,
      name: node.name,
      display: node.display,
      label: node.label,
      description: node.description,
      more: node.more,
      custom: node.custom,
      choices: game.definitions
        .filter((d) => d.aliases.length > 0)
        .map((d) => ({ id: d.id, name: d.name })),
      assetIds,
    },
    {
      onChange: (changes: TokenChanges) => render(customizeToken(row, anchor, basedOn, changes)),
      onApply: (changes) => {
        if (Object.keys(changes).length > 0) setRow(customizeToken(row, anchor, basedOn, changes));
        finish();
      },
      onSave: (changes, aliases) => {
        const base = game.definitions.find((d) => d.id === basedOn);
        if (base) {
          const [first, ...extra] = aliases.length > 0 ? aliases : [node.text];
          customLayers = saveAsDefinition(
            customLayers,
            gameId,
            base,
            first!,
            { ...existing?.changes, ...changes },
            extra,
          );
          setRow(resetToken(row, anchor));
        }
        finish();
      },
      onReset: () => {
        setRow(resetToken(row, anchor));
        finish();
      },
      onReassign: (definitionId) => {
        const reassigned = reassignToken(row, anchor, definitionId, game.definitions);
        if (reassigned.ok) setRow(reassigned.row);
        else status.textContent = `Could not switch this token (${reassigned.reason}).`;
        finish();
      },
      onCancel: finish,
    },
  );

  dialog.addEventListener("close", cleanup);
  document.body.append(dialog);
  dialog.showModal();
}

gameSelect.addEventListener("change", () => render());
notationInput.addEventListener("input", () => {
  row = { ...row, notation: notationInput.value };
  render();
});
render();
