import { Footer, GameSelect, Header, Input, Output } from "./components/index";
import { InputProvider } from "./contexts/index";
import "./style/App.css";

function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="input-container">
        <InputProvider>
          <GameSelect />
          <Input />
          <Output />
        </InputProvider>
      </div>
      <Footer />
    </div>
  );
}

export default App;
