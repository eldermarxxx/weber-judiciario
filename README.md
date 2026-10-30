# Assistente de Minutas: base de conexão

Base de código que conecta o projeto aos serviços que o cliente tem na VPS (Octop e Hermes). Por enquanto só confere a configuração e a conectividade.

## Como preparar

1. Copie o arquivo de exemplo: `cp .env.example .env`
2. Preencha as variáveis com os dados fornecidos pelo cliente. O `.env` não vai para o Git.
3. Rode a checagem: `npm start`

## Testes

`npm test`

Os testes não acessam a VPS. Usam uma conexão simulada.

## Regras

- Segredos só entram por variáveis de ambiente. Nunca em código, em log ou em URL.
- Logs mostram senhas como `***`.
- Mensagens de erro citam o nome da variável, nunca o valor.

## Pendências

- Confirmar na instância do cliente o caminho de login e de API de cada serviço. Hoje a checagem só usa a raiz de cada URL com autenticação básica.
- Definir o canal do WhatsApp (Evolution API ou gateway próprio) e o contrato do harness.

## WhatsApp (Evolution API)

- Rota de envio confirmada no código público da Evolution: `POST /message/sendText/{instância}`, com cabeçalho `apikey`.
- O nome do evento de webhook (`messages.upsert`) ainda precisa ser validado numa instância real.
- Licença: Apache 2.0 com condições. Uso comercial é permitido, mas o sistema precisa mostrar um aviso de que a Evolution API está em uso. O descumprimento pode exigir licença comercial. Contato do produtor: suporte@evofoundation.com.br.
- Pendência: o conector ainda não chama o Octop. A função que gera a resposta (`responder`) é injetada, e a rota de conversa do Octop precisa ser confirmada.
