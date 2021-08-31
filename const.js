const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const dx = 1;
const dy = 1;
const endY = 19;
const endX = 9;
const COLORS = [
    'none',
    'cyan',
    'blue',
    'orange',
    'yellow',
    'green',
    'purple',
    'red'
];
const KEY = {
    ESC: 27,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    P: 80,
    Q: 81
}
const SHAPES = [
    [],
    [
        [0, 0, 0, 0, 0], 
        [1, 1, 1, 1, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0]
    ],
    [
        [2, 0, 0], 
        [2, 2, 2], 
        [0, 0, 0]
    ],
    [
        [0, 0, 3], 
        [3, 3, 3], 
        [0, 0, 0]
    ],
    [
        [4, 4, 0],
        [4, 4, 0],
        [0, 0, 0]
    ],
    [
        [0, 5, 5],
        [5, 5, 0], 
        [0, 0, 0]
    ],
    [
        [0, 6, 0], 
        [6, 6, 6], 
        [0, 0, 0]
    ],
    [
        [7, 7, 0],
        [0, 7, 7], 
        [0, 0, 0]
    ]
];