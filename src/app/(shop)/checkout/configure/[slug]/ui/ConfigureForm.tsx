'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store";
import type { Product, FormField, SiteConfig, CartProduct, TemplateType } from "@/interfaces";

// ============================================
// CAMPOS DE FORMULARIO POR TIPO DE TEMPLATE
// ============================================

const commonFormFields: FormField[] = [
    {
        name: 'siteName',
        label: 'Nombre del sitio',
        type: 'text',
        required: true,
        placeholder: 'Mi Empresa S.L.',
        description: 'El nombre que aparecerá en el título y header de tu web'
    },
    {
        name: 'siteDescription',
        label: 'Descripción del sitio',
        type: 'textarea',
        required: true,
        placeholder: 'Descripción breve de tu negocio o proyecto...',
        description: 'Descripción para SEO y metadatos'
    },
    {
        name: 'primaryColor',
        label: 'Color principal',
        type: 'color',
        required: false,
        defaultValue: '#3B82F6',
        description: 'Color principal de tu marca'
    },
    {
        name: 'secondaryColor',
        label: 'Color secundario',
        type: 'color',
        required: false,
        defaultValue: '#1E40AF',
        description: 'Color secundario'
    },
    {
        name: 'logo',
        label: 'Logo',
        type: 'image',
        required: false,
        description: 'URL del logo de tu empresa (webp recomendado)'
    },
    {
        name: 'email',
        label: 'Email de contacto',
        type: 'email',
        required: true,
        placeholder: 'contacto@miempresa.com'
    },
    {
        name: 'phone',
        label: 'Teléfono',
        type: 'phone',
        required: false,
        placeholder: '+34 123 456 789'
    }
];

const corporateFormFields: FormField[] = [
    ...commonFormFields,
    {
        name: 'companySlogan',
        label: 'Eslogan de la empresa',
        type: 'text',
        required: false,
        placeholder: 'Eslogan llamativo de la empresa'
    },
    {
        name: 'aboutUs',
        label: 'Sobre nosotros',
        type: 'textarea',
        required: true,
        placeholder: 'Cuenta la historia de tu empresa',
        description: 'Texto para la sección "Sobre nosotros"'
    },
    {
        name: 'services',
        label: 'Servicios (separados por coma)',
        type: 'textarea',
        required: false,
        placeholder: 'Consultoría, Desarrollo, Marketing...'
    },
    {
        name: 'address',
        label: 'Dirección física',
        type: 'text',
        required: false,
        placeholder: 'Avenida de la Libertad, Elche'
    },
    {
        name: 'linkedin',
        label: 'LinkedIn',
        type: 'url',
        required: false,
        placeholder: 'https://linkedin.com/company/miempresa'
    },
    {
        name: 'twitter',
        label: 'Twitter/X',
        type: 'url',
        required: false,
        placeholder: 'https://twitter.com/miempresa'
    }
];

const portfolioFormFields: FormField[] = [
    ...commonFormFields,
    {
        name: 'fullName',
        label: 'Nombre completo',
        type: 'text',
        required: true,
        placeholder: 'Diego Martinez'
    },
    {
        name: 'profession',
        label: 'Profesión',
        type: 'text',
        required: true,
        placeholder: 'Diseñador UX/UI'
    },
    {
        name: 'bio',
        label: 'Biografía',
        type: 'textarea',
        required: true,
        placeholder: 'Cuéntanos sobre ti y tu experiencia'
    },
    {
        name: 'skills',
        label: 'Habilidades (separadas por coma)',
        type: 'textarea',
        required: false,
        placeholder: 'Figma, Photoshop, HTML, CSS...'
    },
    {
        name: 'github',
        label: 'GitHub',
        type: 'url',
        required: false,
        placeholder: 'https://github.com/usuario'
    },
    {
        name: 'linkedin',
        label: 'LinkedIn',
        type: 'url',
        required: false,
        placeholder: 'https://linkedin.com/in/usuario'
    },
    {
        name: 'cvUrl',
        label: 'URL del CV (PDF)',
        type: 'url',
        required: false,
        placeholder: 'https://ejemplo.com/mi-cv.pdf'
    }
];

/**
 * Devuelve los campos de formulario según el tipo de template
 */
const getFormFieldsByType = (templateType: TemplateType): FormField[] => {
    switch (templateType) {
        case 'corporate':
            return corporateFormFields;
        case 'portfolio':
            return portfolioFormFields;
        default:
            return commonFormFields;
    }
};

// Campos que pertenecen a la estructura base de SiteConfig
const BASE_SITE_CONFIG_FIELDS = ['siteName', 'siteDescription', 'primaryColor', 'secondaryColor', 'logo', 'email', 'phone', 'address'];
const SOCIAL_FIELDS = ['twitter', 'linkedin', 'github'];

// ============================================
// COMPONENTE
// ============================================

interface Props {
    product: Product;
}

