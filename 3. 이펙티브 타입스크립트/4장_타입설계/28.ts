/**
 * 28장 유효한 상태만 표현하는 타입을 지향하기
 */

interface State {
  pageText: string;
  isLoading: boolean;
  error?: string;
}

declare let currentPage: string;

function renderPage(state: State) {
  if (state.error) {
    return `Error! Unable to load ${currentPage}: ${state.error}`;
  } else if (state.isLoading) {
    return `Loading ${currentPage}...`;
  }
  return `<h1>${currentPage}</h1>\n${state.pageText}`;
}

/**
 * 위 코드는 분기 조건이 명확히 분리되어 있지 않다는 것을 알 수 있다.
 * isLoading이 true이고 동시에 error 값이 존재하면 로딩 중인 상태인지 오류가 발생한 상태인지 명확히 구분할 수 없다.
 * 필요 정보가 부족하기 때문
 */

function getUrlForPage(p: string) {
  return "";
}

async function changePage(state: State, newPage: string) {
  state.isLoading = true;
  try {
    const response = await fetch(getUrlForPage(newPage));
    if (!response.ok) {
      throw new Error(`Unable to load ${newPage}: ${response.statusText}`);
    }
    const text = await response.text();
    state.isLoading = false;
    state.pageText = text;
  } catch (error) {
    state.error = "" + error;
  }
}

/**
 * changePage 함수에도 문제점이 있다.
 * 1. 오류 발생 시 state.isLoading을 false로 설정하는 로직이 빠져잇다
 * 2. state.error를 초기화하지 않았기 때문에, 페이지 전환 중에 로딩 메시지 대신 과거의 오류 메시지를 보여주게 된다.
 * 3. 페이지 로딩 중 사용자가 페이지를 바꿔버리면 어떤 일이 벌어질지 예상하기 어렵다. 새 페이지에 오류가 뜨거나, 응답이 오는 순서에 따라 두 번째 페이지가 아닌 첫 번째 페이지로 전환될 수 있다.
 */

// ----- 즉, 현재 문제는
// State 타입이 isLoading이 true이면서 동시에 error 값이 설정되는 무효한 상태를 허용하므로
// 요청이 실패한 것인지 여전히 로딩 중인지 알 수 없다는 것이다.
// 무효한 상태가 존재하면 render()와 changePage()를 둘 다 제대로 구현할 수 없게 된다.

// ----- 여기서, 상태를 제대로 표현해보자.

// 무효한 상태를 허용하지 않도록 개선한 코드.
interface RequestPending {
  state: "pending";
}

interface RequestError {
  state: "error";
  error: string;
}

interface RequestSuccess {
  state: "ok";
  pageText: string;
}

type RequestState = RequestPending | RequestError | RequestSuccess;

interface State2 {
  currentPage: string;
  requests: { [page: string]: RequestState };
}

function renderPage2(state: State2) {
  const { currentPage } = state;
  const requestState = state.requests[currentPage];
  switch (requestState.state) {
    case "pending":
      return `Loading ${currentPage}...`;
    case "error":
      return `Error! Unable to load ${currentPage}: ${requestState.error}`;
    case "ok":
      return `<h1>${currentPage}</h1>\n${requestState.pageText}`;
  }
}

async function changePage2(state: State2, newPage: string) {
  state.requests[newPage] = { state: "pending" };
  state.currentPage = newPage;
  try {
    const response = await fetch(getUrlForPage(newPage));
    if (!response.ok) {
      throw new Error(`Unable to load ${newPage}: ${response.statusText}`);
    }
    const pageText = await response.text();
    state.requests[newPage] = { state: "ok", pageText };
  } catch (e) {
    state.requests[newPage] = { state: "error", error: "" + e };
  }
}

export default {};
