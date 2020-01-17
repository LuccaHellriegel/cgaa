import { Ticker } from "./Ticker";

export interface listenable {
	once(event: any, callback: Function);
}

export class Waiter {
	constructor(private obj: listenable, private event: string, private parent: Ticker) {}

	activate() {
		let tickback = () => {
			this.parent.tick();
		};
		this.obj.once(this.event, tickback.bind(this));
	}
}
