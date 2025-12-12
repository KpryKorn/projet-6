package oc.mdd.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

import oc.mdd.dto.UserDto;
import oc.mdd.entity.User;

@Component
@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "realUsername", target = "username")
    UserDto toDto(User user);

    @Mapping(target = "password", ignore = true)
    User toEntity(UserDto userDto);
}
