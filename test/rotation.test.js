let expect = require('chai').expect;
let RectPolygon = require("../js/polygon").RectPolygon
let findRectCenter = require("../js/rotation").findRectCenter

describe('Rotation for Polygons', function () {
it('The center of the 10/10 rectangle should be (5,5)', () => {
    let points =  new RectPolygon(5, 5, 10, 10).points
    let centerPoint = findRectCenter(points)
    expect(centerPoint.centerX).to.equal(5);
    expect(centerPoint.centerY).to.equal(5);
});
})