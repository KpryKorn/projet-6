package oc.mdd.dto;

import java.sql.Timestamp;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import oc.mdd.entity.Subject;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private Set<Subject> subscribedSubjects;
}
