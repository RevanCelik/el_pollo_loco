class ThrowableObject extends Bottle {
    height = 50;
    width = 50;
    isSplashing = false;
    shouldRemove = false;
    hasHit = false;

    /**
     * Creates a throwable bottle at the specified position
     * and starts its movement and animation.
     *
     * @param {number} x - The horizontal starting position.
     * @param {number} y - The vertical starting position.
     */
    constructor(x, y) {
        super(x, y, false);
        this.loadImage(this.IMAGES_THROWING[0]);
        this.x = x;
        this.y = y;
        this.throw();
        this.animateThrowableObject();
    }

    /**
     * Applies the throwing movement and triggers the splash
     * when the object reaches the ground.
     *
     * @returns {void}
     */
    throw() {
        this.speedY = 20;
        this.applyGravity();

        this.throwInterval = setInterval(() => {
            if (!this.isSplashing) {
                this.x += 8;
            }

            if (this.y > 380) {
                this.splash();
            }
        }, 1000 / 60);
    }

    /**
     * Starts the animation interval for the rotating
     * and splashing bottle images.
     *
     * @returns {void}
     */
    animateThrowableObject() {
        this.animationInterval = setInterval(() => {
            if (this.isSplashing) {
                this.playAnimation(this.IMAGES_SPLASH);
            } else {
                this.playAnimation(this.IMAGES_THROWING);
            }
        }, 1000 / 10);
    }

    /**
     * Starts the splash state and marks the object
     * for removal after the splash animation.
     *
     * @returns {void}
     */
    splash() {
        if (this.isSplashing) {
            return;
        }

        this.isSplashing = true;
        this.speedY = 0;

        setTimeout(() => {
            this.shouldRemove = true;
        }, 400);
    }
}