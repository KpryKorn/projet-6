package oc.mdd.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
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
        findUser(userId).getSubscribedSubjects().add(findSubject(subjectId));
    }

    public void unsubscribeUserFromSubject(Long userId, Long subjectId) {
        findUser(userId).getSubscribedSubjects().remove(findSubject(subjectId));
    }

    @Transactional(readOnly = true)
    public List<SubjectDto> getUserSubscribedSubjects(Long userId) {
        return findUser(userId).getSubscribedSubjects().stream()
                .sorted(Comparator.comparing(Subject::getTitle))
                .map(subjectMapper::toDto)
                .toList();
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur introuvable."));
    }

    private Subject findSubject(Long subjectId) {
        return subjectRepository.findById(subjectId)
                .orElseThrow(() -> new EntityNotFoundException("Ce thème n’existe pas."));
    }
}
