/**
 * 아이템 32 유니온의 인터페이스보다는 인터페이스의 유니온을 사용하기
 */

interface Layer {
  layout: FillLayout | LineLayout | PointLayout;
  paint: FillPaint | LinePaint | PointPaint;
}

// -> layout이 LineLayout 이면서 paint 속성이 FillPaint 타입인 것은 말이 되지 않고 오류나 다루기 어려워진다.

interface FillLayer {
  layout: FillLayout;
  paint: FillPaint;
}

interface LineLayer {
  layout: LineLayout;
  paint: LinePaint;
}

interface PointLayer {
  layout: PointLayout;
  paint: PointPaint;
}

type Layer = FillLayer | LineLayer | PointLayer;

// 이런 형태로 정의한다면, 잘못된 조합으로 섞이는 경우 방지 가능

// 다른 일반적인 예시는 문자열 리터럴 타입

interface Layer {
  type: "fill" | "line" | "point";
  layout: FillLayout | LineLayout | PointLayout;
  paint: FillPaint | LinePaint | PointPaint;
}

interface FillLayer {
  type: "fill";
  layout: FillLayout;
  paint: FillPaint;
}

interface LineLayer {
  type: "line";
  layout: LineLayout;
  paint: LinePaint;
}

interface PointLayer {
  type: "point";
  layout: PointLayout;
  paint: PointPaint;
}

type Layer = FillLayer | LineLayer | PointLayer;

// type 속성은 '태그'이며 런타임에 어떤 타입의 Layer가 사용되는지 판단하는 데 쓰인다. 태그를 참고하여 Layer의 타입 범위를 좁힐 수도 있다.

function drawLayer(layer: Layer) {
  if (layer.type === "fill") {
    const { paint } = layer; // 타입이 FillPaint
    const { layout } = layer; // 타입이 FillLayout
  } else if (layer.type === "line") {
    const { paint } = layer; // 타입이 LinePaint
    const { layout } = layer; // 타입이 LineLayout
  } else {
    const { paint } = layer; // 타입이 PointPaint
    const { layout } = layer; // 타입이 PointLayout
  }
  // ...
}

/**
 * 여러 개의 선택적 필드가 동시에 값이 있거나 undefined인 경우도 태그된 유니온 패턴이 잘 맞는다
 */

interface Person {
  name: string;
  // 다음은 둘 다 동시에 있거나 없다.
  placeOfBirth?: string;
  dateOfBirth?: Date;
}

interface Person {
  name: string;
  birth?: {
    place: string;
    date: Date;
  };
}

// 두 개의 속성을 하나의 객체로 묶는 것이 더 낫다.

// Person 객체를 매개변수로 받는 함수는 birth 하나만 체크하면 된다.
function eulogize(p: Person) {
  console.log(p.name);
  const { birth } = p;
  if (birth) {
    console.log(`was born on ${birth.date} in ${birth.place}`);
  }
}

/**
 * 타입의 구조를 손 댈 수 없는 상황(예를 들어 API의 결과)이면, 앞서 다룬 인터페이스의 유니온을 사용해서 속성 사이의 관계를 모델링할 수 있다.
 */

interface Name {
  name: string;
}

interface PersonWithBirth extends Name {
  placeOfBirth: string;
  dateOfBirth: Date;
}

type Person2 = Name | PersonWithBirth;

// 이제 중첩된 객체에서도 효과를 볼 수 있다.
function eulogize2(p: Person2) {
  if ("placeOfBirth" in p) {
    p; // 타입이 PersonWithBirth
    const { dateOfBirth } = p; // 정상, 타입이 Date
  }
}
