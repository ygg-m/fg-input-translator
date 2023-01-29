import { Logo } from "../components/Logo";
import { ReactComponent as Discord } from "../images/ui/discord.svg";
import { ReactComponent as GitHub } from "../images/ui/github.svg";
import { ReactComponent as Kofi } from "../images/ui/kofi.svg";
import { ReactComponent as Paypal } from "../images/ui/paypal.svg";

export const Header = () => {
  return (
    <header className="cursor-default px-8 pb-8 w-screen flex flex-col gap-4 items-center justify-center border-b border-b-neutral-700 ">
      <div className="flex items-center justify-center gap-4 pt-4">
        <a
          className="flex w-8 h-8 text-base text-neutral-600 duration-200 hover:text-cyan-500 hover:drop-shadow-[0_0_16px_rgba(34,211,238,1)]"
          href="https://github.com/ygg-m/fg-input-translator"
        >
          <GitHub />
        </a>
        <a
          className="flex w-8 h-8 text-base text-neutral-600 duration-200 hover:text-cyan-500 hover:drop-shadow-[0_0_16px_rgba(34,211,238,1)]"
          href="https://discord.gg/ZapfK82Fjk"
        >
          <Discord />
        </a>
        <span className="text-neutral-700">•</span>
        <a
          className="flex w-8 h-8 text-base text-neutral-600 duration-200 hover:text-cyan-500 hover:drop-shadow-[0_0_16px_rgba(34,211,238,1)]"
          href="https://ko-fi.com/yggm_"
        >
          <Kofi />
        </a>
        <a
          className="flex w-8 h-8 text-base text-neutral-600 duration-200 hover:text-cyan-500 hover:drop-shadow-[0_0_16px_rgba(34,211,238,1)]"
          href="https://ko-fi.com/yggm_"
        >
          <Paypal />
        </a>
      </div>
      <Logo color="#444" />
      <h1>Fight Game Input Translator</h1>

      <h3>
        Translate{" "}
        <i>
          <a href="https://glossary.infil.net/?t=Numpad%20Notation">
            numpad notations
          </a>
        </i>{" "}
        into <i>visual inputs</i>!
      </h3>
    </header>
  );
};
