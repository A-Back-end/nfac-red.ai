"""
Red.AI - DALL-E Image Generation Service
Сервис для генерации изображений интерьеров с помощью DALL-E
"""
import openai
from typing import Dict, List, Optional, Union
import asyncio
import logging
from PIL import Image
import requests
from io import BytesIO
import base64
import json
from datetime import datetime

from src.backend.core.config import settings
from src.backend.core.exceptions import AIServiceException
from src.ai_models.base.base_model import BaseAIModel

logger = logging.getLogger(__name__)

class DalleService(BaseAIModel):
    """Сервис для генерации изображений с помощью DALL-E"""
    
    def __init__(self):
        super().__init__("dalle")
        self.client = openai.AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY
        )
        self.model = "dall-e-3"
        self.size = "1024x1024"
        self.quality = "hd"
        
    async def generate_room_design(
        self,
        room_type: str,
        style: str,
        colors: List[str],
        furniture: List[str],
        additional_prompt: str = "",
        **kwargs
    ) -> Dict:
        """
        Генерация дизайна комнаты
        
        Args:
            room_type: Тип комнаты (bedroom, living_room, kitchen, etc.)
            style: Стиль интерьера (modern, classic, minimalist, etc.)
            colors: Список цветов для использования
            furniture: Список мебели для включения
            additional_prompt: Дополнительные указания
            
        Returns:
            Dict с результатами генерации
        """
        try:
            # Формирование промпта
            prompt = self._build_interior_prompt(
                room_type, style, colors, furniture, additional_prompt
            )
            
            logger.info(f"🎨 Generating room design: {room_type} in {style} style")
            
            # Генерация изображения
            response = await self.client.images.generate(
                model=self.model,
                prompt=prompt,
                size=self.size,
                quality=self.quality,
                n=1,
                response_format="url"
            )
            
            # Обработка результата
            image_url = response.data[0].url
            revised_prompt = response.data[0].revised_prompt
            
            # Сохранение результата
            result = {
                "image_url": image_url,
                "prompt": prompt,
                "revised_prompt": revised_prompt,
                "model": self.model,
                "size": self.size,
                "quality": self.quality,
                "room_type": room_type,
                "style": style,
                "colors": colors,
                "furniture": furniture,
                "generated_at": datetime.utcnow().isoformat(),
                "service": "dalle"
            }
            
            logger.info(f"✅ Room design generated successfully")
            return result
            
        except Exception as e:
            logger.error(f"❌ DALL-E generation failed: {str(e)}")
            raise AIServiceException(f"DALL-E generation failed: {str(e)}", "dalle")
    
    async def generate_multiple_variations(
        self,
        base_prompt: str,
        variations: int = 3,
        **kwargs
    ) -> List[Dict]:
        """
        Генерация нескольких вариантов дизайна
        
        Args:
            base_prompt: Базовый промпт
            variations: Количество вариантов
            
        Returns:
            Список результатов генерации
        """
        try:
            tasks = []
            for i in range(variations):
                # Добавляем вариативность в промпт
                varied_prompt = f"{base_prompt}. Variation {i+1}: focus on different lighting and textures"
                
                task = self.client.images.generate(
                    model=self.model,
                    prompt=varied_prompt,
                    size=self.size,
                    quality=self.quality,
                    n=1,
                    response_format="url"
                )
                tasks.append(task)
            
            # Параллельное выполнение
            responses = await asyncio.gather(*tasks)
            
            results = []
            for i, response in enumerate(responses):
                result = {
                    "image_url": response.data[0].url,
                    "prompt": f"{base_prompt}. Variation {i+1}",
                    "revised_prompt": response.data[0].revised_prompt,
                    "variation_number": i + 1,
                    "model": self.model,
                    "generated_at": datetime.utcnow().isoformat(),
                    "service": "dalle"
                }
                results.append(result)
            
            logger.info(f"✅ Generated {len(results)} variations")
            return results
            
        except Exception as e:
            logger.error(f"❌ Multiple variations generation failed: {str(e)}")
            raise AIServiceException(f"Multiple variations generation failed: {str(e)}", "dalle")
    
    def _build_interior_prompt(
        self,
        room_type: str,
        style: str,
        colors: List[str],
        furniture: List[str],
        additional_prompt: str = ""
    ) -> str:
        """Построение промпта для генерации интерьера"""
        
        # Базовый промпт
        prompt_parts = [
            f"A beautiful {style} style {room_type.replace('_', ' ')} interior design,"
        ]
        
        # Цвета
        if colors:
            color_str = ", ".join(colors)
            prompt_parts.append(f"color scheme: {color_str},")
        
        # Мебель
        if furniture:
            furniture_str = ", ".join(furniture)
            prompt_parts.append(f"featuring {furniture_str},")
        
        # Дополнительные детали
        prompt_parts.extend([
            "professional interior photography,",
            "high-quality realistic rendering,",
            "natural lighting,",
            "clean and spacious,",
            "modern and elegant,",
            "8k resolution,",
            "architectural photography style"
        ])
        
        # Дополнительный промпт
        if additional_prompt:
            prompt_parts.append(additional_prompt)
        
        return " ".join(prompt_parts)
    
    async def download_and_save_image(self, image_url: str, filename: str) -> str:
        """
        Скачивание и сохранение изображения
        
        Args:
            image_url: URL изображения
            filename: Имя файла для сохранения
            
        Returns:
            Путь к сохраненному файлу
        """
        try:
            response = requests.get(image_url)
            response.raise_for_status()
            
            # Сохранение файла
            filepath = f"{settings.UPLOAD_DIR}/{filename}"
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            logger.info(f"✅ Image saved to {filepath}")
            return filepath
            
        except Exception as e:
            logger.error(f"❌ Failed to download image: {str(e)}")
            raise AIServiceException(f"Failed to download image: {str(e)}", "dalle")
    
    async def get_model_info(self) -> Dict:
        """Получение информации о модели"""
        return {
            "name": "DALL-E 3",
            "version": "3.0",
            "provider": "OpenAI",
            "capabilities": [
                "interior_design_generation",
                "high_quality_images",
                "style_variations",
                "furniture_placement",
                "color_schemes"
            ],
            "limitations": [
                "no_human_faces",
                "no_text_generation",
                "limited_iterations"
            ],
            "supported_sizes": ["1024x1024", "1792x1024", "1024x1792"],
            "max_resolution": "1792x1024"
        } 