const arrowLinks = [
  {
    name: "Normal Followup",
    input: ">",
    description: "Proceed from the previous move to the following move.",
    url: "../images/inputs/ArrowLinkNormal.svg",
  },
  {
    name: "Link",
    input: ",",
    description:
      "To perform a second action after the first action completely finishes its animation.",
    url: "../images/inputs/ArrowLinkLink.svg",
  },
  {
    name: "Cancel",
    input: ["->", "~"],
    description:
      "Bypass the remaining time or frames in an action by proceeding directly into another action.",
    url: "../images/inputs/ArrowLinkCancel.svg",
  },
];

export { arrowLinks };
