# 🏛️ Assembleia de Deus Missão - Sacramento/MG

Site institucional moderno, responsivo e otimizado para SEO para a igreja "Assembleia de Deus Missão - Sacramento".

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Configuração do Supabase](#-configuração-do-supabase)
- [Executando o Projeto](#-executando-o-projeto)
- [Admin Dashboard](#-admin-dashboard)
- [Deploy](#-deploy)

## 🎯 Visão Geral

O projeto possui duas partes principais:

### Portal Público
- **Hero Section**: Galeria de banners com Swiper
- **Versículo do Dia**: Texto dinâmico com link para Bible.com
- **Sobre & Liderança**: Apresentação da igreja e carrossel de líderes
- **Conhecimento**: Tabs com Estudos e Blog
- **Agenda**: Google Calendar embed + programação fixa
- **Dízimos & Ofertas**: Chave PIX e QR Code
- **Galeria de Fotos**: Cards com links para Google Drive
- **Depoimentos**: Carrossel estilo Google My Business
- **Contato**: Cards de contato + mapa do Google Maps

### Admin Dashboard (CMS)
- Dashboard com estatísticas
- Gerenciamento de Banners
- Gerenciamento de Versículo do Dia
- Gerenciamento de Liderança
- Gerenciamento de Blog & Estudos
- Gerenciamento de Agenda/Eventos
- Gerenciamento de Galeria
- Configurações de PIX/Financeiro
- Gerenciamento de Depoimentos
- Configurações gerais do site

## 🛠️ Tecnologias

| Tecnologia | Descrição |
|------------|-----------|
| **Next.js 15** | Framework React com App Router |
| **TypeScript** | Tipagem estática |
| **Tailwind CSS 4** | Framework CSS utilitário |
| **Framer Motion** | Animações suaves |
| **Lucide React** | Ícones modernos |
| **Swiper** | Carrosséis/Sliders |
| **Supabase** | Backend (PostgreSQL + Auth) |
| **Zustand** | Gerenciamento de estado |

## 📂 Estrutura do Projeto

```
igreja-nextjs/
├── public/
│   └── images/            # Imagens estáticas
├── src/
│   ├── app/
│   │   ├── admin/         # Páginas do Admin Dashboard
│   │   │   ├── banners/
│   │   │   ├── configuracoes/
│   │   │   ├── depoimentos/
│   │   │   ├── eventos/
│   │   │   ├── financeiro/
│   │   │   ├── galeria/
│   │   │   ├── lideranca/
│   │   │   ├── login/
│   │   │   ├── posts/
│   │   │   ├── versiculo/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── blog/          # Listagem de posts do blog
│   │   ├── estudos/       # Listagem de estudos
│   │   ├── globals.css    # Estilos globais
│   │   ├── layout.tsx     # Layout root
│   │   └── page.tsx       # Homepage
│   ├── components/
│   │   ├── layout/        # Header, Footer
│   │   ├── sections/      # Seções da página
│   │   └── index.ts       # Exports
│   └── lib/
│       ├── database.types.ts    # Tipos do banco
│       └── supabase/            # Clientes Supabase
├── supabase/
│   └── schema.sql         # Schema do banco de dados
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

## 🚀 Instalação

1. **Clone o repositório:**
```bash
git clone <repo-url>
cd igreja-nextjs
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env.local` na raiz com:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_do_supabase
# Local: http://localhost:3000 | Produção: https://www.assembleiadedeussacramento.com.br
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🗄️ Configuração do Supabase

1. **Crie um projeto no [Supabase](https://supabase.com)**

2. **Execute o schema do banco:**
   - Acesse o SQL Editor no painel do Supabase
   - Cole e execute o conteúdo de `supabase/schema.sql`

3. **Configure a autenticação:**
   - Habilite "Email" como provider em Authentication > Providers
   - Crie um usuário admin em Authentication > Users

4. **Copie as credenciais:**
   - Project Settings > API
   - Copie `URL` e `anon public` key para o `.env.local`

## 💻 Executando o Projeto

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Servidor de produção
npm start
```

O site estará disponível em [http://localhost:3000](http://localhost:3000)

## 🔐 Admin Dashboard

Acesse o painel administrativo em: [http://localhost:3000/admin](http://localhost:3000/admin)

### Funcionalidades:
- **Dashboard**: Visão geral com estatísticas
- **Banners**: Gerenciar slider da homepage
- **Versículo**: Configurar versículo do dia
- **Liderança**: Gerenciar líderes da igreja
- **Blog & Estudos**: Criar e editar posts
- **Eventos**: Configurar programação fixa
- **Galeria**: Links para álbuns no Drive
- **Financeiro**: Configurar PIX
- **Depoimentos**: Gerenciar testemunhos
- **Configurações**: Dados gerais do site

## 🌐 Deploy

### Vercel (Recomendado)

1. **Push para GitHub/GitLab**

2. **Importe no Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Import project
   - Selecione o repositório

3. **Configure as variáveis de ambiente:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` = `https://www.assembleiadedeussacramento.com.br`
   - `CORS_ORIGIN` = `https://www.assembleiadedeussacramento.com.br`

4. **Deploy!**

## 🎨 Paleta de Cores

| Nome | Cor | Uso |
|------|-----|-----|
| Primária | `#e2d0aa` | Fundos, destaques |
| Accent | `#232d82` | Textos, botões |
| Primária Light | `#f0e5cc` | Fundos claros |
| Accent Light | `#3a4699` | Hover states |

## 📱 Responsividade

O site é totalmente responsivo e otimizado para:
- 📱 Mobile (< 640px)
- 📱 Tablet (640px - 1024px)
- 💻 Desktop (> 1024px)

O site em produção: [https://www.assembleiadedeussacramento.com.br/](https://www.assembleiadedeussacramento.com.br/)

## 🔍 SEO

- Meta tags otimizadas
- Open Graph e Twitter Cards
- Schema.org structured data (Church)
- Sitemap automático
- Imagens otimizadas com Next/Image

## 📄 Licença

Este projeto foi desenvolvido para a Assembleia de Deus Missão - Sacramento/MG.

---

**Desenvolvido com ❤️ para a glória de Deus**
