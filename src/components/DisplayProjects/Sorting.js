import React, { useState, useEffect, useRef } from "react";

const Sorting = function () {
    const [value, setValue] = useState(5);
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

  let testArray = createNewArray(value);

  function createNewArray(arrSize) {

    for (var numArray = [], i = 0; i < arrSize; ++i) {
        numArray[i] = i;
      }
        var tmp,
          current,
          top = arrSize;
        if (top)
          while (--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = numArray[current];
            numArray[current] = numArray[top];
            numArray[top] = tmp;
          }
        return numArray;
  }

  
  function sliderListener(e) {
    setValue(e.target.value);
    
  }

  return (
    <div>
        <button>Sort!</button>
        Set Array Size!<input type="range" min="5" max="100" step="1" value={value} onChange={sliderListener} id="sizeArraySlider"></input>
    <div className="arrayContainer">
      {testArray.map((num, index) => (
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
