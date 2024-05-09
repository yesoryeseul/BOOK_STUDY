// 아이템 12 함수 표현식에 타입 적용하기

// 자바스크립트(그리고 타입스크립트)에서는 함수 '문장(statement)'과 함수 '표현식(expression)'을 다르게 인식한다.

function rollDice1(sides: number): number {
  return 0;
} // 문장

const rollDice2 = function (sides: number): number {
  return 0;
}; // 표현식

const rollDice3 = (sides: number): number => {
  return 0;
}; // 표현식

// 타입스크립트체서는 함수 표현식 사용이 좋다. 함수의 매개변수부터 반환값까지 전체를 함수 타입으로 선언하여 함수 표현식에 재사용할 수 있다는 장점이 있기 때문이다.

// 함수 시그니처를 타입으로 설정하면 재사용 가능!
type DiceRollFn = (sides: number) => number;
const rollDice: DiceRollFn = (sides) => {
  return sides;
};

// 함수 타입의 선언은 불필요한 코드의 반복을 줄인다
function add(a: number, b: number) {
  return a + b;
}
function sub(a: number, b: number) {
  return a - b;
}
function mul(a: number, b: number) {
  return a * b;
}
function div(a: number, b: number) {
  return a / b;
}

type BinaryFn = (a: number, b: number) => number;
const add1: BinaryFn = (a, b) => a + b;
const sub1: BinaryFn = (a, b) => a - b;
const mul1: BinaryFn = (a, b) => a * b;
const div1: BinaryFn = (a, b) => a / b;

// 시그니처가 일치하는 다른 함수가 있을 때도 함수 표현식에 타입을 적용해볼 만하다.

// fetch 예시
const responseP = fetch("/quote?by=Mark+Twain"); // 타입이 Promise<Response>

async function getQuote() {
  const response = await fetch("/quote?by=Mark+Twain");
  const quote = await response.json(); // .json() 이전 오류가 있음에도 해당 코드 때문에 다른 오류를 뱉게 된다.
  return quote;
}

/**
 * 여기에 버그가 있다.
 * /quote가 존재하지 않는 API라면, '404 Not Found'가 포함된 내용을 응답한다.
 * 응답은 JSON이 아닐 수 있다. response.json()은 JSON 형식이 아니라는 새로운 오류 메시지를 담아 거절된 (rejected) 프로미스를 반환한다.
 * 호출한 곳에서는 새로운 오류 메시지가 전달되어 실제 404가 감춰진다.
 *
 * 또한 fetch가 실패하면 거절된 프로미스를 응답하지 않는다는 걸 간과하기 쉽다.
 */

async function checkedFetch(input: RequestInfo, init: RequestInit) {
  const response = await fetch(input, init);
  if (!response.ok) {
    // 비동기 함수 내에서는 거절된 프로미스로 반환한다.
    throw new Error("Request Failed " + response.status);
  }
  return response;
}

// 화살표 함수로 더 간결하게 작성 가능하다.
const checkedFetch2: typeof fetch = async (input, init) => {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error("Request Failed " + response.status); // throw를 return 으로 작성하면 오류가 난다. 여긴 리턴이 오는 자리가 아니라 에러가 오는 곳이기 때문!
  }
  return response;
};

/**
 * typeof fetch는 아래 타입과 동일하다
 * type FetchFn = (input: RequestInfo, init: RequestInit | undefined) => Promise<Response>
 */

/**
 * 요약
 * 1. 메게변수나 반환 값에 타입을 명시하기보다는 함수 표현식 전체에 타입 구문을 적용하는 것이 좋다
 * 2. 만약 같은 타입 시그니처를 반복적으로 작성한 코드가 있다면 함수 타입을 분리해 내거나 이미 존재하는 타입을 찾아보도록 한다.
 * 3. 다른 함수의 시그니처를 참조하려면 typeof fn을 사용하면 된다.
 */
