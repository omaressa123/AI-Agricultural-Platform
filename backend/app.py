from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import os
import sqlite3
import json
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

# Import ML services
from services.crop_recommendation import CropRecommendationService
from services.yield_prediction import YieldPredictionService
from services.farm_efficiency import FarmEfficiencyService
from services.market_price import MarketPriceService

# Import database API
from database import db_api

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Register database blueprint
app.register_blueprint(db_api)

# Initialize services
crop_service = CropRecommendationService()
yield_service = YieldPredictionService()
efficiency_service = FarmEfficiencyService()
price_service = MarketPriceService()

@app.route('/')
def home():
    """API Health Check"""
    return jsonify({
        'status': 'success',
        'message': 'AI Agricultural Platform API',
        'version': '1.0.0',
        'endpoints': {
            'crop_recommendation': '/api/recommend-crop',
            'yield_prediction': '/api/predict-yield',
            'farm_efficiency': '/api/calculate-efficiency',
            'market_price': '/api/market-price',
            'revenue_prediction': '/api/predict-revenue',
            'farmer_workflow': '/api/farmer-workflow',
            'get_farm': '/farms/<id>',
            'get_farm_predictions': '/farms/<id>/predictions',
            'predict': '/predict',
            'get_dashboard': '/dashboard/<id>'
        }
    })

@app.route('/api/recommend-crop', methods=['POST'])
def recommend_crop():
    """Recommend best crop based on soil and weather conditions"""
    try:
        data = request.get_json()
        
        # Validate input
        required_fields = ['temperature', 'humidity', 'ph', 'rainfall']
        if not validate_input_data(data, required_fields):
            return create_response('error', 'Missing required fields', 400)
        
        # Get recommendation
        result = crop_service.recommend_crop(data)
        
        return create_response('success', 'Crop recommendation completed', result)
    
    except Exception as e:
        return handle_errors(e)

@app.route('/api/predict-yield', methods=['POST'])
def predict_yield():
    """Predict crop yield based on farm conditions"""
    try:
        data = request.get_json()
        
        # Validate input
        required_fields = ['N', 'P', 'K', 'Soil_pH', 'Temperature', 'Humidity', 
                          'Rainfall', 'Crop_Type', 'Irrigation_Type']
        if not validate_input_data(data, required_fields):
            return create_response('error', 'Missing required fields for yield prediction', 400)
        
        # Get prediction
        result = yield_service.predict_yield(data)
        
        return create_response('success', 'Yield prediction completed', result)
    
    except Exception as e:
        return handle_errors(e)

@app.route('/api/calculate-efficiency', methods=['POST'])
def calculate_efficiency():
    """Calculate farm efficiency metrics"""
    try:
        data = request.get_json()
        
        # Validate input
        required_fields = ['farm_area', 'fertilizer_used', 'pesticide_used', 
                          'water_usage', 'yield']
        if not validate_input_data(data, required_fields):
            return create_response('error', 'Missing required fields for efficiency calculation', 400)
        
        # Get efficiency metrics
        result = efficiency_service.calculate_efficiency(data)
        
        return create_response('success', 'Efficiency calculation completed', result)
    
    except Exception as e:
        return handle_errors(e)

@app.route('/api/market-price', methods=['GET'])
def get_market_price():
    """Get current market prices for crops"""
    try:
        crop_name = request.args.get('crop')
        
        # Get price data
        result = price_service.get_market_price(crop_name)
        
        return create_response('success', 'Market price data retrieved', result)
    
    except Exception as e:
        return handle_errors(e)

@app.route('/api/predict-revenue', methods=['POST'])
def predict_revenue():
    """Predict revenue based on yield and market prices"""
    try:
        data = request.get_json()
        
        # Validate input
        required_fields = ['crop_type', 'predicted_yield', 'farm_area']
        if not validate_input_data(data, required_fields):
            return create_response('error', 'Missing required fields for revenue prediction', 400)
        
        # Get revenue prediction
        result = price_service.predict_revenue(data)
        
        return create_response('success', 'Revenue prediction completed', result)
    
    except Exception as e:
        return handle_errors(e)

