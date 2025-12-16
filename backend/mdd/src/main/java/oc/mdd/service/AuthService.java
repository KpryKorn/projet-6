package oc.mdd.service;

import oc.mdd.dto.auth.AuthResponse;
import oc.mdd.dto.auth.LoginRequest;
import oc.mdd.dto.auth.RegisterRequest;
import oc.mdd.entity.User;
import oc.mdd.exception.InvalidTokenException;
import oc.mdd.exception.UserAlreadyExistsException;
import oc.mdd.repository.UserRepository;
import oc.mdd.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        public AuthResponse register(RegisterRequest request) {
                userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
                        throw new UserAlreadyExistsException(
                                        "User with email " + request.getEmail() + " already exists");
                });
                User user = User.builder()
                                .username(request.getUsername())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .build();
                userRepository.save(user);
                String accessToken = jwtService.generateToken(user);
                String refreshToken = jwtService.generateRefreshToken(user);
                return AuthResponse.builder()
                                .accessToken(accessToken)
                                .refreshToken(refreshToken)
                                .build();
        }

        public AuthResponse login(LoginRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));
                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow();
                String accessToken = jwtService.generateToken(user);
                String refreshToken = jwtService.generateRefreshToken(user);
                return AuthResponse.builder()
                                .accessToken(accessToken)
                                .refreshToken(refreshToken)
                                .build();
        }

        public AuthResponse refreshToken(String refreshToken) {
                String userEmail = jwtService.extractUserEmail(refreshToken);
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
                if (jwtService.isTokenValid(refreshToken, user)) {
                        String accessToken = jwtService.generateToken(user);
                        return AuthResponse.builder()
                                        .accessToken(accessToken)
                                        .refreshToken(refreshToken)
                                        .build();
                }
                throw new InvalidTokenException("Invalid refresh token");
        }
}
