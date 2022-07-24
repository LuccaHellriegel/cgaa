export interface poolable {
  poolDestroy();
  poolActivate?(x: number, y: number);
  id: string;
}
