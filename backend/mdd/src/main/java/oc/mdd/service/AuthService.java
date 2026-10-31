package oc.mdd.service;

import java.util.Locale;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import oc.mdd.dto.auth.AuthResponse;
import oc.mdd.dto.auth.LoginRequest;
import oc.mdd.dto.auth.RegisterRequest;
import oc.mdd.entity.User;
import oc.mdd.exception.InvalidTokenException;
import oc.mdd.exception.UserAlreadyExistsException;
import oc.mdd.repository.UserRepository;
import oc.mdd.security.JwtService;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        String email = normalize(request.getEmail());
        String username = request.getUsername().trim();

        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException("Un compte existe déjà avec cette adresse email.");
        }
        if (userRepository.existsByUsername(username)) {
            throw new UserAlreadyExistsException("Ce pseudo est déjà utilisé.");
        }

        User user = userRepository.save(User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .build());
        return tokensFor(user);
    }

    public AuthResponse login(LoginRequest request) {
        String email = normalize(request.getEmail());
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.getPassword()));
        return tokensFor(userRepository.findByEmail(email).orElseThrow());
    }

    public AuthResponse refreshToken(String refreshToken) {
        String userEmail = jwtService.extractUserEmail(refreshToken);
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!jwtService.isTokenValid(refreshToken, user)) {
            throw new InvalidTokenException("Invalid refresh token");
        }
        return AuthResponse.builder()
                .accessToken(jwtService.generateToken(user))
                .refreshToken(refreshToken)
                .build();
    }

    private AuthResponse tokensFor(User user) {
        return AuthResponse.builder()
                .accessToken(jwtService.generateToken(user))
                .refreshToken(jwtService.generateRefreshToken(user))
                .build();
    }

    private static String normalize(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
