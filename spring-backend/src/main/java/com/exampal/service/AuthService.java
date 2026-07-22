package com.exampal.service;

import com.exampal.model.User;
import com.exampal.repository.UserRepository;
import com.exampal.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public Map<String, Object> register(Map<String, Object> body) {
        String email = (String) body.get("email");
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("User with this email already exists");
        }

        User user = new User();
        user.setName((String) body.get("name"));
        user.setEmail(email.toLowerCase());
        user.setPassword(passwordEncoder.encode((String) body.get("password")));
        user.setCollegePreference((String) body.get("college"));
        user.setRole("student");
        user.setActive(true);
        user.setVerified(false);
        user = userRepository.save(user);

        return authResponse(user, null);
    }

    public Map<String, Object> login(String email, String password) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new UnauthorizedCredentialsException("Invalid credentials"));

        if (!user.isActive()) {
            throw new UnauthorizedCredentialsException("Account is deactivated");
        }
        if (user.getPassword() == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new UnauthorizedCredentialsException("Invalid credentials");
        }

        updateStudyStreak(user);
        return authResponse(user, null);
    }

    public Map<String, Object> createGuest(String collegePreference, Map<String, Object> accessibility) {
        User guest = new User();
        guest.setName("Guest_" + System.currentTimeMillis());
        guest.setGuest(true);
        guest.setGuestExpiresAt(Instant.now().plus(24, ChronoUnit.HOURS));
        guest.setRole("student");
        guest.setCollegePreference(collegePreference);
        guest.setActive(true);
        guest.setVerified(false);
        guest = userRepository.save(guest);

        String token = jwtTokenProvider.generateToken(guest, "24h");
        return Map.of(
                "user", Map.of(
                        "id", guest.getId(),
                        "name", guest.getName(),
                        "collegePreference", guest.getCollegePreference() != null ? guest.getCollegePreference() : "",
                        "role", guest.getRole(),
                        "guest", true,
                        "guestExpiresAt", guest.getGuestExpiresAt()
                ),
                "token", token
        );
    }

    public void changePassword(User user, String currentPassword, String newPassword) {
        User dbUser = userRepository.findById(user.getId()).orElseThrow();
        if (dbUser.getPassword() == null || !passwordEncoder.matches(currentPassword, dbUser.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        dbUser.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(dbUser);
    }

    public User updateProfile(User current, Map<String, Object> updates) {
        User user = userRepository.findById(current.getId()).orElseThrow();
        if (updates.containsKey("name")) user.setName((String) updates.get("name"));
        if (updates.containsKey("department")) user.setCollegePreference((String) updates.get("department"));
        return userRepository.save(user);
    }

    private Map<String, Object> authResponse(User user, String expiresOverride) {
        String token = jwtTokenProvider.generateToken(user, expiresOverride);
        user.setPassword(null);
        return Map.of("user", user, "token", token);
    }

    private void updateStudyStreak(User user) {
        Instant today = Instant.now();
        Instant last = user.getLastStudyDate();
        if (last == null) {
            user.setStudyStreak(1);
        } else {
            long days = ChronoUnit.DAYS.between(last.truncatedTo(ChronoUnit.DAYS), today.truncatedTo(ChronoUnit.DAYS));
            if (days == 1) user.setStudyStreak(user.getStudyStreak() + 1);
            else if (days > 1) user.setStudyStreak(1);
        }
        user.setLastStudyDate(today);
        userRepository.save(user);
    }

    public static class UnauthorizedCredentialsException extends RuntimeException {
        public UnauthorizedCredentialsException(String message) {
            super(message);
        }
    }
}
