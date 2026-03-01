import pandas as pd
import numpy as np
from typing import Dict, List, Any, Optional
import os
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler

class MarketPriceService:
    def __init__(self):
        self.price_data = None
        self.price_features = None
        self.crop_mapping = self._create_crop_mapping()
        self.load_price_data()
    
    def _create_crop_mapping(self) -> Dict:
        """Create mapping between crop names and database entries"""
        return {
            'wheat': ['Wheat (قمح)'],
            'rice': ['Rice (أرز)'],
            'maize': ['Maize (ذرة صفراء)'],
            'corn': ['Maize (ذرة صفراء)'],
            'cotton': ['Cotton (قطن)'],
            'potato': ['Potato (بطاطس)'],
            'tomato': ['Tomato (طماطم)'],
            'onion': ['Onion (بصل)'],
            'sugarcane': ['Sugar Beet (بنجر السكر)'],  # Using sugar beet as proxy
            'barley': ['Wheat (قمح)'],  # Using wheat as proxy
            'sugarcane': ['Sugar Beet (بنجر السكر)']
        }
    
    def load_price_data(self):
        """Load market price data"""
        try:
            data_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'egypt_local_crop_prices_2023_2025.csv')
            self.price_data = pd.read_csv(data_path)
            self.price_data['Date'] = pd.to_datetime(self.price_data['Date'])
            print("✅ Market price data loaded successfully")
        except Exception as e:
            print(f"⚠️ Could not load market price data: {e}")
            # Create fallback data
            self.price_data = self._create_fallback_data()
    
    def _create_sample_data(self):
        """Create sample price data when real data is not available"""
        # Create sample price data for common crops
        crops = ['Wheat', 'Rice', 'Maize', 'Cotton', 'Potato', 'Tomato']
        dates = pd.date_range(start='2023-01-01', end='2025-12-31', freq='D')
        
        data = []
        for crop in crops:
            base_price = np.random.uniform(5000, 15000)
            for date in dates:
                # Add some random variation and trend
                price = base_price * (1 + np.random.normal(0, 0.1))
                price *= (1 + (date - dates[0]).days / 365 * 0.05)  # 5% annual increase
                data.append({
                    'Date': date,
                    'Crop': crop,
                    'Price_per_Ton_EGP': max(price, 1000)  # Minimum price
                })
        
        self.price_data = pd.DataFrame(data)
        self._calculate_price_features()
        print("✅ Sample market price data created")
    
    def _calculate_price_features(self):
        """Calculate price features for analysis"""
        if self.price_data is None:
            return
        
        # Group by crop and calculate statistics
        self.price_features = self.price_data.groupby('Crop')['Price_per_Ton_EGP'].agg([
            'mean', 'std', 'min', 'max', 'count'
        ]).reset_index()
        
        self.price_features.rename(columns={
            'mean': 'Avg_Price',
            'std': 'Price_Std',
            'min': 'Min_Price',
            'max': 'Max_Price',
            'count': 'Data_Points'
        }, inplace=True)
        
        # Add price volatility
        self.price_features['Price_Volatility'] = self.price_features['Price_Std'] / self.price_features['Avg_Price']
    
    def get_market_price(self, crop_name: Optional[str] = None) -> Dict:
        """
        Get current market prices for crops
        
        Args:
            crop_name: Optional specific crop name
            
        Returns:
            Dictionary with price information
        """
        try:
            if self.price_data is None:
                return self._fallback_price_data(crop_name)
            
            if crop_name:
                # Get price for specific crop
                crop_variants = self.crop_mapping.get(crop_name.lower(), [crop_name])
                crop_data = self.price_data[self.price_data['Crop'].isin(crop_variants)]
                
                if crop_data.empty:
                    return {'error': f'No price data found for {crop_name}'}
                
                # Get latest price
                latest_data = crop_data.iloc[-1]
                latest_price = latest_data['Price_per_Ton_EGP']
                
                # Get price statistics
                crop_features = self.price_features[self.price_features['Crop'].isin(crop_variants)]
                if not crop_features.empty:
                    features = crop_features.iloc[0]
                    stats = {
                        'average_price': float(features['Avg_Price']),
                        'price_std': float(features['Price_Std']),
                        'min_price': float(features['Min_Price']),
                        'max_price': float(features['Max_Price']),
                        'volatility': float(features['Price_Volatility'])
                    }
                else:
                    stats = {}
                
                # Get price trend
                trend = self._calculate_price_trend(crop_data)
                
                return {
                    'crop': crop_name,
                    'current_price': float(latest_price),
                    'price_date': latest_data['Date'].isoformat(),
                    'statistics': stats,
                    'trend': trend,
                    'price_history': self._get_recent_prices(crop_data, 30)
                }
            else:
                # Get all crops
                all_prices = {}
                for crop in self.price_data['Crop'].unique():
                    latest_data = self.price_data[self.price_data['Crop'] == crop].iloc[-1]
                    all_prices[crop] = {
                        'current_price': float(latest_data['Price_per_Ton_EGP']),
                        'price_date': latest_data['Date'].isoformat()
                    }
                
                return {
                    'all_crops': all_prices,
                    'market_summary': self._get_market_summary(),
                    'last_updated': datetime.now().isoformat()
                }
                
        except Exception as e:
            print(f"Error getting market price: {e}")
            return self._fallback_price_data(crop_name)
    
    def _calculate_price_trend(self, crop_data: pd.DataFrame) -> Dict:
        """Calculate price trend for a crop"""
        try:
            # Get last 90 days of data
            recent_data = crop_data.tail(90)
            if len(recent_data) < 30:
                return {'trend': 'insufficient_data', 'direction': 'unknown'}
            
            # Prepare data for trend analysis
            X = np.arange(len(recent_data)).reshape(-1, 1)
            y = recent_data['Price_per_Ton_EGP'].values
            
            # Simple linear regression for trend
            model = LinearRegression()
            model.fit(X, y)
            
            slope = model.coef_[0]
            r_squared = model.score(X, y)
            
            # Determine trend direction
            if slope > 0.1:
                direction = 'increasing'
            elif slope < -0.1:
                direction = 'decreasing'
            else:
                direction = 'stable'
            
            # Calculate percentage change
            if len(recent_data) >= 2:
                price_change = (recent_data.iloc[-1]['Price_per_Ton_EGP'] - recent_data.iloc[0]['Price_per_Ton_EGP'])
                percentage_change = (price_change / recent_data.iloc[0]['Price_per_Ton_EGP']) * 100
            else:
                percentage_change = 0
            
            return {
                'trend': direction,
                'slope': float(slope),
                'r_squared': float(r_squared),
                'percentage_change': float(percentage_change),
                'confidence': 'high' if r_squared > 0.7 else 'medium' if r_squared > 0.4 else 'low'
            }
            
        except Exception as e:
            print(f"Error calculating trend: {e}")
            return {'trend': 'error', 'direction': 'unknown'}
    
    def _get_recent_prices(self, crop_data: pd.DataFrame, days: int) -> List[Dict]:
        """Get recent price history"""
        try:
            recent_data = crop_data.tail(days)
            return [
                {
                    'date': row['Date'].isoformat(),
                    'price': float(row['Price_per_Ton_EGP'])
                }
                for _, row in recent_data.iterrows()
            ]
        except:
            return []
    
    def _get_market_summary(self) -> Dict:
        """Get overall market summary"""
        try:
            if self.price_features is None:
                return {}
            
            summary = {
                'total_crops_tracked': len(self.price_features),
                'average_market_price': float(self.price_features['Avg_Price'].mean()),
                'price_volatility_average': float(self.price_features['Price_Volatility'].mean()),
                'highest_priced_crop': self.price_features.loc[self.price_features['Avg_Price'].idxmax(), 'Crop'],
                'lowest_priced_crop': self.price_features.loc[self.price_features['Avg_Price'].idxmin(), 'Crop']
            }
            
            return summary
            
        except Exception as e:
            print(f"Error creating market summary: {e}")
            return {}
    
    def predict_revenue(self, input_data: Dict) -> Dict:
        """
        Predict revenue based on yield and market prices
        
        Args:
            input_data: Dictionary with crop_type, predicted_yield, farm_area
            
        Returns:
            Dictionary with revenue prediction and analysis
        """
        try:
            crop_type = input_data.get('crop_type', '').lower()
            predicted_yield = float(input_data.get('predicted_yield', 0))
            farm_area = float(input_data.get('farm_area', 1))
            
            # Get market price for the crop
            price_data = self.get_market_price(crop_type)
            
            if 'error' in price_data:
                return self._fallback_revenue_prediction(input_data)
            
            current_price = price_data.get('current_price', 0)
            
            # Calculate revenue
            total_yield = predicted_yield * farm_area  # Total yield in tons
            gross_revenue = total_yield * current_price  # Revenue in EGP
            
            # Estimate production costs (simplified)
            cost_per_ton = self._estimate_production_cost(crop_type)
            total_cost = total_yield * cost_per_ton
            
            # Calculate net revenue
            net_revenue = gross_revenue - total_cost
            profit_margin = (net_revenue / gross_revenue) * 100 if gross_revenue > 0 else 0
            
            # Price risk analysis
            price_risk = self._analyze_price_risk(price_data)
            
            # Revenue scenarios
            scenarios = self._calculate_revenue_scenarios(
                total_yield, current_price, cost_per_ton, price_data
            )
            
            return {
                'crop_type': crop_type,
                'predicted_yield_per_hectare': predicted_yield,
                'farm_area': farm_area,
                'total_yield_tons': total_yield,
                'market_price_per_ton': current_price,
                'gross_revenue_egp': gross_revenue,
                'estimated_costs_egp': total_cost,
                'net_revenue_egp': net_revenue,
                'profit_margin_percentage': profit_margin,
                'revenue_per_hectare': gross_revenue / farm_area if farm_area > 0 else 0,
                'net_revenue_per_hectare': net_revenue / farm_area if farm_area > 0 else 0,
                'price_risk_analysis': price_risk,
                'revenue_scenarios': scenarios,
                'recommendations': self._generate_revenue_recommendations(
                    net_revenue, profit_margin, price_risk
                )
            }
            
        except Exception as e:
            print(f"Error predicting revenue: {e}")
            return self._fallback_revenue_prediction(input_data)
    
    def _estimate_production_cost(self, crop_type: str) -> float:
        """Estimate production cost per ton for different crops"""
        cost_estimates = {
            'wheat': 3000,
            'rice': 4000,
            'maize': 3500,
            'cotton': 8000,
            'potato': 2500,
            'tomato': 3000,
            'sugarcane': 2000
        }
        
        return cost_estimates.get(crop_type.lower(), 3000)
    
    def _analyze_price_risk(self, price_data: Dict) -> Dict:
        """Analyze price risk based on volatility and trend"""
        statistics = price_data.get('statistics', {})
        trend = price_data.get('trend', {})
        
        volatility = statistics.get('volatility', 0)
        trend_direction = trend.get('trend', 'stable')
        confidence = trend.get('confidence', 'low')
        
        # Risk assessment
        if volatility > 0.2:
            risk_level = 'high'
        elif volatility > 0.1:
            risk_level = 'medium'
        else:
            risk_level = 'low'
        
        # Adjust risk based on trend
        if trend_direction == 'decreasing' and confidence == 'high':
            risk_level = 'high' if risk_level != 'high' else 'very_high'
        elif trend_direction == 'increasing' and confidence == 'high':
            risk_level = 'low' if risk_level != 'low' else 'very_low'
        
        return {
            'risk_level': risk_level,
            'volatility': volatility,
            'trend_direction': trend_direction,
            'trend_confidence': confidence,
            'price_stability': 'stable' if volatility < 0.1 else 'unstable'
        }
    
    def _calculate_revenue_scenarios(self, total_yield: float, current_price: float, 
                                   cost_per_ton: float, price_data: Dict) -> Dict:
        """Calculate revenue scenarios based on price variations"""
        statistics = price_data.get('statistics', {})
        price_std = statistics.get('price_std', current_price * 0.1)
        
        scenarios = {}
        
        # Best case scenario (price + 1 std)
        best_price = current_price + price_std
        scenarios['best_case'] = {
            'price_per_ton': best_price,
            'gross_revenue': total_yield * best_price,
            'net_revenue': total_yield * (best_price - cost_per_ton)
        }
        
        # Worst case scenario (price - 1 std)
        worst_price = max(current_price - price_std, current_price * 0.5)  # Floor at 50%
        scenarios['worst_case'] = {
            'price_per_ton': worst_price,
            'gross_revenue': total_yield * worst_price,
            'net_revenue': total_yield * (worst_price - cost_per_ton)
        }
        
        # Expected scenario (current price)
        scenarios['expected'] = {
            'price_per_ton': current_price,
            'gross_revenue': total_yield * current_price,
            'net_revenue': total_yield * (current_price - cost_per_ton)
        }
        
        return scenarios
    
    def _generate_revenue_recommendations(self, net_revenue: float, profit_margin: float, 
                                        price_risk: Dict) -> List[str]:
        """Generate revenue optimization recommendations"""
        recommendations = []
        
        # Profit margin recommendations
        if profit_margin < 10:
            recommendations.append("Consider optimizing production costs to improve profit margins")
        elif profit_margin > 30:
            recommendations.append("Excellent profit margins - consider scaling production")
        
        # Price risk recommendations
        risk_level = price_risk.get('risk_level', 'medium')
        if risk_level == 'high':
            recommendations.append("High price volatility - consider hedging or forward contracts")
            recommendations.append("Monitor market trends closely for optimal selling time")
        elif risk_level == 'low':
            recommendations.append("Price stability allows for longer-term planning")
        
        # General recommendations
        if net_revenue > 100000:
            recommendations.append("Strong revenue potential - consider value-added processing")
        elif net_revenue < 20000:
            recommendations.append("Consider crop diversification to improve revenue stability")
        
        return recommendations
    
    def _fallback_price_data(self, crop_name: Optional[str] = None) -> Dict:
        """Fallback price data when real data is not available"""
        sample_prices = {
            'wheat': 10000,
            'rice': 13000,
            'maize': 12000,
            'cotton': 20000,
            'potato': 6000,
            'tomato': 5000
        }
        
        if crop_name:
            price = sample_prices.get(crop_name.lower(), 8000)
            return {
                'crop': crop_name,
                'current_price': price,
                'price_date': datetime.now().isoformat(),
                'statistics': {
                    'average_price': price,
                    'price_std': price * 0.1,
                    'volatility': 0.1
                },
                'trend': {'trend': 'stable', 'direction': 'stable'},
                'note': 'Using sample price data'
            }
        else:
            return {
                'all_crops': {crop: {'current_price': price} for crop, price in sample_prices.items()},
                'note': 'Using sample price data'
            }
    
    def _fallback_revenue_prediction(self, input_data: Dict) -> Dict:
        """Fallback revenue prediction"""
        crop_type = input_data.get('crop_type', 'unknown')
        predicted_yield = float(input_data.get('predicted_yield', 0))
        farm_area = float(input_data.get('farm_area', 1))
        
        # Use fallback price
        price_data = self._fallback_price_data(crop_type)
        current_price = price_data.get('current_price', 8000)
        
        total_yield = predicted_yield * farm_area
        gross_revenue = total_yield * current_price
        cost_per_ton = self._estimate_production_cost(crop_type)
        total_cost = total_yield * cost_per_ton
        net_revenue = gross_revenue - total_cost
        
        return {
            'crop_type': crop_type,
            'predicted_yield_per_hectare': predicted_yield,
            'farm_area': farm_area,
            'total_yield_tons': total_yield,
            'market_price_per_ton': current_price,
            'gross_revenue_egp': gross_revenue,
            'estimated_costs_egp': total_cost,
            'net_revenue_egp': net_revenue,
            'profit_margin_percentage': (net_revenue / gross_revenue) * 100 if gross_revenue > 0 else 0,
            'note': 'Using fallback revenue prediction'
        }
