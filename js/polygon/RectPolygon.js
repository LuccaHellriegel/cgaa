import { Polygon } from "./Polygon";
export class RectPolygon extends Polygon {
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
        return [{
            x: x,
            y: y
        }, {
            x: x + width,
            y: y
        },
        {
            x: x + width,
            y: y + height
        }, {
            x: x,
            y: y + height
        }
        ];
    }   

}
