export class IDCollection {
	collection = {};

	add(id: string, element) {
		this.collection[id] = element;
	}

	remove(id: string) {
		this.collection[id] = undefined;
	}
}
