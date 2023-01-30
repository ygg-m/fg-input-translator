import { TooltipProvider } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  Footer,
  GameSelect,
  Header,
  InputField,
  Output,
} from "./components/index";
import { InputProvider } from "./contexts/index";
import "./style/App.css";

function App() {
  return (
    <div className="bg-neutral-900 text-neutral-500 overflow-x-hidden h-screen">
      <Header />
      <div className="flex flex-col gap-4 w-full p-4 px-8">
        <TooltipProvider>
          <InputProvider>
            <GameSelect />
            <InputField />
            <Output />
          </InputProvider>
        </TooltipProvider>
      </div>
      <Footer />
    </div>
  );
}

export default App;
