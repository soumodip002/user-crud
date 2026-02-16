import { useState, useEffect, useCallback } from 'react';
import { FiZap, FiAlertTriangle } from 'react-icons/fi';
import { userFields } from './config/userFields';
import type { User, UserFormData } from './types/User';
import * as api from './services/api';
import DynamicForm from './components/DynamicForm';
import UserTable from './components/UserTable';
import Modal from './components/Modal';
import ConfirmDialog from './components/ConfirmDialog';
import ToastContainer from './components/Toast';
import type { ToastMessage } from './components/Toast';
import Loader from './components/Loader';
import './App.css';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Edit state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Delete state
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const addToast = useCallback((type: ToastMessage['type'], text: string) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, text }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load users';
      setError(message);
      addToast('error', message);
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Create
  const handleCreate = async (formData: UserFormData) => {
    try {
      setSaving(true);
      const newUser = await api.createUser(formData);
      setUsers((prev) => [...prev, newUser]);
      addToast('success', `User "${formData.firstName} ${formData.lastName}" created successfully!`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create user';
      addToast('error', message);
    } finally {
      setSaving(false);
    }
  };

  // Update
  const handleEditOpen = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (formData: UserFormData) => {
    if (!editingUser) return;
    try {
      setSaving(true);
      const updated = await api.updateUser(editingUser.id, formData);
      setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? updated : u)));
      setIsEditModalOpen(false);
      setEditingUser(null);
      addToast('success', `User "${formData.firstName} ${formData.lastName}" updated successfully!`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update user';
      addToast('error', message);
    } finally {
      setSaving(false);
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  // Delete
  const handleDeleteOpen = (user: User) => {
    setDeletingUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;
    try {
      setDeleting(true);
      await api.deleteUser(deletingUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
      setIsDeleteDialogOpen(false);
      addToast('success', `User "${deletingUser.firstName} ${deletingUser.lastName}" deleted.`);
      setDeletingUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete user';
      addToast('error', message);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeletingUser(null);
  };

  return (
    <div className="app">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <header className="app-header glass-card">
        <div className="header-content">
          <div className="header-icon">
            <FiZap />
          </div>
          <div className="header-text">
            <h1 className="app-title">User Management</h1>
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="form-section">
          <DynamicForm
            fields={userFields}
            onSubmit={handleCreate}
            loading={saving}
          />
        </section>

        <section className="table-section">
          {error && !loading ? (
            <div className="error-banner glass-card">
              <div className="error-banner-content">
                <FiAlertTriangle className="error-banner-icon" />
                <p>{error}</p>
              </div>
              <button className="btn btn-primary" onClick={fetchUsers}>
                Retry
              </button>
            </div>
          ) : loading ? (
            <Loader text="Fetching users..." />
          ) : (
            <UserTable
              users={users}
              fields={userFields}
              onEdit={handleEditOpen}
              onDelete={handleDeleteOpen}
            />
          )}
        </section>
      </main>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={handleEditCancel}>
        {editingUser && (
          <DynamicForm
            fields={userFields}
            onSubmit={handleEditSubmit}
            initialData={editingUser}
            isEditing
            loading={saving}
            onCancel={handleEditCancel}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={
          deletingUser
            ? `Are you sure you want to delete "${deletingUser.firstName} ${deletingUser.lastName}"? This action cannot be undone.`
            : 'Are you sure?'
        }
        confirmText="Delete"
        loading={deleting}
      />

      <footer className="app-footer">
        <p>Built with React + TypeScript &bull; Schema-driven architecture</p>
      </footer>
    </div>
  );
}

export default App;
