package com.web.socket.websocket.controller;

import com.web.socket.websocket.model.MessageBean;
import com.web.socket.websocket.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;


@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api")
public class SocketController {

    @Autowired
    MessageRepository messageRepository;

    @MessageMapping("/chat-all")
    @SendTo("/topic/chat")
    public MessageBean sendToAll(@Payload MessageBean message) {
        try {
            if (Objects.nonNull(message.getName()) && !message.getName().equals("") && (Objects.nonNull(message.getMessage())))
                messageRepository.save(new MessageBean(message.getName(), message.getMessage()));

            return message;
        } catch (Exception e) {
            return null;
        }

    }

    @GetMapping("/messages")
    public ResponseEntity<List<MessageBean>> getAllMessages(@RequestParam(required = false) String name) {
        try {
            List<MessageBean> messages = new ArrayList<MessageBean>();

            if (Objects.isNull(name) || name.equals(""))
                messageRepository.findAll().forEach(messages::add);
            else
                messages = messageRepository.findByName(name);

            return new ResponseEntity<>(messages, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
