from fastapi import FastAPI
from model import UserInfo
from config import Settings
from starlette.middleware.cors import CORSMiddleware

settings = Settings()  # 설정 인스턴스 생성
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=settings.cors_credentials,
    allow_methods=settings.cors_methods,
    allow_headers=settings.cors_headers,
)


@app.post("/getInfo")
async def getUserInfo(user_info: UserInfo):

    print(user_info)
    return {"portfolio": "good"}
