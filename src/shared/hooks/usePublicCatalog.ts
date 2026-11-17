import { useEffect, useMemo, useState } from 'react';
import { fetchPublicCatalog, invalidatePublicCatalog } from '@/services/catalog/publicCatalog';
import type { Catalogo, Categoria, Produto } from '@/shared/types/catalog';

interface PublicCatalogState {
  loading: boolean;
  error: string | null;
  /** Somente produtos ativos. */
  produtos: Produto[];
  /** Somente categorias que possuem ao menos um produto ativo. */
  categorias: Categoria[];
  categoriaNome: (id: string) => string;
}

export function usePublicCatalog(): PublicCatalogState {
  const [catalogo, setCatalogo] = useState<Catalogo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetchPublicCatalog()
        .then((c) => alive && setCatalogo(c))
        .catch((e: Error) => alive && setError(e.message));

    // Ao voltar com o botão do navegador, a página pode ser restaurada "congelada" (bfcache)
    // com o catálogo antigo — por exemplo, depois de salvar algo no admin. Nesse caso, relê o arquivo.
    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      invalidatePublicCatalog();
      load();
    };

    load();
    window.addEventListener('pageshow', onPageShow);
    return () => {
      alive = false;
      window.removeEventListener('pageshow', onPageShow);
    };
  }, []);

  return useMemo(() => {
    const produtos = (catalogo?.produtos ?? []).filter((p) => p.ativo);
    const usadas = new Set(produtos.map((p) => p.categoria));
    const categorias = (catalogo?.categorias ?? []).filter((c) => usadas.has(c.id));
    const nomes = new Map(catalogo?.categorias.map((c) => [c.id, c.nome]));
    return {
      loading: !catalogo && !error,
      error,
      produtos,
      categorias,
      categoriaNome: (id: string) => nomes.get(id) ?? 'Outros',
    };
  }, [catalogo, error]);
}
