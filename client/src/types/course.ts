export interface CourseLocationSearch {
  name: string;
  city: string;
  postalCode: string;
  address: string;
  distanceToUserCoordinates: number;
  lat: number;
  lon: number;
}