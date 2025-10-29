from django.urls import path
from .views import convert_image

urlpatterns = [
    path('convert/', convert_image, name='convert_image'),
]
