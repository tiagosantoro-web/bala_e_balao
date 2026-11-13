# Salão de Festas Infantis — site

Página única para um salão de festas infantis, criada pela Solodev Studio. HTML, CSS e JavaScript puros, sem instalação nem etapa de build.

## Abrir e editar

Abra `index.html` no navegador. Para editar, use qualquer editor; as regras de código estão em `AGENTS.md`.

## Estrutura

- `index.html`: página completa, com blocos identificados por comentários.
- `css/style.css`: estilos organizados por bloco e responsividade no final.
- `js/script.js`: configuração do cliente, menu, WhatsApp, pedido de orçamento, galeria e animações.
- `assets/images/`: fotos reais do espaço em WebP.
- `robots.txt`: liberação para buscadores.

## Seções

1. Apresentação: bandeirinhas e balões animados, título em sequência, fotos em molduras com profundidade ao mover o mouse.
2. Faixa rolante com os tipos de evento e as atrações.
3. Tipos de eventos: aniversários infantis; chás de bebê e chás revelação; chás de cozinha e celebrações familiares. Cada cartão preenche o tipo no formulário e leva até ele.
4. O espaço: salão e área de brinquedos no mesmo ambiente.
5. Atrações: cartões com inclinação 3D (somente mouse).
6. Chamada visual intermediária.
7. Galeria com foto ampliada, setas, teclado e deslizar no celular.
8. Como reservar.
9. Pedido de orçamento: valida os dados, mostra a idade só em aniversários e abre o WhatsApp do salão com a mensagem pronta. Nada é salvo pelo site.
10. Barra fixa de conversão no celular (aparece depois da primeira tela e some no formulário) e botão flutuante de WhatsApp no desktop.

## Efeitos

Todos usam apenas `transform` e `opacity`, ficam desligados com `prefers-reduced-motion` e os efeitos de mouse não rodam em telas de toque. Confete aparece nos cliques de WhatsApp e no envio do pedido.

## Configuração

Edite o início de `js/script.js`:

- `whatsappNumber`: DDI + DDD + número, só dígitos (ex.: `5511999999999`). Enquanto estiver vazio, os botões levam ao formulário e o envio avisa que o WhatsApp não foi configurado.
- `whatsappMessage`: mensagem inicial dos botões.
- `instagramUrl`: link do perfil. Vazio = item oculto.

## Pendências do cliente

Procure `PENDENTE` nos arquivos para ver cada ponto no código.

Já aplicados: nome (Bala e Balão Buffet Infantil), endereço (Av. Henriqueta Mendes Guerra, 726, Centro, Barueri - SP), slogan, tipos de evento e dados estruturados `EventVenue`.

- WhatsApp (obrigatório para os botões e o formulário funcionarem) e Instagram.
- Logo oficial: a marca atual (bala + balão em SVG) é provisória.
- CEP e telefone, para completar os dados estruturados.
- Capacidade de convidados e faixa etária.
- Dias e horários de atendimento.
- Fotos em resolução maior: as atuais têm cerca de 300–440 px de largura (prints). Por isso o layout usa molduras pequenas.
- Mais fotos: fachada, outras festas e decorações.
- Depoimentos reais (seção ainda não criada para não usar avaliações fictícias).
- Domínio, para `canonical`, `sitemap.xml`, `og:url` e imagem de compartilhamento com URL absoluta.

O mapa do Google só carrega quando o visitante clica em "Ver mapa", para não pesar a abertura da página.

## Testes realizados

- Sem rolagem horizontal em 320, 360, 480, 768, 1024 e 1440 px.
- Menu do celular abre e fecha.
- Cartões de eventos preenchem o tipo no formulário; idade aparece só em aniversário.
- Formulário: campos obrigatórios, data mínima, aviso sem WhatsApp configurado, mensagem montada com número de teste e confete no envio.
- Galeria: abrir, próxima, anterior, volta ao início, seta do teclado e fechar.
- Barra fixa do celular: oculta no topo, visível depois da primeira tela, oculta no formulário.
- Galeria sem espaços vazios em 4, 3 e 2 colunas.
- Contraste de botões e textos sobre os cartões coloridos acima de 4,5:1.
- Nenhum erro de JavaScript no console.

Lighthouse ainda não foi executado; rodar depois da publicação.

## Publicação no Cloudflare Workers

Repositório: `tiagosantoro-web/bala-e-balao` (privado). `wrangler.jsonc` configura a hospedagem estática e `.assetsignore` publica apenas `index.html`, `robots.txt`, `css/`, `js/` e `assets/`.

No painel da Cloudflare, em **Workers & Pages → Create → Import a repository**:

| Campo | Valor |
|---|---|
| Repositório | `tiagosantoro-web/bala-e-balao` |
| Branch de produção | `main` |
| Project name | `bala-e-balao` |
| Build command | Deixar vazio |
| Deploy command | `npx wrangler deploy` |
| Diretório raiz | Raiz do repositório |

Depois do deploy, o site fica em `bala-e-balao.<subdominio>.workers.dev`. Cada envio para a `main` publica de novo automaticamente. Para usar um domínio próprio, acrescente `routes` com `custom_domain: true` em `wrangler.jsonc`, como no site da Solodev.

Antes de divulgar, configure o WhatsApp em `js/script.js`; sem ele, os botões levam ao formulário, que avisa que o número não foi configurado.
