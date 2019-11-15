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

function drawPolygons(scene,points){
    let offset = 0
    let graphics = scene.add.graphics({
        fillStyle: {
            color: 0xFF00FF
        }
    });
    graphics.lineStyle(5, 0xFF00FF, 1.0);
    graphics.beginPath();
graphics.moveTo(points[0].x+offset, points[0].y+offset);
graphics.lineTo(points[0].x+offset, points[0].y+offset);
graphics.lineTo(points[1].x+offset, points[1].y+offset);
graphics.lineTo(points[2].x+offset, points[2].y+offset);
graphics.lineTo(points[3].x+offset, points[3].y+offset);
graphics.closePath();
graphics.strokePath();
}

function update() {
    drawPolygons(this,this.player.weapon.polygon.points)

    checkMovement(this)
}
