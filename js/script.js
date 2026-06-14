const fullscreenElement = document.getElementById('fullscreen');
const toggleButton = document.getElementById('fullscreenButton');

toggleButton.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        fullscreenElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

function toggleMusic() {
    audioManager.toggleMusic();

    let button = document.getElementById('musicButton');
    button.innerText = audioManager.musicMuted ? 'Music: OFF' : 'Music: ON';
}

function toggleSfx() {
    audioManager.toggleSfx();

    let button = document.getElementById('sfxButton');
    button.innerText = audioManager.sfxMuted ? 'SFX: OFF' : 'SFX: ON';
}

