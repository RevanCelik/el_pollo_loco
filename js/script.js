const fullscreenElement = document.getElementById('fullscreen');
const toggleButton = document.getElementById('fullscreenButton');

toggleButton.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        fullscreenElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

