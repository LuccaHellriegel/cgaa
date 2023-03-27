type EntityIDs = number[];
type IDAligned = number[];

type State = {
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

let entityCounter = 0;
export const state: State = {
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

type StateProp = keyof State;

const frameSensitiveProps: StateProp[] = [
  "weaponOverlap_Overlapped",
  "weaponOverlap_Overlapper",
  "attackedEntities",
  "attackingEntities",
  "killedEntities",
];

export function prepareStateForNextFrame() {
  frameSensitiveProps.forEach((key) => (state[key] = []));
}

export function getNextEntityId(campID: number, health: number): number {
  entityCounter++;
  state.campIDAssignments.push(campID);
  state.health.push(health);
  return entityCounter;
}

export function handleAttacks() {
  const newAttacking = [];

  for (let index = 0; index < state.attacking.length; index++) {
    const attacker = state.attacking[index];
    const overlapperIndex = state.weaponOverlap_Overlapper.findIndex(
      (val) => val === attacker
    );
    let damaged = false;
    //is attacking and has weapon overlap
    if (overlapperIndex !== -1) {
      const overlapped = state.weaponOverlap_Overlapped[overlapperIndex];
      //not the same camp - might need to change this to collab status to disable all friendly fire
      if (
        state.campIDAssignments[attacker] !==
        state.campIDAssignments[overlapped]
      ) {
        state.attackedEntities.push(overlapped);
        state.attackingEntities.push(attacker);
        damaged = true;
      }
    }

    //can only do single damage with one attack
    if (!damaged) {
      newAttacking.push(attacker);
    }
  }

  state.attacking = newAttacking;
}

export function handleDamages() {
  for (let index = 0; index < state.attackedEntities.length; index++) {
    const attacker = state.attackingEntities[index];
    const attackerWeaponIndex = state.weapon_owner.findIndex(
      (val) => val === attacker
    );
    const weaponDamage = state.weapon_damage[attackerWeaponIndex];
    const attacked = state.attackedEntities[index];
    const attackedHealth = state.health[attacked];
    const newHealth = attackedHealth - weaponDamage;
    if (newHealth <= 0) {
      state.killedEntities.push(attacked);
    } else {
      state.health[attacked] = newHealth;
    }
  }
}
