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
}
