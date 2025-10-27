// src/contexts/AuthContext.tsx (Versão Limpa com sessionStorage no logout)
import { createContext, useState, useEffect, useContext, ReactNode, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getProfile, apiLoginUser } from '../services/api';
import type { UserProfile } from '../services/api';
import { toast } from 'react-toastify';

interface AuthContextType {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true); // Apenas para carregamento inicial
  const navigate = useNavigate();

  // Deriva isAuthenticated diretamente do estado 'user'
  const isAuthenticated = useMemo(() => !!user, [user]);

  useEffect(() => {
    console.log("AuthProvider Effect: Rodando verificação inicial de token...");
    const token = localStorage.getItem('token');
    if (token) {
      console.log("AuthProvider Effect: Token encontrado, definindo header e buscando perfil.");
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      getProfile()
        .then(userData => {
          console.log("AuthProvider Effect: Perfil buscado com sucesso.", userData.email);
          setUser(userData);
        })
        .catch(error => {
          console.error("AuthProvider Effect: Erro ao buscar perfil com token existente.", error);
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          setUser(null); // Garante que user é null em caso de erro
        })
        .finally(() => {
          console.log("AuthProvider Effect: Carregamento inicial finalizado.");
          setLoading(false);
        });
    } else {
      console.log("AuthProvider Effect: Nenhum token encontrado, carregamento inicial finalizado.");
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("[Login] Iniciando...");
      const { token } = await apiLoginUser(email, password);
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const userData = await getProfile();
      console.log("[Login] Perfil buscado:", userData.email);

      // --- LOGS IMPORTANTES ---
      console.log("[Login] ANTES de setUser.");
      setUser(userData);
      console.log("[Login] DEPOIS de setUser."); 
      // -----------------------

      toast.success(`Bem-vindo de volta, ${userData.name || 'usuário'}!`);
      console.log("[Login] Chamando setTimeout para navigate...");
      setTimeout(() => {
        console.log("[Login Timeout] Navegando para '/'...");
        navigate('/');
      }, 100);
    } catch (error) {
       console.error("[Login] Erro:", error);
       throw error;
    }
  };

  // --- Função Logout CORRIGIDA (Usa sessionStorage) ---
  const logout = () => {
    // --- CHAMA A TOAST PRIMEIRO ---
    console.log("AuthProvider Logout: Chamando toast.info IMEDIATAMENTE...");
    try {
      // Tenta exibir ANTES de qualquer outra coisa
      toast.info('Você foi desconectado. (Teste Imediato)');
      console.log("AuthProvider Logout: toast.info (imediato) chamado.");
    } catch (toastError) {
      console.error("AuthProvider Logout: ERRO ao chamar toast.info (imediato):", toastError);
    }
    // ---------------------------------

    console.log("AuthProvider Logout: Limpando estado e navegando...");
    setUser(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];

    // Define a flag no sessionStorage (ainda útil para LoginPage)
    try {
      sessionStorage.setItem('showLogoutToast', 'true'); // Manter para LoginPage tentar de novo
      console.log("AuthProvider Logout: Flag 'showLogoutToast' definida.");
    } catch (e) {
      console.error("AuthProvider Logout: Erro ao definir sessionStorage:", e);
    }

    // Navega imediatamente (sem state)
    console.log("AuthProvider Logout: Navegando para /login.");
    navigate('/login', { replace: true });
  };

  // Memoiza o objeto de valor para evitar re-renderizações desnecessárias
  const value = useMemo(() => ({
      user,
      setUser,
      isAuthenticated,
      login,
      logout,
      loading
  }), [user, isAuthenticated, loading]); // Dependências corretas

  console.log("AuthProvider Render: Estado Loading:", loading, " | Estado IsAuthenticated:", isAuthenticated);

  // Renderiza SEMPRE os children. O ProtectedRoute vai lidar com o estado 'loading'.
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook useAuth continua o mesmo
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) { throw new Error('useAuth deve ser usado dentro de um AuthProvider'); }
  return context;
}

