export let shapeWord = {
    line: "line",
    point: "point",
    circle: "circle",
    polygon: "polygon",
};

export class Polygon {
    constructor(x, y,points) {
        this.type = shapeWord.polygon;
        this.x = x;
        this.y = y;
        this.points = points
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

    draw(graphics, offset) {
        graphics.lineStyle(5, 0xFF00FF, 1.0);
        graphics.beginPath();
        graphics.moveTo(this.points[0].x + offset, this.points[0].y + offset);
        for (let index = 0; index < this.points.length; index++) {
            graphics.lineTo(this.points[index].x + offset, this.points[index].y + offset);
        }
        graphics.closePath();
        graphics.strokePath();
    }
}