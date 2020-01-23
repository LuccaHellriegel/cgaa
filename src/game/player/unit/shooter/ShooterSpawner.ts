import { Gameplay } from "../../../../scenes/Gameplay";
import { shooterCost } from "../../../base/globals/globalConfig";
import { SelectorRect } from "../../modi/SelectorRect";
import { spendSouls } from "../../../base/events/player";
import { snapXYToGrid } from "../../../base/position";
import { ShooterSpawnObj } from "../../../base/spawn/ShooterSpawnObj";
import { ShooterPool } from "./ShooterPool";

export class ShooterSpawner {
	private canBuild = false;

	constructor(public scene: Gameplay, public shooterPool: ShooterPool, private shooterSpawnObj: ShooterSpawnObj) {
		scene.events.on("can-build", () => {
			this.canBuild = true;
		});

		scene.events.on("can-not-build", () => {
			this.canBuild = false;
		});
	}

	spawnNewShooter(selectorRect: SelectorRect) {
		if (!this.canBuild) {
			selectorRect.anims.play("invalid-shooter-pos");
			return;
		}
		let x = selectorRect.x;
		let y = selectorRect.y;
		if (!(x < 0 || y < 0)) {
			let snappedXY = snapXYToGrid(x, y);
			x = snappedXY.newX;
			y = snappedXY.newY;

			if (this.shooterSpawnObj.evaluateRealPos(x, y)) {
				spendSouls(this.scene, shooterCost);
				this.shooterPool.pop().activate(x, y);
			} else {
				selectorRect.anims.play("invalid-shooter-pos");
			}
		} else {
			selectorRect.anims.play("invalid-shooter-pos");
		}
	}
}
