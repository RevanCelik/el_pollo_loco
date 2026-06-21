/**
 * Manages the background music and sound effects used by the game.
 */
class AudioManager extends AudioManagerBase {
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
     * Starts the looping character-snoring sound.
     *
     * @returns {void}
     */
    playCharacterSnoringSound() {
        if (this.sfxMuted || this.isCharacterSnoring) {
            return;
        }

        this.isCharacterSnoring = true;
        this.characterSnoringSound.currentTime = 0;
        this.safePlay(this.characterSnoringSound);
    }
    
    /**
     * Stops and resets the character-snoring sound.
     *
     * @returns {void}
     */
    stopCharacterSnoringSound() {
        if (!this.isCharacterSnoring && this.characterSnoringSound.paused) {
            return;
        }

        this.isCharacterSnoring = false;
        this.characterSnoringSound.pause();
        this.characterSnoringSound.currentTime = 0;
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
        this.safePlay(this.footstepLoop);
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
        this.safePlay(this.endbossIntroSound);
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
        this.safePlay(this.winnerSound);
    }

    /**
     * Plays the winner sound and starts the winner-screen music afterward.
     *
     * @returns {void}
     */
    playWinnerSoundThenScreenMusic() {
        this.stopGameMusic();
        this.stopGameOverScreenMusic();
        this.stopWinnerSequence();

        this.winnerSequenceActive = true;
        this.winnerSound.currentTime = 0;
        this.safePlay(this.winnerSound);

        this.winnerSound.onended = () => {
            if (this.winnerSequenceActive) {
                this.playWinnerScreenMusic();
            }
        };
    }

    /**
 * Stops the active winner sound sequence.
 *
 * @returns {void}
 */
    stopWinnerSequence() {
        this.winnerSequenceActive = false;
        this.winnerSound.onended = null;
        this.winnerSound.pause();
        this.winnerSound.currentTime = 0;
        this.stopWinnerScreenMusic();
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
     * Stops and resets every audio track and playback state.
     *
     * @returns {void}
     */
    reset() {
        this.stopWinnerSequence();
        this.stopCharacterSnoringSound();
        this.stopAllMusic();

        this.getSfxTracks().forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
            sound.onended = null;
        });

        this.isCharacterSnoring = false;
        this.isEndbossIntroSoundPlayed = false;
        this.isCharacterHurtSoundPlaying = false;
        this.isGameOverSoundPlaying = false;
        this.currentMusic = null;
    }
}

