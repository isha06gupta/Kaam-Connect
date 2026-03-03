package com.kaamconnect.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullname;

    @Column(unique = true, nullable = false)
    private String mobile;

    private String password;
    private String skill;
    private String company;
    private String location;

    private Boolean ngoVerified = Boolean.FALSE;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    public User() {}

    @PrePersist
    public void onCreate() {
        if (ngoVerified == null) {
            ngoVerified = Boolean.FALSE;
        }
    }

    public Long getId() {
        return id;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getSkill() {
        return skill;
    }

    public void setSkill(String skill) {
        this.skill = skill;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Boolean getNgoVerified() {
        return ngoVerified;
    }

    public void setNgoVerified(Boolean ngoVerified) {
        this.ngoVerified = ngoVerified;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}