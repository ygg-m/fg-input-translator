import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useInput } from "../contexts/InputContext";
import { ReactComponent as ChevronIcon } from "../images/ui/chevron-down.svg";

export const GameSelect = () => {
  const { gameInputs, setGameInputs, gameList } = useInput();
  const [showList, setShowList] = useState(false);
  if (!gameInputs) return;

  // current game
  const CurrentGame = () => {
    return (
      <div
        className={
          showList
            ? "duration-200 cursor-pointer select-none w-fit flex justify-center items-center self-end rounded-lg border-1 border border-neutral-700 hover:border-cyan-500 hover:text-cyan-500"
            : "duration-200 cursor-pointer select-none w-fit flex justify-center items-center self-end rounded-lg border-1 border border-cyan-500 text-cyan-500 shadow-cyan"
        }
        onClick={() => setShowList(!showList)}
      >
        <div className="flex items-center">
          <GameName />
          <Chevron />
        </div>
      </div>
    );
  };

  const GameName = () => {
    return (
      <div className="border-r-neutral-700 border-r px-4 py-1">
        {gameInputs[0]?.name}
      </div>
    );
  };

  const Chevron = () => {
    return (
      <div
        className={
          showList
            ? "box-content duration-200 w-4 px-3 rotate-90 "
            : "box-content duration-200 w-4 px-3"
        }
      >
        <ChevronIcon />
      </div>
    );
  };

  // game list
  const GameList = () => {
    return (
      <div
        className={
          showList
            ? "duration-200 h-0 flex self-end gap-2 invisible opacity-0"
            : "duration-200 h-fit flex self-end gap-2 visible opacity-100 mt-4"
        }
      >
        {gameList.map((game) => (
          <div
            className="cursor-pointer duration-200 h-fit py-1 px-2 hover:px-4 border border-1 border-neutral-800 rounded-lg hover:border-cyan-500 hover:text-cyan-500 hover:shadow-cyan"
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
    );
  };

  // main component
  return (
    <div className={showList ? "w-full flex flex-col" : "w-full flex flex-col"}>
      <CurrentGame />
      <GameList />
    </div>
  );
};
