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
        this.points = [{
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

    rotate(rotation) {
        this.points = rotateRect(this.points, rotation)
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