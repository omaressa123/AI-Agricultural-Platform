import pandas as pd
import numpy as np
from typing import Dict, List, Any
from sklearn.preprocessing import MinMaxScaler
import os

class FarmEfficiencyService:
    def __init__(self):
        self.scaler = MinMaxScaler()
        self.efficiency_benchmarks = self._load_benchmarks()
    
    def _load_benchmarks(self) -> Dict:
        """Load efficiency benchmarks from historical data"""
        try:
            # Load farm efficiency scores if available
            benchmark_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'farm_efficiency_scores.csv')
            if os.path.exists(benchmark_path):
                df = pd.read_csv(benchmark_path)
                return {
                    'avg_yield_per_acre': df['Yield_per_Acre'].mean(),
                    'avg_water_efficiency': df['Water_Efficiency'].mean(),
                    'avg_fertilizer_efficiency': df['Fertilizer_Efficiency'].mean(),
                    'avg_pesticide_efficiency': df['Pesticide_Efficiency'].mean(),
                    'avg_input_efficiency': df['Input_Efficiency'].mean()
                }
        except Exception as e:
            print(f"Could not load benchmarks: {e}")
        
        # Default benchmarks
        return {
            'avg_yield_per_acre': 0.15,  # tons per acre
            'avg_water_efficiency': 0.0005,  # yield per cubic meter
            'avg_fertilizer_efficiency': 5.0,  # yield per ton of fertilizer
            'avg_pesticide_efficiency': 10.0,  # yield per kg of pesticide
            'avg_input_efficiency': 0.0001  # yield per total input
        }
    
    def calculate_efficiency(self, input_data: Dict) -> Dict:
        """
        Calculate comprehensive farm efficiency metrics
        
        Args:
            input_data: Dictionary containing farm data
            
        Returns:
            Dictionary with efficiency metrics and scores
        """
        try:
            # Extract input values
            farm_area = float(input_data.get('farm_area', 1))
            fertilizer_used = float(input_data.get('fertilizer_used', 0))
            pesticide_used = float(input_data.get('pesticide_used', 0))
            water_usage = float(input_data.get('water_usage', 0))
            yield_tons = float(input_data.get('yield', 0))
            
            # Calculate efficiency metrics
            efficiency_metrics = self._calculate_individual_efficiencies(
                farm_area, fertilizer_used, pesticide_used, water_usage, yield_tons
            )
            
            # Calculate normalized scores
            normalized_scores = self._normalize_efficiency_scores(efficiency_metrics)
            
            # Calculate final efficiency score
            final_score = self._calculate_final_efficiency_score(normalized_scores)
            
            # Generate recommendations
            recommendations = self._generate_recommendations(efficiency_metrics, normalized_scores)
            
            # Performance rating
            performance_rating = self._get_performance_rating(final_score)
            
            return {
                'efficiency_metrics': efficiency_metrics,
                'normalized_scores': normalized_scores,
                'final_efficiency_score': final_score,
                'performance_rating': performance_rating,
                'recommendations': recommendations,
                'benchmarks': self.efficiency_benchmarks
            }
            
        except Exception as e:
            print(f"Error calculating efficiency: {e}")
            return self._fallback_efficiency(input_data)
    
    def _calculate_individual_efficiencies(self, farm_area: float, fertilizer: float, 
                                         pesticide: float, water: float, yield_tons: float) -> Dict:
        """Calculate individual efficiency metrics"""
        metrics = {}
        
        # Yield per acre
        if farm_area > 0:
            metrics['yield_per_acre'] = yield_tons / farm_area
        else:
            metrics['yield_per_acre'] = 0
        
        # Water efficiency (yield per cubic meter of water)
        if water > 0:
            metrics['water_efficiency'] = yield_tons / water
        else:
            metrics['water_efficiency'] = 0
        
        # Fertilizer efficiency (yield per ton of fertilizer)
        if fertilizer > 0:
            metrics['fertilizer_efficiency'] = yield_tons / fertilizer
        else:
            metrics['fertilizer_efficiency'] = 0
        
        # Pesticide efficiency (yield per kg of pesticide)
        if pesticide > 0:
            metrics['pesticide_efficiency'] = yield_tons / pesticide
        else:
            metrics['pesticide_efficiency'] = 0
        
        # Input efficiency (yield per total input cost approximation)
        total_input = fertilizer + (pesticide / 1000) + (water / 10000)  # Normalize inputs
        if total_input > 0:
            metrics['input_efficiency'] = yield_tons / total_input
        else:
            metrics['input_efficiency'] = 0
        
        # Resource utilization ratios
        metrics['fertilizer_per_acre'] = fertilizer / farm_area if farm_area > 0 else 0
        metrics['pesticide_per_acre'] = pesticide / farm_area if farm_area > 0 else 0
        metrics['water_per_acre'] = water / farm_area if farm_area > 0 else 0
        
        return metrics
    
    def _normalize_efficiency_scores(self, metrics: Dict) -> Dict:
        """Normalize efficiency scores to 0-1 scale"""
        normalized = {}
        
        # Normalize each metric against benchmarks
        for metric_name, value in metrics.items():
            if metric_name in self.efficiency_benchmarks:
                benchmark = self.efficiency_benchmarks[metric_name]
                if benchmark > 0:
                    # Normalize to 0-1 scale, capping at 1.0
                    normalized_score = min(1.0, value / benchmark)
                    normalized[metric_name] = normalized_score
                else:
                    normalized[metric_name] = 0
            else:
                # For ratios, use different normalization
                if 'per_acre' in metric_name:
                    # These are input metrics, lower is better for some
                    normalized[metric_name] = min(1.0, value / 10)  # Arbitrary scaling
                else:
                    normalized[metric_name] = min(1.0, value)
        
        return normalized
    
    def _calculate_final_efficiency_score(self, normalized_scores: Dict) -> float:
        """Calculate final efficiency score as weighted average"""
        # Define weights for different metrics
        weights = {
            'yield_per_acre': 0.25,
            'water_efficiency': 0.20,
            'fertilizer_efficiency': 0.20,
            'pesticide_efficiency': 0.15,
            'input_efficiency': 0.20
        }
        
        weighted_sum = 0
        total_weight = 0
        
        for metric, score in normalized_scores.items():
            if metric in weights:
                weighted_sum += score * weights[metric]
                total_weight += weights[metric]
        
        if total_weight > 0:
            return round(weighted_sum / total_weight, 3)
        else:
            return 0.0
    
    def _generate_recommendations(self, metrics: Dict, normalized_scores: Dict) -> List[str]:
        """Generate actionable recommendations based on efficiency metrics"""
        recommendations = []
        
        # Water efficiency recommendations
        water_score = normalized_scores.get('water_efficiency', 0)
        if water_score < 0.5:
            recommendations.append("Consider implementing drip irrigation to improve water efficiency")
            recommendations.append("Monitor soil moisture to optimize irrigation scheduling")
        elif water_score < 0.7:
            recommendations.append("Water usage is moderate - consider slight optimization")
        
        # Fertilizer efficiency recommendations
        fert_score = normalized_scores.get('fertilizer_efficiency', 0)
        fert_per_acre = metrics.get('fertilizer_per_acre', 0)
        if fert_score < 0.5:
            recommendations.append("Conduct soil testing to optimize fertilizer application")
            if fert_per_acre > 0.1:  # High fertilizer use
                recommendations.append("Consider reducing fertilizer by 10-20% with precision agriculture")
        elif fert_score < 0.7:
            recommendations.append("Fertilizer efficiency is moderate - consider split applications")
        
        # Pesticide efficiency recommendations
        pest_score = normalized_scores.get('pesticide_efficiency', 0)
        pest_per_acre = metrics.get('pesticide_per_acre', 0)
        if pest_score < 0.5:
            recommendations.append("Implement integrated pest management (IPM) practices")
            if pest_per_acre > 5:  # High pesticide use
                recommendations.append("Consider biological pest control methods")
        
        # Yield efficiency recommendations
        yield_score = normalized_scores.get('yield_per_acre', 0)
        if yield_score < 0.5:
            recommendations.append("Consider crop rotation to improve soil health")
            recommendations.append("Evaluate planting density and timing")
        
        # Overall recommendations
        if len(recommendations) == 0:
            recommendations.append("Farm efficiency is excellent - maintain current practices")
        
        return recommendations
    
    def _get_performance_rating(self, score: float) -> str:
        """Get performance rating based on efficiency score"""
        if score >= 0.8:
            return "Excellent"
        elif score >= 0.6:
            return "Good"
        elif score >= 0.4:
            return "Moderate"
        elif score >= 0.2:
            return "Poor"
        else:
            return "Very Poor"
    
    def _fallback_efficiency(self, input_data: Dict) -> Dict:
        """Fallback efficiency calculation when errors occur"""
        return {
            'efficiency_metrics': {},
            'normalized_scores': {},
            'final_efficiency_score': 0.0,
            'performance_rating': 'Unknown',
            'recommendations': ['Unable to calculate efficiency - check input data'],
            'benchmarks': self.efficiency_benchmarks,
            'error': 'Fallback calculation used'
        }
    
    def compare_with_benchmarks(self, farm_metrics: Dict) -> Dict:
        """Compare farm metrics with industry benchmarks"""
        comparison = {}
        
        for metric, value in farm_metrics.items():
            if metric in self.efficiency_benchmarks:
                benchmark = self.efficiency_benchmarks[metric]
                if benchmark > 0:
                    percentage = (value / benchmark) * 100
                    comparison[metric] = {
                        'farm_value': value,
                        'benchmark': benchmark,
                        'percentage_of_benchmark': percentage,
                        'performance': 'above' if percentage > 100 else 'below'
                    }
        
        return comparison
    
    def get_efficiency_trends(self, historical_data: List[Dict]) -> Dict:
        """Analyze efficiency trends over time"""
        if not historical_data:
            return {'trend': 'no_data', 'message': 'No historical data available'}
        
        # Calculate efficiency for each time period
        efficiency_scores = []
        for data_point in historical_data:
            result = self.calculate_efficiency(data_point)
            efficiency_scores.append(result['final_efficiency_score'])
        
        # Calculate trend
        if len(efficiency_scores) < 2:
            return {'trend': 'insufficient_data', 'message': 'Need more data points'}
        
        recent_avg = np.mean(efficiency_scores[-3:])  # Last 3 periods
        earlier_avg = np.mean(efficiency_scores[:-3]) if len(efficiency_scores) > 3 else np.mean(efficiency_scores[:-1])
        
        if recent_avg > earlier_avg * 1.1:
            trend = 'improving'
        elif recent_avg < earlier_avg * 0.9:
            trend = 'declining'
        else:
            trend = 'stable'
        
        return {
            'trend': trend,
            'recent_average': recent_avg,
            'earlier_average': earlier_avg,
            'improvement_percentage': ((recent_avg - earlier_avg) / earlier_avg) * 100 if earlier_avg > 0 else 0,
            'efficiency_scores': efficiency_scores
        }
