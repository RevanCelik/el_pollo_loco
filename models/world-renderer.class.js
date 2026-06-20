class WorldRenderer {
    world;

    /**
     * Creates a renderer for the specified game world.
     *
     * @param {World} world - The game world that should be rendered.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Draws all visible game objects and interface elements.
     *
     * @returns {void}
     */
    draw() {
        if (!this.world.isRunning) {
            return;
        }

        this.clearCanvas();
        this.drawWorldObjects();
        this.drawFixedStatusBars();
        this.drawMovableObjects();
        this.checkGameOver();
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Clears the complete canvas.
     *
     * @returns {void}
     */
    clearCanvas() {
        let world = this.world;

        world.ctx.clearRect(
            0,
            0,
            world.canvas.width,
            world.canvas.height
        );
    }

    /**
     * Draws the background objects using the current camera position.
     *
     * @returns {void}
     */
    drawWorldObjects() {
        let world = this.world;

        world.ctx.translate(world.camera_x, 0);
        this.addObjectToMap(world.level.backgroundObjects);
    }

    /**
     * Draws the status bars at fixed canvas positions.
     *
     * @returns {void}
     */
    drawFixedStatusBars() {
        let world = this.world;

        world.ctx.translate(-world.camera_x, 0);
        this.addToMap(world.statusBar);
        this.addToMap(world.coinBar);
        this.addToMap(world.bottleBar);
        world.ctx.translate(world.camera_x, 0);
    }

    /**
     * Draws all movable objects inside the game world.
     *
     * @returns {void}
     */
    drawMovableObjects() {
        let world = this.world;

        this.addToMap(world.character);
        this.addObjectToMap(world.level.clouds);
        this.addObjectToMap(world.level.coins);
        this.addObjectToMap(world.level.bottles);
        this.addObjectToMap(world.level.enemies);
        this.addEndbossBar();
        this.addObjectToMap(world.throwableObjects);
        world.ctx.translate(-world.camera_x, 0);
    }

    /**
     * Starts the game-over sequence if the character is dead.
     *
     * @returns {void}
     */
    checkGameOver() {
        if (this.world.character.isDead()) {
            this.world.startGameOverSequence();
        }
    }

    /**
     * Draws the endboss status bar above the active endboss.
     *
     * @returns {void}
     */
    addEndbossBar() {
        let world = this.world;
        let endboss = world.level.enemies.find(
            enemy => enemy instanceof Endboss
        );

        if (!endboss || endboss.isDead()) {
            return;
        }

        world.endbossBar.x =
            endboss.x +
            endboss.width / 2 -
            world.endbossBar.width / 2;

        world.endbossBar.y = Math.max(endboss.y + 30, 20);
        this.addToMap(world.endbossBar);
    }

    /**
     * Draws all objects from the specified array.
     *
     * @param {DrawableObject[]} objects - The objects to draw.
     * @returns {void}
     */
    addObjectToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }

    /**
     * Draws one object and handles its horizontal direction.
     *
     * @param {DrawableObject} movableObject - The object to draw.
     * @returns {void}
     */
    addToMap(movableObject) {
        if (movableObject.otherDirection) {
            this.flipImage(movableObject);
        }

        movableObject.draw(this.world.ctx);
        movableObject.drawFrame(this.world.ctx);

        if (movableObject.otherDirection) {
            this.flipImageBack(movableObject);
        }
    }

    /**
     * Flips an object horizontally before it is drawn.
     *
     * @param {DrawableObject} movableObject - The object to flip.
     * @returns {void}
     */
    flipImage(movableObject) {
        this.world.ctx.save();
        this.world.ctx.translate(movableObject.width, 0);
        this.world.ctx.scale(-1, 1);
        movableObject.x = movableObject.x * -1;
    }

    /**
     * Restores the canvas and object position after drawing.
     *
     * @param {DrawableObject} movableObject - The flipped object.
     * @returns {void}
     */
    flipImageBack(movableObject) {
        movableObject.x = movableObject.x * -1;
        this.world.ctx.restore();
    }
}