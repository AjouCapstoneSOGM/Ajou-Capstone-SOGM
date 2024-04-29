from pydantic import BaseModel


class UserInfo(BaseModel):
    userId: int
    amount: float
    riskLevel: str
    interest: str
