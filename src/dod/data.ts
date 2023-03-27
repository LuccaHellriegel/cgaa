type State = {
  entityCounter: number;
  campEntities: number[];
  attacking: number[];
  weaponOverlap_Overlapper: number[];
  weaponOverlap_Overlapped: number[];
  attackedEntities: number[];
  attackingEntities: number[];
  damage: number[];
  killedEntities: number[];
};

export const state: State = {
  entityCounter: 0,
  campEntities: [],
  attacking: [],
  weaponOverlap_Overlapper: [],
  weaponOverlap_Overlapped: [],
  attackedEntities: [],
  attackingEntities: [],
  damage: [],
  killedEntities: [],
};

export function getNextEntityId(): number {
  state.entityCounter++;
  return state.entityCounter;
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
      if (state.campEntities[attacker] !== state.campEntities[overlapped]) {
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
