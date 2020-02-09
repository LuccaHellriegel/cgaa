import { BossBarrier } from "../env/BossBarrier";
import { PhaserStaticFactory } from "../base/PhaserStaticFactory";
import { Point } from "../base/types";
export class BarrierFactory extends PhaserStaticFactory {
	produce(positions: Point[]) {
		positions.forEach(pos => {
			new BossBarrier(this.scene, pos.x, pos.y, this.physicsGroup);
		});
	}
}
