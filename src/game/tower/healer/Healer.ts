import { Tower } from "../Tower";
import { Gameplay } from "../../../scenes/Gameplay";
import { Player } from "../../unit/Player";
import { Pool } from "../../pool/Pool";
import { TowerSetup } from "../../setup/TowerSetup";
import { RectPolygon } from "../../polygons/RectPolygon";

export class HollowRectPoylgon extends RectPolygon {
	draw(graphics, offset) {
		graphics.beginPath();
		graphics.moveTo(this.points[0].x + offset, this.points[0].y + offset);
		for (let index = 0; index < this.points.length; index++) {
			graphics.lineTo(this.points[index].x + offset, this.points[index].y + offset);
		}
		graphics.closePath();
		graphics.strokePath();
	}
}

export class Healer extends Tower {
	healIntervalID: number;
	graphics: Phaser.GameObjects.Graphics;
	auraPolygon: HollowRectPoylgon;

	constructor(scene: Gameplay, x, y, physicsGroup, private player: Player, private pools: Pool[]) {
		super(scene, x, y, "healer", physicsGroup);
		this.graphics = scene.add.graphics({});
		this.auraPolygon = new HollowRectPoylgon(x, y, TowerSetup.towerDistance, TowerSetup.towerDistance);
		this.type = "Healer";
	}

	damage(amount: number) {
		if (this.healthbar.decrease(amount)) {
			this.poolDestroy();
		}
	}

	inDistance(unit) {
		return Phaser.Math.Distance.Between(this.x, this.y, unit.x, unit.y) < TowerSetup.towerDistance;
	}

	healUnits() {
		this.pools.forEach(pool =>
			pool.getActiveUnits().forEach(unit => {
				if (this.inDistance(unit)) {
					unit.heal(TowerSetup.singleHealAmount);
				}
			})
		);

		if (this.inDistance(this.player)) this.player.heal(TowerSetup.singleHealAmount);
	}

	deactivate() {
		if (this.healIntervalID) clearInterval(this.healIntervalID);
	}

	activate() {
		this.healIntervalID = setInterval(this.healUnits.bind(this), 1500);
	}

	redraw() {
		this.graphics.lineStyle(4, 0xa9a9a9);
		this.auraPolygon.draw(this.graphics, 0);
	}

	poolDestroy() {
		this.scene.events.emit("inactive-" + this.id, this.id);
		this.disableBody(true, true);
		this.setPosition(-1000, -1000);
		this.healthbar.bar.setActive(false).setVisible(false);
		this.healthbar.value = this.healthbar.defaultValue;
		this.deactivate();
		this.graphics.clear();
	}

	poolActivate(x, y) {
		this.enableBody(true, x, y, true, true);
		this.healthbar.bar.setActive(true).setVisible(true);
		this.healthbar.move(x, y);
		this.activate();
		this.auraPolygon.setPosition(x, y);
		this.redraw();
	}
}
