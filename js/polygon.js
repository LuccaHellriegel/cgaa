import {rotateRect} from "./rotation"

let shapeWord = {
    line: "line",
    point: "point",
    circle: "circle",
    polygon: "polygon",
};

class RectPolygon {
    constructor(x, y, width, height) {
        this.type = shapeWord.polygon
        //This is the center point
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.points = this.createPoints()
    }

    createPoints(){
        let x = this.x - (this.width / 2)
        let y = this.y - (this.height / 2)
        let width = this.width
        let height = this.height
        return [{
            x: x,
            y: y
        }, {
            x: x + width,
            y: y
        },
        {
            x: x + width,
            y: y + height
        }, {
            x: x,
            y: y + height
        }
    ]
    }

    movePoints(diffX, diffY){
        this.points.forEach(point => {
            point.x += diffX
            point.y += diffY
        })
    }

    setPosition(x,y) {
        let diffX = this.x - x
        let diffY = this.y - y
        this.movePoints(diffX, diffY)
        this.x = x
        this.y = y
    }

    rotate(rotation) {
        this.points = rotateRect(this.createPoints(), {centerX: this.x, centerY: this.y}, rotation)
    }
}

class CirclePolygon {
    constructor(x, y, radius) {

        this.type = shapeWord.circle
        this.points = [{
            x: x,
            y: y
        }]
        this.r = radius

    }
}

module.exports = {
    RectPolygon,
    CirclePolygon
}