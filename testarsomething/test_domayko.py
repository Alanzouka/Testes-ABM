import pytest


def dividir(a, b):
    if b == 0:
        raise ValueError("divisao por zero nao existe")
    return a / b


def test_divisao_por_zero():
    with pytest.raises(ValueError):  
        dividir(10, 0)


