package oc.mdd.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostRequestDto {
    @NotNull(message = "Choisissez un thème pour votre article.")
    private Long subjectId;

    @NotBlank(message = "Le titre est obligatoire.")
    @Size(max = 150, message = "Le titre ne peut pas dépasser 150 caractères.")
    private String title;

    @NotBlank(message = "Le contenu est obligatoire.")
    @Size(max = 20000, message = "Le contenu ne peut pas dépasser 20 000 caractères.")
    private String content;
}
