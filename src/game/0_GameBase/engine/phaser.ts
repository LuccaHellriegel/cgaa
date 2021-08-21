export function addToScene(realObject, scene) {
	scene.add.existing(realObject);
	scene.physics.add.existing(realObject);
}

export function setupCircleBody(circle: Phaser.Physics.Arcade.Image) {
	circle.setCircle(circle.texture.get(0).halfWidth);
}

type TextureConfig = {
	scene: Phaser.Scene;
	name: string;
	width: number;
	height: number;
};

export type TextureChainTuple = [{ name: string; width: number; height: number }, TextureFunctions];

type TextureChainConfigs = TextureChainTuple[];

export function textureChain(scene, configs: TextureChainConfigs) {
	for (const config of configs) {
		texture({ scene, ...config[0] }, config[1]);
	}
}

type TextureFunctions = {
	before?: (graphics: Phaser.GameObjects.Graphics) => any;
	after?: (graphics: Phaser.GameObjects.Graphics) => any;
};

export function texture({ scene, name, width, height }: TextureConfig, { before, after }: TextureFunctions) {
	const graphics = scene.add.graphics({});
	if (before) before(graphics);
	graphics.generateTexture(name, width, height);
	if (after) after(graphics);
	//graphics.destroy();
}

export function circlesDrawer(configs: { color: number; x: number; y: number; radius: number }[]) {
	return (graphics: Phaser.GameObjects.Graphics) => {
		for (const config of configs) {
			const { color, x, y, radius } = config;
			graphics.fillStyle(color);
			graphics.fillCircle(x, y, radius);
		}
	};
}

export function rectsDrawer(configs: { color: number; x: number; y: number; width: number; height: number }[]) {
	return (graphics: Phaser.GameObjects.Graphics) => {
		for (const config of configs) {
			const { color, x, y, width, height } = config;
			graphics.fillStyle(color);
			graphics.fillRect(x, y, width, height);
		}
	};
}

export function emptyRectsDrawer(
	configs: { color: number; x: number; y: number; width: number; height: number; lineWidth: number }[]
) {
	return (graphics: Phaser.GameObjects.Graphics) => {
		for (const config of configs) {
			const { color, x, y, width, height, lineWidth } = config;
			graphics.lineStyle(lineWidth, color);
			graphics.strokeRect(x, y, width, height);
		}
	};
}

export function frameAdder(
	scene: Phaser.Scene,
	name: string,
	configs: { frameName: string | number; sourceIndex?: number; x: number; y: number; width: number; height: number }[]
) {
	return (_) => {
		for (const config of configs) {
			const { frameName, sourceIndex = 0, x, y, width, height } = config;
			scene.textures.list[name].add(frameName, sourceIndex, x, y, width, height);
		}
	};
}
