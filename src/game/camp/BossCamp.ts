import { Enemies } from "../unit/Enemies";
import { CampSetup } from "../setup/CampSetup";
import { CampLike } from "./Camp";
import { Area } from "../env/area/Area";
import { EnvSetup } from "../setup/EnvSetup";
import { Gameplay } from "../../scenes/Gameplay";
import { BossPool } from "../pool/BossPool";
import { CampPopulator } from "../populator/CampPopulator";
import { EnemySpawnObj } from "../spawn/EnemySpawnObj";
import { CircleFactory, WeaponTypes } from "../unit/CircleFactory";
import { BarrierFactory } from "./BarrierFactory";
import { GameMap } from "../env/GameMap";
import { RealAreaSpawnableDict } from "../env/SpawnableDict";

export class BossCamp implements CampLike {
	id = CampSetup.bossCampID;
	constructor(public area: Area, private gameMap: GameMap) {}

	createBarriers(factory: BarrierFactory) {
		let relPositions = this.area.exit.relativePositions
			.map(relPos => relPos.toPoint())
			.map(point => {
				let realTopLeft = this.area.topLeft.toPoint();

				return {
					x: point.x + realTopLeft.x - EnvSetup.halfGridPartSize,
					y: point.y + realTopLeft.y - EnvSetup.halfGridPartSize
				};
			});
		factory.produce(relPositions);
	}

	createKing(factory: CircleFactory) {
		let realTopLeft = this.area.topLeft.toPoint();
		let kingConfig = {
			size: "Big",
			x: (EnvSetup.gridPartSize * this.area.dims.sizeOfXAxis) / 2 + realTopLeft.x,
			y: (EnvSetup.gridPartSize * this.area.dims.sizeOfXAxis) / 2 + realTopLeft.y,
			weaponType: "chain" as WeaponTypes
		};

		factory.createKing(kingConfig);
	}

	populate(scene: Gameplay, pool: BossPool, enemies: Enemies) {
		new CampPopulator(scene, pool, new EnemySpawnObj(new RealAreaSpawnableDict(this.area, this.gameMap), enemies));
	}
}
