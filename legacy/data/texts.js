import {
  blazblue,
  followUp,
  guiltyGear,
  kingOfFighters,
  moveInputs,
  persona,
  specialInputs,
  streetFighter,
  techPatterns,
  themsFightinHerds,
} from "../data/index";

import { wrapMechs } from "../data/wrapMechs.js";

export const texts = [
  {
    button: "About",
    title: "What is this all about?",
    text: [
      "This website can translate Numpad Inputs into Visual Inputs commonly used by official guides of fighting games.",
      "![Gif Showing a Numbpad Input being converted to Visual Input](https://i.imgur.com/gnc7E3P.gif)",
      "If you don't know what Numpad Inputs are, I sugest you visit it's definition in the [Fighting Game Glossary](https://glossary.infil.net/?t=Numpad%20Notation)",
      "You can use this website to undersand and learn more about the notepad notation while you learn how to combo and even practice writing and playing with it.",
      "There's a Tooltip for every input to help you understand better each one of then.",
      "![Gif Showing the tooltips that appear once you pass the mouse over the visual inputs](https://i.imgur.com/db72HjI.gif)",
      "You can even make some complex combos using *Repeat* and *Optional* notations.",
      "![Gif Showing Repeat and Optionals notations being converted to an easier to understand visual input](https://i.imgur.com/uOo1gNc.gif)",
      "In theory, most combos will work if you paste then into the input field, but as the tag bellow the website icon says: It's in Aplha version! So bugs are expected. If you find one, be sure to contact me at [Twitter](https://twitter.com/yggm_) or join my [Discord](https://discord.gg/ZapfK82Fjk), there's a special place there to give feedbacks about my projects. This includes if I missed some game mechanic.",
      "Be aware that numpad notation is something created by the community. So there isn't a single way to write then. This input translator will try to recognize most ways people find to take notes about combos and inputs, but you may find some that doesn't.",
      "My starting point to code this was [Dustloop](dustloop.com/) so it should work with most of the notation rules there.",
      "Feel free to give me any sugestions about what type of input you think this website should read or what next game should it read.",
      "My goals is to make it read every mechanic from every major fighting game.",
    ],
  },
  {
    button: "All Inputs",
    title: "Every Input Supported",
    text: [
      "If there's any Input you want the website to read, reach me out in [Twitter](https://twitter.com/yggm_) or [Discord](https://discord.gg/ZapfK82Fjk)  ",
    ],
    inputs: [
      followUp,
      moveInputs,
      specialInputs,
      techPatterns,
      wrapMechs,
      guiltyGear,
      streetFighter,
      kingOfFighters,
      blazblue,
      persona,
      themsFightinHerds,
    ],
  },
];
