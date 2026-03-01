"""
Database setup and management for AI Agricultural Platform
"""

import sqlite3
import os
from datetime import datetime
import json
from flask import Blueprint, request

# Create Flask blueprint
db_api = Blueprint('database', __name__)

class DatabaseManager:
    def __init__(self, db_path='agricultural_platform.db'):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize all database tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Users table
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
        
        # Farms table
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
        
        # Farm Analyses table
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
        
        # Market Prices table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS market_prices (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                crop TEXT NOT NULL,
                price_per_ton REAL NOT NULL,
                date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Insights table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS insights (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                farm_id INTEGER,
                insight_type TEXT,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                impact_level TEXT,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (farm_id) REFERENCES farms (id)
            )
        ''')
        
        conn.commit()
        conn.close()
        print("✅ Database initialized successfully")
    
    def create_default_user(self):
        """Create a default user for testing"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT OR IGNORE INTO users (name, email, phone, location)
            VALUES (?, ?, ?, ?)
        ''', ('Ahmed Mohamed', 'ahmed@farmtech.com', '+20 123 456 7890', 'Nile Delta, Egypt'))
        
        conn.commit()
        conn.close()
    
    def add_farm(self, user_id, farm_data):
        """Add a new farm"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO farms (user_id, name, location, area_hectares, crop_type, soil_type, irrigation_type, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_id,
            farm_data['name'],
            farm_data['location'],
            farm_data['area_hectares'],
            farm_data.get('crop_type'),
            farm_data.get('soil_type'),
            farm_data.get('irrigation_type'),
            farm_data.get('status', 'active')
        ))
        
        farm_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return farm_id
    
    def get_user_farms(self, user_id):
        """Get all farms for a user"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM farms WHERE user_id = ? ORDER BY created_at DESC
        ''', (user_id,))
        
        farms = cursor.fetchall()
        conn.close()
        return farms
    
    def save_analysis(self, farm_id, analysis_data):
        """Save farm analysis results"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO farm_analyses (
                farm_id, analysis_type, temperature, humidity, ph, rainfall,
                nitrogen, phosphorus, potassium, organic_carbon, sunlight_hours,
                wind_speed, altitude, fertilizer_used, pesticide_used, season,
                region, predicted_yield, predicted_revenue, efficiency_score, recommendations
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            farm_id,
            analysis_data['analysis_type'],
            analysis_data.get('temperature'),
            analysis_data.get('humidity'),
            analysis_data.get('ph'),
            analysis_data.get('rainfall'),
            analysis_data.get('nitrogen'),
            analysis_data.get('phosphorus'),
            analysis_data.get('potassium'),
            analysis_data.get('organic_carbon'),
            analysis_data.get('sunlight_hours'),
            analysis_data.get('wind_speed'),
            analysis_data.get('altitude'),
            analysis_data.get('fertilizer_used'),
            analysis_data.get('pesticide_used'),
            analysis_data.get('season'),
            analysis_data.get('region'),
            analysis_data.get('predicted_yield'),
            analysis_data.get('predicted_revenue'),
            analysis_data.get('efficiency_score'),
            json.dumps(analysis_data.get('recommendations', []))
        ))
        
        analysis_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return analysis_id
    
    def add_insight(self, farm_id, insight_data):
        """Add a new insight"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO insights (farm_id, insight_type, title, description, impact_level, status)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            farm_id,
            insight_data['insight_type'],
            insight_data['title'],
            insight_data['description'],
            insight_data['impact_level'],
            insight_data.get('status', 'pending')
        ))
        
        insight_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return insight_id
    
    def get_farm_analyses(self, farm_id):
        """Get all analyses for a farm"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM farm_analyses WHERE farm_id = ? ORDER BY created_at DESC
        ''', (farm_id,))
        
        analyses = cursor.fetchall()
        conn.close()
        return analyses
    
    def get_farm_insights(self, farm_id):
        """Get all insights for a farm"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM insights WHERE farm_id = ? ORDER BY created_at DESC
        ''', (farm_id,))
        
        insights = cursor.fetchall()
        conn.close()
        return insights
    
    def update_farm(self, farm_id, farm_data):
        """Update farm information"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE farms 
            SET name = ?, location = ?, area_hectares = ?, crop_type = ?, 
                soil_type = ?, irrigation_type = ?, status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (
            farm_data['name'],
            farm_data['location'],
            farm_data['area_hectares'],
            farm_data.get('crop_type'),
            farm_data.get('soil_type'),
            farm_data.get('irrigation_type'),
            farm_data.get('status', 'active'),
            farm_id
        ))
        
        conn.commit()
        conn.close()
    
    def delete_farm(self, farm_id):
        """Delete a farm"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM farms WHERE id = ?', (farm_id,))
        conn.commit()
        conn.close()
    
    def get_market_prices(self, crop=None):
        """Get market prices"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        if crop:
            cursor.execute('''
                SELECT * FROM market_prices WHERE crop = ? ORDER BY date DESC
            ''', (crop,))
        else:
            cursor.execute('''
                SELECT * FROM market_prices ORDER BY date DESC
            ''')
        
        prices = cursor.fetchall()
        conn.close()
        return prices
    
    def import_market_prices(self, prices_data):
        """Import market prices from CSV"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        for price in prices_data:
            cursor.execute('''
                INSERT OR REPLACE INTO market_prices (crop, price_per_ton, date)
                VALUES (?, ?, ?)
            ''', (price['Crop'], price['Price_per_Ton_EGP'], price['Date']))
        
        conn.commit()
        conn.close()

# API Routes for database blueprint
@db_api.route('/farms', methods=['GET'])
def get_farms():
    """Get all farms"""
    try:
        db = DatabaseManager()
        conn = sqlite3.connect(db.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT f.*, u.name as owner_name 
            FROM farms f
            JOIN users u ON f.user_id = u.id
            ORDER BY f.created_at DESC
        ''')
        
        farms = cursor.fetchall()
        conn.close()
        
        # Convert to list of dictionaries
        farm_columns = ['id', 'user_id', 'name', 'location', 'area_hectares', 
                       'crop_type', 'soil_type', 'irrigation_type', 'status', 
                       'created_at', 'updated_at', 'owner_name']
        
        farms_list = []
        for farm in farms:
            farm_dict = dict(zip(farm_columns, farm))
            farms_list.append(farm_dict)
        
        return create_response('success', 'Farms retrieved successfully', farms_list)
    
    except Exception as e:
        return handle_errors(e)

@db_api.route('/farms/<int:farm_id>', methods=['GET'])
def get_farm_by_id(farm_id):
    """Get farm details by ID"""
    try:
        db = DatabaseManager()
        conn = sqlite3.connect(db.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT f.*, u.name as owner_name, u.email as owner_email
            FROM farms f
            JOIN users u ON f.user_id = u.id
            WHERE f.id = ?
        ''', (farm_id,))
        
        farm = cursor.fetchone()
        conn.close()
        
        if not farm:
            return create_response('error', 'Farm not found', 404)
        
        # Convert to dictionary
        farm_columns = ['id', 'user_id', 'name', 'location', 'area_hectares', 
                       'crop_type', 'soil_type', 'irrigation_type', 'status', 
                       'created_at', 'updated_at', 'owner_name', 'owner_email']
        
        farm_dict = dict(zip(farm_columns, farm))
        
        return create_response('success', 'Farm retrieved successfully', farm_dict)
    
    except Exception as e:
        return handle_errors(e)

@db_api.route('/farms/<int:farm_id>/predictions', methods=['GET'])
def get_farm_predictions_api(farm_id):
    """Get prediction history for a farm"""
    try:
        db = DatabaseManager()
        analyses = db.get_farm_analyses(farm_id)
        
        # Convert to list of dictionaries
        prediction_columns = ['id', 'farm_id', 'analysis_type', 'temperature', 
                              'humidity', 'ph', 'rainfall', 'nitrogen', 'phosphorus', 
                              'potassium', 'organic_carbon', 'sunlight_hours', 
                              'wind_speed', 'altitude', 'fertilizer_used', 
                              'pesticide_used', 'season', 'region', 'predicted_yield', 
                              'predicted_revenue', 'efficiency_score', 'recommendations', 
                              'created_at']
        
        predictions = []
        for analysis in analyses:
            pred_dict = dict(zip(prediction_columns, analysis))
            # Parse JSON recommendations
            if pred_dict['recommendations']:
                try:
                    pred_dict['recommendations'] = json.loads(pred_dict['recommendations'])
                except:
                    pred_dict['recommendations'] = []
            predictions.append(pred_dict)
        
        return create_response('success', 'Predictions retrieved successfully', predictions)
    
    except Exception as e:
        return handle_errors(e)

@db_api.route('/farms', methods=['POST'])
def create_farm():
    """Create a new farm"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'location', 'area_hectares', 'user_id']
        if not all(field in data for field in required_fields):
            return create_response('error', 'Missing required fields', 400)
        
        db = DatabaseManager()
        farm_id = db.add_farm(data['user_id'], data)
        
        return create_response('success', 'Farm created successfully', {'farm_id': farm_id})
    
    except Exception as e:
        return handle_errors(e)

# Helper functions for database blueprint
def create_response(status, message, data=None, status_code=200):
    """Create standardized API response"""
    from flask import jsonify
    response = {
        'status': status,
        'message': message
    }
    
    if data is not None:
        response['data'] = data
    
    return jsonify(response), status_code

def handle_errors(error):
    """Handle and format errors consistently"""
    from flask import jsonify
    print(f"Database API Error: {str(error)}")
    return jsonify({
        'status': 'error',
        'message': f'Database error: {str(error)}'
    }), 500
