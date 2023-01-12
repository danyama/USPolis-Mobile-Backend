# USPolis - Mobile Backend

Este repositório se refere ao backend do aplicativo USPolis, destinado a ajudar os alunos da Poli a encontrar suas aulas e alocação de salas.

## Aspectos técnicos

O serviço foi desenvolvido com as seguintes tecnologias:

- NodeJS
- Express
- Typescript

## Passos para instalação e uso

1. Selecionar a versão certa do NodeJS: `nvm use`
2. Instalar as dependências: `npm i`
3. Para rodar o servidor de desenvolvimento com fast reload (utilizando Nodemon): `npm run start:dev`

## Models

Sempre que houver alguma mudança no arquivo `schema.prisma`, é necessário atualizar os modelos rodando `npx prisma generate`
