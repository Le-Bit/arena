/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-underscore-dangle */
import { Flag } from "arena/prototypes";
import { ATTACK, HEAL, RANGED_ATTACK } from "game/constants";
import { Creep, StructureTower } from "game/prototypes";
import { getObjectsByPrototype, getTicks } from "game/utils";
import { HealerCreep } from "./Healer";
import { ICreep } from "./main";
import { MeleeCreep } from "./MeleeAttacker";
import { RangedCreep } from "./RangedAttacker";
import { towerControl } from "./Tower";

export class State {
  private _myCreeps: ICreep[];
  private _enemyCreeps: Creep[];
  // private _myFlag: Flag;
  private _enemyFlag: Flag;
  private _myTowers: StructureTower[];

  public get enemyCreeps(): Creep[] {
    return this._enemyCreeps;
  }

  public get myCreeps(): Creep[] {
    return this._myCreeps;
  }

  public get enemyFlag(): Flag {
    return this._enemyFlag;
  }

  private static instance: State;

  public static getInstance(): State {
    if (!State.instance) {
      State.instance = new State();
    }
    return State.instance;
  }

  public constructor() {
    this._myCreeps = getObjectsByPrototype(Creep).filter(i => i.my) as ICreep[];
    this._enemyCreeps = getObjectsByPrototype(Creep).filter(i => !i.my);
    this._enemyFlag = getObjectsByPrototype(Flag).find(i => !i.my)!;
    this._myTowers = getObjectsByPrototype(StructureTower).filter(i => i.my);

    this._myCreeps = this._myCreeps.reduce((creeps: ICreep[], creep: ICreep) => {
      if (creep.body.some(i => i.type === ATTACK)) {
        return [...creeps, new MeleeCreep(creep)];
      }
      if (creep.body.some(i => i.type === RANGED_ATTACK)) {
        return [...creeps, new RangedCreep(creep)];
      }
      if (creep.body.some(i => i.type === HEAL)) {
        return [...creeps, new HealerCreep(creep)];
      }
      return creeps;
    }, []);
  }

  public run(): void {
    this._myCreeps = this._myCreeps.filter(i => i.exists);
    this._enemyCreeps = this._enemyCreeps.filter(i => i.exists);

    if (getTicks() % 10 === 0) {
      console.log(`I have ${this._myCreeps.length} creeps`);
    }

    this._myCreeps.forEach(creep => {
      creep.run(this);
    });

    this._myTowers.forEach(tower => {
      towerControl(tower);
    });
  }
}