export const ConfigureForm = ({ product }: Props) => {
    const router = useRouter();
    const addProductToCart = useCartStore(state => state.addProductToCart);

    // Obtener campos según el tipo de template
    const formFields = getFormFieldsByType(product.templateType);

    // Estado inicial basado en los campos del formulario
    const getInitialValues = (): Record<string, string> => {
        const values: Record<string, string> = {};
        formFields.forEach((field) => {
            values[field.name] = field.defaultValue || '';
        });
        return values;
    };

    const [formValues, setFormValues] = useState<Record<string, string>>(getInitialValues);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (name: string, value: string) => {
        setFormValues(prev => ({ ...prev, [name]: value }));
        // Limpiar error al escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        formFields.forEach((field) => {
            if (field.required && !formValues[field.name]?.trim()) {
                newErrors[field.name] = `${field.label} es obligatorio`;
            }

            // Validación de email
            if (field.type === 'email' && formValues[field.name]) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formValues[field.name])) {
                    newErrors[field.name] = 'Email no válido';
                }
            }

            // Validación de URL
            if (field.type === 'url' && formValues[field.name]) {
                try {
                    new URL(formValues[field.name]);
                } catch {
                    newErrors[field.name] = 'URL no válida';
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Construir SiteConfig dinámicamente desde formValues
        const siteConfig: SiteConfig = {
            siteName: formValues.siteName || product.title,
        };

        // Añadir campos base
        BASE_SITE_CONFIG_FIELDS.forEach(fieldName => {
            if (formValues[fieldName]) {
                siteConfig[fieldName] = formValues[fieldName];
            }
        });

        // Añadir redes sociales
        const socialLinks: Record<string, string> = {};
        SOCIAL_FIELDS.forEach(fieldName => {
            if (formValues[fieldName]) {
                socialLinks[fieldName] = formValues[fieldName];
            }
        });
        if (Object.keys(socialLinks).length > 0) {
            siteConfig.socialLinks = socialLinks;
        }

        // Añadir campos específicos del template (los que no son base ni sociales)
        formFields.forEach((field) => {
            if (!BASE_SITE_CONFIG_FIELDS.includes(field.name) && !SOCIAL_FIELDS.includes(field.name)) {
                if (formValues[field.name]) {
                    siteConfig[field.name] = formValues[field.name];
                }
            }
        });

        // Crear producto para el carrito
        const cartProduct: CartProduct = {
            id: product.id,
            slug: product.slug,
            title: product.title,
            price: product.price,
            quantity: 1,
            templateType: product.templateType,
            image: product.images[0] || '',
            siteConfig,
        };

        addProductToCart(cartProduct);
        router.push('/cart');
    };

    const renderField = (field: FormField) => {
        const baseClasses = "configure-form__input";
        const errorClasses = errors[field.name] ? "configure-form__input--error" : "configure-form__input--default";

        switch (field.type) {
            case 'textarea':
                return (
                    <textarea
                        id={field.name}
                        name={field.name}
                        value={formValues[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        rows={4}
                        className={`${baseClasses} ${errorClasses}`}
                    />
                );

            case 'color':
                return (
                    <div className="configure-form__color-wrapper">
                        <input
                            type="color"
                            id={field.name}
                            name={field.name}
                            value={formValues[field.name] || field.defaultValue || '#000000'}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            className="configure-form__color-picker"
                        />
                        <input
                            type="text"
                            value={formValues[field.name] || field.defaultValue || ''}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            placeholder="#000000"
                            className={`flex-1 ${baseClasses} ${errorClasses}`}
                        />
                    </div>
                );

            case 'image':
                return (
                    <input
                        type="url"
                        id={field.name}
                        name={field.name}
                        value={formValues[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        placeholder="https://ejemplo.com/logo.webp"
                        className={`${baseClasses} ${errorClasses}`}
                    />
                );

            default:
                return (
                    <input
                        type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : field.type === 'url' ? 'url' : 'text'}
                        id={field.name}
                        name={field.name}
                        value={formValues[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className={`${baseClasses} ${errorClasses}`}
                    />
                );
        }
    };

    // Agrupar campos por categoría
    const groupFields = () => {
        const groups: { [key: string]: FormField[] } = {
            'Información básica': [],
            'Branding': [],
            'Contacto': [],
            'Redes sociales': [],
            'Otros': [],
        };

        formFields.forEach((field) => {
            if (['siteName', 'siteDescription'].includes(field.name)) {
                groups['Información básica'].push(field);
            } else if (['primaryColor', 'secondaryColor', 'logo'].includes(field.name)) {
                groups['Branding'].push(field);
            } else if (['email', 'phone', 'address'].includes(field.name)) {
                groups['Contacto'].push(field);
            } else if (['twitter', 'linkedin', 'github'].includes(field.name)) {
                groups['Redes sociales'].push(field);
            } else {
                groups['Otros'].push(field);
            }
        });

        return groups;
    };

    const fieldGroups = groupFields();

    return (
        <form onSubmit={handleSubmit} className="configure-form">
            {Object.entries(fieldGroups).map(([groupName, fields]) => {
                if (fields.length === 0) return null;

                return (
                    <div key={groupName} className="configure-form__section">
                        <h3 className="configure-form__section-title">{groupName}</h3>
                        <div className="configure-form__fields">
                            {fields.map((field) => (
                                <div key={field.name} className={field.type === 'textarea' ? 'configure-form__field--full' : ''}>
                                    <label htmlFor={field.name} className="configure-form__label">
                                        {field.label}
                                        {field.required && <span className="configure-form__required">*</span>}
                                    </label>
                                    {renderField(field)}
                                    {field.description && (
                                        <p className="configure-form__description">{field.description}</p>
                                    )}
                                    {errors[field.name] && (
                                        <p className="configure-form__error">{errors[field.name]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

            <div className="configure-form__actions">
                <button type="button" onClick={() => router.back()} className="configure-form__btn-cancel">Cancelar</button>
                <button type="submit" className="configure-form__btn-submit">Añadir al carrito</button>
            </div>
        </form>
    );
};
