from flask import jsonify
from typing import Dict, Any
import traceback
from datetime import datetime

def create_response(status: str, message: str, data: Any = None, status_code: int = 200) -> tuple:
    """
    Create standardized API response
    
    Args:
        status: Response status ('success', 'error', 'warning')
        message: Response message
        data: Response data (optional)
        status_code: HTTP status code
        
    Returns:
        Tuple of (response, status_code)
    """
    response = {
        'status': status,
        'message': message,
        'timestamp': datetime.now().isoformat()
    }
    
    if data is not None:
        response['data'] = data
    
    return jsonify(response), status_code

def handle_errors(error: Exception) -> tuple:
    """
    Handle exceptions and return standardized error response
    
    Args:
        error: Exception object
        
    Returns:
        Tuple of (error_response, status_code)
    """
    error_message = str(error)
    error_traceback = traceback.format_exc()
    
    # Log the error (in production, use proper logging)
    print(f"Error occurred: {error_message}")
    print(f"Traceback: {error_traceback}")
    
    # Determine appropriate status code
    if "not found" in error_message.lower():
        status_code = 404
    elif "permission" in error_message.lower() or "unauthorized" in error_message.lower():
        status_code = 403
    elif "validation" in error_message.lower() or "invalid" in error_message.lower():
        status_code = 400
    else:
        status_code = 500
    
    return create_response(
        'error',
        f"An error occurred: {error_message}",
        {'error_type': type(error).__name__},
        status_code
    )

def format_currency(amount: float, currency: str = 'EGP') -> str:
    """
    Format currency amount
    
    Args:
        amount: Amount to format
        currency: Currency code
        
    Returns:
        Formatted currency string
    """
    return f"{amount:,.2f} {currency}"

def format_percentage(value: float, decimal_places: int = 2) -> str:
    """
    Format percentage value
    
    Args:
        value: Value to format (as decimal, e.g., 0.25 for 25%)
        decimal_places: Number of decimal places
        
    Returns:
        Formatted percentage string
    """
    return f"{value * 100:.{decimal_places}f}%"

def calculate_growth_rate(current: float, previous: float) -> float:
    """
    Calculate growth rate between two values
    
    Args:
        current: Current value
        previous: Previous value
        
    Returns:
        Growth rate as percentage
    """
    if previous == 0:
        return 0.0
    
    return ((current - previous) / previous) * 100

def round_to_significant(value: float, significant_digits: int = 3) -> float:
    """
    Round value to significant digits
    
    Args:
        value: Value to round
        significant_digits: Number of significant digits
        
    Returns:
        Rounded value
    """
    if value == 0:
        return 0.0
    
    import math
    magnitude = math.floor(math.log10(abs(value)))
    factor = 10 ** (significant_digits - magnitude - 1)
    
    return round(value * factor) / factor

def get_season_from_date(date_str: str) -> str:
    """
    Determine season from date string
    
    Args:
        date_str: Date string in ISO format
        
    Returns:
        Season name
    """
    try:
        date = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        month = date.month
        
        if month in [12, 1, 2]:
            return 'Winter'
        elif month in [3, 4, 5]:
            return 'Spring'
        elif month in [6, 7, 8]:
            return 'Summer'
        else:
            return 'Fall'
    except:
        return 'Unknown'

def validate_crop_name(crop_name: str) -> str:
    """
    Validate and normalize crop name
    
    Args:
        crop_name: Crop name to validate
        
    Returns:
        Normalized crop name
    """
    if not crop_name:
        return 'unknown'
    
    # Common crop name mappings
    crop_mappings = {
        'corn': 'maize',
        'tomatoes': 'tomato',
        'potatoes': 'potato',
        'onions': 'onion',
        'wheat': 'wheat',
        'rice': 'rice',
        'cotton': 'cotton',
        'sugarcane': 'sugarcane',
        'barley': 'barley'
    }
    
    normalized = crop_name.lower().strip()
    return crop_mappings.get(normalized, normalized)

def calculate_efficiency_score(metrics: Dict, weights: Dict = None) -> float:
    """
    Calculate weighted efficiency score from metrics
    
    Args:
        metrics: Dictionary of efficiency metrics
        weights: Optional weights for metrics
        
    Returns:
        Efficiency score (0-1)
    """
    if not weights:
        weights = {
            'yield_per_acre': 0.3,
            'water_efficiency': 0.25,
            'fertilizer_efficiency': 0.25,
            'pesticide_efficiency': 0.2
        }
    
    weighted_sum = 0
    total_weight = 0
    
    for metric, value in metrics.items():
        if metric in weights:
            weighted_sum += value * weights[metric]
            total_weight += weights[metric]
    
    if total_weight > 0:
        return min(1.0, weighted_sum / total_weight)
    else:
        return 0.0

def generate_recommendations(scores: Dict, thresholds: Dict = None) -> list:
    """
    Generate recommendations based on efficiency scores
    
    Args:
        scores: Dictionary of efficiency scores
        thresholds: Optional threshold values
        
    Returns:
        List of recommendations
    """
    if not thresholds:
        thresholds = {
            'water_efficiency': 0.6,
            'fertilizer_efficiency': 0.6,
            'pesticide_efficiency': 0.6,
            'yield_per_acre': 0.7
        }
    
    recommendations = []
    
    for metric, score in scores.items():
        if metric in thresholds:
            if score < thresholds[metric]:
                if metric == 'water_efficiency':
                    recommendations.append("Consider implementing drip irrigation to improve water efficiency")
                elif metric == 'fertilizer_efficiency':
                    recommendations.append("Conduct soil testing to optimize fertilizer application")
                elif metric == 'pesticide_efficiency':
                    recommendations.append("Consider integrated pest management practices")
                elif metric == 'yield_per_acre':
                    recommendations.append("Evaluate crop variety and planting density for better yields")
    
    if not recommendations:
        recommendations.append("All efficiency metrics are within acceptable ranges")
    
    return recommendations

def create_pagination_response(data: list, page: int, per_page: int, total: int) -> Dict:
    """
    Create paginated response
    
    Args:
        data: List of items for current page
        page: Current page number
        per_page: Items per page
        total: Total number of items
        
    Returns:
        Dictionary with pagination info
    """
    total_pages = (total + per_page - 1) // per_page
    
    return {
        'items': data,
        'pagination': {
            'current_page': page,
            'per_page': per_page,
            'total_items': total,
            'total_pages': total_pages,
            'has_next': page < total_pages,
            'has_prev': page > 1
        }
    }

def safe_float_conversion(value: Any, default: float = 0.0) -> float:
    """
    Safely convert value to float
    
    Args:
        value: Value to convert
        default: Default value if conversion fails
        
    Returns:
        Float value
    """
    try:
        return float(value)
    except (ValueError, TypeError):
        return default

def safe_int_conversion(value: Any, default: int = 0) -> int:
    """
    Safely convert value to integer
    
    Args:
        value: Value to convert
        default: Default value if conversion fails
        
    Returns:
        Integer value
    """
    try:
        return int(value)
    except (ValueError, TypeError):
        return default
