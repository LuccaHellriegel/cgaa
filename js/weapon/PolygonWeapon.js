import {Weapon} from "./Weapon"
export class PolygonWeapon extends Weapon {
    constructor(scene, x, y, texture, weaponGroup, polygonArr, offSetArr) {
        super(scene, x, y, texture, weaponGroup, offSetArr);
        this.polygon = polygonArr[0]
        this.polygonArr = polygonArr

    }
    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.updatePolygon()
    }

    movePolygon() {
        this.polygon.setPosition(this.x, this.y)
        this.polygon.rotate(this.rotation)
    }

    setPolygonForFrame() {
        this.polygon = this.polygonArr[parseInt(this.frame.name) - 1]
    }

    updatePolygon() {
        this.setPolygonForFrame()
        this.movePolygon()
    }
}