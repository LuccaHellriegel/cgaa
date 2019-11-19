import {
    rotateRect
} from "./rotation"
import collision from "polygon-collision";

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
        this.points.forEach((point, index, array) => {
            array[index].x += diffX
            array[index].y += diffY
        })
    }

    setPosition(x, y) {
        let diffX = x - this.x
        let diffY = y - this.y
        this.movePoints(diffX, diffY)
        this.x = x
        this.y = y
    }

    //TODO: rotate weapon around circle polygon, we would save setting the position first
    rotateWithCenter(rotation, centerX, centerY) {
        this.points = rotateRect(this.createPoints(), {
            centerX: centerX,
            centerY: centerY
        }, rotation)
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
    //first rect is the anchor point for all the rects
    setPosition(x, y) {
        let diffX;
        let diffY;
        for (let index = 0; index < this.rects.length; index++) {
            let rect = this.rects[index]
            if (index == 0) {
                let firstX = rect.x
                let firstY = rect.y
                rect.setPosition(x, y)
                diffX = x - firstX
                diffY = y - firstY
            } else {
                rect.setPosition(rect.x+diffX, rect.y+diffY)
            }
        }
    }

    rotate(rotation) {
        let centerX
        let centerY
        for (let index = 0; index < this.rects.length; index++) {
            let rect = this.rects[index]
            if (index == 0) {
                centerX = rect.x
                centerY = rect.y
             } 
            rect.rotateWithCenter(rotation, centerX, centerY)
        }
    }

    draw(graphics, offset) {
        this.rects.forEach(rect => {
            rect.draw(graphics, offset)
        })
    }

    collision(other){
        for (let index = 0; index < this.rects.length; index++) {
            if(collision(this.rects[index], other.polygon)) return true
        }
        return false
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