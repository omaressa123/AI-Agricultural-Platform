# AI Agricultural Platform Backend

A comprehensive backend system for agricultural decision support, providing crop recommendations, yield predictions, farm efficiency analysis, and market price forecasting.

## 🌟 Features

### Core Services

1. **Crop Recommendation Service**
   - ML-based crop recommendation using environmental conditions
   - Temperature, humidity, pH, and rainfall analysis
   - Confidence scoring and alternative suggestions

2. **Yield Prediction Service**
   - Advanced ML models for yield forecasting
   - Feature importance analysis using SHAP
   - Prediction intervals and efficiency metrics

3. **Farm Efficiency Service**
   - Comprehensive efficiency scoring system
   - Resource utilization analysis
   - Actionable optimization recommendations

4. **Market Price Service**
   - Real-time market price data integration
   - Revenue prediction and risk analysis
   - Price trend analysis and forecasting

### API Endpoints

- `GET /` - Health check and API information
- `POST /api/recommend-crop` - Crop recommendation
- `POST /api/predict-yield` - Yield prediction
- `POST /api/calculate-efficiency` - Farm efficiency calculation
- `GET /api/market-price` - Market price data
- `POST /api/predict-revenue` - Revenue prediction
- `POST /api/farmer-workflow` - Complete farmer workflow

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- pip package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd battern/backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Ensure model files are in place:
   - `../model/crop_recommendation_model.pkl`
   - `../model/yield_prediction_pipeline.pkl`

### Running the Application

#### Development Mode
```bash
python app.py
```

#### Production Mode
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

The API will be available at `http://localhost:5000`

## 📊 API Usage Examples

### Crop Recommendation
```bash
curl -X POST http://localhost:5000/api/recommend-crop \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 25.5,
    "humidity": 65,
    "ph": 6.8,
    "rainfall": 120
  }'
```

### Yield Prediction
```bash
curl -X POST http://localhost:5000/api/predict-yield \
  -H "Content-Type: application/json" \
  -d '{
    "N": 50,
    "P": 40,
    "K": 45,
    "Soil_pH": 6.8,
    "Temperature": 25.5,
    "Humidity": 65,
    "Rainfall": 120,
    "Crop_Type": "wheat",
    "Irrigation_Type": "Canal",
    "Fertilizer_Used": 100,
    "Pesticide_Used": 2.5
  }'
```

### Complete Farmer Workflow
```bash
curl -X POST http://localhost:5000/api/farmer-workflow \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 25.5,
    "humidity": 65,
    "ph": 6.8,
    "rainfall": 120,
    "farm_area": 50,
    "fertilizer_used": 5,
    "pesticide_used": 2,
    "water_usage": 50000
  }'
```

## 🏗️ Architecture

```
backend/
├── app.py                 # Main Flask application
├── services/              # Core service modules
│   ├── crop_recommendation.py
│   ├── yield_prediction.py
│   ├── farm_efficiency.py
│   └── market_price.py
├── utils/                 # Utility functions
│   ├── validators.py
│   └── helpers.py
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

### Service Architecture

1. **CropRecommendationService**
   - Uses RandomForestClassifier for crop recommendations
   - Provides confidence scores and alternative suggestions
   - Fallback rule-based system when model unavailable

2. **YieldPredictionService**
   - XGBoost-based regression model
   - SHAP explanations for feature importance
   - Prediction intervals and efficiency metrics

3. **FarmEfficiencyService**
   - Multi-dimensional efficiency scoring
   - Benchmarking against historical data
   - Resource optimization recommendations

4. **MarketPriceService**
   - Historical price data analysis
   - Trend prediction using linear regression
   - Revenue forecasting with risk analysis

## 🧪 Testing

Run the test suite:
```bash
pytest tests/
```

## 📝 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
FLASK_ENV=development
FLASK_DEBUG=True
MODEL_PATH=../model
DATA_PATH=../data
```

### Model Configuration

The system expects trained models in the following locations:
- `../model/crop_recommendation_model.pkl` - Crop recommendation model
- `../model/yield_prediction_pipeline.pkl` - Yield prediction pipeline

### Data Configuration

Historical data should be placed in:
- `../data/egypt_local_crop_prices_2023_2025.csv` - Market price data
- `../data/farm_efficiency_scores.csv` - Efficiency benchmarks

## 🔧 Development

### Code Style

This project uses:
- **Black** for code formatting
- **Flake8** for linting

Run formatting:
```bash
black .
```

Run linting:
```bash
flake8 .
```

### Adding New Services

1. Create service class in `services/` directory
2. Implement required methods
3. Add validation in `utils/validators.py`
4. Add API endpoints in `app.py`
5. Update documentation

## 📈 Performance Considerations

- Models are loaded once at startup
- Input validation prevents malicious requests
- Caching implemented for price data
- Efficient data structures for large datasets

## 🛡️ Security

- Input sanitization and validation
- CORS configuration for cross-origin requests
- Error handling prevents information leakage
- Rate limiting recommended for production

## 📚 API Documentation

### Response Format

All API responses follow this format:

```json
{
  "status": "success|error|warning",
  "message": "Human-readable message",
  "timestamp": "2023-XX-XXTXX:XX:XX",
  "data": {
    // Response-specific data
  }
}
```

### Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the example usage patterns

## 🔄 Version History

- **v1.0.0** - Initial release with core services
  - Crop recommendation
  - Yield prediction
  - Farm efficiency analysis
  - Market price integration
  - Complete farmer workflow

---

**AI Agricultural Platform Backend** - Empowering farmers with data-driven decisions 🌾
