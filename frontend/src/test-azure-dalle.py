#!/usr/bin/env python3

"""
Test script for new Azure OpenAI integration with DALL-E 3
Based on the provided example from the user
"""

import os
import asyncio
import sys
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up the backend path
sys.path.append('backend')

try:
    from backend.azure_openai_service import create_azure_openai_service
    print("✅ Successfully imported Azure OpenAI service")
except ImportError as e:
    print(f"❌ Failed to import Azure OpenAI service: {e}")
    print("Make sure you're running from the project root directory")
    exit(1)

async def test_azure_dalle_integration():
    """Test the complete Azure OpenAI integration"""
    
    print("🧪 Testing Azure OpenAI DALL-E 3 Integration")
    print("=" * 50)
    print()
    
    # Test both authentication methods
    auth_methods = [
        ("Azure AD", True),
        ("API Key", False)
    ]
    
    for auth_name, use_azure_ad in auth_methods:
        print(f"🔐 Testing with {auth_name} authentication...")
        
        try:
            # Create service instance
            service = create_azure_openai_service(use_azure_ad=use_azure_ad)
            
            # Show configuration
            info = service.get_service_info()
            print("📋 Configuration:")
            for key, value in info.items():
                print(f"   {key}: {value}")
            print()
            
            # Test image generation (DALL-E 3)
            print("🎨 Testing DALL-E 3 Image Generation...")
            image_prompt = "Modern minimalist living room with blue and gray color scheme, professional interior design photography, vivid style"
            
            image_result = await service.generate_image(
                prompt=image_prompt,
                style="vivid",
                quality="standard"
            )
            
            if image_result["success"]:
                print(f"✅ Image generated successfully!")
                print(f"   URL: {image_result['image_url'][:80]}...")
                print(f"   Model: {image_result['model']}")
                print(f"   Quality: {image_result['quality']}")
                if image_result.get('revised_prompt'):
                    print(f"   Revised prompt: {image_result['revised_prompt'][:100]}...")
            else:
                print(f"❌ Image generation failed: {image_result['error']}")
            
            print()
            
            # Test chat completion (GPT-4)
            print("💬 Testing GPT-4 Chat Completion...")
            chat_result = await service.chat_completion([
                {"role": "system", "content": "You are RED AI, an expert interior designer."},
                {"role": "user", "content": "What are the key principles of modern minimalist interior design?"}
            ])
            
            if chat_result["success"]:
                print(f"✅ Chat completion successful!")
                print(f"   Response: {chat_result['content'][:200]}...")
                print(f"   Tokens used: {chat_result['tokens_used']}")
            else:
                print(f"❌ Chat completion failed: {chat_result['error']}")
            
            print()
            
            # Test vision analysis (GPT-4 Vision)
            print("👁️ Testing GPT-4 Vision Analysis...")
            # Using a base64 encoded test image (1x1 pixel)
            test_image_b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
            
            vision_result = await service.analyze_image(
                test_image_b64,
                "Analyze this image and describe what you see for interior design purposes."
            )
            
            if vision_result["success"]:
                print(f"✅ Vision analysis successful!")
                print(f"   Analysis: {vision_result['analysis'][:200]}...")
                print(f"   Tokens used: {vision_result['tokens_used']}")
            else:
                print(f"❌ Vision analysis failed: {vision_result['error']}")
            
            print()
            print(f"✅ {auth_name} authentication test completed!")
            
        except Exception as e:
            print(f"❌ {auth_name} test failed: {e}")
        
        print("-" * 50)
        print()

def show_environment_info():
    """Show current environment configuration"""
    print("🔧 Environment Configuration:")
    print("-" * 30)
    
    env_vars = [
        "AZURE_OPENAI_API_KEY",
        "AZURE_OPENAI_ENDPOINT", 
        "OPENAI_API_VERSION",
        "AZURE_OPENAI_DEPLOYMENT_NAME",
        "DEPLOYMENT_NAME",
        "USE_AZURE_AD"
    ]
    
    for var in env_vars:
        value = os.getenv(var, "Not set")
        if "API_KEY" in var and value != "Not set":
            # Mask API key for security
            value = value[:8] + "..." + value[-8:] if len(value) > 16 else "Set (masked)"
        print(f"   {var}: {value}")
    
    print()

def main():
    """Main test function"""
    print("🚀 Azure OpenAI Integration Test")
    print("=" * 50)
    print()
    
    # Show environment info
    show_environment_info()
    
    # Check if Azure Identity is available
    try:
        from azure.identity import DefaultAzureCredential
        print("✅ Azure Identity package is available")
    except ImportError:
        print("⚠️ Azure Identity package not found")
        print("   Install with: pip install azure-identity")
    
    print()
    
    # Run the async test
    try:
        asyncio.run(test_azure_dalle_integration())
    except KeyboardInterrupt:
        print("\n⚠️ Test interrupted by user")
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
    
    print()
    print("🎉 Test completed!")
    print()
    print("📝 Next steps:")
    print("1. Update AZURE_OPENAI_ENDPOINT to your real Azure endpoint")
    print("2. Verify deployment names in your Azure OpenAI resource")
    print("3. Test the full application: npm run dev")
    print("4. Check Azure Portal for usage metrics")

if __name__ == "__main__":
    main() 