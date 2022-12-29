import doubleJump from "../images/inputs/MechDoubleJump.png";
import iad from "../images/inputs/MechIAD.png";

const ggac_mechInputs = [
  {
    name: "Land",
    input: ["▷", "land"],
    description: "Player must land at that point in the sequence.",
    url: "../images/inputs/Mech_Land.svg",
  },
  {
    name: "Delay",
    input: ["dl.", "delay"],
    description: "Delay the following move.",
    url: "../images/inputs/Mech_Delay.svg",
  },
  {
    name: "Whiff",
    input: ["whiff", "(whiff)"],
    description: "The move must whiff (not hit).",
    url: "../images/inputs/Mech_Delay.svg",
  },
  {
    name: "Close",
    input: "c.",
    description: "Player must be close to the target.",
    url: "../images/inputs/Mech_Close.svg",
  },
  {
    name: "Far",
    input: "f.",
    description: "Player must be far from the target.",
    url: "../images/inputs/Mech_Far.svg",
  },
  {
    name: "Jump",
    input: "j.",
    description: "",
    url: "../images/inputs/Mech_Jump.svg",
  },
  {
    name: "Double Jump",
    input: "dj.",
    description: "",
    url: "../images/inputs/Mech_DoubleJump.svg",
  },
  {
    name: "High Jump / Super Jump",
    input: ["hj.", "sj."],
    description: "",
    url: "../images/inputs/Mech_HighJump.svg",
  },
  {
    name: "High Jump Cancel / Super Jump Cancel",
    input: ["hjc", "sjc"],
    description: "",
    url: "../images/inputs/Mech_HighJump.svg",
  },
  {
    name: "Dash Cancel",
    input: "dc",
    description: "",
    url: "../images/inputs/Mech_DashCancel.svg",
  },
  {
    name: "Air Dash Cancel",
    input: "adc",
    description: "",
    url: "../images/inputs/Mech_AirDashCancel.svg",
  },
  {
    name: "Counter Hit",
    input: "ch",
    description: "",
    url: "../images/inputs/Mech_CounterHit.svg",
  },
  {
    name: "Anti Air",
    input: "aa",
    description: "",
    url: "../images/inputs/Mech_AntiAir.svg",
  },
  {
    name: "Instant Air Dash",
    input: "iad",
    description: "",
    url: iad,
  },
  {
    name: "Jump Install",
    input: "ji",
    description: "",
    url: "../images/inputs/Mech_JumpInstall.svg",
  },
  {
    name: "Roman Cancel",
    input: "rc",
    description: "",
    url: "../images/inputs/Mech_RomanCancel.svg",
  },
  {
    name: "Force Roman Cancel",
    input: "frc",
    description: "",
    url: "../images/inputs/Mech_ForceRomanCancel.svg",
  },
  {
    name: "Double Jump",
    input: ["88", "dj."],
    description: "",
    url: doubleJump,
    style: ["0deg", "1"],
  },
];

export { ggac_mechInputs };
