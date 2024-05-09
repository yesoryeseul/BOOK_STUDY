// 아이템 13 타입과 인터페이스의 차이점 알기

// 1. 타입 정의 방식은 두 가지가 있다.
type TState = {
  name: string;
  capital: string;
};

interface IState {
  name: string;
  capital: string;
}

const wyoming: TState = {
  name: "wyoming",
  capital: "Cho",
  // population: 500_000
};

// 2. 인덱스 시그니처는 인터페이스와 타입에서 모두 사용 가능하다.
type TDict = { [key: string]: string };
interface IDict {
  [key: string]: string;
}

// 3. 함수 타입도 인터페이스나 타입으로 정의 가능하다.
type TFn = (x: number) => string;
interface IFn {
  (x: number): string;
}

const toStrT: TFn = (x) => "" + x;
const toStrI: IFn = (x) => "" + x;

// 이런 단순한 함수 타입에는 타입 별칭이 더 나은 선택이나, 함수 타입에 추가적인 속성이 있다면 타입이나 인터페이스 어떤 것을 선택하든 차이가 없다

type TFnWithProperties = {
  (x: number): number;
  prop: string;
};

interface IFnWithProperties {
  (x: number): number;
  prop: string;
}

// 이런 건 지양..굳이? 이렇게
// const testFn = (x: number) => 10;
// testFn.prop = "a";
// const Fn2: TFnWithProperties = testFn;

// 4. 타입 별칭과 인터페이스는 모두 제너릭이 가능하다.
type TPair<T> = {
  first: T;
  second: T;
};

interface IPair<T> {
  first: T;
  second: T;
}

interface IStateWithPop extends TState {
  population: number;
}

type TStateWithPop = IState & { population: number };

const a: TStateWithPop = {
  // '{}' 형식은 'TStateWithPop' 형식에 할당할 수 없습니다.
  // '{}' 형식에 'IState' 형식의 name, capital 속성이 없습니다.ts(2322)
};

const b: IStateWithPop = {
  // '{}' 형식에 'IStateWithPop' 형식의 population, name, capital 속성이 없습니다.ts(2739)
};

// 인터페이스는 유니온 타입 같은 복잡한 타입을 확장하지는 못하고 타입과 &를 사용해야 한다.

// 6. 유니온 타입
type AorB = "a" | "b";

// * 인터페이스는 타입을 확장할 수 있지만 유니온은 할 수 있다. 그러나 유니온 타입을 확장하는 게 필요할 때가 있다.

// Input, Output은 별도의 타입으로 이 둘을 하나의 변수명으로 매핑하는 인터페이스를 만들 수 있다.
type Input = {};
type Output = {};
interface VariableMap {
  [name: string]: Input | Output;
}

// 또는 유니온 타입에 name 속성을 붙인 타입을 만들 수도 있다.

type NamedVariable = (Input | Output) & { name: string };

// -> 이 타입은 인터페이스로 표현할 수 없다.
/**
 * type 키워드는 일반적으로 interface보다 쓰임새가 많다.
 * type 키워드는 유니온이 될 수도 있고,
 * 매핑된 타입 또는 조건부 타입 같은 고급 기능에 활용되기도 한다.
 */

// 7. 튜플과 배열 타입도 type 키워드를 이용해 더 간결하게 표현 가능하다.

type Pair = [number, number];
type StringList = string[];
type NamedNums = [string, ...number[]];

const P: Pair = [12, 22];
P.concat(2);

// 인터페이스로도 튜플과 비슷하게 구현 가능하다.
interface Tuple {
  0: number;
  1: number;
  length: 2;
}

const T: Tuple = [10, 20]; // 정상

// T.concat(3); // 'Tuple' 형식에 'concat' 속성이 없습니다.ts(2339)

// interface Tuple extends Array<unknown> {
//   0: number;
//   1: number;
//   length: 2;
// }

// T.concat(2); // 이렇게 확장하면 되긴한다..ㅎ

/**
 * 그러나, 인터페이스로 튜플과 비슷하게 구현하면 튜플에서 사용할 수 있는 concat 같은 메서드를 사용할 수 없다.
 */

// 8. interface의 선언 병합
// 내 생각엔 지양하는 게 나을 거 같은 느낌이다.

interface IStates {
  name: string;
  capital: string;
}

interface IStates {
  population: number;
}

const wow: IStates = {
  name: "wow",
  capital: "W",
  population: 1,
};
