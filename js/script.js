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

