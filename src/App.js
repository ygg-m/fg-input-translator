import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  Footer,
  GameSelect,
  Header,
  InputComponents,
  InputField,
  Modal,
  Output,
} from "./components/index";

import { InputProvider } from "./contexts/index";

import { ModalProvider } from "./contexts/index";
import { Home, NotFound } from "./Pages/index";
import "./style/App.css";

function App() {
  return (
    <Router>
      <div className="h-screen overflow-x-hidden bg-neutral-900 text-neutral-400">
        <ModalProvider>
          <Modal />
          <Header />
        </ModalProvider>
        <div className="flex w-full flex-col items-center gap-4 p-4 px-8">
          <TooltipProvider>
            <InputProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/:game/:input" element={<Home />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </InputProvider>
          </TooltipProvider>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
