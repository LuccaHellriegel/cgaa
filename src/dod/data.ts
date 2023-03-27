type EntityIDs = number[];
type IDAligned = number[];

type EntityState = {
  campIDAssignments: IDAligned;
  health: IDAligned;
  //
  weapon_owner: EntityIDs;
  weapon_damage: number[];
  //
  attacking: EntityIDs;
  //
  weaponOverlap_Overlapper: EntityIDs;
  weaponOverlap_Overlapped: EntityIDs;
  //
  attackedEntities: EntityIDs;
  attackingEntities: EntityIDs;
  //
  killedEntities: EntityIDs;
};

export const entityState: EntityState = {
  campIDAssignments: [],
  health: [],
  weapon_owner: [],
  weapon_damage: [],
  attacking: [],
  weaponOverlap_Overlapper: [],
  weaponOverlap_Overlapped: [],
  attackedEntities: [],
  attackingEntities: [],
  killedEntities: [],
};

type StateProp = keyof EntityState;

const frameSensitiveProps: StateProp[] = [
  "weaponOverlap_Overlapped",
  "weaponOverlap_Overlapper",
  "attackedEntities",
  "attackingEntities",
  "killedEntities",
];

export function prepareStateForNextFrame() {
  frameSensitiveProps.forEach((key) => (entityState[key] = []));
}

export const counterState = {
  entityCounter: 0,
  playerSouls: 200,
};

export function getNextEntityId(campID: number, health: number): number {
  counterState.entityCounter++;
  entityState.campIDAssignments.push(campID);
  entityState.health.push(health);
  return counterState.entityCounter;
}

export function handleAttacks() {
  const newAttacking = [];

  for (let i = 0; i < entityState.attacking.length; i++) {
    const attacker = entityState.attacking[i];
    let overlapperIndex;
    for (let j = 0; j < entityState.weaponOverlap_Overlapper.length; j++) {
      if (entityState.weaponOverlap_Overlapper[j] === attacker) {
        overlapperIndex = j;
        break;
      }
    }
    let damaged = false;
    //is attacking and has weapon overlap
    if (overlapperIndex !== -1) {
      const overlapped = entityState.weaponOverlap_Overlapped[overlapperIndex];
      //not the same camp - might need to change this to collab status to disable all friendly fire
      if (
        entityState.campIDAssignments[attacker] !==
        entityState.campIDAssignments[overlapped]
      ) {
        entityState.attackedEntities.push(overlapped);
        entityState.attackingEntities.push(attacker);
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
  for (let i = 0; i < entityState.attackedEntities.length; i++) {
    const attacker = entityState.attackingEntities[i];
    let attackerWeaponIndex;
    for (let j = 0; j < entityState.weapon_owner.length; j++) {
      if (entityState.weapon_owner[j] === attacker) {
        attackerWeaponIndex = j;
        break;
      }
    }
    const weaponDamage = entityState.weapon_damage[attackerWeaponIndex];
    const attacked = entityState.attackedEntities[i];
    const attackedHealth = entityState.health[attacked];
    const newHealth = attackedHealth - weaponDamage;
    if (newHealth <= 0) {
      entityState.killedEntities.push(attacked);
    } else {
      entityState.health[attacked] = newHealth;
    }
  }
}
