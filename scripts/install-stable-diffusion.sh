#!/bin/bash

echo "🚀 Installing Stable Diffusion XL for Red.AI Platform"
echo "===================================================="

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running in correct directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Please run this script from the project root directory${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Installing Backend Dependencies...${NC}"
cd backend

# Install Python dependencies
if [ -f "requirements.txt" ]; then
    echo -e "${YELLOW}Installing Python packages...${NC}"
    pip install -r requirements.txt
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Python dependencies installed successfully${NC}"
    else
        echo -e "${RED}❌ Failed to install Python dependencies${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ requirements.txt not found${NC}"
    exit 1
fi

cd ..

echo -e "${BLUE}📦 Installing Frontend Dependencies...${NC}"

# Install Node.js dependencies
if [ -f "package.json" ]; then
    echo -e "${YELLOW}Installing Node.js packages...${NC}"
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Node.js dependencies installed successfully${NC}"
    else
        echo -e "${RED}❌ Failed to install Node.js dependencies${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ package.json not found${NC}"
    exit 1
fi

echo -e "${BLUE}🔧 Setting up Environment...${NC}"

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file from example...${NC}"
    cp env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env and set your HF_API_KEY${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

# Check if HF_API_KEY is set
if grep -q "HF_API_KEY=hf_" .env; then
    echo -e "${GREEN}✅ Hugging Face API key found in .env${NC}"
else
    echo -e "${YELLOW}⚠️  Hugging Face API key not found or not set properly${NC}"
    echo -e "${YELLOW}   Please set HF_API_KEY in your .env file${NC}"
    echo -e "${YELLOW}   Get your key from: https://huggingface.co/settings/tokens${NC}"
fi

echo -e "${BLUE}🧪 Running Tests...${NC}"

# Test Python imports
echo -e "${YELLOW}Testing Python dependencies...${NC}"
python3 -c "
import torch
import diffusers
import transformers
print('✅ Core AI packages imported successfully')
print(f'PyTorch version: {torch.__version__}')
print(f'Diffusers version: {diffusers.__version__}')
print(f'CUDA available: {torch.cuda.is_available()}')
if torch.cuda.is_available():
    print(f'CUDA device: {torch.cuda.get_device_name(0)}')
    print(f'CUDA memory: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.1f} GB')
"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Python environment test passed${NC}"
else
    echo -e "${RED}❌ Python environment test failed${NC}"
    exit 1
fi

# Test API endpoint
echo -e "${YELLOW}Testing API endpoint...${NC}"
if command -v curl &> /dev/null; then
    # Start the backend service in background for testing
    cd backend
    python3 stable_diffusion_service.py &
    BACKEND_PID=$!
    cd ..
    
    # Wait for service to start
    sleep 5
    
    # Test health endpoint
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health)
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ API endpoint responding${NC}"
    else
        echo -e "${YELLOW}⚠️  API endpoint not responding (this is normal if service hasn't started yet)${NC}"
    fi
    
    # Kill the background process
    kill $BACKEND_PID 2>/dev/null
else
    echo -e "${YELLOW}⚠️  curl not found, skipping API test${NC}"
fi

echo -e "${BLUE}📁 Creating necessary directories...${NC}"

# Create directories if they don't exist
mkdir -p public/generated-images
mkdir -p uploads
mkdir -p logs

echo -e "${GREEN}✅ Directories created${NC}"

echo -e "${BLUE}🔍 System Summary${NC}"
echo "===================="
echo -e "🖥️  OS: $(uname -s)"
echo -e "🐍 Python: $(python3 --version)"
echo -e "📦 Node.js: $(node --version)"
echo -e "📦 NPM: $(npm --version)"

# Check GPU
if command -v nvidia-smi &> /dev/null; then
    echo -e "🎮 GPU: $(nvidia-smi --query-gpu=name --format=csv,noheader,nounits | head -n 1)"
    echo -e "🎮 CUDA: $(nvidia-smi --query-gpu=driver_version --format=csv,noheader,nounits | head -n 1)"
else
    echo -e "🎮 GPU: Not available (CPU mode)"
fi

echo ""
echo -e "${GREEN}🎉 Installation Complete!${NC}"
echo "========================"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Set your Hugging Face API key in .env file:"
echo "   HF_API_KEY=your_hugging_face_api_key_here"
echo ""
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "3. Start the backend service:"
echo "   cd backend && python3 stable_diffusion_service.py"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "- Migration guide: docs/STABLE_DIFFUSION_XL_MIGRATION.md"
echo "- API endpoint: /api/stable-diffusion-generator"
echo "- Backend service: backend/stable_diffusion_service.py"
echo ""
echo -e "${GREEN}✨ Ready to generate amazing interior designs with Stable Diffusion XL!${NC}" 