/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-underscore-dangle */
import { Flag } from "arena/prototypes";
import { ATTACK, HEAL, RANGED_ATTACK } from "game/constants";
import { Creep, StructureTower } from "game/prototypes";
import { getObjectsByPrototype, getTicks } from "game/utils";
import { healer } from "./Healer";
import { meleeAttack } from "./MeleeAttacker";
import { rangedAttacker } from "./RangedAttacker";
import { CreepRole } from "./Role";
import { towerControl } from "./Tower";

export class State {
  private _myCreeps: Creep[];
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
    this._myCreeps = getObjectsByPrototype(Creep).filter(i => i.my);
    this._enemyCreeps = getObjectsByPrototype(Creep).filter(i => !i.my);
    this._enemyFlag = getObjectsByPrototype(Flag).find(i => !i.my)!;
    this._myTowers = getObjectsByPrototype(StructureTower).filter(i => i.my);

    this._myCreeps.forEach(creep => {
      if (creep.body.some(i => i.type === ATTACK)) {
        creep.role = CreepRole.MELEE;
      }
      if (creep.body.some(i => i.type === RANGED_ATTACK)) {
        creep.role = CreepRole.RANGED;
      }
      if (creep.body.some(i => i.type === HEAL)) {
        creep.role = CreepRole.HEALER;
      }
    });
  }

  public run(): void {
    this._myCreeps = this._myCreeps.filter(i => i.exists);
    this._enemyCreeps = this._enemyCreeps.filter(i => i.exists);

    if (getTicks() % 10 === 0) {
      console.log(`I have ${this._myCreeps.length} creeps`);
    }

    this._myCreeps.forEach(creep => {
      if (creep.role === CreepRole.MELEE) {
        meleeAttack(this, creep);
      }
      if (creep.role === CreepRole.RANGED) {
        rangedAttacker(this, creep);
      }
      if (creep.role === CreepRole.HEALER) {
        healer(this, creep);
      }
    });

    this._myTowers.forEach(tower => {
      towerControl(tower);
    });
  }
}

// let state: State;
//
// function stateManager() {
//   const diagMapSize = enemyFlag.getRangeTo({ x: myFlag.x, y: myFlag.y });
//   const closestEnemy = Math.min(...enemyCreeps.map(creep => creep.getRangeTo({ x: myFlag.x, y: myFlag.y })));
//
//   if (closestEnemy <= 15) setupGoalie();
// }

// function setupGoalie() {
//   return;
// }
