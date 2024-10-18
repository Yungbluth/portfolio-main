import React, { useState, useEffect } from "react";

const Sorting = function ({ onMountSort }) {
  const [curArray, setCurArray] = useState([0, 1, 2, 3, 4]);
  const [speed, setCurSpeed] = useState(200);

  useEffect(() => {
    onMountSort([curArray, setCurArray]);
  }, [onMountSort, curArray]);

  let value = curArray.length;
  let width = 50;
  let opacity = 1;
  let heightMult = 7;
  let boxWidth = document.documentElement.clientWidth * 0.8;
  let boxHeight = document.documentElement.clientHeight * 0.8;
  var sliderSpeed;

  if (value * heightMult + 10 >= boxHeight * 1.4) {
    heightMult = Math.round(heightMult / 4);
  }
  if(value * heightMult + 10 >= boxHeight * 0.7) {
    heightMult = Math.round(heightMult / 2);
  }

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
    while (currentIndex !== 0) {
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

  function sliderSizeListener(e) {
    let tempArray = createNewArray(e.target.value);
    setCurArray(tempArray);
  }

  function sliderSpeedListener(e) {
    setCurSpeed(550 - Number(e.target.value));
  }

  function shuffleArray() {
    let tempArray = curArray.slice();
    tempArray = shuffle(tempArray);
    setCurArray(tempArray);
  }

  function resetTest() {
    for (let i = 0; i < curArray.length; i++) {
      document.getElementById(i).style.transform = `none`;
    }
    document.getElementById("shuffleButton").disabled = false;
    document.getElementById("sortButton").disabled = false;
    document.getElementById("dropdownSort").disabled = false;
    document.getElementById("sizeArraySlider").disabled = false;
    if (
      document.getElementById("Sorting") !== null &&
      document.getElementById("Sorting") !== undefined
    ) {
      document.getElementById("Sorting").inert = false;
    }
    if (
      document.getElementById("Chess") !== null &&
      document.getElementById("Chess") !== undefined
    ) {
      document.getElementById("Chess").inert = false;
    }
    if (
      document.getElementById("Tab 3") !== null &&
      document.getElementById("Tab 3") !== undefined
    ) {
      document.getElementById("Tab 3").inert = false;
    }
  }

  function sortingAnimator(queue) {
    let numTranslated = [];
    let count = 0;
    for (let i = 0; i < queue.length; i++) {
      setTimeout(() => {
        if (numTranslated[queue[count].first] == null) {
          numTranslated[queue[count].first] = 0;
        }
        if (numTranslated[queue[count].second] == null) {
          numTranslated[queue[count].second] = 0;
        }
        let difference = queue[count].firstIndex - queue[count].secondIndex;

        document.getElementById(
          queue[count].first
        ).style.transitionDuration = `${speed}ms`;
        document.getElementById(
          queue[count].second
        ).style.transitionDuration = `${speed}ms`;
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
      }, i * speed);
    }
    //get rid of transition duration to remove the 'jitter' after sorted and then set sorted array as final
    setTimeout(() => {
      for (let i = 0; i < queue.length; i++) {
        document.getElementById(queue[i].first).style.transitionDuration = `0s`;
        document.getElementById(
          queue[i].second
        ).style.transitionDuration = `0s`;
      }
      let tempArray = createNewArray(curArray.length);
      setCurArray(tempArray);
      resetTest();
    }, queue.length * speed + 2 * speed);
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
            first: arr[j].valueOf(),
            second: arr[j + 1].valueOf(),
            firstIndex: j + 1,
            secondIndex: j,
          });
        }
      }

      // IF no two elements were
      // swapped by inner loop, then break
      if (swapped === false) break;
    }
    sortingAnimator(queue);
  }

  function quickSortFirst() {
    let arr = curArray.slice();
    let low = 0;
    let high = curArray.length - 1;
    let queue = [];
    quickSort(arr, low, high, queue);
    sortingAnimator(queue);
  }

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

  function selectionSort() {
    let arr = curArray.slice();
    let queue = [];
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      // Assume the current position holds
      // the minimum element
      let minIndex = i;

      // Iterate through the unsorted portion
      // to find the actual minimum
      for (let j = i + 1; j < n; j++) {
        if (arr[j] < arr[minIndex]) {
          // Update minIndex if a smaller element is found
          minIndex = j;
        }
      }

      // Move minimum element to its
      // correct position
      if (i !== minIndex) {
        queue.push({
          first: arr[i],
          second: arr[minIndex],
          firstIndex: i,
          secondIndex: minIndex,
        });
      }
      let temp = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = temp;
    }
    sortingAnimator(queue);
  }

  function activateSorter() {
    let selected = document.getElementById("dropdownSort");
    let curAlgo = selected.options[selected.selectedIndex].text;
    document.getElementById("shuffleButton").disabled = true;
    document.getElementById("sortButton").disabled = true;
    document.getElementById("dropdownSort").disabled = true;
    document.getElementById("sizeArraySlider").disabled = true;
    if (
      document.getElementById("Sorting") !== null &&
      document.getElementById("Sorting") !== undefined
    ) {
      document.getElementById("Sorting").inert = true;
    }
    if (
      document.getElementById("Chess") !== null &&
      document.getElementById("Chess") !== undefined
    ) {
      document.getElementById("Chess").inert = true;
    }
    if (
      document.getElementById("Tab 3") !== null &&
      document.getElementById("Tab 3") !== undefined
    ) {
      document.getElementById("Tab 3").inert = true;
    }
    switch (curAlgo) {
      case "Bubble Sort":
        bubbleSort();
        break;
      case "Quick Sort":
        quickSortFirst();
        break;
      case "Selection Sort":
        selectionSort();
        break;
      default:
        console.log("NOT IN THE MENU?");
    }
  }

  //Handle all html given
  return (
    <div>
      <button id="shuffleButton" onClick={shuffleArray}>
        Shuffle!
      </button>
      <button id="sortButton" onClick={activateSorter}>
        Sort!
      </button>
      <select id="dropdownSort">
        <option>Bubble Sort</option>
        <option>Quick Sort</option>
        <option>Selection Sort</option>
      </select>
      Set Array Size!
      <input
        type="range"
        min="5"
        max="100"
        step="1"
        value={value}
        onChange={sliderSizeListener}
        id="sizeArraySlider"
      ></input>
      Set Sort Speed!
      <input
        type="range"
        min="50"
        max="500"
        step="1"
        value={sliderSpeed}
        onChange={sliderSpeedListener}
        id="sizeArraySlider"
      ></input>
      <div className="arrayContainer">
        {curArray.map((num, index) => (
          <div
            className="nums"
            style={{
              height: `${num * heightMult + 10}px`,
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
