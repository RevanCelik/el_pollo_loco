class ThrowableObject extends Bottle {
    height = 50;
    width = 50;
    isSplashing = false;
    shouldRemove = false;
    hasHit = false;
    throwDirection = 1;

    /**
     * Creates a throwable bottle at the specified position,
     * sets its horizontal direction and starts its movement.
     *
     * @param {number} x - The horizontal starting position.
     * @param {number} y - The vertical starting position.
     * @param {boolean} otherDirection - Whether the character faces left.
     */
    constructor(x, y, otherDirection) {
        super(x, y, false);
        this.loadImage(this.IMAGES_THROWING[0]);
        this.x = x;
        this.y = y;
        this.setThrowDirection(otherDirection);
        this.throw();
        this.animateThrowableObject();
    }

    /**
* Sets the horizontal throwing direction.
*
* A value of -1 throws the bottle to the left,
* while a value of 1 throws it to the right.
*
* @param {boolean} otherDirection - Whether the character faces left.
* @returns {void}
*/
    setThrowDirection(otherDirection) {
        this.throwDirection = otherDirection ? -1 : 1;
    }

    /**
     * Applies vertical and horizontal throwing movement
     * and triggers the splash when the bottle reaches the ground.
     *
     * @returns {void}
     */
    throw() {
        this.speedY = 20;
        this.applyGravity();

        this.throwInterval = setInterval(() => {
            this.moveHorizontally();

            if (this.y > 380) {
                this.splash();
            }
        }, 1000 / 60);
    }

    /**
 * Moves the bottle in its configured throwing direction.
 *
 * @returns {void}
 */
    moveHorizontally() {
        if (this.isSplashing) {
            return;
        }

        this.x += 8 * this.throwDirection;
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