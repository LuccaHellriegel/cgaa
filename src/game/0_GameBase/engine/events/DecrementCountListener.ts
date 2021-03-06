import { IEventHandler } from "./IEventHandler";

export class DecrementCountListener {
	constructor(
		private handler: IEventHandler,
		private decrementEvent: string,
		private count: number,
		private payloadCheck: Function,
		private finalCallback: Function
	) {
		handler.on(decrementEvent, this.decrement.bind(this));
	}

	decrement(payload?) {
		if (this.payloadCheck(payload)) {
			this.count--;
			if (this.count == 0) {
				this.handler.off(this.decrementEvent, this.decrement.bind(this));
				this.finalCallback();
			}
		}
	}
}
