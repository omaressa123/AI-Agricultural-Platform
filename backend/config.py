"""
Configuration settings for AI Agricultural Platform Backend
"""

import os
from datetime import timedelta

class Config:
    """Base configuration class"""
    
    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # Model paths
    MODEL_PATH = os.environ.get('MODEL_PATH') or os.path.join(os.path.dirname(__file__), '..', 'model')
    DATA_PATH = os.environ.get('DATA_PATH') or os.path.join(os.path.dirname(__file__), '..', 'data')
    
    # Model files
    CROP_RECOMMENDATION_MODEL = os.path.join(MODEL_PATH, 'crop_recommendation_model.pkl')
    YIELD_PREDICTION_MODEL = os.path.join(MODEL_PATH, 'yield_prediction_pipeline.pkl')
    
    # Data files
    MARKET_PRICE_DATA = os.path.join(DATA_PATH, 'egypt_local_crop_prices_2023_2025.csv')
    EFFICIENCY_DATA = os.path.join(DATA_PATH, 'farm_efficiency_scores.csv')
    
    # API settings
    API_VERSION = 'v1'
    RATE_LIMIT = os.environ.get('RATE_LIMIT') or '100 per hour'
    
    # Cache settings
    CACHE_TYPE = 'simple'
    CACHE_DEFAULT_TIMEOUT = 300  # 5 minutes
    
    # Logging
    LOG_LEVEL = os.environ.get('LOG_LEVEL') or 'INFO'
    LOG_FILE = os.environ.get('LOG_FILE') or 'agricultural_platform.log'
    
    # Security
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')
    
    # Performance
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max request size
    
    # Business logic settings
    DEFAULT_FARM_AREA = 1.0  # hectares
    DEFAULT_CURRENCY = 'EGP'
    CONFIDENCE_THRESHOLD = 0.7  # Minimum confidence for recommendations
    
    # Efficiency benchmarks
    EFFICIENCY_BENCHMARKS = {
        'avg_yield_per_acre': 0.15,  # tons per acre
        'avg_water_efficiency': 0.0005,  # yield per cubic meter
        'avg_fertilizer_efficiency': 5.0,  # yield per ton of fertilizer
        'avg_pesticide_efficiency': 10.0,  # yield per kg of pesticide
        'avg_input_efficiency': 0.0001  # yield per total input
    }
    
    # Crop mappings
    CROP_MAPPINGS = {
        'wheat': ['Wheat (قمح)'],
        'rice': ['Rice (أرز)'],
        'maize': ['Maize (ذرة صفراء)'],
        'corn': ['Maize (ذرة صفراء)'],
        'cotton': ['Cotton (قطن)'],
        'potato': ['Potato (بطاطس)'],
        'tomato': ['Tomato (طماطم)'],
        'onion': ['Onion (بصل)'],
        'sugarcane': ['Sugar Beet (بنجر السكر)'],
        'barley': ['Wheat (قمح)']
    }
    
    # Production cost estimates (EGP per ton)
    PRODUCTION_COSTS = {
        'wheat': 3000,
        'rice': 4000,
        'maize': 3500,
        'cotton': 8000,
        'potato': 2500,
        'tomato': 3000,
        'sugarcane': 2000,
        'barley': 2800
    }

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False
    
    # Override with production-specific settings
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'production-secret-key'
    LOG_LEVEL = 'WARNING'

class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = True
    TESTING = True
    
    # Use test data paths
    MODEL_PATH = os.path.join(os.path.dirname(__file__), 'tests', 'models')
    DATA_PATH = os.path.join(os.path.dirname(__file__), 'tests', 'data')

# Configuration mapping
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

def get_config():
    """Get configuration based on environment"""
    env = os.environ.get('FLASK_ENV', 'development')
    return config.get(env, config['default'])
