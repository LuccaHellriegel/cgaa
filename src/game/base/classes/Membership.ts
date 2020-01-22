import { ElementCollection } from "./ElementCollection";

export class Membership {
	constructor(private elementCollections: ElementCollection[]) {}

	addAll(elements, ...types) {
		elements.forEach(element => {
			this.add(element, ...types);
		});
	}

	add(element, ...types) {
		types.forEach(type => {
			this.elementCollections.forEach(col => col.addElementIfType(element, type));
		});
	}

	remove(element, ...types) {
		types.forEach(type => {
			this.elementCollections.forEach(col => col.removeElementIfType(element, type));
		});
	}
}
