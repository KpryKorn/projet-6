package oc.mdd.mapper;

import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

import oc.mdd.dto.CommentDto;
import oc.mdd.entity.Comment;

@Component
@Mapper(componentModel = "spring")
public interface CommentMapper {

    CommentDto toDto(Comment comment);
}
