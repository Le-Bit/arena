import { Creep } from "game/prototypes";
import { getRange } from "game/utils";
import { ICreep } from "./main";
import { CreepRole } from "./Role";
import { State } from "./State";

export class MeleeCreep extends Creep implements ICreep {
  public constructor(creep: Creep) {
    super(creep.id);
    this.role = CreepRole.MELEE;
  }
  public run(state: State): void {
    if (!this.initialPos) {
      this.initialPos = { x: this.x, y: this.y };
    }

    const targets = state.enemyCreeps
      .filter(i => getRange(i, this.initialPos) < 10)
      .sort((a, b) => getRange(a, this) - getRange(b, this));

    if (targets.length > 0) {
      this.moveTo(targets[0]);
      this.attack(targets[0]);
    } else {
      this.moveTo(this.initialPos);
    }
  }
}
