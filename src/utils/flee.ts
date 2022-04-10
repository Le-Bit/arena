import Creep from "arena_capture_the_flag/Creep";
import { GameObject } from "game/prototypes";
import { getDirection } from "game/utils";
import { searchPath } from "game/path-finder";

export function flee(creep: Creep, targets: GameObject[], range: number) {
  const result = searchPath(
    creep,
    targets.map(i => ({ pos: i, range })),
    { flee: true }
  );
  if (result.path.length > 0) {
    const direction = getDirection(result.path[0].x - creep.x, result.path[0].y - creep.y);
    creep.move(direction);
  }
}
