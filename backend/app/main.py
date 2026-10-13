from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.database import engine, Base
from app.routers import (
    auth_router,
    categories_router,
    products_router,
    cart_router,
    addresses_router,
    orders_router,
    users_router,
    coupons_router,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="TazaKart API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3456", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("app/static/products", exist_ok=True)
app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.include_router(auth_router.router)
app.include_router(categories_router.router)
app.include_router(products_router.router)
app.include_router(cart_router.router)
app.include_router(addresses_router.router)
app.include_router(orders_router.router)
app.include_router(users_router.router)
app.include_router(coupons_router.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "TazaKart API"}


@app.get("/api/health")
def health():
    return {"status": "healthy"}
