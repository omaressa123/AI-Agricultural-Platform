import pandas as pd
import numpy as np
import joblib
import os
from typing import Dict, List, Any
import shap

class YieldPredictionService:
    def __init__(self):
        self.pipeline = None
        self.model = None
        self.preprocessor = None
        self.feature_columns = [
            'N', 'P', 'K', 'Soil_pH', 'Soil_Moisture', 'Soil_Type',
            'Organic_Carbon', 'Temperature', 'Humidity', 'Rainfall',
            'Sunlight_Hours', 'Wind_Speed', 'Region', 'Altitude', 'Season',
            'Crop_Type', 'Irrigation_Type', 'Fertilizer_Used', 'Pesticide_Used'
        ]
        self.load_model()
    
    def load_model(self):
        """Load the trained yield prediction pipeline"""
        try:
            model_path = os.path.join(os.path.dirname(__file__), '..', '..', 'model', 'yield_prediction_pipeline.pkl')
            
            # Try to load with joblib
            self.pipeline = joblib.load(model_path)
            
            # Handle different sklearn versions safely
            try:
                if hasattr(self.pipeline, 'named_steps'):
                    self.model = self.pipeline.named_steps['model']
                    self.preprocessor = self.pipeline.named_steps['preprocessor']
                else:
                    # For newer sklearn versions or different pipeline formats
                    self.model = self.pipeline
                    self.preprocessor = None
                print("✅ Yield prediction model loaded successfully")
            except AttributeError as ae:
                print(f"⚠️ Pipeline structure changed: {ae}")
                # Use the pipeline as a whole if we can't extract components
                self.model = self.pipeline
                self.preprocessor = None
                print("✅ Using pipeline as whole model")
                
        except Exception as e:
            print(f"⚠️ Could not load yield prediction model: {e}")
            print("🔄 Using fallback prediction method")
            self.pipeline = None
            self.model = None
            self.preprocessor = None
    
    def predict_yield(self, input_data: Dict) -> Dict:
        """
        Predict crop yield based on farm conditions and inputs
        
        Args:
            input_data: Dictionary containing all required features
            
        Returns:
            Dictionary with predicted yield and additional insights
        """
        if self.pipeline is None:
            return self._fallback_prediction(input_data)
        
        try:
            # Prepare input data
            features_df = self._prepare_input(input_data)
            
            # Make prediction
            predicted_yield = float(self.pipeline.predict(features_df)[0])
            
            # Calculate prediction interval (simplified)
            prediction_interval = self._calculate_prediction_interval(predicted_yield)
            
            # Get feature explanations
            feature_explanations = self._get_feature_explanations(features_df)
            
            # Calculate yield efficiency metrics
            efficiency_metrics = self._calculate_yield_efficiency(input_data, predicted_yield)
            
            return {
                'predicted_yield': predicted_yield,
                'prediction_interval': prediction_interval,
                'yield_per_hectare': predicted_yield,  # Since model predicts per hectare
                'feature_explanations': feature_explanations,
                'efficiency_metrics': efficiency_metrics,
                'model_confidence': 'high' if predicted_yield > 0 else 'low'
            }
            
        except Exception as e:
            print(f"Error in yield prediction: {e}")
            return self._fallback_prediction(input_data)
    
    def _prepare_input(self, input_data: Dict) -> pd.DataFrame:
        """Prepare input data for model prediction"""
        # Create a DataFrame with all required columns
        features = {}
        
        # Set default values for missing features
        default_values = {
            'N': 50, 'P': 50, 'K': 50, 'Soil_Moisture': 50, 'Soil_Type': 'Loamy',
            'Organic_Carbon': 1.0, 'Sunlight_Hours': 8, 'Wind_Speed': 5, 'Region': 'Nile Delta',
            'Altitude': 50, 'Season': 'Summer'
        }
        
        # Fill with provided data or defaults
        for col in self.feature_columns:
            if col in input_data:
                features[col] = input_data[col]
            elif col in default_values:
                features[col] = default_values[col]
            else:
                features[col] = 0  # Default fallback
        
        return pd.DataFrame([features])
    
    def _calculate_prediction_interval(self, prediction: float) -> Dict:
        """Calculate prediction interval (simplified approach)"""
        # Using a simplified approach - in production, use proper statistical methods
        std_error = prediction * 0.1  # Assume 10% standard error
        return {
            'lower_bound': max(0, prediction - 1.96 * std_error),
            'upper_bound': prediction + 1.96 * std_error,
            'confidence_level': 0.95
        }
    
    def _get_feature_explanations(self, features_df: pd.DataFrame) -> Dict:
        """Get feature explanations using SHAP values"""
        if self.model is None or self.preprocessor is None:
            return {}
        
        try:
            # Transform features
            features_transformed = self.preprocessor.transform(features_df)
            
            # Calculate SHAP values
            explainer = shap.TreeExplainer(self.model)
            shap_values = explainer.shap_values(features_transformed)
            
            # Get feature names
            feature_names = self.preprocessor.get_feature_names_out()
            
            # Create explanation dictionary
            explanations = {}
            for i, (name, value) in enumerate(zip(feature_names, shap_values[0])):
                explanations[name] = float(value)
            
            # Sort by importance
            sorted_explanations = dict(
                sorted(explanations.items(), key=lambda x: abs(x[1]), reverse=True)[:10]
            )
            
            return {
                'shap_values': sorted_explanations,
                'top_factors': list(sorted_explanations.keys())[:5]
            }
            
        except Exception as e:
            print(f"Error calculating SHAP values: {e}")
            return {}
    
    def _calculate_yield_efficiency(self, input_data: Dict, predicted_yield: float) -> Dict:
        """Calculate yield efficiency metrics"""
        efficiency_metrics = {}
        
        # Fertilizer efficiency
        fertilizer_used = input_data.get('Fertilizer_Used', 0)
        if fertilizer_used > 0:
            efficiency_metrics['fertilizer_efficiency'] = predicted_yield / fertilizer_used
        
        # Water efficiency (if rainfall available)
        rainfall = input_data.get('Rainfall', 0)
        if rainfall > 0:
            efficiency_metrics['water_efficiency'] = predicted_yield / rainfall
        
        # NPK efficiency
        n = input_data.get('N', 0)
        p = input_data.get('P', 0)
        k = input_data.get('K', 0)
        npk_total = n + p + k
        if npk_total > 0:
            efficiency_metrics['npk_efficiency'] = predicted_yield / npk_total
        
        return efficiency_metrics
    
    def _fallback_prediction(self, input_data: Dict) -> Dict:
        """Fallback prediction when model is not available"""
        # Simple rule-based prediction
        crop_type = input_data.get('Crop_Type', 'maize').lower()
        fertilizer = input_data.get('Fertilizer_Used', 100)
        rainfall = input_data.get('Rainfall', 100)
        
        # Base yield by crop type
        base_yields = {
            'rice': 25, 'wheat': 15, 'maize': 20, 'cotton': 12,
            'sugarcane': 70, 'potato': 30, 'tomato': 40
        }
        
        base_yield = base_yields.get(crop_type, 20)
        
        # Adjust based on inputs
        fertilizer_factor = min(2.0, fertilizer / 100)
        rainfall_factor = min(1.5, rainfall / 150)
        
        predicted_yield = base_yield * fertilizer_factor * rainfall_factor
        
        return {
            'predicted_yield': predicted_yield,
            'prediction_interval': {
                'lower_bound': predicted_yield * 0.8,
                'upper_bound': predicted_yield * 1.2,
                'confidence_level': 0.7
            },
            'yield_per_hectare': predicted_yield,
            'feature_explanations': {},
            'efficiency_metrics': self._calculate_yield_efficiency(input_data, predicted_yield),
            'model_confidence': 'low',
            'note': 'Using fallback prediction (model not available)'
        }
    
    def get_yield_potential(self, crop_type: str, conditions: Dict) -> Dict:
        """Get yield potential for a specific crop under given conditions"""
        # Create input data for prediction
        input_data = {
            'Crop_Type': crop_type,
            **conditions
        }
        
        # Get prediction
        result = self.predict_yield(input_data)
        
        # Add potential analysis
        predicted_yield = result['predicted_yield']
        
        # Compare with average yields
        average_yields = {
            'rice': 25, 'wheat': 15, 'maize': 20, 'cotton': 12,
            'sugarcane': 70, 'potato': 30, 'tomato': 40
        }
        
        avg_yield = average_yields.get(crop_type.lower(), 20)
        potential_ratio = predicted_yield / avg_yield
        
        if potential_ratio > 1.2:
            potential = 'excellent'
        elif potential_ratio > 1.0:
            potential = 'good'
        elif potential_ratio > 0.8:
            potential = 'moderate'
        else:
            potential = 'poor'
        
        result['yield_potential'] = potential
        result['potential_ratio'] = potential_ratio
        result['average_yield'] = avg_yield
        
        return result
