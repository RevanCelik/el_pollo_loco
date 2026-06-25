/**
 * Represents the playable character.
 *
 * @extends MovableObject
 */
class Character extends MovableObject {
    height = 300;
    width = 150;
    y = 50;
    speed = 10;
    coins = 0;
    bottles = 0;
    deadAnimationPlayed = false;
    deadImageIndex = 0;
    deadAnimationCounter = 0;
    deadAnimationDelay = 2;
    lastActionTime = Date.now();
    longIdleDelay = 15000;

    movementInterval = null;
    animationInterval = null;

    offset = {
        top: 120,
        left: 35,
        right: 35,
        bottom: 10
    };

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png',
    ];


    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    world;

    /**
     * Creates the character, loads its images, applies gravity, and starts animation.
     */
    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.applyGravity();
        this.animate();
    }

    /**
     * Starts the character movement and animation intervals.
     *
     * The movement interval handles horizontal movement, jumping,
     * and camera positioning. The animation interval updates the
     * character state, snoring sound, and currently displayed animation.
     *
     * @returns {void}
     */
    animate() {
        this.movementInterval = setInterval(() => {
            if (!this.world || !this.world.isRunning || this.isDead()) {
                return;
            }

            this.handleMovement();
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            if (!this.world || !this.world.isRunning) {
                return;
            }

            this.updateLastActionTime();
            this.updateSnoringSound();
            this.playCurrentAnimation();
        }, 100);
    }

    /**
     * Handles the character's horizontal movement and jumping input.
     *
     * The character can move right until the end of the level,
     * move left until reaching the beginning of the level,
     * and jump while standing on the ground.
     *
     * @returns {void}
     */
    handleMovement() {
        if (this.world.keyboard.RIGHT && this.world.level.level_end_x > this.x) {
            this.otherDirection = false;
            this.moveRight();
        }

        if (this.world.keyboard.LEFT && this.x > 0) {
            this.otherDirection = true;
            this.moveLeft();
        }

        if ((this.world.keyboard.UP || this.world.keyboard.SPACE) &&
            !this.isAboveGround()) {
            audioManager.playCharacterJumpSound();
            this.jump();
        }
    }

    /**
     * Plays the animation matching the character's current state.
     *
     * Animation priority:
     * dead, hurt, jumping, walking, long idle, and idle.
     *
     * @returns {void}
     */
    playCurrentAnimation() {
        if (this.isDead()) {
            this.handleDeadAnimation();
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING);
        } else if (this.isWalking()) {
            this.playAnimation(this.IMAGES_WALKING);
        } else if (this.isLongIdle()) {
            this.playAnimation(this.IMAGES_LONG_IDLE);
        } else {
            this.playAnimation(this.IMAGES_IDLE);
        }
    }

    /**
    * Updates the time of the character's most recent action.
     *
     * @returns {void}
     */
    updateLastActionTime() {
        if (this.isCharacterActive()) {
            this.lastActionTime = Date.now();
        }
    }

    /**
    * Plays the character's death animation when necessary.
    *
    * @returns {void}
    */
    handleDeadAnimation() {
        if (!this.deadAnimationPlayed) {
            this.playDeadAnimation();
        }
    }

    /**
     * Advances the character's death animation at a reduced speed.
     *
     * @returns {void}
     */
    playDeadAnimation() {
        this.deadAnimationCounter++;

        if (this.deadAnimationCounter < this.deadAnimationDelay) {
            return;
        }

        this.deadAnimationCounter = 0;
        this.showNextDeadImage();
    }

    /**
     * Displays the next image of the character's death animation.
     *
     * @returns {void}
     */
    showNextDeadImage() {
        if (this.deadImageIndex >= this.IMAGES_DEAD.length) {
            this.deadAnimationPlayed = true;
            return;
        }

        const path = this.IMAGES_DEAD[this.deadImageIndex];
        this.img = this.imageCache[path];
        this.deadImageIndex++;
    }

    /**
     * Checks whether the character is currently walking.
     *
     * @returns {boolean} True if left or right movement is active.
     */
    isWalking() {
        return this.world.keyboard.RIGHT ||
            this.world.keyboard.LEFT;
    }

    /**
     * Checks whether the character has been inactive long enough to sleep.
     *
     * @returns {boolean} True after 15 seconds without activity.
     */
    isLongIdle() {
        return Date.now() - this.lastActionTime >= this.longIdleDelay;
    }

    /**
     * Checks whether the character is currently performing an action.
     *
     * @returns {boolean} True if the character is active.
     */
    isCharacterActive() {
        return this.world.keyboard.RIGHT ||
            this.world.keyboard.LEFT ||
            this.world.keyboard.UP ||
            this.world.keyboard.SPACE ||
            this.world.keyboard.D ||
            this.isAboveGround() ||
            this.isHurt();
    }

    /**
 * Starts or stops the snoring sound depending on the character state.
 *
 * @returns {void}
 */
    updateSnoringSound() {
        if (this.shouldSnore()) {
            audioManager.playCharacterSnoringSound();
        } else {
            audioManager.stopCharacterSnoringSound();
        }
    }

    /**
 * Checks whether the character is currently sleeping.
 *
 * @returns {boolean} True while the long-idle animation is active.
 */
    shouldSnore() {
        return this.world &&
            this.world.isRunning &&
            !this.world.winnerShown &&
            !this.world.gameOverShown &&
            this.isLongIdle() &&
            !this.isDead() &&
            !this.isHurt() &&
            !this.isAboveGround() &&
            !this.isWalking();
    }

    /**
 * Stops all character intervals and active character sounds.
 *
 * @returns {void}
 */
    stop() {
        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);

        this.movementInterval = null;
        this.animationInterval = null;

        audioManager.stopCharacterSnoringSound();
        audioManager.stopFootstepLoop();
    }

    /**
     * Increases the character's collected coin value.
     *
     * @returns {void}
     */
    collectCoin() {
        this.coins += 20;
    }

    /**
     * Increases the character's collected bottle value.
     *
     * @returns {void}
     */
    collectBottle() {
        this.bottles += 20;
    }


}