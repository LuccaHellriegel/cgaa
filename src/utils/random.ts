export function randomizeArr(arr) {
  const order = [...arr];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = order[i];
    order[i] = order[j];
    order[j] = temp;
  }
  return order;
}
