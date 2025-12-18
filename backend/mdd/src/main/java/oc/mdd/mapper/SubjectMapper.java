package oc.mdd.mapper;

import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

import oc.mdd.dto.SubjectDto;
import oc.mdd.entity.Subject;

@Component
@Mapper(componentModel = "spring")
public interface SubjectMapper {

    SubjectDto toDto(Subject subject);
}
