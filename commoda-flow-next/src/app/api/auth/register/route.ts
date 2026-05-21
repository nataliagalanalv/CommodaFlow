import { NextResponse } from 'next/server';
import { UserService } from '../../../../services/user.service';
import { registerSchema } from '../../../../schemas/user.schema';
import bcrypt from 'bcryptjs';
import { users } from '../../../../types/user.types'; // Asegúrate de importar el tipo User

// Definimos la intersección localmente para mantener la seguridad de tipos
type UserWithPassword = users & { password: string };

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Body recibido:', JSON.stringify(body));

    const result = registerSchema.safeParse(body);
    
    if (!result.success) {
      console.error('Zod falló:', JSON.stringify(result.error.issues));
      return NextResponse.json({ 
        message: result.error.issues[0].message,
        errors: result.error.issues  // 👈 ver en Network tab
      }, { status: 400 });
    }

    const { name, email, password } = result.data;

    // 2. Verificar si el usuario ya existe
    const existingUser = await UserService.findByEmail(email);
    if (existingUser) {
      return NextResponse.json({ message: 'El correo ya está registrado' }, { status: 400 });
    }

    // 3. Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 4. Crear usuario
    // Nota: Usamos 'user' en minúsculas porque en UserService 
    // estamos normalizando todos los roles a minúsculas.
    const newUser = await UserService.create({
      name,
      email,
      password: hashedPassword,
      role: 'USER' 
    });

    return NextResponse.json({ 
      message: 'Cuenta creada con éxito', 
      user: { id: newUser.id, name: newUser.name, email: newUser.email } 
    }, { status: 201 });

  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}