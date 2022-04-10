import { Creep } from "game/prototypes";
import { CreepRole } from "./Role";
import { State } from "./State";
import { getRange } from "game/utils";

export function meleeAttack(state: State, creep: Creep): void {
  if (!creep.initialPos) {
    creep.initialPos = { x: creep.x, y: creep.y };
  }

  const targets = state.enemyCreeps
    .filter(i => getRange(i, creep.initialPos) < 10)
    .sort((a, b) => getRange(a, creep) - getRange(b, creep));

  if (targets.length > 0) {
    creep.moveTo(targets[0]);
    creep.attack(targets[0]);
  } else {
    creep.moveTo(creep.initialPos);
  }
}

// export class MeleeCreep extends Creep {
//   public constructor(creep: Creep) {
//     super();
//     this.x = creep.x;
//     this.role = CreepRole.MELEE;
//     console.log(this);
//   }
// }
