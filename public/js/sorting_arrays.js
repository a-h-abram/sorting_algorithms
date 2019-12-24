/**
 * We setup everything here (methods, ...)
 */

//let graph; // Chart.js
let array; // array which will be sort
let graphArray; // graphical array which describe status (color) of each element
let nbrValues = 100; // nbr of values inside our array
let maxValue = 250; // interval between 0 & maxValue
let sortType = 1; // bubble sort is the default sort type
let isSorting = false; // state to avoid multiple sort process at the time
let alreadySorted = false;

const sortAlgorithms = [
    // bubble sort
    {
        title: "Bubble Sort (Tri à bulle)",
        content: "Complexité (pire cas) = O(n²)"
    },
    // comb sort
    {
        title: "Comb Sort (Tri à peigne)",
        content: "Complexité (pire cas) = O(n²) | Facteur de reduction = 1,3"
    },
    // Cocktail sort
    {
        title: "Cocktail Shaker Sort (Tri cocktail)",
        content: "Complexité (pire cas) = O(n²)"
    },
    // OddEven sort
    {
        title: "OddEven Sort (Tri pair impair)",
        content: "Complexité (pire cas) = O(n²)"
    },
    // Merge sort
    {
        title: "Merge Sort (Tri à fusion)",
        content: "Complexité = O(n log n)"
    },
    // Quick sort
    {
        title: "Quick Sort (Tri rapide)",
        content: "Complexité = O(n log n) - pivot = dernier élément"
    },
    // Heap sort
    {
        title: "Heap Sort reversed (Tri par tas inversé)",
        content: "Complexité = O(n log n) - Tri par minimum"
    },
    // Radix sort
    {
        title: "Radix Sort",
        content: "Complexité = O(n (+ w))"
    }
];

