// import { Circle } from "../unit/Circle";
// import { listenToAnim } from "../base/listen";

// export const chainWeaponConfig = {
// 	Small: { amount: 5 },
// 	Normal: { amount: 10 },
// 	Big: { amount: 20 },
// };

// export class ChainWeapons extends Phaser.Physics.Arcade.Group {
// 	constructor(scene, private ownerSize, private ownerSizeName, amount) {
// 		super(scene.physics.world, scene);

// 		this.createMultiple({
// 			frameQuantity: amount,
// 			key: ownerSizeName + "chainWeapon",
// 			active: false,
// 			visible: false,
// 			classType: ChainWeapon,
// 		});

// 		this.getChildren().forEach((child) => (child as Phaser.Physics.Arcade.Sprite).disableBody());
// 	}

// 	placeWeapon(x, y) {
// 		let weapon: ChainWeapon = this.getFirstDead(true);
// 		weapon.init(x, y, this.ownerSize, this.ownerSizeName);
// 		return weapon;
// 	}
// }

// export class ChainWeapon extends Phaser.Physics.Arcade.Sprite {
// 	alreadyAttacked: string[] = [];
// 	attacking: boolean = false;
// 	amount: number;
// 	owner: Circle;
// 	ownerSize: any;

// 	constructor(scene, x, y, texture) {
// 		super(scene, x, y, texture);
// 		listenToAnim(this, { animComplete: true, attackComplete: this.finishAttack.bind(this) });
// 	}

// 	finishAttack() {
// 		this.anims.play("idle-" + this.texture.key);
// 		this.attacking = false;
// 		this.alreadyAttacked = [];
// 	}

// 	init(x, y, ownerSize, ownerSizeName) {
// 		this.ownerSize = ownerSize;
// 		this.amount = chainWeaponConfig[ownerSizeName].amount;
// 		// we do not need the body but need rotation and velocity
// 		this.setActive(true).setVisible(true).setPosition(x, y);
// 	}

// 	setOwner(owner) {
// 		this.owner = owner;
// 	}

// 	toggle() {
// 		if (this.visible) {
// 			this.setVisible(false);
// 		} else {
// 			this.setVisible(true);
// 		}
// 	}
// }
