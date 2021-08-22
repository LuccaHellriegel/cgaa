type ListenConfig = {
	animStartCustom?: Function;
	animUpdateCustom?: Function;
	animComplete?: boolean;
	attackComplete?: Function;
	damageComplete?: Function;
};

export function listenToAnim(gameObject: Phaser.GameObjects.Sprite, config: ListenConfig) {
	if (config.animStartCustom) enableAnimStartCustomListening(gameObject, config.animStartCustom);
	if (config.animUpdateCustom) enableAnimUpdateCustomListening(gameObject, config.animUpdateCustom);
	if (config.animComplete) enableAnimCompleteListening(gameObject);
	if (config.attackComplete) listenToAnimAttackComplete(gameObject, config.attackComplete);
	if (config.damageComplete) listenToAnimDamageComplete(gameObject, config.damageComplete);
}

function enableAnimStartCustomListening(gameObject: Phaser.GameObjects.Sprite, func: Function) {
	gameObject.on("animationstart", func);
}

function enableAnimUpdateCustomListening(gameObject: Phaser.GameObjects.Sprite, func: Function) {
	gameObject.on("animationupdate", func);
}

function enableAnimCompleteListening(gameObject: Phaser.GameObjects.Sprite) {
	gameObject.on(
		"animationcomplete",
		function (anim, frame) {
			gameObject.emit(partialAnimComplete + anim.key, anim, frame);
		},
		gameObject
	);
}

const partialAnimComplete = "animationcomplete_";

function listenToAnimAttackComplete(gameObject: Phaser.GameObjects.Sprite, func: Function) {
	gameObject.on(partialAnimComplete + "attack-" + gameObject.texture.key, func);
}

function listenToAnimDamageComplete(gameObject: Phaser.GameObjects.Sprite, func: Function) {
	gameObject.on(partialAnimComplete + "damage-" + gameObject.texture.key, func);
}
