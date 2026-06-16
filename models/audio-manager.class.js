class AudioManager {
    startScreenMusic = new Audio('audio/startscreen_from_gameplay_music.wav');
    gameMusic = new Audio('audio/desert_chicken_dash_background.wav');

    startButtonSound = new Audio('audio/button_start_select.wav');
    gameOverSound = new Audio('audio/character_dead.wav');
    characterHurtSound = new Audio('audio/character_hurt.wav');
    chickenDeadSound = new Audio('audio/chicken_dead.wav');

    characterJumpSound = new Audio('audio/character_jump.wav');

    bottleThrowSound = new Audio('audio/bottle_throw.wav');
    bottleBreakSound = new Audio('audio/bottle_break.wav');

    coinSound = new Audio('audio/coin.wav');
    bottlePickupSound = new Audio('audio/bottle_pickup.wav');

    winnerSound = new Audio('audio/winner_sound.wav');

    gameOverScreenMusic = new Audio('audio/game_over_screen_music.wav');
    winnerScreenMusic = new Audio('audio/winner_screen_music.wav');

    footstepLoop = new Audio('audio/footstep_sand_loop.wav');

    endbossIntroSound = new Audio('audio/endboss_angry_chicken.wav');
    endbossDefeatedSound = new Audio('audio/endboss_defeated.wav');
    isEndbossIntroSoundPlayed = false;

    isCharacterHurtSoundPlaying = false;
    isGameOverSoundPlaying = false;

    musicMuted = false;
    sfxMuted = false;
    musicVolume = 0.4;
    sfxVolume = 0.8;
    currentMusic = null;

    constructor() {
        this.startScreenMusic.loop = true;
        this.startScreenMusic.volume = 0.15;

        this.gameMusic.loop = true;
        this.gameMusic.volume = 0.25;

        this.startButtonSound.volume = 0.45;
        this.gameOverSound.volume = 0.6;
        this.characterHurtSound.volume = 0.55;
        this.chickenDeadSound.volume = 0.55;

        this.characterJumpSound.volume = 0.55;

        this.footstepLoop.loop = true;
        this.footstepLoop.volume = 0.16;

        this.bottleThrowSound.volume = 0.55;
        this.bottleBreakSound.volume = 0.55;

        this.coinSound.volume = 0.45;
        this.bottlePickupSound.volume = 0.45;

        this.endbossIntroSound.volume = 0.55;
        this.endbossDefeatedSound.volume = 0.65;

        this.winnerSound.volume = 0.7;

        this.gameOverScreenMusic.loop = true;
        this.gameOverScreenMusic.volume = 0.22;

        this.winnerScreenMusic.loop = true;
        this.winnerScreenMusic.volume = 0.22;
    }

    playStartScreenMusic() {
        this.stopGameMusic();
        this.playMusic(this.startScreenMusic);
    }

    stopStartScreenMusic() {
        this.startScreenMusic.pause();
        this.startScreenMusic.currentTime = 0;
    }

    playGameMusic() {
        this.stopStartScreenMusic();
        this.gameMusic.currentTime = 0;
        this.playMusic(this.gameMusic);
    }

    stopGameMusic() {
        this.gameMusic.pause();
        this.gameMusic.currentTime = 0;
    }

    playStartButtonSound() {
        this.playSfx(this.startButtonSound);
    }

    playGameOverSound() {
        if (this.isGameOverSoundPlaying) {
            return;
        }

        this.stopCharacterHurtSound();
        this.isGameOverSoundPlaying = true;
        this.playSfx(this.gameOverSound);
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
        this.playSfx(this.characterHurtSound);

        this.characterHurtSound.onended = () => {
            this.isCharacterHurtSoundPlaying = false;
        };
    }

    stopCharacterHurtSound() {
        this.characterHurtSound.pause();
        this.characterHurtSound.currentTime = 0;
        this.isCharacterHurtSoundPlaying = false;
    }

    playChickenDeadSound() {
        this.playSfx(this.chickenDeadSound);
    }

    playBottleThrowSound() {
        this.playSfx(this.bottleThrowSound);
    }

    playBottleBreakSound() {
        this.playSfx(this.bottleBreakSound);
    }

    playCoinSound() {
        this.playSfx(this.coinSound);
    }

    playBottlePickupSound() {
        this.playSfx(this.bottlePickupSound);
    }

    playFootstepLoop() {
        if (!this.footstepLoop.paused) {
            return;
        }

        this.footstepLoop.currentTime = 0;
        this.footstepLoop.play();
    }

    stopFootstepLoop() {
        this.footstepLoop.pause();
        this.footstepLoop.currentTime = 0;
    }

    playCharacterJumpSound() {
        this.playSfx(this.characterJumpSound);
    }

    playEndbossIntroSound() {
        if (this.isEndbossIntroSoundPlayed) {
            return;
        }

        this.isEndbossIntroSoundPlayed = true;
        this.endbossIntroSound.currentTime = 0;
        this.endbossIntroSound.play();
    }

    playEndbossDefeatedSound() {
        this.playSfx(this.endbossDefeatedSound);
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
        this.playMusic(this.gameOverScreenMusic);
    }

    stopGameOverScreenMusic() {
        this.gameOverScreenMusic.pause();
        this.gameOverScreenMusic.currentTime = 0;
    }

    playWinnerScreenMusic() {
        this.stopGameMusic();
        this.stopGameOverScreenMusic();

        this.winnerScreenMusic.currentTime = 0;
        this.playMusic(this.winnerScreenMusic);
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
        this.stopFootstepLoop();
    }

    playMusic(music) {
        this.currentMusic = music;

        if (this.musicMuted) {
            return;
        }

        music.volume = this.musicVolume;
        music.play();
    }

    playSfx(sound) {
        if (this.sfxMuted) {
            return;
        }

        sound.currentTime = 0;
        sound.volume = this.sfxVolume;
        sound.play();
    }

    toggleMusic() {
        this.musicMuted = !this.musicMuted;

        if (this.musicMuted) {
            this.pauseAllMusic();
            return;
        }

        this.resumeCurrentMusic();
    }

    toggleSfx() {
        this.sfxMuted = !this.sfxMuted;
        this.applyVolumes();
    }

    applyVolumes() {
        this.getMusicTracks().forEach(music => {
            music.volume = this.musicMuted ? 0 : this.musicVolume;
        });

        this.getSfxTracks().forEach(sound => {
            sound.volume = this.sfxMuted ? 0 : this.sfxVolume;
        });
    }

    pauseAllMusic() {
        this.getMusicTracks().forEach(music => {
            music.pause();
        });
    }

    resumeCurrentMusic() {
        this.applyVolumes();

        if (this.currentMusic) {
            this.currentMusic.play();
        }
    }

    getMusicTracks() {
        return [
            this.startScreenMusic,
            this.gameMusic,
            this.gameOverScreenMusic,
            this.winnerScreenMusic
        ].filter(track => track);
    }

    getSfxTracks() {
        return [
            this.startButtonSound,
            this.gameOverSound,
            this.characterHurtSound,
            this.characterJumpSound,
            this.chickenDeadSound,
            this.bottleThrowSound,
            this.bottleBreakSound,
            this.coinSound,
            this.bottlePickupSound,
            this.winnerSound,
            this.footstepLoop,
            this.endbossIntroSound,
            this.endbossDefeatedSound
        ].filter(sound => sound);
    }
}