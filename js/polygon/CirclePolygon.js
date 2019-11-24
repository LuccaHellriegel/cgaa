import {
    shapeWord
} from "./Polygon";
//TODO: setting x,y seems to be lagging if I use setVelocity for player, try polygon as Image instance with veloctiy
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

    getLowestHighestY(){
        let lowestY = this.y-this.r
        let highestY = this.y+this.r
        return {lowestY,highestY}
    }

    draw(graphics, offset) {
        graphics.fillCircle(this.points[0].x + offset, this.points[0].y + offset, this.r)
    }
}