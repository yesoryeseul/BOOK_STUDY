/**
 * 아이템 15. 동적 데이터에 인덱스 시그니처 사용하기
 * 자바스크립트 객체는 문자열 키를 타입의 값에 관계없이 매핑한다.
 * 타입스크립트에서는 타입에 '인덱스 시그니처'를 명시하여 유연하게 매칭을 표현할 수 있다.
 */

type Rocket = { [property: string]: string };
const roket: Rocket = {
  name: "Falcon 9",
  variant: "Block 5",
  thrust: "7, 607 kN",
};

/**
 * [property: string]: string이 인덱스 시그니처이며, 다음 세 가지 의미를 담고 있다.
 *
 * - 키의 이름: 키의 위치만 표시하는 용도이다.
 * - 키의 타입: string이나 number나 symbol 중 하나여야 한다. 보통은 string
 * - 값의 타입: 어떤 것이든 될 수 있다.
 */
interface Rocket2 {
  name: string;
  variant: string;
  thrust_kN: number;
}

const falconHeavy: Rocket2 = {
  name: "Falcon Heavy",
  variant: "v1",
  thrust_kN: 15_200,
};

// 가능한 한 인터페이스, Record, 매핑된 타입 같은 인덱스 시그니처보다 정확한 타입을 사용하는 것이 좋다.

interface Row1 {
  [column: string]: string;
} // 너무 광범위

interface Row2 {
  a: number;
  b?: number;
  c?: number;
  d?: number;
} // 최선

type Row3 =
  | { a: number }
  | { a: number; b: number }
  | { a: number; b: number; c: number }
  | { a: number; b: number; c: number; d: number }; // 가장 정확하지만 사용하기 번거로움

// 첫 번쨰 대안, Record
type Vec3D = Record<"x" | "y" | "z", number>;
// Type Vec3D = {
//     x: number;
//     y: number;
//     z: number;
// }

// 두 번쨰 대안, 매핑된 타입 사용
type Vec3D2 = { [k in "x" | "y" | "z"]: number };
// Type Vec3D2 = {
//     x: number;
//     y: number;
//     z: number;
// }

type Vec3D3 = { [k in "a" | "b" | "c"]: k extends "b" ? string : number };
// Type Vec3D3 = {
//     a: number;
//     b: string;
//     c: number;
// }
