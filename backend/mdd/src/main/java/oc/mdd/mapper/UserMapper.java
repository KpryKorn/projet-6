package oc.mdd.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import oc.mdd.dto.UserDto;
import oc.mdd.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toDto(User user);

    @Mapping(target = "password", ignore = true)
    User toEntity(UserDto userDto);
}
