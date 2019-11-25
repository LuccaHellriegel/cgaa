import {
    expect
} from "chai"
import {
    ArrowHeadPolygon
} from "../js/polygon/ArrowHeadPolygon"

describe('Find centerPoint of ArrowHead', function () {
    it('When creating an arrowHead with height 21 and width 42, the center is at (21,10.5)', () => {
        let arrowHeadPolygon = new ArrowHeadPolygon(21,10.5,42,21)
        let centerPoint = arrowHeadPolygon.calculateCenterPoint()
        expect(centerPoint).to.deep.equal([21,10.5]);
    })
})