package oc.mdd.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Public view of a user, safe to embed in posts and comments. */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthorDto {
    private Long id;
    private String username;
    private String bio;
}
