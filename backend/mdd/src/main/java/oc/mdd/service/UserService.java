package oc.mdd.service;

import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import oc.mdd.dto.UserDto;
import oc.mdd.dto.UserRequestDto;
import oc.mdd.mapper.UserMapper;
import oc.mdd.repository.UserRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final UserMapper mapper;

    public UserDto getUserById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }

        return userRepository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public UserDto patchUser(Long id, UserRequestDto userRequestDto) {
        if (id == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }

        if (userRequestDto == null) {
            throw new IllegalArgumentException("Request payload cannot be null");
        }

        return userRepository.findById(id)
                .map(user -> {
                    Optional.ofNullable(userRequestDto.getUsername()).ifPresent(user::setUsername);
                    Optional.ofNullable(userRequestDto.getEmail()).ifPresent(user::setEmail);
                    Optional.ofNullable(userRequestDto.getPassword()).map(passwordEncoder::encode)
                            .ifPresent(user::setPassword);

                    return userRepository.save(user);
                })
                .map(mapper::toDto)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
}
