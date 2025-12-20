package oc.mdd.dto;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class CommentDto {
    private Long id;
    private String content;
    private UserDto author;
    private PostDto post;
    private Timestamp createdAt;
}
