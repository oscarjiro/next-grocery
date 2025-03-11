'use client'

import { useActionState, useState, useTransition } from 'react'

import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { useRouter } from 'next/navigation'
import { Box, TextField } from '@mui/material'
import Typography from '@mui/material/Typography'
import Logo from '@components/layout/shared/Logo'
import { SyncOutlined } from '@mui/icons-material'
import CardContent from '@mui/material/CardContent'
import {
  EmailAuthState,
  signInWithDevStreamId,
  signInWithEmail,
  signUpWithEmail
} from '@/app/(blank-layout-pages)/login/actions'
import Link from '@/components/Link'
import { toast } from 'react-toastify'

const EmailAuth = () => {
  const { push } = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [isLoginPending, startLoginTransition] = useTransition()
  const [isSignUpPending, startSignUpTransition] = useTransition()
  const [isKeycloakPending, startKeycloakTransition] = useTransition()
  const [state, formAction] = useActionState(
    async (prevState: EmailAuthState, formData: FormData) => {
      const result = await (isLogin ? signInWithEmail(prevState, formData) : signUpWithEmail(prevState, formData))
      if (result.success) {
        push('/')
      } else if (result.errors?.general) {
        toast.error(isLogin ? 'Login' : 'Signup', {
          theme: 'colored',
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false
        })
      }
      return result
    },
    { success: false }
  )

  return (
    <div className='flex bs-full justify-center'>
      <div className='flex flex-col space-y-6 justify-center items-center bs-full !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        {/* Header */}
        <Link href='/' className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </Link>

        {/* Email Auth */}
        <div className='flex flex-col gap-4 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <Card>
            <CardContent className='flex flex-col items-center text-center gap-4'>
              {/* Header */}
              <header className='flex flex-col gap-1'>
                <Typography variant='h4'>{isLogin ? 'Welcome back!' : 'Hello there!'}</Typography>
                <Typography>{isLogin ? 'Sign in with your account' : 'Create a new account'}</Typography>
              </header>

              {/* Form */}
              <Box
                action={(formData: FormData) =>
                  isLogin
                    ? startLoginTransition(() => formAction(formData))
                    : startSignUpTransition(() => formAction(formData))
                }
                component='form'
                className='space-y-4'
              >
                {/* Email */}
                <TextField
                  label='Email'
                  name='email'
                  type='email'
                  variant='outlined'
                  fullWidth
                  error={!!state.errors?.email}
                  helperText={state.errors?.email?.[0] || ''}
                  defaultValue={state.values?.email}
                />

                {/* Password */}
                <TextField
                  label='Password'
                  name='password'
                  type='password'
                  variant='outlined'
                  fullWidth
                  error={!!state.errors?.password}
                  helperText={state.errors?.password?.[0] || ''}
                  defaultValue={state.values?.password}
                />

                {/* Confirm Password */}
                {!isLogin && (
                  <TextField
                    label='Confirm Password'
                    name='confirm-password'
                    type='password'
                    variant='outlined'
                    fullWidth
                    error={!!state.errors?.confirmPassword}
                    helperText={state.errors?.confirmPassword?.[0] || ''}
                    defaultValue={state.values?.confirmPassword}
                  />
                )}

                {/* Button */}
                <Button
                  startIcon={
                    <SyncOutlined
                      className={
                        (isLogin && isLoginPending) || (!isLogin && isSignUpPending) ? 'animate-spin' : 'hidden'
                      }
                    />
                  }
                  type='submit'
                  disabled={isLoginPending || isSignUpPending || isKeycloakPending}
                  fullWidth
                  variant='contained'
                  className='text-white'
                >
                  {isLogin
                    ? isLoginPending
                      ? 'Logging in...'
                      : 'Login'
                    : isSignUpPending
                      ? 'Signing up...'
                      : 'Sign up'}
                </Button>
              </Box>

              {/* Toggle */}
              <footer>
                <Typography variant='subtitle1'>
                  {isLogin ? (
                    <>
                      Don't have an account yet?{' '}
                      <span
                        onClick={() => setIsLogin(false)}
                        className='text-primary cursor-pointer hover:opacity-85 transition-opacity duration-150'
                      >
                        Sign up here.
                      </span>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <span
                        onClick={() => setIsLogin(true)}
                        className='text-primary cursor-pointer hover:opacity-85 transition-opacity duration-150'
                      >
                        Login here.
                      </span>
                    </>
                  )}
                </Typography>
              </footer>
            </CardContent>
          </Card>
        </div>

        {/* Keycloak Auth */}
        <Typography variant='button' className='uppercase'>
          or
        </Typography>
        <form action={() => startKeycloakTransition(signInWithDevStreamId)}>
          <Button
            startIcon={<SyncOutlined className={isKeycloakPending ? 'animate-spin' : 'hidden'} />}
            disabled={isLoginPending || isSignUpPending || isKeycloakPending}
            type='submit'
            color='secondary'
            fullWidth
            variant='contained'
            className='text-white'
          >
            Login with DevStreams-Auth
          </Button>
        </form>
      </div>
    </div>
  )
}

export default EmailAuth
