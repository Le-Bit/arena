import { ICreep, MyCreep } from "./MyCreep";
import { Creep } from "game/prototypes";
import { CreepRole } from "./Role";
import { getRange } from "game/utils";

export class MeleeCreep extends MyCreep implements ICreep {
  public constructor(creep: Creep) {
    super(creep.id, CreepRole.MELEE, { x: creep.x, y: creep.y });
  }

  public run(): void {
    this.savePosition();

    const targets = this.acquireTargets();

    if (targets.length > 0) {
      this.attackTarget(targets[0]);
    } else {
      this.fallbackToSavedPosition();
    }
  }

  private savePosition(): void {
    if (!this.initialPos) {
      this.initialPos = { x: this.x, y: this.y };
    }
  }

  private acquireTargets(): Creep[] {
    return this.state.enemyCreeps
      .filter(i => getRange(i, this.initialPos) < 10)
      .sort((a, b) => getRange(a, this) - getRange(b, this));
  }

  private attackTarget(target: Creep): void {
    this.moveTo(target);
    this.attackTarget(target);
  }

  private fallbackToSavedPosition(): void {
    this.moveTo(this.initialPos);
  }
}
