import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { GitHubCatalogRepository } from '@/services/catalog/githubRepository';
import { LocalCatalogRepository } from '@/services/catalog/localRepository';
import type { CatalogRepository } from '@/services/catalog/types';

const TOKEN_KEY = 'vher.admin.token';

interface AdminSessionValue {
  repository: CatalogRepository | null;
  /** true enquanto tenta restaurar uma sessão salva. */
  restoring: boolean;
  loginWithGitHub: (token: string, remember: boolean) => Promise<void>;
  loginLocal: () => void;
  logout: () => void;
}

const AdminSessionContext = createContext<AdminSessionValue | null>(null);

function readStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function storeToken(token: string | null, remember = false) {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    if (token) (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
  } catch {
    /* navegação privada: segue só em memória */
  }
}

/** Lembra o "modo local" até fechar a aba, para não pedir login de novo ao ir e voltar do site. Só em `npm run dev`. */
const LOCAL_KEY = 'vher.admin.local';

function readLocalFlag(): boolean {
  try {
    return import.meta.env.DEV && sessionStorage.getItem(LOCAL_KEY) === '1';
  } catch {
    return false;
  }
}

function storeLocalFlag(on: boolean) {
  try {
    if (on) sessionStorage.setItem(LOCAL_KEY, '1');
    else sessionStorage.removeItem(LOCAL_KEY);
  } catch {
    /* navegação privada: segue só em memória */
  }
}

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [repository, setRepository] = useState<CatalogRepository | null>(() =>
    readLocalFlag() ? new LocalCatalogRepository() : null,
  );
  const [restoring, setRestoring] = useState(() => !!readStoredToken());

  useEffect(() => {
    const token = readStoredToken();
    if (!token) return;
    GitHubCatalogRepository.verify(token)
      .then(setRepository)
      .catch(() => storeToken(null))
      .finally(() => setRestoring(false));
  }, []);

  const loginWithGitHub = useCallback(async (token: string, remember: boolean) => {
    const repo = await GitHubCatalogRepository.verify(token.trim());
    storeToken(token.trim(), remember);
    setRepository(repo);
  }, []);

  const loginLocal = useCallback(() => {
    storeLocalFlag(true);
    setRepository(new LocalCatalogRepository());
  }, []);

  const logout = useCallback(() => {
    storeToken(null);
    storeLocalFlag(false);
    setRepository(null);
  }, []);

  const value = useMemo(
    () => ({ repository, restoring, loginWithGitHub, loginLocal, logout }),
    [repository, restoring, loginWithGitHub, loginLocal, logout],
  );

  return <AdminSessionContext.Provider value={value}>{children}</AdminSessionContext.Provider>;
}

export function useAdminSession(): AdminSessionValue {
  const ctx = useContext(AdminSessionContext);
  if (!ctx) throw new Error('useAdminSession precisa estar dentro de <AdminSessionProvider>');
  return ctx;
}
