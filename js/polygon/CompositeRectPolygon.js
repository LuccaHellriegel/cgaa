import collision from "polygon-collision";
import {
    RectPolygon
} from "./RectPolygon";
export class CompositeRectPolygon {
    constructor(config) {
        this.rects = [];
        config.forEach(rectConfig => {
            this.rects.push(new RectPolygon(rectConfig[0], rectConfig[1], rectConfig[2], rectConfig[3]));
        });
    }

    getFirstRectXY() {
        let firstX = this.rects[0].x
        let firstY = this.rects[0].y
        return {firstX,firstY}
    }

    setPosition(x, y) {
        //first rect is the anchor point for all the rects
        let {firstX, firstY} = this.getFirstRectXY()
        let diffX = x - firstX;
        let diffY = y - firstY;

        this.rects[0].setPosition(x, y)

        for (let index = 1; index < this.rects.length; index++) {
            let rect = this.rects[index];
            rect.setPosition(rect.x + diffX, rect.y + diffY);
        }
    }

    rotate(rotation) {
        let {firstX, firstY} = this.getFirstRectXY()
        for (let index = 0; index < this.rects.length; index++) {
            let rect = this.rects[index];
            rect.rotateWithCenter(rotation, firstX, firstY);
        }
    }

    draw(graphics, offset) {
        this.rects.forEach(rect => {
            rect.draw(graphics, offset);
        });
    }
    
    checkForCollision(other) {
        for (let index = 0; index < this.rects.length; index++) {
            if (collision(this.rects[index], other.polygon))
                return true;
        }
        return false;
    }
}