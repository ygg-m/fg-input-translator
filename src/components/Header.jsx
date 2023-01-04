import { Logo } from "../components/Logo";
import { ReactComponent as Kofi } from "../images/ui/kofi.svg";

export const Header = () => {
  return (
    <header className="header">
      <div className="social-links">
        <a href="https://github.com/ygg-m/fg-input-translator">
          <i className="fa-brands fa-github"></i>
        </a>
        <a href="https://discord.gg/ZapfK82Fjk">
          <i className="fa-brands fa-discord"></i>
        </a>
        <a href="https://ko-fi.com/yggm_">
          <Kofi />
        </a>
      </div>
      <Logo color="#444" />
      <h1>Fight Game Input Translator</h1>

      <h3>
        Translate <i>numpad notations</i> into <i>visual inputs</i>!
      </h3>
    </header>
  );
};
