import _ from "lodash";
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
  // const [gameInputs, setGameInputs] = useState(ggac_actionInputs);
  // const [gameMechs, setGameMechs] = useState(ggac_mechInputs);

  // // Functions
  // function testRegex(list, input) {
  //   return list.find((move) => {
  //     if (move.regex.test(input)) return move;
  //   });
  // }

  // function getMoveObject(input) {
  //   const mech = testRegex(ggac_mechInputs, input);
  //   const arrowLink = testRegex(arrowLinks, input);
  //   const move = testRegex(moveInputs, input);
  //   const special = testRegex(specialMoveInputs, input);
  //   const action = testRegex(ggac_actionInputs, input);

  //   if (special) return special;
  //   if (mech) return mech;
  //   if (arrowLink) return arrowLink;
  //   if (move) return move;
  //   if (action) return action;
  //   else return;
  // }

  // function checkInput(input) {
  //   // if input is empty, return the input, which should be ('')
  //   if (!input) return input;

  //   const move = getMoveObject(input);
  //   if (move) return createInputComponent(move);
  //   else return input;
  // }

  // function checkInputArray(array) {
  //   const newArray = array.map((input) => {
  //     if (Array.isArray(input)) return input.map((e) => checkInput(e));
  //     else return checkInput(input);
  //   });
  //   return newArray;
  // }

  // function createInputComponent(obj) {
  //   if (!obj) return "not found";
  //   return <TechInput inputObj={obj} key={uuidv4()} />;
  // }

  // function comboWrapper(arr) {
  //   if (!arr) return;
  //   const newArray = arr.map((el) => {
  //     const regex = /(>|->|~|,)/;
  //     const isArrow = !regex.test(el[0]?.props?.inputObj?.input);
  //     if (isArrow)
  //       return (
  //         <div className="combo-container" key={uuidv4()}>
  //           {el}
  //         </div>
  //       );
  //     else return el;
  //   });

  //   return newArray;
  // }

  // function splitSpecial(arr) {
  //   const all = matchRegexList(ggacplusr, arr);
  //   const mechs = matchRegexList(ggac_mechInputs, arr);
  //   const specials = matchRegexList(specialMoveInputs, mechs);
  //   const action = matchRegexList(ggac_actionInputs, specials);
  //   const motion = matchMoveRegex(action);

  //   const result = motion;

  //   return result;
  // }

  // function matchMoveRegex(arr) {
  //   const regexp = /(66|44|1|2|3|4|5|6|7|8|9)/;
  //   let results = [];

  //   for (let str of arr) {
  //     if (Array.isArray(str)) {
  //       results.push(str);
  //       continue;
  //     }

  //     let parts = [];
  //     let index = 0;
  //     let matches = str.match(regexp);
  //     if (matches)
  //       for (let match of matches) {
  //         let split = str.slice(index).split(match);
  //         parts.push(split[0], match);
  //         index += split[0].length + match.length;
  //       }
  //     parts.push(str.slice(index));
  //     const filtered = parts.filter((e) => e !== "");
  //     results.push(filtered);
  //   }
  //   return results;
  // }

  // function matchRegexList(list, arr) {
  //   const regexpList = list.map((e) => e.regex);
  //   let results = [];
  //   for (let str of arr) {
  //     if (Array.isArray(str)) {
  //       results.push(str);
  //       continue;
  //     }
  //     let found = false;
  //     for (let regexp of regexpList) {
  //       let matches = str.match(regexp);
  //       if (matches) {
  //         found = true;
  //         let parts = [];
  //         let index = 0;
  //         for (let match of matches) {
  //           let split = str.slice(index).split(match);
  //           parts.push(split[0], match);
  //           index += split[0].length + match.length;
  //         }
  //         parts.push(str.slice(index));
  //         const filtered = parts.filter((e) => e !== "");
  //         results.push(filtered);
  //         break;
  //       }
  //     }
  //     if (!found) {
  //       results.push(str);
  //     }
  //   }
  //   return results;
  // }

  function splitCombo(arr) {
    let regexList = [/>/, /->|~/, /,/];

    const subArrays = _.reduce(
      arr,
      (result, item) => {
        if (_.some(regexList, (regex) => !regex.test(item))) {
          result.push([item]);
        } else if (result.length) {
          _.last(result).push(item);
        }
        return result;
      },
      []
    );

    return subArrays;
  }

  function splitFollowUps(str) {
    let regex = /(>|->|~|,)/g;
    const subStr = str.split(regex);
    return subStr;
  }

  function wrapCombos(arr) {
    const regex = /(>|->|~|,)/g;

    const subArrays = _.map(arr, (item) => {
      if (!regex.test(item)) {
        return [item];
      } else return item;
    });

    return subArrays;
  }

  function createRegex(moveList) {
    const regexes = moveList.map((e) => e.regex);
    return new RegExp(`(
      ${regexes.map((regex) => regex.source).join("|")})`);
  }

  function splitCombos(arr) {
    const regexes = createRegex(ggacplusr);

    const subArrays = arr.map((item) => {
      // check if it's an array
      if (Array.isArray(item)) {
        // map the array
        const result = item.map((e) => {
          // if array is empty, return the item, which should be ''
          if (e.length === 0) return e;
          // else, split the array based on the regex
          else
            return e
              .split(regexes)
              .filter((e) => e !== "")
              .filter((e) => e !== undefined);
        });

        return _.flatten(result);
      }
      // if it's not an array, return the item
      else return item;
    });

    return subArrays;
  }

  // Render Effects
  useEffect(() => {
    setRawInput(
      "236S -> 46S -> 63214S > FRC > IAD > j.H > 2S > j.PS > dj.S > Keygrab"
    );

    const cleanInputs = rawInput.toLowerCase().replace(/ /g, "");
    const arr = splitFollowUps(cleanInputs);
    const wrappedCombos = wrapCombos(arr);
    const splittedCombos = splitCombos(wrappedCombos);
    // const checkedSpecials = splitSpecial(arr);
    // const checkedInputs = checkInputArray(checkedSpecials);
    // const comboArray = comboWrapper(checkedInputs);

    // const all = matchRegex2(cleanInputs);
    // console.log(all);

    // setOutput(comboArray);
    // =================================================================
    // =================================================================

    console.log(splittedCombos);
  }, [rawInput]);

  const value = { setRawInput, output };

  return (
    <InputContext.Provider value={value}>{children}</InputContext.Provider>
  );
};
