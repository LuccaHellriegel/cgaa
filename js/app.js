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
    Player
} from "./player";
import {
    initCombat
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
    
    this.player = new Player(this)
    this.enemies = spawnRedEnemyCircles(this, 1)

    this.physics.add.collider(this.player, this.enemies);
    initCombat(this)

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
    let offset = 0
    let graphics = this.add.graphics({
        fillStyle: {
            color: 0xFF00FF
        }
    });
    //this.player.weapon.polygon.draw(graphics,offset)
    checkMovement(this)
}
