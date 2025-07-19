import React from "react";
import { Provider } from "react-redux";
// import { store } from "./store/store";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Game from "./pages/Game";
import Home from "./pages/Home";

const App: React.FC = () => {
  return (
    // <Provider store={store}>
      <Router>
        <nav style={{ display: "flex", gap: "20px", padding: "1rem", backgroundColor: "#eee" }}>
          <Link to="/">Home</Link>
          <Link to="/game">Play Game</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Router>
    // </Provider>
  );
};

export default App;
