import { shapeWord } from "./polygon";
export class RectPolygon {
    constructor(x, y, width, height) {
        this.type = shapeWord.polygon;
        //This is the center point
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.points = this.createUnrotatedPoints();
    }

    createUnrotatedPoints() {
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

    rotateRect(rotation, centerX, centerY) { 
        let originalPoints = this.createUnrotatedPoints()  
        let newPoints = []
        originalPoints.forEach(point => {
            let x1 = point.x - centerX;
            let y1 = point.y - centerY;
    
            let temp_x1 = x1 * Math.cos(rotation) - y1 * Math.sin(rotation)
            let temp_y1 = x1 * Math.sin(rotation) + y1 * Math.cos(rotation)
    
            //TODO: choose precision on more than intuition?
            let x = Math.round((temp_x1 + centerX + Number.EPSILON) * 10000) / 10000
            let y = Math.round((temp_y1 + centerY + Number.EPSILON) * 10000) / 10000
    
            if (x == -0) x = 0
            if (y == -0) y = 0
    
            newPoints.push({
                x: x,
                y: y
            })
        });
        this.points = newPoints
    }

    //TODO: rotate weapon around circle polygon, we would save setting the position first
    rotateWithCenter(rotation, centerX, centerY) {
        this.rotateRect(rotation, centerX, centerY)
    }

    rotate(rotation) {
        this.rotateRect(rotation, this.x, this.y)
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
