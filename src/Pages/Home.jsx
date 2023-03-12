import { useParams } from "react-router-dom";
import { TooltipProvider } from "react-tooltip";
import { Footer, Header, Modal } from "../components/index";
import { InputContainer } from "../components/InputContainer";
import { OutputList } from "../components/OutputList";
import { InputProvider, ModalProvider } from "../contexts/index";

export const Home = () => {
  const { game } = useParams();
  return (
    <div className="h-screen overflow-x-hidden bg-neutral-900 text-neutral-400">
      <ModalProvider>
        <Modal />
        <Header />
      </ModalProvider>
      <InputProvider>
        <TooltipProvider>
          <InputContainer />
          <OutputList />
        </TooltipProvider>
      </InputProvider>
      <Footer />
    </div>
  );
};
