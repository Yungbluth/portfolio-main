import React from "react";
import {
  FaJsSquare,
  FaHtml5,
  FaCss3,
  FaGithub,
  FaPython,
  FaJava,
  FaPhp,
} from "react-icons/fa";
import {
  SiCplusplus,
  SiC,
  SiGo,
  SiPostgresql,
  SiLinux,
} from "react-icons/si"

const Skills = () => {
  return (
    <section className="section skills">
      <div className="section-title">SKILLS</div>
      <div className="section-content section-icons">
        <SiGo className="icon-hover" />
        <FaJsSquare className="icon-hover" />
        <SiPostgresql className="icon-hover" />
        <FaPython className="icon-hover" />
        <FaJava className="icon-hover" />
        <SiC className="icon-hover" />
        <SiCplusplus className="icon-hover" />
        <FaHtml5 className="icon-hover" />
        <FaCss3 className="icon-hover" />
        <FaPhp className="icon-hover" />
        <SiLinux className="icon-hover" />
        <FaGithub className="icon-hover" />
      </div>
    </section>
  );
};

export default Skills;
