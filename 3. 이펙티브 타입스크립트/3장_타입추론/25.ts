/**
 * 25장 비동기 코드는 콜백 대신 async 함수 사용하기
 * Promise를 사용하면 타입스크립트의 모든 타입 추론이 제대로 동작한다.
 */

function timeout(mills: number): Promise<never> {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject("timeout"), mills);
  });
}

async function fetchWithTimeout(url: string, ms: number) {
  return Promise.race([fetch(url), timeout(ms)]);
}

/**
 * 단, 선택의 여지가 있다면 Promise 보다는 async/await 을 사용해야 한다.
 *
 * async 함수는 항상 프로미스를 반환하도록 강제된다.
 */

// function getNumber(): Promise<number>
async function getNumber() {
  return 42;
}

// const getNumber1(): () => Promise<number>
const getNumber1 = async () => 42;

/**
 * 요약
 * 1. 콜백보다는 프로미스를 사용하자.
 * 2. 프로미스를 생성하기 보다는 async/await을 사용하자.
 * 3. 어떤 함수가 프로미스를 반환한다면 async로 선언하는 것이 좋다.
 */
