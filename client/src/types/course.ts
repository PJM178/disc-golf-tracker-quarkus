interface CourseBase {
  uuid: string;
}

export interface CourseLocationSearch extends CourseBase {
  name: string;
  city: string;
  postalCode: string;
  address: string;
  distanceToUserCoordinates: number;
  lat: number;
  lon: number;
}