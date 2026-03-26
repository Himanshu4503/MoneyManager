package in.himanshu.moneymanager.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtUtil {

    // Secret key used to sign tokens — should be strong and kept private
    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // Token validity (e.g., 1 hour)
    private static final long EXPIRATION_TIME = 60 * 60 * 1000; // milliseconds

    // Generate token for a user
    public String generateToken(String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME);

        return Jwts.builder()
                .setSubject(email)              // payload: "sub"
                .setIssuedAt(now)               // payload: "iat"
                .setExpiration(expiryDate)      // payload: "exp"
                .signWith(SECRET_KEY)           // sign with secret key
                .compact();
    }

    // ✅ Extract username (email) from token
    public String extractUsername(String jwt) {
        return extractAllClaims(jwt).getSubject(); // 'sub' claim stores the username/email
    }

    // ✅ Validate token — check if valid and matches user
    public boolean validateToken(String jwt, UserDetails userDetails) {
        final String username = extractUsername(jwt);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(jwt));
    }

    // Check if the token is expired
    private boolean isTokenExpired(String jwt) {
        final Date expiration = extractAllClaims(jwt).getExpiration();
        return expiration.before(new Date());
    }

    // Helper: parse claims using secret key
    private Claims extractAllClaims(String jwt) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(jwt)
                .getBody();
    }
}
