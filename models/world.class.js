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
    endbossBar = new StatusbarEndboss();
    throwableObjects = [];
    canThrow = true;
    gameOverShown = false;
    winnerShown = false;
    gameOverStarted = false;

    /**
     * Creates a new game world and initializes rendering,
     * object references, enemies, and collision checks.
     *
     * @param {HTMLCanvasElement} canvas - The canvas used to render the game.
     * @param {Keyboard} keyboard - The keyboard state used to control the character.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.draw();
        this.setWorld();
        this.startEnemies();
        this.run();
    }

    /**
     * Assigns the current world instance to the character and all enemies.
     *
     * @returns {void}
     */
    setWorld() {
        this.character.world = this;

        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });
    }

    /**
     * Starts the animations of all enemies in the current level.
     *
     * @returns {void}
     */
    startEnemies() {
        this.level.enemies.forEach(enemy => {
            enemy.startAnimation();
        });
    }

    /**
     * Starts the main game interval for collision checks,
     * object interactions, and cleanup operations.
     *
     * @returns {void}
     */
    run() {
        setInterval(() => {
            if (this.character.isDead() || this.winnerShown) {
                return;
            }

            this.checkCollisions();
            this.checkThrowObjects();
            this.checkThrowableObjectCollisions();
            this.checkBottleGroundCollision();
            this.checkCoinsCollisions();
            this.checkBottleCollisions();
            this.checkFootstepLoop();
            this.removeDeadEndbosses();
            this.removeSplashedBottles();
        }, 1000 / 60);
    }

    /**
     * Checks whether the player is throwing a bottle and creates
     * a throwable object when all conditions are met.
     *
     * @returns {void}
     */
    checkThrowObjects() {
        if (this.keyboard.D && this.character.bottles > 0 && this.canThrow) {
            let throwableObject = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(throwableObject);
            audioManager.playBottleThrowSound();

            this.character.bottles -= 20;
            this.bottleBar.setPercentage(this.character.bottles);

            this.canThrow = false;
        }

        if (!this.keyboard.D) {
            this.canThrow = true;
        }
    }

    /**
     * Checks collisions between the character and all enemies.
     *
     * @returns {void}
     */
    checkCollisions() {
        this.level.enemies.forEach((enemy, index) => {
            if (this.character.isColliding(enemy)) {
                this.handleEnemyCollision(enemy, index);
            }
        });
    }

    /**
     * Handles a collision between the character and an enemy.
     *
     * @param {MovableObject} enemy - The enemy involved in the collision.
     * @param {number} index - The position of the enemy in the enemies array.
     * @returns {void}
     */
    handleEnemyCollision(enemy, index) {
        if (enemy instanceof Chicken && this.isTopCollision(enemy)) {
            audioManager.playChickenDeadSound();
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
                audioManager.playCharacterHurtSound(this.character.isDead());
            }
        }
    }

    /**
     * Checks whether the character is colliding with an enemy from above.
     *
     * @param {MovableObject} enemy - The enemy to check.
     * @returns {boolean} True if the character lands on the enemy from above.
     */
    isTopCollision(enemy) {
        let characterFeet = this.character.y + this.character.height - this.character.offset.bottom;
        let enemyTop = enemy.y + enemy.offset.top;
        let difference = characterFeet - enemyTop;

        let characterCenterX = this.character.x + this.character.offset.left +
            (this.character.width - this.character.offset.left - this.character.offset.right) / 2;

        let enemyLeft = enemy.x + enemy.offset.left;
        let enemyRight = enemy.x + enemy.width - enemy.offset.right;

        return this.character.speedY < 0 &&
            difference > 0 &&
            difference < 60 &&
            characterCenterX > enemyLeft &&
            characterCenterX < enemyRight;
    }

    /**
     * Checks whether the character is collecting any coins.
     *
     * @returns {void}
     */
    checkCoinsCollisions() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                audioManager.playCoinSound();
                this.level.coins.splice(index, 1);
                this.character.collectCoin();
                this.coinBar.setPercentage(this.character.coins);
            }
        });
    }

    /**
     * Checks whether the character is collecting any bottles.
     *
     * @returns {void}
     */
    checkBottleCollisions() {
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                audioManager.playBottlePickupSound();
                this.level.bottles.splice(index, 1);
                this.character.collectBottle();
                this.bottleBar.setPercentage(this.character.bottles);
            }
        });
    }

    /**
     * Checks collisions between thrown bottles and enemies.
     *
     * @returns {void}
     */
    checkThrowableObjectCollisions() {
        this.throwableObjects.forEach((throwableObject, bottleIndex) => {
            this.level.enemies.forEach((enemy, enemyIndex) => {
                if (throwableObject.isColliding(enemy)) {
                    this.handleThrowableObjectCollision(enemy, enemyIndex, bottleIndex);
                }
            });
        });
    }

    /**
     * Handles a collision between a thrown bottle and an enemy.
     *
     * @param {MovableObject} enemy - The enemy hit by the bottle.
     * @param {number} enemyIndex - The position of the enemy in the enemies array.
     * @param {number} bottleIndex - The position of the bottle in the throwable objects array.
     * @returns {void}
     */
    handleThrowableObjectCollision(enemy, enemyIndex, bottleIndex) {
        let bottle = this.throwableObjects[bottleIndex];

        if (bottle.hasHit) {
            return;
        }

        bottle.hasHit = true;
        bottle.splash();
        audioManager.playBottleBreakSound();

        if (enemy instanceof Chicken) {
            audioManager.playChickenDeadSound();
            this.level.enemies.splice(enemyIndex, 1);
        }

        if (enemy instanceof Endboss) {
            enemy.hitByBottle();
            this.endbossBar.setPercentage(enemy.energy);
        }
    }

    /**
     * Removes bottles that have completed their splash animation.
     *
     * @returns {void}
     */
    removeSplashedBottles() {
        this.throwableObjects = this.throwableObjects.filter(bottle => !bottle.shouldRemove);
    }

    /**
     * Removes defeated endbosses and displays the winner screen.
     *
     * @returns {void}
     */
    removeDeadEndbosses() {
        this.level.enemies.forEach((enemy, index) => {
            if (enemy instanceof Endboss && enemy.isDeadAnimationPlayed) {
                this.handleWinnerScreen();
                this.level.enemies.splice(index, 1);
            }
        });
    }

    /**
     * Checks whether a thrown bottle has collided with the ground.
     *
     * @returns {void}
     */
    checkBottleGroundCollision() {
        this.throwableObjects.forEach(bottle => {
            if (!bottle.hasHit && bottle.y > 360) {
                bottle.hasHit = true;
                bottle.splash();
                audioManager.playBottleBreakSound();
            }
        });
    }

    /**
     * Starts or stops the footstep loop depending on the character state.
     *
     * @returns {void}
     */
    checkFootstepLoop() {
        if (this.shouldPlayFootstepLoop()) {
            audioManager.playFootstepLoop();
        } else {
            audioManager.stopFootstepLoop();
        }
    }

    /**
     * Checks whether the footstep sound should currently be playing.
     *
     * @returns {boolean} True if the character is walking on the ground.
     */
    shouldPlayFootstepLoop() {
        return (
            (this.keyboard.RIGHT || this.keyboard.LEFT) &&
            !this.character.isAboveGround() &&
            !this.character.isDead() &&
            !this.winnerShown &&
            !this.gameOverShown
        );
    }

    /**
     * Starts the winner sequence after the endboss has been defeated.
     *
     * @returns {void}
     */
    handleWinnerScreen() {
        if (this.winnerShown) {
            return;
        }

        this.winnerShown = true;
        audioManager.stopFootstepLoop();
        audioManager.playEndbossDefeatedSound();

        setTimeout(() => {
            audioManager.playWinnerSoundThenScreenMusic();
            this.showWinnerOverlay();
        }, 1000);
    }

    /**
     * Displays the winner overlay and hides the game title and mobile controls.
     *
     * @returns {void}
     */
    showWinnerOverlay() {
        document.getElementById('winnerOverlay').classList.remove('hidden');
        document.getElementById('gameTitle').classList.add('hidden');
        hideMobileControls();
    }

    /**
     * Starts the delayed game-over sequence.
     *
     * @returns {void}
     */
    startGameOverSequence() {
        if (this.gameOverStarted) return;

        this.gameOverStarted = true;
        audioManager.stopFootstepLoop();
        audioManager.stopGameMusic();
        audioManager.playGameOverSound();

        setTimeout(() => {
            this.handleGameOver();
        }, 2500);
    }


    /**
     * Draws all visible objects and interface elements on the canvas.
     *
     * @returns {void}
     */
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
        this.addEndbossBar();
        this.addObjectToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0);

        if (this.character.isDead()) {
            this.startGameOverSequence();
        }

        requestAnimationFrame(() => this.draw());
    }

    /**
     * Draws the endboss status bar above the active endboss.
     *
     * @returns {void}
     */
    addEndbossBar() {
        let endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);

        if (!endboss || endboss.isDead()) {
            return;
        }

        this.endbossBar.x = endboss.x + endboss.width / 2 - this.endbossBar.width / 2;
        this.endbossBar.y = Math.max(endboss.y + 30, 20);
        this.addToMap(this.endbossBar);
    }

    /**
     * Displays the game-over screen once.
     *
     * @returns {void}
     */
    handleGameOver() {
        if (this.gameOverShown) {
            return;
        }

        this.gameOverShown = true;
        audioManager.playGameOverScreenMusic();
        this.showGameOverOverlay();
    }

    /**
     * Displays the game-over overlay and hides the game title and mobile controls.
     *
     * @returns {void}
     */
    showGameOverOverlay() {
        document.getElementById('gameOverOverlay').classList.remove('hidden');
        document.getElementById('gameTitle').classList.add('hidden');
        hideMobileControls();
    }

    /**
     * Adds all objects from an array to the canvas.
     *
     * @param {DrawableObject[]} objects - The objects to draw.
     * @returns {void}
     */
    addObjectToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Draws a single object on the canvas and handles its direction.
     *
     * @param {DrawableObject} mo - The object to draw.
     * @returns {void}
     */
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

    /**
     * Flips an object's image horizontally before drawing.
     *
     * @param {DrawableObject} mo - The object whose image should be flipped.
     * @returns {void}
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores an object's position and the canvas state after flipping.
     *
     * @param {DrawableObject} mo - The previously flipped object.
     * @returns {void}
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}