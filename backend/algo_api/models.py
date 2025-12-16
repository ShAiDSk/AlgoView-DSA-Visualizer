from django.db import models

class SortingRun(models.Model):
    algorithm = models.CharField(max_length=100)
    array_size = models.IntegerField()
    speed_ms = models.IntegerField()
    comparisons = models.IntegerField()
    swaps = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.algorithm} - {self.timestamp}"