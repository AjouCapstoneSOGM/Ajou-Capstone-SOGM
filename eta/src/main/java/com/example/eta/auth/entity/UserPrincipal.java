package com.example.eta.auth.entity;

import com.example.eta.entity.User;
import com.example.eta.auth.enums.RoleType;
import com.example.eta.auth.enums.SocialType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

import static com.example.eta.auth.enums.RoleType.ROLE_USER;

@Getter
@Setter
@RequiredArgsConstructor
public class UserPrincipal implements UserDetails {

    private final String email;
    private final String password;
    private final String name;
    private final RoleType roleType;
    private final SocialType socialType;
    private final Boolean enabled;

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(ROLE_USER.name()));
    }

    public static UserPrincipal create(User user) {
        return new UserPrincipal(
                user.getEmail(),
                user.getPassword(),
                user.getName(),
                user.getRoleType(),
                user.getSocialType(),
                user.getEnabled()
        );
    }
}
