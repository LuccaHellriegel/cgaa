import collision from "polygon-collision";
import {
    RectPolygon
} from "./RectPolygon";
import {
    ArrowHeadPolygon
} from "./ArrowHeadPolygon";
import {
    CirclePolygon
} from "./CirclePolygon";
import { Polygon } from "./Polygon";
export class CompositePolygon {
    polygons: Polygon[];
    centerX: number;
    centerY: number;
    height: number;
    width: number;

    constructor(config) {
        this.polygons = [];
        config.forEach(polygonConfig => {
            if (polygonConfig[4] == "rect") {
                this.polygons.push(new RectPolygon(polygonConfig[0], polygonConfig[1], polygonConfig[2], polygonConfig[3]));
            } else if (polygonConfig[4] == "arrowHead") {
                this.polygons.push(new ArrowHeadPolygon(polygonConfig[0], polygonConfig[1], polygonConfig[2], polygonConfig[3]));
            } else {
                this.polygons.push(new CirclePolygon(polygonConfig[0], polygonConfig[1], polygonConfig[2]));
            }
        });
        this.calculateAndSetCenter()
        this.height = this.calculateHeight()
        this.width = this.calculateWidth()
    }

    calculateAndSetCenter(){
        let centerPoint = this.calculateCenterPoint()
        this.centerX = centerPoint[0]
        this.centerY = centerPoint[1]
    }

    setPosition(x, y) {
        let diffX = x - this.centerX;
        let diffY = y -  this.centerY;
        this.centerX = x
        this.centerY = y

        for (let index = 0; index < this.polygons.length; index++) {
            let polygon = this.polygons[index];
            polygon.setPosition(polygon.x + diffX, polygon.y + diffY);
        }
    }

    rotate(rotation) {
        for (let index = 0; index < this.polygons.length; index++) {
            let polygon = this.polygons[index];
            polygon.rotateWithCenter(rotation, this.centerX, this.centerY);
        }
    }

    private calculateHeight() {
        let lowestYInComp = Infinity
        let highestYInComp = -Infinity
        this.polygons.forEach(polygon => {
            let {
                lowestY,
                highestY
            } = polygon.getLowestHighestY()
            if(lowestYInComp > lowestY) lowestYInComp = lowestY
            if(highestYInComp < highestY) highestYInComp = highestY
        })
        return highestYInComp-lowestYInComp
    }

    private calculateWidth(){
        let lowestXInComp = Infinity
        let highestXInComp = -Infinity
        this.polygons.forEach(polygon => {
            let {
                lowestX,
                highestX
            } = polygon.getLowestHighestX()
            if(lowestXInComp > lowestX) lowestXInComp = lowestX
            if(highestXInComp < highestX) highestXInComp = highestX
        })
        return highestXInComp-lowestXInComp
    }

    calculateCenterPoint(){
        let centerPointsOfPolygons : number[][]= []
        this.polygons.forEach(polygon => {
            //console.log(polygon.calculateCenterPoint())
            centerPointsOfPolygons.push(polygon.calculateCenterPoint())
        })
        var x = centerPointsOfPolygons.map(x => x[0]);
        var y = centerPointsOfPolygons.map(x => x[1]);
        var cx = (Math.min(...x) + Math.max(...x)) / 2;
        var cy = (Math.min(...y) + Math.max(...y)) / 2;
        return [cx, cy];
    }

    draw(graphics, offset) {
        this.polygons.forEach(polygon => {
            polygon.draw(graphics, offset);
        });
    }

    //TODO: exchange collision with sat-js for broader applicability (only circle + polygon is supported, thats why I need the bounding box)
    checkForCollision(other) {
        for (let index = 0; index < this.polygons.length; index++) {

            let currentPolygon = this.polygons[index]
            let collided = false

            if(currentPolygon.type === "circle" && other.type === "circle"){
                collided = (currentPolygon as CirclePolygon).checkForCollisonWithOtherCircle(other)
            } else {collided = collision(currentPolygon, other)}

            if(collided) return true
        }
        return false;
    }
}