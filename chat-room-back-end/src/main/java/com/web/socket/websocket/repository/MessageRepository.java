package com.web.socket.websocket.repository;

import com.web.socket.websocket.model.MessageBean;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<MessageBean, String> {
    List<MessageBean> findByName(String name);
}
