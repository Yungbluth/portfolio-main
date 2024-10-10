import React, { useState } from "react";

const Sorting = function () {
  //store translates in separate array
  //stack of translations, animate after array is fully sorted

  //const [value, setValue] = useState(5);
  //const [sortPush, setSortPush] = useState({ bool: 0 });
  const [curArray, setCurArray] = useState([0, 1, 2, 3, 4]);
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
        shufArray[randomIndex],
        shufArray[currentIndex],
      ];
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
    tempArray.sort(function (a, b) {
      return a - b;
    });
    setCurArray(tempArray);
  }

  function swapTwo() {
    document.getElementById(1).style.transform = `translateX(${width}px)`;
    document.getElementById(2).style.transform = `translateX(${-width}px)`;
  }

  function resetTest() {
    for (let i = 0; i < curArray.length; i++) {
      document.getElementById(i).style.transform = `none`;
    }
  }

  //Bubble sort
  function bubbleSort() {
    var arr = curArray.slice();
    var n = arr.length;
    var i, j, temp;
    var swapped;
    //operations are pushed to queue to allow time for animations without messing with the sorting, its a mess
    let queue = [];
    for (i = 0; i < n - 1; i++) {
      swapped = false;
      for (j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          // Swap arr[j] and arr[j+1]
          temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swapped = true;
          queue.push({
            index: j.valueOf(),
            first: arr[j].valueOf(),
            second: arr[j + 1].valueOf(),
          });
        }
      }

      // IF no two elements were
      // swapped by inner loop, then break
      if (swapped == false) break;
    }
    let numTranslated = [];
    let count = 0;
    //perform all swapping operations with animations
    for (i = 0; i < queue.length; i++) {
      setTimeout(() => {
        if (numTranslated[queue[count].first] == null) {
          numTranslated[queue[count].first] = 0;
        }
        if (numTranslated[queue[count].second] == null) {
          numTranslated[queue[count].second] = 0;
        }
        document.getElementById(
          queue[count].first
        ).style.transitionDuration = `0.1s`;
        document.getElementById(
          queue[count].second
        ).style.transitionDuration = `0.1s`;
        document.getElementById(
          queue[count].first
        ).style.transform = `translateX(${
          -width + width * numTranslated[queue[count].first]
        }px)`;
        document.getElementById(
          queue[count].second
        ).style.transform = `translateX(${
          width + width * numTranslated[queue[count].second]
        }px)`;
        numTranslated[queue[count].first] =
          Number(numTranslated[queue[count].first]) - 1;
        numTranslated[queue[count].second] =
          Number(numTranslated[queue[count].second]) + 1;
        count = count + 1;
      }, i * 100);
    }
    //get rid of transition duration to remove the 'jitter' after sorted and then set sorted array as final
    setTimeout(() => {
      for (i = 0; i < queue.length; i++) {
        document.getElementById(queue[i].first).style.transitionDuration = `0s`;
        document.getElementById(
          queue[i].second
        ).style.transitionDuration = `0s`;
      }
      let tempArray = createNewArray(arr.length);
      setCurArray(tempArray);
      resetTest();
    }, queue.length * 100 + 200);
  }

  function quickSortFirst() {
    let arr = curArray.slice();
    let low = 0;
    let high = curArray.length - 1;
    let queue = [];
    quickSort(arr, low, high, queue);

    let numTranslated = [];
    let count = 0;
    var i;
    let curPivot = document.getElementById(queue[count].pivot);
    curPivot.style.backgroundColor = `red`;
    //perform all swapping operations with animations
    for (i = 0; i < queue.length; i++) {
      setTimeout(() => {
        if (numTranslated[queue[count].first] == null) {
          numTranslated[queue[count].first] = 0;
        }
        if (numTranslated[queue[count].second] == null) {
          numTranslated[queue[count].second] = 0;
        }
        let difference = queue[count].firstIndex - queue[count].secondIndex;
        let newPivot = document.getElementById(queue[count].pivot);
        if (newPivot !== curPivot) {
          newPivot.style.backgroundColor = `red`;
          curPivot.style.backgroundColor = `lightgreen`;
          curPivot = newPivot;
        }
        document.getElementById(
          queue[count].first
        ).style.transitionDuration = `0.1s`;
        document.getElementById(
          queue[count].second
        ).style.transitionDuration = `0.1s`;
        document.getElementById(
          queue[count].first
        ).style.transform = `translateX(${
          -width * difference + width * numTranslated[queue[count].first]
        }px)`;
        document.getElementById(
          queue[count].second
        ).style.transform = `translateX(${
          width * difference + width * numTranslated[queue[count].second]
        }px)`;
        numTranslated[queue[count].first] =
          Number(numTranslated[queue[count].first]) - difference;
        numTranslated[queue[count].second] =
          Number(numTranslated[queue[count].second]) + difference;
        count = count + 1;
      }, i * 200);
    }
    //get rid of transition duration to remove the 'jitter' after sorted and then set sorted array as final
    setTimeout(() => {
      curPivot.style.backgroundColor = `lightgreen`;
      for (i = 0; i < queue.length; i++) {
        document.getElementById(queue[i].first).style.transitionDuration = `0s`;
        document.getElementById(
          queue[i].second
        ).style.transitionDuration = `0s`;
      }
      let tempArray = createNewArray(arr.length);
      setCurArray(tempArray);
      resetTest();
    }, queue.length * 200 + 500);
  }

  /*
  //Lomuto's Partition
  function partition(arr, low, high, queue)
    {
        let temp;
        let pivot = arr[high];
  
        // index of smaller element
        let i = (low - 1);
        for (let j = low; j <= high - 1; j++) {
  
            // If current element is
            // smaller than or
            // equal to pivot
            if (arr[j] <= pivot) {
                i++;
  
                if (arr[i] != arr[j]) {
                  queue.push({first: arr[i], second: arr[j], firstIndex: i, secondIndex: j, pivot: high});
                }
                // swap arr[i] and arr[j]
                temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
  
        if (arr[i+1] != arr[high]) {
          queue.push({first: arr[i+1], second: arr[high], firstIndex: i+1, secondIndex: high, pivot: i+1});
        }
        // swap arr[i+1] and arr[high]
        // (or pivot)
        temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
  
        return i + 1;
    }*/
   
  //Hoare's Partition
  function partition(arr, low, high, queue) {
    let pivot = arr[low];
    let i = low - 1,
      j = high + 1;

    while (true) {
      // Find leftmost element greater
      // than or equal to pivot
      do {
        i++;
      } while (arr[i] < pivot);

      // Find rightmost element smaller
      // than or equal to pivot
      do {
        j--;
      } while (arr[j] > pivot);

      // If two pointers met
      if (i >= j) return j;

      // Swap arr[i] and arr[j]
      queue.push({
        first: arr[i],
        second: arr[j],
        firstIndex: i,
        secondIndex: j,
        pivot: arr[Math.round((low + high) / 2)],
      });
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  /* The main function that implements
    QuickSort() arr[] --> Array to be 
    sorted,
    low --> Starting index,
    high --> Ending index */
  function quickSort(arr, low, high, queue) {
    if (low < high) {
      /* pi is partitioning index, 
            arr[pi] is now at right place */
      let pi = partition(arr, low, high, queue);

      // Recursively sort elements
      // before partition and after
      // partition
      quickSort(arr, low, pi, queue);
      quickSort(arr, pi + 1, high, queue);
    }
  }

  function selectionSort() {}

  //Handle all html given
  return (
    <div>
      <button onClick={maybeSort}>Sort!</button>
      <button onClick={shuffleArray}>Shuffle!</button>
      <button onClick={swapTwo}>Swap!</button>
      <button onClick={resetTest}>Reset!</button>
      <button onClick={bubbleSort}>Bubble!</button>
      <button onClick={quickSortFirst}>Quick Sort!</button>
      Set Array Size!
      <input
        type="range"
        min="5"
        max="100"
        step="1"
        value={value}
        onChange={sliderListener}
        id="sizeArraySlider"
      ></input>
      <div className="arrayContainer">
        {curArray.map((num, index) => (
          <div
            className="nums"
            style={{
              height: `${num * 7 + 10}px`,
              width: `${width}px`,
            }}
            key={index}
            id={num}
          >
            <h2 style={{ opacity: `${opacity}` }}>{num}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sorting;
