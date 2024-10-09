import React from "react";
import CustomProject from "./customHook/CustomProject";

const Projects = () => {
  return (
    <>
      <section className="section projects">
        <div className="section-title">Projects</div>
        <div className="section-content">
          <CustomProject
            title="Fern App"
            link="https://github.com/Yungbluth/Fern-App"
            desc="An app created in Ionic to be a field guild of ferns local to Tucson, Arizona. You can add locations of where you have seen each fern."
            usedArray={[
              "Ionic",
              "Angular",
              "JavaScript",
              "TypeScript",
              "HTML5",
              "CSS",
            ]}
          />
          <CustomProject
            title="Mobile TCP Proxy"
            link="https://github.com/Yungbluth/Mobile-TCP-Proxy"
            desc="A server-client proxy network. Functionality includes different types of messages, automatic reconnection after IP change, timeouts."
            usedArray={[
              "C",
              "TCP",
              "Telnet",
            ]}
          />
          <CustomProject
            title="Chess Game with AI"
            link="https://github.com/Yungbluth/ChessGame"
            desc="Chess game with AI created as a learning challenge in a language that was new to me."
            usedArray={[
              "Go",
              "Ebiten",
            ]}
          />
          <CustomProject
            title="C-- Compiler"
            link="https://github.com/Yungbluth/C--Compiler"
            desc="Translates code written in C--(a subset of C) into x86 assembly code."
            usedArray={[
              "C",
              "x86 Assembly",
            ]}
          />
           {/*
           <CustomProject
            title="Movie Rental Website"
            link="https://github.com/Yungbluth/CSC-377-Projects/tree/master/FinalProject_v2"
            desc="Collaboratively created a mock movie retail front and backend using MVC architecture called Notflix."
            usedArray={[
              "HTML5",
              "JavaScript",
              "PHP",
              "SQL",
              "CSS3",
              "XAMPP",
            ]}
          />
          */}
        </div>
      </section>
      <div className=" section-content projects-flex">
        <a
          href="https://github.com/Yungbluth"
          className=" underline-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h4>Check my other projects on github.</h4>
        </a>
      </div>
    </>
  );
};

export default Projects;
