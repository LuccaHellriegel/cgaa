import { listenable } from "../../../base/interfaces";

export class Waiter {
	constructor(private obj: listenable, private event: string) {}

	activate(confirmation) {
		this.obj.once(this.event, confirmation.confirmCompletion.bind(confirmation));
	}
}
