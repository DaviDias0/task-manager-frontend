// src/pages/PostsPage.tsx (Completo com Edição)
import React, { useState, useEffect } from 'react';
// Certifique-se de importar updatePost da API
import { getPosts, createPost, deletePost, updatePost } from '../services/api';
import type { Post } from '../services/api'; // Importa a interface Post
import { useAuth } from '../contexts/AuthContext'; // Para verificar o autor
import { toast } from 'react-toastify';
import './PostsPage.css'; // Importa o CSS

// Função para formatar data
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

export function PostsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para novo post
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Estados para Edição ---
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [isUpdating, setIsUpdating] = useState(false); // Loading para salvar edição
  // ---------------------------

  // Busca posts ao montar
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      setError('Falha ao carregar postagens.');
      toast.error('Não foi possível carregar as postagens.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler para criar post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast.warn('Por favor, preencha o título e o conteúdo.');
      return;
    }
    setIsSubmitting(true);
    try {
      const newPost = await createPost(newPostTitle, newPostContent);
      setPosts([newPost, ...posts]); // Adiciona no início
      setNewPostTitle('');
      setNewPostContent('');
      toast.success('Postagem criada com sucesso!');
    } catch (err) {
      toast.error('Falha ao criar postagem.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler para deletar post
  const handleDeletePost = async (postId: number) => {
    if (!window.confirm('Tem certeza que deseja deletar esta postagem?')) return;

    const originalPosts = [...posts];
    setPosts(posts.filter(post => post.id !== postId)); // UI Otimista

    try {
      await deletePost(postId);
      toast.success('Postagem deletada com sucesso!');
    } catch (err: any) {
      setPosts(originalPosts); // Rollback
      toast.error(err.response?.data?.message || 'Falha ao deletar postagem.');
      console.error(err);
    }
  };

  // --- Funções para Edição ---

  const handleEditClick = (post: Post) => {
    setEditingPostId(post.id);
    setEditedTitle(post.title);
    setEditedContent(post.content);
  };

  const handleCancelEdit = () => {
    setEditingPostId(null); // Sai do modo de edição, limpando os estados temporários
  };

  const handleSaveEdit = async (postId: number) => {
    if (!editedTitle.trim() || !editedContent.trim()) {
      toast.warn('Título e conteúdo não podem ficar em branco.');
      return;
    }
    setIsUpdating(true);
    try {
      // Chama a API para atualizar
      const updatedPost = await updatePost(postId, editedTitle, editedContent);

      // Atualiza a lista local com o post modificado
      setPosts(posts.map(p => (p.id === postId ? updatedPost : p)));

      setEditingPostId(null); // Sai do modo de edição
      toast.success('Postagem atualizada com sucesso!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Falha ao atualizar postagem.');
      console.error(err);
      // Não sai do modo de edição em caso de erro, para o usuário tentar de novo
    } finally {
      setIsUpdating(false);
    }
  };
  // ---------------------------

  return (
    <div className="posts-page">
      <h1>Notícias e Postagens</h1>

      {/* Formulário para Nova Postagem */}
      <form onSubmit={handleCreatePost} className="add-post-form">
        <h3>Criar Nova Postagem</h3>
        <div className="form-group-post">
          <label htmlFor="postTitle">Título</label>
          <input
            id="postTitle" type="text" value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            placeholder="Título da postagem" disabled={isSubmitting} required
          />
        </div>
        <div className="form-group-post">
          <label htmlFor="postContent">Conteúdo</label>
          <textarea
            id="postContent" value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Escreva sua postagem aqui..." rows={4}
            disabled={isSubmitting} required
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Publicando...' : 'Publicar'}
        </button>
      </form>

      {/* Lista de Postagens */}
      <div className="posts-list">
        <h2>Postagens Recentes</h2>
        {isLoading && <p>Carregando postagens...</p>}
        {error && <p className="error-message">{error}</p>}
        {!isLoading && !error && posts.length === 0 && <p>Nenhuma postagem encontrada.</p>}

        {/* Mapeamento com Renderização Condicional para Edição */}
        {!isLoading && !error && posts.map(post => (
          <div key={post.id} className="post-card">
            {editingPostId === post.id ? (
              // --- MODO DE EDIÇÃO ---
              <div className="edit-post-form"> {/* Usa classes CSS adicionadas */}
                <div className="form-group-post"> {/* Reutiliza grupo de formulário */}
                   <label htmlFor={`edit-title-${post.id}`}>Título</label>
                   <input
                     id={`edit-title-${post.id}`}
                     type="text"
                     value={editedTitle}
                     onChange={(e) => setEditedTitle(e.target.value)}
                     disabled={isUpdating}
                   />
                </div>
                 <div className="form-group-post">
                    <label htmlFor={`edit-content-${post.id}`}>Conteúdo</label>
                    <textarea
                      id={`edit-content-${post.id}`}
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      rows={5} // Um pouco maior na edição
                      disabled={isUpdating}
                    />
                 </div>
                <div className="post-actions"> {/* Container para botões */}
                  <button onClick={() => handleSaveEdit(post.id)} disabled={isUpdating} className="save-button">
                    {isUpdating ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button onClick={handleCancelEdit} disabled={isUpdating}>Cancelar</button>
                </div>
              </div>
            ) : (
              // --- MODO DE VISUALIZAÇÃO (NORMAL) ---
              <>
                <h3>{post.title}</h3>
                <p className="post-meta">
                  Por: {post.author.name || 'Usuário Desconhecido'} em {formatDate(post.createdAt)}
                </p>
                {/* Renderiza quebras de linha do conteúdo */}
                <p className="post-content" style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>

                {/* Botões de Ação (só aparecem para o autor) */}
                {user?.id === post.authorId && (
                  <div className="post-actions">
                    <button onClick={() => handleEditClick(post)}>Editar</button>
                    {/* Botão deletar continua o mesmo */}
                    <button onClick={() => handleDeletePost(post.id)} className="delete-button">Deletar</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}