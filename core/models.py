from __future__ import unicode_literals

from django.db import models


class Estado(models.Model):
    id=models.AutoField(primary_key=True)
    nome = models.CharField(max_length=512)
def __unicode__(self):
    return self.nome
class Meta:
    verbose_name = 'Estado'
    verbose_name_plural = 'Estados'


class Cidade(models.Model):
    id=models.AutoField(primary_key=True)
    nome = models.CharField(max_length=512)
    estado = models.ForeignKey("Estado", related_name="Cidades")
def __unicode__(self):
    return self.nome
class Meta:
    verbose_name = 'Cidade'
    verbose_name_plural = 'Cidades'


class Bairro(models.Model):
    id=models.AutoField(primary_key=True)
    nome = models.CharField(max_length=512)
    cidade = models.ForeignKey("Cidade", related_name="Bairros")
def __unicode__(self):
    return self.nome
class Meta:
    verbose_name = 'Bairro'
    verbose_name_plural = 'Bairros'


class TipoAssociado(models.Model):
    id=models.AutoField(primary_key=True)
    titulo = models.CharField(max_length=256)
def __unicode__(self):
    return self.titulo
class Meta:
    verbose_name = 'Tipo de Associado'
    verbose_name_plural = 'Tipos de Associado'


class Associado(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=512)
    email = models.CharField(max_length=512)
    bairro = models.ForeignKey("Bairro")
    endereco = models.CharField(max_length=1024)
    telefone = models.CharField(max_length=256)
    tipo_associado = models.ForeignKey("TipoAssociado")
def __unicode__(self):
    return self.nome
class Meta:
    verbose_name = 'Associado'
    verbose_name_plural = 'Associados'
