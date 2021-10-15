import graphene
from graphene_django import DjangoObjectType
from django.utils.encoding import smart_bytes
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from .models import Image, Comment, Tag, User
# from django.db.models import ImageField, FieldFile
from .utilities import deleteFile

class TagType(DjangoObjectType):
    class Meta:
        model = Tag
        fields = ("id", "tag_name", "images")

# DjangoObjectType constructs ObjectType based on the fields
# present in Image model
class ImageType(DjangoObjectType):
    class Meta:
        model = Image
        fields = ("id", "title", "image", "upload_date_time", "uploader_ip")


class Query(graphene.ObjectType):
    image = graphene.Field(
        # requered=False is set implicitly for title and id fields
        ImageType, title=graphene.String(), id=graphene.Int(), image=graphene.String())
    all_images = graphene.List(ImageType)
    all_tags = graphene.List(TagType)
    image_tags = graphene.List(TagType, idImage=graphene.ID())
    vacant_tags = graphene.List(TagType, idImage=graphene.ID())

    def resolve_image_tags(root, info, idImage):
        try:
            image = Image.objects.get(pk=idImage)
            return image.tag_set.all()
        except (ObjectDoesNotExist, MultipleObjectsReturned):
            print("Such image doesn't exist")

    def resolve_all_tags(root, info):
        return Tag.objects.all()

    def resolve_vacant_tags(root, info, idImage):
        return Tag.objects.exclude(images__id=idImage)

    def resolve_image(root, info, **kwargs):
        try:
            return Image.objects.get(**kwargs)
        except (ObjectDoesNotExist, MultipleObjectsReturned):
            print("Such image doesn't exist")


    def resolve_all_images(root, info):
        return Image.objects.all()


class CreateTag(graphene.Mutation):
    class Arguments:
        name = graphene.String()

    tag = graphene.Field(TagType)

    @classmethod
    def mutate(cls, root, info, name):
        tag = Tag.objects.filter(tag_name=name)
        if tag:
            raise Exception("Duplicate entry %s for key 'tag_name'" % name)
        else:
            tag = Tag(tag_name=name)
            tag.save()
            return CreateTag(tag=tag)


class ConnectTag(graphene.Mutation):
    class Arguments:
        idTag = graphene.List(graphene.ID)
        idImage = graphene.ID()

    success = graphene.String()

    @classmethod
    def mutate(cls, root, info, idTag: list[int], idImage):
        try:
            image = Image.objects.get(pk=idImage)
            for _id in idTag:
                tag: Tag = Tag.objects.get(pk=_id)
                tag.images.add(image)
                tag.save()
            return ConnectTag(success="yes")
        except ObjectDoesNotExist:
            raise Exception("Inquired object does not exist")


class RemoveTagConection(graphene.Mutation):
    class Arguments:
        id_tag = graphene.ID()
        id_image = graphene.ID()

    success = graphene.String()

    @classmethod
    def mutate(cls, root, info, id_tag, id_image):
        try:
            image = Image.objects.get(pk=id_image)
            tag: Tag = Tag.objects.get(pk=id_tag)
            tag.images.remove(image)
            tag.save()
            return RemoveTagConection(success="yes")
        except ObjectDoesNotExist:
            return RemoveTagConection(success="no")


class DeleteTag(graphene.Mutation):
    class Arguments:
        id = graphene.ID()

    tag = graphene.Field(TagType)
    @classmethod
    def mutate(cls, root, info, id):
        try:
            tag = Tag.objects.get(pk=id)
            tag.delete()
            return DeleteTag(tag=tag)
        except ObjectDoesNotExist:
            raise Exception("Does not exist")

class RenameTag(graphene.Mutation):
    class Arguments:
        id = graphene.ID()
        name = graphene.String()

    tag = graphene.Field(TagType)
    @classmethod
    def mutate(cls, root, info, id, name):
        try:
            tag: Tag = Tag.objects.get(pk=id)
            tag.tag_name = name
            tag.save()
            return RenameTag(tag=tag)
        except ObjectDoesNotExist:
            raise Exception("Does not exist")

class UpdateImage(graphene.Mutation):
    class Arguments:
        title = graphene.String()
        # by which id to find the image
        id = graphene.ID()

    image = graphene.Field(ImageType)

    @classmethod
    def mutate(cls, root, info, title, id):
        try:
            image: Image = Image.objects.get(id=id)
            # It could be saved in bytes... But how do you decode it back then?
            # image.title = smart_bytes(title, encoding='utf-8')
            image.title = title
            image.save()
            return UpdateImage(image=image)
        except ObjectDoesNotExist:
            print("Such image doesn't exist")


class DeleteImage(graphene.Mutation):
    class Arguments:
        # by which id to find the image
        id = graphene.ID()

    deleted = graphene.String()

    @classmethod
    def mutate(cls, root, info, id):
        try:
            image: Image = Image.objects.get(id=id)
            image_file = image.image
            deleteFile(image_file.path)
            image.delete()
            return DeleteImage(deleted="yes")
        except ObjectDoesNotExist:
            return DeleteImage(deleted="no")


class Mutation(graphene.ObjectType):
    update_image = UpdateImage.Field()
    delete_image = DeleteImage.Field()

    create_tag = CreateTag.Field()
    connect_tag = ConnectTag.Field()
    remove_tag_connection = RemoveTagConection.Field()
    delete_tag = DeleteTag.Field()
    rename_tag = RenameTag.Field()



schema = graphene.Schema(query=Query, mutation=Mutation)
