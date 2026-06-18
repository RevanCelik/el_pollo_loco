/**
 * Manages the background music and sound effects used by the game.
 */
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

    /**
     * Initializes the audio manager and configures loop and volume settings.
     */
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

    /**
     * Stops the game music and plays the start-screen music.
     *
     * @returns {void}
     */
    playStartScreenMusic() {
        this.stopGameMusic();
        this.playMusic(this.startScreenMusic);
    }

    /**
     * Stops and resets the start-screen music.
     *
     * @returns {void}
     */
    stopStartScreenMusic() {
        this.startScreenMusic.pause();
        this.startScreenMusic.currentTime = 0;
    }

    /**
     * Stops the start-screen music and plays the game music from the beginning.
     *
     * @returns {void}
     */
    playGameMusic() {
        this.stopStartScreenMusic();
        this.gameMusic.currentTime = 0;
        this.playMusic(this.gameMusic);
    }

    /**
     * Stops and resets the game music.
     *
     * @returns {void}
     */
    stopGameMusic() {
        this.gameMusic.pause();
        this.gameMusic.currentTime = 0;
    }

    /**
     * Plays the start-button sound effect.
     *
     * @returns {void}
     */
    playStartButtonSound() {
        this.playSfx(this.startButtonSound);
    }

    /**
     * Plays the game-over sound once and stops the hurt sound.
     *
     * @returns {void}
     */
    playGameOverSound() {
        if (this.isGameOverSoundPlaying) {
            return;
        }

        this.stopCharacterHurtSound();
        this.isGameOverSoundPlaying = true;
        this.playSfx(this.gameOverSound);
    }

    /**
     * Plays the character-hurt sound when no conflicting sound is active.
     *
     * @param {boolean} characterIsDead - Whether the character is dead.
     * @returns {void}
     */
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

    /**
     * Stops and resets the character-hurt sound.
     *
     * @returns {void}
     */
    stopCharacterHurtSound() {
        this.characterHurtSound.pause();
        this.characterHurtSound.currentTime = 0;
        this.isCharacterHurtSoundPlaying = false;
    }

    /**
     * Plays the chicken-death sound effect.
     *
     * @returns {void}
     */
    playChickenDeadSound() {
        this.playSfx(this.chickenDeadSound);
    }

    /**
     * Plays the bottle-throw sound effect.
     *
     * @returns {void}
     */
    playBottleThrowSound() {
        this.playSfx(this.bottleThrowSound);
    }

    /**
     * Plays the bottle-breaking sound effect.
     *
     * @returns {void}
     */
    playBottleBreakSound() {
        this.playSfx(this.bottleBreakSound);
    }

    /**
     * Plays the coin-collection sound effect.
     *
     * @returns {void}
     */
    playCoinSound() {
        this.playSfx(this.coinSound);
    }

    /**
     * Plays the bottle-pickup sound effect.
     *
     * @returns {void}
     */
    playBottlePickupSound() {
        this.playSfx(this.bottlePickupSound);
    }

    /**
     * Starts the looping footstep sound when it is currently paused.
     *
     * @returns {void}
     */
    playFootstepLoop() {
        if (!this.footstepLoop.paused) {
            return;
        }

        this.footstepLoop.currentTime = 0;
        this.footstepLoop.play();
    }

    /**
     * Stops and resets the looping footstep sound.
     *
     * @returns {void}
     */
    stopFootstepLoop() {
        this.footstepLoop.pause();
        this.footstepLoop.currentTime = 0;
    }

    /**
     * Plays the character-jump sound effect.
     *
     * @returns {void}
     */
    playCharacterJumpSound() {
        this.playSfx(this.characterJumpSound);
    }

    /**
     * Plays the endboss introduction sound once.
     *
     * @returns {void}
     */
    playEndbossIntroSound() {
        if (this.isEndbossIntroSoundPlayed) {
            return;
        }

        this.isEndbossIntroSoundPlayed = true;
        this.endbossIntroSound.currentTime = 0;
        this.endbossIntroSound.play();
    }

    /**
     * Plays the endboss-defeated sound effect.
     *
     * @returns {void}
     */
    playEndbossDefeatedSound() {
        this.playSfx(this.endbossDefeatedSound);
    }

    /**
     * Stops the game music and plays the winner sound.
     *
     * @returns {void}
     */
    playWinnerSound() {
        this.stopGameMusic();
        this.winnerSound.currentTime = 0;
        this.winnerSound.play();
    }

    /**
     * Plays the winner sound and starts the winner-screen music afterward.
     *
     * @returns {void}
     */
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

    /**
     * Stops other active music and plays the game-over screen music.
     *
     * @returns {void}
     */
    playGameOverScreenMusic() {
        this.stopGameMusic();
        this.stopWinnerScreenMusic();

        this.gameOverScreenMusic.currentTime = 0;
        this.playMusic(this.gameOverScreenMusic);
    }

    /**
     * Stops and resets the game-over screen music.
     *
     * @returns {void}
     */
    stopGameOverScreenMusic() {
        this.gameOverScreenMusic.pause();
        this.gameOverScreenMusic.currentTime = 0;
    }

    /**
     * Stops other active music and plays the winner-screen music.
     *
     * @returns {void}
     */
    playWinnerScreenMusic() {
        this.stopGameMusic();
        this.stopGameOverScreenMusic();

        this.winnerScreenMusic.currentTime = 0;
        this.playMusic(this.winnerScreenMusic);
    }

    /**
     * Stops and resets the winner-screen music.
     *
     * @returns {void}
     */
    stopWinnerScreenMusic() {
        this.winnerScreenMusic.pause();
        this.winnerScreenMusic.currentTime = 0;
    }

    /**
     * Stops all music tracks and the footstep loop.
     *
     * @returns {void}
     */
    stopAllMusic() {
        this.stopStartScreenMusic();
        this.stopGameMusic();
        this.stopGameOverScreenMusic();
        this.stopWinnerScreenMusic();
        this.stopFootstepLoop();
    }

    /**
     * Stores and plays a music track when music is not muted.
     *
     * @param {HTMLAudioElement} music - The music track to play.
     * @returns {void}
     */
    playMusic(music) {
        this.currentMusic = music;

        if (this.musicMuted) {
            return;
        }

        music.volume = this.musicVolume;
        music.play();
    }

    /**
     * Restarts and plays a sound effect when SFX are not muted.
     *
     * @param {HTMLAudioElement} sound - The sound effect to play.
     * @returns {void}
     */
    playSfx(sound) {
        if (this.sfxMuted) {
            return;
        }

        sound.currentTime = 0;
        sound.volume = this.sfxVolume;
        sound.play();
    }

    /**
     * Toggles music muting and pauses or resumes the current track.
     *
     * @returns {void}
     */
    toggleMusic() {
        this.musicMuted = !this.musicMuted;

        if (this.musicMuted) {
            this.pauseAllMusic();
            return;
        }

        this.resumeCurrentMusic();
    }

    /**
     * Toggles sound-effect muting and reapplies audio volumes.
     *
     * @returns {void}
     */
    toggleSfx() {
        this.sfxMuted = !this.sfxMuted;
        this.applyVolumes();
    }

    /**
     * Applies the configured music and sound-effect volumes.
     *
     * @returns {void}
     */
    applyVolumes() {
        this.getMusicTracks().forEach(music => {
            music.volume = this.musicMuted ? 0 : this.musicVolume;
        });

        this.getSfxTracks().forEach(sound => {
            sound.volume = this.sfxMuted ? 0 : this.sfxVolume;
        });
    }

    /**
     * Pauses every registered music track.
     *
     * @returns {void}
     */
    pauseAllMusic() {
        this.getMusicTracks().forEach(music => {
            music.pause();
        });
    }

    /**
     * Applies the current volumes and resumes the selected music track.
     *
     * @returns {void}
     */
    resumeCurrentMusic() {
        this.applyVolumes();

        if (this.currentMusic) {
            this.currentMusic.play();
        }
    }

    /**
     * Returns all registered background-music tracks.
     *
     * @returns {HTMLAudioElement[]} The registered music tracks.
     */
    getMusicTracks() {
        return [
            this.startScreenMusic,
            this.gameMusic,
            this.gameOverScreenMusic,
            this.winnerScreenMusic
        ].filter(track => track);
    }

    /**
     * Returns all registered sound-effect tracks.
     *
     * @returns {HTMLAudioElement[]} The registered sound effects.
     */
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