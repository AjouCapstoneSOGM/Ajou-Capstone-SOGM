package com.example.eta.exception;

public class EmailAlreadyExistsException extends RuntimeException{
    public EmailAlreadyExistsException(){
        super("해당 이메일로 가입한 계정이 존재합니다.");
    }
}
