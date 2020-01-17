import { Ticker } from "./Ticker";
import { listenable } from "../../../base/interfaces";

export class Waiter {
	constructor(private obj: listenable, private event: string, private parent: Ticker) {}

	activate() {
		let tickback = () => {
			this.parent.tick();
		};
		this.obj.once(this.event, tickback.bind(this));
	}
}
