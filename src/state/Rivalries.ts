import { randomizeArr } from "../utils/randomizeArr";

export function createRivalsMap(ids: string[]) {
  const rivalsMap = new Map<string, string>();
  const randIDs = randomizeArr(ids);

  // only works for four camps
  let id = randIDs.pop();
  let secondID = randIDs.pop();
  rivalsMap.set(id, secondID);
  rivalsMap.set(secondID, id);

  id = randIDs.pop();
  secondID = randIDs.pop();
  rivalsMap.set(id, secondID);
  rivalsMap.set(secondID, id);

  return rivalsMap;
}

export type Rivalries = ReturnType<typeof createRivalsMap>;
