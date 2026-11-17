import { site } from '@/config/site';
import { publicUrl } from '@/shared/utils/assets';
import styles from './Logo.module.css';

/**
 * Marca do site. Enquanto `site.logo` for null, exibe a marca em texto (octógono + "Caixas para Pizza BH").
 * Para usar uma logo em imagem, salve-a em public/img/site/ e aponte `site.logo` para ela.
 */
export function Logo({ inverted = false }: { inverted?: boolean }) {
  if (site.logo) {
    return <img src={publicUrl(site.logo)} alt={site.nome} className={styles.image} data-inverted={inverted} />;
  }

  return (
    <span className={styles.logo} data-inverted={inverted}>
      <svg viewBox="0 0 40 40" className={styles.mark} aria-hidden>
        <path d="M13.4 2h13.2L38 13.4v13.2L26.6 38H13.4L2 26.6V13.4z" fill="var(--color-brand)" />
        <path d="M12 12.5 29 16 15.5 29z" fill="var(--color-accent)" />
        <circle cx="16" cy="17" r="1.8" fill="var(--color-brand)" />
        <circle cx="21.5" cy="18.5" r="1.6" fill="var(--color-brand)" />
        <circle cx="17" cy="22.5" r="1.6" fill="var(--color-brand)" />
      </svg>
      <span className={styles.text}>
        <span className={styles.name}>
          Caixas para Pizza <span className={styles.highlight}>BH</span>
        </span>
        <span className={styles.company}>{site.empresa}</span>
      </span>
    </span>
  );
}
