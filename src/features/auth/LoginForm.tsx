import { Formik, Form, type FormikHelpers } from "formik";
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";
import { loginSchema } from "../../utils/validationSchema";
import { useAuthStore } from '../../stores/authStore'
import type { LoginCredentials } from '../../types/global'
import AuthLayout from "../../components/layout/AuthLayout";
import { EyeIcon, EyeOffIcon } from "../../utils/icons";

const LoginForm = () => {
  const navigate = useNavigate()
  const loginUser = useAuthStore((state) => state.login)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const initialValues: LoginCredentials = {
    username: "",
    password: "",
  };

  const handleLogin = async (
    values: LoginCredentials,
    { setSubmitting, resetForm }: FormikHelpers<LoginCredentials>,
  ) => {
    setLoginError(null)
    try {
      await loginUser(values)
      resetForm();
      navigate('/dashboard')
    } catch (error: unknown) {
      setLoginError(error instanceof Error ? error.message : 'Login failed. Please try again.')
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-dvh bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex min-h-dvh items-center justify-center px-5 py-8 sm:px-8">
        <section className="w-full">
          <div className="mx-auto w-full max-w-md">
            <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <AuthLayout/>
              <Formik
                initialValues={initialValues}
                validationSchema={loginSchema}
                onSubmit={handleLogin}
              >
                {({ isSubmitting, handleChange, values, errors, touched }) => (
                  <Form className="space-y-5">
                    {loginError && (
                      <div
                        className="flex min-h-16 items-center rounded-[14px] border border-[#ff3f73] bg-[#fff6f9] px-5 py-4 text-base font-medium text-[#ff245d] dark:border-rose-500/80 dark:bg-rose-950/40 dark:text-rose-200"
                        role="alert"
                        aria-live="assertive"
                      >
                        {loginError}
                      </div>
                    )}

                    <InputField
                      id="username"
                      name="username"
                      value={values.username}
                      onChange={(event) => {
                        if (loginError) setLoginError(null)
                        handleChange(event)
                      }}
                      type="text"
                      label="Username"
                      error={
                        errors.username && touched.username ? errors.username : null
                      }
                      autoComplete="username"
                      className="min-h-11 rounded-lg"
                    />

                    <InputField
                      id="password"
                      name="password"
                      value={values.password}
                      onChange={(event) => {
                        if (loginError) setLoginError(null)
                        handleChange(event)
                      }}
                      type={isPasswordVisible ? 'text' : 'password'}
                      label="Password"
                      error={
                        errors.password && touched.password ? errors.password : null
                      }
                      autoComplete="current-password"
                      className="min-h-11 rounded-lg"
                      endAdornment={
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                          onClick={() => setIsPasswordVisible((isVisible) => !isVisible)}
                          aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                          aria-pressed={isPasswordVisible}
                        >
                          {isPasswordVisible ? (
                            <EyeOffIcon aria-hidden="true" className="h-5 w-5" />
                          ) : (
                            <EyeIcon aria-hidden="true" className="h-5 w-5" />
                          )}
                        </button>
                      }
                    />

                    <Button type="submit" size="lg" fullWidth isLoading={isSubmitting} loadingText="Signing in">
                      Sign in
                    </Button>
                  </Form>
                )}
              </Formik>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginForm;
