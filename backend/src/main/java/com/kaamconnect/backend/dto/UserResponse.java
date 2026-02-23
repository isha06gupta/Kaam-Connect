package com.kaamconnect.backend.dto;

public class UserResponse {

    private Long id;
    private String fullname;
    private String mobile;
    private String skill;
    private String company;
    private String location;

    public UserResponse() {
    }

    public UserResponse(Long id, String fullname, String mobile, String skill, String company, String location) {
        this.id = id;
        this.fullname = fullname;
        this.mobile = mobile;
        this.skill = skill;
        this.company = company;
        this.location = location;
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
}
