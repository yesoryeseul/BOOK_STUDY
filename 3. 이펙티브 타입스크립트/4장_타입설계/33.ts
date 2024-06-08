/**
 * 아이템 33 string타입보다 구체적인 타입 사용하기
 */
interface Album {
  artist: string;
  title: string;
  releaseDate: string; // YYYY-MM-DD
  recordingType: string; // 예를 들어, 'live' 또는 'studio'
}

// string 타입이 남발된 모습이다.

const kindOfBlue: Album = {
  artist: "aespa",
  title: "supernova",
  releaseDate: "24.05.14", // 날짜 형식이 다르다.
  recordingType: "Studio", // 오타(대문자)
};

// 그러나 string 형태이므로 주석의 형태와 달라도 에러가 나지 않는 모습이다.

// string 타입의 범위가 넓기 때문에 제대로 된 Album 객체를 사용하더라도 매개변수 순서가 잘못된 것이 오류로 드러나지 않는다.

function recordRelease(title: string, date: string) {}
recordRelease(kindOfBlue.releaseDate, kindOfBlue.title); // 오류여야 하지만 정상

// 위 오류를 방지하기 위해 타입을 좁히는 방법
type RecordingType = "live" | "studio";

interface Album2 {
  artist: string;
  title: string;
  releaseDate: Date;
  recordingType: RecordingType;
}

const kindOfBlue2: Album2 = {
  artist: "aespa",
  title: "supernova",
  releaseDate: new Date("2024-05-14"),
  recordingType: "Studio", // '"Studio"' 형식은 'RecordingType' 형식에 할당할 수 없습니다. '"studio"'을(를) 의미했나요?ts(2820)
};

/**
 * 위와 같은 방식에는 3가지 장점이 있다.
 *
 * 1. 타입을 명시적으로 정의함으로써 다른 곳으로 값이 전달되어도 타입 정보가 유지된다.
 * 예를 들어, 특정 레코딩 타입의 앨범을 찾는 함수를 작성한다면 아래와 같이 작성 가능하다.
 */

// function getAlbumsOfType(recordingType: string): Album[] {}

// -> 그러나, recordingType이 string인 것외에 어떤 정보도 알 수 없다.
// Album 인터페이스에만 'live', 'studio' 타입인 것을 알 수 있고 사용하는 사람은 recordingType이 'live', 'studio' 중 사용해야하는지 알 수 없다.

// 2. 타입을 명시적으로 정의하고 해당 타입의 의미를 설명하는 주석을 붙여 넣을 . 수 있다.

function getAlbumsOfType(recordingType: RecordingType): Album2[] {}
// 편집기에 recordingType이 type RecordingType = "live" | "studio" 을 사용하는 것을 알 수 있다.

// 3. keyof 연산자로 더욱 세밀하게 객체의 속성 체크가 가능해진다.
function pluck(records: any[], key: string) {
  return records.map((r) => r[key]);
}

// 타입 체크가 되긴 하나 any 타입이 있어 정밀하지 못하다. 특히 반환값에 any를 사용하는 것은 매우 좋지 않은 설계다.

// 먼저, 타입 시그니처를 개선하는 첫 단계로 제너릭 타입을 도입해 보겠다.

function pluck2<T>(records: T[], key: string): any[] {
  return records.map((r) => r[key]);
}

// string은 너무 넓은 범위가 되어 버린다. 이때 type K = keyof Album;을 한다고 하면 key는 artist, title, releaseDate, recordingType으로 제한이 되어 버린다.

// 이때 keyof T로 바꾸면 된다!

function pluck3<T>(records: T[], key: keyof T) {
  return records.map((r) => r[key]);
}

/**
 * function pluck3<T>(records: T[], key: keyof T): T[keyof T][]
 * T[keyof T]는 T 객체 내의 가능한 모든 값의 타입이다.
 * 그런데 key의 값으로 하나의 문자열을 넣게 되면, 그 범위가 너무 넓어서 적절한 타입이라고 보기 어렵다. 예를 들어 보자.
 */

const albums: Album2[] = [
  {
    artist: "aespa",
    title: "supernova",
    releaseDate: new Date("2024-05-14"),
    recordingType: "studio",
  },
];

const releaseDates = pluck3(albums, "releaseDate"); // 타입이 (string | Date)[]

// releaseDates의 타입은 (string | Date)[]가 아니라 Date[]여야 한다. keyof T는 string에 비하면 훨씬 범위가 좁기는 하지만 그래도 여전히 넓다. ** 따라서, 범위를 더 좁히기 위해 keyof T의 부분 집합으로 두 번째 제너릭 매개변수를 도입해야 한다.

function pluck4<T, K extends keyof T>(records: T[], key: K): T[K][] {
  return records.map((r) => r[key]);
}

const _releaseDates = pluck4(albums, "releaseDate"); // 타입이 Date[]
const _artist = pluck4(albums, "artist"); // 타입이 string[]
const _recordingType = pluck4(albums, "recordingType"); // 타입이 RecordingType[]
const _recordingDate = pluck4(albums, "recordingDate"); // "recordingDate"' 형식의 인수는 'keyof Album2' 형식의 매개 변수에 할당될 수 없습니다.ts(2345)

/**
 * 매개변수 타입이 정밀해진 덕분에 언어 서비스는 Album2의 키에 자동 완성 기능을 제공할 수 있게 해준다.
 *
 * string은 any와 비슷한 문제를 가지고 있다. 따라서 잘못 사용하게 되면 무효한 값을 허용하고 타입 간의 관계도 감추어 버린다. 이러한 문제점은 타입 체커를 방해하고 실제 버그를 찾지 못하게 만든다. 타입스크립트에서 string 부분 집합을 정의할 수 있는 기능은 자바스크립트 코드에 타입 안전성을 크게 높인다.
 *
 * 요약
 * - '문자열을 남발하여 선언된' 코드를 피하자. 모든 문자열을 할당할 수 있는 string 타입보다는 더 구체적인 타입을 사용하는 것이 좋다.
 *
 * - 변수의 범위를 보다 정확하게 표현하고 싶다면 string 타입보다는 문자열 리터럴 타입의 유니온을 사용하면 된다.
 *
 * - 객체의 속성 이름을 함수 매개변수로 받을 때는 string보다 keyof T를 사용하는 것이 좋다.
 */
