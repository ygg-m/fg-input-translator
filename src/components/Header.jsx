import { ReactComponent as Discord } from "../images/ui/discord.svg";
import { ReactComponent as GitHub } from "../images/ui/github.svg";
import { ReactComponent as Kofi } from "../images/ui/kofi.svg";
import { ReactComponent as Logo } from "../images/ui/logo.svg";
import { ReactComponent as Paypal } from "../images/ui/paypal.svg";

export const Header = () => {
  return (
    <header className="flex w-screen cursor-default flex-col items-center justify-center gap-4 border-b border-b-neutral-800 px-8 pb-8 text-center ">
      <div className="flex items-center justify-center gap-4 pt-4 text-neutral-600">
        <a
          className="box-content flex h-8 w-8 justify-center rounded-lg border border-transparent p-2 text-base duration-200 hover:border-cyan-500 hover:text-cyan-500 hover:drop-shadow-[0_0_16px_rgba(34,211,238,1)]"
          href="https://github.com/ygg-m/fg-input-translator"
        >
          <GitHub />
        </a>
        <a
          className="box-content flex h-8 w-8 justify-center rounded-lg border border-transparent p-2 text-base duration-200 hover:border-cyan-500 hover:text-cyan-500 hover:drop-shadow-[0_0_16px_rgba(34,211,238,1)]"
          href="https://discord.gg/ZapfK82Fjk"
        >
          <Discord />
        </a>
        <span className="text-neutral-700">•</span>
        <a
          className="box-content flex h-8 w-8 justify-center rounded-lg border border-transparent p-2 text-base duration-200 hover:border-cyan-500 hover:text-cyan-500 hover:drop-shadow-[0_0_16px_rgba(34,211,238,1)]"
          href="https://ko-fi.com/yggm_"
        >
          <Kofi />
        </a>
        <a
          className="box-content flex h-8 w-8 justify-center rounded-lg border border-transparent p-2 text-base duration-200 hover:border-cyan-500 hover:text-cyan-500 hover:drop-shadow-[0_0_16px_rgba(34,211,238,1)]"
          href="https://www.paypal.com/donate/?business=3GPA48HHRS6Y6&no_recurring=0&item_name=Thank+you+so+much+for+your+kindness%21%0AYou%27re+helping+to+make+my+project+bright%21&currency_code=BRL"
        >
          <Paypal />
        </a>
      </div>
      <div className="logo-container relative text-neutral-400 duration-200 hover:text-cyan-500 hover:drop-shadow-[0_0_16px_rgba(34,211,238,0.25)]">
        <Logo />
        <span className="outline-3 absolute right-0 left-0 bottom-[-8px] mx-auto w-fit rounded-full bg-neutral-400 px-2 text-xs font-bold uppercase text-neutral-800 outline outline-neutral-900">
          alpha <span className="lowercase">v</span>0.5
        </span>
      </div>
      <h1 className="text-4xl font-bold text-neutral-400 duration-200 hover:text-cyan-500 hover:drop-shadow-[0_0_16px_rgba(34,211,238,0.75)]">
        Fight Game Input Translator
      </h1>

      <h3 className="text-xl text-neutral-400">
        Translate{" "}
        <span>
          <a
            className="hover:shadow-cyan rounded-lg border border-transparent pb-1 font-bold underline decoration-neutral-700 outline-cyan-500 duration-200 hover:border-cyan-500  hover:px-3 hover:text-cyan-500 hover:no-underline"
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
