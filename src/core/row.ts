import { parse } from "./parse";
import type { Group, Node, TokenDefinition } from "./types";

/** Which Token a customization belongs to: the nth (0-based) Token showing this text. */
export interface Anchor {
  text: string;
  occurrence: number;
}

export type TokenChanges = Partial<
  Pick<TokenDefinition, "name" | "display" | "label" | "description" | "more">
>;

export interface Customization {
  anchor: Anchor;
  basedOn: string;
  changes: TokenChanges;
}

export interface Row {
  notation: string;
  label?: string;
  customizations: Customization[];
}

export interface ResolvedRow {
  nodes: Node[];
  definitions: TokenDefinition[];
  /** Customizations whose Token no longer exists in the Notation. */
  dropped: Customization[];
}

const isGroup = (node: Node): node is Group => "children" in node;

// Document order, groups before their children.
export const flatten = (nodes: Node[]): Node[] =>
  nodes.flatMap((node) => (isGroup(node) ? [node, ...flatten(node.children)] : [node]));

export function resolveRow(row: Row, definitions: TokenDefinition[]): ResolvedRow {
  const parsed = parse(row.notation, definitions);
  const flat = flatten(parsed);
  const replacements = new Map<Node, string>();
  const derived: TokenDefinition[] = [];
  const dropped: Customization[] = [];

  row.customizations.forEach((customization, index) => {
    const base = definitions.find((d) => d.id === customization.basedOn);
    const target = flat.filter((n) => n.text === customization.anchor.text)[
      customization.anchor.occurrence
    ];
    if (!base || !target || target.definitionId !== customization.basedOn) {
      dropped.push(customization);
      return;
    }

    const id = `${base.id}~${index}`;
    derived.push({
      ...base,
      ...customization.changes,
      id,
      aliases: [],
      basedOn: base.id,
      // an edit on top of a saved definition is still only for this Row
      ...(base.saved ? { saved: false } : {}),
    });
    replacements.set(target, id);
  });

  const apply = (node: Node): Node => {
    const children = isGroup(node) ? node.children.map(apply) : undefined;
    const definitionId = replacements.get(node) ?? node.definitionId;
    return children ? { ...node, definitionId, children } : { ...node, definitionId };
  };

  return {
    nodes: replacements.size === 0 ? parsed : parsed.map(apply),
    definitions: derived.length === 0 ? definitions : [...definitions, ...derived],
    dropped,
  };
}

const sameAnchor = (a: Anchor, b: Anchor) => a.text === b.text && a.occurrence === b.occurrence;

/** Add or merge a customization for the Token at `anchor`; returns a new Row. */
export function customizeToken(
  row: Row,
  anchor: Anchor,
  basedOn: string,
  changes: TokenChanges,
): Row {
  const existing = row.customizations.find((c) => sameAnchor(c.anchor, anchor));
  const customizations = existing
    ? row.customizations.map((c) =>
        c === existing ? { ...c, changes: { ...c.changes, ...changes } } : c,
      )
    : [...row.customizations, { anchor, basedOn, changes }];
  return { ...row, customizations };
}

/** Remove the customization for the Token at `anchor`; returns a new Row. */
export function resetToken(row: Row, anchor: Anchor): Row {
  return { ...row, customizations: row.customizations.filter((c) => !sameAnchor(c.anchor, anchor)) };
}

/** The anchor of a node in `nodes`: its text plus how many same-text Tokens precede it. */
export function anchorFor(nodes: Node[], target: Node): Anchor {
  const flat = flatten(nodes);
  const at = flat.findIndex(
    (n) => n.start === target.start && n.end === target.end && isGroup(n) === isGroup(target),
  );
  const occurrence = flat.slice(0, Math.max(at, 0)).filter((n) => n.text === target.text).length;
  return { text: target.text, occurrence };
}

export type ReassignResult =
  | { ok: true; row: Row }
  | { ok: false; reason: "no-token" | "unknown-definition" | "no-alias" };

/**
 * Make the Token at `anchor` another definition by rewriting its text to that
 * definition's first alias. Other customizations are re-anchored; those that
 * sat inside the rewritten text, or no longer line up with a Token, are dropped.
 */
export function reassignToken(
  row: Row,
  anchor: Anchor,
  definitionId: string,
  definitions: TokenDefinition[],
): ReassignResult {
  const oldFlat = flatten(parse(row.notation, definitions));
  const target = oldFlat.filter((n) => n.text === anchor.text)[anchor.occurrence];
  if (!target) return { ok: false, reason: "no-token" };

  const definition = definitions.find((d) => d.id === definitionId);
  if (!definition) return { ok: false, reason: "unknown-definition" };
  const alias = definition.aliases[0];
  if (alias === undefined) return { ok: false, reason: "no-alias" };

  const notation = row.notation.slice(0, target.start) + alias + row.notation.slice(target.end);
  const delta = alias.length - (target.end - target.start);
  const newNodes = parse(notation, definitions);
  const newFlat = flatten(newNodes);

  const customizations: Customization[] = [];
  for (const customization of row.customizations) {
    const old = oldFlat.filter((n) => n.text === customization.anchor.text)[
      customization.anchor.occurrence
    ];
    if (!old || old === target) continue;
    if (old.start >= target.start && old.end <= target.end) continue;

    const start = old.start >= target.end ? old.start + delta : old.start;
    const moved = newFlat.find((n) => n.start === start && n.text === old.text);
    if (!moved) continue;
    customizations.push({ ...customization, anchor: anchorFor(newNodes, moved) });
  }

  return { ok: true, row: { ...row, notation, customizations } };
}

export function findCustomization(row: Row, anchor: Anchor): Customization | undefined {
  return row.customizations.find((c) => sameAnchor(c.anchor, anchor));
}
