export interface PickerModel {
  builtIn: { id: string; name: string }[];
  custom: { id: string; name: string }[];
  selected: string;
}

function option(doc: Document, value: string, text: string) {
  const element = doc.createElement("option");
  element.value = value;
  element.textContent = text;
  return element;
}

/** Fill the game dropdown: built-in games first, the user's own under "Your games". */
export function fillGamePicker(doc: Document, select: HTMLSelectElement, model: PickerModel) {
  select.replaceChildren(...model.builtIn.map((game) => option(doc, game.id, game.name)));

  if (model.custom.length > 0) {
    const group = doc.createElement("optgroup");
    group.label = "Your games";
    group.append(...model.custom.map((game) => option(doc, game.id, game.name)));
    select.append(group);
  }
  select.value = model.selected;
}

export interface GameRow {
  id: string;
  name: string;
  parent?: string;
  parentChoices: { id: string; name: string }[];
  /** Names of the custom games based on this one, which stop it from being deleted. */
  blockedBy: string[];
}

export interface GamesModel {
  games: GameRow[];
  newParentChoices: { id: string; name: string }[];
}

/** Each handler may return a message to show, such as why something was refused. */
export interface GamesHandlers {
  onCreate: (name: string, parent: string | undefined) => string | undefined;
  onRename: (id: string, name: string) => string | undefined;
  onSetParent: (id: string, parent: string | undefined) => string | undefined;
  onDelete: (id: string) => string | undefined;
  confirm: (message: string) => boolean;
  onClose: () => void;
}

const NOTHING = "Nothing (shared inputs only)";

function button(doc: Document, action: string, text: string) {
  const element = doc.createElement("button");
  element.type = "button";
  element.dataset.action = action;
  element.textContent = text;
  return element;
}

function parentSelect(doc: Document, name: string, choices: { id: string; name: string }[], current?: string) {
  const select = doc.createElement("select");
  select.name = name;
  select.append(option(doc, "", NOTHING), ...choices.map((choice) => option(doc, choice.id, choice.name)));
  select.value = current ?? "";
  return select;
}

// Names come from the user, a link or a file, so they only ever go in as text or values.
export function createGamesDialog(
  doc: Document,
  initial: GamesModel,
  handlers: GamesHandlers,
): { dialog: HTMLDialogElement; update: (model: GamesModel, message?: string) => void } {
  const dialog = doc.createElement("dialog");
  dialog.className = "games-dialog";

  const heading = doc.createElement("h2");
  heading.textContent = "Your games";

  const list = doc.createElement("ul");
  list.className = "games-list";

  const feedback = doc.createElement("p");
  feedback.className = "games-message";
  feedback.setAttribute("role", "status");
  const say = (text: string | undefined) => {
    feedback.textContent = text ?? "";
  };

  const form = doc.createElement("div");
  form.className = "games-new";
  const newName = doc.createElement("input");
  newName.name = "newName";
  newName.placeholder = "Name of a new game";
  newName.setAttribute("aria-label", "Name of a new game");
  let newParent = parentSelect(doc, "newParent", initial.newParentChoices);
  newParent.setAttribute("aria-label", "Based on");
  const create = button(doc, "create", "Create game");
  create.addEventListener("click", () => {
    const name = newName.value.trim();
    if (name === "") return say("Give the game a name first.");
    say(handlers.onCreate(name, newParent.value === "" ? undefined : newParent.value));
  });
  form.append(newName, newParent, create);

  const close = button(doc, "close", "Close");
  close.addEventListener("click", () => handlers.onClose());

  dialog.append(heading, list, form, feedback, close);

  const render = (model: GamesModel) => {
    list.replaceChildren(
      ...model.games.map((game) => {
        const row = doc.createElement("li");
        row.className = "game-row";
        row.dataset.gameId = game.id;

        const name = doc.createElement("input");
        name.name = "name";
        name.value = game.name;
        name.setAttribute("aria-label", "Game name");

        const rename = button(doc, "rename", "Rename");
        rename.addEventListener("click", () => say(handlers.onRename(game.id, name.value)));

        const parent = parentSelect(doc, "parent", game.parentChoices, game.parent);
        parent.setAttribute("aria-label", `${game.name} is based on`);
        parent.addEventListener("change", () =>
          say(handlers.onSetParent(game.id, parent.value === "" ? undefined : parent.value)),
        );

        const remove = button(doc, "delete", "Delete");
        remove.disabled = game.blockedBy.length > 0;
        remove.addEventListener("click", () => {
          if (handlers.confirm(`Delete "${game.name}" with its tabs and saved definitions?`)) {
            say(handlers.onDelete(game.id));
          }
        });

        row.append(name, rename, parent, remove);
        if (game.blockedBy.length > 0) {
          const note = doc.createElement("span");
          note.className = "game-blocked";
          note.textContent = `Cannot be deleted while ${game.blockedBy.join(", ")} ${
            game.blockedBy.length === 1 ? "is" : "are"
          } based on it.`;
          row.append(note);
        }
        return row;
      }),
    );

    const fresh = parentSelect(doc, "newParent", model.newParentChoices, newParent.value);
    fresh.setAttribute("aria-label", "Based on");
    newParent.replaceWith(fresh);
    newParent = fresh;
  };
  render(initial);

  return {
    dialog,
    update(model, message) {
      render(model);
      newName.value = "";
      say(message);
    },
  };
}
