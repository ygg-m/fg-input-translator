import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useInput } from "../contexts/InputContext";
import { copyToClipboard, saveToLocalStorage } from "../helpers";
import {
  CheckIcon,
  PlusIcon,
  ShareIcon,
  TextIcon,
  TrashIcon,
} from "../images/ui";

export const OutputList = () => {
  const [outputList, setOutputList] = useState(
    JSON.parse(localStorage.getItem("outputList")) || []
  );
  const [showName, setShowName] = useState(() =>
    localStorage.getItem("outputListShowName") === "true" ? true : false
  );
  const { readInputs, rawInput, gameInputs } = useInput();
  const [copied, setCopied] = useState(false);

  const createOutput = () => {
    return {
      Input: rawInput,
      Game: gameInputs[0].name,
      Title: rawInput,
    };
  };

  const Title = ({ input, index, setTitle }) => {
    const [value, setValue] = useState(input);

    const handleChange = (event) => {
      setValue(event.target.value);
    };

    const handleSave = () => {
      setTitle(index, value);
    };

    return (
      <div className="flex justify-center gap-2">
        <textarea
          className="mb-1 h-6 w-fit resize-none self-center overflow-hidden border-b-2 border-none border-black bg-transparent text-center"
          placeholder="Change title"
          value={value}
          onChange={handleChange}
        />
        <button onClick={handleSave}>Save</button>
      </div>
    );
  };

  const AddToList = () => {
    function handleClick() {
      setOutputList([createOutput(), ...outputList]);
    }

    return (
      <button
        onClick={() => handleClick()}
        className="border-1 hover:shadow-cyan flex w-fit cursor-pointer select-none items-center gap-3 rounded-lg border border-neutral-700  px-4 py-1 duration-200 hover:border-cyan-500 hover:text-cyan-500"
      >
        <PlusIcon className="w-3" /> Add to List
      </button>
    );
  };

  const ShowName = () => {
    return (
      <button
        onClick={() => setShowName(!showName)}
        className={
          showName
            ? "border-1 shadow-cyan flex w-fit cursor-pointer select-none items-center gap-3 self-end rounded-lg border border-cyan-500  px-4 py-1 text-cyan-500 duration-200"
            : "border-1 hover:shadow-cyan flex w-fit cursor-pointer select-none items-center gap-3 rounded-lg border border-neutral-700  px-4 py-1 duration-200 hover:border-cyan-500 hover:text-cyan-500"
        }
      >
        {showName ? (
          <CheckIcon className="w-3" />
        ) : (
          <TextIcon className="w-3" />
        )}{" "}
        Show Name
      </button>
    );
  };

  const ClearList = () => {
    const handleClick = () => {
      if (window.confirm("Are you sure you want to delete ALL combos?")) {
        setOutputList([]);
      }
    };

    return (
      <button
        onClick={handleClick}
        className="border-1 hover:shadow-cyan flex w-fit cursor-pointer select-none items-center gap-3 rounded-lg border border-neutral-700  px-4 py-1 duration-200 hover:border-cyan-500 hover:text-cyan-500"
      >
        <TrashIcon className="w-3" /> Clear List
      </button>
    );
  };

  const ShareCombo = ({ input, game }) => {
    const parseLink = (str) => {
      return str.replace(/ /g, "%20").replace(/`/g, "%60").replace(/'/g, "%27");
    };

    const handleClick = () => {
      const gameName = parseLink(game);
      const inputs = parseLink(input);

      copyToClipboard(
        `https://ygg-m.github.io/fg-input-translator/#/${gameName}/${inputs}`
      );

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <button
        onClick={handleClick}
        className={
          copied
            ? "border-1 shadow-cyan flex w-fit cursor-pointer select-none items-center gap-3 rounded-lg border border-cyan-500  px-4 py-1 text-cyan-500 duration-200"
            : "border-1 hover:shadow-cyan flex w-fit cursor-pointer select-none items-center gap-3 rounded-lg border border-neutral-700  px-4 py-1 duration-200 hover:border-cyan-500 hover:text-cyan-500"
        }
      >
        {copied ? <CheckIcon className="w-3" /> : <ShareIcon className="w-3" />}
      </button>
    );
  };

  const DeleteCombo = ({ index }) => {
    const handleClick = () => {
      if (window.confirm("Are you sure you want to delete this combo?")) {
        const newOutput = [...outputList];
        newOutput.splice(index, 1);
        setOutputList(newOutput);
      }
    };

    return (
      <button
        onClick={handleClick}
        className="border-1 hover:shadow-cyan flex w-fit cursor-pointer select-none items-center gap-3 rounded-lg border border-neutral-700  px-4 py-1 duration-200 hover:border-cyan-500 hover:text-cyan-500"
      >
        <TrashIcon className="w-3" />
      </button>
    );
  };

  useEffect(() => {
    saveToLocalStorage(JSON.stringify(outputList), "outputList");
    saveToLocalStorage(showName, "outputListShowName");
  }, [outputList, showName]);

  const setTitle = (index, title) => {
    setOutputList((prevState) => {
      const updatedList = [...prevState];
      updatedList[index].Title = title;
      return updatedList;
    });
  };

  if (rawInput.length > 0 || outputList.length > 0)
    return (
      <section className="flex w-full flex-col items-center justify-center gap-4 px-8">
        <div className="h-[1px] w-full bg-neutral-800"></div>
        <div className="flex gap-2">
          <AddToList />
          {/* <ShowName /> */}
          <ClearList />
        </div>
        {outputList.length > 0 && (
          <div className="flex w-full flex-wrap items-center justify-center gap-4">
            {outputList.map((output, index) => {
              const { Input, Game } = output;
              return (
                <div key={uuidv4()} className="flex w-full gap-2">
                  <div className="flex w-full flex-col rounded-lg bg-neutral-800 p-2">
                    {showName && (
                      <Title input={Input} index={index} setTitle={setTitle} />
                    )}
                    <div
                      className="flex w-fit flex-wrap items-center justify-center gap-y-2 self-center rounded-lg bg-neutral-900 p-2 outline outline-1 outline-neutral-700"
                      key={uuidv4()}
                    >
                      {readInputs(Input)}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <DeleteCombo />
                    <ShareCombo game={Game} input={Input} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    );
};
