package oc.mdd.service;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import oc.mdd.dto.SubjectDto;
import oc.mdd.mapper.SubjectMapper;
import oc.mdd.repository.SubjectRepository;

@Service
@RequiredArgsConstructor
public class SubjectService {
    private final SubjectRepository subjectRepository;
    private final SubjectMapper mapper;

    public List<SubjectDto> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(mapper::toDto)
                .toList();
    }
}
