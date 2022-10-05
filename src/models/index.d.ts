import { ModelInit, MutableModel } from "@aws-amplify/datastore";

export enum Players {
  O = "O",
  X = "X"
}

type GameMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Game {
  readonly id: string;
  readonly playerX: string;
  readonly playerO?: string | null;
  readonly map: string;
  readonly currentPlayer?: Players | keyof typeof Players | null;
  readonly pointsX?: number | null;
  readonly pointsO?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Game, GameMetaData>);
  static copyOf(source: Game, mutator: (draft: MutableModel<Game, GameMetaData>) => MutableModel<Game, GameMetaData> | void): Game;
}