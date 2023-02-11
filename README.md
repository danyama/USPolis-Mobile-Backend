# USPolis - Mobile Backend

Este repositório se refere ao backend do aplicativo USPolis, destinado a ajudar os alunos da Poli a encontrar suas aulas e alocação de salas.

## Aspectos técnicos

O serviço foi desenvolvido com as seguintes tecnologias:

- NodeJS
- Express
- Typescript

## Passos para a conexão com o DB

O banco de dados está na máquina da USPolis na nuvem da USP, e não está exposto por usuário e senha.
A conexão deve ser feita por SSH, com tunelamento de porta.
Uma possível forma de fazer isso:

1. Baixar a extensão de SSH da Microsoft no VSCode
2. Conectar o VSCode na máquina remota (credenciais estão no Notion, aba Recursos)
3. Abrir um terminal no VSCode remoto, e abrir a aba `Ports`
4. Adicionar porta 27017 (porta padrão do MongoDB)
5. Criar um arquivo `.env` local com a config `DATABASE_URL="mongodb://localhost:27017/uspolis"`

## Passos para instalação e uso

1. Selecionar a versão certa do NodeJS: `nvm use`
2. Instalar as dependências: `npm i`
3. Para rodar o servidor de desenvolvimento com fast reload (utilizando Nodemon): `npm run start:dev`

## Models

Sempre que houver alguma mudança no arquivo `schema.prisma`, é necessário atualizar os modelos rodando `npx prisma generate`

## Deploy

Na máquina da USP, rodar:

1. `cd ~/USPolis-Mobile-Backend/`
2. `git pull origin`
3. `./start_uspolis_mobile_back.sh`

O script de rodar o servidor termina o processo anterior na porta (versão anterior da aplicação) e levanta um novo build.

## Troubleshooting

Um ponto em que pode haver algum problema é no servidor da USP (que tem pouco espaço, só 10 gigas de storage). Então, pode ser que o espaço seja completo e, com isso, os sistemas saiam do ar (como por exemplo o banco de dados).

Um comando útil para descobrir onde estão os maiores arquivos e diretórios é `du -a /var/log | sort -n -r | head -n 20`, que mostra os 20 maiores ocupantes de espaço no sistema (nesse caso, na pasta `/var/log`)

Outro comando útil é o `journalctl --vacuum-time=5d`, que limpa os journals do sistema (nesse caso, apaga arquivos de mais de 5 dias). Fazendo isso, liberamos cerca de 1 giga de espaço no servidor.

O comando `df -h` mostra o espaço disponível e ocupado no sistema.
