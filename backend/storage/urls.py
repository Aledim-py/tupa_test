from django.urls import path
from . import views

urlpatterns = [
    path('api/create-image', views.createImage),
    path('api/get-images', views.getImages),
    path('api/get-image/<image_path>', views.getImage),
]

