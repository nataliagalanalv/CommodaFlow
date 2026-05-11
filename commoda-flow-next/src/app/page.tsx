import { prisma } from "../lib/prisma";

export default async function Home() {
  const users = await prisma.user.findMany();

  return (
    <main style={{ padding: '40px', fontFamily: 'system-ui' }}>
      <h1 style={{ color: '#0070f3' }}>CommodaFlow Next v1.0</h1>
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f0f9ff', 
        borderRadius: '8px',
        border: '1px solid #bae6fd',
        marginTop: '20px' 
      }}>
        <h2 style={{ color: '#0369a1', margin: 0 }}>🔌 Estado de la Base de Datos</h2>
        <p style={{ color: '#0c4a6e' }}>
          Conectado a Neon PostgreSQL: <strong>SÍ</strong>
        </p>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Datos en la tabla &apos;User&apos;:</h3>
        <pre style={{ 
          background: '#1e293b', 
          color: '#f8fafc', 
          padding: '20px', 
          borderRadius: '8px',
          overflow: 'auto'
        }}>
          {JSON.stringify(users, null, 2)}
        </pre>
      </div>
    </main>
  );
}
