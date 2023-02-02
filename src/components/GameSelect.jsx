import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useInput } from "../contexts/InputContext";
import { ReactComponent as CheckIcon } from "../images/ui/check.svg";
import { ReactComponent as ChevronIcon } from "../images/ui/chevron-down.svg";
import { ReactComponent as XMarkIcon } from "../images/ui/xmark.svg";

export const GameSelect = () => {
  const { gameInputs, setGameInputs, gameList, showTooltip, setShowTooltip } =
    useInput();
  const [showList, setShowList] = useState(false);
  if (!gameInputs) return;

  const GameName = () => {
    return (
      <div className="border-r border-r-neutral-700 px-4 py-1">
        {gameInputs[0]?.name}
      </div>
    );
  };

  // main component
  return (
    <div className="flex flex-col">
      <div className="flex w-full justify-between">
        <div
          className={
            showTooltip
              ? "border-1 shadow-cyan flex w-fit cursor-pointer select-none items-center justify-center self-end rounded-lg border border-cyan-500 px-4 py-1 text-cyan-500 duration-200"
              : "border-1 hover:shadow-cyan flex w-fit cursor-pointer select-none items-center justify-center self-end rounded-lg border border-neutral-700 px-4 py-1 duration-200 hover:border-cyan-500 hover:text-cyan-500"
          }
          onClick={() => setShowTooltip(!showTooltip)}
        >
          {showTooltip ? (
            <span className="flex items-center gap-2">
              <CheckIcon className="h-4 w-3" />
              Tooltip
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <XMarkIcon className="h-4 w-3" />
              Tooltip
            </span>
          )}
        </div>
        <div
          className={
            showList
              ? "border-1 shadow-cyan flex w-fit cursor-pointer select-none items-center justify-center self-end rounded-lg border border-cyan-500 text-cyan-500 duration-200"
              : "border-1 hover:shadow-cyan flex w-fit cursor-pointer select-none items-center justify-center self-end rounded-lg border border-neutral-700 duration-200 hover:border-cyan-500 hover:text-cyan-500"
          }
          onClick={() => setShowList(!showList)}
        >
          <div className="flex items-center">
            <GameName />
            <div
              className={
                showList
                  ? "box-content w-4 rotate-90 px-3 duration-200 "
                  : "box-content w-4 px-3 duration-200"
              }
            >
              <ChevronIcon />
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          showList
            ? "visible mt-4 flex gap-2 self-end opacity-100 duration-200"
            : "invisible flex h-0 gap-2 self-end  opacity-0 duration-200"
        }
      >
        {gameList.map((game) => (
          <div
            className="border-1 hover:shadow-cyan h-fit cursor-pointer rounded-lg border border-neutral-800 py-1 px-2 duration-200 hover:border-cyan-500 hover:px-4 hover:text-cyan-500"
            key={uuidv4()}
            onClick={() => {
              setGameInputs(game);
              setShowList(false);
            }}
          >
            {game[0].name}
          </div>
        ))}
      </div>
    </div>
  );
};
