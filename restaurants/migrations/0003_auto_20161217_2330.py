# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2016-12-17 23:30
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurants', '0002_auto_20161217_2326'),
    ]

    operations = [
        migrations.AlterField(
            model_name='restaurant',
            name='visitors',
            field=models.ManyToManyField(related_name='visited_restaurants', through='restaurants.Visit', to=settings.AUTH_USER_MODEL),
        ),
    ]