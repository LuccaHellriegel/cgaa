import {
    expect
} from "chai"

import {
    CompositePolygon
} from "../js/polygon/CompositePolygon"
import { Point } from "../js/polygon/Point";

describe("Test CompositePolygon", function () {

describe("Move singular CompositePolygon", function () {
    it('When the singular CompositePolygon is moved 10 pixels to the right, its centerPoint is 10 pixels to the right', () => {
        let compositePolygon = new CompositePolygon([
            [5, 5, 10, 10, "rect"]
        ])
        let oldCenterPoint = compositePolygon.calculateCenterPoint()
        let newCenterPoint = [oldCenterPoint[0]+10,oldCenterPoint[1]]

        compositePolygon.setPosition(10+5, 0+5)

        expect(compositePolygon.calculateCenterPoint()).to.deep.equal(newCenterPoint);
       
    });
    it('When the singular CompositePolygon is rotated 180 degrees, it is top down', () => {
        let compositePolygon = new CompositePolygon([
            [0, 0, 10, 64, "rect"]
        ])
        let oldPoints = compositePolygon.polygons[0].points
        compositePolygon.rotate(180 * (Math.PI / 180))
        expect(compositePolygon.polygons[0].points[0]).to.deep.equal(oldPoints[2]);
        expect(compositePolygon.polygons[0].points[1]).to.deep.equal(oldPoints[3]);
        expect(compositePolygon.polygons[0].points[2]).to.deep.equal(oldPoints[0]);
        expect(compositePolygon.polygons[0].points[3]).to.deep.equal(oldPoints[1]);
    });
    it('When the singular CompositePolygon is moved 10 pixels to the right, its points are 10 pixels to the right', () => {
        let compositePolygon = new CompositePolygon([
            [5, 5, 10, 10, "rect"]
        ])
        let oldPoints = compositePolygon.polygons[0].points
        let newPoints: Point[] = []
        oldPoints.forEach(point => {
            let newPoint: Point = {x: point.x + 10, y: point.y}
            newPoints.push(newPoint)
        });
        compositePolygon.setPosition(10+5, 0+5)
        expect(compositePolygon.polygons[0].points[0]).to.deep.equal(newPoints[0]);
        expect(compositePolygon.polygons[0].points[1]).to.deep.equal(newPoints[1]);
        expect(compositePolygon.polygons[0].points[2]).to.deep.equal(newPoints[2]);
        expect(compositePolygon.polygons[0].points[3]).to.deep.equal(newPoints[3]);
    });
    it('When the singular CompositePolygon is moved 10 pixels to the right and rotated 180 degrees, its center is 10 pixels to the right and it is top down', () => {
        let compositePolygon = new CompositePolygon([
            [5, 5, 10, 10, "rect"]
        ])
        let oldPoints = compositePolygon.polygons[0].points
        let newPoints : Point[] = []
        oldPoints.forEach(point => {
            let newPoint: Point = {x: point.x + 10, y: point.y}
            newPoints.push(newPoint)
        });
        compositePolygon.setPosition(10+5, 0+5)
        compositePolygon.rotate(180 * (Math.PI / 180))
        expect(compositePolygon.polygons[0].points[0]).to.deep.equal(newPoints[2]);
        expect(compositePolygon.polygons[0].points[1]).to.deep.equal(newPoints[3]);
        expect(compositePolygon.polygons[0].points[2]).to.deep.equal(newPoints[0]);
        expect(compositePolygon.polygons[0].points[3]).to.deep.equal(newPoints[1]);
    });
})

describe("Move dual CompositePolygon", function () {
    it('When the dual CompositePolygon is moved 10 pixels to the right, its points are 10 pixels to the right', () => {
        let compositePolygon = new CompositePolygon([
            [5, 5, 10, 10, "rect"], [10, 10, 20, 10, "rect"]
        ])
        let oldPoints = compositePolygon.polygons[0].points
        let newPointsOne: Point[] = []
        oldPoints.forEach(point => {
            let newPoint: Point = {x: point.x + 10, y: point.y}
            newPointsOne.push(newPoint)
        });

        oldPoints = compositePolygon.polygons[1].points
        let newPointsTwo: Point[] = []
        oldPoints.forEach(point => {
            let newPoint: Point = {x: point.x + 10, y: point.y}
            newPointsTwo.push(newPoint)
        });

        compositePolygon.setPosition(10+compositePolygon.centerX, compositePolygon.centerY)
        expect(compositePolygon.polygons[0].points).to.deep.equal(newPointsOne);
        expect(compositePolygon.polygons[1].points).to.deep.equal(newPointsTwo);

    });

})

})