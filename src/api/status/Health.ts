export class Health {
	current: number;

	constructor(private start: number) {
		this.current = start;
	}

	increase(amount: number) {
		let health = this.current + amount;
		if (health >= this.start) {
			this.reset();
			return true;
		} else {
			this.current = health;
		}

		return false;
	}

	decrease(amount: number) {
		let rest = this.current - amount;
		if (rest <= 0) {
			this.current = 0;
			return true;
		}
		this.current = rest;

		return false;
	}

	reset() {
		this.current = this.start;
	}
}
