import { Gameplay } from "../../scenes/Gameplay";
import { Weapon } from "../weapons/Weapon";
import { EnemyCircle } from "../enemies/units/EnemyCircle";
import { executeOverAllCamps } from "../../globals/global";

export class Collision {
	player: Phaser.Physics.Arcade.Group;
	playerWeapon: Phaser.Physics.Arcade.Group;
	towers: any;
	enemies: {};
	enemyWeapons: {};
	scene: Gameplay;
	areas: any;
	towerSightGroup: Phaser.Physics.Arcade.StaticGroup;
	towerBulletGroup: Phaser.Physics.Arcade.Group;

	constructor(scene: Gameplay) {
		this.scene = scene;

		this.player = scene.physics.add.group();
		this.playerWeapon = scene.physics.add.group();

		this.towers = scene.physics.add.staticGroup();
		this.towerSightGroup = scene.physics.add.staticGroup();
		this.towerBulletGroup = scene.physics.add.group();

		this.enemies = {};
		this.enemyWeapons = {};
		executeOverAllCamps(color => {
			this.enemies[color] = scene.physics.add.group();
			this.enemyWeapons[color] = scene.physics.add.group();
		});

		this.areas = scene.physics.add.staticGroup();

		this.addCollisionDetection();
	}

	getPhysicGroups() {
		return {
			player: this.player,
			playerWeapon: this.playerWeapon,
			towers: this.towers,
			towerSightGroup: this.towerSightGroup,
			towerBulletGroup: this.towerBulletGroup,

			enemies: this.enemies,
			enemyWeapons: this.enemyWeapons,

			areas: this.areas
		};
	}

	addCollisionDetection() {
		this.addCombatCollision();
		this.addUnitCollision();
		this.addEnvCollider();
		this.addBulletCollision();
	}

	private addWeaponOverlap(weapon, unit) {
		this.addOverlap(weapon, unit, this.doDamage, this.isInSight);
	}

	private addOverlap(first, second, actualCallback, truthyCallback) {
		this.scene.physics.add.overlap(first, second, actualCallback, truthyCallback, this);
	}

	private addBounceCollider(unit, secondUnit) {
		this.addCollider(unit, secondUnit, this.bounceCallback, null);
	}

	private addCollider(first, second, actualCallback, truthyCallback) {
		this.scene.physics.add.collider(first, second, actualCallback, truthyCallback, this);
	}

	private addCombatCollision() {
		let func = color => {
			this.addWeaponOverlap(this.playerWeapon, this.enemies[color]);
			this.addWeaponOverlap(this.enemyWeapons[color], this.player);
			this.addWeaponOverlap(this.enemyWeapons[color], this.towers);
			let secondFunc = secondColor => {
				if (secondColor !== color) this.addWeaponOverlap(this.enemyWeapons[color], this.enemies[secondColor]);
			};
			executeOverAllCamps(secondFunc);
		};
		executeOverAllCamps(func);
	}

	private addUnitCollision() {
		this.addBounceCollider(this.player, this.towers);

		let func = color => {
			this.addBounceCollider(this.player, this.enemies[color]);
			this.addBounceCollider(this.enemies[color], this.player);
			this.addBounceCollider(this.enemies[color], this.towers);
			let secondFunc = secondColor => {
				if (secondColor !== color) this.addBounceCollider(this.enemies[color], this.enemies[secondColor]);
			};
			executeOverAllCamps(secondFunc);
		};
		executeOverAllCamps(func);
	}

	private doDamage(weapon, enemy) {
		weapon.alreadyAttacked.push(enemy.id);
		if (weapon.owner.unitType === "player") this.scene.events.emit("damage-by-player", weapon.amount);

		enemy.damage(weapon.amount);
		enemy.spotted = weapon.owner;
		enemy.state = "guard";
	}

	private doDamageBullet(weapon, enemy) {
		enemy.damage(weapon.amount);
		this.scene.events.emit("damage-by-player", weapon.amount);
		if (enemy.state !== "ambush") {
			enemy.spotted = weapon.owner;
			enemy.state = "guard";
		}
	}

	private isInSight(weapon: Weapon, enemy) {
		if (weapon.attacking && !weapon.alreadyAttacked.includes(enemy.id)) {
			weapon.syncPolygon();
			enemy.syncPolygon();
			let collision = weapon.polygon.checkForCollision(enemy.polygon);
			return collision;
		} else if (weapon.owner.unitType !== "player" && weapon.owner.state !== "ambush") {
			if ((weapon.owner as EnemyCircle).color !== enemy.color) {
				if (weapon.owner.state !== "guard") {
					(weapon.owner as EnemyCircle).spotted = enemy;
					weapon.owner.state = "guard";
				}
			}
		}
		return false;
	}

	private bounceCallback(unit: EnemyCircle, obj) {
		let x = unit.x;
		let y = unit.y;
		let angle = Phaser.Math.Angle.Between(obj.x, obj.y, x, y);

		let bounceBackDistance = 0.5;
		let x1 = x + Math.cos(angle) * bounceBackDistance;
		let y1 = y + Math.sin(angle) * bounceBackDistance;
		unit.setPosition(x1, y1);
		unit.setVelocity(0, 0);

		unit.barrier = obj;
		unit.state = "obstacle";
	}

	private addEnvCollider() {
		this.addBounceCollider(this.player, this.areas);

		let func = color => {
			this.addBounceCollider(this.enemies[color], this.areas);
		};

		executeOverAllCamps(func);
	}

	private addBulletCollision() {
		let func = color => {
			this.addOverlap(
				this.towerSightGroup,
				this.enemies[color],
				(sightElement, enemy) => {
					sightElement.owner.fire(enemy);
				},
				() => true
			);
			this.addCollider(this.towerBulletGroup, this.enemies[color], this.doDamageBullet, () => true);
		};

		executeOverAllCamps(func);
	}
}