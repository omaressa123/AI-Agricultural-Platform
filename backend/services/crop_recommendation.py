import pandas as pd
import numpy as np
import joblib
import os
from typing import Dict, List, Tuple

class CropRecommendationService:
    def __init__(self):
        self.model = None
        self.crop_mapping = {
            0: 'rice', 1: 'maize', 2: 'chickpea', 3: 'kidneybeans', 4: 'pigeonpeas',
            5: 'mothbeans', 6: 'mungbean', 7: 'blackgram', 8: 'lentil', 9: 'pomegranate',
            10: 'banana', 11: 'mango', 12: 'grapes', 13: 'watermelon', 14: 'muskmelon',
            15: 'apple', 16: 'orange', 17: 'papaya', 18: 'coconut', 19: 'cotton',
            20: 'jute', 21: 'coffee'
        }
        self.feature_names = ['temperature', 'humidity', 'ph', 'rainfall']
        self.load_model()
    
    def load_model(self):
        """Load the trained crop recommendation model"""
        try:
            model_path = os.path.join(os.path.dirname(__file__), '..', '..', 'model', 'crop_recommendation_model.pkl')
            self.model = joblib.load(model_path)
            print("✅ Crop recommendation model loaded successfully")
        except Exception as e:
            print(f"⚠️ Could not load crop recommendation model: {e}")
            self.model = None
    
    def recommend_crop(self, input_data: Dict) -> Dict:
        """
        Recommend the best crop based on environmental conditions
        
        Args:
            input_data: Dictionary containing temperature, humidity, ph, rainfall
            
        Returns:
            Dictionary with recommended crop and confidence scores
        """
        if self.model is None:
            return self._fallback_recommendation(input_data)
        
        try:
            # Prepare input data
            features = self._prepare_input(input_data)
            
            # Get prediction
            prediction = self.model.predict(features)[0]
            probabilities = self.model.predict_proba(features)[0]
            
            # Map prediction to crop name
            recommended_crop = self.crop_mapping.get(prediction, 'unknown')
            
            # Get top 3 recommendations with confidence
            top_indices = np.argsort(probabilities)[::-1][:3]
            top_crops = []
            for idx in top_indices:
                crop_name = self.crop_mapping.get(idx, 'unknown')
                confidence = float(probabilities[idx])
                top_crops.append({
                    'crop': crop_name,
                    'confidence': confidence
                })
            
            # Get feature importance
            feature_importance = self._get_feature_importance(features)
            
            return {
                'recommended_crop': recommended_crop,
                'confidence': float(probabilities[prediction]),
                'top_recommendations': top_crops,
                'feature_importance': feature_importance,
                'input_conditions': input_data
            }
            
        except Exception as e:
            print(f"Error in crop recommendation: {e}")
            return self._fallback_recommendation(input_data)
    
    def _prepare_input(self, input_data: Dict) -> np.ndarray:
        """Prepare input data for model prediction"""
        features = []
        for feature in self.feature_names:
            value = input_data.get(feature)
            if value is None:
                raise ValueError(f"Missing required feature: {feature}")
            features.append(float(value))
        
        return np.array(features).reshape(1, -1)
    
    def _get_feature_importance(self, features: np.ndarray) -> Dict:
        """Get feature importance for the prediction"""
        if self.model is None:
            return {}
        
        try:
            importance = self.model.feature_importances_
            return {
                feature: float(imp) 
                for feature, imp in zip(self.feature_names, importance)
            }
        except:
            return {}
    
    def _fallback_recommendation(self, input_data: Dict) -> Dict:
        """Fallback recommendation when model is not available"""
        # Simple rule-based recommendation
        temp = input_data.get('temperature', 25)
        humidity = input_data.get('humidity', 60)
        ph = input_data.get('ph', 6.5)
        rainfall = input_data.get('rainfall', 100)
        
        # Basic crop selection logic
        if rainfall > 200:
            recommended = 'rice'
            confidence = 0.7
        elif temp > 30 and humidity > 70:
            recommended = 'cotton'
            confidence = 0.6
        elif temp < 20 and rainfall < 100:
            recommended = 'wheat'
            confidence = 0.6
        else:
            recommended = 'maize'
            confidence = 0.5
        
        return {
            'recommended_crop': recommended,
            'confidence': confidence,
            'top_recommendations': [
                {'crop': recommended, 'confidence': confidence},
                {'crop': 'maize', 'confidence': 0.4},
                {'crop': 'cotton', 'confidence': 0.3}
            ],
            'feature_importance': {},
            'input_conditions': input_data,
            'note': 'Using fallback recommendation (model not available)'
        }
    
    def get_crop_requirements(self, crop_name: str) -> Dict:
        """Get typical requirements for a specific crop"""
        crop_requirements = {
            'rice': {
                'temperature_range': (20, 35),
                'humidity_range': (70, 90),
                'ph_range': (5.5, 7.0),
                'rainfall_range': (150, 300),
                'description': 'Requires high water and humidity'
            },
            'wheat': {
                'temperature_range': (15, 25),
                'humidity_range': (50, 70),
                'ph_range': (6.0, 7.5),
                'rainfall_range': (50, 150),
                'description': 'Moderate climate requirements'
            },
            'cotton': {
                'temperature_range': (25, 35),
                'humidity_range': (60, 80),
                'ph_range': (5.8, 7.0),
                'rainfall_range': (100, 200),
                'description': 'Warm climate with moderate rainfall'
            },
            'maize': {
                'temperature_range': (18, 32),
                'humidity_range': (50, 80),
                'ph_range': (5.5, 7.5),
                'rainfall_range': (80, 200),
                'description': 'Adaptable to various conditions'
            }
        }
        
        return crop_requirements.get(crop_name.lower(), {
            'temperature_range': (15, 35),
            'humidity_range': (40, 90),
            'ph_range': (5.5, 8.0),
            'rainfall_range': (50, 300),
            'description': 'General crop requirements'
        })
