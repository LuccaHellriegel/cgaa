import Phaser from "phaser";
import {
    generateRandWeapon
} from "./weapon";
import {
    createAnims
} from "./anims";
import {
    generateRedEnemyCircles
} from "./enemy";
import {
    setupMovement,
    checkMovement
} from "./movement";
import {
    AggressiveCircle,
    generateCircleTexture
} from "./unit";
import {
    enemyCollision, overlap
} from "./combat";

var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: {
        create: create,
        update: update
    }
};

//TODO: var to let and const
//TODO: eslint
var game = new Phaser.Game(config);

function create() {

    generateRandWeapon(0x6495ED, this)

    let playerGroup = this.physics.add.group();
    let playerWeaponGroup = this.physics.add.group()

    generateCircleTexture(0x6495ED, "blueCircle", 30, this)
    this.player = new AggressiveCircle(this, "blueCircle", playerGroup, 100, 450, playerWeaponGroup)
    this.player.setCircle(30)

    createAnims(this.anims)

    this.cameras.main.startFollow(this.player);

    const enemyWeapons = generateRedEnemyCircles(this, 1, 30, playerWeaponGroup, this.player)
    //TODO: better structure for the overlaps
    this.physics.add.overlap(enemyWeapons, playerGroup, enemyCollision, null, this);

    this.cursors = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });
    setupMovement(this.input, this.cameras, this.player)
}

function update() {
    checkMovement(this)
}

module.exports = {
    generateCircleTexture
}