class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    level_end_x = 719 * 3;

    /**
     * Creates a new game level with all required game objects.
     *
     * @param {Array} enemies - The enemies contained in the level.
     * @param {Array} clouds - The clouds contained in the level.
     * @param {Array} backgroundObjects - The background objects of the level.
     * @param {Array} coins - The collectible coins in the level.
     * @param {Array} bottles - The collectible bottles in the level.
     */
    constructor(enemies, clouds, backgroundObjects, coins, bottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}