
# FastAPI React Application

This project consists of two parts: a frontend and a backend.

## Backend

### Installation

Install the required dependencies for the backend using pip:

```bash
pip install -r requirements.txt
```

### Running the Backend

Navigate to the backend directory and run the FastAPI application using uvicorn:

```bash
cd backend
uvicorn main:app --reload
```

### Environment Variables

Create a `.env` file in the backend directory with the following content:

```dotenv
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="password"
URL="localhost:5432"
DB_NAME="blogs"
```

## Frontend

### Installation

Navigate to the frontend directory and install the required dependencies using npm:

```bash
cd frontend
npm install
```

### Running the Frontend

After installing the dependencies, start the frontend application using vite:

```bash
npx vite
```