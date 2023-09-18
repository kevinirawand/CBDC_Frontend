import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../components/iconify';


// ----------------------------------------------------------------------
async function loginUser(credentials) {
   const response = await fetch('http://localhost:1337/api/v1/auth/login', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({
         email: credentials.email,
         password: credentials.password
      })
   });

   // console.info(response.json())

   return await response.json();
}

export default function LoginForm() {
   const navigate = useNavigate();
   const [showPassword, setShowPassword] = useState(false);
   const [emailError, setEmailError] = useState()
   const [passwordError, setPasswordError] = useState()

   const [email, setEmail] = useState();
   const [password, setPassword] = useState();

   const handleSubmit = async e => {
      e.preventDefault();
      const response = await loginUser({
         email,
         password
      });

      if (response.code !== 200) {
         if (response.errors.email) {
            setEmailError(response.errors.email)
         }

         if (response.errors.password) {
            setPasswordError(response.errors.password)
         }
      } else {
         sessionStorage.setItem('token', response.data.accessToken)
         sessionStorage.setItem('userId', response.data.userId)
         sessionStorage.setItem('role', response.data.role)

         if (response.data.role === 'Central Bank') {
            navigate('/central-bank/dashboard');
         } else if (response.data.role === 'Intermediaries') {
            navigate('/intermediaries/dashboard');
         } else {
            navigate('/404');
         }
      }
   }



   return (
      <form onSubmit={handleSubmit}>
         <Stack spacing={3}>
            <TextField name="email" label="Email address" onChange={e => setEmail(e.target.value)} />
            {emailError ? <div>{emailError[0]}</div> : ''}

            <TextField
               name="password"
               label="Password"
               type={showPassword ? 'text' : 'password'}
               InputProps={{
                  endAdornment: (
                     <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                           <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                     </InputAdornment>
                  ),
               }}
               onChange={e => setPassword(e.target.value)}
            />
            {passwordError ? <div>{passwordError[0]}</div> : ''}
         </Stack>

         <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
            <Checkbox name="remember" label="Remember me" />
            <Link href="#" variant="subtitle2" underline="hover">
               Forgot password?
            </Link>
         </Stack>

         <LoadingButton fullWidth size="large" type="submit" variant="contained">
            Login
         </LoadingButton>
      </form>
   );
}
