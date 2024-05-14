package com.example.eta.exception;

public class OwnershipException extends RuntimeException {
}

// TODO: 별도의 클래스 파일로 분리할지, 아니면 Aspect 클래스 내부에 정의할지
class PortfolioOwnershipException extends OwnershipException {
}

class RebalanacingOwnershipException extends OwnershipException {
}