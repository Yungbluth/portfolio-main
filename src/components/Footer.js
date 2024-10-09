import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-copyright">
        <div className="top">
          <span>Created by </span>
        </div>
        <div className="bottom">
          <span> Matthew Yungbluth</span>
        </div>
      </div>

      <div className="footer-links">
        <a
          href="mailto:myungbluth1@gmail.com"
          title="email"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="text">email</span>
        </a>
        <a
          href="https://github.com/Yungbluth"
          title="github"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="text">github</span>
        </a>
        <a
          href="https://www.linkedin.com/in/matthew-yungbluth-05b33b195/"
          title="linkedin"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="text">linkedin</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
