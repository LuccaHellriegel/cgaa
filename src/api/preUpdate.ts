// experiment

export type preChild = {
	childPreUpdate: Function;
};

type preUpdateList = string[];

export type preParent = {
	preUpdate: Function;
	parentPreUpdate: Function;
	preUpdateList: preUpdateList;
	parentPreUpdateBefore: boolean;
};

export function initPreUpdate(preObj: preParent) {
	let preUpdateList = preObj.preUpdateList;

	let callString = "";

	if (preObj.parentPreUpdateBefore) {
		callString += "this.parentPreUpdate();";
	}

	for (let preChildString of preUpdateList) {
		if (!preObj[preChildString] || !preObj[preChildString].childPreUpdate)
			throw preChildString + " not correctly configured on" + preObj;
		callString += "this." + preChildString + ".childPreUpdate();";
	}

	if (!preObj.parentPreUpdateBefore) {
		callString += "this.parentPreUpdate();";
	}

	preObj.preUpdate = new Function(callString);
}
