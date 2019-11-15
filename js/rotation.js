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

function rotatePlayerToMouse(player, cursor, cameras){
    let rotation = Phaser.Math.Angle.Between(player.x, player.y, cursor.x + cameras.main.scrollX, cursor.y + cameras.main.scrollY)
    //Phaser uses degree=0 for the right positon
    //we want degree=0 if mouse is on top
    player.setRotation(rotation + (Math.PI / 180) * 90)
}

function rotateWeaponToUnit(unit){
    let point = Phaser.Math.RotateAround(new Phaser.Geom.Point(unit.x + 30, unit.y - 30), unit.x, unit.y, unit.rotation)
    unit.weapon.setPosition(point.x, point.y)
    unit.weapon.setRotation(unit.rotation)
    unit.weapon.movePolygon()
}

module.exports = {
    rotateRect, findRectCenter, rotatePlayerToMouse, rotateWeaponToUnit
}