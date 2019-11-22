import {
    CompositePolygon
} from "../polygon/CompositePolygon"
import { Weapon } from "./Weapon"
import { ArrowHeadPolygon } from "../polygon/ArrowHeadPolygon"

export class ChainWeapon { //extends Weapon {
    constructor(scene, x, y, weaponGroup) {
        //super(scene, x, y, "chainWeapon", weaponGroup)

        this.x = x
        this.y = y
        let compositeConfig = []
        this.createLaterCirclesConfig(compositeConfig)
        this.createFirstCirclesConfig(compositeConfig)

        let firstCirclesRadius = ((42/3)/2)
        let lastX = compositeConfig[compositeConfig.length-1][0]
        let lastY = compositeConfig[compositeConfig.length-1][1]
        let arrowHeadPolygonConfig = [lastX,lastY-2*firstCirclesRadius,42,21,"arrowHead"]
        compositeConfig.push(arrowHeadPolygonConfig)


        this.polygon = new CompositePolygon(compositeConfig)
        this.polygonArr = [new CompositePolygon(compositeConfig)]

        console.log(compositeConfig)
        console.log(this.polygon)

    }

    createLaterCirclesConfig(compositeConfig){
        let firstCirclesRadius = ((42/3)/2)
        let laterCirclesRadius = 2*(firstCirclesRadius / 3)
        for (let index = 0; index < 4; index++) {
            let newX = this.x
            let newY = this.y-index*laterCirclesRadius*3.5
            compositeConfig.push([newX,newY,laterCirclesRadius])
        }
    }

    createFirstCirclesConfig(compositeConfig){
        let firstCirclesRadius = ((42/3)/2)
        let laterCirclesRadius = 2*(firstCirclesRadius / 3)
        let lastX = compositeConfig[compositeConfig.length-1][0]
        let lastY = compositeConfig[compositeConfig.length-1][1]
        for (let index = 0; index < 3; index++) {
            let newX = lastX
            let newY = lastY-(index*laterCirclesRadius*1.5+firstCirclesRadius*2)
            compositeConfig.push([newX,newY,firstCirclesRadius])
        }
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
