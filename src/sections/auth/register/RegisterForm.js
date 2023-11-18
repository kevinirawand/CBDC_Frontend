import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../components/iconify';


// ----------------------------------------------------------------------
async function registerUser(credentials) {
   const response = await fetch('http://103.13.206.208:1337/api/v1/auth/register', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({
         name: credentials.nama,
         phoneNumber: credentials.noHp,
         email: credentials.email,
         password: credentials.password,
         passwordConfirmation: credentials.passwordConfirmation
      })
   });

   return response.json();
}

export default function RegisterForm() {
   const navigate = useNavigate();
   const [showPassword, setShowPassword] = useState(false);
   const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
   const [emailError, setEmailError] = useState('')
   const [namaError, setNamaError] = useState('');
   const [noHpError, setNoHpError] = useState('');
   const [passwordError, setPasswordError] = useState('')
   const [passwordConfirmationError, setPasswordConfirmationError] = useState('');

   const [email, setEmail] = useState();
   const [nama, setNama] = useState();
   const [noHp, setNoHp] = useState();
   const [password, setPassword] = useState();
   const [passwordConfirmation, setPasswordConfirmation] = useState();

   const handleSubmit = async e => {
      e.preventDefault();

      setEmailError('');
      setNamaError('');
      setNoHpError('');
      setPasswordError('');
      setPasswordConfirmationError('');

      const response = await registerUser({
         nama,
         noHp,
         email,
         password,
         passwordConfirmation
      });

      if (response.code !== 200) {
         if (response.errors.email) {
            setEmailError(response.errors.email)
         }

         if (response.errors.nama) {
            setNamaError(response.errors.nama)
         }

         if (response.errors.no_hp) {
            setNoHpError(response.errors.no_hp)
         }

         if (response.errors.password) {
            setPasswordError(response.errors.password)
         }

         if (response.errors.passwordConfirmation) {
            setPasswordConfirmationError(response.errors.passwordConfirmation)
         }

      } else {
         navigate('/auth/login');
      }
   }



   return (
      <form onSubmit={handleSubmit}>
         <Stack spacing={3}>
            <TextField name="email" label="Email Address" onChange={e => setEmail(e.target.value)} />
            {emailError ? <div>{emailError[0]}</div> : ''}

            <TextField name="nama" label="Nama Lengkap" onChange={e => setNama(e.target.value)} />
            {namaError ? <div>{namaError[0]}</div> : ''}


            <TextField
               type="number"
               name="no_hp"
               label="Nomer HP"
               onChange={(e) => setNoHp(e.target.value)}
            />
            {noHpError ? <div>{noHpError[0]}</div> : ''}

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

            <TextField
               name="passwordConfirmation"
               label="Konfirmasi Password"
               type={showPasswordConfirmation ? 'text' : 'password'}
               InputProps={{
                  endAdornment: (
                     <InputAdornment position="end">
                        <IconButton onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)} edge="end">
                           <Iconify icon={showPasswordConfirmation ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                     </InputAdornment>
                  ),
               }}
               onChange={e => setPasswordConfirmation(e.target.value)}
            />
            {passwordConfirmationError ? <div>{passwordConfirmationError[0]}</div> : ''}
         </Stack>

         <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
            <Checkbox name="remember" label="Remember me" />
         </Stack>

         <LoadingButton fullWidth size="large" type="submit" variant="contained">
            Register
         </LoadingButton>
      </form>
   );
}
