package oc.mdd.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import oc.mdd.dto.SubjectDto;
import oc.mdd.entity.Subject;
import oc.mdd.mapper.SubjectMapper;
import oc.mdd.repository.EngagementRepository;
import oc.mdd.repository.EngagementRepository.IdCount;
import oc.mdd.repository.SubjectRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final EngagementRepository engagementRepository;
    private final SubjectMapper mapper;

    public List<SubjectDto> getAllSubjects() {
        Map<Long, Long> followers = toMap(engagementRepository.countFollowersBySubject());
        Map<Long, Long> posts = toMap(engagementRepository.countPostsBySubject());
        return subjectRepository.findAll(Sort.by("title")).stream()
                .map(subject -> withCounts(subject, followers, posts))
                .toList();
    }

    public SubjectDto getSubjectById(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ce thème n’existe pas."));
        return withCounts(subject, toMap(engagementRepository.countFollowersBySubject()),
                toMap(engagementRepository.countPostsBySubject()));
    }

    private SubjectDto withCounts(Subject subject, Map<Long, Long> followers, Map<Long, Long> posts) {
        SubjectDto dto = mapper.toDto(subject);
        dto.setFollowerCount(followers.getOrDefault(subject.getId(), 0L));
        dto.setPostCount(posts.getOrDefault(subject.getId(), 0L));
        return dto;
    }

    private static Map<Long, Long> toMap(List<IdCount> rows) {
        Map<Long, Long> map = new HashMap<>();
        rows.forEach(row -> map.put(row.getId(), row.getTotal()));
        return map;
    }
}
