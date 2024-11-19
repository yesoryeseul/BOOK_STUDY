/**
 * 4.1.1 규칙: if문에서 else를 사용하지 말 것
 *
 * if-else를 사용하면 코드에서 결정이 내려지는 지점을 고정하게 된다.
 * 그럴 경우 if-else가 있는 위치 이후에서는 다른 변형을 도입할 수 없기 때문에 코드의 유연성이 떨어지게 된다.
 *
 * if-else는 하드코딩된 결정으로 볼 수 있다. 코드에서 하드코딩된 상수가 좋지 않는 것처럼
 * 하드코딩된 결정 또한 좋지 않다.
 */
// 만약 이 함수에서 빈배열로 구현한다면 0으로 나누기 오류가 발생
// average 함수는 평균을 계산하는 기능인데, “빈 배열은 허용되지 않는다”는 검증 로직이 계산과 섞여 있어, 사용자는 이 오류가 검증에서 나온 건지 계산에서 나온 건지 헷갈릴 수 있습니다.
function average(ar: number[]) {
  if (size(ar) === 0) throw "Empty array not allowed";
  else return sum(ar) / size(ar);
}

// 사용자(개발자)가 이해할 수 있는 오류로 발생하여 리팩토링
// average는 평균 계산만 담당하며, 오류는 검증 단계에서 처리되므로 계산 로직은 오류를 던지지 않는다.
function assertNotEmpty(ar: number[]) {
  if (size(ar) === 0) throw "Empty array not allowed";
}

function average(ar: number) {
  assertNotEmpty(ar);
  return sum(ar) / size(ar);
}
