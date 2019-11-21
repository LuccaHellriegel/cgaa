import { shapeWord } from "./polygon";
export class CirclePolygon {
    constructor(x, y, radius) {
        this.type = shapeWord.circle;
        this.points = [{
            x: x,
            y: y
        }];
        this.r = radius;
    }

    setPosition(x,y){
        this.points = [{
            x: x,
            y: y
        }];
    }

    draw(graphics, offset){
        graphics.lineStyle(5, 0xFF00FF, 1.0);
        graphics.beginPath();
        graphics.moveTo(this.x+offset, this.y+offset);
        graphics.fillCircle(this.x, this.y, this.r)
        graphics.closePath();
        graphics.strokePath();
    }
}
