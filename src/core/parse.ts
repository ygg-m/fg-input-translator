import type {
  DelimitedSyntax,
  Group,
  Node,
  Token,
  TokenDefinition,
} from "./types";

export const UNKNOWN_DEFINITION_ID = "unknown";

/** A separator seen while scanning, resolved into a group once its operands are known. */
interface Separator {
  separator: true;
  definitionId: string;
  from: number;
  to: number;
}

const startsWithAlias = (text: string, alias: string, ignoreCase = false) =>
  ignoreCase
    ? text.slice(0, alias.length).toLowerCase() === alias.toLowerCase()
    : text.startsWith(alias);

const isSeparator =(item: Node | Separator): item is Separator =>
  "separator" in item;

export function parse(notation: string, definitions: TokenDefinition[]): Node[] {
  // Whitespace is insignificant; `origin` maps each kept character back to its
  // index in the original notation so spans keep pointing at the user's text.
  const origin: number[] = [];
  let compact = "";
  for (let i = 0; i < notation.length; i++) {
    if (/\s/.test(notation[i]!)) continue;
    origin.push(i);
    compact += notation[i];
  }

  const span = (from: number, to: number) => {
    const start = origin[from]!;
    const end = origin[to - 1]! + 1;
    return { text: notation.slice(start, end), start, end };
  };

  // Original text between two compact indices, inner whitespace included.
  const innerText = (from: number, to: number) =>
    from === to ? "" : notation.slice(origin[from]!, origin[to - 1]! + 1);

  const scan = (from: number, to: number): Node[] => {
    const nodes: (Node | Separator)[] = [];
    let position = from;
    let unknownStart: number | undefined;

    const flushUnknown = (end: number) => {
      if (unknownStart === undefined) return;
      nodes.push({ ...span(unknownStart, end), definitionId: UNKNOWN_DEFINITION_ID });
      unknownStart = undefined;
    };

    while (position < to) {
      const group = matchGroup(position, to);
      if (group) {
        flushUnknown(position);
        nodes.push(group.node);
        position = group.end;
        continue;
      }

      const separator = matchSeparator(position);
      if (separator) {
        flushUnknown(position);
        nodes.push(separator);
        position = separator.to;
        continue;
      }

      const rest = compact.slice(position, to);
      let best: { definition: TokenDefinition; alias: string } | undefined;

      for (const definition of definitions) {
        for (const alias of definition.aliases) {
          if (!startsWithAlias(rest, alias, definition.ignoreCase)) continue;
          if (!best || alias.length > best.alias.length) best = { definition, alias };
        }
      }

      if (!best) {
        unknownStart ??= position;
        position += 1;
        continue;
      }

      flushUnknown(position);
      const token: Token = {
        ...span(position, position + best.alias.length),
        definitionId: best.definition.id,
      };
      nodes.push(token);
      position += best.alias.length;
    }

    flushUnknown(position);
    return joinOperands(nodes);
  };

  const matchSeparator = (position: number): Separator | undefined => {
    for (const definition of definitions) {
      const syntax = definition.group;
      if (!syntax || !("separator" in syntax)) continue;
      if (!compact.startsWith(syntax.separator, position)) continue;
      return {
        separator: true,
        definitionId: definition.id,
        from: position,
        to: position + syntax.separator.length,
      };
    }
    return undefined;
  };

  // Fold `operand sep operand (sep operand)*` runs into one flat group; a
  // separator missing an operand on either side degrades to unknown text.
  const joinOperands = (items: (Node | Separator)[]): Node[] => {
    const result: Node[] = [];
    let i = 0;

    while (i < items.length) {
      const item = items[i]!;

      if (isSeparator(item)) {
        result.push({ ...span(item.from, item.to), definitionId: UNKNOWN_DEFINITION_ID });
        i += 1;
        continue;
      }

      const operands: Node[] = [item];
      let separatorId = "";
      for (;;) {
        const sep = items[i + 1];
        const operand = items[i + 2];
        if (!sep || !isSeparator(sep) || !operand || isSeparator(operand)) break;
        separatorId = sep.definitionId;
        operands.push(operand);
        i += 2;
      }
      i += 1;

      if (operands.length === 1) {
        result.push(item);
        continue;
      }

      const first = operands[0]!;
      const last = operands[operands.length - 1]!;
      const group: Group = {
        text: notation.slice(first.start, last.end),
        start: first.start,
        end: last.end,
        definitionId: separatorId,
        params: {},
        children: operands,
      };
      result.push(group);
    }

    return result;
  };

  // Index of the closer matching an already-consumed opener, skipping over
  // nested pairs of the same delimiters; -1 when the group never closes.
  const findCloser = (syntax: DelimitedSyntax, from: number, to: number) => {
    // Identical delimiters (e.g. comments) cannot nest: the next one closes.
    if (syntax.open === syntax.close) {
      const at = compact.indexOf(syntax.close, from);
      return at !== -1 && at + syntax.close.length <= to ? at : -1;
    }

    let depth = 1;
    let i = from;
    while (i < to) {
      if (compact.startsWith(syntax.open, i)) {
        depth += 1;
        i += syntax.open.length;
      } else if (compact.startsWith(syntax.close, i)) {
        depth -= 1;
        if (depth === 0) return i + syntax.close.length <= to ? i : -1;
        i += syntax.close.length;
      } else {
        i += 1;
      }
    }
    return -1;
  };

  // Among the groups that open here and close, the one consuming the most text
  // wins, so a trailing parameter (`]x2`) beats a plain closer (`]`).
  const matchGroup = (position: number, to: number) => {
    let best:
      | {
          definition: TokenDefinition;
          syntax: DelimitedSyntax;
          innerStart: number;
          closeAt: number;
          end: number;
          params: Record<string, string>;
        }
      | undefined;

    for (const definition of definitions) {
      const syntax = definition.group;
      if (!syntax || !("open" in syntax)) continue;
      if (!compact.startsWith(syntax.open, position)) continue;

      const innerStart = position + syntax.open.length;
      const closeAt = findCloser(syntax, innerStart, to);
      if (closeAt === -1) continue;

      let end = closeAt + syntax.close.length;
      const params: Record<string, string> = {};

      if (syntax.param) {
        const digits = /^\d+/.exec(compact.slice(end, to))?.[0];
        if (digits === undefined) continue;
        params[syntax.param.name] = digits;
        end += digits.length;
      }

      if (!best || end > best.end) {
        best = { definition, syntax, innerStart, closeAt, end, params };
      }
    }

    if (!best) return undefined;

    const { definition, syntax, innerStart, closeAt, end, params } = best;
    const group: Group = {
      ...span(position, end),
      definitionId: definition.id,
      params,
      children: syntax.literal ? [] : scan(innerStart, closeAt),
    };
    if (syntax.literal) group.content = innerText(innerStart, closeAt);

    return { end, node: group };
  };

  return scan(0, compact.length);
}
