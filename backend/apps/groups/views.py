from rest_framework import generics

from apps.groups.models import Group
from apps.groups.serializers import GroupSerializer


class GroupListAPIView(generics.ListAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
