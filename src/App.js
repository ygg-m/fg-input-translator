import { TooltipProvider } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { Footer, GameSelect, Header, Input, Output } from "./components/index";
import { InputProvider } from "./contexts/index";
import "./style/App.css";
import "./style/tailwind.css";

function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="input-container">
        <TooltipProvider>
          <InputProvider>
            <GameSelect />
            <Input />
            <Output />
          </InputProvider>
        </TooltipProvider>
      </div>
      <Footer />
    </div>
  );
}

export default App;
