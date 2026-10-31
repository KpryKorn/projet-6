package oc.mdd.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequestDto {
    @NotBlank(message = "Le commentaire ne peut pas être vide.")
    @Size(max = 2000, message = "Le commentaire ne peut pas dépasser 2 000 caractères.")
    private String content;

    @NotNull
    private Long postId;
}
