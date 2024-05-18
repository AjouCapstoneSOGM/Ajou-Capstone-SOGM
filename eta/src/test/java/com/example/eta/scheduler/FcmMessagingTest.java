package com.example.eta.scheduler;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.io.IOException;

@SpringBootTest
@ExtendWith(SpringExtension.class)
public class FcmMessagingTest {

    @Autowired
    private FcmMessaging fcmMessaging;

    @Test
    public void testGetAccessToken() throws IOException {
        String accessToken = fcmMessaging.getAccessToken();
        assertNotNull(accessToken);
    }
}
