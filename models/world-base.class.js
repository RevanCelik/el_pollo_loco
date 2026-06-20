class WorldBase {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    renderer;
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
    gameInterval = null;
    isRunning = true;

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
        this.renderer = new WorldRenderer(this);

        this.renderer.draw();
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
        this.gameInterval = setInterval(() => {
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
     * Stops the active world loop and renderer.
     *
     * @returns {void}
     */
    stop() {
        clearInterval(this.gameInterval);
        this.gameInterval = null;
        this.isRunning = false;
        audioManager.stopFootstepLoop();
    }
}
