import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { IconWhatsApp } from '@/shared/icons';
import { whatsappLink } from '@/shared/utils/whatsapp';
import { Header } from './Header';
import { Footer } from './Footer';
import styles from './SiteLayout.module.css';

/** Rola para o topo ao trocar de página, ou para a âncora (#sobre, #contato) quando houver. */
function useScrollRestoration() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      // Não usar `return el.scrollIntoView()`: em navegadores recentes ele devolve uma Promise,
      // o React a trata como função de limpeza e a página quebra (tela branca) ao voltar.
      if (el) {
        el.scrollIntoView();
        return;
      }
      // Conteúdo ainda carregando: tenta de novo no próximo frame
      const id = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
      return () => cancelAnimationFrame(id);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
}

export function SiteLayout() {
  useScrollRestoration();

  return (
    <div className={styles.shell}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.floating}
        aria-label="Conversar no WhatsApp"
      >
        <IconWhatsApp size={28} />
      </a>
    </div>
  );
}
