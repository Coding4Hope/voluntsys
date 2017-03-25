# -*- coding:utf-8
from django.shortcuts import render, redirect,render_to_response
from django.http.response import HttpResponse
from django.views.generic.base import View
from django.core.serializers import serialize
from django.views.decorators.csrf import csrf_exempt
from core.models import *

class homeView(View):
    def get(self, request, *args, **kwargs):
        context = {}
        return render(request, 'home.html', context)


class associadosView(View):
    def get(self,request, *args, **kwargs):
        return render(request, 'associados/associados_geral.html', {})


class assiciadoNovoView(View):
    def get(self,request, *args, **kwargs):
        context = {}
        return render(request, 'associados/associado_novo.html', context)


class associadoExcluirView(View):
    def get(self,request, *args, **kwargs):
        return render(request, 'associados/associado_excluir.html', {})

class tiposassociadosView(View):
    def get(self,request, *args, **kwargs):
        return render(request, 'tiposassociados/tipoassociados_geral.html', {})


class tipoassiciadoNovoView(View):
    def get(self,request, *args, **kwargs):
        context = {}
        return render(request, 'tipoassociados/tipoassociado_novo.html', context)


class tipoassociadoExcluirView(View):
    def get(self,request, *args, **kwargs):
        return render(request, 'tipoassociados/tipoassociado_excluir.html', {})


class ServiceJson(View):
    @staticmethod
    def associados(request):
        query = Associado.objects.all()

        id = request.GET.get("id")
        nome = request.GET.get("nome")
        email = request.GET.get("email")
        tipo_associado = request.GET.get("tipo_associado")

        if id:
            query = query.filter(id=id)
        if nome:
            query = query.filter(nome__icontains=nome)
        if email:
            query = query.filter(email__icontains=email)
        if tipo_associado:
            query = query.filter(tipo_associacao__id=tipo_associado)

        lista = serialize('json', query)
        return HttpResponse(lista, content_type='application/json')

    @staticmethod
    @csrf_exempt
    def saveassociado(request):
        # Filtros
        id = request.POST.get("id")
        nome = request.POST.get("nome")
        email = request.POST.get("email")
        endereco = request.POST.get("endereco")
        telefone = request.POST.get("telefone")
        tipo_associado = request.POST.get("tipo_associado")
        bairro = request.POST.get("bairro")


        # Objeto de Associado
        Associado = Associado()

        if (id):
            if (int(id) > 0):
                oAssociado = Associado.objects.get(id=id)

        oAssociado.nome = nome
        oAssociado.email = email
        oAssociado.endereco = endereco
        oAssociado.telefone = telefone
        oAssociado.tipo_associado = TipoAssociado.objects.filter(id=tipo_associado).first()
        oAssociado.bairro = Bairro.objects.filter(id=bairro).first()

        oAssociado.save()

        lista = "true"
        return HttpResponse(lista, content_type='application/json')


    @staticmethod
    def excluirassociado(request):
        id = request.GET.get("id")

        # Query Base
        oAssociado = Associado.objects.filter(id=id).first()

        oAssociado.delete()

        lista = "true"

        return HttpResponse(lista, content_type='application/json')


    @staticmethod
    def tiposassociados(request):
        query = TipoAssociado.objects.all()

        id = request.GET.get("id")
        titulo = request.GET.get("titulo")

        if id:
            query = query.filter(id=id)
        if titulo:
            query = query.filter(titulo__icontains=titulo)

        lista = serialize('json', query)
        return HttpResponse(lista, content_type='application/json')

    @staticmethod
    @csrf_exempt
    def savetipoassociado(request):
        # Filtros
        id = request.POST.get("id")
        titulo = request.POST.get("nome")


        # Objeto de Associado
        oTipoAssociado = TipoAssociado()

        if (id):
            if (int(id) > 0):
                oTipoAssociado = TipoAssociado.objects.get(id=id)

        oTipoAssociado.titulo = titulo
        oTipoAssociado.save()

        lista = "true"
        return HttpResponse(lista, content_type='application/json')


    @staticmethod
    def excluirtipoassociado(request):
        id = request.GET.get("id")

        # Query Base
        oTipoAssociado = TipoAssociado.objects.filter(id=id).first()
        oTipoAssociado.delete()

        lista = "true"

        return HttpResponse(lista, content_type='application/json')