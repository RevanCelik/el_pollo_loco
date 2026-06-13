let canvas;
let world;
let keyboard = new Keyboard();
let audioManager = new AudioManager();

function initStartScreen() {
    canvas = document.getElementById('canvas');
    bindTouchControls();
    document.addEventListener('click', playStartScreenMusicOnce);
}

function playStartScreenMusicOnce() {
    audioManager.playStartScreenMusic();
    document.removeEventListener('click', playStartScreenMusicOnce);
}

function startGame() {
    audioManager.playStartButtonSound();

    hideStartScreen();
    showGameTitle();
    showMobileControls();
    init();

    setTimeout(() => {
        audioManager.playGameMusic();
    }, 250);
}

function showMobileControls() {
    document.getElementById('mobileControls').classList.remove('hidden');
}

function hideMobileControls() {
    document.getElementById('mobileControls').classList.add('hidden');
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
    audioManager.playStartButtonSound();

    setTimeout(() => {
        audioManager.stopAllMusic();
        location.reload();
    }, 250);
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

function bindTouchButton(buttonId, key) {
    let button = document.getElementById(buttonId);

    if (!button) {
        return;
    }

    button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard[key] = true;
    });

    button.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard[key] = false;
    });
}

function bindTouchControls() {
    bindTouchButton('btnLeft', 'LEFT');
    bindTouchButton('btnRight', 'RIGHT');
    bindTouchButton('btnSpace', 'SPACE');
    bindTouchButton('btnD', 'D');
}