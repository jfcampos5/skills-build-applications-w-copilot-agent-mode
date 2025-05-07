from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime

class Command(BaseCommand):
    help = 'Popula o banco octofit_db com dados de teste.'

    def handle(self, *args, **kwargs):
        # Usuários
        user1 = User.objects.create(email='alice@mergington.edu', name='Alice', password='alicepass')
        user2 = User.objects.create(email='bob@mergington.edu', name='Bob', password='bobpass')
        user3 = User.objects.create(email='carol@mergington.edu', name='Carol', password='carolpass')

        # Times (agora usando lista de e-mails)
        team1 = Team.objects.create(name='OctoRunners', members=[user1.email, user2.email])
        team2 = Team.objects.create(name='FitSquad', members=[user3.email])

        # Atividades
        Activity.objects.create(user=user1.email, activity_type='run', duration=30, date=datetime(2025, 5, 1))
        Activity.objects.create(user=user2.email, activity_type='walk', duration=45, date=datetime(2025, 5, 2))
        Activity.objects.create(user=user3.email, activity_type='strength', duration=20, date=datetime(2025, 5, 3))

        # Leaderboard
        Leaderboard.objects.create(user=user1.email, points=120)
        Leaderboard.objects.create(user=user2.email, points=100)
        Leaderboard.objects.create(user=user3.email, points=80)

        # Workouts
        Workout.objects.create(user=user1.email, workout_type='cardio', details='Interval run', date=datetime(2025, 5, 1))
        Workout.objects.create(user=user2.email, workout_type='cardio', details='Brisk walk', date=datetime(2025, 5, 2))
        Workout.objects.create(user=user3.email, workout_type='strength', details='Push-ups and squats', date=datetime(2025, 5, 3))

        self.stdout.write(self.style.SUCCESS('Banco octofit_db populado com dados de teste!'))
