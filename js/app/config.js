let debugModus = false

let gameConfig = {
    type: Phaser.WEBGL,
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