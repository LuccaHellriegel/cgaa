import { HealthBar } from "../graphic/HealthBar";
import { CompositePolygon } from "../polygon/CompositePolygon";

export class HUD extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'HUD', active: true });

    }

    create ()
    {
        let playerHealthBar = new HealthBar(this, this.calculatehealthBarXWrtScreen(), this.calculatehealthBarYWrtScreen(), 46, 12);

        let playerSoulCount = 0

        let graphics = this.add.graphics({
            fillStyle: {
                color: 0x228B22
            }
        });
        let playerSoulCountGraphic = new CompositePolygon([[300,300,50,25, "rect"], [300,300,25,50, "rect"]])
        playerSoulCountGraphic.setPosition( this.calculatehealthBarXWrtScreen()-30, this.calculatehealthBarYWrtScreen() - 20)
        playerSoulCountGraphic.draw(graphics,0)
        let playerSoulCountText = this.add.text(playerSoulCountGraphic.centerX-17, playerSoulCountGraphic.centerY-12, '0', { font: '20px Verdana', fill: '#ADFF2F' });

        let ourGame = this.scene.get('Gameplay');

        ourGame.events.on('enemyDamaged', function (amount) {
            playerSoulCount += amount
            playerSoulCountText.setText(playerSoulCount.toString())

        }, this);


        ourGame.events.on('playerDamaged', function () {

            if(playerHealthBar.decrease(2)){
                playerHealthBar.value = 100
            }

        }, this);
    }

    calculatehealthBarXWrtScreen(){
        let screenWidth = 1280
        let healthBarWidth = 46
        let topLeftXHealthBar = screenWidth - healthBarWidth
        return topLeftXHealthBar
    }

    calculatehealthBarYWrtScreen(){
        let screenLength = 720
        let healthBarLength = 12
        let topLeftYHealthBar = screenLength - healthBarLength
        return topLeftYHealthBar
    }
}