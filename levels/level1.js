function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function createRandomCoins() {
    let coins = [];
    let xPositions = shuffleArray([400, 650, 900, 1150, 1400, 1650, 1900]);
    let yPositions = [160, 200, 240, 280, 320];

    for (let i = 0; i < 5; i++) {
        let x = xPositions[i];
        let y = yPositions[getRandomNumber(0, yPositions.length - 1)];
        coins.push(new Coin(x, y));
    }

    return coins;
}

function createRandomBottles() {
    let bottles = [];
    let xPositions = shuffleArray([500, 750, 1000, 1250, 1500, 1750, 2000]);
    let yPositions = [180, 230, 280, 330];

    for (let i = 0; i < 5; i++) {
        let x = xPositions[i];
        let y = yPositions[getRandomNumber(0, yPositions.length - 1)];
        bottles.push(new Bottle(x, y));
    }

    return bottles;
}

const level1 = new Level(

    [new Chicken(), new Chicken(), new Chicken(), new Endboss()],
    [new Cloud()],
    [
        new BackgroundObject('img/5_background/layers/air.png', -719),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),

        new BackgroundObject('img/5_background/layers/air.png', 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/air.png', 719),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),

        new BackgroundObject('img/5_background/layers/air.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/air.png', 719 * 3),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719 * 3),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719 * 3),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719 * 3),
    ],  
    createRandomCoins(),
    createRandomBottles()


);  