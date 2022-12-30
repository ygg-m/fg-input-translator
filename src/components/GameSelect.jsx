import chevron from "../images/ui/chevron-down.svg";

export const GameSelect = () => {
  return (
    <div className="game-selector">
      <div className="current">
        <div className="game">Guilty Gear XX Accent Core Plus R</div>
        <div className="chevron">
          <img src={chevron} alt="Select Game Arrow Down" />
        </div>
      </div>
    </div>
  );
};
