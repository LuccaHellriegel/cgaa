import Phaser from "phaser";
import {
    generate
} from "./generate";
import {
    createAnims
} from "./anims";
import {
    spawnRedEnemyCircles
} from "./enemy";
import {
    setupMovement,
    checkMovement
} from "./movement";
import {
    AggressiveCircle
} from "./unit";
import {
    doDamage, considerDamage
} from "./combat";

let config = {
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

let game = new Phaser.Game(config);

function create() {

    generate(this)
    createAnims(this.anims)

    let playerGroup = this.physics.add.group();
    let playerWeaponGroup = this.physics.add.group()

    this.player = new AggressiveCircle(this, "blueCircle", playerGroup, 100, 450, playerWeaponGroup)
    this.player.setCircle(30) 
    const enemyWeapons = spawnRedEnemyCircles(this, 1, 30, playerWeaponGroup, this.player)
    //TODO: better structure for the overlaps
    this.physics.add.overlap(enemyWeapons, playerGroup, doDamage, null, this);

    this.cameras.main.startFollow(this.player);

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
