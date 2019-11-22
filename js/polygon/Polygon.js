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
}