/**
 * Provides the audio tracks and shared playback controls used by AudioManager.
 */
class AudioManagerBase {
    startScreenMusic = new Audio('audio/startscreen_from_gameplay_music.wav');
    gameMusic = new Audio('audio/desert_chicken_dash_background.wav');

    startButtonSound = new Audio('audio/button_start_select.wav');
    gameOverSound = new Audio('audio/character_dead.wav');
    characterSnoringSound = new Audio('audio/character_snoring.wav');
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

    isCharacterSnoring = false;
    isCharacterHurtSoundPlaying = false;
    isGameOverSoundPlaying = false;
    winnerSequenceActive = false;

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

        this.characterSnoringSound.loop = true;
        this.characterSnoringSound.volume = 0.35;

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
        this.safePlay(music);
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
        this.safePlay(sound);
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
            this.safePlay(this.currentMusic);
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
            this.characterSnoringSound,
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

    /**
 * Plays an audio element and ignores expected interruption errors.
 *
 * @param {HTMLAudioElement} audio - The audio element to play.
 * @returns {void}
 */
    safePlay(audio) {
        const playPromise = audio.play();

        if (playPromise) {
            playPromise.catch(error => {
                if (error.name !== 'AbortError') {
                    console.error(error);
                }
            });
        }
    }
}
