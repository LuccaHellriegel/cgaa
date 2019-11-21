let debugModus = true

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