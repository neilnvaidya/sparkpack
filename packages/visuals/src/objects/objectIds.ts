/** Object IDs that have a simple SVG drawing in the library (physical items). Ordered by logical category for display. */
export const OBJECT_IDS = [
  // Containers & packages
  'tin_can',
  'cereal_box',
  'bag',
  'box', // cuboid for shape_classify; bag is visual-only
  // Party & treats
  'party_hat',
  'balloon',
  'cupcake',
  'cookie',
  // Fruit & small items
  'apple',
  'orange',
  'marble',
  'banana',
  'pear',
  'strawberry',
  // Nature & sky
  'flower',
  'sun',
  'moon',
  'cloud',
  'tree',
  'star',
  // Animals
  'duck',
  'bird',
  'fish',
  'cat',
  'dog',
  // Vehicles
  'boat',
  'airplane',
  'toy_car',
  'bicycle',
  // Furniture
  'chair',
  'table',
  // Dining
  'cup',
  'bottle',
  // Office / school
  'book',
  'pencil',
  // Keys & lock
  'key',
  'lock',
  // Electronics
  'phone',
  'laptop',
  'camera',
  'clock',
  'lightbulb',
  // Music
  'guitar',
  // Mail & gifts
  'envelope',
  'gift',
  // Outdoor / misc
  'umbrella',
  'flag',
  'button',
  // Buildings
  'house',
] as const;

export type ObjectId = (typeof OBJECT_IDS)[number];
