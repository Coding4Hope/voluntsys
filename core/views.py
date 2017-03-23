# -*- coding:utf-8
from django.shortcuts import render, redirect,render_to_response
from django.http.response import HttpResponse
from django.views.generic.base import View
from core.models import *

def home(request):
    context = {}
    return render(request, 'home.html', context)


def associados(request):
    context = {}

    lista_associados = Associado.objects.all()

    context["associados"] = lista_associados

    return render(request, 'associados/associados_geral.html', context)


class VoluntarioNovoView(View):
    def get(self,request, *args, **kwargs):
        context = {}

        return render(request, 'associados/associado_novo.html', context)
    def post(self,request, *args, **kwargs):
        oIntegrante = Integrante.objects.get(id=request.GET.get("id"))

        oIntegranteHierarquia = IntegranteHierarquia()
        oIntegranteHierarquia.integrante = oIntegrante
        oIntegranteHierarquia.data_entrega = request.POST.get("data")
        oIntegranteHierarquia.hierarquia=Hierarquia.objects.get(id=request.POST.get("hierarquia_selecionado"))
        oIntegranteHierarquia.save()

        oIntegrante.hierarquia_atual = oIntegranteHierarquia.hierarquia
        oIntegrante.save()

        return redirect('/integrantes')