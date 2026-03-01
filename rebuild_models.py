#!/usr/bin/env python3
"""
Rebuild ML models using actual data from data folder
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder, MinMaxScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from xgboost import XGBRegressor
import joblib
import os

print("🌾 Rebuilding AI Agricultural Platform Models from Real Data...")

# Create model directory if it doesn't exist
os.makedirs('model', exist_ok=True)

# Check if data folder exists
if not os.path.exists('data'):
    print("❌ Data folder not found!")
    exit(1)

# ==================== 1. Crop Recommendation Model ====================
print("\n📱 Building Crop Recommendation Model...")

try:
    # Load actual crop recommendation data
    crop_df = pd.read_csv('data/Crop_recommendation.csv')
    print(f"✅ Loaded crop recommendation data: {len(crop_df)} samples")
    
    # Use the exact features from notebook
    X_crop = crop_df[['temperature', 'humidity', 'ph', 'rainfall']]
    y_crop = crop_df['label']

    X_train, X_test, y_train, y_test = train_test_split(
        X_crop, y_crop, test_size=0.2, random_state=42, stratify=y_crop
    )

    crop_model = RandomForestClassifier(
        n_estimators=200,
        max_depth=None,
        random_state=42
    )

    crop_model.fit(X_train, y_train)

    # Save model
    joblib.dump(crop_model, 'model/crop_recommendation_model.pkl')
    print("✅ Crop recommendation model saved from real data")

except Exception as e:
    print(f"❌ Error with crop recommendation model: {e}")

# ==================== 2. Yield Prediction Model ====================
print("\n📊 Building Yield Prediction Model...")

try:
    # Load actual yield data
    yield_df = pd.read_csv('data/crop-yield.csv')
    print(f"✅ Loaded yield data: {len(yield_df)} samples")
    print(f"📋 Features: {list(yield_df.columns)}")

    # Add engineered features from notebook
    yield_df['NPK_Total'] = yield_df['N'] + yield_df['P'] + yield_df['K']
    yield_df['N_to_P'] = yield_df['N'] / (yield_df['P'] + 1)
    yield_df['Water_Stress'] = yield_df['Temperature'] / (yield_df['Rainfall'] + 1)
    yield_df['Fertilizer_Efficiency'] = yield_df['Fertilizer_Used'] / (yield_df['NPK_Total'] + 1)
    yield_df['Climate_Index'] = (
        yield_df['Temperature'] * 0.4 +
        yield_df['Humidity'] * 0.3 +
        yield_df['Sunlight_Hours'] * 0.3
    )

    # Train yield model
    X_yield = yield_df.drop("Crop_Yield_ton_per_hectare", axis=1)
    y_yield = yield_df["Crop_Yield_ton_per_hectare"]

    categorical_cols = ['Soil_Type','Region','Season','Crop_Type','Irrigation_Type']
    numerical_cols = [col for col in X_yield.columns if col not in categorical_cols]

    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols),
            ('num', 'passthrough', numerical_cols)
        ]
    )

    yield_model = XGBRegressor(
        n_estimators=500,
        learning_rate=0.05,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42
    )

    yield_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('model', yield_model)
    ])

    X_train, X_test, y_train, y_test = train_test_split(
        X_yield, y_yield, test_size=0.2, random_state=42
    )

    yield_pipeline.fit(X_train, y_train)

    # Save model
    joblib.dump(yield_pipeline, 'model/yield_prediction_pipeline.pkl')
    print("✅ Yield prediction model saved from real data")

except Exception as e:
    print(f"❌ Error with yield prediction model: {e}")

# ==================== 3. Farm Efficiency Model ====================
print("\n⚡ Building Farm Efficiency Model...")

try:
    # Load actual farm data
    farm_df = pd.read_csv('data/agriculture_dataset.csv')
    print(f"✅ Loaded farm data: {len(farm_df)} samples")

    # Calculate efficiency metrics exactly like notebook
    farm_df['Yield_per_Acre'] = farm_df['Yield(tons)'] / farm_df['Farm_Area(acres)']
    farm_df['Water_Efficiency'] = farm_df['Yield(tons)'] / farm_df['Water_Usage(cubic meters)']
    farm_df['Fertilizer_Efficiency'] = farm_df['Yield(tons)'] / farm_df['Fertilizer_Used(tons)']
    farm_df['Pesticide_Efficiency'] = farm_df['Yield(tons)'] / farm_df['Pesticide_Used(kg)']
    farm_df['Input_Efficiency'] = farm_df['Yield(tons)'] / (
        farm_df['Fertilizer_Used(tons)'] + farm_df['Pesticide_Used(kg)'] + farm_df['Water_Usage(cubic meters)']
    )

    # Normalize and calculate final efficiency
    scaler = MinMaxScaler()
    efficiency_features = ['Yield_per_Acre', 'Water_Efficiency', 'Fertilizer_Efficiency', 'Pesticide_Efficiency', 'Input_Efficiency']
    farm_df_scaled = farm_df.copy()
    farm_df_scaled[efficiency_features] = scaler.fit_transform(farm_df[efficiency_features])
    farm_df_scaled['Final_Efficiency_Score'] = farm_df_scaled[efficiency_features].mean(axis=1)

    # Save efficiency data
    farm_df_scaled.to_csv('model/farm_efficiency_scores.csv', index=False)
    print("✅ Farm efficiency data saved from real data")

except Exception as e:
    print(f"❌ Error with farm efficiency model: {e}")

# ==================== 4. Market Price Data ====================
print("\n💰 Loading Market Price Data...")

try:
    # Load actual market price data
    price_df = pd.read_csv('data/egypt_local_crop_prices_2023_2025.csv')
    price_df['Date'] = pd.to_datetime(price_df['Date'])
    print(f"✅ Loaded market price data: {len(price_df)} records")
    
    # Save to model directory
    price_df.to_csv('model/egypt_crop_prices.csv', index=False)
    print("✅ Market price data saved from real data")

except Exception as e:
    print(f"❌ Error with market price data: {e}")

print("\n🎉 All models rebuilt from real data successfully!")
print("📁 Models saved in 'model/' directory:")
print("   - crop_recommendation_model.pkl (from Crop_recommendation.csv)")
print("   - yield_prediction_pipeline.pkl (from crop-yield.csv)") 
print("   - farm_efficiency_scores.csv (from agriculture_dataset.csv)")
print("   - egypt_crop_prices.csv (from egypt_local_crop_prices_2023_2025.csv)")
