import React from 'react';
import { FiEdit2, FiTrash2, FiUsers, FiUserPlus } from 'react-icons/fi';
import type { FieldConfig } from '../config/userFields';
import type { User } from '../types/User';
import './UserTable.css';

interface UserTableProps {
    users: User[];
    fields: FieldConfig[];
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    loading?: boolean;
}

const UserTable: React.FC<UserTableProps> = ({ users, fields, onEdit, onDelete, loading }) => {
    if (loading) {
        return (
            <div className="table-container glass-card">
                <div className="table-loading">
                    <div className="table-skeleton">
                        {[1, 2, 3].map((i) => (
                            <div className="skeleton-row" key={i}>
                                {fields.map((f) => (
                                    <div className="skeleton-cell" key={f.name} />
                                ))}
                                <div className="skeleton-cell skeleton-actions" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="table-container glass-card empty-state">
                <div className="empty-icon">
                    <FiUserPlus />
                </div>
                <h3>No users yet</h3>
                <p>Add your first user using the form above</p>
            </div>
        );
    }

    return (
        <div className="table-container glass-card">
            <h2 className="table-title">
                <FiUsers className="table-title-icon" />
                Users ({users.length})
            </h2>

            {/* Desktop table */}
            <div className="table-wrapper">
                <table className="user-table">
                    <thead>
                        <tr>
                            {fields.map((field) => (
                                <th key={field.name}>{field.label}</th>
                            ))}
                            <th className="actions-header">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id} style={{ animationDelay: `${index * 0.05}s` }}>
                                {fields.map((field) => (
                                    <td key={field.name}>{user[field.name]}</td>
                                ))}
                                <td className="actions-cell">
                                    <button
                                        className="icon-btn edit-btn"
                                        onClick={() => onEdit(user)}
                                        title="Edit user"
                                        aria-label={`Edit ${user.firstName}`}
                                    >
                                        <FiEdit2 />
                                    </button>
                                    <button
                                        className="icon-btn delete-btn"
                                        onClick={() => onDelete(user)}
                                        title="Delete user"
                                        aria-label={`Delete ${user.firstName}`}
                                    >
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards */}
            <div className="mobile-cards">
                {users.map((user, index) => (
                    <div className="user-card glass-card" key={user.id} style={{ animationDelay: `${index * 0.05}s` }}>
                        <div className="card-fields">
                            {fields.map((field) => (
                                <div className="card-field" key={field.name}>
                                    <span className="card-label">{field.label}</span>
                                    <span className="card-value">{user[field.name]}</span>
                                </div>
                            ))}
                        </div>
                        <div className="card-actions">
                            <button className="icon-btn edit-btn" onClick={() => onEdit(user)} title="Edit">
                                <FiEdit2 />
                            </button>
                            <button className="icon-btn delete-btn" onClick={() => onDelete(user)} title="Delete">
                                <FiTrash2 />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserTable;
