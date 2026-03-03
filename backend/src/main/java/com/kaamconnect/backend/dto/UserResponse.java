package com.kaamconnect.backend.dto;

import com.kaamconnect.backend.entity.Role;

public class UserResponse {

    private Long id;
    private String fullname;
    private String mobile;
    private String skill;
    private String company;
    private String location;
    private Role role;
    private Boolean ngoVerified;

    public UserResponse() {
    }

    public UserResponse(Long id, String fullname, String mobile, String skill, String company, String location, Role role, Boolean ngoVerified) {
        this.id = id;
        this.fullname = fullname;
        this.mobile = mobile;
        this.skill = skill;
        this.company = company;
        this.location = location;
        this.role = role;
        this.ngoVerified = ngoVerified;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Boolean getNgoVerified() {
        return ngoVerified;
    }

    public void setNgoVerified(Boolean ngoVerified) {
        this.ngoVerified = ngoVerified;
    }
}