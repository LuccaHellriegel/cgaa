let shapeWord = {
    line: "line",
    point: "point",
    circle: "circle",
    polygon: "polygon",
};

class RectPolygon {
    constructor(x, y, width, height) {
        this.type = shapeWord.polygon
        this.points = [{
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
        ]
    }

    rotate(angle, unit) {
        let newPoints = []
        this.points.forEach(point => {
            let x1 = point.x - unit.x;
            let y1 = point.y - unit.y;

            let temp_x1 = x1 * Math.cos(angle) - y1 * Math.sin(angle)
            let temp_y1 = x1 * Math.sin(angle) + y1 * Math.cos(angle)
            newPoints.push({
                x: temp_x1 + unit.x,
                y: temp_y1 + unit.y
            })
        });
        this.points = newPoints

    }
}

class CirclePolygon {
    constructor(x, y, radius) {

        this.type = shapeWord.circle
        this.points = [{
            x: x,
            y: y
        }]
        this.r = radius

    }
}

module.exports = {
    RectPolygon,
    CirclePolygon
}