@app.route('/api/farmer-workflow', methods=['POST'])
def farmer_workflow():
    """Complete workflow for farmer - recommendation, yield, revenue, efficiency"""
    try:
        data = request.get_json()
        
        # Validate comprehensive input
        required_fields = ['temperature', 'humidity', 'ph', 'rainfall', 
                          'farm_area', 'fertilizer_used', 'pesticide_used', 
                          'water_usage']
        if not validate_input_data(data, required_fields):
            return create_response('error', 'Missing required fields for farmer workflow', 400)
        
        # Step 1: Crop Recommendation
        crop_data = {
            'temperature': data['temperature'],
            'humidity': data['humidity'],
            'ph': data['ph'],
            'rainfall': data['rainfall']
        }
        crop_recommendation = crop_service.recommend_crop(crop_data)
        recommended_crop = crop_recommendation['recommended_crop']
        
        # Step 2: Yield Prediction (using recommended crop)
        yield_data = {
            'N': data.get('N', 50),
            'P': data.get('P', 50),
            'K': data.get('K', 50),
            'Soil_pH': data['ph'],
            'Temperature': data['temperature'],
            'Humidity': data['humidity'],
            'Rainfall': data['rainfall'],
            'Crop_Type': recommended_crop,
            'Irrigation_Type': data.get('irrigation_type', 'Canal'),
            'Fertilizer_Used': data['fertilizer_used'],
            'Pesticide_Used': data['pesticide_used']
        }
        yield_prediction = yield_service.predict_yield(yield_data)
        
        # Step 3: Revenue Prediction
        revenue_data = {
            'crop_type': recommended_crop,
            'predicted_yield': yield_prediction['predicted_yield'],
            'farm_area': data['farm_area']
        }
        revenue_prediction = price_service.predict_revenue(revenue_data)
        
        # Step 4: Efficiency Calculation
        efficiency_data = {
            'farm_area': data['farm_area'],
            'fertilizer_used': data['fertilizer_used'],
            'pesticide_used': data['pesticide_used'],
            'water_usage': data['water_usage'],
            'yield': yield_prediction['predicted_yield']
        }
        efficiency_metrics = efficiency_service.calculate_efficiency(efficiency_data)
        
        # Step 5: Generate Insights
        insights = generate_insights(crop_recommendation, yield_prediction, 
                                    revenue_prediction, efficiency_metrics)
        
        # Compile complete workflow result
        workflow_result = {
            'recommended_crop': crop_recommendation,
            'yield_prediction': yield_prediction,
            'revenue_prediction': revenue_prediction,
            'efficiency_metrics': efficiency_metrics,
            'insights': insights,
            'timestamp': datetime.now().isoformat()
        }
        
        return create_response('success', 'Farmer workflow completed successfully', workflow_result)
    
    except Exception as e:
        return handle_errors(e)

@app.route('/farms/<int:farm_id>', methods=['GET'])
def get_farm(farm_id):
    """Get farm details by ID"""
    try:
        from database import DatabaseManager
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

@app.route('/farms/<int:farm_id>/predictions', methods=['GET'])
def get_farm_predictions(farm_id):
    """Get prediction history for a farm"""
    try:
        from database import DatabaseManager
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

