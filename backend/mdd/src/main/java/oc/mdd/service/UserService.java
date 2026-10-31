package oc.mdd.service;

import java.util.Comparator;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import oc.mdd.dto.ProfileDto;
import oc.mdd.dto.SubjectDto;
import oc.mdd.dto.UserDto;
import oc.mdd.dto.UserRequestDto;
import oc.mdd.entity.Subject;
import oc.mdd.entity.User;
import oc.mdd.exception.UserAlreadyExistsException;
import oc.mdd.mapper.SubjectMapper;
import oc.mdd.mapper.UserMapper;
import oc.mdd.repository.CommentRepository;
import oc.mdd.repository.EngagementRepository;
import oc.mdd.repository.PostRepository;
import oc.mdd.repository.UserRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final EngagementRepository engagementRepository;
    private final UserMapper mapper;
    private final SubjectMapper subjectMapper;

    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        return mapper.toDto(findUser(id));
    }

    @Transactional(readOnly = true)
    public ProfileDto getProfile(Long id) {
        User user = findUser(id);
        return ProfileDto.builder()
                .id(user.getId())
                .username(user.getRealUsername())
                .bio(user.getBio())
                .createdAt(user.getCreatedAt())
                .postCount(postRepository.countByAuthorId(id))
                .commentCount(commentRepository.countByAuthorId(id))
                .usefulReceived(engagementRepository.countReactionsReceivedByAuthor(id))
                .subjects(user.getSubscribedSubjects().stream()
                        .sorted(Comparator.comparing(Subject::getTitle))
                        .map(subjectMapper::toDto)
                        .toList())
                .build();
    }

    public UserDto patchUser(Long id, UserRequestDto request) {
        User user = findUser(id);

        if (request.getUsername() != null && !request.getUsername().equals(user.getRealUsername())) {
            String username = request.getUsername().trim();
            if (userRepository.existsByUsername(username)) {
                throw new UserAlreadyExistsException("Ce pseudo est déjà utilisé.");
            }
            user.setUsername(username);
        }
        if (request.getBio() != null) {
            String bio = request.getBio().trim();
            user.setBio(bio.isEmpty() ? null : bio);
        }
        if (request.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        return mapper.toDto(userRepository.save(user));
    }

    private User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur introuvable."));
    }
}
