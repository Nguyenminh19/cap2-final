import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Footer from "./components/Footer";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />}></Route>
      </Routes>
      <Footer />
    </>
  );
};

export default App;
