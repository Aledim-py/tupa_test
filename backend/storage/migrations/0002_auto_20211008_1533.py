# Generated by Django 3.2.5 on 2021-10-08 15:33

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('storage', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='image',
            name='upload_date_time',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='image',
            name='uploader_ip',
            field=models.CharField(default='unknown', max_length=50),
            preserve_default=False,
        ),
    ]