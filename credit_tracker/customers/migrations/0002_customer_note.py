# Generated by Django 5.1.6 on 2025-03-22 17:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='note',
            field=models.TextField(blank=True, null=True),
        ),
    ]
