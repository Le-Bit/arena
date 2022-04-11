import { ICreep, MyCreep } from "./MyCreep";
import { Creep } from "game/prototypes";
import { CreepRole } from "./Role";
import { getRange } from "game";

export class RangedCreep extends MyCreep implements ICreep {
  private fleeingRange = 3;

  public constructor(creep: Creep) {
    super(creep.id, CreepRole.RANGED, { x: creep.x, y: creep.y });
  }

  public run() {
    const targets = this.acquireTarget();
    if (targets.length > 0) this.rangedAttack(targets[0]);
    this.moveTo(this.state.enemyFlag);
    this.fleeFromEnemies();
  }

  private acquireTarget(): Creep[] {
    return this.state.enemyCreeps.sort((a, b) => getRange(a, this) - getRange(b, this));
  }

  private fleeFromEnemies(): void {
    const enemiesInRange = this.state.enemyCreeps.filter(i => getRange(i, this) < this.fleeingRange);
    if (enemiesInRange.length > 0) {
      this.flee(enemiesInRange, this.fleeingRange);
    }
  }
}
