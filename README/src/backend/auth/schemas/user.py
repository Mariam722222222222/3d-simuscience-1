from pydantic import BaseModel, EmailStr, validator

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    confirm_password: str

    @validator("password")
    def password_length(cls, v):
        if len(v) < 6:
            raise ValueError("Password too short")
        return v

    @validator("confirm_password")
    def match_password(cls, v, values):
        if v != values.get("password"):
            raise ValueError("Passwords do not match")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str