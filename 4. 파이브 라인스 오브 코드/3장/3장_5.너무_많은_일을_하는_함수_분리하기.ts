/**
 * 3.5.1 규칙: if 문은 함수의 시작에만 배치
 *
 * if 문이 있는 경우 해당 if 문은 함수의 첫 번째 항목이어야 한다.
 *
 * 함수는 한 가지 일만 해야한다는 걸 안다. 함수가 if 문이 있다면 함수의 첫 번째 항목이어야 하고,
 * 또한 그 후에 아무것도 해서는 안 된다는 의미에서 유일한 것이어야 한다.
 *
 * 즉, 그 본문은 추출할 필요가 없으며, 또한 else 문과 분리해서는 안된다는 거다.
 */

// 예제 1) 2에서 n까지의 모든 소수를 출력하는 함수
function reportPrimes(n: number) {
  for (let i = 2; i < n; i++) {
    if (isPrimes(i)) {
      console.log(`${i} is prime`);
    }
  }
}

function isPrimes(num: number): boolean {
  if (num < 2) return false; // 0과 1은 소수가 아님
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false; // 나누어떨어지면 소수가 아님
  }
  return true; // 나누어떨어지지 않으면 소수
}

// 1. 숫자 반복
// 2. 숫자가 소수인지 확인

// 리팩터

function reportPrimes(n: number) {
  for (let i = 2; i < n; i++) {
    reportIfPrimes(i);
  }
}

function reportIfPrimes(n: number) {
  if (isPrimes(n)) {
    console.log(`${n} is prime`);
  }
}

// 무언가를 확인하는 것은 하나의 작업이며, 하나의 함수에서 처리해야 한다. 그래서 위 규칙이 필요하다.

/**
 * 3.5.2 규칙 적용
 */

// updateMap 함수를 분리해보자!
function updateMap() {
  for (let y = map.length - 1; y >= 0; y--) {
    for (let x = 0; x < map[y].length; x++) {
      updateTile(x, y);
    }
  }
}
function updateTile(x: number, y: number) {
  // map을 업데이트하는 코드.. 생략
}

// 이제 updateMap은 다섯 줄 제한을 지키게 되었다.

// handleInputs도 해보자.!
function handleInputs() {
  while (inputs.length > 0) {
    let current = inputs.pop();
    handleInputs(current);
  }
}

// current 보다 input는 매개변수 명이 더 잘어울린다
function handleInput(input: Input) {
  if (input === Input.LEFT) moveHorizontal(-1);
  else if (input === Input.RIGHT) moveHorizontal(1);
  else if (input === Input.UP) moveVertical(-1);
  else if (input === Input.DOWN) moveVertical(1);
}

// handleInputs도 다섯 줄 제한을 지키게 되었다.

/**
 * 3장 총 요약
 *
 * 1. 다섯 줄 제한 규칙은 메서드는 다섯 줄 이하여야 한다는 말.
 *    이것은 두 가지 이상의 작업을 수행하는 메서드를 식별하는 데 도움이 된다.
 *    리팩터링 패턴인 메서드 추출을 사용해서 긴 메서드를 분해하고 메서드 이름으로 주석을 대체한다.
 *
 * 2. 호출 또는 전달, 한 가지만 할 것 규칙은 하나의 메서드 내에서 객체에 있는 메서드를 호출하거나
 *    객체를 매개변수로 전달할 수 있지만, 둘 다 해서는 한 된다는 말
 *    여러 수준의 추상화가 섞여 있는 메서드를 식별하는 데 도움이 된다.
 *    이 또는 메서드 추출을 사용해 서로 다른 수준의 추상화를 분리한다.
 *
 * 3. 메서드 이름은 투명하고 완전해야 하며 이해할 수 있어야 한다.
 *    메서드 추출을 사용하면 가독성이 향상되도록 매개변수의 이름을 바꿀 수 있다.
 *
 * 4. if 문은 함수의 시작에만 배치 규칙은 if를 사용해 조건을 확인하는 경우 한 가지 작업만 수행하므로
 *    메서드가 다른 작업을 수행하지 못하게 한다. 이 규칙은 또한 하나 이상의 작업을 수행하는 메서드를
 *    식별하는 데 도움이 된다. if 문을 분리하기 위해 메서드 추출을 사용한다.
 */
