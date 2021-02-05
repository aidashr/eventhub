# Generated by Django 3.1.5 on 2021-02-05 17:03

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('EventHubApp', '0003_auto_20210128_2015'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='lat',
            field=models.FloatField(default=0, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='lng',
            field=models.FloatField(default=0, null=True),
        ),
        migrations.CreateModel(
            name='GroupChatMessage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.CharField(max_length=1500, null=True)),
                ('is_read', models.BooleanField(default=False, null=True)),
                ('created_at', models.DateTimeField(auto_now=True)),
                ('reply_of', models.IntegerField(null=True)),
                ('event', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='EventHubApp.event')),
                ('sender', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ChatThread',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user1', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user1', to=settings.AUTH_USER_MODEL)),
                ('user2', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user2', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ChatMessage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.CharField(max_length=1500, null=True)),
                ('is_read', models.BooleanField(default=False, null=True)),
                ('created_at', models.DateTimeField(auto_now=True)),
                ('reply_of', models.IntegerField(null=True)),
                ('sender', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='sender', to=settings.AUTH_USER_MODEL)),
                ('thread', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='EventHubApp.chatthread')),
            ],
        ),
    ]
