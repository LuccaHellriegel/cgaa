import {
    shapeWord
} from "./Polygon";
export class CirclePolygon {
    constructor(x, y, radius) {
        this.type = shapeWord.circle;
        this.points = [{
            x: x,
            y: y
        }];
        this.x = x
        this.y = y
        this.r = radius;
    }

    setPosition(x, y) {
        this.points = [{
            x: x,
            y: y
        }];
        this.x = x
        this.y = y
    }

    draw(graphics, offset) {
        graphics.fillStyle(0xFF00FF);
        graphics.fillCircle(this.points[0].x + offset, this.points[0].y + offset, this.r)
    }
}