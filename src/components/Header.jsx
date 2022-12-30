import logo from "../images/ui/Logo.svg";

export const Header = () => {
  return (
    <header className="header">
      <img src={logo} alt="Fight Game Translator Logo" />
      <h1>Fight Game Input Translator</h1>
      <span>beta 0.2</span>
      <h3>
        Translate <i>numpad notations</i> into <i>visual inputs</i>!
      </h3>
    </header>
  );
};
