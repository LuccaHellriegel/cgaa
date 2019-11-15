import {
    rotateRect
} from "./rotation"

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

    createPoints() {
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

    movePoints(diffX, diffY) {
        this.points.forEach(point => {
            point.x += diffX
            point.y += diffY
        })
    }

    setPosition(x, y) {
        let diffX = this.x - x
        let diffY = this.y - y
        this.movePoints(diffX, diffY)
        this.x = x
        this.y = y
    }

    rotate(rotation) {
        this.points = rotateRect(this.createPoints(), {
            centerX: this.x,
            centerY: this.y
        }, rotation)
    }

    draw(graphics, offset) {
        graphics.lineStyle(5, 0xFF00FF, 1.0);
        graphics.beginPath();
        graphics.moveTo(this.points[0].x + offset, this.points[0].y + offset);
        graphics.lineTo(this.points[0].x + offset, this.points[0].y + offset);
        graphics.lineTo(this.points[1].x + offset, this.points[1].y + offset);
        graphics.lineTo(this.points[2].x + offset, this.points[2].y + offset);
        graphics.lineTo(this.points[3].x + offset, this.points[3].y + offset);
        graphics.closePath();
        graphics.strokePath();
    }
}

class CompositeRectPolygon {
    constructor(config) {
        this.rects = []
        config.forEach(rectConfig => {
            this.rects.push(new RectPolygon(rectConfig[0], rectConfig[1], rectConfig[2], rectConfig[3]))
        })
    }
    setPosition(x, y) {
        this.rects.forEach(rect => {
            rect.setPosition(x, y)
        })
    }

    rotate(rotation) {
        this.rects.forEach(rect => {
            rect.rotate(rotation)
        })
    }

    draw(graphics,offset){
        this.rects.forEach(rect => {
            rect.draw(graphics, offset)
        })
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
    CirclePolygon,
    CompositeRectPolygon
}