import { CircleGenerator } from "./generator/unit/CircleGenerator";
import { HealerGenerator } from "./generator/unit/HealerGenerator";
import { InteractionCircleGenerator } from "./generator/unit/InteractionCircleGenerator";
import { BuildingGenerator } from "./generator/unit/BuildingGenerator";
import { RectGenerator } from "./generator/RectGenerator";
import { SelectorRectGenerator } from "./generator/SelectorRectGenerator";
import { BossGenerator } from "./generator/unit/BossGenerator";
import { KingGenerator } from "./generator/unit/KingGenerator";
import { UnitSetup } from "../../game/setup/UnitSetup";
import { EnvSetup } from "../../game/setup/EnvSetup";
import { CampSetup } from "../../game/setup/CampSetup";

function generatePlayerUnits(scene) {
	new CircleGenerator(0x6495ed, scene, "blueCircle", UnitSetup.normalCircleRadius);
	new HealerGenerator(scene);
	new RectGenerator(
		scene,
		0x013220,
		"shooter",
		EnvSetup.halfGridPartSize,
		EnvSetup.halfGridPartSize,
		EnvSetup.gridPartSize,
		EnvSetup.gridPartSize
	);
	new RectGenerator(
		scene,
		0x013220,
		"sellshooter",
		EnvSetup.halfGridPartSize,
		EnvSetup.halfGridPartSize,
		EnvSetup.gridPartSize,
		EnvSetup.gridPartSize
	);
	new RectGenerator(
		scene,
		0x013220,
		"upgradeshooter",
		EnvSetup.halfGridPartSize,
		EnvSetup.halfGridPartSize,
		EnvSetup.gridPartSize,
		EnvSetup.gridPartSize
	);

	new SelectorRectGenerator(scene);
}

function generateEnemyUnits(scene) {
	CampSetup.campIDs.forEach(id => {
		if (id !== CampSetup.bossCampID) {
			UnitSetup.circleSizeNames.forEach(circleSizeName => {
				let title = id + circleSizeName + "Circle";
				new CircleGenerator(CampSetup.colorDict[id], scene, title, UnitSetup.sizeDict[circleSizeName]);

				title = id + circleSizeName + "Building";
				new BuildingGenerator(scene, title, CampSetup.colorDict[id], circleSizeName);
			});
			let title = id + "InteractionCircle";
			new InteractionCircleGenerator(CampSetup.colorDict[id], scene, title, UnitSetup.smallCircleRadius);
		}
	});

	let title = "bossCircle";
	new BossGenerator(scene, title);

	title = "kingCircle";
	new KingGenerator(scene, title);
}

export function generateUnits(scene) {
	generatePlayerUnits(scene);
	generateEnemyUnits(scene);
}
