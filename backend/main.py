from fastapi import FastAPI

app = FastAPI(title="DearFutureMe API", version="1.0.0")

@app.get("/")
async def root():
    """
    Root endpoint - returns API information
    This is the homepage of your API
    """
    return {"message": "DearFutureMe API is running", "version": "1.0.0"}

@app.get("/api/hello")
async def hello():
    """
    Hello endpoint - returns a greeting message
    This is the endpoint your React Native app will call
    """
    return {"message": "Hello from FastAPI backend"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)