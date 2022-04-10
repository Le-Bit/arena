import { Creep } from "game/prototypes";
import { getRange } from "game/utils";
import { flee } from "utils/flee";
import { State } from "./State";

export function healer(state: State, creep: Creep): void {
  const targets = state.myCreeps.filter(i => i !== creep && i.hits < i.hitsMax).sort((a, b) => a.hits - b.hits);

  if (targets.length) {
    creep.moveTo(targets[0]);
  } else {
    if (state.enemyFlag) {
      creep.moveTo(state.enemyFlag);
    }
  }

  const healTargets = state.myCreeps.filter(i => getRange(i, creep) <= 3).sort((a, b) => a.hits - b.hits);

  if (healTargets.length > 0) {
    if (getRange(healTargets[0], creep) === 1) {
      creep.heal(healTargets[0]);
    } else {
      creep.rangedHeal(healTargets[0]);
    }
  }

  const range = 7;
  const enemiesInRange = state.enemyCreeps.filter(i => getRange(i, creep) < range);
  if (enemiesInRange.length > 0) {
    flee(creep, enemiesInRange, range);
  }

  if (state.enemyFlag) {
    creep.moveTo(state.enemyFlag);
  }
}
