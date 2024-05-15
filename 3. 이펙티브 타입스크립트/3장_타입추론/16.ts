interface Array<T> {
  // ...
  [n: number]: T;
}

const xs = [1, 2, 3];
const x0 = xs[0]; // OK
const x1 = xs["1"];

function get<T>(array: T[], k: string): T {
  return array[k];
}

const keys = Object.keys(xs); // 타입이 string[] -> ['1', '2', '3']
for (const key in xs) {
  key; // 타입이 string
  const x = xs[key]; // 타입이 number
}

// 인덱스에 신경쓰지 않는다먄 for...
for (const x of xs) {
  x; // 타입이 number
}
// 인덱스 타입이 중요하다면, number타입을 제공해줄 forEach
xs.forEach((x, i) => {
  i; // 타입이 number
  x; // 타입이 number
});

for (let i = 0; i < xs.length; i++) {
  const x = xs[i];
  if (x < 0) break;
}

// 타입이 불확실하다면, for-in 루프는 for-of 또는 for(;;) 루프에 비해 몇 배나 느리다.
