// src/pages/ProfilePage.tsx

import { useState, useEffect } from 'react';
import { getProfile } from '../services/api';
import { toast } from 'react-toastify';

// Vamos criar um tipo para os dados do perfil para usar no estado
interface UserProfile {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        toast.error('Não foi possível carregar os dados do perfil.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // O array vazio garante que isso rode apenas uma vez

  // Formata a data para um formato mais legível
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return <h1>Carregando perfil...</h1>; // Podemos adicionar um Skeleton aqui depois
  }

  if (!profile) {
    return <h1>Não foi possível carregar o perfil.</h1>;
  }

  return (
    <div className="profile-page">
      <h1>Meu Perfil</h1>
      <div className="profile-card">
        <div className="profile-info">
          <strong>Nome:</strong>
          <span>{profile.name}</span>
        </div>
        <div className="profile-info">
          <strong>Email:</strong>
          <span>{profile.email}</span>
        </div>
        <div className="profile-info">
          <strong>Membro desde:</strong>
          <span>{formatDate(profile.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}