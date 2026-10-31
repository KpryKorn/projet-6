package oc.mdd.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "L’adresse email est obligatoire.")
    @Email(message = "Le format de l’adresse email est invalide.")
    private String email;

    @NotBlank(message = "Le pseudo est obligatoire.")
    @Size(min = 3, max = 30, message = "Le pseudo doit contenir entre 3 et 30 caractères.")
    private String username;

    @NotBlank(message = "Le mot de passe est obligatoire.")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères.")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", message = "Le mot de passe doit contenir une minuscule, une majuscule, un chiffre et un caractère spécial.")
    private String password;
}
