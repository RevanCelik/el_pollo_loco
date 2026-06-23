class World extends WorldBase {
    /**
     * Checks whether the player can throw a bottle and creates one
     * when the input, inventory, and cooldown conditions are met.
     *
     * @returns {void}
     */
    checkThrowObjects() {
        if (this.canCreateThrowableObject()) {
            this.createThrowableObject();
        }

        if (!this.keyboard.D) {
            this.canThrow = true;
        }
    }

    /**
     * Checks whether a new bottle may currently be thrown.
     *
     * @returns {boolean} True if all throwing conditions are met.
     */
    canCreateThrowableObject() {
        return this.keyboard.D &&
            this.character.bottles > 0 &&
            this.canThrow &&
            this.isBottleCooldownFinished();
    }

    /**
     * Checks whether enough time has passed since the last bottle throw.
     *
     * @returns {boolean} True if the throwing cooldown has finished.
     */
    isBottleCooldownFinished() {
        let timeSinceLastThrow = Date.now() - this.lastBottleThrowTime;
        return timeSinceLastThrow >= this.bottleThrowCooldown;
    }

    /**
     * Creates a throwable bottle at the character's position
     * and passes the character's current facing direction.
     *
     * @returns {void}
     */
    createThrowableObject() {
        let bottleX = this.getThrowableObjectStartX();
        let throwableObject = new ThrowableObject(
            bottleX,
            this.character.y + 100,
            this.character.otherDirection
        );

        this.throwableObjects.push(throwableObject);
        this.handleBottleThrow();
    }

    /**
 * Returns the horizontal starting position of a thrown bottle.
 *
 * The bottle starts on the left or right side of the character,
 * depending on the direction the character is currently facing.
 *
 * @returns {number} The horizontal starting position.
 */
    getThrowableObjectStartX() {
        if (this.character.otherDirection) {
            return this.character.x + 20;
        }

        return this.character.x + 100;
    }

    /**
     * Updates the sound, inventory, status bar, and throwing state.
     *
     * @returns {void}
     */
    handleBottleThrow() {
        audioManager.playBottleThrowSound();
        this.character.bottles -= 20;
        this.bottleBar.setPercentage(this.character.bottles);
        this.lastBottleThrowTime = Date.now();
        this.canThrow = false;
    }

    /**
     * Checks collisions between the character and all enemies.
     *
     * @returns {void}
     */
    checkCollisions() {
        this.level.enemies.forEach((enemy, index) => {
            if (this.character.isColliding(enemy)) {
                this.handleEnemyCollision(enemy, index);
            }
        });
    }

    /**
     * Handles a collision between the character and an enemy.
     *
     * @param {MovableObject} enemy - The enemy involved in the collision.
     * @param {number} index - The position of the enemy in the enemies array.
     * @returns {void}
     */
    handleEnemyCollision(enemy, index) {
        if (enemy instanceof Chicken && this.isTopCollision(enemy)) {
            audioManager.playChickenDeadSound();
            this.level.enemies.splice(index, 1);
            this.character.jump();
            return;
        }

        if (this.character.isColliding(enemy)) {
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);

            if (this.character.isDead()) {
                this.startGameOverSequence();
            } else {
                audioManager.playCharacterHurtSound(this.character.isDead());
            }
        }
    }

    /**
     * Checks whether the character is colliding with an enemy from above.
     *
     * @param {MovableObject} enemy - The enemy to check.
     * @returns {boolean} True if the character lands on the enemy from above.
     */
    isTopCollision(enemy) {
        let characterFeet = this.character.y + this.character.height - this.character.offset.bottom;
        let enemyTop = enemy.y + enemy.offset.top;
        let difference = characterFeet - enemyTop;

        let characterCenterX = this.character.x + this.character.offset.left +
            (this.character.width - this.character.offset.left - this.character.offset.right) / 2;

        let enemyLeft = enemy.x + enemy.offset.left;
        let enemyRight = enemy.x + enemy.width - enemy.offset.right;

        return this.character.speedY < 0 &&
            difference > 0 &&
            difference < 60 &&
            characterCenterX > enemyLeft &&
            characterCenterX < enemyRight;
    }

    /**
     * Checks whether the character is collecting any coins.
     *
     * @returns {void}
     */
    checkCoinsCollisions() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                audioManager.playCoinSound();
                this.level.coins.splice(index, 1);
                this.character.collectCoin();
                this.coinBar.setPercentage(this.character.coins);
            }
        });
    }

    /**
     * Checks whether the character is collecting any bottles.
     *
     * @returns {void}
     */
    checkBottleCollisions() {
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                audioManager.playBottlePickupSound();
                this.level.bottles.splice(index, 1);
                this.character.collectBottle();
                this.bottleBar.setPercentage(this.character.bottles);
            }
        });
    }

    /**
     * Checks collisions between thrown bottles and enemies.
     *
     * @returns {void}
     */
    checkThrowableObjectCollisions() {
        this.throwableObjects.forEach((throwableObject, bottleIndex) => {
            this.level.enemies.forEach((enemy, enemyIndex) => {
                if (throwableObject.isColliding(enemy)) {
                    this.handleThrowableObjectCollision(enemy, enemyIndex, bottleIndex);
                }
            });
        });
    }

    /**
     * Handles a collision between a thrown bottle and an enemy.
     *
     * @param {MovableObject} enemy - The enemy hit by the bottle.
     * @param {number} enemyIndex - The position of the enemy in the enemies array.
     * @param {number} bottleIndex - The position of the bottle in the throwable objects array.
     * @returns {void}
     */
    handleThrowableObjectCollision(enemy, enemyIndex, bottleIndex) {
        let bottle = this.throwableObjects[bottleIndex];

        if (bottle.hasHit) {
            return;
        }

        bottle.hasHit = true;
        bottle.splash();
        audioManager.playBottleBreakSound();

        if (enemy instanceof Chicken) {
            audioManager.playChickenDeadSound();
            this.level.enemies.splice(enemyIndex, 1);
        }

        if (enemy instanceof Endboss) {
            enemy.hitByBottle();
            this.endbossBar.setPercentage(enemy.energy);
        }
    }

    /**
     * Removes bottles that have completed their splash animation.
     *
     * @returns {void}
     */
    removeSplashedBottles() {
        this.throwableObjects = this.throwableObjects.filter(bottle => !bottle.shouldRemove);
    }

    /**
     * Removes defeated endbosses and displays the winner screen.
     *
     * @returns {void}
     */
    removeDeadEndbosses() {
        this.level.enemies.forEach((enemy, index) => {
            if (enemy instanceof Endboss && enemy.isDeadAnimationPlayed) {
                this.handleWinnerScreen();
                this.level.enemies.splice(index, 1);
            }
        });
    }

    /**
     * Checks whether a thrown bottle has collided with the ground.
     *
     * @returns {void}
     */
    checkBottleGroundCollision() {
        this.throwableObjects.forEach(bottle => {
            if (!bottle.hasHit && bottle.y > 360) {
                bottle.hasHit = true;
                bottle.splash();
                audioManager.playBottleBreakSound();
            }
        });
    }

    /**
     * Starts or stops the footstep loop depending on the character state.
     *
     * @returns {void}
     */
    checkFootstepLoop() {
        if (this.shouldPlayFootstepLoop()) {
            audioManager.playFootstepLoop();
        } else {
            audioManager.stopFootstepLoop();
        }
    }

    /**
     * Checks whether the footstep sound should currently be playing.
     *
     * @returns {boolean} True if the character is walking on the ground.
     */
    shouldPlayFootstepLoop() {
        return (
            (this.keyboard.RIGHT || this.keyboard.LEFT) &&
            !this.character.isAboveGround() &&
            !this.character.isDead() &&
            !this.winnerShown &&
            !this.gameOverShown
        );
    }

    /**
     * Starts the winner sequence after the endboss has been defeated.
     *
     * Prevents repeated execution, stops all active game loops,
     * resets the keyboard state and starts the winner audio sequence.
     *
     * @returns {void}
     */
    handleWinnerScreen() {
        if (this.winnerShown) {
            return;
        }

        this.winnerShown = true;
        this.resetKeyboard();
        this.stop();
        audioManager.playEndbossDefeatedSound();

        setTimeout(() => {
            audioManager.playWinnerSoundThenScreenMusic();
            this.showWinnerOverlay();
        }, 1000);
    }

    /**
 * Resets all active keyboard inputs.
 *
 * This prevents previously pressed keys from remaining active
 * after the game has ended.
 *
 * @returns {void}
 */
    resetKeyboard() {
        Object.keys(this.keyboard).forEach(key => {
            this.keyboard[key] = false;
        });
    }

    /**
     * Displays the winner overlay and hides the game title and mobile controls.
     *
     * @returns {void}
     */
    showWinnerOverlay() {
        document.getElementById('winnerOverlay').classList.remove('hidden');
        document.getElementById('gameTitle').classList.add('hidden');
        hideMobileControls();
    }

    /**
     * Starts the delayed game-over sequence.
     *
     * @returns {void}
     */
    startGameOverSequence() {
        if (this.gameOverStarted) {
            return;
        }

        this.gameOverStarted = true;
        audioManager.stopFootstepLoop();
        audioManager.stopGameMusic();
        audioManager.playGameOverSound();

        setTimeout(() => {
            this.handleGameOver();
        }, 2500);
    }

    /**
     * Displays the game-over screen once.
     *
     * @returns {void}
     */
    handleGameOver() {
        if (this.gameOverShown) {
            return;
        }

        this.gameOverShown = true;
        audioManager.playGameOverScreenMusic();
        this.showGameOverOverlay();
    }

    /**
     * Displays the game-over overlay and hides the game title and mobile controls.
     *
     * @returns {void}
     */
    showGameOverOverlay() {
        document.getElementById('gameOverOverlay').classList.remove('hidden');
        document.getElementById('gameTitle').classList.add('hidden');
        hideMobileControls();
    }
}
