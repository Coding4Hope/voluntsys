"""voluntsys URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from core.views import *
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', homeView.as_view()),
    url(r'^associados/$', associadosView.as_view(), name="Voluntarios-adm"),
    url(r'^associado-novo/$', assiciadoNovoView.as_view(), name ='VoluntarioNovo-adm'),
    url(r'^associado-excluir/$', associadoExcluirView.as_view(), name ='VoluntarioExcluir-adm'),

    url(r'^tiposassociados/$', tiposassociadosView.as_view(), name="Voluntarios-adm"),
    url(r'^tipoassociado-novo/$', tipoassiciadoNovoView.as_view(), name='VoluntarioNovo-adm'),
    url(r'^tipoassociado-excluir/$', tipoassociadoExcluirView.as_view(), name='VoluntarioExcluir-adm'),

    url(r'^js/associados/$', ServiceJson.associados, name="associados"),
    url(r'^js/tiposassociados/$', ServiceJson.tiposassociados, name="tiposassociados"),

    url(r'^js/saveassociado', ServiceJson.saveassociado, name='saveassociado'),
    url(r'^js/savetipoassociado', ServiceJson.savetipoassociado, name='savetipoassociado'),

    url(r'^js/excluirassociado', ServiceJson.excluirassociado, name='excluirassociado'),
    url(r'^js/excluirtipoassociado', ServiceJson.excluirtipoassociado, name='excluirtipoassociado'),


] + static(settings.STATIC_URL, document_root=settings.BASE_DIR)
