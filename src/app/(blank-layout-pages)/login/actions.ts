'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

export type EmailAuthState = {
  success: boolean
  errors?: {
    general?: string
    email?: string[]
    password?: string[]
    confirmPassword?: string[]
  }
  message?: string
  values?: {
    email?: string | FormDataEntryValue | null
    password?: string | FormDataEntryValue | null
    confirmPassword?: string | FormDataEntryValue | null
  }
}

const EmailSignInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' })
})

const EmailSignUpSchema = EmailSignInSchema.extend({
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword']
})

export async function signInWithDevStreamId() {
  const supabase = await createClient()

  const { data } = await supabase.auth.signInWithOAuth({
    provider: 'keycloak',
    options: {
      scopes: 'openid',
      redirectTo: process.env.REDIRECT_URI_CALLBACK
    }
  })

  if (data.url) {
    return redirect(data.url)
  }
}

export async function signInWithEmail(prevState: EmailAuthState, formData: FormData): Promise<EmailAuthState> {
  const supabase = await createClient()

  // Validate form data
  const fields = {
    email: formData.get('email'),
    password: formData.get('password')
  }
  const validatedFields = EmailSignInSchema.safeParse(fields)

  if (!validatedFields.success) {
    return { success: false, errors: validatedFields.error.flatten().fieldErrors, values: fields }
  }

  // Authenticate with Supabase
  const { error } = await supabase.auth.signInWithPassword(validatedFields.data)

  if (error) {
    console.error(error)
    return { success: false, errors: { general: error.message }, values: validatedFields.data }
  }

  revalidatePath('/', 'layout')
  return { success: true, message: 'Login successful!' }
}

export async function signUpWithEmail(prevState: EmailAuthState, formData: FormData): Promise<EmailAuthState> {
  const supabase = await createClient()

  // Validate form data
  const fields = {
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirm-password')
  }
  const validatedFields = EmailSignUpSchema.safeParse(fields)

  if (!validatedFields.success) {
    return { success: false, errors: validatedFields.error.flatten().fieldErrors, values: fields }
  }

  // Attempt sign up
  const { error } = await supabase.auth.signUp({
    email: validatedFields.data.email,
    password: validatedFields.data.password
  })

  if (error) {
    console.error(error)
    return { success: false, errors: { general: error.message }, values: validatedFields.data }
  }

  revalidatePath('/', 'layout')
  return { success: true, message: 'Sign-up successful! Check your email to verify your account.' }
}
