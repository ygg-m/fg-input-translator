import { TooltipProvider } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  Footer,
  GameSelect,
  Header,
  InputField,
  Modal,
  Output,
} from "./components/index";
import { InputProvider, ModalProvider } from "./contexts/index";
import "./style/App.css";

function App() {
  return (
    <div className="h-screen overflow-x-hidden bg-neutral-900 text-neutral-400">
      <ModalProvider>
        <Modal />
        <Header />
      </ModalProvider>
      <div className="flex w-full flex-col gap-4 p-4 px-8">
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
