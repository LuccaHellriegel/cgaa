import {
    expect
} from "chai"

import {
    CompositePolygon
} from "../js/polygon/CompositePolygon"

describe("Move CompositePolygon", function () {
    it('When the singular CompositePolygon is moved 10 pixels to the right, its centerPoint is 10 pixels to the right', () => {
        let rectPolygon = new CompositePolygon([
            [5, 5, 10, 10, "rect"]
        ])
        let oldCenterPoint = rectPolygon.calculateCenterPoint()
        let newCenterPoint = [oldCenterPoint[0]+10,oldCenterPoint[1]]

        rectPolygon.setPosition(10+5, 0+5)

        expect(rectPolygon.calculateCenterPoint()).to.deep.equal(newCenterPoint);
       
    });
    it('When the singular CompositePolygon is rotated 180 degrees, it is top down', () => {
        let rectPolygon = new CompositePolygon([
            [0, 0, 10, 64, "rect"]
        ])
        let oldPoints = rectPolygon.polygons[0].points
        rectPolygon.rotate(180 * (Math.PI / 180))
        expect(rectPolygon.polygons[0].points[0]).to.deep.equal(oldPoints[2]);
        expect(rectPolygon.polygons[0].points[1]).to.deep.equal(oldPoints[3]);
        expect(rectPolygon.polygons[0].points[2]).to.deep.equal(oldPoints[0]);
        expect(rectPolygon.polygons[0].points[3]).to.deep.equal(oldPoints[1]);
    });
    it('When the singular CompositePolygon is moved 10 pixels to the right, its points are 10 pixels to the right', () => {
        let rectPolygon = new CompositePolygon([
            [5, 5, 10, 10, "rect"]
        ])
        let oldPoints = rectPolygon.polygons[0].points
        let newPoints = []
        oldPoints.forEach(point => {
            let newPoint = {}
            newPoint.x = point.x + 10
            newPoint.y = point.y
            newPoints.push(newPoint)
        });
        rectPolygon.setPosition(10+5, 0+5)
        expect(rectPolygon.polygons[0].points[0]).to.deep.equal(newPoints[0]);
        expect(rectPolygon.polygons[0].points[1]).to.deep.equal(newPoints[1]);
        expect(rectPolygon.polygons[0].points[2]).to.deep.equal(newPoints[2]);
        expect(rectPolygon.polygons[0].points[3]).to.deep.equal(newPoints[3]);
    });
    it('When the singular CompositePolygon is moved 10 pixels to the right and rotated 180 degrees, its center is 10 pixels to the right and it is top down', () => {
        let rectPolygon = new CompositePolygon([
            [5, 5, 10, 10, "rect"]
        ])
        let oldPoints = rectPolygon.polygons[0].points
        let newPoints = []
        oldPoints.forEach(point => {
            let newPoint = {}
            newPoint.x = point.x + 10
            newPoint.y = point.y
            newPoints.push(newPoint)
        });
        rectPolygon.setPosition(10+5, 0+5)
        rectPolygon.rotate(180 * (Math.PI / 180))
        expect(rectPolygon.polygons[0].points[0]).to.deep.equal(newPoints[2]);
        expect(rectPolygon.polygons[0].points[1]).to.deep.equal(newPoints[3]);
        expect(rectPolygon.polygons[0].points[2]).to.deep.equal(newPoints[0]);
        expect(rectPolygon.polygons[0].points[3]).to.deep.equal(newPoints[1]);
    });
})
