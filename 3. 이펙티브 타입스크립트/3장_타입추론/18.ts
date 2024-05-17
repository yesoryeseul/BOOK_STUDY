// 18장 매핑된 타입을 사용하여 값을 동기화하기

interface ScatterProps {
  // The data
  xs: number[];
  ys: number[];

  // Display
  xRange: [number, number];
  yRange: [number, number];
  color: string;

  // Events
  onClick: (x: number, y: number, index: number) => void;

  // 새로운 속성을 추가했을 때
  // onDoubleClick: () => void;
}

/**
 * 불필요한 작업을 피하기 위해, 필요할 때에만 차트를 다시 그릴 수 있습니다.
 * 데이터나 디스플레이 속성이 변경되면 다시 그려야 하지만, 이벤트 핸들러가 변경되면
 * 다시 그릴 필요가 없다.
 * 이런 종류의 최적화는 리액트 컴포넌트에서는 일반적인 일인데
 * 렌더링할 때마다 이벤트 핸들러 Prop이 새 화살표 함수로 설정됩니다.
 */

// 1) 첫 번째 최적화 방법, 보수적 접근법 또는 실패에 닫힌 접근법
// 차트가 정확하나 너무 자주 그려질 가능성이 있다.
function shouldUpdate(oldProps: ScatterProps, newProps: ScatterProps) {
  let k: keyof ScatterProps;
  for (k in oldProps) {
    if (oldProps[k] !== newProps[k]) {
      if (k !== "onClick") return true;
    }
  }
  return false;
}

// 2. 실패에 열린 접근법
// 이 코드는 차트를 불필요하게 다시 그리는 단점을 해결하지만
// 실제로 차트를 다시 그려야 할 경우에 누락되는 일이 생길 수 있다.
function shouldUpdate2(oldProps: ScatterProps, newProps: ScatterProps) {
  return (
    oldProps.xs !== newProps.xs ||
    oldProps.ys !== newProps.ys ||
    oldProps.xRange !== newProps.xRange ||
    oldProps.yRange !== newProps.yRange ||
    oldProps.color !== newProps.color
    // (no check for onClick)
  );
}

// 위 두가지 방법은 이상적이지 않다.
// 새로운 속성이 추가될 때 직접 shouldUpdate를 고치도록 하는 게 낫다.

const REQUIRES_UPDATE: { [k in keyof ScatterProps]: boolean } = {
  xs: true,
  ys: true,
  xRange: true,
  yRange: true,
  color: true,
  onClick: false,
};

function shouldUpdate3(oldProps: ScatterProps, newProps: ScatterProps) {
  let k: keyof ScatterProps;
  for (k in oldProps) {
    if (oldProps[k] !== newProps[k] && REQUIRES_UPDATE[k]) {
      return true;
    }
  }
  return false;
}

/**
 * [k in keyof ScatterProps]은 타입체커에게 REQUIRES_UPDATE가 catterProps
 * 과 동일한 속성을 가져야 한다는 정보를 제공한다.
 */
