const fullscreenElement = document.getElementById('fullscreen');
const toggleButton = document.getElementById('fullscreenButton');

/**
 * Toggles fullscreen mode for the configured game element.
 *
 * @returns {void}
 */
toggleButton.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        fullscreenElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

/**
 * Toggles the music state and updates the music button text.
 *
 * @returns {void}
 */
function toggleMusic() {
    audioManager.toggleMusic();

    let button = document.getElementById('musicButton');
    button.innerText = audioManager.musicMuted ? 'Music: OFF' : 'Music: ON';
}

/**
 * Toggles the sound-effect state and updates the SFX button text.
 *
 * @returns {void}
 */
function toggleSfx() {
    audioManager.toggleSfx();

    let button = document.getElementById('sfxButton');
    button.innerText = audioManager.sfxMuted ? 'SFX: OFF' : 'SFX: ON';
}

