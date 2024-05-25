/**
 * 아이템 22
 * 타입 좁히기
 */

// 1. Null 체크 예시

const el = document.getElementById("foo"); // 타입이 HTMLElement | null

if (el) {
  el; // 타입이 HTMLElement
  el.innerHTML = "Party Time";
} else {
  el; // 타입이 null
  alert("No element #foo");
}

/**
 * 만약 el이 null이라면, 분기문의 첫 번째 블록이 실행되지 않습니다. 즉, 첫 번째 블록에서 HTMLElement | null 타입의 null을 제외하므로, 더 좁은 타입이 되어 작업이 훨씬 쉬워진다.
 *
 * 단, 타입 별칭이 존재한다면 그러지 못할 수도 있다.
 */

// 2. 분기문에서 예외를 던지거나 함수를 반환하여 블록의 나머지 부분에서 변수의 타입을 좁힐 수 있다.
const el2 = document.getElementById("foo"); // 타입이 HTMLElement | null
if (!el2) throw new Error("Unable to find #foo");
el2; // 이제 타입은 HTMLElement
el2.innerHTML = "Party Time";

// 3. instanceof

function contains(text: string, search: string | RegExp) {
  if (search instanceof RegExp) {
    search; // 타입이 RegExp
    return !!search.exec(text);
  }
  search; // 타입이 string
  return text.includes(search);
}

// 4. 속성 체크
interface A {
  a: number;
}
interface B {
  b: number;
}

function pickOne(ab: A | B) {
  if ("a" in ab) {
    ab; // 타입이 A
  } else {
    ab; // 타입이 B
  }
  ab; // 타입이 A | B
}

// 4. Array.isArray 내장 함수
function contains2(text: string, terms: string | string[]) {
  const termList = Array.isArray(terms) ? terms : [terms];
  termList; // 타입이 string[]
  // ...
}

/**
 * 타입스크립트는 일반적으로 조건문에서 타입을 좁히는 데 매우 능숙하다.
 * 그러나 타입을 섣불리 판단하는 실수를 저지르기 쉬우므로 다시 한번 꼼꼼히 따져 봐야 한다.
 */

// * 유니온 타입에서 null을 제외하기 위해 잘못된 방법을 사용한 예시
const el3 = document.getElementById("foo"); // 타입이 HTMLElement | null
if (typeof el3 === "object") {
  el; // 타입이 HTMLElement | null
}

// * 자바스크립트에서 typeof null이 'object'이기 때문에 if 구문에서 null이 제외되지 않고,
// * 또한 기본형 값이 잘못되어도 비슷한 사례가 발생한다.
function foo(x?: number | string | null) {
  if (!x) {
    x; // 타입이 number | string | null | undefined
  }
}

// 빈 문자열 ''과 0 모두 false 가 되기 때문에, 타입은 전혀 좁혀지지 않았고, x는 여전히 블록 내에서 string 또는 number가 된다.

// 5. 명시적 태그 붙이기
// 태그된 유니온, 구별된 유니온이라 불린다.
interface UploadEvent {
  type: "upload";
  filename: string;
  content: string;
}

interface DownloadEvent {
  type: "download";
  filename: string;
}

type AppEvent = UploadEvent | DownloadEvent;

function handleEvent(e: AppEvent) {
  switch (e.type) {
    case "download":
      e; // 타입이 DownloadEvent
      break;
    case "upload":
      e; // 타입이 UploadEvent
      break;
  }
}

// 6. 사용자 정의 타입 가드
// 타입스크립트가 타입을 식별하지 못할 때, 커스텀 함수를 도입할 수 있다.
function isInputElement(el: HTMLElement): el is HTMLInputElement {
  return "value" in el;
}

function getElementContent(el: HTMLElement) {
  if (isInputElement(el)) {
    el; // 타입이 HTMLInputElement
    return el.value;
  }
  el; // 타입이 HTMLElement
  return el.textContent;
}

/**
 * 반환 타입의 el is HTMLInputElement는 함수의 반환이 true인 경우, 타입 체커에서 매개변수의 타입을 좁힐 수 있다고 알려준다.
 * 어떤 함수들은 타입 가드를 사용하여 배열과 객체의 타입 좁히기를 할 수 있다.
 */

// ex. 배열에서 어떤 탐색을 수행할 떄 undefined가 될 수 있는 타입을 사용할 수 있다.

const jackson5 = ["Jackie", "Tito", "Jermaine", "Marlon", "Micheal"];
const member = ["Janet", "Micheal"].map((who) =>
  jackson5.find((n) => n === who)
); // 타입이 (string | undefined)[]

// * 이떄 filter 함수를 사용해 undefined를 걸러 내려고 해도 잘 동작하지 않을 것이다.

const member2 = ["Janet", "Micheal"]
  .map((who) => jackson5.find((n) => n === who))
  .filter((who) => who !== undefined); // 타입이 (string | undefined)[]
// 이럴 때 타입 가드를 사용해 타입을 좁힐 수 있다.

function isDefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}

const member3 = ["Janet", "Micheal"]
  .map((who) => jackson5.find((n) => n === who))
  .filter(isDefined); // 타입이 string[]
