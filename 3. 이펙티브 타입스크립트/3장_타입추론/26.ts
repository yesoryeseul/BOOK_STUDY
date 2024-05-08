/**
 * 26장 타입 추론에 문맥이 어떻게 사용되는지 이해하기
 */

function setLanguage(language: string) {}

setLanguage("js"); // 정상

let language = "js";
setLanguage(language); // 정상

// 문자열 리터럴에서는 타입 추론이 잘 된다. 그러나,,

type Language = "js" | "ts" | "node";
function setLanguage1(language: Language) {}

setLanguage1("js"); // 정상
let language1 = "js";
// setLanguage1(language1);
// 'string' 형식의 인수는
// 'Language' 형식의 매개변수에 할당될 수 없습니다.

/**
 * 위와 같은 에러 발생 이유는 타입스크립트는 타입을 추론할 때 단순히 값만 고려하는 것이 아닌 값이 존재하는 곳의 문맥까지 살피기 때문이다.
 */

// 타입 선언 시 language2의 가능한 값을 설정해주는 것
let language2: Language = "js";
setLanguage1(language2); // 정상 추론

// 상수화
const language3 = "js";
setLanguage1(language3); // 정상 추론

// 그러나 위 방식 역식도 문맥과 값을 분리하면 추후에 근본적 문제를 발생시킬 수 있다.

/**
 * 튜플 사용 시 주의점
 * 아래는 이동 가능한 지도를 보여주는 프로그램 예시다.
 */

// 매개변수는 {latitde, longitude} 쌍이다.
function panTo(where: [number, number]) {}

// 튜플 타입으로 [number, number] 할당 가능
panTo([10, 20]); // 정상

// ts가 loc을 number[]로 추론하기 때문에 에러
const loc = [10, 20];
// panTo(loc);
// 'number[]' 형식의 인수는 '[number, number]' 형식의 매개 변수에 할당될 수 없습니다.

// 1. 타입 선언
const loc1: [number, number] = [10, 20];
panTo(loc1);

// 2. any를 사용하지 않고 '상수 문맥' 제공
// const loc2 = [10, 20] as const;
// panTo(loc2)
// 'readonly [10, 20]' 형식은 'readonly'이며 변경 가능한 형식 '[number, number]'에 할당할 수 없습니다.

function panTo1(where: readonly [number, number]) {}
const loc2 = [10, 20] as const;
panTo1(loc2); // 정상

// 단, as const는 타입 정의에 실수가 있을 때 오류는 타입 정의가 아닌 호출되는 곳에서 발생하는 문제가 생기므로 특히 여러 겹 중첩된 객체에서 오류가 발생한다면 근본적인 원인을 파악하기 어렵다.

const loc3 = [10, 20, 30] as const; // 실제 오류는 여기서 발생하나
// panTo1(loc3) // 에러 메세지는 이때 나타난다
//'readonly [10, 20, 30]' 형식의 인수는 'readonly [number, number]' 형식의 매개 변수에 할당될 수 없습니다.소스에 3개 요소가 있지만, 대상에서 2개만 허용합니다.

/**
 * 객체 사용 시 주의점
 */

type Lan = "js" | "ts" | "node";

interface A {
  lan: Lan;
  org: string;
}

function A(lan: A) {}

A({ lan: "ts", org: "Apple" }); // 정상

const ts = { lan: "ts", org: "Apple" };
// A(ts);
// { lan: string; org: string; }' 형식의 인수는
// 'A' 형식의 매개 변수에 할당될 수 없습니다.
//  'lan' 속성의 형식이 호환되지 않습니다.
//  'string' 형식은 'Lan' 형식에 할당할 수 없습니다.

// ts 객체에서 lan 타입은 'string'으로 추론된다. 이 문제는 타입 선언을 추가하거나(const ts: A = ...) 상수 단언(as const)을 사용해 해결해야 한다.

/**
 * 콜백 사용 시 주의점
 * 콜백을 다른 함수로 전달할 때, 타입스크립트는 콜백의 매개변수 타입을 추론하기 위해 문맥을 사용한다.
 */

function callWithRandomNumbers(fn: (n1: number, n2: number) => void) {
  fn(Math.random(), Math.random());
}

callWithRandomNumbers((a, b) => {
  a; // 타입이 number
  b; // 타입이 number
  console.log(a + b);
});

// 여기서 콜백을 상수로 뽑아낸다면?
const fn = (a, b) => {
  // 'a' 매개 변수는 암시적으로 'any' 형식이지만, 사용량에서 더 나은 형식을 유추할 수 있습니다.
  // 'b' 매개 변수는 암시적으로 'any' 형식이지만, 사용량에서 더 나은 형식을 유추할 수 있습니다.
  console.log(a + b);
};
callWithRandomNumbers(fn);

// 매개변수에 타입 구문을 추가해서 해결 할 수 있다.
const fn1 = (a: number, b: number) => {
  console.log(a + b);
};
callWithRandomNumbers(fn1);

/**
 * 요약
 * 1. 타입 추론에서 문맥이 어떻게 쓰이는지 주의해서 살펴야 한다.
 * 2. 변수를 뽑아서 별도로 선언했을 떄 오류가 발생한다면 타입 선언을 추가해야 한다.
 * 3. 변수가 정말로 상수라면 상수 단언(as const)을 사용해야 한다. 그러나 상수 단언을 사용하면 정의한 곳이 아는 사용한 곳에서 오류가 발생하므로 주의해야 한다.
 */
