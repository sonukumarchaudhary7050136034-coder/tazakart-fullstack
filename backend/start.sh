#!/bin/bash
# TazaKart backend startup script
# Usage: bash start.sh

set -e

echo "Starting MySQL/MariaDB..."
service mariadb start || service mysql start
sleep 2

echo "Installing Python dependencies..."
pip install --break-system-packages -q -r requirements.txt

echo "Setting up database (creates DB, user, tables, seed data)..."
mysql -u root -e "
CREATE DATABASE IF NOT EXISTS tazakart CHARACTER SET utf8mb4;
CREATE USER IF NOT EXISTS 'tazakart_user'@'localhost' IDENTIFIED BY 'TazaKart@2026';
GRANT ALL PRIVILEGES ON tazakart.* TO 'tazakart_user'@'localhost';
FLUSH PRIVILEGES;
" 2>/dev/null || echo "(DB/user may already exist, continuing)"

python3 seed.py

echo "Starting FastAPI server on http://localhost:8000 ..."
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
