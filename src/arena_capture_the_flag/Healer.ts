import { Creep } from "game/prototypes";
import { getRange } from "game/utils";
import { flee } from "utils/flee";
import { ICreep } from "./main";
import { CreepRole } from "./Role";
import { State } from "./State";

export class HealerCreep extends Creep implements ICreep {
  public constructor(creep: Creep) {
    super(creep.id);
    this.role = CreepRole.HEALER;
  }

  public run(state: State): void {
    const targets = state.myCreeps.filter(i => i !== this && i.hits < i.hitsMax).sort((a, b) => a.hits - b.hits);

    if (targets.length) {
      this.moveTo(targets[0]);
    } else {
      if (state.enemyFlag) {
        this.moveTo(state.enemyFlag);
      }
    }

    const healTargets = state.myCreeps.filter(i => getRange(i, this) <= 3).sort((a, b) => a.hits - b.hits);

    if (healTargets.length > 0) {
      if (getRange(healTargets[0], this) === 1) {
        this.heal(healTargets[0]);
      } else {
        this.rangedHeal(healTargets[0]);
      }
    }

    const range = 7;
    const enemiesInRange = state.enemyCreeps.filter(i => getRange(i, this) < range);
    if (enemiesInRange.length > 0) {
      flee(this, enemiesInRange, range);
    }

    if (state.enemyFlag) {
      this.moveTo(state.enemyFlag);
    }
  }
}
