import { prisma } from "../lib/prisma";

export default async function Home() {
  // Intentamos obtener los usuarios de la base de datos de Neon
  // Si la tabla está vacía, mostrará []
  const users = await prisma.user.findMany();

  return (
    <main style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', lineHeight: '1.6' }}>
      <h1 style={{ color: '#0070f3', fontSize: '2.5rem', marginBottom: '10px' }}>
        CommodaFlow Next
      </h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Prueba de conexión Fullstack: Next.js + Prisma + Neon PostgreSQL
      </p>
      
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#ecfdf5', 
        borderRadius: '12px',
        border: '1px solid #10b981',
        marginBottom: '30px' 
      }}>
        <h2 style={{ color: '#065f46', margin: 0, display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '10px' }}>🔌</span> 
          Estado de la Base de Datos
        </h2>
        <p style={{ color: '#065f46', fontWeight: 'bold', marginTop: '10px' }}>
          Conexión con Neon: <span style={{ textDecoration: 'underline' }}>ACTIVA</span>
        </p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3 style={{ marginBottom: '10px' }}>
          Datos en la tabla &apos;User&apos;:
        </h3>
        <pre style={{ 
          background: '#1e293b', 
          color: '#f8fafc', 
          padding: '20px', 
          borderRadius: '8px',
          overflowX: 'auto',
          fontSize: '0.9rem',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }}>
          {JSON.stringify(users, null, 2)}
        </pre>
      </div>

      <footer style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '20px', color: '#999', fontSize: '0.8rem' }}>
        &copy; 2026 CommodaFlow - Entorno de Desarrollo Next.js
      </footer>
    </main>
  );
}