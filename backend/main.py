from fastapi import FastAPI, HTTPException
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware 
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection setup
postgres_user = os.getenv("POSTGRES_USER")
postgres_password = os.getenv("POSTGRES_PASSWORD")
url = os.getenv("URL")
db_name = os.getenv("DB_NAME")
DATABASE_URL = f"postgresql+asyncpg://{postgres_user}:{postgres_password}@{url}/{db_name}"

engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

# Define a Blog model
class Blog(Base):
    __tablename__ = "blogs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    body = Column(String)
    created_at = Column(DateTime, default=datetime.now)

# Create all tables
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app = FastAPI()

# Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await create_tables()

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Hello World"}

# Pydantic models for request validation
class CreateBlogRequest(BaseModel):
    title: str
    body: str

# Create a new blog entry
@app.post("/create_blogs/", response_model=dict)
async def create_blog(blog_data: CreateBlogRequest):
    async with SessionLocal() as session:
        blog = Blog(title=blog_data.title, body=blog_data.body)
        session.add(blog)
        await session.commit()
        await session.refresh(blog)
        return blog.__dict__

# Read all blogs
@app.get("/blogs/")
async def read_blogs():
    async with SessionLocal() as session:
        result = await session.execute(select(Blog))
        blogs = result.scalars().all()
        return blogs

class UpdateBlogRequest(BaseModel):
    blog_id: int
    title: str
    body: str

# Update a blog entry
@app.put("/blogs/{blog_id}")
async def update_blog(blog_data: UpdateBlogRequest):
    async with SessionLocal() as session:
        result = await session.execute(select(Blog).filter(Blog.id == blog_data.blog_id))
        blog = result.scalars().first()
        if not blog:
            raise HTTPException(status_code=404, detail="Blog not found")
        blog.title = blog_data.title
        blog.body = blog_data.body
        await session.commit()
        await session.refresh(blog)
        return {"blog_id": blog.id, "title": blog.title, "body": blog.body}

# Delete a blog entry
@app.delete("/blogs/{blog_id}")
async def delete_blog(blog_id: int):
    async with SessionLocal() as session:
        result = await session.execute(select(Blog).filter(Blog.id == blog_id))
        blog = result.scalars().first()
        if not blog:
            raise HTTPException(status_code=404, detail="Blog not found")
        await session.delete(blog)
        await session.commit()
        return {"message": "Blog deleted successfully"}