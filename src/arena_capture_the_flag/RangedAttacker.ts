import { getRange } from "game";
import { Creep } from "game/prototypes";
import { flee } from "utils/flee";
import { State } from "./State";

export function rangedAttacker(state: State, creep: Creep) {
  const targets = state.enemyCreeps.sort((a, b) => getRange(a, creep) - getRange(b, creep));

  if (targets.length > 0) {
    creep.rangedAttack(targets[0]);
  }

  if (state.enemyFlag) {
    creep.moveTo(state.enemyFlag);
  }

  const range = 3;
  const enemiesInRange = state.enemyCreeps.filter(i => getRange(i, creep) < range);
  if (enemiesInRange.length > 0) {
    flee(creep, enemiesInRange, range);
  }
}
