/**
 * 3.3.1 규칙: 호출 또는 전달, 한 가지만 할 것
 *
 * 함수 내에서는 객체에 있는 메서드를 호출하거나 객체를 인자로 전달할 수 있지만 둘을 섞어 사용해서는 안된다.
 *
 * 더 많은 메서드를 도입하고 여러 가지를 매개변수로 전달하기 시작하면 결국 책임이 고르지 않게 될 수 있다.
 */

// 배열의 평균을 구하는 함수, 높은 추상화와 sum(arr), 낮은 수준의 arr.length를 모두 사용

// 변경 전
function average(arr: number[]) {
  return sum(arr) / arr.length;
}

function sum(arr: number[]) {
  return arr.reduce((acc, cur) => acc + cur, 0);
}

// 위 코드는 규칙에 위반된다. 배열의 길이를 찾는 것을 추상화한 더 좋은 구현이 있다.

// 변경 후
function averageRefactor(arr: number[]) {
  return sum(arr) / size(arr);
}

function size(arr: number[]) {
  return arr.length;
}

/**
 * 메서드에서 몇 가지 세부적인 부분을 추출해서 추상화를 도입할 때
 * 이 규칙은 연관된 다른 세부적인 부분도 추출하게 된다.
 * 이렇게 하면 메서드 내부의 추상화 수준이 항상 동일하게 유지된다.
 */
