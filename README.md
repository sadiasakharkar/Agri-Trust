
# Agri-Trust: Geospatial Digital-Twin MRV System

Agri-Trust is a planetary-scale solution for smallholder carbon inclusion, leveraging a high-fidelity Digital-Twin architecture to verify carbon sequestration at a fraction of traditional costs.

## 🚀 Key Innovations
- **Geospatial Digital-Twin:** Fuses Sentinel-1 (SAR Radar) and Sentinel-2 (Optical) data with hyper-local field inputs.
- **Micro-Scale Inclusion:** Optimized for smallholdings (as small as 1 acre), reducing verification costs from ₹7,000 to <₹50/ha.
- **Smartphone-as-Spectrometer:** Estimates Soil Organic Carbon (SOC) using CIELAB color-space analysis (R² ≈ 0.75).
- **SAR-Based All-Weather Auditing:** Continuous tillage detection under cloud cover using radar backscatter.
- **Fair-Trade Finance:** Automated revenue splits via ERC-1155 Smart Contracts on Polygon, ensuring 75% goes directly to the farmer.

## 🛠 Architecture
1. **Acquisition Layer:** Edge-AI mobile interface (Offline-first, PouchDB).
2. **Intelligence Layer:** Hybrid SAR/Optical fusion with Quantile Regression Forests (QRF) calibrated via Open Soil Spectral Library (OSSL).
3. **Trust Layer:** Chainlink Oracles + Polygon Network for transparent minting of Pre-MRV credits.

## 💻 Tech Stack
- **Frontend:** React 19, Tailwind CSS, Framer Motion, Recharts.
- **Geospatial:** Leaflet with Esri World Imagery & Sentinel Hybrid tiles.
- **AI Core:** Google Gemini 2.5/3.0 for anomaly detection & field audit logic.
- **Blockchain:** Polygon (Simulation).

## 📦 Getting Started
1. Clone the repository.
2. Add your `process.env.API_KEY` for Gemini AI features.
3. Open in an ESM-ready browser environment.

---
*Empowering smallholder farmers to lead the global fight against climate change.*
