#!/usr/bin/env python3
"""
Initialize sample data for testing the AI Agricultural Platform
"""

import sqlite3
import os
from datetime import datetime, timedelta
import json

def init_sample_data():
    """Initialize database with sample data"""
    
    # Connect to database
    db_path = 'agricultural_platform.db'
    if os.path.exists(db_path):
        os.remove(db_path)
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Create tables (using the same schema as database.py)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            location TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS farms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            name TEXT NOT NULL,
            location TEXT NOT NULL,
            area_hectares REAL NOT NULL,
            crop_type TEXT,
            soil_type TEXT,
            irrigation_type TEXT,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS farm_analyses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            farm_id INTEGER,
            analysis_type TEXT,
            temperature REAL,
            humidity REAL,
            ph REAL,
            rainfall REAL,
            nitrogen REAL,
            phosphorus REAL,
            potassium REAL,
            organic_carbon REAL,
            sunlight_hours REAL,
            wind_speed REAL,
            altitude REAL,
            fertilizer_used REAL,
            pesticide_used REAL,
            season TEXT,
            region TEXT,
            predicted_yield REAL,
            predicted_revenue REAL,
            efficiency_score REAL,
            recommendations TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (farm_id) REFERENCES farms (id)
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS market_prices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            crop TEXT NOT NULL,
            price_per_ton REAL NOT NULL,
            date DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Insert sample users
    cursor.execute('''
        INSERT INTO users (name, email, phone, location)
        VALUES (?, ?, ?, ?)
    ''', ('Ahmed Mohamed', 'ahmed@farmtech.com', '+20 123 456 7890', 'Nile Delta, Egypt'))
    
    cursor.execute('''
        INSERT INTO users (name, email, phone, location)
        VALUES (?, ?, ?, ?)
    ''', ('Fatma Ali', 'fatma@farmtech.com', '+20 987 654 3210', 'Cairo, Egypt'))
    
    # Insert sample farms
    cursor.execute('''
        INSERT INTO farms (user_id, name, location, area_hectares, crop_type, soil_type, irrigation_type, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (1, 'Green Valley Farm', 'Nile Delta', 15.5, 'Wheat', 'Clay', 'Drip', 'active'))
    
    cursor.execute('''
        INSERT INTO farms (user_id, name, location, area_hectares, crop_type, soil_type, irrigation_type, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (1, 'Sunrise Fields', 'Cairo', 8.2, 'Maize', 'Loamy', 'Flood', 'active'))
    
    cursor.execute('''
        INSERT INTO farms (user_id, name, location, area_hectares, crop_type, soil_type, irrigation_type, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (2, 'Desert Oasis', 'Alexandria', 12.0, 'Cotton', 'Sandy', 'Sprinkler', 'active'))
    
    # Insert sample farm analyses (predictions)
    sample_predictions = [
        {
            'farm_id': 1,
            'analysis_type': 'ml_prediction',
            'temperature': 25.5,
            'humidity': 65.0,
            'ph': 6.8,
            'rainfall': 120.0,
            'nitrogen': 55.0,
            'phosphorus': 35.0,
            'potassium': 45.0,
            'organic_carbon': 1.2,
            'sunlight_hours': 8.5,
            'wind_speed': 5.2,
            'altitude': 50.0,
            'fertilizer_used': 220.0,
            'pesticide_used': 45.0,
            'season': 'Winter',
            'region': 'Nile Delta',
            'predicted_yield': 24.5,
            'predicted_revenue': 245000.0,
            'efficiency_score': 0.78,
            'recommendations': json.dumps(['Wheat', 'Barley', 'Clover']),
            'created_at': datetime.now() - timedelta(days=5)
        },
        {
            'farm_id': 1,
            'analysis_type': 'ml_prediction',
            'temperature': 23.0,
            'humidity': 70.0,
            'ph': 6.5,
            'rainfall': 100.0,
            'nitrogen': 50.0,
            'phosphorus': 30.0,
            'potassium': 40.0,
            'organic_carbon': 1.0,
            'sunlight_hours': 8.0,
            'wind_speed': 4.8,
            'altitude': 50.0,
            'fertilizer_used': 200.0,
            'pesticide_used': 40.0,
            'season': 'Spring',
            'region': 'Nile Delta',
            'predicted_yield': 22.8,
            'predicted_revenue': 228000.0,
            'efficiency_score': 0.75,
            'recommendations': json.dumps(['Wheat', 'Maize', 'Soybean']),
            'created_at': datetime.now() - timedelta(days=15)
        },
        {
            'farm_id': 2,
            'analysis_type': 'ml_prediction',
            'temperature': 28.0,
            'humidity': 60.0,
            'ph': 6.2,
            'rainfall': 80.0,
            'nitrogen': 60.0,
            'phosphorus': 40.0,
            'potassium': 50.0,
            'organic_carbon': 0.8,
            'sunlight_hours': 9.0,
            'wind_speed': 6.0,
            'altitude': 30.0,
            'fertilizer_used': 180.0,
            'pesticide_used': 35.0,
            'season': 'Summer',
            'region': 'Cairo',
            'predicted_yield': 20.5,
            'predicted_revenue': 205000.0,
            'efficiency_score': 0.72,
            'recommendations': json.dumps(['Maize', 'Sorghum', 'Millet']),
            'created_at': datetime.now() - timedelta(days=10)
        }
    ]
    
    for pred in sample_predictions:
        cursor.execute('''
            INSERT INTO farm_analyses (
                farm_id, analysis_type, temperature, humidity, ph, rainfall,
                nitrogen, phosphorus, potassium, organic_carbon, sunlight_hours,
                wind_speed, altitude, fertilizer_used, pesticide_used, season,
                region, predicted_yield, predicted_revenue, efficiency_score, recommendations, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            pred['farm_id'], pred['analysis_type'], pred['temperature'], pred['humidity'], 
            pred['ph'], pred['rainfall'], pred['nitrogen'], pred['phosphorus'], 
            pred['potassium'], pred['organic_carbon'], pred['sunlight_hours'], 
            pred['wind_speed'], pred['altitude'], pred['fertilizer_used'], 
            pred['pesticide_used'], pred['season'], pred['region'], 
            pred['predicted_yield'], pred['predicted_revenue'], pred['efficiency_score'], 
            pred['recommendations'], pred['created_at']
        ))
    
    # Insert sample market prices
    crops = ['Wheat', 'Maize', 'Cotton', 'Rice', 'Potato', 'Tomato']
    base_prices = {
        'Wheat': 10000,
        'Maize': 12000,
        'Cotton': 20000,
        'Rice': 13000,
        'Potato': 6000,
        'Tomato': 5000
    }
    
    for i in range(12):  # Last 12 months
        date = datetime.now() - timedelta(days=i*30)
        for crop in crops:
            # Add some variation to prices
            base_price = base_prices[crop]
            variation = base_price * 0.1 * (i % 3 - 1)  # -10%, 0%, or +10%
            price = base_price + variation
            
            cursor.execute('''
                INSERT INTO market_prices (crop, price_per_ton, date, created_at)
                VALUES (?, ?, ?, ?)
            ''', (crop, price, date.strftime('%Y-%m-%d'), datetime.now()))
    
    conn.commit()
    conn.close()
    
    print("✅ Sample data initialized successfully!")
    print(f"📊 Created 2 users, 3 farms, {len(sample_predictions)} predictions, and {len(crops)*12} market price entries")

if __name__ == '__main__':
    init_sample_data()
