import React, { useState, useRef, useEffect } from "react";
import weightsBiases from "./weightsbiases.txt";
import { multiply } from 'mathjs';


function Numbers() {
  const canvasRef = useRef(null);

  let isDrawing = false;
  let heightmax = document.documentElement.clientHeight * 0.8 - 50;
  let widthmax = document.documentElement.clientWidth * 0.8 - 200;

  //Grab all the weights and biases data from file
  let weightOne;
  let biasOne;
  let weightTwo;
  let biasTwo;
  let weightThree;
  let biasThree;
  fetch(weightsBiases).then((res) => res.text()).then((text) => {
    let totalData = text.split("l");
     weightOne = totalData[0].split("e").map(function(e){return e.match(/-?\d+(?:\.\d+)?/g).map(Number);});
     biasOne = totalData[1].split("e").map(function(e){return e.match(/-?\d+(?:\.\d+)?/g).map(Number);})[0];
     weightTwo = totalData[2].split("e").map(function(e){return e.match(/-?\d+(?:\.\d+)?/g).map(Number);});
     biasTwo = totalData[3].split("e").map(function(e){return e.match(/-?\d+(?:\.\d+)?/g).map(Number);})[0];
     weightThree = totalData[4].split("e").map(function(e){return e.match(/-?\d+(?:\.\d+)?/g).map(Number);});
     biasThree = totalData[5].split("e").map(function(e){return e.match(/-?\d+(?:\.\d+)?/g).map(Number);})[0];
  }).catch((e) => console.error(e));



  useEffect(() => {
    //Setup the canvas
    const canvas = canvasRef.current;
    canvas.height = 28;
    canvas.width = 28;
    canvas.style.height = heightmax + "px";
    canvas.style.width =  widthmax + "px";
    const context = canvas.getContext('2d');
    //draws pixels nicer
    context.imageSmoothingEnabled = false;
    //context.translate(-.5,-.5);
    context.lineWidth = 2;
    context.lineCap = "round";

    

    const draw = (e) => {
      if(!isDrawing) {
        return;
      }

      //math to connect the large canvas with the 28x28 pixel grid
      let bounds = canvas.getBoundingClientRect();
      let percentage = 1/28;
      context.lineTo(Math.ceil(((e.clientX - bounds.x) / bounds.width)/percentage), Math.ceil(((e.clientY - bounds.y) / bounds.height)/percentage));
      context.stroke();
      /*
      let xpos = ((e.clientX - bounds.x) / bounds.width)/percentage;
      let ypos = ((e.clientY - bounds.y) / bounds.height)/percentage;
      let pxData = context.getImageData(xpos,ypos,1,1);
      pxData.data[3]=255;
      context.putImageData(pxData,xpos,ypos);*/
    };
    
    //Start drawing
    
    canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        isDrawing = true;
      }
    });

    //Stop drawing
    canvas.addEventListener('mouseup', (e) => {
      isDrawing = false;
      context.stroke();
      context.beginPath();
    });

    //Middle of drawing
    canvas.addEventListener('mousemove', draw);

    //Allows for dots
    canvas.addEventListener('mousedown', draw);
    
    // Clean up function
    return () => {
      canvas.removeEventListener('mousedown', draw);
    };

  }, []);

  //Turn all negative numbers to 0
  function relu(arrInput) {
    return arrInput.map((x) => Math.max(x, 0));
  }

  //turn into probabilities
  function softmax(arr) {
    const C = Math.max(...arr);
    const d = arr.map((y) => Math.exp(y - C)).reduce((a, b) => a + b);
    return arr.map((value, index) => { 
        return Math.exp(value - C) / d;
    })
  }

  function clearCanvas() {
    let context = canvasRef.current.getContext('2d');
    context.clearRect(0, 0, widthmax, heightmax);
  }

  //Takes current drawing on canvas and runs it through the neural network
  function predictNumber() {
      let canvas = canvasRef.current;
      let context = canvas.getContext('2d');
      let curPixels = context.getImageData(0,0,canvas.height,canvas.width);
      let pixelDataArray = curPixels.data;
      let drawnImageArray = [];
      for (let i = 0; i < pixelDataArray.length; i+=4) {
        /*
        if (pixelDataArray[i+3] === 255) {
          drawnImageArray.push(255);
        } else {
          drawnImageArray.push(0);
        }*/
       drawnImageArray.push(pixelDataArray[i+3]);
      }
      //Get the pretrained weights and biases from txt file and do some string magic to put them into arrays
      

      let input = multiply(drawnImageArray, weightOne);
      let hidden = relu(input.map((x,y) => x + biasOne[y]));
      let hiddenDot = multiply(hidden, weightTwo);
      let hiddenTwo = relu(hiddenDot.map((x,y) => x + biasTwo[y]));
      let scores = multiply(hiddenTwo, weightThree).map((x,y) => x + biasThree[y]);
      let probs = softmax(scores);
      let predict = probs.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
      document.getElementById("predictedNum").innerHTML = predict;
      console.log(predict);
  }


  return (
    <div>
      <div style={{float: "left"}}>
    <canvas ref={canvasRef} id="canvas"/>
    </div>
    <button onClick={clearCanvas}>Clear Canvas</button>
    <button onClick={predictNumber}>Predict</button>
    <div>
      Your number is:
      <div id="predictedNum"></div>
    </div>
    </div>
  );
}

export default Numbers;