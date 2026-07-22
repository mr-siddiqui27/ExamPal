package com.exampal.security;

import com.exampal.config.AppProperties;
import com.exampal.model.User;
import com.exampal.repository.UserRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final AppProperties appProperties;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider, UserRepository userRepository, AppProperties appProperties) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
        this.appProperties = appProperties;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (appProperties.isAuthDisabled()) {
            User devUser = createDevUser();
            setAuthentication(devUser);
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                Claims claims = jwtTokenProvider.parseClaims(token);
                String userId = jwtTokenProvider.getUserId(claims);
                if (userId != null) {
                    Optional<User> userOpt = userRepository.findById(userId);
                    userOpt.ifPresent(this::setAuthentication);
                }
            } catch (Exception ignored) {
                // optional auth routes continue without user
            }
        }

        filterChain.doFilter(request, response);
    }

    private User createDevUser() {
        User user = new User();
        user.setId("000000000000000000000000");
        user.setName("Dev User");
        user.setRole("student");
        user.setGuest(false);
        return user;
    }

    private void setAuthentication(User user) {
        var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().toUpperCase()));
        var auth = new UsernamePasswordAuthenticationToken(user, null, authorities);
        SecurityContextHolder.getContext().setAuthentication(auth);
    }
}
