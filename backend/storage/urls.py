from django.urls import path
from . import views

urlpatterns = [
    path('test/images', views.getPage),
    path('test/tags', views.getPage),
    path('api/create-image', views.createImage),
    path('api/get-images', views.getImages),
    path('api/get-image/pic_storage/<image_path>', views.getImage),
]

