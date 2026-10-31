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
public class SubjectDto {
    private Long id;
    private String title;
    private String description;
    private String color;
    private String shortName;
    private Timestamp createdAt;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long followerCount;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long postCount;
}
