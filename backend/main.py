from fastapi import FastAPI, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware 
from pydantic import BaseModel
import os
from dotenv import load_dotenv
load_dotenv()

postgres_user = os.getenv("POSTGRES_USER")
postgres_password = os.getenv("POSTGRES_PASSWORD")
url = os.getenv("URL")
db_name = os.getenv("DB_NAME")
# Establish a connection to the database

DATABASE_URL = f"postgresql://{postgres_user}:{postgres_password}@{url}/{db_name}"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Blog(Base):
    __tablename__ = "blogs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    body = Column(String)
    created_at = Column(DateTime, default=datetime.now)


Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow requests from this origin
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Allow these HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/")
async def root():
    return {"message": "Hello World"}


class CreateBlogRequest(BaseModel):
    title: str
    body: str

@app.post("/create_blogs/")
def create_blog(blog_data: CreateBlogRequest):
    db = SessionLocal()
    blog = Blog(title=blog_data.title, body=blog_data.body)
    db.add(blog)
    db.commit()
    db.refresh(blog)
    return blog

@app.get("/blogs/")
def read_blogs():
    db = SessionLocal()
    return  db.query(Blog).all()

class UpdateBlogRequest(BaseModel):
    blog_id:int
    title: str
    body: str

@app.put("/blogs/{blog_id}")
def update_blog(blog_data:UpdateBlogRequest):
    print(blog_data)
    db = SessionLocal()
    blog = db.query(Blog).filter(Blog.id == blog_data.blog_id).first()
    if blog is None:
        raise HTTPException(status_code=404, detail="Blog not found")
    blog.title = blog_data.title
    blog.body = blog_data.body
    db.commit()
    db.refresh(blog)
    return {"blog_id":blog.id,"title":blog.title,"body":blog.title}


@app.delete("/blogs/{blog_id}")
def delete_blog(blog_id: int):
    print(blog_id)
    db = SessionLocal()
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if blog is None:
        raise HTTPException(status_code=404, detail="Blog not found")
    db.delete(blog)
    db.commit()
    return {"message": "Blog deleted successfully"}
