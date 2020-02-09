export class RandomOrder {
	order;

	constructor(arr) {
		this.initRandom(arr);
	}

	private initRandom(arr) {
		this.order = [...arr];
		for (let i = this.order.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * i);
			const temp = this.order[i];
			this.order[i] = this.order[j];
			this.order[j] = temp;
		}
	}
}
