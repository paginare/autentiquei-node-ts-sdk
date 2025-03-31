# Autentiquei SDK

SDK oficial para Node.js e TypeScript para facilitar a integração com a API Autentiquei.

## Instalação

```bash
npm install autentiquei-sdk
# ou
yarn add autentiquei-sdk
# ou
pnpm add autentiquei-sdk
```

## Uso Básico

Primeiro, obtenha seu **Token de API** no painel Autentiquei em Configurações > Tokens e API.

```typescript
import { AutentiqueiSDK } from 'autentiquei-sdk'; // ou '@autentiquei/sdk'

// Crie uma instância do SDK com sua chave de API
const autentiquei = new AutentiqueiSDK({
  apiKey: 'autq_SEU_TOKEN_DE_API_AQUI'
  // baseURL: 'https://api.autentiquei.app/api' // Opcional: URL base da API
});

// Exemplo: Enviar um código de verificação
async function enviarCodigo() {
  try {
    const response = await autentiquei.sendCode({
      phone: '+5511999999999', // Número no formato internacional
      method: 'whatsapp'       // 'whatsapp' ou 'sms'
    });

    if (response.success && response.hash) {
      console.log('Código enviado com sucesso!');
      console.log('Hash para verificação:', response.hash);
      // Salve o hash para usar na etapa de verificação
      return response.hash;
    } else {
      // A resposta aqui já será um erro lançado, este else não será atingido
      // O tratamento é feito no catch
      console.error('Falha ao enviar código (resposta inesperada):', response);
    }
  } catch (error: any) {
    console.error('Erro ao enviar código:', error.message);
  }
  return null;
}

// Exemplo: Verificar um código
async function verificarCodigo(hash: string, code: string) {
  if (!hash || !code) {
    console.error('Hash e código são necessários para verificar.');
    return;
  }

  try {
    const response = await autentiquei.verifyCode({
      hash: hash,
      code: code
    });

    // O SDK lança erro em caso de falha, então verificamos apenas o sucesso implícito
    console.log('Código verificado com sucesso!', response.message);
    // Prossiga com a lógica de usuário autenticado
    return true;

  } catch (error: any) {
    console.error('Falha na verificação:', error.message);
    // Informe ao usuário que o código está incorreto/expirado
    return false;
  }
}

// --- Como usar as funções ---
async function fluxoCompleto() {
  const codigoDigitadoPeloUsuario = '123456'; // Obtenha isso do seu frontend

  const hashRecebido = await enviarCodigo();

  if (hashRecebido) {
    const verificado = await verificarCodigo(hashRecebido, codigoDigitadoPeloUsuario);
    if (verificado) {
      console.log("Autenticação concluída!");
    }
  }
}

fluxoCompleto();

```

## Configuração

A instância do SDK é criada com um objeto de configuração:

-   `apiKey` (obrigatório): Seu token de API Autentiquei (começa com `autq_`).

## Tratamento de Erros

Os métodos do SDK (`sendCode`, `verifyCode`) retornam Promises. 
-   Se a chamada for bem-sucedida **do ponto de vista da rede e da API**, a Promise será resolvida com o objeto de resposta (`SendCodeResponse` ou `VerifyCodeResponse`). Note que mesmo uma resposta com `{ success: false, error: '...' }` da API *não* rejeitará a promise, você precisa checar o campo `success` na resposta.
-   Se ocorrer um erro **na comunicação com a API** (erro de rede, erro 4xx ou 5xx que não seja tratado pela API com `success: false`), a Promise será **rejeitada** com um objeto `Error`. A mensagem do erro (`error.message`) tentará conter a mensagem de erro retornada pela API Autentiquei ou uma mensagem genérica de erro de rede/axios. Use blocos `try...catch` para lidar com esses erros de comunicação.

## API

### `autentiquei.sendCode(params)`

Envia um código de verificação.

-   **Parâmetros (`SendCodeParams`):**
    -   `phone` (string): Número de telefone no formato internacional (ex: `+5511999999999`).
    -   `method` ('whatsapp' | 'sms'): Método de envio.
-   **Retorna:** `Promise<SendCodeResponse>`
    -   `success` (boolean): Indica se o envio foi iniciado com sucesso pela API.
    -   `message` (string | undefined): Mensagem informativa (presente em caso de sucesso ou erro da API).
    -   `hash` (string | undefined): Hash para usar na verificação (presente em caso de sucesso).
    -   `error` (string | undefined): Mensagem de erro da API (presente se `success` for `false`).

### `autentiquei.verifyCode(params)`

Verifica um código de verificação.

-   **Parâmetros (`VerifyCodeParams`):**
    -   `hash` (string): O hash retornado pelo `sendCode`.
    -   `code` (string): O código digitado pelo usuário.
-   **Retorna:** `Promise<VerifyCodeResponse>`
    -   `success` (boolean): Indica se o código foi verificado com sucesso pela API.
    -   `message` (string | undefined): Mensagem informativa (presente em caso de sucesso ou erro da API).
    -   `error` (string | undefined): Mensagem de erro da API (presente se `success` for `false`).

## Licença

MIT
