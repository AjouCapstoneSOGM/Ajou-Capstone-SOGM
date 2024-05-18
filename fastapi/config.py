class Settings:
    cors_origins = [
        "*"
    ]  # 실제 배포시에는 구체적인 도메인 목록을 지정하도록 변경하세요.
    cors_methods = ["*"]
    cors_headers = ["*"]
    cors_credentials = True
