class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

    /**
     * Applies gravity to the object by updating its vertical position
     * and vertical speed at regular intervals.
     *
     * @returns {void}
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Checks whether the object is positioned above the ground.
     *
     * Throwable objects are always treated as being above the ground.
     *
     * @returns {boolean} True if the object is above the ground, otherwise false.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 130;
        }
    }

    // character.isColliding(chicken)

    /**
     * Checks whether this object is colliding with another movable object.
     *
     * @param {MovableObject} mo - The movable object to check for a collision.
     * @returns {boolean} True if the objects are colliding, otherwise false.
     */
    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    /**
     * Reduces the object's energy if it is currently able to receive damage.
     *
     * @returns {boolean} True if the object was hit, otherwise false.
     */
    hit() {
        if (this.canBeHit()) {
            this.energy -= 20;

            if (this.energy < 0) {
                this.energy = 0;
            }

            this.lastHit = new Date().getTime();
            return true;
        }

        return false;
    }

    /**
     * Checks whether enough time has passed since the object's last hit.
     *
     * @returns {boolean} True if the object can receive damage, otherwise false.
     */
    canBeHit() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed > 1;
    }

    /**
     * Checks whether the object is currently in its hurt state.
     *
     * @returns {boolean} True if the object was hit less than one second ago.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    /**
     * Checks whether the object has no remaining energy.
     *
     * @returns {boolean} True if the object is dead, otherwise false.
     */
    isDead() {
        return this.energy == 0;
    }



    /**
     * Displays the next image of the specified animation sequence.
     *
     * @param {string[]} images - The image paths of the animation sequence.
     * @returns {void}
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Moves the object to the right according to its current speed.
     *
     * @returns {void}
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left according to its current speed.
     *
     * @returns {void}
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Starts a jump by setting the object's vertical speed.
     *
     * @returns {void}
     */
    jump() {
        this.speedY = 30;
    }
}