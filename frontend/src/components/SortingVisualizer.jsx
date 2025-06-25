import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, BarChart3, Zap, Info } from 'lucide-react';

const SortingVisualizer = () => {
    const [array, setArray] = useState([]);
    const [arraySize, setArraySize] = useState(50);
    const [isSorting, setIsSorting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [algorithm, setAlgorithm] = useState('bubble');
    const [speed, setSpeed] = useState(50);
    const [comparing, setComparing] = useState([]);
    const [swapping, setSwapping] = useState([]);
    const [sorted, setSorted] = useState([]);
    const [pivot, setPivot] = useState([]);
    const [merging, setMerging] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [totalSteps, setTotalSteps] = useState(0);
    const [accessCount, setAccessCount] = useState(0);
    const [comparisons, setComparisons] = useState(0);
    const [swaps, setSwaps] = useState(0);
    const [showStats, setShowStats] = useState(true);
    const sortingRef = useRef(false);
    const pauseRef = useRef(false);

    // Generate random array
    const generateArray = useCallback(() => {
        const newArray = [];
        for (let i = 0; i < arraySize; i++) {
            newArray.push(Math.floor(Math.random() * 400) + 10);
        }
        setArray(newArray);
        resetVisualizationState();
    }, [arraySize]);

    const resetVisualizationState = () => {
        setComparing([]);
        setSwapping([]);
        setSorted([]);
        setPivot([]);
        setMerging([]);
        setCurrentStep(0);
        setTotalSteps(0);
        setAccessCount(0);
        setComparisons(0);
        setSwaps(0);
    };

    // Initialize array on component mount
    useEffect(() => {
        generateArray();
    }, [generateArray]);

    // Sleep function for animation with pause check
    const sleep = async (ms) => {
        return new Promise(resolve => {
            const checkPause = () => {
                if (!pauseRef.current && sortingRef.current) {
                    setTimeout(resolve, ms);
                } else if (sortingRef.current) {
                    setTimeout(checkPause, 50);
                } else {
                    resolve();
                }
            };
            checkPause();
        });
    };

    // Utility functions for tracking
    const incrementComparisons = () => setComparisons(prev => prev + 1);
    const incrementSwaps = () => setSwaps(prev => prev + 1);
    const incrementAccess = () => setAccessCount(prev => prev + 1);

    // Bubble Sort Algorithm
    const bubbleSort = async (arr) => {
        const n = arr.length;
        let steps = 0;
        setTotalSteps((n * (n - 1)) / 2);

        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (!sortingRef.current) return;

                setComparing([j, j + 1]);
                incrementComparisons();
                incrementAccess();
                setCurrentStep(++steps);
                await sleep(101 - speed);

                if (arr[j] > arr[j + 1]) {
                    setSwapping([j, j + 1]);
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    incrementSwaps();
                    setArray([...arr]);
                    await sleep(101 - speed);
                }
                setSwapping([]);
            }
            setSorted(prev => [...prev, n - 1 - i]);
        }
        setSorted(prev => [...prev, 0]);
        setComparing([]);
    };

    // Selection Sort Algorithm
    const selectionSort = async (arr) => {
        const n = arr.length;
        let steps = 0;
        setTotalSteps(n * n);

        for (let i = 0; i < n - 1; i++) {
            let minIdx = i;
            setComparing([i]);

            for (let j = i + 1; j < n; j++) {
                if (!sortingRef.current) return;

                setComparing([i, j, minIdx]);
                incrementComparisons();
                incrementAccess();
                setCurrentStep(++steps);
                await sleep(101 - speed);

                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }

            if (minIdx !== i) {
                setSwapping([i, minIdx]);
                [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
                incrementSwaps();
                setArray([...arr]);
                await sleep(101 - speed);
                setSwapping([]);
            }

            setSorted(prev => [...prev, i]);
        }
        setSorted(prev => [...prev, n - 1]);
        setComparing([]);
    };

    // Insertion Sort Algorithm
    const insertionSort = async (arr) => {
        const n = arr.length;
        let steps = 0;
        setTotalSteps(n * n);

        setSorted([0]);
        for (let i = 1; i < n; i++) {
            let key = arr[i];
            let j = i - 1;

            setComparing([i]);
            await sleep(101 - speed);

            while (j >= 0 && arr[j] > key) {
                if (!sortingRef.current) return;

                setComparing([j, j + 1]);
                setSwapping([j, j + 1]);
                incrementComparisons();
                incrementSwaps();
                setCurrentStep(++steps);

                arr[j + 1] = arr[j];
                setArray([...arr]);
                await sleep(101 - speed);

                j = j - 1;
                setSwapping([]);
            }

            arr[j + 1] = key;
            setArray([...arr]);
            setSorted(prev => [...prev, i]);
            await sleep(101 - speed);
        }
        setComparing([]);
    };

    // Quick Sort Algorithm
    const quickSort = async (arr, low = 0, high = arr.length - 1) => {
        if (low < high) {
            const pi = await partition(arr, low, high);
            if (!sortingRef.current) return;

            await quickSort(arr, low, pi - 1);
            if (!sortingRef.current) return;

            await quickSort(arr, pi + 1, high);
        }
    };

    const partition = async (arr, low, high) => {
        const pivot = arr[high];
        let i = low - 1;

        setPivot([high]);

        for (let j = low; j < high; j++) {
            if (!sortingRef.current) return i + 1;

            setComparing([high, j, i + 1]);
            incrementComparisons();
            incrementAccess();
            setCurrentStep(prev => prev + 1);
            await sleep(101 - speed);

            if (arr[j] < pivot) {
                i++;
                if (i !== j) {
                    setSwapping([i, j]);
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    incrementSwaps();
                    setArray([...arr]);
                    await sleep(101 - speed);
                    setSwapping([]);
                }
            }
        }

        setSwapping([i + 1, high]);
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        incrementSwaps();
        setArray([...arr]);
        await sleep(101 - speed);
        setSwapping([]);
        setPivot([]);

        return i + 1;
    };

    // Merge Sort Algorithm
    const mergeSort = async (arr, left = 0, right = arr.length - 1) => {
        if (left < right) {
            const mid = Math.floor((left + right) / 2);

            await mergeSort(arr, left, mid);
            if (!sortingRef.current) return;

            await mergeSort(arr, mid + 1, right);
            if (!sortingRef.current) return;

            await merge(arr, left, mid, right);
        }
    };

    const merge = async (arr, left, mid, right) => {
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);

        let i = 0, j = 0, k = left;

        setMerging(Array.from({ length: right - left + 1 }, (_, idx) => left + idx));

        while (i < leftArr.length && j < rightArr.length) {
            if (!sortingRef.current) return;

            setComparing([left + i, mid + 1 + j]);
            incrementComparisons();
            incrementAccess();
            setCurrentStep(prev => prev + 1);
            await sleep(101 - speed);

            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i];
                i++;
            } else {
                arr[k] = rightArr[j];
                j++;
            }

            setArray([...arr]);
            k++;
            await sleep(101 - speed);
        }

        while (i < leftArr.length) {
            if (!sortingRef.current) return;
            arr[k] = leftArr[i];
            setArray([...arr]);
            i++;
            k++;
            await sleep(101 - speed);
        }

        while (j < rightArr.length) {
            if (!sortingRef.current) return;
            arr[k] = rightArr[j];
            setArray([...arr]);
            j++;
            k++;
            await sleep(101 - speed);
        }

        setMerging([]);
        setComparing([]);
    };

    // Heap Sort Algorithm
    const heapSort = async (arr) => {
        const n = arr.length;
        setTotalSteps(n * Math.log2(n));

        // Build max heap
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            await heapify(arr, n, i);
            if (!sortingRef.current) return;
        }

        // Extract elements from heap
        for (let i = n - 1; i > 0; i--) {
            if (!sortingRef.current) return;

            setSwapping([0, i]);
            [arr[0], arr[i]] = [arr[i], arr[0]];
            incrementSwaps();
            setArray([...arr]);
            await sleep(101 - speed);
            setSwapping([]);

            setSorted(prev => [...prev, i]);
            await heapify(arr, i, 0);
        }
        setSorted(prev => [...prev, 0]);
    };

    const heapify = async (arr, n, i) => {
        let largest = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;

        if (left < n) {
            setComparing([largest, left]);
            incrementComparisons();
            incrementAccess();
            await sleep(101 - speed);
            if (arr[left] > arr[largest]) {
                largest = left;
            }
        }

        if (right < n) {
            setComparing([largest, right]);
            incrementComparisons();
            incrementAccess();
            await sleep(101 - speed);
            if (arr[right] > arr[largest]) {
                largest = right;
            }
        }

        if (largest !== i) {
            setSwapping([i, largest]);
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            incrementSwaps();
            setArray([...arr]);
            setCurrentStep(prev => prev + 1);
            await sleep(101 - speed);
            setSwapping([]);

            await heapify(arr, n, largest);
        }

        setComparing([]);
    };

    // Radix Sort Algorithm
    const radixSort = async (arr) => {
        const max = Math.max(...arr);
        const maxDigits = max.toString().length;
        setTotalSteps(maxDigits * arr.length);

        for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
            if (!sortingRef.current) return;
            await countingSort(arr, exp);
        }
    };

    const countingSort = async (arr, exp) => {
        const n = arr.length;
        const output = new Array(n);
        const count = new Array(10).fill(0);

        // Count occurrences
        for (let i = 0; i < n; i++) {
            const digit = Math.floor(arr[i] / exp) % 10;
            count[digit]++;
            setComparing([i]);
            incrementAccess();
            await sleep(101 - speed);
        }

        // Calculate positions
        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        // Build output array
        for (let i = n - 1; i >= 0; i--) {
            if (!sortingRef.current) return;

            const digit = Math.floor(arr[i] / exp) % 10;
            output[count[digit] - 1] = arr[i];
            count[digit]--;

            setComparing([i]);
            incrementAccess();
            incrementSwaps();
            setCurrentStep(prev => prev + 1);
            await sleep(101 - speed);
        }

        // Copy output to original array
        for (let i = 0; i < n; i++) {
            if (!sortingRef.current) return;

            arr[i] = output[i];
            setSwapping([i]);
            setArray([...arr]);
            await sleep(101 - speed);
        }

        setComparing([]);
        setSwapping([]);
    };

    // Start sorting
    const startSorting = async () => {
        if (isPaused) {
            setIsPaused(false);
            pauseRef.current = false;
            return;
        }

        sortingRef.current = true;
        pauseRef.current = false;
        setIsSorting(true);
        setIsPaused(false);
        resetVisualizationState();

        const arrCopy = [...array];

        try {
            switch (algorithm) {
                case 'bubble':
                    await bubbleSort(arrCopy);
                    break;
                case 'selection':
                    await selectionSort(arrCopy);
                    break;
                case 'insertion':
                    await insertionSort(arrCopy);
                    break;
                case 'quick':
                    setTotalSteps(array.length * Math.log2(array.length));
                    await quickSort(arrCopy);
                    setSorted(Array.from({ length: array.length }, (_, i) => i));
                    break;
                case 'merge':
                    setTotalSteps(array.length * Math.log2(array.length));
                    await mergeSort(arrCopy);
                    setSorted(Array.from({ length: array.length }, (_, i) => i));
                    break;
                case 'heap':
                    await heapSort(arrCopy);
                    break;
                case 'radix':
                    await radixSort(arrCopy);
                    setSorted(Array.from({ length: array.length }, (_, i) => i));
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.log('Sorting interrupted');
        }

        sortingRef.current = false;
        setIsSorting(false);
        setComparing([]);
        setSwapping([]);
        setPivot([]);
        setMerging([]);
    };

    // Stop sorting
    const stopSorting = () => {
        sortingRef.current = false;
        pauseRef.current = false;
        setIsSorting(false);
        setIsPaused(false);
        setComparing([]);
        setSwapping([]);
        setPivot([]);
        setMerging([]);
    };

    // Pause sorting
    const pauseSorting = () => {
        pauseRef.current = true;
        setIsPaused(true);
    };

    // Get bar color based on state
    const getBarColor = (index) => {
        if (sorted.includes(index)) return 'bg-green-500 shadow-green-500/50';
        if (swapping.includes(index)) return 'bg-red-500 shadow-red-500/50';
        if (pivot.includes(index)) return 'bg-purple-500 shadow-purple-500/50';
        if (merging.includes(index)) return 'bg-orange-500 shadow-orange-500/50';
        if (comparing.includes(index)) return 'bg-yellow-500 shadow-yellow-500/50';
        return 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/30';
    };

    // Get algorithm info
    const getAlgorithmInfo = () => {
        const info = {
            bubble: {
                name: 'Bubble Sort',
                complexity: 'O(n²)',
                description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
                stable: true,
                inPlace: true
            },
            selection: {
                name: 'Selection Sort',
                complexity: 'O(n²)',
                description: 'Finds the minimum element from the unsorted portion and places it at the beginning.',
                stable: false,
                inPlace: true
            },
            insertion: {
                name: 'Insertion Sort',
                complexity: 'O(n²)',
                description: 'Builds the final sorted array one item at a time, inserting each element in its correct position.',
                stable: true,
                inPlace: true
            },
            quick: {
                name: 'Quick Sort',
                complexity: 'O(n log n)',
                description: 'Divides the array into partitions around a pivot element and recursively sorts the partitions.',
                stable: false,
                inPlace: true
            },
            merge: {
                name: 'Merge Sort',
                complexity: 'O(n log n)',
                description: 'Divides the array into halves, sorts them separately, and then merges the sorted halves.',
                stable: true,
                inPlace: false
            },
            heap: {
                name: 'Heap Sort',
                complexity: 'O(n log n)',
                description: 'Builds a max heap from the array and repeatedly extracts the maximum element.',
                stable: false,
                inPlace: true
            },
            radix: {
                name: 'Radix Sort',
                complexity: 'O(d×n)',
                description: 'Sorts integers by processing individual digits from least to most significant digit.',
                stable: true,
                inPlace: false
            }
        };
        return info[algorithm];
    };

    const algorithmInfo = getAlgorithmInfo();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                        <BarChart3 className="text-blue-400" />
                        Advanced Sorting Visualizer
                    </h1>
                    <p className="text-gray-300">Interactive visualization of 7 different sorting algorithms</p>
                </div>

                {/* Controls */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {/* Algorithm Selection */}
                        <div>
                            <label className="flex text-white text-sm font-medium mb-2 items-center gap-2">
                                <Settings size={16} />
                                Algorithm
                            </label>
                            <select
                                value={algorithm}
                                onChange={(e) => setAlgorithm(e.target.value)}
                                disabled={isSorting}
                                className="w-full bg-blue-400 text-white rounded-lg px-3 py-2 border border-white/30 focus:border-blue-400 focus:outline-none disabled:opacity-50 backdrop-blur-sm"
                            >
                                <option value="bubble">Bubble Sort</option>
                                <option value="selection">Selection Sort</option>
                                <option value="insertion">Insertion Sort</option>
                                <option value="quick">Quick Sort</option>
                                <option value="merge">Merge Sort</option>
                                <option value="heap">Heap Sort</option>
                                <option value="radix">Radix Sort</option>
                            </select>
                        </div>

                        {/* Array Size */}
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Array Size: {arraySize}
                            </label>
                            <input
                                type="range"
                                min="10"
                                max="150"
                                value={arraySize}
                                onChange={(e) => setArraySize(parseInt(e.target.value))}
                                disabled={isSorting}
                                className="w-full accent-blue-500 disabled:opacity-50"
                            />
                        </div>

                        {/* Speed Control */}
                        <div>
                            <label className="block text-white text-sm font-medium mb-2  items-center gap-2">
                                <Zap size={16} />
                                Speed: {speed}%
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="100"
                                value={speed}
                                onChange={(e) => setSpeed(parseInt(e.target.value))}
                                className="w-full accent-blue-500"
                            />
                        </div>

                        {/* Progress */}
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Progress: {Math.round((currentStep / Math.max(totalSteps, 1)) * 100)}%
                            </label>
                            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300 shadow-lg"
                                    style={{ width: `${Math.min((currentStep / Math.max(totalSteps, 1)) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 justify-center">
                        <button
                            onClick={generateArray}
                            disabled={isSorting}
                            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <RotateCcw size={16} />
                            Generate Array
                        </button>

                        {!isSorting ? (
                            <button
                                onClick={startSorting}
                                disabled={array.length === 0}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <Play size={16} />
                                {isPaused ? 'Resume' : 'Start'} Sorting
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={pauseSorting}
                                    disabled={isPaused}
                                    className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    <Pause size={16} />
                                    Pause
                                </button>
                                <button
                                    onClick={stopSorting}
                                    className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Stop
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => setShowStats(!showStats)}
                            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <Info size={16} />
                            {showStats ? 'Hide' : 'Show'} Stats
                        </button>
                    </div>
                </div>

                {/* Algorithm Info & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    {/* Algorithm Info */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-2xl">
                        <div className="flex items-center gap-2 mb-3">
                            <Settings size={20} className="text-blue-400" />
                            <h3 className="text-xl font-semibold text-white">{algorithmInfo.name}</h3>
                            <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-lg text-sm font-mono">
                                {algorithmInfo.complexity}
                            </span>
                        </div>
                        <p className="text-gray-300 mb-3">{algorithmInfo.description}</p>
                        <div className="flex gap-4 text-sm">
                            <span className={`px-2 py-1 rounded ${algorithmInfo.stable ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                {algorithmInfo.stable ? 'Stable' : 'Unstable'}
                            </span>
                            <span className={`px-2 py-1 rounded ${algorithmInfo.inPlace ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                {algorithmInfo.inPlace ? 'In-place' : 'Not in-place'}
                            </span>
                        </div>
                    </div>

                    {/* Statistics */}
                    {showStats && (
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-2xl">
                            <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                                <BarChart3 size={20} className="text-green-400" />
                                Statistics
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-white/10 rounded-lg p-3">
                                    <div className="text-gray-400">Array Accesses</div>
                                    <div className="text-2xl font-bold text-white">{accessCount.toLocaleString()}</div>
                                </div>
                                <div className="bg-white/10 rounded-lg p-3">
                                    <div className="text-gray-400">Comparisons</div>
                                    <div className="text-2xl font-bold text-yellow-400">{comparisons.toLocaleString()}</div>
                                </div>
                                <div className="bg-white/10 rounded-lg p-3">
                                    <div className="text-gray-400">Swaps</div>
                                    <div className="text-2xl font-bold text-red-400">{swaps.toLocaleString()}</div>
                                </div>
                                <div className="bg-white/10 rounded-lg p-3">
                                    <div className="text-gray-400">Array Size</div>
                                    <div className="text-2xl font-bold text-blue-400">{array.length}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Visualization Area */}
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
                    <div className="flex items-end justify-center space-x-1 h-96 overflow-x-auto">
                        {array.map((value, index) => (
                            <div
                                key={index}
                                className={`transition-all duration-200 ${getBarColor(index)} rounded-t-lg min-w-[2px] flex-shrink-0 shadow-lg border-t-2 border-white/20`}
                                style={{
                                    height: `${(value / 410) * 100}%`,
                                    width: `${Math.max(600 / arraySize, 2)}px`
                                }}
                                title={`Index: ${index}, Value: ${value}`}
                            />
                        ))}
                    </div>

                    {/* Enhanced Legend */}
                    <div className="flex justify-center mt-6 space-x-4 text-sm flex-wrap gap-2">
                        <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg">
                            <div className="w-4 h-4 bg-blue-500 rounded shadow-lg"></div>
                            <span className="text-gray-300">Unsorted</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg">
                            <div className="w-4 h-4 bg-yellow-500 rounded shadow-lg"></div>
                            <span className="text-gray-300">Comparing</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg">
                            <div className="w-4 h-4 bg-red-500 rounded shadow-lg"></div>
                            <span className="text-gray-300">Swapping</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg">
                            <div className="w-4 h-4 bg-purple-500 rounded shadow-lg"></div>
                            <span className="text-gray-300">Pivot</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg">
                            <div className="w-4 h-4 bg-orange-500 rounded shadow-lg"></div>
                            <span className="text-gray-300">Merging</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg">
                            <div className="w-4 h-4 bg-green-500 rounded shadow-lg"></div>
                            <span className="text-gray-300">Sorted</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SortingVisualizer;