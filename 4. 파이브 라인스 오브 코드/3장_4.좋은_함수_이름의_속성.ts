/**
 * 좋은 이름이 가져야 할 몇 가지 속성
 *
 * 1. 정직해야 한다. 함수의 의도를 설명해야 한다.
 * 2. 완전해야 한다. 함수가 하는 모든 것을 담아야 한다.
 * 3. 도메인에서 일하는 사람이 이해할 수 있어야 한다. 작업 중인 도메인에서 사용하는 단어를 사용하라.
 *    소통의 효율과 팀원 및 고객과 코드에 대해 더 쉽게 이야기 할 수 있다.
 */

// 변경 전
function draw() {
  let canvas = document.getElementById("GameCanvas") as HTMLCanvasElement;

  let g = canvas.getContext("2d");

  g?.clearRect(0, 0, canvas.width, canvas.height);

  drawMap(g);
  drawPlayer(g);
}

// 변경 후
function createGraphics() {
  // 그래픽 객체를 만듦
  let canvas = document.getElementById("GameCanvas") as HTMLCanvasElement;

  let g = canvas.getContext("2d");

  g?.clearRect(0, 0, canvas.width, canvas.height);

  return g;
}

function drawRefactor() {
  let g = createGraphics();
  drawMap(g);
  drawPlayer(g);
}

// 새로운 예시 update 함수
function update() {
  while (inputs.length > 0) {
    let current = inputs.pop();
    if (current === Input.LEFT) moveHorizontal(-1);
    else if (current === Input.RIGHT) moveHorizontal(1);
    else if (current === Input.UP) moveVertical(-1);
    else if (current === Input.DOWN) moveVertical(1);
  }

  for (let y = map.length - 1; y >= 0; y--) {
    for (let x = 0; x < map[y].length; x++) {
      // map을 업데이트하는 코드.. 생략
    }
  }
}

// 위 코드를 자연스럽게 두 개의 더 작은 함수로 나눌 수 있다.

function update() {
  handleInputs();
  updateMap();
}
function handleInputs() {
  while (inputs.length > 0) {
    let current = inputs.pop();
    if (current === Input.LEFT) moveHorizontal(-1);
    else if (current === Input.RIGHT) moveHorizontal(1);
    else if (current === Input.UP) moveVertical(-1);
    else if (current === Input.DOWN) moveVertical(1);
  }
}

function updateMap() {
  for (let y = map.length - 1; y >= 0; y--) {
    for (let x = 0; x < map[y].length; x++) {
      // map을 업데이트하는 코드.. 생략
    }
  }
}

// 이제 update 함수는 규칙을 준수한다. 리팩토링 함으로써 점점 5줄 제한에 가까워지고 있다.
