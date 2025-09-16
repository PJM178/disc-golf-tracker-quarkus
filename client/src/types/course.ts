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

export interface CourseTextSearch extends CourseBase {
  name: string;
  city: string;
  postalCode: string;
  address: string;
}

export interface LocationCursor {
  distance: number;
  uuid: string;
}

export interface CursorPaginatedCourseLocationSearch {
  data: CourseLocationSearch[];
  nextCursor: LocationCursor | null;
}

export interface TextCursor {
  uuid: string;
}

export interface CursorPaginatedCourseTextSearch {
  data: CourseTextSearch[];
  nextCursor: TextCursor | null;
}