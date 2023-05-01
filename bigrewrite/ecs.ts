import { EnemySize } from "./data/EnemySize";
import { HealthBar } from "./gameobjects/HealthBar";
import { Point } from "./geom/Point";
import { ChainWeapon } from "./gameobjects/ChainWeapon";

//Drawing, physics and animation managed by PhaserJS
//PhaserJS objects completely stripped of any Game Logic

export type EntityID = number;
type EntityIDs = EntityID[];
type EntityToValueMap = Record<EntityID, number>;
type EntityToEntityMap = Record<EntityID, EntityID>;

type EntityState = {
  campIDAssignments: Record<EntityID, string>; //TODO: make number
  health: EntityToValueMap;
  weapons: Record<EntityID, ChainWeapon>;
  weaponDamage: EntityToValueMap;
  attacking: EntityIDs;
  weaponOverlap: EntityToEntityMap;
  damagePairs: [EntityID, EntityID][];
  killedEntities: [EntityID, EntityID][];
  ai: any;
  // ai: Record<EntityID, CircleControl>;
  entityObjects: Record<EntityID, Point>;
  unitSizes: Record<EntityID, EnemySize>;
  healthbars: Record<EntityID, HealthBar>;
};

export const components: EntityState = {
  campIDAssignments: {},
  health: {},
  weapons: {},
  weaponDamage: {},
  ai: {},
  entityObjects: {},
  unitSizes: {},
  healthbars: {},
  //TEMP
  damagePairs: [],
  killedEntities: [],
  weaponOverlap: {},
  attacking: [],
};

export function prepareStateForNextFrame() {
  components.weaponOverlap = {};
  components.damagePairs = [];
  components.killedEntities = [];
}

export const counterState = {
  entityCounter: 1,
  playerSouls: 200,
};

export function getNextEntityId(): number {
  counterState.entityCounter++;
  return counterState.entityCounter;
}

export function handleAttacks() {
  const newAttacking: EntityIDs = [];

  for (let i = 0; i < components.attacking.length; i++) {
    const attacker = components.attacking[i];
    const overlapped = components.weaponOverlap[attacker];

    let damaged = false;
    //is attacking and has weapon overlap
    if (overlapped !== undefined) {
      //not the same camp - might need to change this to collab status to disable all friendly fire
      if (
        components.campIDAssignments[attacker] !==
        components.campIDAssignments[overlapped]
      ) {
        components.damagePairs.push([overlapped, attacker]);
        damaged = true;
      }
    }

    //can only do single damage with one attack
    if (!damaged) {
      newAttacking.push(attacker);
    }
  }

  components.attacking = newAttacking;
}

export function handleDamages() {
  for (let index = 0; index < components.damagePairs.length; index++) {
    const element = components.damagePairs[index];
    const attacked = element[0];
    const attacker = element[1];
    const weaponDamage = components.weaponDamage[attacker];
    const attackedHealth = components.health[attacked];
    const newHealth = attackedHealth - weaponDamage;
    if (newHealth <= 0) {
      components.killedEntities.push(element);
    } else {
      //update AI
      const circleControl = components.ai[attacked];
      if (circleControl !== undefined) {
        const object = components.entityObjects[attacker];
        circleControl.spotted = object;
        circleControl.obstacle = object;
      }
      //update health
      components.health[attacked] = newHealth;
      components.healthbars[attacked].draw(
        components.entityObjects[attacked].x,
        components.entityObjects[attacked].y,
        newHealth
      );
    }
  }
}

const entityMaps: (keyof EntityState)[] = [
  "campIDAssignments",
  "health",
  "weaponDamage",
  "ai",
  "entityObjects",
  "unitSizes",
  "healthbars",
];

export function handleKilled() {
  entityMaps.forEach((key) => {
    const map = components[key];
    components.killedEntities.forEach((entity) => {
      delete map[entity[0]];
    });
  });
}

export function handlePlayer(scene: Phaser.Scene) {
  for (let index = 0; index < components.killedEntities.length; index++) {
    const element = components.killedEntities[index];
    const killedBy = element[1];
    if (killedBy === 0) {
      // EventSetup.gainSouls(scene, entityState.unitSizes[element[0]]);
    }
  }
}

export function runSystems(scene: Phaser.Scene) {
  handleAttacks();
  handleDamages();
  handlePlayer(scene);
  handleKilled();
  prepareStateForNextFrame();
}
