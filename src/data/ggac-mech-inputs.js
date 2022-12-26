const ggac_mechInputs = [
  {
    name: "Land",
    input: ["▷", "land"],
    description: "Player must land at that point in the sequence.",
    url: "../images/inputs/Mech_Land.svg",
  },
];

export { ggac_mechInputs };

const mechInputs = [
  "▷", // player must land at that point in the sequence.
  "land", // player must land at that point in the sequence.
  "dl.", // Delay the following move.
  "delay", // Delay the following move.
  "whiff", // The move must whiff (not hit).
  "(whiff)", // The move must whiff (not hit).
  "c.", // close
  "f.", // far
  "j.", // jump
  "hj.", // High Jump/Super Jump
  "sj.", // High Jump/Super Jump
  "jc", // Jump Cancel
  "hjc", // High Jump Cancel/Super Jump Cancel
  "sjc", // High Jump Cancel/Super Jump Cancel
  "dc", // Dash Cancel
  "adc", // Air Dash Cancel
  "ch", // Counter Hit
  "aa", // Anti-Air
  "iad", // Instant Air Dash
  "ji", // Jump Install
  "rc", // Roman Cancel
  "frc", // Force Roman Cancel
];
