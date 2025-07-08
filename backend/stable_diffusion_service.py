"""
Stable Diffusion Service for RED AI
Handles Stable Diffusion XL image generation using local or cloud APIs
"""

import os
import json
import base64
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime
import requests
from io import BytesIO

class StableDiffusionService:
    """Stable Diffusion XL service for image generation"""
    
    def __init__(self):
        """Initialize Stable Diffusion service"""
        # Hugging Face configuration
        self.hf_api_key = os.getenv("HUGGINGFACE_API_KEY", "")
        self.hf_endpoint = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
        
        # Replicate configuration (alternative)
        self.replicate_api_key = os.getenv("REPLICATE_API_TOKEN", "")
        
        # Local configuration
        self.local_endpoint = os.getenv("LOCAL_SD_ENDPOINT", "http://localhost:7860")
        
        # Check available services
        self.services_available = self._check_available_services()
        
        print(f"🎨 Stable Diffusion Service initialized")
        print(f"   Available services: {', '.join(self.services_available) if self.services_available else 'None'}")
    
    def _check_available_services(self) -> List[str]:
        """Check which Stable Diffusion services are available"""
        available = []
        
        if self.hf_api_key:
            available.append("Hugging Face")
        
        if self.replicate_api_key:
            available.append("Replicate")
        
        # Check if local service is running
        try:
            response = requests.get(f"{self.local_endpoint}/api/v1/ping", timeout=2)
            if response.status_code == 200:
                available.append("Local")
        except:
            pass
        
        return available
    
    def is_configured(self) -> bool:
        """Check if any Stable Diffusion service is configured"""
        return len(self.services_available) > 0
    
    async def generate_image(
        self,
        prompt: str,
        negative_prompt: str = "", 
        width: int = 1024, 
        height: int = 1024,
        steps: int = 20,
        guidance_scale: float = 7.5,
        style: str = "realistic"
    ) -> Dict:
        """Generate image using Stable Diffusion XL"""
        
        if not self.is_configured():
            return {
                "success": False,
                "error": "No Stable Diffusion service configured. Please set up Hugging Face API key, Replicate API key, or local service."
            }
        
        # Try Hugging Face first
        if "Hugging Face" in self.services_available:
            try:
                result = await self._generate_with_huggingface(
                    prompt, negative_prompt, width, height, steps, guidance_scale
                )
                if result.get("success"):
                    return result
            except Exception as e:
                print(f"❌ Hugging Face generation failed: {e}")
        
        # Try Replicate as fallback
        if "Replicate" in self.services_available:
            try:
                result = await self._generate_with_replicate(
                    prompt, negative_prompt, width, height, steps, guidance_scale
                )
                if result.get("success"):
                    return result
            except Exception as e:
                print(f"❌ Replicate generation failed: {e}")
        
        # Try local service as final fallback
        if "Local" in self.services_available:
            try:
                result = await self._generate_with_local(
                    prompt, negative_prompt, width, height, steps, guidance_scale
                )
                if result.get("success"):
                    return result
            except Exception as e:
                print(f"❌ Local generation failed: {e}")
        
        return {
            "success": False,
            "error": "All Stable Diffusion services failed"
        }
    
    async def _generate_with_huggingface(
        self, prompt: str, negative_prompt: str, width: int, height: int,
        steps: int, guidance_scale: float
    ) -> Dict:
        """Generate image using Hugging Face Inference API"""
        
        print(f"🤗 Generating with Hugging Face...")
        
        headers = {
            "Authorization": f"Bearer {self.hf_api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "inputs": prompt,
            "parameters": {
                "negative_prompt": negative_prompt,
                "width": width,
                "height": height,
                "num_inference_steps": steps,
                "guidance_scale": guidance_scale,
                "seed": -1
            }
        }
        
        # Run in thread to avoid blocking
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None, 
            lambda: requests.post(self.hf_endpoint, headers=headers, json=payload, timeout=60)
        )
        
        if response.status_code == 200:
            # Convert to base64
            image_base64 = base64.b64encode(response.content).decode('utf-8')
            image_url = f"data:image/png;base64,{image_base64}"
            
            print(f"✅ Hugging Face generation successful!")
            
            return {
                "success": True,
                "image_url": image_url,
                "image_base64": image_base64,
                "model": "Stable Diffusion XL",
                "service": "Hugging Face",
                "prompt": prompt,
                "parameters": payload["parameters"]
            }
        else:
            error_msg = f"Hugging Face API error: {response.status_code}"
            try:
                error_detail = response.json()
                error_msg += f" - {error_detail}"
            except:
                error_msg += f" - {response.text[:200]}"
            
            return {
                "success": False,
                "error": error_msg,
                "service": "Hugging Face"
            }
    
    async def _generate_with_replicate(
        self, prompt: str, negative_prompt: str, width: int, height: int,
        steps: int, guidance_scale: float
    ) -> Dict:
        """Generate image using Replicate API"""
        
        print(f"🔄 Generating with Replicate...")
        
        try:
            import replicate
        except ImportError:
            return {
                "success": False,
                "error": "Replicate library not installed. Run: pip install replicate"
            }
        
        # Set API token
        os.environ["REPLICATE_API_TOKEN"] = self.replicate_api_key
        
        try:
            output = replicate.run(
                "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
                input={
                    "prompt": prompt,
                    "negative_prompt": negative_prompt,
                    "width": width,
                    "height": height,
                    "num_inference_steps": steps,
                    "guidance_scale": guidance_scale,
                    "scheduler": "K_EULER"
                }
            )
            
            # Get the first image URL
            if output and len(output) > 0:
                image_url = output[0]
                
                print(f"✅ Replicate generation successful!")
                
                return {
                    "success": True,
                    "image_url": image_url,
                    "model": "Stable Diffusion XL",
                    "service": "Replicate",
                    "prompt": prompt
                }
            else:
                return {
                    "success": False,
                    "error": "No image generated by Replicate",
                    "service": "Replicate"
                }
        