@app.route('/predict', methods=['POST'])
def predict():
    """Main prediction endpoint - receives farm input data and runs ML models"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['temperature', 'humidity', 'ph', 'rainfall', 
                          'farm_area', 'fertilizer_used', 'pesticide_used', 
                          'water_usage']
        if not validate_input_data(data, required_fields):
            return create_response('error', 'Missing required fields', 400)
        
        # Get farm_id if provided
        farm_id = data.get('farm_id')
        
        # Step 1: Crop Recommendation
        crop_data = {
            'temperature': data['temperature'],
            'humidity': data['humidity'],
            'ph': data['ph'],
            'rainfall': data['rainfall']
        }
        crop_recommendation = crop_service.recommend_crop(crop_data)
        recommended_crop = crop_recommendation['recommended_crop']
        
        # Step 2: Yield Prediction
        yield_data = {
            'N': data.get('N', 50),
            'P': data.get('P', 50),
            'K': data.get('K', 50),
            'Soil_pH': data['ph'],
            'Temperature': data['temperature'],
            'Humidity': data['humidity'],
            'Rainfall': data['rainfall'],
            'Crop_Type': recommended_crop,
            'Irrigation_Type': data.get('irrigation_type', 'Canal'),
            'Fertilizer_Used': data['fertilizer_used'],
            'Pesticide_Used': data['pesticide_used']
        }
        yield_prediction = yield_service.predict_yield(yield_data)
        predicted_yield = yield_prediction['predicted_yield']
        
        # Step 3: Revenue Calculation
        revenue_data = {
            'crop_type': recommended_crop,
            'predicted_yield': predicted_yield,
            'farm_area': data['farm_area']
        }
        revenue_prediction = price_service.predict_revenue(revenue_data)
        predicted_revenue = revenue_prediction['predicted_revenue']
        
        # Step 4: Efficiency Score Calculation
        efficiency_data = {
            'farm_area': data['farm_area'],
            'fertilizer_used': data['fertilizer_used'],
            'pesticide_used': data['pesticide_used'],
            'water_usage': data['water_usage'],
            'yield': predicted_yield
        }
        efficiency_metrics = efficiency_service.calculate_efficiency(efficiency_data)
        efficiency_score = efficiency_metrics.get('final_efficiency_score', 0.5)
        
        # Step 5: Save to database if farm_id provided
        prediction_id = None
        if farm_id:
            from database import DatabaseManager
            db = DatabaseManager()
            
            analysis_data = {
                'analysis_type': 'ml_prediction',
                'temperature': data['temperature'],
                'humidity': data['humidity'],
                'ph': data['ph'],
                'rainfall': data['rainfall'],
                'nitrogen': data.get('N', 50),
                'phosphorus': data.get('P', 50),
                'potassium': data.get('K', 50),
                'fertilizer_used': data['fertilizer_used'],
                'pesticide_used': data['pesticide_used'],
                'predicted_yield': predicted_yield,
                'predicted_revenue': predicted_revenue,
                'efficiency_score': efficiency_score,
                'recommendations': [recommended_crop],
                'season': data.get('season', 'Unknown'),
                'region': data.get('region', 'Unknown')
            }
            
            prediction_id = db.save_analysis(farm_id, analysis_data)
        
        # Compile response
        result = {
            'farm_id': farm_id,
            'prediction_id': prediction_id,
            'recommended_crop': recommended_crop,
            'predicted_yield': predicted_yield,
            'predicted_revenue': predicted_revenue,
            'efficiency_score': efficiency_score,
            'crop_confidence': crop_recommendation.get('confidence', 0),
            'input_data': data,
            'timestamp': datetime.now().isoformat()
        }
        
        return create_response('success', 'Prediction completed successfully', result)
    
    except Exception as e:
        return handle_errors(e)

@app.route('/dashboard/<int:farm_id>', methods=['GET'])
def get_dashboard_data(farm_id):
    """Get dashboard data for a specific farm"""
    try:
        from database import DatabaseManager
        db = DatabaseManager()
        
        # Get farm details
        conn = sqlite3.connect(db.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT f.*, u.name as owner_name
            FROM farms f
            JOIN users u ON f.user_id = u.id
            WHERE f.id = ?
        ''', (farm_id,))
        
        farm = cursor.fetchone()
        if not farm:
            return create_response('error', 'Farm not found', 404)
        
        farm_columns = ['id', 'user_id', 'name', 'location', 'area_hectares', 
                       'crop_type', 'soil_type', 'irrigation_type', 'status', 
                       'created_at', 'updated_at', 'owner_name']
        farm_dict = dict(zip(farm_columns, farm))
        
        # Get latest prediction
        cursor.execute('''
            SELECT * FROM farm_analyses 
            WHERE farm_id = ? 
            ORDER BY created_at DESC 
            LIMIT 1
        ''', (farm_id,))
        
        latest_prediction = cursor.fetchone()
        latest_dict = None
        if latest_prediction:
            pred_columns = ['id', 'farm_id', 'analysis_type', 'temperature', 
                           'humidity', 'ph', 'rainfall', 'nitrogen', 'phosphorus', 
                           'potassium', 'organic_carbon', 'sunlight_hours', 
                           'wind_speed', 'altitude', 'fertilizer_used', 
                           'pesticide_used', 'season', 'region', 'predicted_yield', 
                           'predicted_revenue', 'efficiency_score', 'recommendations', 
                           'created_at']
            latest_dict = dict(zip(pred_columns, latest_prediction))
            if latest_dict['recommendations']:
                try:
                    latest_dict['recommendations'] = json.loads(latest_dict['recommendations'])
                except:
                    latest_dict['recommendations'] = []
        
        # Get prediction history (last 10)
        cursor.execute('''
            SELECT predicted_yield, predicted_revenue, efficiency_score, 
                   recommended_crop, created_at
            FROM farm_analyses
            WHERE farm_id = ?
            ORDER BY created_at DESC
            LIMIT 10
        ''', (farm_id,))
        
        history = cursor.fetchall()
        history_columns = ['predicted_yield', 'predicted_revenue', 'efficiency_score', 
                          'recommended_crop', 'created_at']
        history_list = []
        for h in history:
            history_dict = dict(zip(history_columns, h))
            history_list.append(history_dict)
        
        # Get market price trends
        cursor.execute('''
            SELECT crop, price_per_ton, date
            FROM market_prices
            ORDER BY date DESC
            LIMIT 12
        ''')
        
        price_data = cursor.fetchall()
        price_columns = ['crop', 'price_per_ton', 'date']
        price_list = []
        for p in price_data:
            price_dict = dict(zip(price_columns, p))
            price_list.append(price_dict)
        
        conn.close()
        
        # Compile dashboard data
        dashboard_data = {
            'farm': farm_dict,
            'latest_prediction': latest_dict,
            'prediction_history': history_list,
            'market_price_trends': price_list,
            'kpi_data': {
                'best_crop_match': latest_dict['recommendations'][0] if latest_dict and latest_dict['recommendations'] else 'Unknown',
                'expected_production': latest_dict['predicted_yield'] if latest_dict else 0,
                'expected_revenue': latest_dict['predicted_revenue'] if latest_dict else 0,
                'efficiency_score': latest_dict['efficiency_score'] if latest_dict else 0
            } if latest_dict else {
                'best_crop_match': 'No data',
                'expected_production': 0,
                'expected_revenue': 0,
                'efficiency_score': 0
            }
        }
        
        return create_response('success', 'Dashboard data retrieved successfully', dashboard_data)
    
    except Exception as e:
        return handle_errors(e)

def generate_insights(crop_rec, yield_pred, revenue_pred, efficiency):
    """Generate actionable insights for farmer"""
    insights = []
    
    # Crop insights
    confidence = crop_rec.get('confidence', 0)
    if confidence > 0.9:
        insights.append(f"High confidence ({confidence:.1%}) in {crop_rec['recommended_crop']} recommendation")
    
    # Yield insights
    predicted_yield = yield_pred.get('predicted_yield', 0)
    if predicted_yield > 20:
        insights.append("Excellent yield potential predicted")
    elif predicted_yield > 10:
        insights.append("Good yield potential predicted")
    else:
        insights.append("Consider optimizing inputs for better yield")
    
    # Revenue insights
    revenue = revenue_pred.get('predicted_revenue', 0)
    if revenue > 100000:
        insights.append(f"High revenue potential: {revenue:,.0f} EGP")
    
    # Efficiency insights
    efficiency_score = efficiency.get('final_efficiency_score', 0)
    if efficiency_score > 0.7:
        insights.append("Excellent farm efficiency score")
    elif efficiency_score > 0.5:
        insights.append("Good farm efficiency, room for improvement")
    else:
        insights.append("Consider optimizing resource usage")
    
    # Resource optimization suggestions
    water_eff = efficiency.get('water_efficiency', 0)
    if water_eff < 0.5:
        insights.append("Water usage efficiency is low - consider irrigation optimization")
    
    fertilizer_eff = efficiency.get('fertilizer_efficiency', 0)
    if fertilizer_eff < 0.5:
        insights.append("Fertilizer efficiency can be improved - consider soil testing")
    
    return insights

def validate_input_data(data, required_fields):
    """Validate that all required fields are present in input data"""
    if not data:
        return False
    
    for field in required_fields:
        if field not in data or data[field] is None:
            return False
    
    return True

def create_response(status, message, data=None, status_code=200):
    """Create standardized API response"""
    response = {
        'status': status,
        'message': message
    }
    
    if data is not None:
        response['data'] = data
    
    return jsonify(response), status_code

def handle_errors(error):
    """Handle and format errors consistently"""
    print(f"API Error: {str(error)}")
    return create_response('error', f'Internal server error: {str(error)}', 500)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
