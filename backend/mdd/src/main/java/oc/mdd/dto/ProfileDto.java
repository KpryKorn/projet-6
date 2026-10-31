package oc.mdd.dto;

import java.sql.Timestamp;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Public profile page of a user. */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileDto {
    private Long id;
    private String username;
    private String bio;
    private Timestamp createdAt;
    private long postCount;
    private long commentCount;
    private long usefulReceived;
    private List<SubjectDto> subjects;
}
