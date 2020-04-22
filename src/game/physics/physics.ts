import { Gameplay } from "../../scenes/Gameplay";
import { addBulletCollision } from "./collision-bullet";
import { addSightOverlap } from "./overlap-sight";
import { addBounceCollision } from "./collision-bounce";
import { Cooperation } from "../state/Cooperation";
import { addWeaponOverlap } from "./overlap-weapon";
import { addBasicCollision } from "./collision-basic";
import { createPhysicsGroups } from "./groups";

export function addCollision(scene: Gameplay, cooperation: Cooperation) {
	let physicsGroups = createPhysicsGroups(scene);

	addBasicCollision(scene, physicsGroups);
	addBounceCollision(scene, physicsGroups, cooperation);

	//addSightOverlap(scene, physicsGroups, cooperation);
	//addWeaponOverlap(scene, physicsGroups);

	addBulletCollision(scene, physicsGroups);

	return physicsGroups;
}
