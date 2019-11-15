let expect = require('chai').expect;
let RectPolygon = require("../js/polygon").RectPolygon

describe('Polygon for Sprites', function () {
    describe('Rotate RectPolygon', function () {
        it('When the RectPolygon is rotated 180 degrees, it is top down', () => {
            let rectPolygon = new RectPolygon(0, 0, 10, 10)
            let oldPoints = rectPolygon.points
            rectPolygon.rotate(180 * (Math.PI / 180))
            expect(rectPolygon.points[0]).to.deep.equal(oldPoints[2]);
            expect(rectPolygon.points[1]).to.deep.equal(oldPoints[3]);
            expect(rectPolygon.points[2]).to.deep.equal(oldPoints[0]);
            expect(rectPolygon.points[3]).to.deep.equal(oldPoints[1]);
        });
        it('When the RectPolygon is rotated 180 degrees twice, it is back at the start', () => {
            let rectPolygon = new RectPolygon(0, 0, 10, 10)
            let oldPoints = rectPolygon.points
            rectPolygon.rotate(180 * (Math.PI / 180))
            rectPolygon.rotate(180 * (Math.PI / 180))
            expect(rectPolygon.points[0]).to.deep.equal(oldPoints[0]);
            expect(rectPolygon.points[1]).to.deep.equal(oldPoints[1]);
            expect(rectPolygon.points[2]).to.deep.equal(oldPoints[2]);
            expect(rectPolygon.points[3]).to.deep.equal(oldPoints[3]);
        });
        it('When the RectPolygon is rotated 90 degrees four times, it is back at the start', () => {
            let rectPolygon = new RectPolygon(0, 0, 10, 10)
            let oldPoints = rectPolygon.points
            for (let index = 0; index < 4; index++) {
                rectPolygon.rotate(90 * (Math.PI / 180))               
            }
            expect(rectPolygon.points[0]).to.deep.equal(oldPoints[0]);
            expect(rectPolygon.points[1]).to.deep.equal(oldPoints[1]);
            expect(rectPolygon.points[2]).to.deep.equal(oldPoints[2]);
            expect(rectPolygon.points[3]).to.deep.equal(oldPoints[3]);
        });
        it('When the RectPolygon is rotated 45 degrees eight times, it is back at the start', () => {
            let rectPolygon = new RectPolygon(0, 0, 10, 10)
            let oldPoints = rectPolygon.points
            for (let index = 0; index < 8; index++) {
                rectPolygon.rotate(45 * (Math.PI / 180))               
            }
            expect(rectPolygon.points[0]).to.deep.equal(oldPoints[0]);
            expect(rectPolygon.points[1]).to.deep.equal(oldPoints[1]);
            expect(rectPolygon.points[2]).to.deep.equal(oldPoints[2]);
            expect(rectPolygon.points[3]).to.deep.equal(oldPoints[3]);
        });
        it('When the RectPolygon is rotated 43 degrees eight times followed by 16 degrees, it is back at the start', () => {
            let rectPolygon = new RectPolygon(0, 0, 10, 10)
            let oldPoints = rectPolygon.points
            for (let index = 0; index < 8; index++) {
                rectPolygon.rotate(43 * (Math.PI / 180))               
            }
            rectPolygon.rotate(16 * (Math.PI / 180))  
            expect(rectPolygon.points[0]).to.deep.equal(oldPoints[0]);
            expect(rectPolygon.points[1]).to.deep.equal(oldPoints[1]);
            expect(rectPolygon.points[2]).to.deep.equal(oldPoints[2]);
            expect(rectPolygon.points[3]).to.deep.equal(oldPoints[3]);
        });
        it('When the RectPolygon is rotated 90 degrees, it is sideways', () => {
            let rectPolygon = new RectPolygon(0, 0, 10, 10)
            let oldPoints = rectPolygon.points
            rectPolygon.rotate(90 * (Math.PI / 180))
            expect(rectPolygon.points[0]).to.deep.equal(oldPoints[3]);
            expect(rectPolygon.points[1]).to.deep.equal(oldPoints[0]);
            expect(rectPolygon.points[2]).to.deep.equal(oldPoints[1]);
            expect(rectPolygon.points[3]).to.deep.equal(oldPoints[2]);
        });
    });
});