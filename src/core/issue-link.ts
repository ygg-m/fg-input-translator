const FENCE = "```";
const MAX_URL_LENGTH = 7000;
const TITLE = "Implementation request";

const body = (configuration: string) =>
  [
    "## What should be added?",
    "<!-- Which game, and which moves or notation is this for? -->",
    "",
    "## Configuration",
    configuration,
    "",
  ].join("\n");

const issueUrl = (repo: string, text: string) => {
  const query = new URLSearchParams({ title: TITLE, body: text });
  return `https://github.com/${repo}/issues/new?${query.toString()}`;
};

/**
 * A link that opens a pre-filled new-issue draft; nothing is sent until the user submits it.
 * When the configuration would not fit in a URL it is left out and `truncated` is true, so
 * the page can put it on the clipboard for pasting instead.
 */
export function buildIssueUrl(exportText: string, repo: string): { url: string; truncated: boolean } {
  const full = issueUrl(repo, body(`${FENCE}json\n${exportText}\n${FENCE}`));
  if (full.length <= MAX_URL_LENGTH) return { url: full, truncated: false };

  const short = body(
    `The configuration was too long for a link. It was copied to your clipboard: paste it below, between the fences.\n\n${FENCE}json\n\n${FENCE}`,
  );
  return { url: issueUrl(repo, short), truncated: true };
}
