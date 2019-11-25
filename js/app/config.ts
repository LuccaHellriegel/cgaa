export let debugModus = false

export let gameConfig = {
    type: Phaser.WEBGL,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            debug: debugModus
        }
    },
    scene: {}
};
