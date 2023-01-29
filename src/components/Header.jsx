import { ReactComponent as Discord } from "../images/ui/discord.svg";
import { ReactComponent as GitHub } from "../images/ui/github.svg";
import { ReactComponent as Kofi } from "../images/ui/kofi.svg";
import { ReactComponent as Logo } from "../images/ui/logo.svg";
import { ReactComponent as Paypal } from "../images/ui/paypal.svg";

export const Header = () => {
  return (
    <header className="cursor-default px-8 pb-8 w-screen flex flex-col gap-4 items-center justify-center border-b border-b-neutral-700 ">
      <div className="flex items-center justify-center gap-4 pt-4 text-neutral-600">
        <a
          className="box-content flex w-8 h-8 text-base duration-200 border p-2 border-transparent rounded-lg hover:border-cyan-500 hover:text-cyan-500 hover:drop-shadow-[0_0_16px_rgba(34,211,238,1)]"
          href="https://github.com/ygg-m/fg-input-translator"
        >
          <GitHub />
        </a>
        <a
          className="flex w-8 h-8 text-base duration-200 box-content border p-2 border-transparent rounded-lg hover:border-cyan-500 hover:text-cyan-500 hover:drop-shadow-[0_0_16px_rgba(34,211,238,1)]"
          href="https://discord.gg/ZapfK82Fjk"
        >
          <Discord />
        </a>
        <span className="text-neutral-700">•</span>
        <a
          className="flex w-8 h-8 text-base duration-200 box-content border p-2 border-transparent rounded-lg hover:border-cyan-500 hover:text-cyan-500 hover:drop-shadow-[0_0_16px_rgba(34,211,238,1)]"
          href="https://ko-fi.com/yggm_"
        >
          <Kofi />
        </a>
        <a
          className="flex w-8 h-8 text-base duration-200 box-content border p-2 border-transparent rounded-lg hover:border-cyan-500 hover:text-cyan-500 hover:drop-shadow-[0_0_16px_rgba(34,211,238,1)]"
          href="https://ko-fi.com/yggm_"
        >
          <Paypal />
        </a>
      </div>
      <div className="relative logo-container duration-200 text-neutral-500 hover:text-cyan-500 hover:drop-shadow-[0_0_16px_rgba(34,211,238,0.25)]">
        <Logo />
        <span className="absolute w-fit right-0 left-0 mx-auto bottom-[-8px] bg-neutral-500 font-bold text-neutral-800 uppercase text-xs rounded-full px-2 outline outline-3 outline-neutral-800">
          alpha
        </span>
      </div>
      <h1 className="text-4xl duration-200 font-bold text-neutral-500 hover:text-cyan-500 hover:drop-shadow-[0_0_16px_rgba(34,211,238,0.75)]">
        Fight Game Input Translator
      </h1>

      <h3 className="text-xl text-neutral-500">
        Translate{" "}
        <span>
          <a
            className="font-bold duration-200 border border-transparent rounded-lg pb-1 hover:px-3 hover:border-cyan-500  outline-cyan-500 hover:text-cyan-500 hover:drop-shadow-[0_0_16px_rgba(34,211,238,0.75)]"
            href="https://glossary.infil.net/?t=Numpad%20Notation"
          >
            numpad notations
          </a>
        </span>{" "}
        into{" "}
        <span className="font-bold duration-200 hover:text-cyan-500 hover:drop-shadow-[0_0_16px_rgba(34,211,238,0.75)]">
          visual inputs
        </span>
        !
      </h3>
    </header>
  );
};
