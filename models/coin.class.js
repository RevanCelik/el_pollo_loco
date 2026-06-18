/**
 * Represents a collectible animated coin.
 *
 * @extends MovableObject
 */
class Coin extends MovableObject {
    width = 150;
    height = 150;
    img = new Image();

    offset = {
        top: 40,
        left: 40,
        right: 40,
        bottom: 40
    };

    IMAGES_COIN = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    imageCache = [];
    currentImage = 0;

    /**
     * Creates a coin at the specified position and starts its animation.
     *
     * @param {number} x - The horizontal position.
     * @param {number} y - The vertical position.
     */
    constructor(x, y) {
        super();
        this.loadImage('img/8_coin/coin_1.png');
        this.x = x;
        this.y = y;
        this.loadImages(this.IMAGES_COIN);
        this.animate();
    }

    /**
     * Loads a single image into the coin's image element.
     *
     * @param {string} path - The path to the image.
     * @returns {void}
     */
    loadImage(path) {
        this.img.src = path;

    }

    /**
     * Loads multiple images into the image cache.
     *
     * @param {string[]} arr - The image paths to load.
     * @returns {void}
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Starts the looping coin animation.
     *
     * @returns {void}
     */
    animate() {

        setInterval(() => {
            this.playAnimation(this.IMAGES_COIN);
        }, 1000 / 5);
    }
}