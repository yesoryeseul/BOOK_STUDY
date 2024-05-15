interface Person {
  name: string;
}

interface LifeSpan {
  birth: Date;
  death: Date;
}

type PersonSpan = Person & LifeSpan;

const ps: PersonSpan = {
  name: "name",
  birth: new Date("1992/06/23"),
  death: new Date("2023/03/02"),
}; // 정상

type K = keyof (Person | LifeSpan); // 타입이 never

// keyof (A & B) = (keyof A) | (keyof B)
// keyof (A | B) = (keyof A) & (keyof B

interface Point {
  x: number;
  y: number;
}

type PointKeys = keyof Point;

function sortBy<K extends keyof T, T>(vals: T[], key: K): T[] {
  // ...
}
const pts: Point[] = [
  { x: 1, y: 2 },
  { x: 2, y: 4 },
];

sortBy(pts, "x");
sortBy(pts, "y");
sortBy(pts, Math.random() < 0.5 ? "x" : "y");
// sortBy(pts, 'z');
