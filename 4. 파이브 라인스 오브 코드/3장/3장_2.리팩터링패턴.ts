/**
 * 3.2.1 리팩터링 패턴: 메서드 추출
 *
 * 메서드 추출은 한 메서드의 일부를 취해서 자체 메서드로 추출한다.
 */

function minimum(arr: number[][]) {
  let result = Number.POSITIVE_INFINITY;
  for (let x = 0; x < arr.length; x++) {
    for (let y = 0; y < arr.length; y++) {
      // 추출하고자 하는 코드
      if (result > arr[x][y]) {
        return arr[x][y];
      }
    }
  }

  return result;
}

// 리팩터

function minimumRefactor(arr: number[][]) {
  let result = Number.POSITIVE_INFINITY;
  for (let x = 0; x < arr.length; x++) {
    for (let y = 0; y < arr.length; y++) {
      result = min(result, arr, x, y); // 결과 할당
    }
  }

  return result;
}

// 매개 변수 추가
function min(result: number, arr: number[][], x: number, y: number) {
  if (result > arr[x][y]) result = arr[x][y];
  return result; // 리턴문 추가
}
