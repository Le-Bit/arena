import { CreepRole } from "./Role";
import { State } from "./State";


declare module "game/prototypes" {
  // eslint-disable-next-line no-shadow
  interface Creep {
    initialPos: RoomPosition;
    role: CreepRole;
    goalie: boolean;
  }
}

let state: State;
export function loop(): void {
  state = State.getInstance();
  state.run();
}