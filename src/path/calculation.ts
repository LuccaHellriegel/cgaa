import { MultiPosPath } from "./configuration";
import { RelPos } from "../engine/RelPos";
import { makePathId } from "./makePathId";
import EasyStar from "easystarjs";
import { Point } from "../engine/Point";

export type PathDict = Record<string, Path>;

function calculatePath(
  easyStar: EasyStar.js,
  start: RelPos,
  goal: RelPos
): RelPos[] {
  const tempStart = start;
  const tempGoal = goal;

  let tempArr: Point[] = [];
  easyStar.findPath(
    start.column,
    start.row,
    goal.column,
    goal.row,
    function callback(path) {
      if (path === null) {
        throw (
          "Path was not found. " +
          tempStart.column +
          " " +
          tempStart.row +
          " " +
          tempGoal.column +
          " " +
          tempGoal.row
        );
      } else {
        tempArr = path;
      }
    }.bind(this)
  );
  easyStar.enableSync();
  easyStar.calculate();
  //EasyStar uses x,y and outputs x,y reverse
  let outputArr = tempArr.map((pos: Point) => new RelPos(pos.y, pos.x));
  return outputArr;
}

const createPath = (pathArr: RelPos[]) => {
  return {
    pathArr,
    realPathArr: pathArr.map((pos) => pos.toPoint()),
  };
};

export type Path = ReturnType<typeof createPath>;

function filterDoubledPos(result: RelPos[]) {
  return result.filter(
    (pos, index, arr) =>
      pos.column !== arr[index + 1]?.column || pos.row !== arr[index + 1]?.row
  );
}

export function producePaths(
  easyStar: EasyStar.js,
  configs: MultiPosPath[]
): PathDict {
  let pathDict: PathDict = {};
  while (configs.length !== 0) {
    let config = configs.pop();
    let result: RelPos[] = [];
    let way = [config.start, ...config.waypoints, config.goal];
    while (way.length !== 0) {
      let start = way.shift();
      let goal = way.shift();

      let path: Path = pathDict[makePathId(start, goal)];
      if (!path) {
        let pathArr = calculatePath(easyStar, start, goal);
        path = createPath(pathArr);
        pathDict[makePathId(start, goal)] = path;
      }

      result = result.concat(path.pathArr);

      //Last goal does not need to be added again
      if (way.length !== 0) way.unshift(goal);
    }

    pathDict[makePathId(config.start, config.goal)] = createPath(
      filterDoubledPos(result)
    );
  }
  return pathDict;
}
