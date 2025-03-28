import React, { useRef, useEffect } from "react";


function Numbers() {
  const canvasRef = useRef(null);
  let isDrawing = false;
  let heightmax = document.documentElement.clientHeight * 0.8 - 50;
  let widthmax = document.documentElement.clientWidth * 0.8


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
    context.translate(-.5,-.5);
    context.lineWidth = 1;

    

    const draw = (e) => {
      if(!isDrawing) {
        return;
      }

      //math to connect the large canvas with the 28x28 pixel grid
      let bounds = canvas.getBoundingClientRect();
      let percentage = 1/28;
      context.lineTo(Math.ceil(((e.clientX - bounds.x) / bounds.width)/percentage), Math.ceil(((e.clientY - bounds.y) / bounds.height)/percentage));
      context.stroke();
    };
    
    //Start drawing
    
    canvas.addEventListener('mousedown', (e) => {
      isDrawing = true;
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
      context.clearRect(0, 0, widthmax, heightmax);
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
    <canvas ref={canvasRef} id="canvas"/>
  );
}

export default Numbers;