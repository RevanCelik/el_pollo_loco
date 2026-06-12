let canvas;
let world;
let keyboard = new Keyboard();

function initStartScreen() {
    canvas = document.getElementById('canvas');
}

function startGame() {
    hideStartScreen();
    showGameTitle();
    init();
}

function hideStartScreen() {
    document.getElementById('startScreen').classList.add('hidden');
}

function showGameTitle() {
    document.getElementById('gameTitle').classList.remove('hidden');
}

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);

    console.log('My Character:', world.character);
}

function restartGame() {
    location.reload();
}

window.addEventListener("keydown", (e) => {
    if (e.code === "ArrowRight") {
        keyboard.RIGHT = true;
    }

    if (e.code === "ArrowLeft") {
        keyboard.LEFT = true;
    }

    if (e.code === "ArrowUp") {
        keyboard.UP = true;
    }

    if (e.code === "ArrowDown") {
        keyboard.DOWN = true;
    }

    if (e.code === "Space") {
        keyboard.SPACE = true;
    }

    if (e.code === "KeyD") {
        keyboard.D = true;
    }
});

window.addEventListener("keyup", (e) => {
    if (e.code === "ArrowRight") {
        keyboard.RIGHT = false;
    }

    if (e.code === "ArrowLeft") {
        keyboard.LEFT = false;
    }

    if (e.code === "ArrowUp") {
        keyboard.UP = false;
    }

    if (e.code === "ArrowDown") {
        keyboard.DOWN = false;
    }

    if (e.code === "Space") {
        keyboard.SPACE = false;
    }

    if (e.code === "KeyD") {
        keyboard.D = false;
    }
});

document.getElementById('btnLeft').addEventListener('touchstart', (e) => {
    e.preventDefault();
    keyboard.LEFT = true;
});

document.getElementById('btnLeft').addEventListener('touchend', (e) => {
    e.preventDefault();
    keyboard.LEFT = false;
});

document.getElementById('btnRight').addEventListener('touchstart', (e) => {
    e.preventDefault();
    keyboard.RIGHT = true;
});

document.getElementById('btnRight').addEventListener('touchend', (e) => {
    e.preventDefault();
    keyboard.RIGHT = false;
});

document.getElementById('btnUp').addEventListener('touchstart', (e) => {
    e.preventDefault();
    keyboard.UP = true;
});

document.getElementById('btnUp').addEventListener('touchend', (e) => {
    e.preventDefault();
    keyboard.UP = false;
});

document.getElementById('btnDown').addEventListener('touchstart', (e) => {
    e.preventDefault();
    keyboard.DOWN = true;
});

document.getElementById('btnDown').addEventListener('touchend', (e) => {
    e.preventDefault();
    keyboard.DOWN = false;
});

document.getElementById('btnSpace').addEventListener('touchstart', (e) => {
    e.preventDefault();
    keyboard.SPACE = true;
});

document.getElementById('btnSpace').addEventListener('touchend', (e) => {
    e.preventDefault();
    keyboard.SPACE = false;
});

document.getElementById('btnD').addEventListener('touchstart', (e) => {
    e.preventDefault();
    keyboard.D = true;
});

document.getElementById('btnD').addEventListener('touchend', (e) => {
    e.preventDefault();
    keyboard.D = false;
});