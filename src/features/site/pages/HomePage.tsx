import { site } from '@/config/site';
import { Button, WhatsAppButton } from '@/shared/components';
import { usePublicCatalog } from '@/shared/hooks/usePublicCatalog';
import { IconArrowRight, IconBox, IconPalette, IconTruck } from '@/shared/icons';
import { publicUrl } from '@/shared/utils/assets';
import { ProductGrid } from '../components/ProductGrid';
import { SectionHeading } from '../components/SectionHeading';
import { ContactSection } from '../sections/ContactSection';
import styles from './HomePage.module.css';

const BENEFICIOS = [
  { icon: <IconPalette size={24} />, titulo: 'Personalizadas', texto: 'Caixas e sacolas impressas com a identidade do seu negócio.' },
  { icon: <IconBox size={24} />, titulo: 'Material de qualidade', texto: 'Papel cartão Klabin, duplex e kraft, com fundo em papelão pardo laminado.' },
  { icon: <IconTruck size={24} />, titulo: 'Ideal para delivery', texto: 'Embalagens resistentes que protegem o produto até o cliente.' },
];

const PASSOS = [
  { titulo: 'Escolha o modelo', texto: 'Veja no catálogo o tipo de embalagem que combina com o seu negócio.' },
  { titulo: 'Peça o orçamento', texto: 'Clique no botão do WhatsApp — a mensagem já vai pronta com o produto e a quantidade.' },
  { titulo: 'Aprove e receba', texto: 'Combinamos arte, prazo e entrega direto com você.' },
];

export function HomePage() {
  const { produtos, loading, error, categoriaNome } = usePublicCatalog();
  const destaques = produtos.filter((p) => p.destaque).slice(0, 6);
  const kicker = [site.segmento, site.anosDeMercado && `${site.anosDeMercado} anos no mercado`, site.cidade]
    .filter(Boolean)
    .join(' · ');

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroText}>
            <span className={styles.kicker}>{kicker}</span>
            <h1 className={styles.heroTitle}>
              Embalagens que <span>protegem o sabor</span> do seu delivery
            </h1>
            <p className={styles.heroLead}>{site.descricao}</p>
            <div className={styles.heroActions}>
              <Button to="/produtos" size="lg" iconRight={<IconArrowRight size={18} />}>
                Ver produtos
              </Button>
              <WhatsAppButton size="lg">Pedir orçamento</WhatsAppButton>
            </div>
          </div>
          <div className={styles.heroMedia}>
            <img src={publicUrl('img/site/hero.jpg')} alt="Caixa de pizza oitavada Caixas para Pizza BH aberta, com uma pizza dentro" />
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="container">
        <div className={styles.benefits}>
          {BENEFICIOS.map((b) => (
            <div key={b.titulo} className={styles.benefit}>
              <span className={styles.benefitIcon}>{b.icon}</span>
              <div>
                <h3>{b.titulo}</h3>
                <p>{b.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Destaques */}
      <section className={`container ${styles.section}`}>
        <SectionHeading
          eyebrow="Catálogo"
          title="Nossos produtos"
          description="Alguns dos modelos que produzimos para nossos clientes."
          action={
            <Button to="/produtos" variant="secondary" iconRight={<IconArrowRight size={18} />}>
              Ver todos
            </Button>
          }
        />
        <ProductGrid
          produtos={destaques.length ? destaques : produtos.slice(0, 6)}
          loading={loading}
          error={error}
          categoriaNome={categoriaNome}
          skeletons={4}
          emptyTitle="Em breve novos produtos por aqui"
        />
      </section>

      {/* Como funciona */}
      <section className={`container ${styles.section}`}>
        <SectionHeading eyebrow="Simples assim" title="Como fazer seu pedido" align="center" />
        <ol className={styles.steps}>
          {PASSOS.map((p, i) => (
            <li key={p.titulo} className={styles.step}>
              <span className={styles.stepNumber}>{i + 1}</span>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Sobre */}
      <section id="sobre" className={`container ${styles.section}`}>
        <div className={styles.about}>
          <div className={styles.aboutMedia}>
            <img src={publicUrl('img/site/sobre.jpg')} alt="Caixas de papelão para açaí com estampa de frutas e forro interno branco" loading="lazy" />
            {site.anosDeMercado && (
              <div className={styles.aboutStat}>
                <strong>{site.anosDeMercado}+</strong>
                <span>anos de mercado</span>
              </div>
            )}
          </div>
          <div className={styles.aboutText}>
            <SectionHeading eyebrow={`Sobre a ${site.empresa}`} title="Nossa história" />
            <p>
              A <strong>{site.nome}</strong> está no mercado de embalagens há {site.anosDeMercado ?? 'muitos'} anos.
              Prezamos pela qualidade e excelência dos nossos produtos para atender nossos clientes com
              profissionalismo e dedicação em tempo integral.
            </p>
            <p>
              Produzimos todos os tipos de caixas do ramo de delivery. Se você busca embalagens de qualidade que
              protejam seu produto e valorizem sua marca, a {site.empresa} é sua parceira ideal.
            </p>
          </div>
        </div>
      </section>

      <ContactSection produtos={produtos} />
    </>
  );
}
