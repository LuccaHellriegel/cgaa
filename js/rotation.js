function findRectCenter(points) {
    let centerX = (points[0].x + points[2].x) / 2
    let centerY = (points[0].y + points[2].y) / 2
    return {
        centerX: centerX,
        centerY: centerY
    }
}

function rotateRect(points,rotation) {
    //we want clockwise rotation
    rotation = -rotation
    
    let centerPoint = findRectCenter(points)       

    let newPoints = []
    points.forEach(point => {
        let x1 = point.x - centerPoint.centerX;
        let y1 = point.y - centerPoint.centerY;

        let temp_x1 = x1 * Math.cos(rotation) - y1 * Math.sin(rotation)
        let temp_y1 = x1 * Math.sin(rotation) + y1 * Math.cos(rotation)

        //TODO: choose precision on more than intuition?
        let x = Math.round((temp_x1 + centerPoint.centerX + Number.EPSILON) * 10000) / 10000
        let y = Math.round((temp_y1 + centerPoint.centerY + Number.EPSILON) * 10000) / 10000

        if (x == -0) x = 0
        if (y == -0) y = 0

        newPoints.push({
            x: x,
            y: y
        })
    });
    return newPoints
}

module.exports = {
    rotateRect, findRectCenter
}