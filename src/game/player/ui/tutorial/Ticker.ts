import { Box } from "./Box";
import { Waiter, listenable } from "./Waiter";

export class Ticker {
	private index = 0;
	private waiters: Waiter[] = [];

	constructor(private box: Box, private contentArr: any[], eventList: any[], listenList: listenable[]) {
		for (let index = 0; index < eventList.length; index++) {
			this.waiters.push(new Waiter(listenList[index], eventList[index], this));
		}
	}

	tick() {
		if (this.index == this.contentArr.length) {
			this.box.destroy();
			return;
		}

		this.box.draw(this.contentArr[this.index]);
		let oldIndex = this.index;
		this.index++;
		this.waiters[oldIndex].activate();
	}
}
