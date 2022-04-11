/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-underscore-dangle */
import { ATTACK, HEAL, RANGED_ATTACK } from "game/constants";
import { Creep, StructureTower } from "game/prototypes";
import { Flag } from "arena/prototypes";
import { HealerCreep } from "../creeps/Healer";
import { ICreep } from "../creeps/MyCreep";
import { MeleeCreep } from "../creeps/MeleeAttacker";
import { RangedCreep } from "../creeps/RangedAttacker";
import { Tower } from "../towers/Tower";
import { getObjectsByPrototype } from "game/utils";

export class State {
  private _myCreeps: ICreep[];
  private _enemyCreeps: Creep[];
  // private _myFlag: Flag;
  private _enemyFlag: Flag;
  private _myTowers: Tower[];

  public get enemyCreeps(): Creep[] {
    return this._enemyCreeps;
  }

  public get myCreeps(): ICreep[] {
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
    const myCreeps = getObjectsByPrototype(Creep).filter(i => i.my);
    this._enemyCreeps = getObjectsByPrototype(Creep).filter(i => !i.my);
    this._enemyFlag = getObjectsByPrototype(Flag).find(i => !i.my)!;
    const myTowers = getObjectsByPrototype(StructureTower).filter(i => i.my);

    this._myCreeps = myCreeps.reduce((creeps: ICreep[], creep: Creep) => {
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

    this._myTowers = myTowers.map(tower => new Tower(tower.id));
  }

  public run(): void {
    this._myCreeps = this._myCreeps.filter(i => i.exists);
    this._enemyCreeps = this._enemyCreeps.filter(i => i.exists);

    this._myCreeps.forEach(creep => {
      creep.run(this);
    });

    this._myTowers.forEach(tower => {
      tower.run();
    });
  }
}