except Exception as e:
            return {
                "success": False,
                "error": f"Replicate API error: {str(e)}",
                "service": "Replicate"
            }
    
    async def _generate_with_local(
        self, prompt: str, negative_prompt: str, width: int, height: int,
        steps: int, guidance_scale: float
    ) -> Dict:
        """Generate image using local Stable Diffusion service"""
        
        print(f"🖥️ Generating with local service...")
        
        payload = {
            "prompt": prompt,
            "negative_prompt": negative_prompt,
            "width": width,
            "height": height,
            "steps": steps,
            "cfg_scale": guidance_scale,
            "sampler_name": "Euler",
            "batch_size": 1,
            "n_iter": 1
        }
        
        try:
            # Run in thread to avoid blocking
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None, 
                lambda: requests.post(
                    f"{self.local_endpoint}/sdapi/v1/txt2img", 
                    json=payload, 
                    timeout=60
                )
            )
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get("images") and len(result["images"]) > 0:
                    image_base64 = result["images"][0]
                    image_url = f"data:image/png;base64,{image_base64}"
                    
                    print(f"✅ Local generation successful!")
                    
                    return {
                        "success": True,
                        "image_url": image_url,
                        "image_base64": image_base64,
                        "model": "Stable Diffusion XL",
                        "service": "Local",
                        "prompt": prompt,
                        "parameters": payload
                    }
                else:
                    return {
                        "success": False,
                        "error": "No image generated by local service",
                        "service": "Local"
                    }
            else:
                return {
                    "success": False,
                    "error": f"Local API error: {response.status_code} - {response.text[:200]}",
                    "service": "Local"
                }
        
        except Exception as e:
            return {
                "success": False,
                "error": f"Local service error: {str(e)}",
                "service": "Local"
            }
    
    def get_service_info(self) -> Dict:
        """Get service configuration info"""
        return {
            "available_services": self.services_available,
            "configured": self.is_configured(),
            "huggingface_configured": bool(self.hf_api_key),
            "replicate_configured": bool(self.replicate_api_key),
            "local_available": "Local" in self.services_available,
            "local_endpoint": self.local_endpoint
        }

# Factory function
def create_stable_diffusion_service() -> StableDiffusionService:
    """Create Stable Diffusion service instance"""
    return StableDiffusionService()

# Example usage
async def test_stable_diffusion_service():
    """Test the Stable Diffusion service"""
    print("🧪 Testing Stable Diffusion Service...")
    print("=" * 50)
    
    service = create_stable_diffusion_service()
    
    # Show configuration
    info = service.get_service_info()
    print(f"📋 Service Configuration:")
    print(f"   Available services: {info['available_services']}")
    print(f"   Configured: {'✅' if info['configured'] else '❌'}")
    print(f"   Hugging Face: {'✅' if info['huggingface_configured'] else '❌'}")
    print(f"   Replicate: {'✅' if info['replicate_configured'] else '❌'}")
    print(f"   Local: {'✅' if info['local_available'] else '❌'}")
    
    if not service.is_configured():
        print("❌ Service not configured, skipping tests")
        return
    
    # Test image generation
    print(f"\n🎨 Testing Image Generation...")
    try:
        result = await service.generate_image(
            "A modern minimalist living room with natural light",
            negative_prompt="blurry, low quality",
            width=512,
            height=512,
            steps=20
        )
        
        if result["success"]:
            print(f"✅ Image generation successful!")
            print(f"🔗 Service used: {result.get('service')}")
            print(f"🎨 Model: {result.get('model')}")
        else:
            print(f"❌ Image generation failed: {result['error']}")
            
    except Exception as e:
        print(f"❌ Test failed: {e}")
    
    print(f"\n✅ Testing completed!")

if __name__ == "__main__":
    print("🚀 Stable Diffusion Service for RED AI")
    print("=" * 50)
    
    # Run tests
    asyncio.run(test_stable_diffusion_service())
    
    print("\n💡 Service ready for integration!")
    print("🔧 Configure your .env file with API keys:")
    print("   - HUGGINGFACE_API_KEY for Hugging Face")
    print("   - REPLICATE_API_TOKEN for Replicate")
    print("   - LOCAL_SD_ENDPOINT for local service") 