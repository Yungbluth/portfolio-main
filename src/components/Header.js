import React from "react";

const Header = () => {
  return (
    <header className="intro">
      <h2 className="intro-tagline">
        I'm <span className="name">Matthew Yungbluth</span>, a software engineer based
        in Tucson, Arizona. I love love spending time coding and encountering new challenges. I'm highly adaptable to new challenges and projects.
      </h2>
      <h3 className="intro-contact">
        <span>Get in touch 👉🏼</span>{" "}
        <span>
          <a
            href="mailto:myungbluth1@gmail.com"
            className="highlight-link"
          >
            myungbluth1@gmail.com
          </a>
        </span>
      </h3>
    </header>
  );
};

export default Header;
