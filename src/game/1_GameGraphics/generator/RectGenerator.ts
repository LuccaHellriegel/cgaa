import { Gameplay } from "../../../scenes/Gameplay";

export function RectGenerator(scene: Gameplay, hexColor, textureName, centerX, centerY, width, height) {
	const graphics = scene.add.graphics({
		fillStyle: {
			color: hexColor,
		},
	});
	graphics.fillRect(centerX - width / 2, centerY - height / 2, width, height);
	graphics.generateTexture(textureName, width, height);
}
