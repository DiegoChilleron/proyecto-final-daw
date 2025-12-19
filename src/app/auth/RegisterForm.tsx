'use client'

import { authClient } from "@/lib/auth-client"
import { clsx } from "clsx";
import Link from "next/link";
import { useState } from "react"

type FormInputs = {
    email?: string;
    name?: string;
    password?: string;
}

export const RegisterForm = (props?: FormInputs) => {

    type FormType = 'Sign Up' | 'Sign In' 

    const [showForm, setShowForm] = useState<FormType>('Sign Up')
    const [justSignedUp, setJustSignedUp] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [fieldErrors, setFieldErrors] = useState<{email?: string, password?: string, name?: string}>({})
    const { data: session } = authClient.useSession()


    // Funcion para registrar usuario
    function sendSignupReq(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (isLoading) return

        setIsLoading(true)
        setErrorMessage('')
        setFieldErrors({})
        const formData = new FormData(e.currentTarget)
        
        const email = formData.get('email') as string
        if (!email || !email.includes('@')) {
            setFieldErrors({ email: 'Correo inválido' })
            setErrorMessage('Por favor, introduce un correo válido')
            setIsLoading(false)
            return
        }
        
        authClient.signUp.email({
            email,
            name: formData.get('name') as string,
            password: formData.get('password') as string
        }, {
            onSuccess: () => {
                setJustSignedUp(true)
                setFieldErrors({})
                setTimeout(() => {
                    setJustSignedUp(false)
                    setIsLoading(false)
                }, 2000)
                window.location.replace('/');
            },
            onError: (ctx) => {
                const message = ctx.error.message || 'Error al registrar usuario'
                setErrorMessage(message)
                
                if (message.toLowerCase().includes('email')) {
                    setFieldErrors({ email: message })
                }
                setIsLoading(false)
            }
        })
    }
    // Funcion para loguear usuario
    function sendSigninReq(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (isLoading) return

        setIsLoading(true)
        setErrorMessage('')
        setFieldErrors({})
        const formData = new FormData(e.currentTarget)
        
        const email = formData.get('email') as string
        if (!email || !email.includes('@')) {
            setFieldErrors({ email: 'Correo inválido' })
            setErrorMessage('Por favor, introduce un correo válido')
            setIsLoading(false)
            return
        }
        
        authClient.signIn.email({
            email,
            password: formData.get('password') as string
        }, {
            onSuccess: () => {
                setFieldErrors({})
                setIsLoading(false)
                window.location.replace('/profile/');
            },
            onError: (ctx) => {
                const message = ctx.error.message || 'Error al iniciar sesión'
                setErrorMessage(message)
                

                if (message.toLowerCase().includes('email')) {
                    setFieldErrors({ email: message })
                } else if (message.toLowerCase().includes('password') || message.toLowerCase().includes('contraseña')) {
                    setFieldErrors({ password: message })
                }
                setIsLoading(false)
            }
        })
    }


    function drawButtton(label: FormType) {
        const labels = {
            'Sign Up': 'Registrarse',
            'Sign In': 'Iniciar sesión',
            'Sign Out': 'Cerrar sesión'
        };
        const isActive = showForm === label;
        return (
            <button 
                className={`auth__tab-button ${isActive ? 'auth__tab-button--active' : ''}`} 
                onClick={() => setShowForm(label)}
            >
                {labels[label]}
            </button>
        )
    }


    return (
        <div className="auth">
            
            <div className="auth__tabs">
                {drawButtton('Sign Up')}
                {drawButtton('Sign In')}
            </div>

            {showForm === 'Sign Up' && <>
                <h1 className="auth__title">Registrarse</h1>
                <form className="auth-form" onSubmit={sendSignupReq}>
                    <label htmlFor="signup-email" className="auth-form__label">Email:</label>
                    <input 
                        id="signup-email" 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        className={clsx("auth-form__input", {'auth-form__input--error': fieldErrors.email})} 
                        disabled={isLoading} 
                        minLength={3} 
                        required 
                    />
                    {fieldErrors.email && <span className="auth-form__error">{fieldErrors.email}</span>}
                    <label htmlFor="name" className="auth-form__label">Nombre:</label>
                    <input 
                        id="name" 
                        type="text" 
                        name="name" 
                        placeholder="Nombre" 
                        className={clsx("auth-form__input", {'auth-form__input--error': fieldErrors.name})} 
                        disabled={isLoading} 
                        required 
                    />
                    {fieldErrors.name && <span className="auth-form__error">{fieldErrors.name}</span>}
                    <label htmlFor="signup-password" className="auth-form__label">Contraseña:</label>
                    <input 
                        id="signup-password" 
                        type="password" 
                        name="password" 
                        placeholder="Contraseña" 
                        className={clsx("auth-form__input", {'auth-form__input--error': fieldErrors.password})} 
                        disabled={isLoading} 
                        minLength={6} 
                        required 
                    />
                    {fieldErrors.password && <span className="auth-form__error">{fieldErrors.password}</span>}
                    <button 
                        type="submit" 
                        className={clsx("auth-form__submit", {'auth-form__submit--loading': isLoading})} 
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>
            </>
            }

            {showForm === 'Sign In' && <>
                <h2 className="auth__title">Iniciar sesión</h2>
                <form className="auth-form" onSubmit={sendSigninReq}>
                    <label htmlFor="signin-email" className="auth-form__label">Email:</label>
                    <input 
                        id="signin-email" 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        className={clsx("auth-form__input", {'auth-form__input--error': fieldErrors.email})} 
                        disabled={isLoading} 
                        minLength={3} 
                        required 
                    />
                    {fieldErrors.email && <span className="auth-form__error">{fieldErrors.email}</span>}
                    <label htmlFor="signin-password" className="auth-form__label">Contraseña:</label>
                    <input 
                        id="signin-password" 
                        type="password" 
                        name="password" 
                        placeholder="Contraseña" 
                        className={clsx("auth-form__input", {'auth-form__input--error': fieldErrors.password})} 
                        disabled={isLoading} 
                        minLength={6} 
                        required 
                    />
                    {fieldErrors.password && <span className="auth-form__error">{fieldErrors.password}</span>}
                    <button 
                        type="submit" 
                        className={clsx("auth-form__submit", {'auth-form__submit--loading': isLoading})} 
                        disabled={isLoading}
                    >
                        {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </button>
                </form>
            </>
            }
            {justSignedUp && <p className="auth__success-message">Usuario registrado con éxito!</p>}
            <div className="auth__footer"><Link className="btn-secondary" href="/">Ir a inicio</Link></div>
        </div>
    )
}
