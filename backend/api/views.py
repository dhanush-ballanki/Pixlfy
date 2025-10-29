from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from PIL import Image
import io
from django.http import StreamingHttpResponse

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def convert_image(request):
    image_file = request.FILES.get('image')
    pixel_size = int(request.POST.get('pixel_size', 8))
    palette = request.POST.get('palette', 'original')
    dither = request.POST.get('dither', 'true') == 'true'
    colors = int(request.POST.get('colors', 8))

    if not image_file:
        return Response({'detail': 'No image provided.'}, status=status.HTTP_400_BAD_REQUEST)

    # Open uploaded image
    image = Image.open(image_file).convert("RGB")

    # 1️⃣ Resize down (pixelate)
    small = image.resize(
        (max(1, image.width // pixel_size), max(1, image.height // pixel_size)),
        Image.NEAREST
    )

    # 2️⃣ Apply palette
    if palette == "grayscale":
        small = small.convert("L").convert("RGB")
    elif palette == "gameboy":
        gameboy_palette = [(15,56,15),(48,98,48),(139,172,15),(155,188,15)]
        small = apply_palette(small, gameboy_palette)
    elif palette == "nes":
        nes_palette = [(124,124,124),(0,0,252),(0,0,188),(68,40,188),(148,0,132),
                       (168,0,32),(168,16,0),(136,20,0),(80,48,0),(0,120,0)]
        small = apply_palette(small, nes_palette)

    # 3️⃣ Quantize (limit colors)
    small = small.quantize(colors=colors, dither=Image.FLOYDSTEINBERG if dither else Image.NONE)

    # 4️⃣ Scale back up
    result = small.resize((image.width, image.height), Image.NEAREST)

    # 5️⃣ Save to bytes
    output = io.BytesIO()
    result.save(output, format='PNG')
    output.seek(0)

    return StreamingHttpResponse(output, content_type='image/png')


def apply_palette(img, palette):
    """Helper: recolor to nearest color from a small palette"""
    pixels = img.load()
    for y in range(img.height):
        for x in range(img.width):
            r,g,b = pixels[x,y]
            nearest = min(palette, key=lambda c: (r-c[0])**2 + (g-c[1])**2 + (b-c[2])**2)
            pixels[x,y] = nearest
    return img
