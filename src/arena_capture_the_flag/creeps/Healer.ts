import { ICreep, MyCreep } from "./MyCreep";
import { Creep } from "game/prototypes";
import { CreepRole } from "./Role";
import { getRange } from "game/utils";

export class HealerCreep extends MyCreep implements ICreep {
  public constructor(creep: Creep) {
    super(creep.id, CreepRole.HEALER, { x: creep.x, y: creep.y });
  }

  public run(): void {
    const targets = this.state.myCreeps.filter(i => i !== this && i.hits < i.hitsMax).sort((a, b) => a.hits - b.hits);

    if (targets.length) {
      this.moveTo(targets[0]);
    } else {
      this.moveTo(this.state.enemyFlag);
    }

    const healTargets = targets.filter(i => getRange(i, this) <= 3).sort((a, b) => a.hits - b.hits);

    if (healTargets.length > 0) {
      if (getRange(healTargets[0], this) === 1) {
        this.heal(healTargets[0]);
      } else {
        this.rangedHeal(healTargets[0]);
      }
    }

    const range = 7;
    const enemiesInRange = this.state.enemyCreeps.filter(i => getRange(i, this) < range);
    if (enemiesInRange.length > 0) {
      this.flee(enemiesInRange, range);
    }

    this.moveTo(this.state.enemyFlag);
  }
}
