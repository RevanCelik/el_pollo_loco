/**
 * Represents a cloud moving through the background.
 *
 * @extends MovableObject
 */
class Cloud extends MovableObject {
    y = 20;
    width = 250;
    height = 150;

    /**
     * Creates a cloud at a random horizontal position and starts its movement.
     */
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');

        this.x = Math.random() * 800; // Random x position between 0 and 800
        this.animate();

    }

    /**
     * Starts the interval that continuously moves the cloud to the left.
     *
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }

}