package com.example;

import org.junit.Test;
import static org.junit.Assert.*;

/**
 * Test jednostkowy dla prostej aplikacji App.
 */
public class AppTest {
    /**
     * Prosty test :)
     */
    @Test
    public void testAppGreeting() {
        App app = new App();
        assertEquals("Witaj Świecie z Mavena!", app.getGreeting());
    }
}
