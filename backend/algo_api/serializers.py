from rest_framework import serializers
from .models import SortingRun

class SortingRunSerializer(serializers.ModelSerializer):
    class Meta:
        model = SortingRun
        fields = '__all__'