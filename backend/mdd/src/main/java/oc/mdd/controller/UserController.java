package oc.mdd.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import oc.mdd.dto.SubjectDto;
import oc.mdd.dto.UserDto;
import oc.mdd.dto.UserRequestDto;
import oc.mdd.entity.User;
import oc.mdd.service.SubscriptionService;
import oc.mdd.service.UserService;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final SubscriptionService subscriptionService;

    @GetMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public UserDto me(@AuthenticationPrincipal User currentUser) {

        UserDto userDto = userService.getUserById(currentUser.getId());
        return userDto;
    }

    @PatchMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public UserDto updateMe(@AuthenticationPrincipal User currentUser, @RequestBody UserRequestDto userRequestDto) {

        UserDto updatedUserDto = userService.patchUser(currentUser.getId(), userRequestDto);
        return updatedUserDto;
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public UserDto getUserById(@PathVariable Long id) {
        UserDto userDto = userService.getUserById(id);
        return userDto;
    }

    @GetMapping("/me/subscriptions")
    @ResponseStatus(HttpStatus.OK)
    public List<SubjectDto> getMySubscriptions(@AuthenticationPrincipal User currentUser) {
        return subscriptionService.getUserSubscribedSubjects(currentUser.getId());
    }
}
