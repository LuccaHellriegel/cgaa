import { removeEle } from "../../../../base/utils";

export class InteractionElements {
	private elements = [];

	addElement(element) {
		this.elements.push(element);
	}

	removeElement(element) {
		removeEle(element, this.elements);
	}
}
