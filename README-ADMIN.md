# Sistema de Gestão - Assembleia de Deus Missão

## 📋 Visão Geral

Sistema completo de gestão de conteúdo para o site da Assembleia de Deus Missão de Sacramento MG. O sistema permite gerenciar todo o conteúdo do site através de uma interface administrativa moderna e intuitiva.

## 🔐 Acesso ao Sistema

### Credenciais Padrão
- **Usuário:** `admin`
- **Senha:** `admin123`

⚠️ **IMPORTANTE:** Altere a senha padrão após o primeiro acesso através da seção "Configurações" no dashboard.

### Como Acessar
1. Acesse `admin.html` no navegador
2. Digite as credenciais de acesso
3. Você será redirecionado para o dashboard

## 🎯 Funcionalidades

### 1. Dashboard
- Visão geral com estatísticas do conteúdo
- Contadores de estudos, posts, banners e líderes

### 2. Banners
- Adicionar, editar e excluir banners do slider principal
- Cada banner precisa de URL da imagem e texto alternativo

### 3. Versículo do Dia
- Atualização automática diária via API
- Possibilidade de atualização manual
- Cache local para evitar múltiplas requisições

### 4. Liderança
- Gerenciar membros da liderança da igreja
- Campos: Nome, Cargo e URL da imagem

### 5. Departamentos
Gerenciamento de membros por departamento:
- **Infantil**
- **Jovens**
- **Círculo de Oração**
- **Banda**

Cada membro possui: Nome, Cargo/Função e URL da imagem

### 6. Programação Fixa
- Gerenciar eventos fixos da programação semanal
- Campos: Título, Horário, Descrição e Badge (Culto/Estudo/Culto-Ensaio)

### 7. Estudos e Reflexões
- Criar e gerenciar estudos bíblicos
- Campos: Título, Conteúdo, Autor (opcional) e Data

### 8. Blog
- Criar e gerenciar posts do blog
- Campos: Título, Conteúdo, Autor (opcional) e Data

### 9. Configurações
- Alterar senha de acesso
- Ver informações do usuário

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop
- Tablet
- Mobile

## 💾 Armazenamento de Dados

Todos os dados são armazenados localmente no navegador usando **LocalStorage**. Isso significa que:
- Os dados persistem entre sessões
- Não há necessidade de servidor backend
- Os dados são específicos do navegador usado

⚠️ **IMPORTANTE:** Para produção, recomenda-se migrar para um sistema de banco de dados real.

## 🎨 Tema Escuro/Claro

O site público possui alternância entre tema claro e escuro:
- Botão de alternância no header
- Preferência salva no navegador
- Aplicado automaticamente em todas as páginas

## 🔄 Versículo Automático

O versículo do dia é atualizado automaticamente:
- Uma vez por dia (baseado na data)
- Cache local para evitar requisições desnecessárias
- Fallback para versículos locais em caso de erro na API

## 📝 Estrutura de Arquivos

```
site-igreja/
├── index.html              # Site público
├── admin.html             # Página de login
├── dashboard.html         # Painel administrativo
├── Css/
│   ├── styles.css         # Estilos do site público
│   └── admin.css          # Estilos do admin
├── Js/
│   ├── script.js          # Scripts do site público
│   ├── admin-auth.js      # Autenticação
│   └── admin-dashboard.js # Dashboard admin
└── Images/                # Imagens do site
```

## 🚀 Como Usar

### Adicionar Conteúdo
1. Faça login no sistema
2. Navegue até a seção desejada
3. Clique em "Adicionar" ou botão "+"
4. Preencha o formulário
5. Clique em "Salvar"

### Editar Conteúdo
1. Localize o item na lista
2. Clique em "Editar"
3. Modifique os campos desejados
4. Clique em "Salvar"

### Excluir Conteúdo
1. Localize o item na lista
2. Clique em "Excluir"
3. Confirme a exclusão

## 🔒 Segurança

- Autenticação básica via LocalStorage
- Sessão expira ao fechar o navegador (pode ser configurado)
- Validação de formulários no frontend
- Escape de HTML para prevenir XSS

⚠️ **NOTA:** Para produção, implemente autenticação no servidor e validação backend.

## 🛠️ Tecnologias Utilizadas

- HTML5
- CSS3 (com variáveis CSS)
- JavaScript ES6+
- Font Awesome (ícones)
- Google Fonts (Inter)
- LocalStorage API
- Bible API (para versículos)

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com o desenvolvedor do sistema.

---

**Desenvolvido para Assembleia de Deus Missão - Sacramento MG**

