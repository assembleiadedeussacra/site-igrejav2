import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-9xl font-bold text-[var(--color-accent)] opacity-20">404</h1>
        </div>
        
        <h2 className="text-3xl font-bold text-[var(--color-accent)] mb-4">
          Página não encontrada
        </h2>
        
        <p className="text-[var(--color-text-secondary)] mb-6 text-lg">
          A página que você está procurando não existe ou foi movida.
        </p>
        
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[var(--color-accent)] text-white rounded-[10px] hover:bg-[var(--color-accent-light)] transition-colors font-semibold"
        >
          Voltar para Home
        </Link>
      </div>
    </div>
  );
}
