/**
 * Represents the final boss and controls its movement,
 * animations, attacks, and damage handling.
 *
 * @extends EndbossBase
 */
class Endboss extends EndbossBase {
    
    /**
     * Starts the endboss animation logic.
     *
     * @returns {void}
     */
    startAnimation() {
        this.animate();
    }

    /**
     * Starts the movement and animation intervals of the endboss.
     *
     * @returns {void}
     */
    animate() {
        this.startMovementInterval();
        this.startAnimationInterval();
    }

    /**
     * Starts the interval responsible for the endboss movement.
     *
     * The movement speed depends on the current animation state
     * and the remaining energy of the endboss.
     *
     * @returns {void}
     */
    startMovementInterval() {
        setInterval(() => {
            if (!this.canAct()) {
                return;
            }

            this.handleMovement();
        }, 1000 / 60);
    }

    /**
 * Moves the endboss according to its current animation state.
 *
 * During the walking animation, the endboss moves normally.
 * During the attack animation, it charges toward the player.
 *
 * @returns {void}
 */
    handleMovement() {
        if (this.currentAnimation === 'walking') {
            this.moveTowardsPlayer(this.getWalkingSpeed());
        }

        if (this.currentAnimation === 'attack') {
            this.moveTowardsPlayer(this.getAttackSpeed());
        }
    }

    /**
 * Moves the endboss horizontally toward the player.
 *
 * @param {number} speed - The horizontal movement speed.
 * @returns {void}
 */
    moveTowardsPlayer(speed) {
        let characterX = this.world.character.x;

        if (characterX < this.x) {
            this.moveLeftTowardsPlayer(speed);
        } else {
            this.moveRightTowardsPlayer(speed);
        }
    }

    /**
 * Moves the endboss left toward the player.
 *
 * @param {number} speed - The horizontal movement speed.
 * @returns {void}
 */
    moveLeftTowardsPlayer(speed) {
        this.x -= speed;
        this.otherDirection = false;
    }

    /**
     * Moves the endboss right toward the player.
     *
     * @param {number} speed - The horizontal movement speed.
     * @returns {void}
     */
    moveRightTowardsPlayer(speed) {
        this.x += speed;
        this.otherDirection = true;
    }

    /**
     * Returns the walking speed based on the remaining energy.
     *
     * The endboss becomes slightly faster after each successful hit.
     *
     * @returns {number} The current walking speed.
     */
    getWalkingSpeed() {
        if (this.energy <= 20) {
            return 2.6;
        }

        if (this.energy <= 60) {
            return 2.3;
        }

        return 2;
    }

    /**
     * Returns the attack speed based on the remaining energy.
     *
     * The endboss becomes faster after each successful bottle hit
     * and covers more distance during the attack animation.
     *
     * @returns {number} The current attack speed.
     */
    getAttackSpeed() {
        if (this.energy <= 20) {
            return 6;
        }

        if (this.energy <= 60) {
            return 5.2;
        }

        return 4.4;
    }

    /**
     * Starts the interval responsible for updating the endboss animation.
     *
     * @returns {void}
     */
    startAnimationInterval() {
        setInterval(() => {
            if (!this.canAct()) {
                return;
            }

            this.handleBossState();
        }, 120);
    }

    /**
     * Checks whether the endboss is currently allowed to act.
     *
     * @returns {boolean} True if the endboss can act, otherwise false.
     */
    canAct() {
        return this.world &&
            !this.world.character.isDead() &&
            !this.isDeadAnimationPlayed;
    }

    /**
     * Handles the current state of the endboss.
     *
     * @returns {void}
     */
    handleBossState() {
        if (!this.hasSeenPlayer) {
            this.checkIfPlayerIsNear();
            return;
        }

        this.playBossAnimation();
    }

    /**
     * Checks whether the player is close enough to trigger the endboss.
     *
     * @returns {void}
     */
    checkIfPlayerIsNear() {
        if (!this.world) {
            return;
        }

        let distance = this.x - this.world.character.x;

        if (distance < 500) {
            this.startAlertAnimation();
        }
    }

