/** 3.1 첫 번째 규칙: 왜 다섯 줄인가?
 *
 * 이 규칙을 엄수하는 것 자체로도 엄청난 개선.
 *
 * 3.1.1 규칙: 다섯줄 제한
 * 메서드를 제외하고 5줄 이상이 되어서는 안 된다.
 */

// 2차원 배열에 짝수가 존재하는지 확인하는 함수
function containsEven(arr: number[][]) {
  for (let x = 0; x < arr.length; x++) {
    for (let y = 0; y < arr.length; y++) {
      if (arr[x][y] % 2 == 0) {
        return true;
      }
    }
  }
  return false;
}

// 2차원 배열에서 최소 항목을 찾는 함수
function minimum(arr: number[][]) {
  let result = Number.POSITIVE_INFINITY;
  for (let x = 0; x < arr.length; x++) {
    for (let y = 0; y < arr.length; y++) {
      result = Math.min(arr[x][y], result);
    }
  }
  return result;
}

// 개선 전
function checkValue(str: boolean) {
  // 바람직하지 않은 메서드명, 매개변수명
  if (str !== false) return true; // 이중 부정은 읽기 어려움
  else return str;
}

// 개선 후 1. 읽기 쉽도록
function isTrue(bool: boolean) {
  if (bool) return true;
  else return false;
}

// 개선 후 2. 단순화
function isTrue(bool: boolean) {
  return true;
}

/** 스멜
 * 메서드가 길다는 것 자체가 스멜이다. 긴 메서드의 모든 논리를 머릿속에 담아 작업하기 어렵다. 그런데 여기서 길다는 건 어떤 뜻일까?
 */
