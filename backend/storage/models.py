from django.db import models

# Create your models here.

class Image(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='pic_storage')

    def __str__(self):
        return self.title

class Tag(models.Model):
    tag_name = models.CharField(max_length=200, unique=True)
    images = models.ManyToManyField(Image)

    def __str__(self):
        return self.tag_name

class User(models.Model):
    nickname = models.CharField(max_length=200)
    info = models.CharField(max_length=1000)

    def __str__(self):
        return self.nickname

class Comment(models.Model):
    text = models.CharField(max_length=200)
    image = models.ForeignKey(Image, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return "Comment id: " + str(self.pk)



