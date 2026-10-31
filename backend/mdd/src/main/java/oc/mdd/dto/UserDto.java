package oc.mdd.dto;

import java.sql.Timestamp;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Private view of the signed in account. Never expose it to other users. */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String bio;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private Set<SubjectDto> subscribedSubjects;
}
