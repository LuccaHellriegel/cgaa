function rotateRect(points,centerPoint,rotation) {
    //we want clockwise rotation
    //TODO: why does this now lead to correct rotation on screen but wrong one (counter-clockwise) in the test?
    //rotation = -rotation  

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

function rotateWeaponToUnit(unit){
    let point = Phaser.Math.RotateAround(new Phaser.Geom.Point(unit.x + 30, unit.y - 30), unit.x, unit.y, unit.rotation)
    unit.weapon.setPosition(point.x, point.y)
    unit.weapon.setRotation(unit.rotation)
    unit.weapon.updatePolygon()
}

module.exports = {
    rotateRect, findRectCenter, rotateWeaponToUnit
}