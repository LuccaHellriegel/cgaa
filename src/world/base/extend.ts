export function extendWithNewId(obj) {
    obj.id =
      "_" +
      Math.random()
        .toString(36)
        .substr(2, 9);
  }
