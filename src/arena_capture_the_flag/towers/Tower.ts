import { Creep, Id, StructureTower } from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";

export class Tower extends StructureTower {
  public constructor(id: Id<StructureTower>) {
    super(id);
  }

  public run() {
    const target = this.findClosestByRange(getObjectsByPrototype(Creep).filter(i => !i.my));
    if (!target) return;

    if (this.getRangeTo(target) <= 5) {
      this.attack(target);
    }
  }
}
