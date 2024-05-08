/**
 * 29장 사용할 때는 너그럽게, 생성할 때는 엄격하게
 * 힘수 시그니처에서 함수의 매개변수는 타입의 범위가 넓어도 되지만, 결과를 반환할 때는 일반적으로 타입의 범위가 더 구체적이어야 한다.
 */

// 3D 매핑
// interface CameraOtions {
//   center?: LngLat;
//   zoom?: number;
//   bearing?: number;
//   pitch?: number;
// }

// type LngLat =
//   | { lng: number; lat: number }
//   | { lon: number; lat: number }
//   | [number, number];

// type LngLatBounds =
//   | { northeast: LngLat; southwest: LngLat }
//   | [LngLat, LngLat]
//   | [number, number, number, number];

interface LngLat {
  lag: number;
  lat: number;
}

type LngLatLike = LngLat | { lon: number; lat: number } | [number, number];

interface Camera {
  center: LngLat;
  zoom: number;
  bearing: number;
  pitch: number;
}

// Camera에서 center를 제외한 새로운 객체를 만든 것
interface CameraOptions extends Omit<Partial<Camera>, "center"> {
  center?: LngLatLike; // center만 다시 타입을 설정하기 위한 것
}

// 이거랑 같은 거임
// interface CameraOptions2 {
//   center?: LngLatLike;
//   zoom?: number;
//   bearing?: number;
//   pitch?: number;
// }

type LngLatBounds =
  | { northeast: LngLatLike; southwest: LngLatLike }
  | [LngLatLike, LngLatLike]
  | [number, number, number, number];

// 카메라 위치 지정
declare function setCamera(camera: CameraOptions): void;

// 경계 박스의 뷰포트 계산
declare function viewportForBounds(bounds: LngLatBounds): Camera;
