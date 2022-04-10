import { Creep, RoomPosition } from "game/prototypes";
export default interface myCreep extends Creep {
  initialPos: RoomPosition;
  goalie: boolean;
}
