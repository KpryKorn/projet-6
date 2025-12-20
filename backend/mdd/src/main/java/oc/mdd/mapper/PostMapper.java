package oc.mdd.mapper;

import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

import oc.mdd.dto.PostDto;
import oc.mdd.entity.Post;

@Component
@Mapper(componentModel = "spring")
public interface PostMapper {

    PostDto toDto(Post post);
}
