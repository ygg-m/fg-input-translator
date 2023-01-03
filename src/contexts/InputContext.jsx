import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { TechInput } from "../components/index";
import {
  arrowLinks,
  ggacplusr,
  ggac_actionInputs,
  ggac_mechInputs,
  moveInputs,
  specialMoveInputs,
} from "../data/index";

const InputContext = createContext();

export const useInput = () => useContext(InputContext);

export const InputProvider = ({ children }) => {
  // States
  // Input
  const [rawInput, setRawInput] = useState("");
  const [output, setOutput] = useState([]);
  const [gameInputs, setGameInputs] = useState(ggac_actionInputs);
  const [gameMechs, setGameMechs] = useState(ggac_mechInputs);

  // Functions
  function testRegex(list, input) {
    return list.find((move) => {
      if (move.regex.test(input)) return move;
    });
  }

  function getMoveObject(input) {
    const mech = testRegex(ggac_mechInputs, input);
    const arrowLink = testRegex(arrowLinks, input);
    const move = testRegex(moveInputs, input);
    const special = testRegex(specialMoveInputs, input);
    const action = testRegex(ggac_actionInputs, input);

    if (special) return special;
    if (mech) return mech;
    if (arrowLink) return arrowLink;
    if (move) return move;
    if (action) return action;
    else return;
  }

  function checkInput(input) {
    // if input is empty, return the input, which should be ('')
    if (!input) return input;

    const move = getMoveObject(input);
    if (move) return createInputComponent(move);
    else return input;
  }

  function checkInputArray(array) {
    const newArray = array.map((input) => {
      if (Array.isArray(input)) return input.map((e) => checkInput(e));
      else return checkInput(input);
    });
    return newArray;
  }

  function createInputComponent(obj) {
    if (!obj) return "not found";
    return <TechInput inputObj={obj} key={uuidv4()} />;
  }

  function comboWrapper(arr) {
    if (!arr) return;
    const newArray = arr.map((el) => {
      const regex = /(>|->|~|,)/;
      const isArrow = !regex.test(el[0]?.props?.inputObj?.input);
      if (isArrow)
        return (
          <div className="combo-container" key={uuidv4()}>
            {el}
          </div>
        );
      else return el;
    });

    return newArray;
  }

  function splitSpecial(arr) {
    const mechs = matchRegex(ggac_mechInputs, arr);
    const specials = matchRegex(specialMoveInputs, mechs);
    const action = matchRegex(ggac_actionInputs, specials);
    const motion = matchMoveRegex(action);

    const result = motion;

    return result;
  }

  function matchMoveRegex(arr) {
    const regexp = /(66|44|1|2|3|4|5|6|7|8|9)/;
    let results = [];

    for (let str of arr) {
      if (Array.isArray(str)) {
        results.push(str);
        continue;
      }

      let parts = [];
      let index = 0;
      let matches = str.match(regexp);
      if (matches)
        for (let match of matches) {
          let split = str.slice(index).split(match);
          parts.push(split[0], match);
          index += split[0].length + match.length;
        }
      parts.push(str.slice(index));
      const filtered = parts.filter((e) => e !== "");
      results.push(filtered);
    }
    return results;
  }

  function matchRegex(list, arr) {
    const regexpList = list.map((e) => e.regex);
    let results = [];
    for (let str of arr) {
      if (Array.isArray(str)) {
        results.push(str);
        continue;
      }
      let found = false;
      for (let regexp of regexpList) {
        let matches = str.match(regexp);
        if (matches) {
          found = true;
          let parts = [];
          let index = 0;
          for (let match of matches) {
            let split = str.slice(index).split(match);
            parts.push(split[0], match);
            index += split[0].length + match.length;
          }
          parts.push(str.slice(index));
          const filtered = parts.filter((e) => e !== "");
          results.push(filtered);
          break;
        }
      }
      if (!found) {
        results.push(str);
      }
    }
    return results;
  }

  function splitFollowUps(str) {
    let regexp = /(>|->|~|,)/g;
    let matches = str.match(regexp);

    let parts = [];
    if (matches) {
      let index = 0;
      for (let match of matches) {
        let split = str.slice(index).split(match);

        parts.push(split[0], match);
        index += split[0].length + match.length;
      }
      parts.push(str.slice(index));
    } else parts.push(str);
    return parts;
  }

  // Render Effects
  useEffect(() => {
    const cleanInputs = rawInput.toLowerCase().replace(/ /g, "");
    const arr = splitFollowUps(cleanInputs);
    const checkedSpecials = splitSpecial(arr);
    const checkedInputs = checkInputArray(checkedSpecials);
    const comboArray = comboWrapper(checkedInputs);
    setOutput(comboArray);
  }, [rawInput]);

  const value = { setRawInput, output };

  return (
    <InputContext.Provider value={value}>{children}</InputContext.Provider>
  );
};
