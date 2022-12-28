import { GameSelect, Header, Input, Output } from "./components/index";
import { InputProvider } from "./contexts/index";
import "./style/App.css";

function App() {
  return (
    <div className="app-container">
      <Header />
      <GameSelect />
      <InputProvider>
        <Input />
        <Output />
      </InputProvider>
    </div>
  );
}

export default App;
