class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusbarHealth();
    coinBar = new StatusbarCoin();
    bottleBar = new StatusbarBottle();
    throwableObjects = [];
    canThrow = true;
    gameOverShown = false;
    winnerShown = false;
    gameOverStarted = false;

    characterHurtSound = new Audio('audio/character_hurt.wav');
    characterDeadSound = new Audio('audio/character_dead.wav');

    isCharacterHurtSoundPlaying = false;
    isCharacterDeadSoundPlaying = false;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.draw();
        this.setWorld();
        this.startEnemies();
        this.run();
    }

    setWorld() {
        this.character.world = this;

        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });
    }

    startEnemies() {
        this.level.enemies.forEach(enemy => {
            enemy.startAnimation();
        });
    }

    run() {
        setInterval(() => {
            if (this.character.isDead() || this.winnerShown) {
                return;
            }

            this.checkCollisions();
            this.checkThrowObjects();
            this.checkThrowableObjectCollisions();
            this.checkCoinsCollisions();
            this.checkBottleCollisions();
            this.removeDeadEndbosses();

        }, 1000 / 60);
    }

    checkThrowObjects() {
        if (this.keyboard.D && this.character.bottles > 0 && this.canThrow) {
            let throwableObject = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(throwableObject);

            this.character.bottles -= 20;
            this.bottleBar.setPercentage(this.character.bottles);

            this.canThrow = false;
        }

        if (!this.keyboard.D) {
            this.canThrow = true;
        }
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy, index) => {
            if (this.character.isColliding(enemy)) {
                this.handleEnemyCollision(enemy, index);
            }
        });
    }

    handleEnemyCollision(enemy, index) {
        if (enemy instanceof Chicken && this.isTopCollision(enemy)) {
            this.level.enemies.splice(index, 1);
            this.character.jump();
            return;
        }

        if (this.character.isColliding(enemy)) {
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);

            if (this.character.isDead()) {
                this.startGameOverSequence();
            } else {
                this.playCharacterHurtSound();
            }
        }
    }

    isTopCollision(enemy) {
        let characterFeet = this.character.y + this.character.height;
        let enemyTop = enemy.y;
        let difference = characterFeet - enemyTop;

        let characterCenterX = this.character.x + this.character.width / 2;
        let enemyLeft = enemy.x;
        let enemyRight = enemy.x + enemy.width;

        return this.character.speedY < 0 &&
            difference > 0 &&
            difference < 30 &&
            characterCenterX > enemyLeft &&
            characterCenterX < enemyRight;
    }

    checkCoinsCollisions() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.level.coins.splice(index, 1);
                this.character.collectCoin();
                this.coinBar.setPercentage(this.character.coins);
            }
        });
    }

    checkBottleCollisions() {
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.level.bottles.splice(index, 1);
                this.character.collectBottle();
                this.bottleBar.setPercentage(this.character.bottles);
            }
        });
    }

    checkThrowableObjectCollisions() {
        this.throwableObjects.forEach((throwableObject, bottleIndex) => {
            this.level.enemies.forEach((enemy, enemyIndex) => {
                if (throwableObject.isColliding(enemy)) {
                    this.handleThrowableObjectCollision(enemy, enemyIndex, bottleIndex);
                }
            });
        });
    }

    handleThrowableObjectCollision(enemy, enemyIndex, bottleIndex) {
        this.throwableObjects.splice(bottleIndex, 1);

        if (enemy instanceof Chicken) {
            this.level.enemies.splice(enemyIndex, 1);
        }

        if (enemy instanceof Endboss) {
            enemy.hitByBottle();
        }
    }

    removeDeadEndbosses() {
        this.level.enemies.forEach((enemy, index) => {
            if (enemy instanceof Endboss && enemy.isDeadAnimationPlayed) {
                this.handleWinnerScreen();
                this.level.enemies.splice(index, 1);
            }
        });
    }

    handleWinnerScreen() {
        if (this.winnerShown) {
            return;
        }

        this.winnerShown = true;
        this.showWinnerOverlay();
    }

    showWinnerOverlay() {
        document.getElementById('winnerOverlay').classList.remove('hidden');
        document.getElementById('gameTitle').classList.add('hidden');
        hideMobileControls();
    }

    playCharacterHurtSound() {
        if (
            !this.isCharacterHurtSoundPlaying &&
            !this.isCharacterDeadSoundPlaying &&
            !this.character.isDead()
        ) {
            this.isCharacterHurtSoundPlaying = true;
            this.characterHurtSound.play();

            this.characterHurtSound.onended = () => {
                this.isCharacterHurtSoundPlaying = false;
            };
        }
    }

    playCharacterDeadSound() {
        if (!this.isCharacterDeadSoundPlaying) {
            this.isCharacterDeadSoundPlaying = true;
            this.characterDeadSound.play();
        }
    }

    startGameOverSequence() {
        if (this.gameOverStarted) return;

        this.gameOverStarted = true;
        this.playCharacterDeadSound();

        setTimeout(() => {
            this.handleGameOver();
        }, 2500);
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectToMap(this.level.backgroundObjects);

        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);
        this.ctx.translate(this.camera_x, 0);

        this.addToMap(this.character);
        this.addObjectToMap(this.level.clouds);
        this.addObjectToMap(this.level.coins);
        this.addObjectToMap(this.level.bottles);
        this.addObjectToMap(this.level.enemies);
        this.addObjectToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0);

        if (this.character.isDead()) {
            this.startGameOverSequence();
        }

        requestAnimationFrame(() => this.draw());
    }

    handleGameOver() {
        if (this.gameOverShown) {
            return;
        }

        this.gameOverShown = true;
        this.showGameOverOverlay();
    }

    showGameOverOverlay() {
        document.getElementById('gameOverOverlay').classList.remove('hidden');
        document.getElementById('gameTitle').classList.add('hidden');
        hideMobileControls();
    }

    addObjectToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);

        }
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);


        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}