/**
 * Represents a collectible or throwable salsa bottle.
 *
 * @extends MovableObject
 */
class Bottle extends MovableObject {
    width = 100;
    height = 100;
    img = new Image();

    IMAGES_BOTTLE = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    IMAGES_THROWING = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    imageCache = [];
    currentImage = 0;

    /**
     * Creates a bottle at the specified position.
     *
     * @param {number} x - The horizontal position.
     * @param {number} y - The vertical position.
     * @param {boolean} [shouldAnimate=true] - Whether to start the bottle animation.
     */
    constructor(x, y, shouldAnimate = true) {
        super();
        this.loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.x = x;
        this.y = y;
        this.loadImages(this.IMAGES_BOTTLE);
        this.loadImages(this.IMAGES_THROWING);
        this.loadImages(this.IMAGES_SPLASH);
        if (shouldAnimate) {
            this.animate();
        }
    }

    /**
     * Loads a single image into the bottle's image element.
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
     * Starts the looping bottle animation.
     *
     * @returns {void}
     */
    animate() {

        setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLE);
        }, 1000 / 2);
    }
}