// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const Players = {
  "O": "O",
  "X": "X"
};

const { Game } = initSchema(schema);

export {
  Game,
  Players
};