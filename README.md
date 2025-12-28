# @smc/plugin-link-template

Plugin para **NocoBase 1.9.x** que permite exibir valores de campos como **links dinâmicos gerados por template**, com configuração via popup no modo **Design** (no mesmo local do *Enable link*).

---

## Visão geral

Este plugin adiciona um **Field Component** chamado **Link** (LinkTemplate) que transforma o valor de um campo em um link clicável, montado a partir de um template configurável.

### Exemplo
```
http://www.link.com.br/{{numero_doc}}
```

Com um registro onde `numero_doc = 12345`, o link final será:
```
http://www.link.com.br/12345
```

---

## Funcionalidades

- Componente **LinkTemplate** para campos em modo visualização (*Read pretty*).
- Configuração via modal **Configure link** em *Specific properties*.
- URL baseada em template com placeholders `{{campo}}`.
- Texto do link opcional e configurável.
- Suporte a campos aninhados (`{{user.name}}`).
- Funciona em **Details** e **Table**.
- Compatível com schemas antigos (*legacy*).

---

## Requisitos

- **NocoBase**: 1.9.x (testado em 1.9.32)
- **Node.js**: 18+
- **Yarn**: 1.x

---

## Estrutura do plugin

```
@smc/plugin-link-template
├─ src
│  ├─ client
│  │  ├─ components
│  │  │  └─ LinkTemplate.tsx
│  │  ├─ settings
│  │  │  └─ linkTemplateSettings.ts
│  │  └─ index.tsx
│  └─ server
│     └─ plugin.ts
├─ dist
├─ tsup.config.ts
├─ tsconfig.json
└─ package.json
```

---

## Desenvolvimento (no monorepo do NocoBase)

1. Copie o plugin para:
   ```
   packages/plugins/@smc/plugin-link-template
   ```

2. Ative o plugin:
   ```bash
   yarn pm enable @smc/plugin-link-template
   ```

3. Suba o NocoBase:
   ```bash
   yarn dev
   ```

---

## Build (fora do repositório do NocoBase)

Este plugin pode ser compilado **fora do monorepo**.

### Instalar dependências
```bash
yarn install
```

### Gerar build
```bash
yarn build
```

Saída esperada:
```
dist/
├─ client.js
├─ client.d.ts
├─ server.js
└─ server.d.ts
```

---

## Empacotar para distribuição

Para gerar um pacote instalável (`.tgz`):

```bash
npm pack
```

---

## Instalação em outra instância do NocoBase

Na raiz do projeto NocoBase de destino:

```bash
yarn add ./smc-plugin-link-template-1.0.0.tgz
yarn pm enable @smc/plugin-link-template
yarn dev
```

---

## Como usar

1. Vá para uma página onde o campo esteja em **Read pretty** (ex.: Details ou Table).
2. Entre em **Design**.
3. Selecione o campo desejado.
4. Em **Field component**, escolha **Link**.
5. Em **Specific properties**, clique em **Configure link**.
6. Configure o template da URL e o texto opcional.

---

## Placeholders suportados

- `{{campo}}` → `record.campo`
- `{{id}}` → `record.id`
- `{{user.name}}` → `record.user.name`

---

## Licença

Defina aqui a licença do plugin conforme a política interna da SMC.
