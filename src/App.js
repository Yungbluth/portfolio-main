import React from "react";
import "./index.css";
import Header from "./components/Header";
import Background from "./components/Background";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import Interactive from "./components/Interactive";
// import GlobalStyles from "./components/styled-components/GlobalStyles";

const App = () => {
  return (
    <div>
      <Header />
      {/* <GlobalStyles /> */}
      <Background />
      <Interactive />
      <Skills />
      <Projects />
      <Footer />
    </div>
  );
};

export default App;
