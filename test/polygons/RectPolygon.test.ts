import {
    expect
} from "chai"
import {
    RectPolygon
} from "../../src/polygons/RectPolygon";
import { Point } from "../../src/polygons/Point";

describe("Test RectPolygon", function () {

describe('Rotate RectPolygon', function () {
    it('When the RectPolygon is rotated 180 degrees, it is top down', () => {
        let rectPolygon = new RectPolygon(5, 5, 10, 10)
        let oldPoints = rectPolygon.points
        rectPolygon.rotate(180 * (Math.PI / 180))
        expect(rectPolygon.points[0]).to.deep.equal(oldPoints[2]);
        expect(rectPolygon.points[1]).to.deep.equal(oldPoints[3]);
        expect(rectPolygon.points[2]).to.deep.equal(oldPoints[0]);
        expect(rectPolygon.points[3]).to.deep.equal(oldPoints[1]);
    });
    it('When the RectPolygon is rotated 180 degrees twice, it is still top down (starting from original shape each time)', () => {
        let rectPolygon = new RectPolygon(5, 5, 10, 10)
        let oldPoints = rectPolygon.points
        rectPolygon.rotate(180 * (Math.PI / 180))
        rectPolygon.rotate(180 * (Math.PI / 180))
        expect(rectPolygon.points[0]).to.deep.equal(oldPoints[2]);
        expect(rectPolygon.points[1]).to.deep.equal(oldPoints[3]);
        expect(rectPolygon.points[2]).to.deep.equal(oldPoints[0]);
        expect(rectPolygon.points[3]).to.deep.equal(oldPoints[1]);
    });
    it('When the RectPolygon is rotated 90 degrees, it is sideways', () => {
        let rectPolygon = new RectPolygon(5, 5, 10, 10)
        let oldPoints = rectPolygon.points
        rectPolygon.rotate(90 * (Math.PI / 180))
        expect(rectPolygon.points[0]).to.deep.equal(oldPoints[1]);
        expect(rectPolygon.points[1]).to.deep.equal(oldPoints[2]);
        expect(rectPolygon.points[2]).to.deep.equal(oldPoints[3]);
        expect(rectPolygon.points[3]).to.deep.equal(oldPoints[0]);
    });
});

describe("Move RectPolygon", function () {
    it("When the RectPolygon is moved 10 pixels to the right, the points are also moved that way", () => {
        let rectPolygon = new RectPolygon(5, 5, 10, 10)
        let oldPoints = rectPolygon.points
        let newPoints: Point[] = []
        oldPoints.forEach(point => {
            let newPoint: Point = {x: point.x + 10, y: point.y}
            newPoints.push(newPoint)
        });
        rectPolygon.setPosition(10 + 5, 0 + 5)
        expect(rectPolygon.points[0]).to.deep.equal(newPoints[0]);
        expect(rectPolygon.points[1]).to.deep.equal(newPoints[1]);
        expect(rectPolygon.points[2]).to.deep.equal(newPoints[2]);
        expect(rectPolygon.points[3]).to.deep.equal(newPoints[3]);
    })
})

})