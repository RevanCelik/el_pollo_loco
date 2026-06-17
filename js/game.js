let canvas;
let world;
let keyboard = new Keyboard();
let audioManager = new AudioManager();

/**
 * Initializes the start screen and registers the initial user interactions.
 *
 * @returns {void}
 */
function initStartScreen() {
    canvas = document.getElementById('canvas');
    bindTouchControls();
    document.addEventListener('click', playStartScreenMusicOnce);
}

/**
 * Starts the start-screen music after the first click and removes its listener.
 *
 * @returns {void}
 */
function playStartScreenMusicOnce() {
    audioManager.playStartScreenMusic();
    document.removeEventListener('click', playStartScreenMusicOnce);
}

/**
 * Starts a new game and switches from the start screen to the game view.
 *
 * @returns {void}
 */
function startGame() {
    audioManager.playStartButtonSound();
    hideStartScreen();
    showGameTitle();
    showMobileControls();
    init();
    setTimeout(playGameMusic, 250);
}

/**
 * Starts the background music for the active game.
 *
 * @returns {void}
 */
function playGameMusic() {
    audioManager.playGameMusic();
}

/**
 * Displays the controls intended for mobile and touch devices.
 *
 * @returns {void}
 */
function showMobileControls() {
    document.getElementById('mobileControls').classList.remove('hidden');
}

/**
 * Hides the controls intended for mobile and touch devices.
 *
 * @returns {void}
 */
function hideMobileControls() {
    document.getElementById('mobileControls').classList.add('hidden');
}

/**
 * Hides the game's start screen.
 *
 * @returns {void}
 */
function hideStartScreen() {
    document.getElementById('startScreen').classList.add('hidden');
}

/**
 * Displays the title above the active game.
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
    console.log('My Character:', world.character);
}

/**
 * Plays the button sound and reloads the page to restart the game.
 *
 * @returns {void}
 */
function restartGame() {
    audioManager.playStartButtonSound();
    setTimeout(reloadGame, 250);
}

/**
 * Stops all music and reloads the current page.
 *
 * @returns {void}
 */
function reloadGame() {
    audioManager.stopAllMusic();
    location.reload();
}

/**
 * Marks the keyboard control matching a pressed key as active.
 *
 * @param {KeyboardEvent} event - The keydown event triggered by the browser.
 * @returns {void}
 */
function handleKeyDown(event) {
    setKeyboardState(event.code, true);
}

/**
 * Marks the keyboard control matching a released key as inactive.
 *
 * @param {KeyboardEvent} event - The keyup event triggered by the browser.
 * @returns {void}
 */
function handleKeyUp(event) {
    setKeyboardState(event.code, false);
}

/**
 * Updates a game-control property for a supported keyboard code.
 *
 * @param {string} code - The physical keyboard code to process.
 * @param {boolean} isPressed - Whether the corresponding key is pressed.
 * @returns {void}
 */
function setKeyboardState(code, isPressed) {
    const keyMap = {
        ArrowRight: 'RIGHT',
        ArrowLeft: 'LEFT',
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        Space: 'SPACE',
        KeyD: 'D'
    };

    const key = keyMap[code];

    if (key) {
        keyboard[key] = isPressed;
    }
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

/**
 * Connects a touch button with a property of the shared keyboard state.
 *
 * @param {string} buttonId - The HTML id of the touch-control button.
 * @param {string} key - The keyboard-state property controlled by the button.
 * @returns {void}
 */
function bindTouchButton(buttonId, key) {
    const button = document.getElementById(buttonId);

    if (!button) {
        return;
    }

    button.dataset.controlKey = key;
    button.addEventListener('touchstart', handleTouchStart);
    button.addEventListener('touchend', handleTouchEnd);
}

/**
 * Activates the control assigned to a touched mobile button.
 *
 * @param {TouchEvent} event - The touchstart event triggered by the button.
 * @returns {void}
 */
function handleTouchStart(event) {
    updateTouchKey(event, true);
}

/**
 * Deactivates the control assigned to a released mobile button.
 *
 * @param {TouchEvent} event - The touchend event triggered by the button.
 * @returns {void}
 */
function handleTouchEnd(event) {
    updateTouchKey(event, false);
}

/**
 * Updates the keyboard state associated with a touch-control button.
 *
 * @param {TouchEvent} event - The touch event triggered by the control button.
 * @param {boolean} isPressed - Whether the touch control is currently pressed.
 * @returns {void}
 */
function updateTouchKey(event, isPressed) {
    event.preventDefault();

    const key = event.currentTarget.dataset.controlKey;
    keyboard[key] = isPressed;
}

/**
 * Binds all mobile control buttons to their corresponding game controls.
 *
 * @returns {void}
 */
function bindTouchControls() {
    bindTouchButton('btnLeft', 'LEFT');
    bindTouchButton('btnRight', 'RIGHT');
    bindTouchButton('btnSpace', 'SPACE');
    bindTouchButton('btnD', 'D');
}
