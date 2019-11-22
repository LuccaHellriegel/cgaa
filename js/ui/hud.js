import { HealthBar } from "../unit/HealthBar";

export class HUD extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'HUD', active: true });

    }

    create ()
    {
        let playerHealthBar = new HealthBar(this, this.calculatehealthBarXWrtScreen(), this.calculatehealthBarYWrtScreen(), 46, 12);

        let ourGame = this.scene.get('Gameplay');

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
        console.log(topLeftXHealthBar)
        return topLeftXHealthBar
    }

    calculatehealthBarYWrtScreen(){
        let screenLength = 720
        let healthBarLength = 12
        let topLeftYHealthBar = screenLength - healthBarLength
        console.log(topLeftYHealthBar)

        return topLeftYHealthBar
    }
}