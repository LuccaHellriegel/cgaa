import { RelPos } from "../engine/RelPos";

export function makePathId(start: RelPos, goal: RelPos) {
  return start.row + " " + start.column + " " + goal.row + " " + goal.column;
}
