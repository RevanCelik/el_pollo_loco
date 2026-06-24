const fullscreenElement = document.getElementById('fullscreen');
const toggleButton = document.getElementById('fullscreenButton');

/**
 * Toggles fullscreen mode for the game.
 *
 * @returns {Promise<void>}
 */
toggleButton.addEventListener('click', async () => {
    if (isFullscreenActive()) {
        await closeFullscreen();
        return;
    }

    await openFullscreen();
});

/**
 * Checks whether fullscreen mode is currently active.
 *
 * @returns {boolean}
 */
function isFullscreenActive() {
    return Boolean(
        document.fullscreenElement ||
        document.webkitFullscreenElement
    );
}

/**
 * Opens fullscreen mode for the game wrapper.
 *
 * @returns {Promise<void>}
 */
async function openFullscreen() {
    try {
        if (fullscreenElement.requestFullscreen) {
            await fullscreenElement.requestFullscreen();
        } else if (fullscreenElement.webkitRequestFullscreen) {
            fullscreenElement.webkitRequestFullscreen();
        } else {
            enableFullscreenFallback();
        }
    } catch (error) {
        enableFullscreenFallback();
    }
}

/**
 * Closes fullscreen mode.
 *
 * @returns {Promise<void>}
 */
async function closeFullscreen() {
    if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
    } else if (
        document.webkitFullscreenElement &&
        document.webkitExitFullscreen
    ) {
        document.webkitExitFullscreen();
    } else {
        disableFullscreenFallback();
    }
}

/**
 * Enables a fullscreen-like fallback for unsupported mobile browsers.
 *
 * @returns {void}
 */
function enableFullscreenFallback() {
    fullscreenElement.classList.add('fullscreen-fallback');
    document.body.classList.add('fullscreen-active');
}

/**
 * Disables the fullscreen fallback.
 *
 * @returns {void}
 */
function disableFullscreenFallback() {
    fullscreenElement.classList.remove('fullscreen-fallback');
    document.body.classList.remove('fullscreen-active');
}

/**
 * Toggles the music state and updates the audio buttons.
 *
 * @returns {void}
 */
function toggleMusic() {
    audioManager.toggleMusic();
    updateAudioButtons();
}

/**
 * Toggles the sound-effect state and updates the audio buttons.
 *
 * @returns {void}
 */
function toggleSfx() {
    audioManager.toggleSfx();
    updateAudioButtons();
}

/**
 * Updates the audio button labels using the current settings.
 *
 * @returns {void}
 */
function updateAudioButtons() {
    let musicButton = document.getElementById('musicButton');
    let sfxButton = document.getElementById('sfxButton');

    musicButton.innerText =
        audioManager.musicMuted ? 'Music: OFF' : 'Music: ON';

    sfxButton.innerText =
        audioManager.sfxMuted ? 'SFX: OFF' : 'SFX: ON';
}

document.addEventListener('DOMContentLoaded', updateAudioButtons);

