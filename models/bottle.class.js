class Bottle extends MovableObject {
    width = 100;
    height = 100;
    img = new Image();
    IMAGES_BOTTLE = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];
    imageCache = [];
    currentImage = 0;
    constructor(x, y) {
        super();
        this.loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        this.x = x;
        this.y = y;
        this.loadImages(this.IMAGES_BOTTLE);
        this.animate();
    }

    loadImage(path) {
        this.img.src = path;

    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

        animate() {

        setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLE);
        }, 1000 / 2);
    }
}