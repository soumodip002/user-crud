export interface FieldConfig {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    required: boolean;
    validate: (value: string) => string | null;
}

/**
 * ✨ EXTENSIBILITY: To add a new field, simply add a new object to this array.
 *    The form, table, and validation will automatically pick it up.
 *
 *    Example — adding "Date of Birth":
 *    {
 *      name: 'dob',
 *      label: 'Date of Birth',
 *      type: 'date',
 *      placeholder: '',
 *      required: false,
 *      validate: (value) => {
 *        if (value && new Date(value) > new Date()) return 'Date cannot be in the future';
 *        return null;
 *      },
 *    }
 */
export const userFields: FieldConfig[] = [
    {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        placeholder: 'Enter first name',
        required: true,
        validate: (value: string) => {
            if (!value.trim()) return 'First name is required';
            if (value.trim().length < 2) return 'Must be at least 2 characters';
            if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) return 'Only letters, spaces, hyphens and apostrophes allowed';
            return null;
        },
    },
    {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        placeholder: 'Enter last name',
        required: true,
        validate: (value: string) => {
            if (!value.trim()) return 'Last name is required';
            if (value.trim().length < 2) return 'Must be at least 2 characters';
            if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) return 'Only letters, spaces, hyphens and apostrophes allowed';
            return null;
        },
    },
    {
        name: 'phone',
        label: 'Phone Number',
        type: 'tel',
        placeholder: 'Enter phone number',
        required: true,
        validate: (value: string) => {
            if (!value.trim()) return 'Phone number is required';
            if (!/^\d{10}$/.test(value.replace(/[\s\-()]/g, ''))) return 'Enter a valid 10-digit phone number';
            return null;
        },
    },
    {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'Enter email address',
        required: true,
        validate: (value: string) => {
            if (!value.trim()) return 'Email is required';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Enter a valid email address';
            return null;
        },
    },
];
