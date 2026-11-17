import type { Catalogo } from '@/shared/types/catalog';
import { publicUrl } from '@/shared/utils/assets';
import { CATALOG_PATH } from './types';

let cache: Promise<Catalogo> | null = null;

/**
 * Leitura pública do catálogo: é só um arquivo estático servido pela hospedagem.
 * Não há banco, não há limite de requisições e nada "hiberna".
 */
export function fetchPublicCatalog(): Promise<Catalogo> {
  cache ??= fetch(publicUrl(CATALOG_PATH), { cache: 'no-cache' })
    .then((res) => {
      if (!res.ok) throw new Error(`Falha ao carregar o catálogo (${res.status})`);
      return res.json() as Promise<Catalogo>;
    })
    .catch((err) => {
      cache = null;
      throw err;
    });
  return cache;
}

/** Descarta o catálogo em memória para a próxima leitura buscar o arquivo de novo (usado após salvar no admin). */
export function invalidatePublicCatalog(): void {
  cache = null;
}
