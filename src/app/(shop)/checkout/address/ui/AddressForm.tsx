'use client'


import { Address, Country } from "@/interfaces";
import { useAddressStore } from "@/store";
import { useEffect } from "react";
import { deleteUserAddress, setUserAddress } from "@/actions";
import { authClient } from "@/lib/auth-client";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa6";

type FormInputs = {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    postalCode: string;
    city: string;
    country: string;
    phone: string;
    rememberAddress: boolean;
}

interface Props {
    countries: Country[];
    userStoredAddress?: Partial<Address>;
}

export const AddressForm = ({ countries, userStoredAddress = {} }: Props) => {

    const router = useRouter();

    const { handleSubmit, register, formState: { isValid }, reset } = useForm<FormInputs>({
        defaultValues: {
            ...(userStoredAddress as any),
            rememberAddress: true,
        }
    });

    const { data: session } = authClient.useSession();

    const setAdress = useAddressStore(state => state.setAdress);
    const address = useAddressStore(state => state.address);


    useEffect(() => {
        if (address.firstName) {
            reset(address);
        }
    }, [address, reset]);


    const onSubmit = async (data: FormInputs) => {


        const { rememberAddress, ...restAddress } = data;
        setAdress(data);
        if (rememberAddress) {
            await setUserAddress(restAddress, session!.user.id);
        } else {
            await deleteUserAddress(session!.user.id);
        }


        router.push('/checkout');

    };

    return (
        <form className="address-form" id="address-form" onSubmit={handleSubmit(onSubmit)}>


            <div className="address-form__field">
                <span className="address-form__label">Nombres</span>
                <input type="text" className="address-form__input" {...register('firstName', { required: true })} />
            </div>

            <div className="address-form__field">
                <span className="address-form__label">Apellidos</span>
                <input type="text" className="address-form__input" {...register('lastName', { required: true })} />
            </div>

            <div className="address-form__field">
                <span className="address-form__label">Dirección</span>
                <input type="text" className="address-form__input" {...register('address', { required: true })} />
            </div>

            <div className="address-form__field">
                <span className="address-form__label">Dirección 2 (opcional)</span>
                <input type="text" className="address-form__input" {...register('address2')} />
            </div>


            <div className="address-form__field">
                <span className="address-form__label">Código postal</span>
                <input type="text" className="address-form__input" {...register('postalCode', { required: true })} />
            </div>

            <div className="address-form__field">
                <span className="address-form__label">Ciudad</span>
                <input type="text" className="address-form__input" {...register('city', { required: true })} />
            </div>

            <div className="address-form__field">
                <span className="address-form__label">País</span>
                <select className="address-form__input" {...register('country', { required: true })}>
                    <option value="">[ Seleccione ]</option>
                    {
                        countries.map(country => (
                            <option key={country.id} value={country.id}>{country.name}</option>
                        ))
                    }
                </select>
            </div>

            <div className="address-form__field">
                <span className="address-form__label">Teléfono</span>
                <input type="text" className="address-form__input" {...register('phone', { required: true })} />
            </div>



            <div className="address-form__field sm:mt-1">

                <div className="address-form__checkbox-wrapper">
                    <label
                        className="address-form__checkbox-label"
                        htmlFor="checkbox"
                        data-ripple-dark="true"
                    >
                        <input
                            type="checkbox"
                            className="peer address-form__checkbox"
                            id="checkbox"
                            {...register('rememberAddress')}
                        />
                        <div className="address-form__checkbox-icon">
                            <FaCheck size={16} />
                        </div>
                    </label>
                    <span>¿Recordar dirección?</span>
                </div>

                <button
                    disabled={!isValid}
                    // href='/checkout'
                    type="submit"
                    className={clsx({
                        'btn-primary': isValid,
                        'btn-disabled': !isValid,
                    })}
                >
                    Siguiente
                </button>
            </div>


        </form>
    )
}
