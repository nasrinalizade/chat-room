package com.web.socket.websocket.model;


import org.springframework.data.annotation.Id;

public class MessageBean {
    @Id
    private String id;
    private String name;
    private String message;

    public MessageBean(String name, String message) {
        this.name = name;
        this.message = message;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }


}
