import {
    CompositeRectPolygon
} from "../polygon/CompositeRectPolygon"
import { Weapon } from "./Weapon"

export class RandWeapon extends Weapon {
    constructor(scene, x, y, weaponGroup) {
        super(scene, x, y, "randWeapon", weaponGroup)
        this.polygon = new CompositeRectPolygon([[x, y, 10, 64]])
        this.polygonArr = [this.polygon , new CompositeRectPolygon([[x, y, 10, 64], [x, y -22, 64, 20]])]
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
