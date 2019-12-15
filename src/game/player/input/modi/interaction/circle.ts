export function interactWithCircle(ele, rivalries, colorKilllist, unitKilllist, scene, interactionElements) {
	let targetColor = rivalries[ele.color];
	if (!colorKilllist.includes(targetColor) && !colorKilllist.includes(ele.color)) {
		colorKilllist.push(targetColor);
		scene.events.emit("added-to-killlist", targetColor);

		for (const key in interactionElements) {
			const element = interactionElements[key];
			if (element.color === targetColor) unitKilllist.push(element);
		}
	}
}
