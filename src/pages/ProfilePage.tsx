// src/pages/ProfilePage.tsx (Versão Final com Upload)
import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Pega do CONTEXTO
import { updateProfilePicture } from '../services/api'; // Função da API
import { toast } from 'react-toastify'; // Para mensagens de erro/sucesso do upload

// Pega a URL base da API das variáveis de ambiente
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Função para formatar data (do seu código original)
const formatDate = (dateString: string) => {
  if (!dateString) return 'Data indisponível';
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export function ProfilePage() {
  const { user, setUser } = useAuth(); // Pega user e setUser do contexto

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast.error('Formato inválido. Use apenas JPG ou PNG.');
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // Limite de 5MB
        toast.error('Arquivo muito grande. Máximo de 5MB.');
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.warn('Nenhuma imagem selecionada.');
      return;
    }

    setIsLoadingUpload(true);
    const formData = new FormData();
    formData.append('avatar', selectedFile); // Nome esperado pelo backend

    try {
      // Chama a API de upload
      const updatedUser = await updateProfilePicture(formData);

      // ATUALIZA O CONTEXTO GLOBAL com o usuário retornado (que tem a nova URL)
      setUser(updatedUser);

      toast.success('Foto de perfil atualizada!');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      toast.error('Falha ao atualizar a foto. Tente novamente.');
      console.error("Erro no upload:", error);
    } finally {
      setIsLoadingUpload(false);
    }
  };

  // Constrói a URL da imagem (ou usa placeholder) com cache busting
  const profileImageUrl = user?.profileImageUrl
    ? `${API_URL}${user.profileImageUrl}?timestamp=${new Date().getTime()}`
    : '/default-avatar.png';

  // Se user ainda não carregou (ProtectedRoute deve cuidar disso, mas é uma segurança)
  if (!user) {
    return <h1>Carregando perfil...</h1>;
  }

  return (
    <div className="profile-page">
      <h1>Meu Perfil</h1>

      {/* --- SEÇÃO DE UPLOAD DE FOTO --- */}
      <div className="profile-picture-section"> {/* Estilos do index.css */}
        <img
          src={profileImageUrl}
          alt="Foto de Perfil"
          className="profile-avatar" // Estilos do index.css
          onError={(e) => { (e.target as HTMLImageElement).src = '/default-avatar.png'; }}
        />
        <form onSubmit={handleSubmit} className="profile-upload-form"> {/* Estilos do index.css */}
          <input
            type="file"
            accept="image/png, image/jpeg"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            aria-label="Selecionar foto de perfil"
          />
          <button
            type="button"
            onClick={handleTriggerFileInput}
            disabled={isLoadingUpload}
          >
            Escolher Foto
          </button>
          {selectedFile && (
            <button
              type="submit"
              disabled={isLoadingUpload}
            >
              {isLoadingUpload ? 'Enviando...' : `Salvar Foto`}
            </button>
          )}
        </form>
         {selectedFile && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Arquivo: {selectedFile.name}</p>}
      </div>

      {/* --- SEÇÃO DE INFORMAÇÕES --- */}
      <div className="profile-card"> {/* Estilos do index.css */}
        <div className="profile-info">
          <strong>Nome:</strong>
          <span>{user.name || 'Não informado'}</span>
        </div>
        <div className="profile-info">
          <strong>Email:</strong>
          <span>{user.email}</span>
        </div>
        <div className="profile-info">
          <strong>Role:</strong>
          <span className={`role-badge role-${user.role.toLowerCase()}`}> {/* Estilos do index.css */}
            {user.role}
          </span>
        </div>
        <div className="profile-info">
          <strong>Membro desde:</strong>
          <span>{formatDate(user.createdAt)}</span>
        </div>
        <div className="profile-info">
          <strong>Última Atualização:</strong>
          <span>{formatDate(user.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}