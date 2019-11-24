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
export class CompositePolygon {
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
    }

    getFirstPolygonXY() {
        let firstX = this.polygons[0].x
        let firstY = this.polygons[0].y
        return {
            firstX,
            firstY
        }
    }

    setPosition(x, y) {
        //first polygon is the anchor point for all the polygons
        let {
            firstX,
            firstY
        } = this.getFirstPolygonXY()
        let diffX = x - firstX;
        let diffY = y - firstY;

        this.polygons[0].setPosition(x, y)

        for (let index = 1; index < this.polygons.length; index++) {
            let polygon = this.polygons[index];
            polygon.setPosition(polygon.x + diffX, polygon.y + diffY);
        }
    }

    rotate(rotation) {
        let {
            firstX,
            firstY
        } = this.getFirstPolygonXY()
        for (let index = 0; index < this.polygons.length; index++) {
            let polygon = this.polygons[index];
            if (polygon.type !== "circle") {
                polygon.rotateWithCenter(rotation, firstX, firstY);
            } else {
                let point = Phaser.Math.RotateAround(new Phaser.Geom.Point(polygon.points[0].x, polygon.points[0].y), firstX, firstY, rotation)
                polygon.setPosition(point.x, point.y)
            }
        }
    }

    //TODO: always have 0,0 as the map origin, otherwise this does not work
    getHeight() {
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

    draw(graphics, offset) {
        this.polygons.forEach(polygon => {
            polygon.draw(graphics, offset);
        });
    }

    checkForCollision(other) {
        for (let index = 0; index < this.polygons.length; index++) {
            if (collision(this.polygons[index], other.polygon))
                return true;
        }
        return false;
    }
}