import { HealthBar } from "../graphic/HealthBar";

export class PlayerHealthBar extends HealthBar {
    constructor(scene){
        super(scene, 0, 0, 46, 12)
        this.move(this.calculatehealthBarXWrtScreen(),this.calculatehealthBarYWrtScreen())
    }

    private calculatehealthBarXWrtScreen(){
        let screenWidth = 1280
        let healthBarWidth = 46
        let topLeftXHealthBar = screenWidth - healthBarWidth
        return topLeftXHealthBar
    }

    private calculatehealthBarYWrtScreen(){
        let screenLength = 720
        let healthBarLength = 12
        let topLeftYHealthBar = screenLength - healthBarLength
        return topLeftYHealthBar
    }
}