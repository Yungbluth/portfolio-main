import React, { useState } from "react";

const Sorting = function () {

    //const [value, setValue] = useState(5);
    //const [sortPush, setSortPush] = useState({ bool: 0 });
    const [curArray, setCurArray] = useState([1,2,3,4,5]);
    let value = curArray.length;
    let width = 50;
    let opacity = 1;
    let boxWidth = document.documentElement.clientWidth * 0.8;
    if (value * width >= boxWidth * 2) {
        width = Math.round(width / 4);
        opacity = 0;
    }
    if (value * width >= boxWidth) {
        width = Math.round(width / 2);
        opacity = 0;
    }
    if (value * width < Math.max(boxWidth / 2) && width < 50) {
        width = Math.round(width * 2);
        opacity = 0;
    }
    if (width >= 50) {
        width = 50;
        opacity = 1;
    }

  function createNewArray(arrSize) {

    for (var numArray = [], i = 0; i < arrSize; ++i) {
        numArray[i] = i;
      }
      return numArray;
    }

  function shuffle(shufArray) {
      let currentIndex = shufArray.length;

      // While there remain elements to shuffle...
      while (currentIndex != 0) {
    
        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        // And swap it with the current element.
        [shufArray[currentIndex], shufArray[randomIndex]] = [
          shufArray[randomIndex], shufArray[currentIndex]];
      }
      return shufArray;
  }

  
  function sliderListener(e) {
    let tempArray = createNewArray(e.target.value);
    setCurArray(tempArray);
  }


  function shuffleArray() {
    let tempArray = curArray.slice();
    tempArray = shuffle(tempArray);
    setCurArray(tempArray);
    
  }

  function maybeSort() {
    let tempArray = curArray.slice();
    tempArray.sort(function(a, b) {
      return a-b;
    });
    setCurArray(tempArray);
  }

  return (
    <div>
        <button onClick={maybeSort}>Sort!</button>
        <button onClick={shuffleArray}>Shuffle!</button>
        Set Array Size!<input type="range" min="5" max="100" step="1" value={value} onChange={sliderListener} id="sizeArraySlider"></input>
    <div className="arrayContainer">
    {curArray.map((num, index) => (
        <div
          className="nums"
          style={{
            height: `${num * 7 + 10}px`,
            width: `${width}px`,
          }}
          key={index}
        >
          <h2 style={{ opacity: `${opacity}` }}>{num}</h2>
        </div>
      ))}
      
    </div>
    </div>
  );
};

export default Sorting;
