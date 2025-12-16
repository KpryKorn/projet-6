package oc.mdd.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import oc.mdd.dto.SubjectDto;
import oc.mdd.mapper.SubjectMapper;
import oc.mdd.repository.SubjectRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class SubjectService {
    private final SubjectRepository subjectRepository;
    private final SubjectMapper mapper;

    public List<SubjectDto> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(mapper::toDto)
                .toList();
    }

    public SubjectDto getSubjectById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Subject id cannot be null");
        }

        return subjectRepository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Subject not found with id: " + id));
    }
}
