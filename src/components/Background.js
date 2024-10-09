import React from "react";

const Background = () => {
  return (
    <section className="section background">
      <div className="section-title">BACKGROUND</div>
      <div className="section-content">
        <p>
          I graduated from{" "}
          <a
            href="https://www.arizona.edu/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-link"
          >
            The University of Arizona
          </a>{" "}
          after completing a Bachelor of Science in Computer Science.
        </p>
        <p>
          I spent 1 year as a Software Engineer I at{" "}
          <a
            href="https://www.ezoic.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-link"
          >
            Ezoic
          </a>{" "}
          learning and honing my abilities, proven by the recognition and awards I recieved within the company
        </p>
        <p>
          As a software engineer, I enjoy constantly learning and growing - improving my craft one day at a time. 
          My goal is to always build applications that are scalable and efficient in a timely manner.
        </p>
        <p>
          <strong>When I'm not in front of a computer screen</strong>, I'm
          probably hiking, playing with my dog, or playing video games.
        </p>
        <a
          className="arrow-link"
          href="https://drive.google.com/file/d/1cZM8YpaE53jX7r-0FAyKfqvicWXjZVSL/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
        >
          View my resume
        </a>
      </div>
    </section>
  );
};

export default Background;
