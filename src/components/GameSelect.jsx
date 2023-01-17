import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useInput } from "../contexts/InputContext";
import { ggacplusr, sfiii } from "../data/index";
import { ReactComponent as Chevron } from "../images/ui/chevron-down.svg";

export const GameSelect = () => {
  const { gameInputs, setGameInputs } = useInput();
  const [showList, setShowList] = useState(false);
  const [guiltyGear] = useState([ggacplusr]);
  const [streetFighter] = useState([sfiii]);
  if (!gameInputs) return;
  return (
    <div
      className={
        showList
          ? "game-selector-container show"
          : "game-selector-container hide"
      }
    >
      <div className="current-container" onClick={() => setShowList(!showList)}>
        <div className="current">
          <div className="game">{gameInputs[0]?.name}</div>
          <div className="chevron">
            <Chevron />
          </div>
        </div>
      </div>
      <div className="game-categories-container">
        <div className="game-category">
          <div className="title">
            <h4>Guilty Gear</h4>
          </div>
          <div className="games-container">
            {guiltyGear.map((game) => (
              <div
                className="game"
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
        </div>
        <div className="game-category">
          <div className="title">
            <h4>Street Fighter</h4>
          </div>
          <div className="games-container">
            {streetFighter.map((game) => (
              <div
                className="game"
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
        </div>
      </div>
    </div>
  );
};
