class Cloud extends MovableObject {
    y = 20;
    width = 250;
    height = 150;

    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');

        this.x = Math.random() * 800; // Random x position between 0 and 800
        this.animate();

    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }

}