import type { User, UserFormData } from '../types/User';

const API_URL = 'https://699319588f29113acd3ff867.mockapi.io/user-crud/user-crud';

export const getUsers = async (): Promise<User[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
};

export const createUser = async (userData: UserFormData): Promise<User> => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
};

export const updateUser = async (id: string, userData: UserFormData): Promise<User> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
};

export const deleteUser = async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
};
