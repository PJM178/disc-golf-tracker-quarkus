package dev.local.myproject.course.dto;

import java.util.List;
import java.util.UUID;

public class CoursesLocationCursorDto {

    public List<CourseLocationDto> data;
    public Cursor nextCursor;

    public CoursesLocationCursorDto(List<CourseLocationDto> data, double cursorDistance, UUID cursorUuid) {
        this.data = data;

        if (cursorUuid != null) {
            this.nextCursor = new Cursor(cursorDistance, cursorUuid);
        }
    }

    private static class Cursor {

        @SuppressWarnings("unused")
        public double distance;

        @SuppressWarnings("unused")
        public UUID uuid;

        private Cursor(double distance, UUID uuid) {
            this.distance = distance;
            this.uuid = uuid;
        }
    }
}
