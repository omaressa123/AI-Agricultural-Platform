from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import os
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

from services.crop_recommendation import CropRecommendationService
from services.yield_prediction import YieldPredictionService
from services.farm_efficiency import FarmEfficiencyService
from services.market_price import MarketPriceService
from utils.validators import validate_input_data
from utils.helpers import create_response, handle_errors

app = Flask(__name__)
CORS(app)

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
            'farmer_workflow': '/api/farmer-workflow'
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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
