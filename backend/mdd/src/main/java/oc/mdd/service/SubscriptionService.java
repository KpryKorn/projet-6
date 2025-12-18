package oc.mdd.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import oc.mdd.dto.SubjectDto;
import oc.mdd.entity.Subject;
import oc.mdd.entity.User;
import oc.mdd.mapper.SubjectMapper;
import oc.mdd.repository.SubjectRepository;
import oc.mdd.repository.UserRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class SubscriptionService {

    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final SubjectMapper subjectMapper;

    public void subscribeUserToSubject(Long userId, Long subjectId) {
        if (userId == null || subjectId == null) {
            throw new IllegalArgumentException("User id and Subject id cannot be null");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new IllegalArgumentException("Subject not found with id: " + subjectId));

        user.getSubscribedSubjects().add(subject);
    }

    public void unsubscribeUserFromSubject(Long userId, Long subjectId) {
        if (userId == null || subjectId == null) {
            throw new IllegalArgumentException("User id and Subject id cannot be null");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new IllegalArgumentException("Subject not found with id: " + subjectId));

        user.getSubscribedSubjects().remove(subject);
    }

    public List<SubjectDto> getUserSubscribedSubjects(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User id cannot be null");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        return user.getSubscribedSubjects().stream()
                .map(subjectMapper::toDto)
                .toList();
    }
}
