package com.exampal.security;

import com.exampal.config.AppProperties;
import com.exampal.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class JwtTokenProvider {

    private static final Pattern DURATION = Pattern.compile("(\\d+)([dhms])");

    private final AppProperties appProperties;
    private final SecretKey key;

    public JwtTokenProvider(AppProperties appProperties) {
        this.appProperties = appProperties;
        this.key = Keys.hmacShaKeyFor(appProperties.getJwtSecret().getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(User user, String expiresInOverride) {
        String expiresIn = expiresInOverride != null ? expiresInOverride : appProperties.getJwtExpiresIn();
        Instant expiry = Instant.now().plus(parseDuration(expiresIn), ChronoUnit.SECONDS);

        return Jwts.builder()
                .claim("id", user.getId())
                .claim("guest", user.isGuest())
                .issuedAt(Date.from(Instant.now()))
                .expiration(Date.from(expiry))
                .signWith(key)
                .compact();
    }

    public Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String getUserId(Claims claims) {
        Object id = claims.get("id");
        return id != null ? id.toString() : null;
    }

    private long parseDuration(String value) {
        if (value == null || value.isBlank()) {
            return 30L * 24 * 60 * 60;
        }
        Matcher m = DURATION.matcher(value.trim());
        if (!m.matches()) {
            return 30L * 24 * 60 * 60;
        }
        long amount = Long.parseLong(m.group(1));
        return switch (m.group(2)) {
            case "d" -> amount * 24 * 60 * 60;
            case "h" -> amount * 60 * 60;
            case "m" -> amount * 60;
            default -> amount;
        };
    }
}
