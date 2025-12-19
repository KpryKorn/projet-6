package oc.mdd.dto;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDto {
    private String id;

    private String title;
    private String content;
    private Timestamp createdAt;
    private UserDto author;
    private SubjectDto subject;
}
