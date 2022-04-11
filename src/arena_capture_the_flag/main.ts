import { State } from "./state/State";

let state: State;
export function loop(): void {
  state = State.getInstance();
  state.run();
}
