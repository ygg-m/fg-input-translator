export interface GroupParam {
  name: string;
  kind: "digits";
}

/** A group wrapped by an opener and a closer, e.g. Hold `[6]`. */
export interface DelimitedSyntax {
  open: string;
  close: string;
  param?: GroupParam;
  literal?: boolean;
}

/** A group formed by joining the operands on either side of a separator, e.g. `P+K`. */
export interface InfixSyntax {
  separator: string;
}

export type GroupSyntax = DelimitedSyntax | InfixSyntax;

/** How a Token looks. Plain data so it can be shared, exported and edited. */
export type Display =
  | { mode: "image"; asset: string; transform?: ImageTransform }
  | { mode: "text"; text: string }
  | { mode: "label" };

/** Applied as CSS `rotate(<rotate>deg) scaleX(-1)` (flip optional). */
export interface ImageTransform {
  rotate?: number;
  flipX?: boolean;
}

export interface MoreLink {
  name: string;
  url: string;
}

export interface TokenDefinition {
  id: string;
  name: string;
  /** Free-form category such as "movement", "special", "action" or "mech". */
  type?: string;
  aliases: string[];
  display?: Display;
  label?: string;
  description?: string;
  more?: MoreLink;
  /** For a custom definition: the Pure definition it was derived from. */
  basedOn?: string;
  /** For a custom definition: saved in the Custom Layer, not only for one Row. */
  saved?: boolean;
  /** Match the aliases in any casing; the default is case-sensitive. */
  ignoreCase?: boolean;
  group?: GroupSyntax;
}

export interface Token {
  text: string;
  start: number;
  end: number;
  definitionId: string;
}

export interface Group extends Token {
  params: Record<string, string>;
  children: Node[];
  content?: string;
}

export type Node = Token | Group;
