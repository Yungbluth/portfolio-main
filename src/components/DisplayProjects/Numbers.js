import React, { useRef, useEffect } from "react";
import { read as readmat } from "mat-for-js";
import fs from "fs";
import curData from "./mnist-original.mat"

function Numbers() {
  const canvasRef = useRef(null);
  let isDrawing = false;
  let lineWidth = 5;
  let startX;
  let startY;


  useEffect(() => {
    //Setup the canvas
    const canvas = canvasRef.current;
    canvas.height = document.documentElement.clientHeight * 0.8 - 50;
    canvas.width = document.documentElement.clientWidth * 0.8;
    const context = canvas.getContext('2d');
    

    const draw = (e) => {
      if(!isDrawing) {
        return;
      }
      context.lineWidth = lineWidth;
      context.lineCap = 'round';

      context.lineTo(e.clientX - document.documentElement.clientWidth * 0.1, e.clientY - document.documentElement.clientHeight * 0.1);
      context.stroke();
    };
    
    //Start drawing
    canvas.addEventListener('mousedown', (e) => {
      isDrawing = true;
      startX = e.clientX - document.documentElement.clientWidth * 0.1;
      startY = e.clientY - document.documentElement.clientHeight * 0.1;
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

    //Clears the canvas, currently on right-click
    //TODO: Change to a button
    canvas.addEventListener('contextmenu', (e) => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    });
    
    // Clean up function
    return () => {
      canvas.removeEventListener('mousedown', draw);
    };

  }, []);

  //Export the image to be used by the NN
  const saveImage = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'canvas.png';
    link.click();
  };

  return (
    <canvas ref={canvasRef}/>
  );
}

export default Numbers;