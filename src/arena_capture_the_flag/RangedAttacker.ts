import { getRange } from "game";
import { Creep } from "game/prototypes";
import { flee } from "utils/flee";
import { ICreep } from "./main";
import { CreepRole } from "./Role";
import { State } from "./State";

export class RangedCreep extends Creep implements ICreep {
  public constructor(creep: Creep) {
    super(creep.id);
    this.role = CreepRole.RANGED;
  }
  public run(state: State) {
    const targets = state.enemyCreeps.sort((a, b) => getRange(a, this) - getRange(b, this));

    if (targets.length > 0) {
      this.rangedAttack(targets[0]);
    }

    if (state.enemyFlag) {
      this.moveTo(state.enemyFlag);
    }

    const range = 3;
    const enemiesInRange = state.enemyCreeps.filter(i => getRange(i, this) < range);
    if (enemiesInRange.length > 0) {
      flee(this, enemiesInRange, range);
    }
  }
}
