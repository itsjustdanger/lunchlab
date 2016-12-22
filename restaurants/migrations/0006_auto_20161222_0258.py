# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2016-12-22 02:58
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurants', '0005_auto_20161221_1641'),
    ]

    operations = [
        migrations.AddField(
            model_name='restaurant',
            name='address',
            field=models.CharField(default='', max_length=250),
        ),
        migrations.AddField(
            model_name='restaurant',
            name='description',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='restaurant',
            name='lat',
            field=models.DecimalField(decimal_places=5, default=0, max_digits=8),
        ),
        migrations.AddField(
            model_name='restaurant',
            name='lng',
            field=models.DecimalField(decimal_places=5, default=0, max_digits=8),
        ),
    ]
