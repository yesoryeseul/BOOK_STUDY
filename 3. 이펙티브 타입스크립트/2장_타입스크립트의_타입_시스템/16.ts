interface Array<T> {
  // ...
  [n: number]: T;
}

const xs = [1, 2, 3];
const x0 = xs[0]; // OK
const x1 = xs["1"];

function getArr<T>(array: T[], k: string): T {
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

// 어떤 길이를 가지는 배열과 비슷한 형태의 튜플을 사용하고 싶다면 타입스트립트에 있는 ArrayLike 타입을 사용한다.

function checkedAccess<T>(xs: ArrayLike<T>, i: number): T {
  if (i < xs.length) {
    return xs[i];
  }
  throw new Error(`배열의 끝을 지나서 ${i}를 접근하려고 했다.`);
}

// ArrayLike라도 키는 여전히 문자열이다.