    /**
     * Starts the alert animation and plays the endboss intro sound.
     *
     * @returns {void}
     */
    startAlertAnimation() {
        this.hasSeenPlayer = true;
        this.currentAnimation = 'alert';
        this.currentImage = 0;
        audioManager.playEndbossIntroSound();
    }

    /**
     * Starts the hurt animation.
     *
     * @returns {void}
     */
    startHurtAnimation() {
        this.currentAnimation = 'hurt';
        this.currentImage = 0;
    }

    /**
     * Starts the death animation and sets the endboss energy to zero.
     *
     * @returns {void}
     */
    startDeadAnimation() {
        this.energy = 0;
        this.currentAnimation = 'dead';
        this.currentImage = 0;
    }

    /**
     * Plays the animation matching the current endboss state.
     *
     * @returns {void}
     */
    playBossAnimation() {
        if (this.currentAnimation === 'alert') {
            this.playAnimationOnce(this.IMAGES_ALERT, 'walking');
        } else if (this.currentAnimation === 'walking') {
            this.playAnimationOnce(this.IMAGES_WALKING, 'attack');
        } else if (this.currentAnimation === 'attack') {
            this.playAnimationOnce(this.IMAGES_ATTACK, 'walking');
        } else if (this.currentAnimation === 'hurt') {
            this.playAnimationOnce(
                this.IMAGES_HURT,
                this.getAnimationAfterHurt()
            );
        } else if (this.currentAnimation === 'dead') {
            this.playDeadAnimation();
        }
    }

    /**
 * Returns the animation that should follow the hurt animation.
 *
 * At 20 energy, the endboss immediately starts a counterattack.
 *
 * @returns {string} The next animation state.
 */
    getAnimationAfterHurt() {
        if (this.energy <= 20) {
            return 'attack';
        }

        return 'walking';
    }

    /**
     * Plays one animation sequence and switches to the next animation.
     *
     * @param {string[]} images - The image paths of the animation.
     * @param {string} nextAnimation - The animation state to activate afterward.
     * @returns {void}
     */
    playAnimationOnce(images, nextAnimation) {
        let path = images[this.currentImage];
        this.img = this.imageCache[path];
        this.currentImage++;

        if (this.currentImage >= images.length) {
            this.currentImage = 0;
            this.currentAnimation = nextAnimation;
        }
    }

    /**
     * Controls the timing of the endboss death animation.
     *
     * @returns {void}
     */
    playDeadAnimation() {
        this.deadAnimationCounter++;

        if (this.deadAnimationCounter < 2) {
            return;
        }

        this.deadAnimationCounter = 0;
        this.showNextDeadImage();
    }

    /**
     * Displays the next image of the death animation.
     *
     * @returns {void}
     */
    showNextDeadImage() {
        let path = this.IMAGES_DEAD[this.currentImage];
        this.img = this.imageCache[path];
        this.currentImage++;

        if (this.currentImage >= this.IMAGES_DEAD.length) {
            this.currentImage = this.IMAGES_DEAD.length - 1;
            this.isDeadAnimationPlayed = true;
        }
    }

    /**
     * Reduces the endboss energy after being hit by a bottle.
     *
     * During the attack animation, the endboss receives only
     * half of the normal bottle damage.
     *
     * @returns {void}
     */
    hitByBottle() {
        if (this.energy <= 0) {
            return;
        }

        this.energy -= this.getBottleDamage();
        this.handleBottleHitState();
    }

    /**
 * Returns the bottle damage for the current boss state.
 *
 * The endboss receives reduced damage while attacking.
 *
 * @returns {number} The bottle damage.
 */
    getBottleDamage() {
        if (this.currentAnimation === 'attack') {
            return 20;
        }

        return 40;
    }

    /**
 * Starts the appropriate animation after a bottle hit.
 *
 * The death animation starts when the endboss has no energy left.
 * Otherwise, the hurt animation is played.
 *
 * @returns {void}
 */
    handleBottleHitState() {
        if (this.energy <= 0) {
            this.energy = 0;
            this.startDeadAnimation();
            return;
        }

        this.startHurtAnimation();
    }
}