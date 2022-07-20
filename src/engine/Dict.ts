import { Point } from "./types-geom";

abstract class Dict {
  dict = {};
  constructor(obj: any[][]) {
    obj.forEach((vals) => this.set(vals[0], vals[1]));
  }
  protected abstract toID(idparams): string;
  abstract get(idParams);
  abstract set(idParams, value);
}

export class RealDict extends Dict {
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

export class UnitDict extends Dict {
  protected toID(_: any): string {
    throw new Error("Method should not be used.");
  }

  get(id: string) {
    return this.dict[id];
  }
  set(id: string, unit: any) {
    this.dict[id] = unit;
  }

  destroy() {
    Object.values(this.dict).forEach((val) => val.destroy());
  }
}