// Graphic variables
let canvas = $('#canvas-graph')[0];
let ctx = canvas.getContext('2d');
let unselectedColor = "#7647a2";
let selectedColor = "#ff0011";
const sortState = {
    SELECTED: "#ff0011",
    UNSELECTED: "#7647a2",
    SWAP: "#303c96",
    CHECKED: "#048320"
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let displayBarGraph = async(sleepTime = null) => {
    clearBarGraph();

    let barWidth = canvas.width / array.length - 5;
    let offset = 2;

    for (let i = 0; i < array.length; i++) {
        let height = array[i];

        ctx.fillStyle = graphArray[i];
        ctx.fillRect(offset, canvas.height - height, barWidth, height);

        if (i + 1 < array.length) {
            offset += barWidth + 5;
        } else {
            offset += barWidth + 2;
        }
    }

    if (sleepTime) {
        await sleep(sleepTime);
    }
};

function clearBarGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

let parsingShowIndexGraph = async(index, color) => {
    let indexOffset = 2;
    let height = array[index];
    let barWidth = canvas.width / array.length - 5;

    indexOffset += (barWidth + 5) * (index);

    // Clear this place by filling this space of background's color
    ctx.fillStyle = "#454545";
    ctx.fillRect(indexOffset, canvas.height - height, barWidth, height);

    ctx.fillStyle = color;
    ctx.fillRect(indexOffset, canvas.height - height, barWidth, height);
};

function generateNewArray() {
    if (isSorting) {
        return;
    }

    array = []; // reset array
    graphArray = [];

    for (let i = 0; i < nbrValues; i++) {
        array.push(Math.floor(Math.random() * (maxValue) + 1));
        graphArray.push(sortState.UNSELECTED);
    }

    console.log(array);
    console.log(graphArray);
}

function changeSortType(val) {
    if (val >= 1 && val <= 8) {
        $('#sort-' + sortType).removeClass("active");

        sortType = val;

        $('#sort-' + sortType).addClass("active");

        let algo = sortAlgorithms[val - 1];

        $('#toast-title').text(algo.title);
        $('#toast-content').text(algo.content);

        $('.toast').toast({delay: 2000});

        $('.toast').toast('show');
    }
}

function displayBasicValues() {
    $('#commands-max-nbr').val(nbrValues);
    $('#commands-val-max').val(maxValue);

    $('#sort-' + sortType).addClass("active");
}

/*function changeMaxValue() {
    maxValue = $('#commands-val-max').val();
    if (maxValue > 0 && nbrValues > 0) {
        generateNewArray();
        displayBarGraph();
    }
}*/

function changeNbrValues() {
    nbrValues = $('#commands-max-nbr').val();

    if (maxValue > 0 && nbrValues > 0) {
        generateNewArray();
        displayBarGraph();
    }
}

function generateNewArrayAndDisplay() {
    generateNewArray();
    displayBarGraph();
}

let unselectEveryBars = async () => {
    for (let i = 0; i < graphArray.length; i++) {
        graphArray[i] = sortState.UNSELECTED;
    }
};

let finalCheckEveryBar = async () => {
    for (let i = 0; i < array.length; i++) {
        graphArray[i] = sortState.SELECTED;
        await displayBarGraph();
        graphArray[i] = sortState.CHECKED;
        await sleep(1);
    }

    graphArray[array.length] = sortState.CHECKED;

    await displayBarGraph(500);

    for (let i = 0; i < array.length; i++) {
        graphArray[i] = sortState.UNSELECTED;
    }

    await displayBarGraph();
};

let launchSort = async () => {
    if (isSorting) {
        return;
    }

    if (maxValue <= 0 || nbrValues <= 0) {
        // TODO: display error
        return;
    }

    isSorting = true;

    $('#launch-sort').text("Tri en cours");

    switch (sortType) {
        case 1:
            await bubbleSort();
            break;
        case 2:
            await combSort();
            break;
        case 3:
            await cocktailShakerSort();
            break;
        case 4:
            await oddEventSort();
            break;
        case 5:
            await mergeSort();
            break;
        case 6:
            await quickSort();
            break;
        case 7:
            await heapSort();
            break;
        case 8:
            await radixSort();
            break;
        default:
            await bubbleSort();
            break;
    }

    alreadySorted = true;

    $('#launch-sort').text("Relancer un tri");

    isSorting = false;
};

// SORT ALGORITHMS


/**
 * BUBBLE SORT
 */

let bubbleSort = async () => {
    let sorted = false;
    let sortedIndex = array.length - 1;

    while (sortedIndex > 0) {

        for (let i = 0; i < sortedIndex + 1; i++) {
            if (i + 1 >= sortedIndex + 1) {
                sortedIndex--;
                break;
            }

            graphArray[i] = sortState.SELECTED;
            graphArray[i + 1] = sortState.SELECTED;

            await displayBarGraph();

            await sleep(1);

            if (array[i] > array[i + 1]) {
                sorted = false;
                swap(i, i + 1);
                graphArray[i] = sortState.SWAP;
                graphArray[i + 1] = sortState.SWAP;
            }

            graphArray[i] = sortState.UNSELECTED;
            graphArray[i + 1] = sortState.UNSELECTED;

            await displayBarGraph(1);
        }
    }

    await finalCheckEveryBar();
};

/**
 * COMB SORT
 */

let combSort = async () => {
    let swaped = false;
    let floatInterval = array.length;
    let interval = array.length;

    while (interval > 1 || swaped) {
        interval = Math.round(floatInterval / 1.3);
        floatInterval = floatInterval / 1.3;

        if (interval < 1) {
            interval = 1;
        }

        swaped = false;

        for (let i = 0; i <= array.length - interval; i++) {

            graphArray[i] = sortState.SELECTED;
            graphArray[i + interval] = sortState.SELECTED;

            await displayBarGraph();

            if (array[i] > array[i + interval]) {
                swap(i, i + interval);
                graphArray[i] = sortState.SWAP;
                graphArray[i + interval] = sortState.SWAP;
                swaped = true;
            }

            await displayBarGraph(1);

            graphArray[i] = sortState.UNSELECTED;
            graphArray[i + interval] = sortState.UNSELECTED;

            await displayBarGraph();
        }

    }

    await finalCheckEveryBar();
};

/**
 * COCKTAIL SHAKER SORT
 */

let cocktailShakerSort = async () => {
    let swaped = true;
    let begin = 0;
    let end = array.length - 2;

    while (swaped) {
        swaped = false;

        for (let i = begin; i <= end; i++) {
            graphArray[i] = sortState.SELECTED;
            graphArray[i + 1] = sortState.SELECTED;

            if (array[i] > array[i + 1]) {
                swaped = true;
                swap(i, i + 1);
                graphArray[i] = sortState.SWAP;
                graphArray[i + 1] = sortState.SWAP;
            }

            await displayBarGraph(1);

            graphArray[i] = sortState.UNSELECTED;
            graphArray[i + 1] = sortState.UNSELECTED;
        }

        end--;

        for (let i = end; i >= begin; i--) {
            graphArray[i] = sortState.SELECTED;
            graphArray[i + 1] = sortState.SELECTED;

            if (array[i] > array[i + 1]) {
                swaped = true;
                swap(i, i + 1);
                graphArray[i] = sortState.SWAP;
                graphArray[i + 1] = sortState.SWAP;
            }

            await displayBarGraph(1);

            graphArray[i] = sortState.UNSELECTED;
            graphArray[i + 1] = sortState.UNSELECTED;
        }

        begin++;
    }

    await unselectEveryBars();
    await finalCheckEveryBar();
};

/**
 * ODD EVEN SORT
 */
let oddEventSort = async () => {
    for (let k = 1; k < array.length; k += 2) {

        for (let i = 0; i < array.length; i += 2) {
            if (i + 1 >= array.length) {
                break;
            }

            graphArray[i] = sortState.SELECTED;
            graphArray[i + 1] = sortState.SELECTED;
            /*await parsingShowIndexGraph(i, sortState.SELECTED);
            await parsingShowIndexGraph(i + 1, sortState.SELECTED);*/

            await displayBarGraph(1);

            if (array[i] > array[i + 1]) {
                /*await parsingShowIndexGraph(i, sortState.SWAP);
                await parsingShowIndexGraph(i + 1, sortState.SWAP);*/
                graphArray[i] = sortState.SWAP;
                graphArray[i + 1] = sortState.SWAP;
                swap(i, i + 1);
            }

            await displayBarGraph(1);

            /*await parsingShowIndexGraph(i, sortState.UNSELECTED);
            await parsingShowIndexGraph(i + 1, sortState.UNSELECTED);*/
            graphArray[i] = sortState.UNSELECTED;
            graphArray[i + 1] = sortState.UNSELECTED;
        }

        for (let i = 1; i < array.length; i += 2) {
            if (i + 1 >= array.length) {
                break;
            }

            /*await parsingShowIndexGraph(i, sortState.SELECTED);
            await parsingShowIndexGraph(i + 1, sortState.SELECTED);*/
            graphArray[i] = sortState.SELECTED;
            graphArray[i + 1] = sortState.SELECTED;

            await displayBarGraph(1);

            if (array[i] > array[i + 1]) {
                graphArray[i] = sortState.SWAP;
                graphArray[i + 1] = sortState.SWAP;
                /*await parsingShowIndexGraph(i, sortState.SWAP);
                await parsingShowIndexGraph(i + 1, sortState.SWAP);*/
                swap(i, i + 1);
            }

            await displayBarGraph(1);

            /*await parsingShowIndexGraph(i, sortState.UNSELECTED);
            await parsingShowIndexGraph(i + 1, sortState.UNSELECTED);*/
            graphArray[i] = sortState.UNSELECTED;
            graphArray[i + 1] = sortState.UNSELECTED;
        }
    }

    await finalCheckEveryBar();
};

/**
 * MERGE SORT
 */
let mergeSort = async () => {
    if (array.length <= 1) {
        return;
    }

    await mergeAlgorithm(0, array.length - 1);

    await finalCheckEveryBar();
};

let mergeAlgorithm = async(first, last) => {
    if (first < last) {
        let middle = Math.floor((first + last) / 2);

        await mergeAlgorithm(first, middle);
        await mergeAlgorithm(middle + 1, last);

        await merge(first, middle, last);
    }
};

let merge = async(first, middle, last) => {
    let firstArray = [];
    let lastArray = [];
    let firstEnd = middle - first + 1;
    let lastEnd = last - middle;

    for (let i = 0 ; i < firstEnd ; i++) {
        firstArray.push(array[first + i]);
    }

    for (let i = 0 ; i < lastEnd ; i++) {
        lastArray.push(array[middle + i + 1]);
    }

    let i = 0;
    let j = 0;
    let k = first;

    while (i < firstEnd && j < lastEnd) {
        if (firstArray[i] <= lastArray[j]) {
            array[k++] = firstArray[i++];
            graphArray[k - 1] = sortState.SELECTED;
        } else {
            array[k++] = lastArray[j++];
            graphArray[k - 1] = sortState.SELECTED;
        }

        //await parsingShowIndexGraph(k - 1, sortState.SELECTED);
        await displayBarGraph(1);

        graphArray[k - 1] = sortState.UNSELECTED;
        //await parsingShowIndexGraph(k - 1, sortState.UNSELECTED);
    }

    while (i < firstEnd) {
        array[k++] = firstArray[i++];
        graphArray[k - 1] = sortState.SELECTED;

        await displayBarGraph(1);

        graphArray[k - 1] = sortState.UNSELECTED;
    }

    while (j < lastEnd) {
        array[k++] = lastArray[j++];
        graphArray[k - 1] = sortState.SELECTED;

        await displayBarGraph(1);

        graphArray[k - 1] = sortState.UNSELECTED;
    }
};

let quickSort = async () => {
    if (array.length <= 0) {
        return;
    }

    await quickSortAlgorithm(0, array.length - 1);

    await finalCheckEveryBar();
};

let quickSortAlgorithm = async (first, last) => {
    if (first < last) {
        let partIndex = await quickPartition(first, last);

        await quickSortAlgorithm(first, partIndex - 1);
        await quickSortAlgorithm(partIndex + 1, last);
    }
};

let quickPartition = async (first, last) => {
    let pivot = array[last]; // choosing last element as pivot everytime

    let smallerIndex = first - 1; // smaller element index

    for (let i = first; i <= (last - 1); i++) {
        await parsingShowIndexGraph(i, sortState.SELECTED);

        if (array[i] < pivot) {
            smallerIndex++;

            swap(smallerIndex, i);

            await parsingShowIndexGraph(smallerIndex, sortState.SWAP);
        }

        await displayBarGraph(1);
        await parsingShowIndexGraph(i, sortState.UNSELECTED);
        await parsingShowIndexGraph(smallerIndex, sortState.UNSELECTED);
    }

    await parsingShowIndexGraph(smallerIndex + 1, sortState.SELECTED);
    await parsingShowIndexGraph(last, sortState.SWAP);

    await displayBarGraph(1);

    swap(smallerIndex + 1, last);

    await parsingShowIndexGraph(smallerIndex + 1, sortState.UNSELECTED);
    await parsingShowIndexGraph(last, sortState.UNSELECTED);

    return (smallerIndex + 1);
};

let heapSort = async () => {
    await setMaxHeap();

    for (let i = array.length - 1; i >= 0; i--) {
        await parsingShowIndexGraph(0, sortState.SELECTED);
        await parsingShowIndexGraph(i, sortState.SELECTED);

        await displayBarGraph(1);

        await parsingShowIndexGraph(i, sortState.SWAP);

        swap(0, i);

        await displayBarGraph(1);

        await parsingShowIndexGraph(0, sortState.UNSELECTED);
        await parsingShowIndexGraph(i, sortState.UNSELECTED);

        await heapify(i);
    }

    await finalCheckEveryBar();
};

// Sorting the binary tree in asc order
let setMaxHeap = async () => {
    for (let i = ((array.length - 1) / 2); i > 0; i--) {
        await heapify(i);
    }
};

let heapify = async (index) => {
    let min = index;
    let left = index + 1;
    let right = index + 2;

    if (left < array.length && array[left] < array[index]) {
        min = left;
    }

    if (right < array.length && array[right] < array[min]) {
        min = right;
    }

    if (min !== index) {
        await parsingShowIndexGraph(index, sortState.SELECTED);
        await parsingShowIndexGraph(min, sortState.SELECTED);

        await displayBarGraph(1);

        await parsingShowIndexGraph(min, sortState.SWAP);

        swap(index, min);

        await displayBarGraph(1);

        await parsingShowIndexGraph(index, sortState.UNSELECTED);
        await parsingShowIndexGraph(min, sortState.UNSELECTED);

        await heapify(min);
    }
};

let radixSort = async () => {
    if (array.length <= 0) {
        return;
    }

    let higher = await radixGetHigherNbr();

    for (let exp = 1; higher / exp > 0; exp *= 10) {
        let outArray = [];
        let i = 0;
        let buckets = [];

        for (i = 0; i < 10; i++) {
            buckets[i] = 0;
        }

        for (i = 0; i < array.length; i++) {
            buckets[array[i] / exp % 10]++;
        }

        for (i = 1; i < 10; i++) {
            buckets[i] += buckets[i - 1];
        }

        for (i = array.length - 1; i >= 0; i--) {
            outArray[buckets[array[i] / exp % 10]] = array[i];
            buckets[array[i] / exp % 10]--;
        }

        for (i = 0; i < array.length; i++) {
            array[i] = outArray[i];
        }
    }

    await displayBarGraph(1);
    await finalCheckEveryBar();
};

let radixGetHigherNbr = async () => {
    let higher = array[0];

    for (let i = 0; i < array.length; i++) {
        if (higher < array[i]) {
            higher = array[i];
        }
    }

    return higher;
};

// i1 moves to i2 place
function swap(i1, i2) {
    let tmp = array[i2];

    array[i2] = array[i1];
    array[i1] = tmp;

    swapGraphArray(i1, i2);
}

// i1 moves to i2 place
function swapGraphArray(i1, i2) {
    let tmp = graphArray[i2];

    graphArray[i2] = graphArray[i1];
    graphArray[i1] = tmp;
}

/**
 * Below is the "main" fcnt
 */

displayBasicValues();
generateNewArray();
displayBarGraph();