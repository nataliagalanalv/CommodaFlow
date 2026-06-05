import { signOut } from 'firebase/auth';
import { useAuthStore } from '../../store/authStore';
import { User } from '../../types';

/**
 * Tests unitarios del store de autenticación.
 * Verifican el ciclo de sesión: setAuth, updateUser, logout y el flag isHydrated.
 *
 * `firebase/auth` está mockeado en jest.setup.js, así que `logout` no toca
 * el Firebase real pero sí podemos verificar que lo invoca.
 */

const USER: User = { id: 'uid-123', name: 'Ana', email: 'ana@test.com', role: 'USER' };

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
    jest.clearAllMocks();
  });

  it('setAuth establece usuario, token y marca como autenticado', () => {
    useAuthStore.getState().setAuth(USER, 'token-abc');
    const state = useAuthStore.getState();
    expect(state.user).toEqual(USER);
    expect(state.token).toBe('token-abc');
    expect(state.isAuthenticated).toBe(true);
  });

  it('updateUser actualiza el usuario sin tocar el token', () => {
    useAuthStore.getState().setAuth(USER, 'token-abc');
    useAuthStore.getState().updateUser({ ...USER, name: 'Ana María' });
    const state = useAuthStore.getState();
    expect(state.user?.name).toBe('Ana María');
    expect(state.token).toBe('token-abc'); // el token no cambia
  });

  it('logout limpia el estado y cierra sesión en Firebase', () => {
    useAuthStore.getState().setAuth(USER, 'token-abc');
    useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(signOut).toHaveBeenCalledTimes(1);
  });

  it('setHydrated marca el store como hidratado', () => {
    useAuthStore.setState({ isHydrated: false });
    useAuthStore.getState().setHydrated();
    expect(useAuthStore.getState().isHydrated).toBe(true);
  });
});
