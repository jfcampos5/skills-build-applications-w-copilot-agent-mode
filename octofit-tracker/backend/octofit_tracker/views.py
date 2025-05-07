from rest_framework import viewsets
from rest_framework.response import Response
from .models import User, Team, Activity, Leaderboard, Workout
from .serializers import UserSerializer, TeamSerializer, ActivitySerializer, LeaderboardSerializer, WorkoutSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

class LeaderboardViewSet(viewsets.ModelViewSet):
    queryset = Leaderboard.objects.all()
    serializer_class = LeaderboardSerializer

class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer

def api_root(request, format=None):
    codespace_url = request.build_absolute_uri('/').replace('http://', 'https://').replace('localhost:8000', 'curly-bassoon-jj6vv9jwg9gfqjvq-8000.app.github.dev')
    return Response({
        'users': codespace_url + 'api/users/',
        'teams': codespace_url + 'api/teams/',
        'activity': codespace_url + 'api/activity/',
        'leaderboard': codespace_url + 'api/leaderboard/',
        'workouts': codespace_url + 'api/workouts/',
    })
