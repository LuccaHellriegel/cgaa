import {
    CompositeRectPolygon
} from "../polygon/CompositeRectPolygon"
import { Weapon } from "./Weapon"

export class RandWeapon extends Weapon {
    constructor(scene, x, y, weaponGroup) {
        super(scene, x, y, "randWeapon", weaponGroup)
        //TODO: variable for each weapon
        //TODO: polygon per frame
        this.polygon = new CompositeRectPolygon([[x, y, 10, 64]])
        this.polygonArr = [new CompositeRectPolygon([[x, y, 10, 64]]) , new CompositeRectPolygon([[x, y, 10, 64], [x, y -22, 64, 20]])]
    }
    //TODO: move -> update
    movePolygon() {
        this.polygon = this.polygonArr[parseInt(this.frame.name)-1]
        this.polygon.setPosition(this.x, this.y)
        this.polygon.rotate(this.rotation)
    }
}
