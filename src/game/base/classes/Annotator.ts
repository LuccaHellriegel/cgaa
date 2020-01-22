export class Annotator {
	private constructor() {}

	private static annotateRestArgBased(unit, args) {
		if (args.includes("id"))
			unit.id =
				"_" +
				Math.random()
					.toString(36)
					.substr(2, 9);

		if (args.includes("animcomplete"))
			unit.on(
				"animationcomplete",
				function(anim, frame) {
					unit.emit("animationcomplete_" + anim.key, anim, frame);
				},
				unit
			);
		if (args.includes("immovable")) unit.setImmovable(true);
	}

	static annotateConfigBased(unit, config, ...args) {
		if (config.scene) config.scene.add.existing(unit);
		if (config.physicsGroup) config.physicsGroup.add(unit);
		if (args) this.annotateRestArgBased(unit, args);
	}

	static annotate(unit, ...args) {
		return this.annotateRestArgBased(unit, args);
	}
}
