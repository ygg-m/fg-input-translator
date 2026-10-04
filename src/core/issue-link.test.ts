import { describe, expect, it } from "vitest";
import { buildExport, serializeExport } from "./export";
import { buildIssueUrl } from "./issue-link";
import { parseExport } from "./export";
import { emptyWorkspace } from "./workspace";

const REPO = "ygg-m/fg-input-translator";

const parts = (url: string) => {
  const parsed = new URL(url);
  return {
    origin: parsed.origin,
    path: parsed.pathname,
    title: parsed.searchParams.get("title")!,
    body: parsed.searchParams.get("body")!,
  };
};

const smallExport = () => {
  const workspace = {
    ...emptyWorkspace(),
    games: {
      "street-fighter": {
        activeTab: "tab-1",
        tabs: [{ id: "tab-1", name: "Ryu & <Ken> \"combos\"", rows: [{ notation: "236P", customizations: [] }] }],
      },
    },
  };
  return serializeExport(buildExport(workspace, { tabs: [{ gameId: "street-fighter", tabId: "tab-1" }], definitions: [] }));
};

describe("buildIssueUrl", () => {
  it("opens a new-issue draft on the repository with the configuration in a fenced block", () => {
    const text = smallExport();

    const { url, truncated } = buildIssueUrl(text, REPO);
    const { origin, path, title, body } = parts(url);

    expect(truncated).toBe(false);
    expect(origin).toBe("https://github.com");
    expect(path).toBe(`/${REPO}/issues/new`);
    expect(title).toMatch(/implementation request/i);
    expect(body).toContain("```json\n" + text + "\n```");
  });

  it("produces a body this app can import straight back", () => {
    const { url } = buildIssueUrl(smallExport(), REPO);

    const result = parseExport(parts(url).body);

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.envelope.tabs[0]!.tab.name).toBe('Ryu & <Ken> "combos"');
  });

  it("leaves the configuration out of the link when it would not fit, and says so", () => {
    const huge = smallExport() + " ".repeat(50_000);

    const { url, truncated } = buildIssueUrl(huge, REPO);
    const { body } = parts(url);

    expect(truncated).toBe(true);
    expect(url.length).toBeLessThanOrEqual(7000);
    expect(body).not.toContain('"format"');
    expect(body).toMatch(/clipboard|paste/i);
  });
});
