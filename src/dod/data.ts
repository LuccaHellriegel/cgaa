import { CircleControl } from "../ai/CircleControl";
import { Building } from "../camps/Building";
import { EventSetup } from "../config/EventSetup";
import { UnitSetup } from "../config/UnitSetup";
import { HealthBar } from "../healthbar/HealthBar";
import { Tower } from "../towers/Tower";
import { EnemySize } from "../units/CircleFactory";
import { CircleUnit } from "../units/CircleUnit";
import { ChainWeapon } from "../weapons/ChainWeapon";
import { weaponHeights } from "../weapons/chain-weapon-data";

type EntityID = number;
type EntityIDs = EntityID[];
type EntityToValueMap = Record<EntityID, number>;
type EntityToEntityMap = Record<EntityID, EntityID>;

type EntityState = {
  campIDAssignments: Record<EntityID, string>; //TODO: make number
  health: EntityToValueMap;
  weaponDamage: EntityToValueMap;
  attacking: EntityIDs;
  weaponOverlap: EntityToEntityMap;
  damagePairs: [EntityID, EntityID][];
  killedEntities: [EntityID, EntityID][];
  ai: Record<EntityID, CircleControl>;
  entityObjects: Record<EntityID, CircleUnit>; //not 100% type-safe - might not be CircleUnit
  unitSizes: Record<EntityID, EnemySize>;
  healthbars: Record<EntityID, HealthBar>;
};

export const entityState: EntityState = {
  campIDAssignments: {},
  health: {},
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
  entityState.weaponOverlap = {};
  entityState.damagePairs = [];
  entityState.killedEntities = [];
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
  const newAttacking = [];

  for (let i = 0; i < entityState.attacking.length; i++) {
    const attacker = entityState.attacking[i];
    const overlapped = entityState.weaponOverlap[attacker];

    let damaged = false;
    //is attacking and has weapon overlap
    if (overlapped !== undefined) {
      //not the same camp - might need to change this to collab status to disable all friendly fire
      if (
        entityState.campIDAssignments[attacker] !==
        entityState.campIDAssignments[overlapped]
      ) {
        entityState.damagePairs.push([overlapped, attacker]);
        damaged = true;
      }
    }

    //can only do single damage with one attack
    if (!damaged) {
      newAttacking.push(attacker);
    }
  }

  entityState.attacking = newAttacking;
}

export function handleDamages() {
  for (let index = 0; index < entityState.damagePairs.length; index++) {
    const element = entityState.damagePairs[index];
    const attacked = element[0];
    const attacker = element[1];
    const weaponDamage = entityState.weaponDamage[attacker];
    const attackedHealth = entityState.health[attacked];
    const newHealth = attackedHealth - weaponDamage;
    if (newHealth <= 0) {
      entityState.killedEntities.push(element);
    } else {
      //update AI
      const circleControl = entityState.ai[attacked];
      if (circleControl !== undefined) {
        const object = entityState.entityObjects[attacker];
        circleControl.spotted = object;
        circleControl.obstacle = object;
      }
      //update health
      entityState.health[attacked] = newHealth;
      entityState.healthbars[attacked].health.health = newHealth;
      entityState.healthbars[attacked].draw();
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
    const map = entityState[key];
    entityState.killedEntities.forEach((entity) => {
      delete map[entity[0]];
    });
  });
}

export function handlePlayer(scene: Phaser.Scene) {
  for (let index = 0; index < entityState.killedEntities.length; index++) {
    const element = entityState.killedEntities[index];
    const killedBy = element[1];
    if (killedBy === 0) {
      EventSetup.gainSouls(scene, entityState.unitSizes[element[0]]);
    }
  }
}

export function towerBackInPool(tower: Tower) {}

export function registerTower(tower: Tower) {}

export function registerBuilding(building: Building) {}

export function registerCircle(circle: CircleUnit) {
  const entityId = getNextEntityId();
  circle.entityId = entityId;
  entityState.campIDAssignments[entityId] = circle.campID;
  entityState.health[entityId] = circle.healthbar.health.health;
  entityState.weaponDamage[entityId] = circle.weapon.circle.amount;
  if (circle.stateHandler) {
    entityState.ai[entityId] = circle.stateHandler as unknown as CircleControl;
  }
  entityState.entityObjects[entityId] = circle;
  entityState.unitSizes[entityId] = circle.enemySize;
  entityState.healthbars[entityId] = circle.healthbar;
}

export function runSystems(scene: Phaser.Scene) {
  handleAttacks();
  handleDamages();
  handlePlayer(scene);
  handleKilled();
  prepareStateForNextFrame();
}
