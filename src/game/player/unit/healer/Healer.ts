import { Gameplay } from "../../../../scenes/Gameplay";
import { HealerPool } from "./HealerPool";
import { Aura } from "./Aura";
import { Tower } from "../Tower";

//TODO: make this a buyable healing shooter
export class Healer extends Tower {
	private aura: Aura;

	constructor(scene: Gameplay, x, y, physicsGroup, private healingGroup) {
		//TODO: modify texture so its obvious we can only heal down and right
		//TODO: maybe just heal downward? Or maybe better: only right, because of the layout
		super(scene, x, y, "healer", physicsGroup);
		this.initHealing();
	}

	private initHealing() {
		const config = {
			scene: this.scene,
			x: this.x,
			y: this.y,
			texture: "healer",
			physicsGroup: this.healingGroup
		};
		this.aura = new Aura(config);
	}

	damage(amount: number) {
		if (this.healthbar.decrease(amount)) {
			HealerPool.poolDestroy(this);
		}
	}
}
