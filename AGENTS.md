# AGENTS.md

Site de salão de festas infantis criado pela Solodev Studio. Leve, sem build e pronto para adaptação ao GreatPages.

## Regras gerais

- HTML, CSS e JavaScript puros, sem bibliotecas ou frameworks.
- Todas as classes personalizadas começam com `sd-`.
- Não estilizar o layout com seletores globais (`*`, `body`); ajustes da página ficam em `.sd-page`.
- Cada bloco principal tem comentários de abertura e fechamento.
- Animações apenas com `transform` e `opacity`, respeitando `prefers-reduced-motion`.
- Entrada das seções com `IntersectionObserver`.
- Imagens em WebP, com dimensões reais, `alt` descritivo, `decoding="async"` e `loading="lazy"` fora da primeira tela.
- Sem rolagem horizontal; validar em 375, 480, 768, 1024 e 1440px.

## Conteúdo

- Não inventar informações do cliente: nome, endereço, capacidade, preços, horários e depoimentos só entram quando fornecidos.
- Trechos pendentes ficam marcados com `<!-- PENDENTE: ... -->` e listados no README.
- Fotos são reais do cliente; não usar imagens ilustrativas como se fossem do espaço.

## Configuração

- WhatsApp e Instagram ficam em `sdConfig`, no início de `js/script.js`.
- Todos os botões de WhatsApp leem dessa configuração.
