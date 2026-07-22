package com.exampal.security;

import com.exampal.model.User;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {}

    public static User currentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User user) {
            return user;
        }
        return null;
    }

    public static User requireUser() {
        User user = currentUser();
        if (user == null) {
            throw new UnauthorizedException("Not authorized, no token");
        }
        return user;
    }

    public static void requireRole(User user, String... roles) {
        for (String role : roles) {
            if (role.equalsIgnoreCase(user.getRole())) {
                return;
            }
        }
        throw new ForbiddenException("Not authorized, insufficient permissions");
    }
}
