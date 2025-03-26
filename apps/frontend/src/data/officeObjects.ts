export interface OfficeObject {
  type: string;
  position: { x: number; y: number };
  width: number;
  height: number;
}

// Define office layout with various objects
export const officeObjects: OfficeObject[] = [
  // Desks area
  { type: "desk", position: { x: 5, y: 5 }, width: 2, height: 1 },
  { type: "desk", position: { x: 8, y: 5 }, width: 2, height: 1 },
  { type: "desk", position: { x: 11, y: 5 }, width: 2, height: 1 },
  { type: "desk", position: { x: 5, y: 8 }, width: 2, height: 1 },
  { type: "desk", position: { x: 8, y: 8 }, width: 2, height: 1 },
  { type: "desk", position: { x: 11, y: 8 }, width: 2, height: 1 },

  // Chairs
  { type: "chair", position: { x: 5, y: 6 }, width: 1, height: 1 },
  { type: "chair", position: { x: 8, y: 6 }, width: 1, height: 1 },
  { type: "chair", position: { x: 11, y: 6 }, width: 1, height: 1 },
  { type: "chair", position: { x: 5, y: 9 }, width: 1, height: 1 },
  { type: "chair", position: { x: 8, y: 9 }, width: 1, height: 1 },
  { type: "chair", position: { x: 11, y: 9 }, width: 1, height: 1 },

  // Meeting area
  { type: "table", position: { x: 20, y: 10 }, width: 4, height: 2 },
  { type: "chair", position: { x: 19, y: 10 }, width: 1, height: 1 },
  { type: "chair", position: { x: 19, y: 11 }, width: 1, height: 1 },
  { type: "chair", position: { x: 24, y: 10 }, width: 1, height: 1 },
  { type: "chair", position: { x: 24, y: 11 }, width: 1, height: 1 },
  { type: "whiteboard", position: { x: 20, y: 7 }, width: 4, height: 1 },

  // Break area
  { type: "coffee", position: { x: 30, y: 5 }, width: 2, height: 1 },
  { type: "table", position: { x: 30, y: 8 }, width: 3, height: 2 },
  { type: "chair", position: { x: 29, y: 8 }, width: 1, height: 1 },
  { type: "chair", position: { x: 29, y: 9 }, width: 1, height: 1 },
  { type: "chair", position: { x: 33, y: 8 }, width: 1, height: 1 },
  { type: "chair", position: { x: 33, y: 9 }, width: 1, height: 1 },

  // Decorative elements
  { type: "plant", position: { x: 3, y: 3 }, width: 1, height: 1 },
  { type: "plant", position: { x: 15, y: 3 }, width: 1, height: 1 },
  { type: "plant", position: { x: 27, y: 3 }, width: 1, height: 1 },
  { type: "plant", position: { x: 35, y: 3 }, width: 1, height: 1 },
  { type: "bookshelf", position: { x: 3, y: 15 }, width: 2, height: 1 },
  { type: "bookshelf", position: { x: 35, y: 15 }, width: 2, height: 1 },

  // Walls/boundaries
  { type: "wall", position: { x: 0, y: 0 }, width: 50, height: 1 },
  { type: "wall", position: { x: 0, y: 0 }, width: 1, height: 30 },
  { type: "wall", position: { x: 0, y: 29 }, width: 50, height: 1 },
  { type: "wall", position: { x: 49, y: 0 }, width: 1, height: 30 },
];
