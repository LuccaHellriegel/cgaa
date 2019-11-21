//TODO: have central graphics object if debugModus to be able to clean before each frame
let debugModus = false

let gameConfig = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            debug: debugModus
        }
    }
};

module.exports = {debugModus, gameConfig}