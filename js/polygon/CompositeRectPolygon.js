import collision from "polygon-collision";
import { RectPolygon } from "./RectPolygon";
export class CompositeRectPolygon {
    constructor(config) {
        this.rects = [];
        config.forEach(rectConfig => {
            this.rects.push(new RectPolygon(rectConfig[0], rectConfig[1], rectConfig[2], rectConfig[3]));
        });
    }
    //first rect is the anchor point for all the rects
    setPosition(x, y) {
        let diffX;
        let diffY;
        for (let index = 0; index < this.rects.length; index++) {
            let rect = this.rects[index];
            if (index == 0) {
                let firstX = rect.x;
                let firstY = rect.y;
                rect.setPosition(x, y);
                diffX = x - firstX;
                diffY = y - firstY;
            }
            else {
                rect.setPosition(rect.x + diffX, rect.y + diffY);
            }
        }
    }
    rotate(rotation) {
        let centerX;
        let centerY;
        for (let index = 0; index < this.rects.length; index++) {
            let rect = this.rects[index];
            if (index == 0) {
                centerX = rect.x;
                centerY = rect.y;
            }
            rect.rotateWithCenter(rotation, centerX, centerY);
        }
    }
    draw(graphics, offset) {
        this.rects.forEach(rect => {
            rect.draw(graphics, offset);
        });
    }
    collision(other) {
        for (let index = 0; index < this.rects.length; index++) {
            if (collision(this.rects[index], other.polygon))
                return true;
        }
        return false;
    }
}
