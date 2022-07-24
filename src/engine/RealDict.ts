import { Point } from "./Point";

export class RealDict {
  dict = {};
  constructor(obj: any[][]) {
    obj.forEach((vals) => this.set(vals[0], vals[1]));
  }

  protected toID(point: Point) {
    return point.x + " " + point.y;
  }
  get(point: Point) {
    return this.dict[this.toID(point)];
  }
  set(point: Point, value) {
    this.dict[this.toID(point)] = value;
  }

  static fromDict(dict) {
    let real = new RealDict([]);
    real.dict = dict;
    return real;
  }
}
