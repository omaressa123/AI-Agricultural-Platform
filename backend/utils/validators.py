from typing import Dict, List, Any

def validate_input_data(data: Dict, required_fields: List[str]) -> bool:
    """
    Validate that all required fields are present in input data
    
    Args:
        data: Input data dictionary
        required_fields: List of required field names
        
    Returns:
        True if all required fields are present, False otherwise
    """
    if not data or not isinstance(data, dict):
        return False
    
    for field in required_fields:
        if field not in data or data[field] is None:
            return False
    
    return True

def validate_numeric_range(value: Any, min_val: float = None, max_val: float = None) -> bool:
    """
    Validate that a numeric value is within specified range
    
    Args:
        value: Value to validate
        min_val: Minimum allowed value
        max_val: Maximum allowed value
        
    Returns:
        True if value is valid, False otherwise
    """
    try:
        num_value = float(value)
        
        if min_val is not None and num_value < min_val:
            return False
        
        if max_val is not None and num_value > max_val:
            return False
        
        return True
    except (ValueError, TypeError):
        return False

def validate_crop_input(data: Dict) -> Dict:
    """
    Validate crop recommendation input data
    
    Args:
        data: Input data for crop recommendation
        
    Returns:
        Dictionary with validation results
    """
    errors = []
    warnings = []
    
    # Required fields
    required_fields = ['temperature', 'humidity', 'ph', 'rainfall']
    for field in required_fields:
        if field not in data:
            errors.append(f"Missing required field: {field}")
        elif not validate_numeric_range(data[field]):
            errors.append(f"Invalid numeric value for: {field}")
    
    # Range validations
    if 'temperature' in data:
        if not validate_numeric_range(data['temperature'], -50, 60):
            warnings.append("Temperature seems unusual for agriculture")
    
    if 'humidity' in data:
        if not validate_numeric_range(data['humidity'], 0, 100):
            errors.append("Humidity must be between 0 and 100")
    
    if 'ph' in data:
        if not validate_numeric_range(data['ph'], 0, 14):
            errors.append("pH must be between 0 and 14")
    
    if 'rainfall' in data:
        if not validate_numeric_range(data['rainfall'], 0, 1000):
            warnings.append("Rainfall value seems unusual")
    
    return {
        'valid': len(errors) == 0,
        'errors': errors,
        'warnings': warnings
    }

def validate_yield_input(data: Dict) -> Dict:
    """
    Validate yield prediction input data
    
    Args:
        data: Input data for yield prediction
        
    Returns:
        Dictionary with validation results
    """
    errors = []
    warnings = []
    
    # Required fields
    required_fields = ['N', 'P', 'K', 'Soil_pH', 'Temperature', 'Humidity', 'Rainfall', 'Crop_Type', 'Irrigation_Type']
    for field in required_fields:
        if field not in data:
            errors.append(f"Missing required field: {field}")
    
    # Numeric validations
    numeric_fields = ['N', 'P', 'K', 'Soil_pH', 'Temperature', 'Humidity', 'Rainfall', 'Fertilizer_Used', 'Pesticide_Used']
    for field in numeric_fields:
        if field in data and not validate_numeric_range(data[field], 0):
            errors.append(f"Invalid numeric value for: {field}")
    
    # Range validations
    if 'Soil_pH' in data:
        if not validate_numeric_range(data['Soil_pH'], 0, 14):
            errors.append("Soil pH must be between 0 and 14")
    
    if 'Temperature' in data:
        if not validate_numeric_range(data['Temperature'], -50, 60):
            warnings.append("Temperature seems unusual")
    
    if 'Humidity' in data:
        if not validate_numeric_range(data['Humidity'], 0, 100):
            errors.append("Humidity must be between 0 and 100")
    
    return {
        'valid': len(errors) == 0,
        'errors': errors,
        'warnings': warnings
    }

def validate_efficiency_input(data: Dict) -> Dict:
    """
    Validate farm efficiency input data
    
    Args:
        data: Input data for efficiency calculation
        
    Returns:
        Dictionary with validation results
    """
    errors = []
    warnings = []
    
    # Required fields
    required_fields = ['farm_area', 'fertilizer_used', 'pesticide_used', 'water_usage', 'yield']
    for field in required_fields:
        if field not in data:
            errors.append(f"Missing required field: {field}")
    
    # Numeric validations
    for field in required_fields:
        if field in data and not validate_numeric_range(data[field], 0):
            errors.append(f"Invalid numeric value for: {field}")
    
    # Range validations
    if 'farm_area' in data:
        if not validate_numeric_range(data['farm_area'], 0.1, 10000):
            warnings.append("Farm area seems unusual")
    
    if 'yield' in data:
        if not validate_numeric_range(data['yield'], 0, 1000):
            warnings.append("Yield value seems unusual")
    
    return {
        'valid': len(errors) == 0,
        'errors': errors,
        'warnings': warnings
    }

def validate_revenue_input(data: Dict) -> Dict:
    """
    Validate revenue prediction input data
    
    Args:
        data: Input data for revenue prediction
        
    Returns:
        Dictionary with validation results
    """
    errors = []
    warnings = []
    
    # Required fields
    required_fields = ['crop_type', 'predicted_yield', 'farm_area']
    for field in required_fields:
        if field not in data:
            errors.append(f"Missing required field: {field}")
    
    # Numeric validations
    numeric_fields = ['predicted_yield', 'farm_area']
    for field in numeric_fields:
        if field in data and not validate_numeric_range(data[field], 0):
            errors.append(f"Invalid numeric value for: {field}")
    
    # String validations
    if 'crop_type' in data:
        if not isinstance(data['crop_type'], str) or len(data['crop_type'].strip()) == 0:
            errors.append("Crop type must be a non-empty string")
    
    return {
        'valid': len(errors) == 0,
        'errors': errors,
        'warnings': warnings
    }

def sanitize_input(data: Dict) -> Dict:
    """
    Sanitize input data by removing potentially harmful values
    
    Args:
        data: Input data dictionary
        
    Returns:
        Sanitized data dictionary
    """
    sanitized = {}
    
    for key, value in data.items():
        if isinstance(value, str):
            # Remove potentially harmful characters
            sanitized[key] = value.strip().replace('<', '').replace('>', '').replace(';', '')
        elif isinstance(value, (int, float)):
            # Ensure numeric values are reasonable
            if abs(value) > 1e10:  # Cap at very large values
                sanitized[key] = 1e10 if value > 0 else -1e10
            else:
                sanitized[key] = value
        else:
            sanitized[key] = value
    
    return sanitized
