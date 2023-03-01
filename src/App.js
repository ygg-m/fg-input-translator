import { createHashRouter, RouterProvider } from "react-router-dom";

import { Home, NotFound } from "./Pages/index";

import "react-tooltip/dist/react-tooltip.css";
import "./style/App.css";

const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
    // errorElement: <NotFound />,
  },
  {
    path: "/:game/:input",
    element: <Home />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
