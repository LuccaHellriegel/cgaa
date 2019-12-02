import {
    CompositePolygon
} from "../polygon/CompositePolygon"
import {
    Weapon
} from "./Weapon"
import {
    normalCircleRadius
} from "../globals/globalSizes"
export class ChainWeapon extends Weapon {
    numberOfSmallCircles: number
    numberOfBiggerCircles: number
    arrowWidth: number
    arrowHeight: number
    biggerCirclesRadius: number
    smallerCirclesRadius: number

    constructor(scene, x, y, weaponGroup, numberOfSmallCircles, numberOfBiggerCircles) {       
        super(scene, x, y, "chainWeapon", weaponGroup,[
            []
        ],[[0,-normalCircleRadius],[0,-normalCircleRadius],[0,-normalCircleRadius]])

        this.numberOfSmallCircles = numberOfSmallCircles
        this.numberOfBiggerCircles = numberOfBiggerCircles

        this.x = x
        this.y = y

        this.arrowWidth = 42
        this.arrowHeight = 21
        this.biggerCirclesRadius = ((this.arrowWidth / 3) / 2)
        this.smallerCirclesRadius = 2 * (this.biggerCirclesRadius / 3)

        //TODO: size does not line up with manual calculation
        this.createPolygons()
        //TODO: better distinction between unit offset and physics sprite offset
        this.setOffSetArr()
        this.setSize(2*this.polygonArr[this.polygonArr.length-1].height, 2*this.polygonArr[this.polygonArr.length-1].height)


    }

    setOffSetArr(){
        this.offSetArr = [[0,-30-(this.polygon.height / 2)], 
            [0,-30-(this.polygonArr[1].height / 2)], 
            [0,-30-(this.polygonArr[2].height / 2)]]
    }

    createPolygons() {
        this.createArrowHeadPolygon()
        let middleStagePolygon = this.createMiddleStagePolygon()
        let finalStagePolygon = this.createFinalStagePolygon()
        this.polygonArr = [this.polygon, middleStagePolygon, finalStagePolygon]
    }

    createArrowHeadPolygon() {
        let arrowHeadConfig = [this.createArrowHeadConfig([])]
        this.polygon = new CompositePolygon(arrowHeadConfig)
    }

    createMiddleStagePolygon() {
        let biggerCirclesConfig = this.createBiggerCirclesConfig([])
        let arrowHeadConfig = [this.createArrowHeadConfig(biggerCirclesConfig)]
        return new CompositePolygon(biggerCirclesConfig.concat(arrowHeadConfig))
    }

    createFinalStagePolygon() {
        let smallerCirclesConfig = this.createSmallCirclesConfig()
        let biggerCirclesConfig = this.createBiggerCirclesConfig(smallerCirclesConfig)
        let arrowHeadConfig = [this.createArrowHeadConfig(biggerCirclesConfig)]
        return new CompositePolygon(smallerCirclesConfig.concat(biggerCirclesConfig, arrowHeadConfig))
    }

    getLastXYFromConfig(lastConfigPart) {
        let lastIndex = lastConfigPart.length - 1

        let lastX = lastIndex != -1 ? lastConfigPart[lastIndex][0] : this.x
        let lastY = lastIndex != -1 ? lastConfigPart[lastIndex][1] : this.y
        return {
            lastX,
            lastY
        }
    }

    createArrowHeadConfig(lastConfigPart) {
        let {
            lastX,
            lastY
        } = this.getLastXYFromConfig(lastConfigPart)
        let distanceOfArrowHeadFromNearestCircleCenter = lastY === this.y ? 0 : 3 * this.biggerCirclesRadius
        let arrowHeadPolygonConfig = [lastX, lastY - distanceOfArrowHeadFromNearestCircleCenter,
            this.arrowWidth, this.arrowHeight, "arrowHead"
        ]
        return arrowHeadPolygonConfig
    }

    createSmallCirclesConfig() {
        let smallerCirclesConfig = []
        for (let index = 0; index < this.numberOfSmallCircles; index++) {
            let newX = this.x
            let newY = this.y - index * this.smallerCirclesRadius * 3.5
            smallerCirclesConfig.push([newX, newY, this.smallerCirclesRadius])
        }
        return smallerCirclesConfig
    }

    createBiggerCirclesConfig(lastConfigPart) {
        let biggerCirclesConfig = []
        let {
            lastX,
            lastY
        } = this.getLastXYFromConfig(lastConfigPart)

        lastY -= 2 * this.smallerCirclesRadius + this.biggerCirclesRadius

        for (let index = 0; index < this.numberOfBiggerCircles; index++) {
            let newX = lastX
            let newY = lastY - (index * (this.smallerCirclesRadius * 1.5 + this.biggerCirclesRadius * 2))
            biggerCirclesConfig.push([newX, newY, this.biggerCirclesRadius])
        }

        return biggerCirclesConfig
    }
}