import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useInput } from "../contexts/InputContext";
import { ReactComponent as ChevronIcon } from "../images/ui/chevron-down.svg";

const GameName = ({ gameInputs }) => {
  return (
    <div className="border-r-neutral-700 border-r px-4 py-1">
      {gameInputs[0]?.name}
    </div>
  );
};

const CurrentGame = ({ showList, setShowList, gameInputs }) => {
  return (
    <div
      className={
        showList
          ? "duration-200 cursor-pointer select-none w-fit flex justify-center items-center self-end rounded-full border-1 border border-transparent hover:border-cyan-500 hover:text-cyan-500 bg-neutral-800"
          : "duration-200 cursor-pointer select-none w-fit flex justify-center items-center self-end rounded-full bg-neutral-800 border-1 border border-neutral-700 hover:border-cyan-500 hover:text-cyan-500"
      }
      onClick={() => setShowList(!showList)}
    >
      <div className="flex items-center">
        <GameName gameInputs={gameInputs} />
        <Chevron />
      </div>
    </div>
  );
};

const Chevron = ({ showList }) => {
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

const GameList = ({ gameList, showList, setShowList, setGameInputs }) => {
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
          className="cursor-pointer duration-200 h-fit px-4 py-1 border border-1 border-transparent bg-neutral-800 rounded-full hover:border-cyan-500 hover:text-cyan-500"
          key={uuidv4()}
          onClick={() => {
            setShowList(false);
            setGameInputs(game);
          }}
        >
          {game[0].name}
        </div>
      ))}
    </div>
  );
};

export const GameSelect = () => {
  const { gameInputs, setGameInputs, gameList } = useInput();
  const [showList, setShowList] = useState(false);
  if (!gameInputs) return;
  return (
    <div className={showList ? "w-full flex flex-col" : "w-full flex flex-col"}>
      <CurrentGame
        showList={showList}
        setShowList={setShowList}
        gameInputs={gameInputs}
      />
      <GameList
        gameList={gameList}
        showList={showList}
        setShowList={setShowList}
        setGameInputs={setGameInputs}
      />
    </div>
  );
};
