import download from "downloadjs";
import * as htmlToImage from "html-to-image";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useInput } from "../contexts/InputContext";
import { copyToClipboard, dataURLtoBlob } from "../helpers";

import {
  CheckIcon,
  ChevronIcon,
  DownloadIcon,
  ImageIcon,
  PaintIcon,
  ShareIcon,
  XMarkIcon,
} from "../images/ui/index";

export const Options = () => {
  const {
    gameInputs,
    setGameInputs,
    gameList,
    showTooltip,
    setShowTooltip,
    rawInput,
    outputRef,
    chroma,
    setChroma,
  } = useInput();

  const [showList, setShowList] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!gameInputs) return;
  const { name } = gameInputs[0];

  const GameName = () => {
    return (
      <div className="border-r border-r-neutral-700 px-4 py-1">
        {gameInputs[0]?.name}
      </div>
    );
  };

  const Tooltip = () => {
    return (
      <div
        onClick={() => setShowTooltip(!showTooltip)}
        className={
          showTooltip
            ? "border-1 shadow-cyan flex w-fit cursor-pointer select-none items-center gap-3 self-end rounded-lg border border-cyan-500  px-4 py-1 text-cyan-500 duration-200"
            : "border-1 hover:shadow-cyan flex w-fit cursor-pointer select-none items-center gap-3 self-end rounded-lg border border-neutral-700  px-4 py-1 duration-200 hover:border-cyan-500 hover:text-cyan-500"
        }
      >
        {showTooltip ? (
          <CheckIcon className="h-4 w-3" />
        ) : (
          <XMarkIcon className="h-4 w-3" />
        )}
        Show Tooltip
      </div>
    );
  };

  const Chroma = () => {
    return (
      <div
        onClick={() => setChroma(!chroma)}
        className={
          chroma
            ? "border-1 shadow-cyan flex w-fit cursor-pointer select-none items-center gap-3 self-end rounded-lg border border-cyan-500  px-4 py-1 text-cyan-500 duration-200"
            : "border-1 hover:shadow-cyan flex w-fit cursor-pointer select-none items-center gap-3 self-end rounded-lg border border-neutral-700  px-4 py-1 duration-200 hover:border-cyan-500 hover:text-cyan-500"
        }
      >
        {chroma ? (
          <CheckIcon className="h-4 w-3" />
        ) : (
          <PaintIcon className="h-4 w-3" />
        )}
        Chroma
      </div>
    );
  };

  const Options = () => {
    const Button = () => {
      return (
        <button
          className={
            copied
              ? "border-1 shadow-cyan focus:shadow-cyan flex w-fit cursor-pointer select-none items-center justify-center gap-3 rounded-lg border border-cyan-500 px-4 py-1 text-cyan-500 duration-200 focus:border-cyan-500 focus:text-cyan-500"
              : "border-1 hover:shadow-cyan focus:shadow-cyan flex w-fit cursor-pointer select-none items-center justify-center gap-3 rounded-lg border border-neutral-700 px-4 py-1 duration-200 hover:border-cyan-500 hover:text-cyan-500 focus:border-cyan-500 focus:text-cyan-500"
          }
          type="button"
          aria-haspopup="true"
          aria-expanded="true"
          aria-controls="headlessui-menu-items-117"
        >
          <span>{copied ? "Copied!" : "Share"}</span>
          <ChevronIcon className="box-content w-4" />
        </button>
      );
    };

    const CopyLink = () => {
      const handleClick = () => {
        const gameName = name.replace(/ /g, "%20");
        const inputs = rawInput.replace(/ /g, "%20");
        copyToClipboard(
          `https://ygg-m.github.io/fg-input-translator/${gameName}/${inputs}`
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      };
      return (
        <div
          onClick={() => handleClick()}
          className="hover:shadow-cyan flex cursor-pointer items-center gap-2 px-4 hover:text-cyan-500"
        >
          <ShareIcon className="w-4" />
          <p className="ml-2 truncate border-l border-neutral-700 py-2 pl-3">
            Copy Link
          </p>
        </div>
      );
    };

    const CopyImage = () => {
      function handleClick() {
        const node = outputRef.current;
        htmlToImage
          .toPng(node)
          .then(function (dataUrl) {
            const blob = dataURLtoBlob(dataUrl);
            navigator.clipboard.write([
              new ClipboardItem({
                [blob.type]: blob,
              }),
            ]);
          })
          .catch(function (error) {
            console.error("oops, something went wrong!", error);
          });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      return (
        <div
          onClick={() => handleClick()}
          className="hover:shadow-cyan flex cursor-pointer items-center gap-2 px-4 hover:text-cyan-500"
        >
          <ImageIcon className="w-4" />
          <p className="ml-2 truncate border-l border-neutral-700 py-2 pl-3">
            Copy Image (PNG)
          </p>
        </div>
      );
    };

    const DownloadImage = () => {
      function handleClick() {
        const node = outputRef.current;
        htmlToImage.toPng(node).then(function (dataUrl) {
          download(dataUrl, "combo-output.png");
        });
      }
      return (
        <div
          onClick={() => handleClick()}
          className="hover:shadow-cyan flex cursor-pointer items-center gap-2 px-4 hover:text-cyan-500"
        >
          <DownloadIcon className="w-4" />
          <p className="ml-2 truncate border-l border-neutral-700 py-2 pl-3">
            Download (PNG)
          </p>
        </div>
      );
    };

    return (
      <div className="dropdown relative z-40 inline-block">
        <Button />
        <div className="dropdown-menu invisible origin-top-right -translate-y-2 scale-95 transform opacity-0 transition-all duration-200">
          <div
            className="absolute left-0 mt-2 w-56 origin-top-right divide-y divide-neutral-700 rounded-md border border-neutral-700 bg-neutral-900 text-neutral-400  shadow-lg outline-none"
            aria-labelledby="headlessui-menu-button-1"
            id="headlessui-menu-items-117"
            role="menu"
          >
            <CopyLink />
            <CopyImage />
            <DownloadImage />
          </div>
        </div>
      </div>
    );
  };

  // main component
  return (
    <div className="flex w-full flex-col rounded-lg bg-neutral-900 p-1">
      <div className="flex w-full justify-between">
        <div className="flex gap-2">
          <Tooltip />
          <Chroma />
          <Options />
        </div>
        <div
          className={
            showList
              ? "border-1 shadow-cyan flex w-fit cursor-pointer select-none items-center justify-center self-end rounded-lg border border-cyan-500  text-cyan-500 duration-200"
              : "border-1 hover:shadow-cyan flex w-fit cursor-pointer select-none items-center justify-center self-end rounded-lg border border-neutral-700  duration-200 hover:border-cyan-500 hover:text-cyan-500"
          }
          onClick={() => setShowList(!showList)}
        >
          <div className="flex items-center">
            <GameName />
            <div
              className={
                showList
                  ? "box-content w-4 rotate-90 px-3 duration-200 "
                  : "box-content w-4 px-3 duration-200"
              }
            >
              <ChevronIcon />
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          showList
            ? "visible mt-4 flex gap-2 self-end opacity-100 duration-200"
            : "invisible flex h-0 gap-2 self-end  opacity-0 duration-200"
        }
      >
        {gameList.map((game) => (
          <div
            className="border-1 hover:shadow-cyan h-fit cursor-pointer rounded-lg border border-neutral-700  py-1 px-2 duration-200 hover:border-cyan-500 hover:px-4 hover:text-cyan-500"
            key={uuidv4()}
            onClick={() => {
              setGameInputs(game);
              setShowList(false);
            }}
          >
            {game[0].name}
          </div>
        ))}
      </div>
    </div>
  );
};
