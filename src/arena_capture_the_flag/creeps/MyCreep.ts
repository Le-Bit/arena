import { Creep, GameObject, Id, RoomPosition } from "game/prototypes";
import { CreepRole } from "./Role";
import { State } from "../state/State";
import { getDirection } from "game";
import { searchPath } from "game/path-finder";

export interface ICreep extends Creep {
  role: CreepRole;
  run: (arg0: State) => void;
  initialPos: RoomPosition;
}

export abstract class MyCreep extends Creep implements ICreep {
  public role: CreepRole;
  public initialPos: RoomPosition;
  protected state: State;

  public constructor(id: Id<Creep>, role: CreepRole, roomPos: RoomPosition) {
    super(id);
    this.role = role;
    this.initialPos = roomPos;
    this.state = State.getInstance();
  }

  public abstract run(): void;

  public flee(targets: GameObject[], range: number) {
    const result = searchPath(
      this,
      targets.map(i => ({ pos: i, range })),
      { flee: true }
    );
    if (result.path.length > 0) {
      const direction = getDirection(result.path[0].x - this.x, result.path[0].y - this.y);
      this.move(direction);
    }
  }
}
