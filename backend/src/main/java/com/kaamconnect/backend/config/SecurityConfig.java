package com.kaamconnect.backend.config;

import com.kaamconnect.backend.security.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // ⭐ IMPORTANT PART (401 handling)
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            response.getWriter().write("""
                                {"success":false,"message":"Unauthorized"}
                                """);
                        })
                )

                .authorizeHttpRequests(auth -> auth
        // allow frontend static files
        .requestMatchers(
                "/",
                "/index.html",
                "/pages/**",
                "/js/**",
                "/css/**",
                "/images/**"
        ).permitAll()

        // public backend endpoints
        .requestMatchers("/api/auth/**").permitAll()
        .requestMatchers("/api/users/register").permitAll()

        // admin protection
        .requestMatchers("/api/admin/**").hasRole("ADMIN")

        // everything else requires login
        .anyRequest().authenticated()
)

                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(form -> form.disable())

                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}