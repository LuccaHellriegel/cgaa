import { Gameplay } from "../../../scenes/Gameplay";
import { texture, circlesDrawer } from "../../0_GameBase/engine/phaser";

export function DiplomatSymbolGenerator(scene: Gameplay, radius: number) {
	const name = "diplomat";

	const outerCircle = { color: 0xa9a9a9, x: radius, y: radius, radius: radius };
	const innerCircle = { color: 0x323232, x: radius, y: radius, radius: 2.5 * (radius / 3) };
	const draw = circlesDrawer([outerCircle, innerCircle]);

	const frames = (_) => {
		scene.textures.list[name].add(1, 0, 0, 0, 2 * radius, 2 * radius);
	};

	texture({ scene, name, width: 4 * radius, height: 2 * radius }, { before: draw, after: frames });
}
