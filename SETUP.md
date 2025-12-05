# 🎯 JDES Banner Generator - Setup Completo

## Arquitetura do Projeto

```
FRONTEND (Next.js + React) → BACKEND (API Routes Vercel) → BD (Supabase) + Pagamentos (ASAAS)
```

## 1️⃣ CONFIGURAR SUPABASE (Autenticação + Banco de Dados)

### Passo 1: Criar Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Preencha:
   - **Name**: `banner-aprovados`
   - **Database Password**: Salve em lugar seguro
   - **Region**: Escolha a mais próxima (ex: Brasil = South America)
4. Aguarde a criação (~2 minutos)

### Passo 2: Copiar as Chaves de API
1. Abra seu projeto no Supabase
2. Vá em **Settings → API**
3. Copie:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (mantenha secret!)
4. Cole no arquivo `.env.local`

### Passo 3: Criar Tabela de Usuários
1. Vá em **SQL Editor** (lado esquerdo)
2. Copie e execute:

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  plan VARCHAR(50) DEFAULT 'FREE', -- FREE, PRO, PREMIUM
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

---

## 2️⃣ CONFIGURAR ASAAS (Pagamentos PIX + Cartão)

### Passo 1: Criar Conta no ASAAS
1. Acesse [asaas.com](https://asaas.com)
2. Clique em "Criar Conta"
3. Preencha com dados da empresa/pessoa
4. Confirme email

### Passo 2: Gerar API Key
1. Vá em **Configurações → Integrações → API**
2. Clique em **Gerar Chave API**
3. Copie a chave
4. Cole no `.env.local` como `NEXT_PUBLIC_ASAAS_API_KEY`

### Passo 3: Configurar Webhooks (opcional, mas recomendado)
1. Em **Integrações → Webhooks**
2. Adicione webhook URL: `https://seu-site.vercel.app/api/webhooks/asaas`
3. Selecione: `Pagamento recebido`, `Pagamento falhou`

---

## 3️⃣ ESTRUTURA DE PASTAS (Criar no seu PC)

```
BRANNER-APROVADOS/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (app)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── planos/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   ├── signup/
│   │   │   │   └── route.ts
│   │   │   └── logout/
│   │   │       └── route.ts
│   │   ├── payments/
│   │   │   ├── pix/
│   │   │   │   └── route.ts
│   │   │   ├── card/
│   │   │   │   └── route.ts
│   │   │   └── check/
│   │   │       └── route.ts
│   │   └── webhooks/
│   │       └── asaas/
│   │           └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── supabase.ts
│   └── asaas.ts
├── middleware.ts
├── .env.local
├── package.json
└── next.config.js
```

---

## 4️⃣ INSTALAR E RODAR LOCALMENTE

```bash
# 1. Clone o repositório
git clone https://github.com/torneiosonline1-pixel/BANNER-APROVADOS.git
cd BANNER-APROVADOS

# 2. Instale as dependências
npm install

# 3. Configure o .env.local com as chaves do Supabase e ASAAS
# (já está no repositório, só preencha os valores)

# 4. Rode em desenvolvimento
npm run dev

# 5. Acesse http://localhost:3000
```

---

## 5️⃣ FAZER DEPLOY NA VERCEL

```bash
# 1. Faça push para GitHub
git add .
git commit -m "feat: Setup complete with auth and payments"
git push origin main

# 2. A Vercel detecta automaticamente e faz deploy!
# 3. Configure as Environment Variables no painel Vercel:
#    Settings → Environment Variables
#    Cole as mesmas chaves do .env.local
```

---

## 📋 Checklist Final

- [ ] Supabase projeto criado com chaves no `.env.local`
- [ ] ASAAS conta criada com API key no `.env.local`
- [ ] Estrutura de pastas criada localmente
- [ ] `npm install` executado
- [ ] `npm run dev` funcionando em localhost
- [ ] Código enviado para GitHub
- [ ] Vercel fazendo deploy automático
- [ ] Environment variables configuradas na Vercel
- [ ] Teste login/cadastro funcionando
- [ ] Teste pagamento PIX/Cartão funcionando

---

## 📄 Próximas Etapas (Você vai implementar)

1. **Criar telas de Login e Cadastro** (pages/auth/)
2. **Criar tela de Planos** (pages/planos/)
3. **Implementar API de Autenticação** (api/auth/)
4. **Implementar API de Pagamentos** (api/payments/)
5. **Proteger rotas** (middleware.ts)
6. **Criar gerador de banners** (pages/app/generator/)
7. **Adicionar sistema de download** (com canvas → PNG)

---

**Dúvidas?** Consulteo repositório ou a documentação oficial de [Next.js](https://nextjs.org/docs), [Supabase](https://supabase.com/docs) e [ASAAS](https://docs.asaas.com).
