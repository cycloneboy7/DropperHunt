const makeItems = (category, variations, correctVariants = []) =>
  variations.map(([variant, label, frame]) => ({
    id: `${category}_${variant}`,
    label,
    frame,
    correct: correctVariants.includes(variant),
  }));

const caps = makeItems('cap', [
  ['black', 'Black Cap', 'cap_black.png'],
  ['red', 'Red Cap', 'cap_red.png'],
  ['white', 'White Cap', 'cap_white.png'],
  ['blue', 'Blue Cap', 'cap_blue.png'],
  ['beige', 'Beige Cap', 'cap_beige.png'],
  ['green', 'Green Cap', 'cap_green.png'],
]);

const jackets = makeItems('jacket', [
  ['black', 'Black Jacket', 'jacket_black.png'],
  ['red', 'Red Jacket', 'jacket_red.png'],
  ['denim', 'Denim Jacket', 'jacket_denim.png'],
  ['yellow', 'Yellow Jacket', 'jacket_yellow.png'],
  ['tactical', 'Tactical Jacket', 'jacket_tactical.png'],
  ['white', 'White Jacket', 'jacket_white.png'],
]);

const hair = makeItems('hair', [
  ['black', 'Black Hair', 'hair_black.png'],
  ['brown', 'Brown Hair', 'hair_brown.png'],
  ['blonde', 'Blonde Hair', 'hair_blonde.png'],
  ['red', 'Red Hair', 'hair_red.png'],
  ['white', 'White Hair', 'hair_white.png'],
  ['curly', 'Curly Hair', 'hair_curly.png'],
], ['black']);

const glasses = makeItems('glasses', [
  ['black', 'Black Glasses', 'glasses_black.png'],
  ['round', 'Round Glasses', 'glasses_round.png'],
  ['sunglasses', 'Sunglasses', 'glasses_sunglasses.png'],
  ['white', 'White Glasses', 'glasses_white.png'],
  ['visor', 'Blue Visor', 'glasses_visor.png'],
  ['yellow', 'Yellow Glasses', 'glasses_yellow.png'],
], ['black']);

const hoodies = makeItems('hoodie', [
  ['blue', 'Blue Hoodie', 'hoodie_blue.png'],
  ['black', 'Black Hoodie', 'hoodie_black.png'],
  ['white', 'White Hoodie', 'hoodie_white.png'],
  ['red', 'Red Hoodie', 'hoodie_red.png'],
  ['green', 'Green Hoodie', 'hoodie_green.png'],
  ['purple', 'Purple Hoodie', 'hoodie_purple.png'],
], ['blue']);

export const CHARACTER = {
  name: 'Alex',

  identities: [
    ...hair.filter(item => item.correct),
    ...glasses.filter(item => item.correct),
    ...hoodies.filter(item => item.correct),
  ],

  distractors: [
    ...caps,
    ...jackets,
    ...hair.filter(item => !item.correct),
    ...glasses.filter(item => !item.correct),
    ...hoodies.filter(item => !item.correct),
  ],
};
