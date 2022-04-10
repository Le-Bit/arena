import { Creep, StructureTower } from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";

export function towerControl(tower: StructureTower) {
  const target = tower.findClosestByRange(getObjectsByPrototype(Creep).filter(i => !i.my));
  if (!target) return;

  if (tower.getRangeTo(target) <= 5) {
    tower.attack(target);
  }
}
