import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { site } from '@/config/site';
import { Button, TextInput, Toggle } from '@/shared/components';
import { IconArrowLeft, IconArrowRight, IconEye, IconEyeOff, IconFolder, IconGithub, IconShield } from '@/shared/icons';
import { Logo } from '@/features/site/layout/Logo';
import { useAdminSession } from '../session/AdminSession';
import styles from './LoginPage.module.css';

const repoConfigured = !site.github.owner.startsWith('SEU-');

export function LoginPage() {
  const { loginWithGitHub, loginLocal } = useAdminSession();
  const [token, setToken] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token.trim()) return setError('Cole o seu token de acesso.');
    setLoading(true);
    setError(null);
    try {
      await loginWithGitHub(token, remember);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  const tokenUrl =
    'https://github.com/settings/personal-access-tokens/new?' +
    new URLSearchParams({
      name: `Painel ${site.nome}`,
      description: 'Gerenciar produtos do site',
      target_name: site.github.owner,
      contents: 'write',
      expires_in: 'none',
    }).toString();

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.back}>
        <IconArrowLeft size={16} /> Voltar ao site
      </Link>

      <main className={styles.card}>
        <header className={styles.header}>
          <Logo />
          <div>
            <h1 className={styles.title}>Área administrativa</h1>
            <p className={styles.subtitle}>Cadastre e edite os produtos do catálogo.</p>
          </div>
        </header>

        {import.meta.env.DEV && (
          <>
            <section className={styles.local} aria-labelledby="local-title">
              <span className={styles.localIcon}>
                <IconFolder size={20} />
              </span>
              <div className={styles.localText}>
                <h2 id="local-title">Modo local</h2>
                <p>
                  Você está rodando o projeto no computador. As alterações são gravadas direto na pasta{' '}
                  <code>public/</code>.
                </p>
              </div>
              <Button block onClick={loginLocal} iconRight={<IconArrowRight size={18} />}>
                Entrar no modo local
              </Button>
            </section>
            <div className={styles.divider}>
              <span>ou entre com o token do GitHub</span>
            </div>
          </>
        )}

        {!repoConfigured && (
          <div className={styles.warning}>
            Configure o repositório em <code>src/config/site.ts</code> (campo <code>github</code>) antes de usar o login.
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <TextInput
            label="Token de acesso"
            type={show ? 'text' : 'password'}
            value={token}
            onChange={(v) => {
              setToken(v);
              setError(null);
            }}
            error={error}
            placeholder="github_pat_..."
            autoComplete="current-password"
            spellCheck={false}
            suffix={
              <button
                type="button"
                className={styles.reveal}
                onClick={() => setShow((v) => !v)}
                aria-label={show ? 'Ocultar token' : 'Mostrar token'}
              >
                {show ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            }
          />
          <Toggle
            label="Lembrar neste dispositivo"
            description="Desative em computadores compartilhados."
            checked={remember}
            onChange={setRemember}
          />
          <Button
            type="submit"
            size="lg"
            block
            loading={loading}
            icon={<IconGithub />}
            disabled={!repoConfigured}
            variant={import.meta.env.DEV ? 'secondary' : 'primary'}
          >
            Entrar com GitHub
          </Button>
        </form>

        <details className={styles.help}>
          <summary>Como conseguir o token?</summary>
          <ol>
            <li>
              Entre no GitHub com a conta dona do repositório <strong>{site.github.owner}/{site.github.repo}</strong>.
            </li>
            <li>
              Abra{' '}
              <a href={tokenUrl} target="_blank" rel="noopener noreferrer">
                Fine-grained tokens → Generate new token
              </a>
              .
            </li>
            <li>
              Em <em>Repository access</em>, escolha <strong>Only select repositories</strong> e marque o repositório
              do site.
            </li>
            <li>
              Em <em>Permissions → Repository permissions</em>, defina <strong>Contents: Read and write</strong>.
            </li>
            <li>Gere o token, copie e cole aqui.</li>
          </ol>
        </details>
      </main>

      <p className={styles.footnote}>
        <IconShield size={14} /> O token fica salvo só neste navegador.
      </p>
    </div>
  );
}
