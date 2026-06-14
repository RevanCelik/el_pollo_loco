class Endboss extends MovableObject {

    height = 500;
    width = 400;
    y = -20;
    energy = 100;

    offset = {
        top: 120,
        left: 60,
        right: 60,
        bottom: 40
    };

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];


    world;

    currentAnimation = 'waiting';
    hasSeenPlayer = false;
    isHurt = false;
    isDeadAnimationPlayed = false;

    deadAnimationCounter = 0;

    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);

        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2200;
    }

    startAnimation() {
        this.animate();
    }

    animate() {
        this.startMovementInterval();
        this.startAnimationInterval();
    }

    startMovementInterval() {
        setInterval(() => {
            if (!this.canAct()) {
                return;
            }

            if (this.currentAnimation === 'walking') {
                this.x -= 2;
            }
        }, 1000 / 60);
    }

    startAnimationInterval() {
        setInterval(() => {
            if (!this.canAct()) {
                return;
            }

            this.handleBossState();
        }, 120);
    }

    canAct() {
        return this.world &&
            !this.world.character.isDead() &&
            !this.isDeadAnimationPlayed;
    }

    handleBossState() {
        if (!this.hasSeenPlayer) {
            this.checkIfPlayerIsNear();
            return;
        }

        this.playBossAnimation();
    }

    checkIfPlayerIsNear() {
        if (!this.world) {
            return;
        }

        let distance = this.x - this.world.character.x;

        if (distance < 500) {
            this.startAlertAnimation();
        }
    }

    startAlertAnimation() {
        this.hasSeenPlayer = true;
        this.currentAnimation = 'alert';
        this.currentImage = 0;
        audioManager.playEndbossIntroSound();
    }

    startHurtAnimation() {
        this.currentAnimation = 'hurt';
        this.currentImage = 0;
    }

    startDeadAnimation() {
        this.energy = 0;
        this.currentAnimation = 'dead';
        this.currentImage = 0;
    }

    playBossAnimation() {
        if (this.currentAnimation === 'alert') {
            this.playAnimationOnce(this.IMAGES_ALERT, 'walking');
        } else if (this.currentAnimation === 'walking') {
            this.playAnimationOnce(this.IMAGES_WALKING, 'attack');
        } else if (this.currentAnimation === 'attack') {
            this.playAnimationOnce(this.IMAGES_ATTACK, 'walking');
        } else if (this.currentAnimation === 'hurt') {
            this.playAnimationOnce(this.IMAGES_HURT, 'walking');
        } else if (this.currentAnimation === 'dead') {
            this.playDeadAnimation();
        }
    }

    playAnimationOnce(images, nextAnimation) {
        let path = images[this.currentImage];
        this.img = this.imageCache[path];
        this.currentImage++;

        if (this.currentImage >= images.length) {
            this.currentImage = 0;
            this.currentAnimation = nextAnimation;
        }
    }

    playDeadAnimation() {
        this.deadAnimationCounter++;

        if (this.deadAnimationCounter < 2) {
            return;
        }

        this.deadAnimationCounter = 0;
        this.showNextDeadImage();
    }

    showNextDeadImage() {
        let path = this.IMAGES_DEAD[this.currentImage];
        this.img = this.imageCache[path];
        this.currentImage++;

        if (this.currentImage >= this.IMAGES_DEAD.length) {
            this.currentImage = this.IMAGES_DEAD.length - 1;
            this.isDeadAnimationPlayed = true;
        }
    }

    hitByBottle() {
        if (this.energy <= 0) {
            return;
        }

        this.energy -= 40;

        if (this.energy <= 0) {
            this.energy = 0;
            this.startDeadAnimation();
        } else {
            this.startHurtAnimation();
        }
    }
}
