export interface IEventHandler {
  on(event: string, func: Function);
  once(event: string, func: Function);
  off(event: string, func?: Function);
  emit(event: string, payload?: any);
}
