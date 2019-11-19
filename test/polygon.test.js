let expect = require('chai').expect;
let polygon = require("../js/polygon")
let RectPolygon = polygon.RectPolygon
let CompositeRectPolygon = polygon.CompositeRectPolygon

describe('Polygon for Sprites', function () {
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
    describe("Move CompositeRectPolygon", function () {
        it('When the singular CompositeRectPolygon is rotated 180 degrees, it is top down', () => {
            let rectPolygon = new CompositeRectPolygon([
                [0, 0, 10, 64]
            ])
            let oldPoints = rectPolygon.rects[0].points
            rectPolygon.rotate(180 * (Math.PI / 180))
            expect(rectPolygon.rects[0].points[0]).to.deep.equal(oldPoints[2]);
            expect(rectPolygon.rects[0].points[1]).to.deep.equal(oldPoints[3]);
            expect(rectPolygon.rects[0].points[2]).to.deep.equal(oldPoints[0]);
            expect(rectPolygon.rects[0].points[3]).to.deep.equal(oldPoints[1]);
        });
        it('When the singular CompositeRectPolygon is moved 10 pixels to the right, its points are 10 pixels to the right', () => {
            let rectPolygon = new CompositeRectPolygon([
                [5, 5, 10, 10]
            ])
            let oldPoints = rectPolygon.rects[0].points
            let newPoints = []
            oldPoints.forEach(point => {
                let newPoint = {}
                newPoint.x = point.x + 10
                newPoint.y = point.y
                newPoints.push(newPoint)
            });
            rectPolygon.setPosition(10+5, 0+5)
            expect(rectPolygon.rects[0].points[0]).to.deep.equal(newPoints[0]);
            expect(rectPolygon.rects[0].points[1]).to.deep.equal(newPoints[1]);
            expect(rectPolygon.rects[0].points[2]).to.deep.equal(newPoints[2]);
            expect(rectPolygon.rects[0].points[3]).to.deep.equal(newPoints[3]);
        });
        it('When the singular CompositeRectPolygon is moved 10 pixels to the right and rotated 180 degrees, its center is 10 pixels to the right and it is top down', () => {
            let rectPolygon = new CompositeRectPolygon([
                [5, 5, 10, 10]
            ])
            let oldPoints = rectPolygon.rects[0].points
            let newPoints = []
            oldPoints.forEach(point => {
                let newPoint = {}
                newPoint.x = point.x + 10
                newPoint.y = point.y
                newPoints.push(newPoint)
            });
            rectPolygon.setPosition(10+5, 0+5)
            rectPolygon.rotate(180 * (Math.PI / 180))
            expect(rectPolygon.rects[0].points[0]).to.deep.equal(newPoints[2]);
            expect(rectPolygon.rects[0].points[1]).to.deep.equal(newPoints[3]);
            expect(rectPolygon.rects[0].points[2]).to.deep.equal(newPoints[0]);
            expect(rectPolygon.rects[0].points[3]).to.deep.equal(newPoints[1]);
        });
    })
});