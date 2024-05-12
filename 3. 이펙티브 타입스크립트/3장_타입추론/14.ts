// 아이템 14 타입 연산과 제너릭 사용으로 반복 줄이기

// 1. 타입 중복은 코드 중복만큼 많은 문제를 발생시킨다.

// Person에 middleName을 추가하면 PersonWithBirthDate과 전혀 다른 타입이 된다.
interface Person {
  firstName: string;
  middleName: string;
  lastName: string;
}

interface PersonWithBirthDate {
  firstName: string;
  lastName: string;
  birth: string;
}

interface Options {}

type HTTPFunction = (url: string, opts: Options) => {};
function get(url: string, opts: Options): Promise<Response> {
  return Promise.resolve(new Response());
}
function post(url: string, opts: Options): Promise<Response> {
  return Promise.resolve(new Response());
}
