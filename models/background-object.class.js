/**
 * Represents a background layer in the game world.
 *
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;

    /**
     * Creates a background object at the specified horizontal position.
     *
     * @param {string} imagePath - The path to the background image.
     * @param {number} x - The horizontal position.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height; // Position the background object at the bottom of the canvas
    }
}