class AudioManager {
    startScreenMusic = new Audio('audio/startscreen_from_gameplay_music.wav');
    gameMusic = new Audio('audio/desert_chicken_dash_background.wav');

    startButtonSound = new Audio('audio/button_start_select.wav');
    gameOverSound = new Audio('audio/character_dead.wav');
    characterHurtSound = new Audio('audio/character_hurt.wav');
    chickenDeadSound = new Audio('audio/chicken_dead.wav');

    bottleThrowSound = new Audio('audio/bottle_throw.wav');
    bottleBreakSound = new Audio('audio/bottle_break.wav');

    coinSound = new Audio('audio/coin.wav');
    bottlePickupSound = new Audio('audio/bottle_pickup.wav');

    winnerSound = new Audio('audio/winner_sound.wav');

    gameOverScreenMusic = new Audio('audio/game_over_screen_music.wav');
    winnerScreenMusic = new Audio('audio/winner_screen_music.wav');

    isCharacterHurtSoundPlaying = false;
    isGameOverSoundPlaying = false;

    constructor() {
        this.startScreenMusic.loop = true;
        this.startScreenMusic.volume = 0.15;

        this.gameMusic.loop = true;
        this.gameMusic.volume = 0.25;

        this.startButtonSound.volume = 0.45;
        this.gameOverSound.volume = 0.6;
        this.characterHurtSound.volume = 0.55;
        this.chickenDeadSound.volume = 0.55;

        this.bottleThrowSound.volume = 0.55;
        this.bottleBreakSound.volume = 0.55;

        this.coinSound.volume = 0.45;
        this.bottlePickupSound.volume = 0.45;

        this.winnerSound.volume = 0.7;

        this.gameOverScreenMusic.loop = true;
        this.gameOverScreenMusic.volume = 0.22;

        this.winnerScreenMusic.loop = true;
        this.winnerScreenMusic.volume = 0.22;
    }

    playStartScreenMusic() {
        this.stopGameMusic();
        this.startScreenMusic.play();
    }

    stopStartScreenMusic() {
        this.startScreenMusic.pause();
        this.startScreenMusic.currentTime = 0;
    }

    playGameMusic() {
        this.stopStartScreenMusic();
        this.gameMusic.currentTime = 0;
        this.gameMusic.play();
    }

    stopGameMusic() {
        this.gameMusic.pause();
        this.gameMusic.currentTime = 0;
    }

    playStartButtonSound() {
        this.startButtonSound.currentTime = 0;
        this.startButtonSound.play();
    }

    playGameOverSound() {
        if (this.isGameOverSoundPlaying) {
            return;
        }

        this.isGameOverSoundPlaying = true;
        this.gameOverSound.currentTime = 0;
        this.gameOverSound.play();
    }

    playCharacterHurtSound(characterIsDead) {
        if (
            this.isCharacterHurtSoundPlaying ||
            this.isGameOverSoundPlaying ||
            characterIsDead
        ) {
            return;
        }

        this.isCharacterHurtSoundPlaying = true;
        this.characterHurtSound.currentTime = 0;
        this.characterHurtSound.play();

        this.characterHurtSound.onended = () => {
            this.isCharacterHurtSoundPlaying = false;
        };
    }

    playChickenDeadSound() {
        this.chickenDeadSound.currentTime = 0;
        this.chickenDeadSound.play();
    }

    playBottleThrowSound() {
        this.bottleThrowSound.currentTime = 0;
        this.bottleThrowSound.play();
    }

    playBottleBreakSound() {
        this.bottleBreakSound.currentTime = 0;
        this.bottleBreakSound.play();
    }

    playCoinSound() {
        this.coinSound.currentTime = 0;
        this.coinSound.play();
    }

    playBottlePickupSound() {
        this.bottlePickupSound.currentTime = 0;
        this.bottlePickupSound.play();
    }

    playWinnerSound() {
        this.stopGameMusic();
        this.winnerSound.currentTime = 0;
        this.winnerSound.play();
    }

    playWinnerSoundThenScreenMusic() {
        this.stopGameMusic();
        this.stopGameOverScreenMusic();
        this.stopWinnerScreenMusic();

        this.winnerSound.currentTime = 0;
        this.winnerSound.play();

        this.winnerSound.onended = () => {
            this.playWinnerScreenMusic();
        };
    }

    playGameOverScreenMusic() {
        this.stopGameMusic();
        this.stopWinnerScreenMusic();

        this.gameOverScreenMusic.currentTime = 0;
        this.gameOverScreenMusic.play();
    }

    stopGameOverScreenMusic() {
        this.gameOverScreenMusic.pause();
        this.gameOverScreenMusic.currentTime = 0;
    }

    playWinnerScreenMusic() {
        this.stopGameMusic();
        this.stopGameOverScreenMusic();

        this.winnerScreenMusic.currentTime = 0;
        this.winnerScreenMusic.play();
    }

    stopWinnerScreenMusic() {
        this.winnerScreenMusic.pause();
        this.winnerScreenMusic.currentTime = 0;
    }

    stopAllMusic() {
        this.stopStartScreenMusic();
        this.stopGameMusic();
        this.stopGameOverScreenMusic();
        this.stopWinnerScreenMusic();
    }
}