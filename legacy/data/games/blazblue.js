// actions
import { BB_A, BB_B, BB_C, BB_D } from "../index";

export const blazblue = [
  {
    name: "Blazblue",
    input: [],
    type: "",
    regex: /(?!)/,
    description: "",
    img: "",
  },
  // -------------------------------------------------------------------------
  // mechanics
  // -------------------------------------------------------------------------
  {
    name: "Rapid Cancel",
    input: ["RC", "Rapíd Cancel"],
    type: "",
    regex: /RC/i,
    description:
      "ABC when an attack lands. Rapid Cancels cancels your attack and returns you to a neutral state. This can be used to extend combos, create offensive situations, or reduce the risk of other situations.",
    moreLink:
      "https://www.dustloop.com/w/BBCF/Controls#:~:text=Rapid%20Cancel%20COSTS,of%20other%20situations.",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "Overdrive Cancel",
    input: ["ODc", "cOD", "ODC", "OD Cancel"],
    type: "",
    regex: /ODc|cOD|ODC|OD Cancel/i,
    description:
      "You can cancel into Overdrive almost anytime you can cancel into a special move. While this is indeed very powerful, cancelling into Overdrive cuts your Overdrive time by half, so use your time wisely!",
    moreLink: "https://www.dustloop.com/w/BBCF/Offense#Overdrive_Cancel",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "Overdrive",
    input: ["OD", "Overdrive"],
    type: "",
    regex: /OD/i,
    description:
      "ABCD while standing or airborne. Overdrive requires a full Burst Gauge to activate. Once activated, Overdrive places the character in a temporarily powered up state, which varies by character.",
    moreLink: "https://www.dustloop.com/w/BBCF/Offense#Overdrive",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "Exceed Accel",
    input: ["EA"],
    type: "",
    regex: /EA/i,
    description:
      "5ABCD during Overdrive. It's a cinematic super that has a handful of unique properties.",
    moreLink: "https://www.dustloop.com/w/BBCF/Offense#Exceed_Accel",
    moreName: "Dustloop",
    img: "",
  },
  // Azrael
  {
    name: "Weak / Tipper",
    input: ["!"],
    type: "",
    regex: /!/i,
    description:
      "For Azrael: The move before must consume a weakpoint. For Mai Natsume: Move must be made during her command dash (236). ",
    moreLink: "",
    moreName: "",
    img: "",
  },
  // Bullet
  {
    name: "Heat Up Lv0",
    input: ["H0"],
    type: "",
    regex: /H0/i,
    description:
      "By holding down the D button, Bullet creates a growing orange circle around her. Bullet notation. If the opponent is inside this circle, release the D button to launch Bullet at the opponent. Bullet gains a Heat Up level any time she lands hits with her Drive. At Heat Level 1 (H1) she has an orange silhouette, at Heat Level 2 (H2) she has a red silhouette. Bullet starts every round with Heat Level 0 (H0).",
    moreLink:
      "https://www.dustloop.com/w/BBCF/Bullet#:~:text=By%20holding%20down%20the%20D%20button%2C%20Bullet%20creates%20a%20growing%20orange%20circle%20around%20her.%20If%20the%20opponent%20is%20inside%20this%20circle%2C%20release%20the%20D%20button%20to%20launch%20Bullet%20at%20the%20opponent.%20If%20the%20opponent%20is%20outside%20the%20ring%2C%20releasing%20D%20will%20cause%20her%20to%20leave%20the%20stance.",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "Heat Up Lv1",
    input: ["H1"],
    type: "",
    regex: /H1/i,
    description:
      "By holding down the D button, Bullet creates a growing orange circle around her. Bullet notation. If the opponent is inside this circle, release the D button to launch Bullet at the opponent. Bullet gains a Heat Up level any time she lands hits with her Drive. At Heat Level 1 (H1) she has an orange silhouette, at Heat Level 2 (H2) she has a red silhouette. Bullet starts every round with Heat Level 0 (H0).",
    moreLink:
      "https://www.dustloop.com/w/BBCF/Bullet#:~:text=By%20holding%20down%20the%20D%20button%2C%20Bullet%20creates%20a%20growing%20orange%20circle%20around%20her.%20If%20the%20opponent%20is%20inside%20this%20circle%2C%20release%20the%20D%20button%20to%20launch%20Bullet%20at%20the%20opponent.%20If%20the%20opponent%20is%20outside%20the%20ring%2C%20releasing%20D%20will%20cause%20her%20to%20leave%20the%20stance.",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "Heat Up Lv2",
    input: ["H2"],
    type: "",
    regex: /H2/i,
    description:
      "By holding down the D button, Bullet creates a growing orange circle around her. Bullet notation. If the opponent is inside this circle, release the D button to launch Bullet at the opponent. Bullet gains a Heat Up level any time she lands hits with her Drive. At Heat Level 1 (H1) she has an orange silhouette, at Heat Level 2 (H2) she has a red silhouette. Bullet starts every round with Heat Level 0 (H0).",
    moreLink:
      "https://www.dustloop.com/w/BBCF/Bullet#:~:text=By%20holding%20down%20the%20D%20button%2C%20Bullet%20creates%20a%20growing%20orange%20circle%20around%20her.%20If%20the%20opponent%20is%20inside%20this%20circle%2C%20release%20the%20D%20button%20to%20launch%20Bullet%20at%20the%20opponent.%20If%20the%20opponent%20is%20outside%20the%20ring%2C%20releasing%20D%20will%20cause%20her%20to%20leave%20the%20stance.",
    moreName: "Dustloop",
    img: "",
  },
  // Celica A. Mercury
  {
    name: "Backfire",
    input: ["bf"],
    type: "",
    regex: /bf/i,
    description:
      "When using Lance Quiche (214C) enhanced, also produces a backfire behind Minerva that juggles and drags opponents behind Celica. Celica A. Mercury notation.",
    moreLink: "https://www.dustloop.com/w/BBCF/Celica_A._Mercury#Lance_Quiche",
    moreName: "Dustloop",
    img: "",
  },
  // Litchi Faye Ling
  {
    name: "Mantenbou",
    input: ["m"],
    type: "",
    regex: /m/i,
    description:
      "Refers to an attack while holding the Mantenbou. Litchi Faye Ling notation. Mantenbou is a mode changing mechanic that allows her to switch between fighting with Mantenbou, her staff, and placing it on the ground to fight empty-handed. Litchi has access to different attacks when she is switching between these two modes.",
    moreLink:
      "https://www.dustloop.com/w/BBCF/Litchi_Faye_Ling#:~:text=Drive%3A%20Mantenbou,with%20Mantenbou%20equipped.",
    moreName: "Dustloop",
    img: "",
  },
  // Naoto Kurogane
  {
    name: "Enhanced",
    input: ["En"],
    type: "",
    regex: /En/i,
    description: "Enhanced version of a special must be used.",
    moreLink: "",
    moreName: "",
    img: "",
  },
  {
    name: "Empty Handed",
    input: ["e"],
    type: "",
    regex: /e/i,
    description:
      "Refers to an attack while empty handed. Litchi Faye Ling notation. Mantenbou is a mode changing mechanic that allows her to switch between fighting with Mantenbou, her staff, and placing it on the ground to fight empty-handed. Litchi has access to different attacks when she is switching between these two modes.",
    moreLink:
      "https://www.dustloop.com/w/BBCF/Litchi_Faye_Ling#:~:text=Drive%3A%20Mantenbou,with%20Mantenbou%20equipped.",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "Staff 1",
    input: ["Staff1"],
    type: "",
    regex: /Staff1/i,
    description:
      "The first hit of the staff launch. Litchi Faye Ling notation.",
    moreLink: "https://www.dustloop.com/w/BBCF/Litchi_Faye_Ling#Staff_Launch",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "Staff 2",
    input: ["Staff2"],
    type: "",
    regex: /Staff2/i,
    description:
      "The second hit of the staff launch. Litchi Faye Ling notation.",
    moreLink: "https://www.dustloop.com/w/BBCF/Litchi_Faye_Ling#Staff_Launch",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "Tsubame Gaeshi",
    input: ["Tsubame", "DP"],
    type: "",
    regex: /Tsubame|DP/i,
    description: "Tsubame Gaeshi (623Dm). Litchi Faye Ling notation.",
    moreLink: "https://www.dustloop.com/w/BBCF/Litchi_Faye_Ling#Tsubame_Gaeshi",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "Itsuu A",
    input: ["ItsuuA"],
    type: "",
    regex: /ItsuuA/i,
    description: "41236A to cancel stance. Litchi Faye Ling notation.",
    moreLink:
      "https://www.dustloop.com/w/BBCF/Litchi_Faye_Ling#Straight_Through_(Itsuu)",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "Itsuu B",
    input: ["ItsuuB"],
    type: "",
    regex: /ItsuuB/i,
    description: "41236B to cancel stance. Litchi Faye Ling notation.",
    moreLink:
      "https://www.dustloop.com/w/BBCF/Litchi_Faye_Ling#Straight_Through_(Itsuu)",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "Itsuu C",
    input: ["ItsuuC"],
    type: "",
    regex: /ItsuuC/i,
    description: "41236C to cancel stance. Litchi Faye Ling notation.",
    moreLink:
      "https://www.dustloop.com/w/BBCF/Litchi_Faye_Ling#Straight_Through_(Itsuu)",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "Itsuu D",
    input: ["ItsuuD"],
    type: "",
    regex: /ItsuuD/i,
    description: "41236D to cancel stance. Litchi Faye Ling notation.",
    moreLink:
      "https://www.dustloop.com/w/BBCF/Litchi_Faye_Ling#Straight_Through_(Itsuu)",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "Ikkitsuukan",
    input: ["Ikkitsuukan"],
    type: "",
    regex: /Ikkitsuukan/i,
    description: "41236A/B/C/D to cancel stance. Litchi Faye Ling notation.",
    moreLink:
      "https://www.dustloop.com/w/BBCF/Litchi_Faye_Ling#Straight_Through_(Itsuu)",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "4 Kote",
    input: ["4Kote"],
    type: "",
    regex: /4Kote/i,
    description: "Kote Gaeshi 421D. Litchi Faye Ling notation.",
    moreLink: "https://www.dustloop.com/w/BBCF/Litchi_Faye_Ling#Kote_Gaeshi",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "6 Kote",
    input: ["6Kote"],
    type: "",
    regex: /6Kote/i,
    description: "Kote Gaeshi 623D. Litchi Faye Ling notation.",
    moreLink: "https://www.dustloop.com/w/BBCF/Litchi_Faye_Ling#Kote_Gaeshi",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "Kote Gaeshi",
    input: ["Kote Gaeshi"],
    type: "",
    regex: /Kote Gaeshi/i,
    description: "Kote Gaeshi 623D. Litchi Faye Ling notation.",
    moreLink: "https://www.dustloop.com/w/BBCF/Litchi_Faye_Ling#Kote_Gaeshi",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "Overdrive",
    input: ["Daisharin(Overdrive)"],
    type: "",
    regex: /Daisharin\(Overdrive\)/i,
    description:
      "ABCD while standing or airborne. Overdrive requires a full Burst Gauge to activate. Once activated, Overdrive places the character in a temporarily powered up state, which varies by character.",
    moreLink: "https://www.dustloop.com/w/BBCF/Offense#Overdrive",
    moreName: "Dustloop",
    img: "",
  },
  // Mai Natsume
  {
    name: "Whiff",
    input: ["x"],
    type: "",
    regex: /x/i,
    description: "Whiff (not hit) the move before.",
    moreLink: "",
    moreName: "",
    img: "",
  },
  {
    name: "Banishing Fang: Bash",
    input: ["236BBB"],
    type: "",
    regex: /236BBB/i,
    description:
      "Long notation: 236B~236B~236B. Notation used to shorten the Rekka from Naoto Kurogane that ends with 236B.",
    moreLink:
      "https://www.dustloop.com/w/BBCF/Naoto_Kurogane#Banishing_Fang:_Bash",
    moreName: "Dustloop",
    img: "",
  },
  {
    name: "Banishing Fang: Raid",
    input: ["236BBC"],
    type: "",
    regex: /236BBC/i,
    description:
      "Long notation: 236B~236B~236C. Notation used to shorten the Rekka from Naoto Kurogane that ends with 236C.",
    moreLink:
      "https://www.dustloop.com/w/BBCF/Naoto_Kurogane#Banishing_Fang:_Raid",
    moreName: "Dustloop",
    img: "",
  },
  // Noel Vermillion
  {
    name: "Drive Attack",
    input: ["d."],
    type: "",
    regex: /d./i,
    description:
      "Noel Vermillion's Drives function in two different ways. Upon pressing the D button, Noel uses a Drive attack that is basically just a normal attack. Afterwards however, Noel's normal moves are effectively replaced with a different set of normal moves until she returns to neutral again.",
    moreLink:
      "https://www.dustloop.com/w/BBCF/Noel_Vermillion#:~:text=Drive%3A%20Chain%20Revolver,to%20neutral%20again.",
    moreName: "Dustloop",
    img: "",
  },

  // -------------------------------------------------------------------------
  // actions
  // -------------------------------------------------------------------------
  {
    name: "A",
    input: ["A"],
    type: "action",
    regex: /A/,
    description: "",
    img: <BB_A />,
  },
  {
    name: "B",
    input: ["B"],
    type: "action",
    regex: /B/,
    description: "",
    img: <BB_B />,
  },
  {
    name: "C",
    input: ["C"],
    type: "action",
    regex: /C/,
    description: "",
    img: <BB_C />,
  },
  {
    name: "D",
    input: ["D"],
    type: "action",
    regex: /D/,
    description: "",
    img: <BB_D />,
  },
];
