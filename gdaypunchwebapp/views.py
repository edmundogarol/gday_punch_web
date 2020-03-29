from django.shortcuts import render

def index(request, id=0):
    return render(request, 'index.html')