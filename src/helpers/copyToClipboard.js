export const copyToClipboard = (str) => {
  navigator.clipboard
    .writeText(str)
    .catch((err) => console.error("Failed to copy: ", err));
};
