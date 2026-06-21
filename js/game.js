let canvas;
let world;
let keyboard = new Keyboard();
let audioManager = new AudioManager();

/**
 * Initializes the start screen, touch controls, and global input listeners.
 *
 * @returns {void}
 */
function initStartScreen() {
    canvas = document.getElementById('canvas');
    bindTouchControls();
    bindGameContextMenu();
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
 * Restarts the game without reloading the page.
 *
 * @returns {void}
 */
function restartGame() {
    audioManager.playStartButtonSound();

    setTimeout(() => {
        stopCurrentWorld();
        resetGameOverlays();
        resetGameState();
        init();
        showGameTitle();
        showMobileControls();
        audioManager.playGameMusic();
    }, 250);
}

/**
 * Stops the currently active game world.
 *
 * @returns {void}
 */
function stopCurrentWorld() {
    if (world) {
        world.stop();
        world = null;
    }
}

/**
 * Hides the winner and game-over overlays.
 *
 * @returns {void}
 */
function resetGameOverlays() {
    document.getElementById('gameOverOverlay').classList.add('hidden');
    document.getElementById('winnerOverlay').classList.add('hidden');
}

/**
 * Recreates the level, keyboard state, and audio manager.
 *
 * @returns {void}
 */
function resetGameState() {
    audioManager.reset();
    level1 = createLevel1();
    keyboard = new Keyboard();
}

/**
 * Stops the current game and returns to the main menu.
 *
 * @returns {void}
 */
function backToMainMenu() {
    stopCurrentWorld();
    resetGameState();
    resetGameOverlays();
    hideMobileControls();
    hideGameTitle();
    showStartScreen();
    audioManager.playStartScreenMusic();
}

/**
 * Hides the game title.
 *
 * @returns {void}
 */
function hideGameTitle() {
    document.getElementById('gameTitle').classList.add('hidden');
}

/**
 * Displays the start screen.
 *
 * @returns {void}
 */
function showStartScreen() {
    document.getElementById('startScreen').classList.remove('hidden');
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

/**
 * Resets all active keyboard controls.
 *
 * @returns {void}
 */
function resetKeyboard() {
    keyboard.RIGHT = false;
    keyboard.LEFT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.SPACE = false;
    keyboard.D = false;
}

/**
 * Disables the context menu inside the game area.
 *
 * @returns {void}
 */
function bindGameContextMenu() {
    const fullscreen = document.getElementById('fullscreen');

    fullscreen.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        resetKeyboard();
    });
}

window.addEventListener('blur', resetKeyboard);

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        resetKeyboard();
    }
});

/**
 * Disables the context menu and drag behavior for all mobile control buttons.
 *
 * @returns {void}
 */
function disableMobileButtonContextMenu() {
    const mobileButtons = document.querySelectorAll('.mobile-btn');

    mobileButtons.forEach((button) => {
        button.addEventListener('contextmenu', preventDefaultAction);
        button.addEventListener('dragstart', preventDefaultAction);
    });
}

/**
 * Prevents the browser's default behavior for the specified event.
 *
 * @param {Event} event - The browser event whose default action should be prevented.
 * @returns {void}
 */
function preventDefaultAction(event) {
    event.preventDefault();
}