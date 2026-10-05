import type { Display, Group, MoreLink, Node, TokenDefinition } from "./types";

interface ViewBase {
  text: string;
  start: number;
  end: number;
  definitionId: string;
  name: string;
  display: Display;
  label?: string;
  description?: string;
  more?: MoreLink;
  accessibleName: string;
  unknown: boolean;
  /** Set when the user changed this Token: for this Row only, or saved for the Game. */
  custom?: "instance" | "saved";
}

export interface ViewToken extends ViewBase {
  kind: "token";
}

export interface ViewGroup extends ViewBase {
  kind: "group";
  children: ViewNode[];
  content?: string;
}

export type ViewNode = ViewToken | ViewGroup;

// Imported or shared data is untrusted: only plain https links are kept.
const safeLink = (more: MoreLink | undefined): MoreLink | undefined => {
  if (!more) return undefined;
  try {
    return new URL(more.url).protocol === "https:" ? more : undefined;
  } catch {
    return undefined;
  }
};

const fillTemplate = (template: string, params: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (placeholder, key: string) => params[key] ?? placeholder);

const isGroup = (node: Node): node is Group => "children" in node;

export function toView(nodes: Node[], definitions: TokenDefinition[]): ViewNode[] {
  const byId = new Map(definitions.map((d) => [d.id, d]));

  const viewOf = (node: Node): ViewNode => {
    const definition = byId.get(node.definitionId);
    if (!definition) {
      return {
        kind: "token",
        text: node.text,
        start: node.start,
        end: node.end,
        definitionId: node.definitionId,
        name: node.text,
        display: { mode: "label" },
        accessibleName: `Unknown: "${node.text}"`,
        unknown: true,
      };
    }

    const common = {
      text: node.text,
      start: node.start,
      end: node.end,
      definitionId: node.definitionId,
      name: definition.name,
      display: definition.display ?? ({ mode: "label" } as Display),
      unknown: false,
    };
    const extras: Partial<ViewBase> = {};
    if (definition.description !== undefined) extras.description = definition.description;
    const more = safeLink(definition.more);
    if (more) extras.more = more;
    if (definition.basedOn !== undefined) extras.custom = definition.saved ? "saved" : "instance";

    if (isGroup(node)) {
      const label = fillTemplate(definition.label ?? definition.name, node.params);
      const group: ViewGroup = {
        kind: "group",
        ...common,
        ...extras,
        label,
        accessibleName: label,
        children: node.children.map(viewOf),
      };
      if (node.content !== undefined) group.content = node.content;
      return group;
    }

    const token: ViewToken = { kind: "token", ...common, ...extras, accessibleName: definition.name };
    if (definition.label !== undefined) token.label = definition.label;
    return token;
  };

  return nodes.map(viewOf);
}
