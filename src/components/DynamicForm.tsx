import React, { useState, useEffect } from 'react';
import { FiEdit, FiUserPlus } from 'react-icons/fi';
import type { FieldConfig } from '../config/userFields';
import type { UserFormData } from '../types/User';
import './DynamicForm.css';

interface DynamicFormProps {
    fields: FieldConfig[];
    onSubmit: (data: UserFormData) => void;
    initialData?: UserFormData | null;
    isEditing?: boolean;
    loading?: boolean;
    onCancel?: () => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
    fields,
    onSubmit,
    initialData,
    isEditing = false,
    loading = false,
    onCancel,
}) => {
    const buildEmptyForm = (): UserFormData => {
        const data: Record<string, string> = {};
        fields.forEach((f) => (data[f.name] = ''));
        return data as UserFormData;
    };

    const [formData, setFormData] = useState<UserFormData>(initialData ?? buildEmptyForm());
    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            setErrors({});
            setTouched({});
        } else {
            setFormData(buildEmptyForm());
            setErrors({});
            setTouched({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData]);

    const handleChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (touched[name]) {
            const field = fields.find((f) => f.name === name);
            if (field) {
                setErrors((prev) => ({ ...prev, [name]: field.validate(value) }));
            }
        }
    };

    const handleBlur = (name: string) => {
        setTouched((prev) => ({ ...prev, [name]: true }));
        const field = fields.find((f) => f.name === name);
        if (field) {
            setErrors((prev) => ({ ...prev, [name]: field.validate(formData[name] ?? '') }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string | null> = {};
        const newTouched: Record<string, boolean> = {};
        let hasError = false;

        fields.forEach((field) => {
            const err = field.validate(formData[field.name] ?? '');
            newErrors[field.name] = err;
            newTouched[field.name] = true;
            if (err) hasError = true;
        });

        setErrors(newErrors);
        setTouched(newTouched);

        if (!hasError) {
            onSubmit(formData);
            if (!isEditing) {
                setFormData(buildEmptyForm());
                setTouched({});
                setErrors({});
            }
        }
    };

    return (
        <form className="dynamic-form glass-card" onSubmit={handleSubmit} noValidate>
            <h2 className="form-title">
                {isEditing ? (
                    <><FiEdit className="form-title-icon" /> Edit User</>
                ) : (
                    <><FiUserPlus className="form-title-icon" /> Add New User</>
                )}
            </h2>
            <div className="form-grid">
                {fields.map((field) => (
                    <div className={`form-group ${errors[field.name] && touched[field.name] ? 'has-error' : ''}`} key={field.name}>
                        <label htmlFor={field.name}>
                            {field.label}
                            {field.required && <span className="required-star">*</span>}
                        </label>
                        <input
                            id={field.name}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={formData[field.name] ?? ''}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            onBlur={() => handleBlur(field.name)}
                            disabled={loading}
                            autoComplete="off"
                        />
                        {errors[field.name] && touched[field.name] && (
                            <span className="error-text">{errors[field.name]}</span>
                        )}
                    </div>
                ))}
            </div>
            <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : isEditing ? 'Update User' : 'Add User'}
                </button>
                {isEditing && onCancel && (
                    <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={loading}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default DynamicForm;
