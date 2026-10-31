package oc.mdd.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequestDto {
    @Size(min = 3, max = 30, message = "Le pseudo doit contenir entre 3 et 30 caractères.")
    private String username;

    @Size(max = 280, message = "La présentation ne peut pas dépasser 280 caractères.")
    private String bio;

    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères.")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", message = "Le mot de passe doit contenir une minuscule, une majuscule, un chiffre et un caractère spécial.")
    private String password;
}
