package dev.local.myproject.course.dto;

import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CourseSearchTextCursorDto {
    public List<CourseDto> data;
    public Cursor nextCursor;

    public CourseSearchTextCursorDto(List<CourseDto> data, UUID nextUuid) {
        this.data = data;

        if (nextUuid != null) {
            this.nextCursor = new Cursor(nextUuid);
        }
    }

    public CourseSearchTextCursorDto(List<CourseDto> data) {
        this.data = data;
    }

    private static class Cursor {

        @JsonProperty
        public UUID uuid;

        private Cursor(UUID uuid) {
            this.uuid = uuid;
        }
    }
}
