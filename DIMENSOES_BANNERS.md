# 📐 Dimensões Recomendadas para Banners

## 📊 Resumo Executivo

| Tipo | Largura | Altura | Proporção | Tamanho Máx | Formato |
|------|---------|--------|-----------|-------------|---------|
| **Desktop** | 1920px | 1080px | 16:9 | 500 KB | WebP/JPG |
| **Mobile** | 768px | 900px | ~4:4.7 | 300 KB | WebP/JPG |

---

## 🖥️ Desktop (≥ 768px de largura)

### Dimensões Recomendadas

- **Largura:** 1920px (Full HD)
- **Altura:** 1080px
- **Proporção:** 16:9 (widescreen)
- **Tamanho do arquivo:** Máximo 500 KB (otimizado)
- **Formato:** WebP (com fallback JPG/PNG)

### Por que essas dimensões?

1. **1920x1080px (Full HD)**
   - Resolução padrão para monitores desktop modernos
   - Cobre 99% dos dispositivos desktop
   - Proporção 16:9 é padrão para hero banners
   - O `object-cover` cortará automaticamente os lados se a proporção não for exata

2. **Alternativa para telas maiores:**
   - **Largura:** 2560px
   - **Altura:** 1440px
   - **Proporção:** 16:9
   - Para monitores 2K/4K (opcional, mas recomendado)

### Container Atual

O container do banner no código atual tem:
- **Altura:** `h-screen` com `min-h-[600px]` e `max-h-[900px]`
- **Largura:** `100vw` (100% da viewport)
- **Breakpoint mobile:** `< 768px` de largura

### Área Segura (Safe Area)

Para garantir que o conteúdo importante não seja cortado:
- **Desktop:** Manter conteúdo importante centralizado nos últimos 1080px de altura
- **Evitar:** Colocar texto ou elementos importantes nas bordas (últimos 10% de cada lado)

---

## 📱 Mobile (< 768px de largura)

### Dimensões Recomendadas

- **Largura:** 768px
- **Altura:** 900px
- **Proporção:** ~4:4.7 (ou aproximadamente 16:18.75)
- **Tamanho do arquivo:** Máximo 300 KB (otimizado)
- **Formato:** WebP (com fallback JPG/PNG)

### Por que essas dimensões?

1. **768x900px**
   - A altura mínima do container é 600px
   - 900px garante que a imagem preencha bem o espaço
   - Proporção mais vertical, ideal para mobile
   - Cobre a maioria dos dispositivos móveis (largura máxima comum)

2. **Alternativa mais vertical:**
   - **Largura:** 750px
   - **Altura:** 1000px
   - **Proporção:** 3:4
   - Para dispositivos mais verticais (opcional)

### Dispositivos Testados

- **iPhone SE (2ª geração):** 375x667px
- **iPhone 12/13:** 390x844px
- **iPhone 11 Pro Max:** 414x896px
- **Samsung Galaxy S21:** 360x800px
- **iPad Mini:** 768x1024px

### Área Segura (Safe Area)

- **Mobile:** Focar conteúdo no centro superior da imagem
- **Evitar:** Elementos importantes nas últimas 200px inferiores (área de overlay mais escura)

---

## 🎨 Considerações de Design

### 1. Overlay e Legibilidade

O sistema aplica um overlay gradiente sobre a imagem:
- **Topo:** 40% da opacidade configurada
- **Meio:** 30% da opacidade configurada
- **Base:** 80% da opacidade configurada

**Recomendação:** Use imagens com boa iluminação e contraste para garantir legibilidade do texto.

### 2. Conteúdo do Banner

Elementos que podem ser exibidos:
- **Logo:** 96x96px (mobile) ou 128x128px (desktop)
- **Título:** Texto grande e legível
- **Descrição:** Texto secundário
- **Botões:** 1 ou 2 botões de ação

**Recomendação:** Mantenha o conteúdo centralizado e evite áreas muito escuras ou claras que dificultem a leitura.

### 3. Performance

- **Otimização:** Sempre otimize as imagens antes do upload
- **Formato WebP:** Reduz o tamanho do arquivo em até 30% comparado ao JPG
- **Lazy Loading:** O primeiro banner carrega com `priority={true}`, os demais são lazy-loaded

---

## 📋 Checklist de Preparação

### Antes de Fazer Upload

- [ ] Imagem desktop: 1920x1080px (16:9)
- [ ] Imagem mobile: 768x900px (~4:4.7)
- [ ] Tamanho desktop: < 500 KB
- [ ] Tamanho mobile: < 300 KB
- [ ] Formato: WebP ou JPG otimizado
- [ ] Conteúdo importante na área segura
- [ ] Boa iluminação e contraste
- [ ] Texto alternativo (alt_text) preenchido

### Ferramentas Recomendadas

1. **Otimização de Imagens:**
   - [TinyPNG](https://tinypng.com/) - Compressão sem perda de qualidade
   - [Squoosh](https://squoosh.app/) - Conversão para WebP
   - [ImageOptim](https://imageoptim.com/) - Otimização avançada

2. **Edição:**
   - Adobe Photoshop
   - GIMP (gratuito)
   - Canva (online)

3. **Validação:**
   - Verificar dimensões exatas antes do upload
   - Testar em diferentes dispositivos após upload

---

## 🔧 Implementação Técnica

### Container Atual

```tsx
<section className="relative h-screen min-h-[600px] max-h-[900px]">
  <Image
    src={isMobile ? banner.image_mobile_url : banner.image_desktop_url}
    fill
    className="object-cover"
    sizes="100vw"
  />
</section>
```

### Breakpoint Mobile

```tsx
const [isMobile, setIsMobile] = useState(false);
useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };
  // ...
}, []);
```

### Modo de Exibição

- **`object-cover`:** A imagem preenche o container mantendo proporção, cortando se necessário
- **`fill`:** A imagem ocupa 100% do container pai
- **`sizes="100vw"`:** Indica que a imagem ocupa 100% da largura da viewport

---

## 📈 Resolução de Problemas

### Problema: Imagem cortada demais

**Solução:** Ajuste a composição da imagem para manter elementos importantes no centro.

### Problema: Imagem muito pesada

**Solução:** 
1. Use ferramentas de compressão (TinyPNG, Squoosh)
2. Converta para WebP
3. Reduza qualidade para 80-85% (geralmente imperceptível)

### Problema: Imagem pixelada

**Solução:** 
1. Use dimensões maiores que o necessário
2. Deixe o Next.js fazer o resize automático
3. Evite aumentar imagens pequenas

### Problema: Proporção incorreta

**Solução:** 
1. Use ferramentas de edição para recortar na proporção correta
2. Desktop: 16:9 (1920:1080)
3. Mobile: ~4:4.7 (768:900)

---

## ✅ Resumo Final

### Desktop
- **Dimensões:** 1920x1080px
- **Proporção:** 16:9
- **Tamanho:** < 500 KB
- **Formato:** WebP/JPG

### Mobile
- **Dimensões:** 768x900px
- **Proporção:** ~4:4.7
- **Tamanho:** < 300 KB
- **Formato:** WebP/JPG

### Boas Práticas
- ✅ Sempre otimize antes do upload
- ✅ Use WebP quando possível
- ✅ Mantenha conteúdo na área segura
- ✅ Teste em diferentes dispositivos
- ✅ Preencha o alt_text para acessibilidade

---

**Última atualização:** Dezembro 2024
**Versão do sistema:** Next.js 16.0.7
