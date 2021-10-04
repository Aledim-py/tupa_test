from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
import base64
from django.views.decorators.csrf import csrf_exempt
import io
from django.core.files.images import ImageFile

from .models import Image, Comment, Tag, User
# Create your views here.

@csrf_exempt
def createImage(request):
    file = request.FILES['image']
    file_name = request.POST['title']

    image = ImageFile(file, name=file_name)

    if file.multiple_chunks() is True:
        return JsonResponse({'success':'no', 'reason': 'File is too big'})

    # In case you've got file in the form of bytes array
    # remember_image = file.read()
    # image = ImageFile(io.BytesIO(remember_image), name='foo.jpg')
    
    image = Image(title=file_name, image=image)
    image.save()

    return JsonResponse({'success':'yes', 'reason': ''})

@csrf_exempt
def getImages(request):
    images = Image.objects.all()
    image_link = []
    image_title = []
    for im in images:
        image_link.append(im.image.url)
        image_title.append(im.title)
        
    return JsonResponse({'success':'yes','image_link':image_link, 'image_title': image_title, 'reason': ''})

@csrf_exempt
def getImage(request, image_path):
    # try:
    #     with open(remember_image, "rb") as f:
    #         return HttpResponse(f.read(), content_type="image/jpeg")
    # except IOError:
    #     red = Image.new('RGBA', (1, 1), (255,0,0,0))
    #     response = HttpResponse(content_type="image/jpeg")
    #     red.save(response, "JPEG")
    # return response
    # Decode the string
    # binary_data = base64.b64decode(remember_image)
    
    response = HttpResponse('<img src="https://timeweb.com/ru/community/article/67/67d62d1e0bc27de113cc0e25239705e2.png"/>', content_type='text/html')
    image_stored = Image.objects.filter(image="pic_storage/" + image_path)

    if len(image_stored) != 0:
        with open(image_stored[0].image.path, 'r') as f:
            remember_image = f.buffer
            response = HttpResponse(remember_image, content_type='image/png')
        
    return response

