import { ElementCollection } from "../player/modi/interaction/ElementCollection";

export class Membership {
	constructor(private elementCollections: ElementCollection[]) {}

	addAll(elements, ...types) {
		types.forEach(type => {
			this.elementCollections.forEach(col => {
				elements.forEach(element => col.addElementIfType(element, type));
			});
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
