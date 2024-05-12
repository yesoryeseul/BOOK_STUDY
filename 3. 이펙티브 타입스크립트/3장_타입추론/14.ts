// 아이템 14 타입 연산과 제너릭 사용으로 반복 줄이기

// 1. 타입 중복은 코드 중복만큼 많은 문제를 발생시킨다.

// Person에 middleName을 추가하면 PersonWithBirthDate과 전혀 다른 타입이 된다.
interface Person {
  firstName: string;
  middleName: string;
  lastName: string;
}

interface PersonWithBirthDate {
  firstName: string;
  lastName: string;
  birth: string;
}

interface Options {}

type HTTPFunction = (url: string, opts: Options) => Promise<Response>;
const get: HTTPFunction = (url, opts) => {
  return Promise.resolve(new Response());
};
const post: HTTPFunction = (url, opts) => {
  return Promise.resolve(new Response());
};

interface PersonWithBirthDate2 extends Person {
  birth: Date;
}

type PersonWithBirthDate3 = Person & { birth: Date };

// 위와 같은 기법은 유니온 타입(확장할 수 없는)에 속성을 추가하려고 할 때 특히 유용하다.

interface State {
  userId: string;
  pageTitle: string;
  recentFiles: string[];
  pageContents: string;
}

interface TopNavState {
  userId: string;
  pageTitle: string;
  recentFiles: string[];
}

type TopNavState2 = {
  userId: State["userId"];
  pageTitle: State["pageTitle"];
  recentFiles: State["recentFiles"];
};

type TopNavState3 = {
  [k in "userId" | "pageTitle" | "recentFiles"]: State[k];
};

// 매핑된 타입은 배열의 필드를 루프 도는 것과 같은 방식이다. 이 패턴은 표준 라이브러리에서도 일반적으로 찾을 수 있으며,
// Pick 이라고 한다.
// type Pick<T, K> = { [k in K]: T[k] }

type TopNavState4 = Pick<State, "userId" | "pageTitle" | "recentFiles">;

// 태그된 유니온에서도 다른 형태의 중복이 발생할 수 있다.
interface SaveAction {
  type: "save";
}

interface LoadAction {
  type: "load";
}

type Action = SaveAction | LoadAction;
// type ActionType = 'save' | 'load';
// type ActionType = Action["type"];
type ActionType = Pick<Action, "type">; // { type: 'save' | 'load' }

// keyof
interface Option {
  width: number;
  height: number;
  color: string;
  label: string;
}

interface OptionsUpdate {
  width?: number;
  height?: number;
  color?: string;
  label?: string;
}

class UIWidget {
  constructor(init: Options) {
    /* ... */
  }
  update(options: OptionsUpdate) {
    /* ... */
  }
}

// 매핑된 타입과 keyof를 사용하면 Options로부터 OptionsUpdate를 만들 수 있다.
type OptionsUpdate2 = { [k in keyof Options]?: Options[k] };
type OptionsUpdate3 = Partial<Options>;

// keyof는 타입을 받아서 속성 타입의 유니온을 반환한다.
type OptionsKeys = keyof Options; // 타입이 'width' | 'height' | 'color' | 'label'

// ?는 각 속성을 선택적으로 만든다. 이 패턴 역시 아주 일반적이며
// 표준 라이브러리에 Partial이라는 이름으로 들어 있다.

class UIWidget2 {
  constructor(init: Options) {
    /* ... */
  }
  update(options: Partial<Options>) {
    /* ... */
  }
}

// 아래와 같은 경우 keyof 를 사용하면 된다.

const INIT_OPTIONS = {
  width: 640,
  height: 480,
  color: "#00FF00",
  label: "VGA",
};

// interface Options2 {
//   width: number;
//   height: number;
//   color: string;
//   label: string;
// }

type Options2 = typeof INIT_OPTIONS;

// ReturnType은 함수의 반환 타입을 추출한다.
function getUserInfo(userId: string) {
  // ...
  const name = "John Doe";
  const age = 33;
  const height = 180;
  const weight = 80;
  const favoriteColor = "blue";
  return {
    userId,
    name,
    age,
    height,
    weight,
    favoriteColor,
  };
}

type UserInfo = ReturnType<typeof getUserInfo>;

// 제네릭 타입에서 매개변수를 제한할 수 있는 방법은 extends를 사용하는 것이다.
// extends를 이용하면 제너릭 매개변수가 특정 타입을 확장한다고 선언할 수 있다.
interface Name {
  first: string;
  last: string;
}

type DancingDuo<T extends Name> = [T, T];

const couple1: DancingDuo<Name> = [
  { first: "Fred", last: "Astaire" },
  { first: "Ginger", last: "Rogers" },
]; // OK

// { first: string }은 Name을 확장하지 않으므로 에러가 발생한다.
const couple2: DancingDuo<{ first: string }> = [
  // 'Name' 타입에 필요한 'last' 속성이
  // '{ first: string; }' 타입에 없습니다.
  { first: "Fred" },
  { first: "Ginger" },
];

// type Picks2<T, K> = {
//   [k in K]: T[k];
// };

// T는 object, K는 object의 키만 올 수 있다. 는 느낌으로 이해
// 확장보다 부분 집합으로 이해
type Picks<T, K extends keyof T> = {
  [k in K]: T[k];
};

type FirstLast = Pick<Name, "first" | "last">; // OK
type FirstMiddle = Pick<Name, "first" | "middle">; // Error, 잘못된 키를 넣으면 오류가 난다
