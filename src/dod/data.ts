let entityCounter = 0;

function nextEntityId() {
  entityCounter++;
  return entityCounter;
}

// CAMP
let campEntities: number[] = [];

// ATTACKING
let attacking: number[] = [];
function registerAsAttacking(entityId: number) {
  attacking.push(entityId);
}

// WEAPON
let weaponOverlap_Overlapper: number[] = [];
let weaponOverlap_Overlapped: number[] = [];

function registerWeaponOverlap(weapon: number, overlapped: number) {
  weaponOverlap_Overlapper.push(weapon);
  weaponOverlap_Overlapped.push(overlapped);
}

// ATTACK
let attackedEntities: number[] = [];
let attackingEntities: number[] = [];

function handleAttacks() {
  const newAttacking = [];

  for (let index = 0; index < attacking.length; index++) {
    const attacker = attacking[index];
    const overlapperIndex = weaponOverlap_Overlapper.findIndex(
      (val) => val === attacker
    );
    let damaged = false;
    //is attacking and has weapon overlap
    if (overlapperIndex !== -1) {
      const overlapped = weaponOverlap_Overlapped[overlapperIndex];
      //not the same camp - might need to change this to collab status to disable all friendly fire
      if (campEntities[attacker] !== campEntities[overlapped]) {
        attackedEntities.push(overlapped);
        attackingEntities.push(attacker);
        damaged = true;
      }
    }

    //can only do single damage with one attack
    if (!damaged) {
      newAttacking.push(attacker);
    }
  }

  attacking = newAttacking;
}

// DAMAGE
//aligned with ATTACK
let damage: number[] = [];

// KILL
let killedEntities: number[] = [];
