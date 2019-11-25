import { Polygon } from "./Polygon";
export class ArrowHeadPolygon extends Polygon{
    width: number;
    height: number;

    constructor(x, y, width, height) {
        super(x,y,[])
        this.width = width;
        this.height = height;
        this.points = this.createUnrotatedPoints()
    }

    createUnrotatedPoints() {
        let x = this.x - (this.width / 2);
        let y = this.y - (this.height / 2);
        let width = this.width;
        let height = this.height;

        let ceilThirdWidth = Math.ceil(width/3)
        let arrowLegLength = ceilThirdWidth
        let emptySpaceBetweenLegs = (width - 2*ceilThirdWidth)

        let bottomLeft = {x:x, y:y+height}
        let bottomLeftMiddle = {x:x+arrowLegLength,y:y+height}
        
        let bottomTop = {x:x+arrowLegLength+(emptySpaceBetweenLegs/2),y:y+height-Math.floor(height/3)}

        let bottomRightMiddle = {x:x+arrowLegLength+emptySpaceBetweenLegs, y:y+height}
        let bottomRight = {x:x+arrowLegLength+emptySpaceBetweenLegs+arrowLegLength, y:y+height}

        let top = {x:x+(width/2), y:y}     
              
        return [bottomLeft,bottomLeftMiddle,bottomTop,bottomRightMiddle, bottomRight,top];
    } 

}