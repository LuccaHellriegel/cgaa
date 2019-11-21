import { rotateRect } from "../rotation";
import { shapeWord } from "./polygon";
export class RectPolygon {
    constructor(x, y, width, height) {
        this.type = shapeWord.polygon;
        //This is the center point
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.points = this.createPoints();
    }
    createPoints() {
        let x = this.x - (this.width / 2);
        let y = this.y - (this.height / 2);
        let width = this.width;
        let height = this.height;
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
        ];
    }
    movePoints(diffX, diffY) {
        this.points.forEach((point, index, array) => {
            array[index].x += diffX;
            array[index].y += diffY;
        });
    }
    setPosition(x, y) {
        let diffX = x - this.x;
        let diffY = y - this.y;
        this.movePoints(diffX, diffY);
        this.x = x;
        this.y = y;
    }
    //TODO: rotate weapon around circle polygon, we would save setting the position first
    rotateWithCenter(rotation, centerX, centerY) {
        this.points = rotateRect(this.createPoints(), {
            centerX: centerX,
            centerY: centerY
        }, rotation);
    }
    rotate(rotation) {
        this.points = rotateRect(this.createPoints(), {
            centerX: this.x,
            centerY: this.y
        }, rotation);
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
