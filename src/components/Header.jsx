import { Logo } from "../components/Logo";
import logo from "../images/ui/Logo.svg";

export const Header = () => {
  return (
    <header className="header">
      <Logo color="#444" />
      <h1>Fight Game Input Translator</h1>
      <span>alpha</span>
      <h3>
        Translate <i>numpad notations</i> into <i>visual inputs</i>!
      </h3>
    </header>
  );
};
