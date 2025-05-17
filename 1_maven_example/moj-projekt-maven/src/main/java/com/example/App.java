package com.example;

/**
 * Prosta aplikacja Hello world!
 *
 */
public class App {
    public String getGreeting() {
        return "Witaj Świecie z Mavena!";
    }

    public static void main(String[] args) {
        App app = new App();
        System.out.println(app.getGreeting());
    }
}
