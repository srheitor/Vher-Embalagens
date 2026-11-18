/**
 * Configuração central do site.
 * Tudo que é "texto fixo" da empresa fica aqui.
 */
export const site = {
  /** Marca exibida no site. */
  nome: 'Caixas para Pizza BH',
  /** Razão/nome da empresa (aparece no rodapé e nos textos institucionais). */
  empresa: 'Vhêr Embalagens',
  segmento: 'Embalagens para delivery',
  /** Caminho de uma imagem em public/ (ex.: 'img/site/logo.svg'). null = usa a marca em texto. */
  logo: null as string | null,
  descricao:
    'Caixas para pizzas, salgados, doces, bolos e e-commerce. Sacos para delivery e sacolas personalizadas com a melhor qualidade do mercado.',
  /** null = não exibe. */
  anosDeMercado: 30 as number | null,
  /** null = não exibe. */
  cidade: 'Belo Horizonte · MG' as string | null,

  contato: {
    /** Somente dígitos, com DDI + DDD. */
    whatsapp: '5531975695220',
    mensagemPadrao: 'Olá, vindo do seu site em busca de embalagens.',
    /** null = não exibe. */
    instagram: 'https://www.instagram.com/caixas_para_pizza_bh/' as string | null,
    /** null = não exibe. */
    email: 'dagrafica57@gmail.com' as string | null,
  },

  /**
   * Repositório onde o catálogo (public/data/catalogo.json) e as imagens ficam salvos.
   * O painel admin grava nele usando a API do GitHub.
   */
  github: {
    owner: 'srheitor',
    repo: 'Vher-Embalagens',
    branch: 'main',
  },
};

export type SiteConfig = typeof site;
