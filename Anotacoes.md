## Anotações sobre a CLI 📝

<br>

Atalhos:
g = generate
co = controller
s = service
cl = class
gu = guard
d = decorator

Gerar um Módulo = nest g module + NOME
OBS: Para criar um Módulo dentro de uma pasta, usar nest g module + Pasta DENTRO de src/Nome do Módulo !!

Fazer as validações de caso de uso nos Services !!

Para criar um Controller dentro de uma pasta de Módulo = nest g co NOME_CONTROLLER + NOME_MÓDULO
Para criar um Service para esse Controller = nest g s NOME_CONTROLLER + NOME_MÓDULO

Para criar Algo em uma determinada Pasta = nest g ALGO + caminhoDoArquivo/NOME desse Algo

Para o Tratamento de Erros, usar os Exceptions do próprio Nest, exemplo: BadRequestException, ForbiddenException, HttpException, etc...

<br>

## Outros
