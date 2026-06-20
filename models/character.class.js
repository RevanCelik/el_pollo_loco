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
    lastActionTime = Date.now();
    longIdleDelay = 15000;

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
     * @returns {void}
     */
    animate() {

        setInterval(() => {
            if (this.isDead()) {
                return;
            }

            if (this.world.keyboard.RIGHT && this.world.level.level_end_x > this.x) {
                this.otherDirection = false;
                this.moveRight();
            }

            if (this.world.keyboard.LEFT && this.x > 0) {
                this.otherDirection = true;
                this.moveLeft();
            }

            if ((this.world.keyboard.UP || this.world.keyboard.SPACE) && !this.isAboveGround()) {
                audioManager.playCharacterJumpSound();
                this.jump();
            }

            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        setInterval(() => {
            this.updateLastActionTime();
            this.updateSnoringSound();

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
        }, 100);
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
     * Advances the character's death animation by one image.
     *
     * @returns {void}
     */
    playDeadAnimation() {
        if (this.deadImageIndex < this.IMAGES_DEAD.length) {
            let path = this.IMAGES_DEAD[this.deadImageIndex];
            this.img = this.imageCache[path];
            this.deadImageIndex++;
        }

        if (this.deadImageIndex >= this.IMAGES_DEAD.length) {
            this.deadAnimationPlayed = true;
        }
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