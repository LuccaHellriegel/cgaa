export class AttackManager {
  //Attacked
  healths: number[] = [];
  defaultHealths: number[] = [];
  damages: number[] = [];
  //Attacker
  attackFactor: number[] = [];

  execute() {
    for (let index = 0; index < this.healths.length; index++) {
      this.healths[index] = Math.max(
        0,
        this.healths[index] - this.damages[index]
      );
      this.damages[index] = 0;
    }
  }

  startAttacking(attackerNumber: number) {
    this.attackFactor[attackerNumber] = 1;
  }

  attack(attackerNumber: number, healthNumber: number, damage: number) {
    this.damages[healthNumber] += damage * this.attackFactor[attackerNumber];
    this.attackFactor[attackerNumber] = 0;
  }

  registerAttacker() {
    this.attackFactor.push(0);
    return this.attackFactor.length - 1;
  }

  registerHealth(defaultHealth: number) {
    this.healths.push(defaultHealth);
    this.defaultHealths.push(defaultHealth);
    this.damages.push(0);
    return this.healths.length - 1;
  }

  resetHealth(healthNumber: number) {
    this.healths[healthNumber] = this.defaultHealths[healthNumber];
  }
}

//make damage
//no friendly fire
//no damage if still in anim
//
