'use client';

import { createUpdateProduct, deleteProductImage } from "@/actions";
import { ProductImage } from "@/components";
import { Category, Product, ProductImage as ProductWithImage, TemplateType } from "@/interfaces";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";


interface Props {
    product: Partial<Product> & { ProductImage?: ProductWithImage[] };
    categories: Category[];
}

const templateTypes: TemplateType[] = ['corporate', 'portfolio'];

interface FormInputs {
    title: string;
    slug: string;
    description: string;
    price: number;
    tags: string;
    templateType: TemplateType;
    categoryId: string;
    features: string;
    images?: FileList;
}

export const ProductForm = ({ product, categories }: Props) => {

    const router = useRouter();

    const {
        handleSubmit, register, formState: { isValid }
    } = useForm<FormInputs>({
        defaultValues: {
            ...product,
            tags: product.tags?.join(', '),
            features: product.features?.join(', ') ?? '',
            images: undefined,
        },
    });


    const onSubmit = async (data: FormInputs) => {

        const { images, ...productToSave } = data;

        const formData = new FormData();
        if (product.id) { formData.append('id', product.id ?? '') };
        formData.append('title', productToSave.title);
        formData.append('slug', productToSave.slug);
        formData.append('description', productToSave.description);
        formData.append('price', productToSave.price.toString());
        formData.append('tags', productToSave.tags);
        formData.append('templateType', productToSave.templateType);
        formData.append('categoryId', productToSave.categoryId);
        formData.append('features', productToSave.features);

        if (images) {
            for (let i = 0; i < images.length; i++) {
                formData.append('images', images[i]);
            }
        }

        const { ok, product: updatedProduct } = await createUpdateProduct(formData);

        if (!ok) {
            alert('Error al guardar el producto');
            return;
        }

        router.replace(`/admin/product/${updatedProduct?.slug}`);
    };


    return (
        <form className="product-form" onSubmit={handleSubmit(onSubmit)}>
            {/* Textos */}
            <div className="product-form__column">
                <div className="address-form__field">
                    <span className="address-form__label">Título</span>
                    <input type="text" className="address-form__input" {...register('title', { required: true })} />
                </div>

                <div className="address-form__field">
                    <span className="address-form__label">Slug</span>
                    <input type="text" className="address-form__input" {...register('slug', { required: true })} />
                </div>

                <div className="address-form__field">
                    <span className="address-form__label">Descripción</span>
                    <textarea
                        rows={5}
                        className="address-form__input" {...register('description', { required: true })}
                    ></textarea>
                </div>

                <div className="address-form__field">
                    <span className="address-form__label">Precio (€)</span>
                    <input type="number" className="address-form__input" {...register('price', { required: true, min: 0 })} />
                </div>

                <div className="address-form__field">
                    <span className="address-form__label">Tags (separados por coma)</span>
                    <input type="text" className="address-form__input" {...register('tags', { required: true })} />
                </div>

                <div className="address-form__field">
                    <span className="address-form__label">Tipo de plantilla</span>
                    <select className="address-form__input" {...register('templateType', { required: true })}>
                        <option value="">[Seleccione]</option>
                        {templateTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="address-form__field">
                    <span className="address-form__label">Categoría</span>
                    <select className="address-form__input" {...register('categoryId', { required: true })}>
                        <option value="">[Seleccione]</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>

                <button className="btn-primary w-full" >
                    Guardar
                </button>
            </div>

            {/* Campos específicos de plantillas web */}
            <div className="product-form__column">

                <div className="address-form__field">
                    <span className="address-form__label">Características (separadas por coma)</span>
                    <textarea
                        rows={3}
                        className="address-form__input"
                        {...register('features')}
                        placeholder="Responsive, SEO optimizado, Formulario de contacto..."
                    ></textarea>
                </div>



                <div className="address-form__field">

                    <span className="address-form__label">Imágenes de la plantilla</span>
                    <input
                        type="file" multiple {...register('images')}
                        className="address-form__input"
                        accept="image/png, image/jpeg, image/jpg, image/webp, image/avif"
                    />

                </div>

                <div className="product-form__images">
                    {
                        product.ProductImage?.map(image => (

                            <div key={image.id}>

                                <ProductImage alt={product.title ?? ''} src={image.url} width={300} height={300} className="rounded-t shadow-md" />
                                <button onClick={() => deleteProductImage(image.id, image.url)} type="button" className="btn-danger w-full rounded-b-xl">Eliminar</button>

                            </div>
                        ))
                    }
                </div>

            </div>

        </form >
    );
};
