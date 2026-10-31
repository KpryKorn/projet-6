package oc.mdd.dto;

import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDto {
    private Long id;
    private String title;
    private String excerpt;

    /** Only present on the detail endpoint. */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String content;

    private int readingMinutes;
    private Timestamp createdAt;
    private AuthorDto author;
    private SubjectDto subject;
    private long usefulCount;
    private long commentCount;
    private boolean viewerHasReacted;
    private boolean viewerHasBookmarked;
}
