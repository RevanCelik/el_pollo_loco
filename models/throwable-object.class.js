class ThrowableObject extends Bottle {
    height = 50;
    width = 50;
    isSplashing = false;
    shouldRemove = false;
    hasHit = false;

    constructor(x, y) {
        super(x, y, false);
        this.loadImage(this.IMAGES_THROWING[0]);
        this.x = x;
        this.y = y;
        this.throw();
        this.animateThrowableObject();
    }

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

    animateThrowableObject() {
        this.animationInterval = setInterval(() => {
            if (this.isSplashing) {
                this.playAnimation(this.IMAGES_SPLASH);
            } else {
                this.playAnimation(this.IMAGES_THROWING);
            }
        }, 1000 / 10);
    }

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