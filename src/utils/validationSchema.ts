import * as Yup from 'yup'

export const loginSchema = Yup.object({
  username: Yup.string()
    .trim()
    .required('Username is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
})
