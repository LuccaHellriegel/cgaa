// experiment

interface pre {
	pre: Function;
}

type preUpdateList = pre[];

interface preable {
	preUpdate: Function;
	preUpdateList: preUpdateList;
}

export function initPreUpdate(pre: preable) {
	let preUpdateList = pre.preUpdateList;
	let preUpdate = pre.preUpdate.bind(pre);
	let newPreUpdate = createPreUpdate(0, preUpdateList.length - 1, preUpdateList, function (callback) {
		preUpdate();
		callback();
	});
	pre.preUpdate = newPreUpdate;
}

function createPreUpdate(index, lastIndex, preUpdateList: preUpdateList, func) {
	if (index > lastIndex)
		return function () {
			func(function () {});
		};

	let curPre = preUpdateList[index];
	let curFunc = function (callback) {
		func(curPre.pre.bind(curPre));
		callback();
	};

	index++;
	return createPreUpdate(index, lastIndex, preUpdateList, curFunc);
}
