import {
    CompositePolygon
} from "../polygon/CompositePolygon"
import { Weapon } from "./Weapon"

export class RandWeapon extends Weapon {
    constructor(scene, x, y, weaponGroup) {
        super(scene, x, y, "randWeapon", weaponGroup)
        this.polygon = new CompositePolygon([[x, y, 10, 64, "rect"]])
        this.polygonArr = [this.polygon , new CompositePolygon([[x, y, 10, 64,"rect"], [x, y -22, 64, 20,"rect"]])]
    }

    movePolygon(){
        this.polygon.setPosition(this.x, this.y)
        this.polygon.rotate(this.rotation)
    }

    setPolygonForFrame(){
        this.polygon = this.polygonArr[parseInt(this.frame.name)-1]
    }

    updatePolygon() {
        this.setPolygonForFrame()
        this.movePolygon()
    }
}
