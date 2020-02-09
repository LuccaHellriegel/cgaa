import { Gameplay } from "../../scenes/Gameplay";
export abstract class PhaserStaticFactory {
	constructor(protected scene: Gameplay, protected physicsGroup: Phaser.Physics.Arcade.StaticGroup) {}
	abstract produce(postions: any[]);
}
