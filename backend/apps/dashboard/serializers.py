from rest_framework import serializers


class DashboardSerializer(serializers.Serializer):
    total_matches = serializers.IntegerField()
    played_matches = serializers.IntegerField()
    pending_matches = serializers.IntegerField()
    total_groups = serializers.IntegerField()
    group_leaders = serializers.ListField()