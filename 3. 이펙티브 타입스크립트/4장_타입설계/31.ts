// 아이템 31 타입 주변에 null 값 배치하기

// 값이 전부 null이거나 전부 null이 아닌 경우도 분명히 구분된다면, 값이 섞여 있을 때보다 다루기 쉽다. 타입에 null을 추가하는 방식으로 모델링할 수 있다.

function extent(nums: number[]) {
  let min, max;
  for (const num of nums) {
    if (!min) {
      min = num;
      max = num;
    } else {
      min = Math.min(min, num);
      max = Math.max(max, num);
      // 'number | undefined' 형식의 인수는
      // 'number' 형식의 매개변수에 할당될 수 없다.
    }
  }
  return [min, max];
}

/**
 * 위 코드는 버그와 함께 설계적 결함이 있다.
 *
 * 1. 최솟값이나 최댓값이 0인 경우, 값이 덧씌워져 버린다. 예를 들어, extent([0, 1, 2])의 결과는 [0, 2]가 아니라 [1, 2]가 된다.
 *
 * 2. nums 배열이 비어 있다면 함수는 [undefined, undefined]를 반환한다.
 *
 * 문제는 strickNullChecks 설정을 켜면 발생한다.
 *
 * extent의 반환 타입이 (number | undefined)[]로 추론되어서 설계적 결함이 분명해졌다.
 */

const [min, max] = extent([0, 1, 2]);
const span = max - min; // 개체가 'undefined'인 것 같습니다.

// undefined를 min에서만 제거하고 max에서 하지 않았다.

// 더 나은 해결법? min과 max를 한 객체 안에 넣고 null이거나 null이 아니게 하면 된다.

function extent2(nums: number[]) {
  let result: [number, number] | null = null;
  for (const num of nums) {
    if (!result) {
      result = [num, num];
    } else {
      result = [Math.min(num, result[0]), Math.max(num, result[1])];
    }
  }
  return result; // 반환 타입이 [number, number] | null이 되어 사용하기 훨씬 수월해진다.
}

/**
 * 요약
 *
 * 1. 한 값의 null 여부가 다른 값의 null 여부에 암시적으로 관련되도록 설계하면 안된다.
 *
 * 2. API 작성 시에는 반환 타입을 큰 객체로 만들고 반환 타입 전체가 null이거나 null이 아니게 만들어야 한다.
 */
