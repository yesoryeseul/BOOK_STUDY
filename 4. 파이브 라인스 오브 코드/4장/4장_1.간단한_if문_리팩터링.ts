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

/**
 * 4.1.2 규칙 적용
 * handleInput에서 if-else를 제거하는 첫 번째 단계는 Input을 열거형(enum)에서 인터페이스로 바꾸는 것
 * 여기서 값들은 클래스로 바뀐다. 마지막으로, 값이 이제 객체가 되었기 때문에 if 구문 내의 코드를 각 클래스의 메서드로 옮길 수 있다.
 */

enum RawInput {
  RIGHT,
  LEFT,
  UP,
  DOWN,
}

interface Input2 {
  isRight(): boolean;
  isLeft(): boolean;
  isUp(): boolean;
  isDown(): boolean;
}

class Right implements Input2 {
  isRight() {
    return true;
  }
  isLeft() {
    return false;
  }
  isUp() {
    return false;
  }
  isDown() {
    return false;
  }
}

class Left implements Input2 {
  isRight() {
    return false;
  }
  isLeft() {
    return true;
  }
  isUp() {
    return false;
  }
  isDown() {
    return false;
  }
}
class Up implements Input2 {
  isRight() {
    return false;
  }
  isLeft() {
    return false;
  }
  isUp() {
    return true;
  }
  isDown() {
    return false;
  }
}
class Down implements Input2 {
  isRight() {
    return false;
  }
  isLeft() {
    return false;
  }
  isUp() {
    return false;
  }
  isDown() {
    return true;
  }
}

// 변경 전 handleInput
function handleInput(input: Input) {
  if (input === Input.LEFT) moveHorizontal(-1);
  else if (input === Input.RIGHT) moveHorizontal(1);
  else if (input === Input.UP) moveVertical(-1);
  else if (input === Input.DOWN) moveVertical(1);
}

// 변경 후 handleInput
function handleInput(input: Input2) {
  // 인터페이스를 사용하도록 타입을 변경
  if (input.isLeft()) moveHorizontal(-1);
  else if (input.isRight()) moveHorizontal(1);
  else if (input.isUp()) moveVertical(-1);
  else if (input.isDown()) moveVertical(1);
}

// new 로 변경한 handleInput
function handleInput(input: Input) {
  if (input === new Left()) moveHorizontal(-1);
  else if (input === new Right()) moveHorizontal(1);
  else if (input === new Up()) moveVertical(-1);
  else if (input === new Down()) moveVertical(1);
}

/**
 * 4.1.3 리팩터링 패턴: 클래스 타입 코로 대체
 */

// 정해진 상수를 참조하지 않고 숫자를 사용했을 수 있기 때문에 int의 경우 타입 코드의 사용을 추적하는 것이 까다롭다. 따라서 타입 코드를 볼 때는 항상 즉시 열거형으로 변환한다. 그래야만 안전 적용 가능하다.
const SMALL = 33;
const MEDIUM = 37;
const LARGE = 42;

// 변경 후
enum TShirtsSizes {
  SMALL = 33,
  MEDIUM = 37,
  LARGE = 42,
}

// 초기 코드
// enum TrafficLight {
//   RED,
//   YELLOW,
//   GREEN,
// }

const CYCLE = [TrafficLight.RED, TrafficLight.GREEN, TrafficLight.YELLOW];
function updateCarForLight(current: TrafficLight) {
  if (current === TrafficLight.RED) car.stop();
  else car.drive();
}

// 1. 임시 이름으로 새로운 인터페이스 도입
// 6. 마지막으로 오류가 없다면 인터페이스 이름을 모든 위치에서 영구적 이름으로 변경 (TrafficLight ->  TrafficLight)
interface TrafficLight {
  isRed(): boolean;
  isGreen(): boolean;
  isYellow(): boolean;
}

// 2. 각 열거형에 대한 클래스 생성
class Red implements TrafficLight {
  isRed() {
    return true;
  }
  isGreen() {
    return false;
  }
  isYellow() {
    return false;
  }
}

class Green implements TrafficLight {
  isRed() {
    return false;
  }
  isGreen() {
    return true;
  }
  isYellow() {
    return false;
  }
}

class Yellow implements TrafficLight {
  isRed() {
    return false;
  }
  isGreen() {
    return false;
  }
  isYellow() {
    return true;
  }
}

// 3. 열거형 이름 변경
enum RawTrafficLight {
  RED,
  YELLOW,
  GREEN,
}

// 4. 타입을 이전 이름에서 임시 이름으로 변경하고 일치 여부 검사를 새로운 메서드로 대체
function updateCarForLight(current: TrafficLight) {
  if (current.isRed()) car.stop();
  else car.drive();
}

// 5. 열거형 값에 대한 나머지 참조를 새 클래스를 인스턴스화해서 교체
const _CYCLE = [new Red(), new Green(), new Yellow()];
