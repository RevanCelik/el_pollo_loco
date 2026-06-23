/**
 * Represents the final boss enemy in the game.
 *
 * @extends MovableObject
 */
class Endboss extends MovableObject {

    height = 500;
    width = 400;
    y = -20;
    energy = 100;

    offset = {
        top: 120,
        left: 75,
        right: 60,
        bottom: 100
    };

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];


    world;

    currentAnimation = 'waiting';
    hasSeenPlayer = false;
    isHurt = false;
    isDeadAnimationPlayed = false;

    deadAnimationCounter = 0;

    /**
     * Creates the endboss and loads all required animation images.
     */
    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);

        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2200;
    }

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
     * The attack remains faster than normal walking without allowing
     * the endboss to catch the player immediately.
     *
     * @returns {number} The current attack speed.
     */
    getAttackSpeed() {
        if (this.energy <= 20) {
            return 4.2;
        }

        if (this.energy <= 60) {
            return 3.6;
        }

        return 3;
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
     * Each bottle hit removes 40 energy points, so the endboss
     * is defeated after three successful hits.
     *
     * @returns {void}
     */
    hitByBottle() {
        if (this.energy <= 0) {
            return;
        }

        this.energy -= 40;

        if (this.energy <= 0) {
            this.energy = 0;
            this.startDeadAnimation();
        } else {
            this.startHurtAnimation();
        }
    }
}