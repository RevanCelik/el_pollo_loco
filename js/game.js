let canvas;
let world;
let keyboard = new Keyboard();
let audioManager = new AudioManager();

/**
 * Initializes the start screen, touch controls, and the initial music listener.
 *
 * @returns {void}
 */
function initStartScreen() {
    canvas = document.getElementById('canvas');
    bindTouchControls();
    document.addEventListener('click', playStartScreenMusicOnce);
}

/**
 * Plays the start-screen music once and removes the associated click listener.
 *
 * @returns {void}
 */
function playStartScreenMusicOnce() {
    audioManager.playStartScreenMusic();
    document.removeEventListener('click', playStartScreenMusicOnce);
}

/**
 * Starts the game and switches the user interface to the active game view.
 *
 * @returns {void}
 */
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

/**
 * Displays the mobile control buttons.
 *
 * @returns {void}
 */
function showMobileControls() {
    document.getElementById('mobileControls').classList.remove('hidden');
}

/**
 * Hides the mobile control buttons.
 *
 * @returns {void}
 */
function hideMobileControls() {
    document.getElementById('mobileControls').classList.add('hidden');
}

/**
 * Hides the start screen.
 *
 * @returns {void}
 */
function hideStartScreen() {
    document.getElementById('startScreen').classList.add('hidden');
}

/**
 * Displays the game title.
 *
 * @returns {void}
 */
function showGameTitle() {
    document.getElementById('gameTitle').classList.remove('hidden');
}

/**
 * Initializes the canvas and creates the game world.
 *
 * @returns {void}
 */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

/**
 * Plays the start-button sound and reloads the page to restart the game.
 *
 * @returns {void}
 */
function restartGame() {
    audioManager.playStartButtonSound();

    setTimeout(() => {
        audioManager.stopAllMusic();
        location.reload();
    }, 250);
}

/**
 * Updates the keyboard state when a supported key is pressed.
 *
 * @param {KeyboardEvent} e - The keyboard event.
 * @returns {void}
 */
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

/**
 * Updates the keyboard state when a supported key is released.
 *
 * @param {KeyboardEvent} e - The keyboard event.
 * @returns {void}
 */
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

/**
 * Connects a touch button to a keyboard-state property.
 *
 * @param {string} buttonId - The ID of the touch-control button.
 * @param {string} key - The keyboard-state property controlled by the button.
 * @returns {void}
 */
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

/**
 * Binds all mobile touch buttons to their corresponding controls.
 *
 * @returns {void}
 */
function bindTouchControls() {
    bindTouchButton('btnLeft', 'LEFT');
    bindTouchButton('btnRight', 'RIGHT');
    bindTouchButton('btnSpace', 'SPACE');
    bindTouchButton('btnD', 'D');
}

document.addEventListener('DOMContentLoaded', () => {
    disableMobileButtonContextMenu();
});

function disableMobileButtonContextMenu() {
    const mobileButtons = document.querySelectorAll('.mobile-btn');

    mobileButtons.forEach((button) => {
        button.addEventListener('contextmenu', preventDefaultAction);
        button.addEventListener('dragstart', preventDefaultAction);
    });
}

function preventDefaultAction(event) {
    event.preventDefault();
}