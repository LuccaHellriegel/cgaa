import {
    shapeWord, Polygon
} from "./Polygon";
//TODO: setting x,y seems to be lagging if I use setVelocity for player, try polygon as Image instance with veloctiy or moveTo
export class CirclePolygon extends Polygon {
    constructor(x, y, radius) {
        super(x,y,[{
            x: x,
            y: y
        }])
        this.type = shapeWord.circle;
        this.r = radius;
    }

    createUnrotatedPoints(){
        return this.points
    }

    setPosition(x, y) {
        this.points = [{
            x: x,
            y: y
        }];
        this.x = x
        this.y = y
    }

    checkForCollisonWithOtherCircle(otherCircle){
       let distBetweenCircleCenters =  Phaser.Math.Distance.Between(this.x,this.y,otherCircle.x,otherCircle.y)
        return distBetweenCircleCenters < (this.r+otherCircle.r)
    }

    // toSATFormat(){
    //       return new SAT.Circle(new SAT.Vector(this.x,this.y), this.r);
    // }

    getLowestHighestY(){
        let lowestY = this.y-this.r
        let highestY = this.y+this.r
        return {lowestY,highestY}
    }

    draw(graphics, offset) {
        graphics.fillCircle(this.points[0].x + offset, this.points[0].y + offset, this.r)
    }
}