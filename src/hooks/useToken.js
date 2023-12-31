import React, { useState } from 'react'


const useToken = () => {
   const [token, setToken] = useState(null)
   const saveToken = userToken => {
      localStorage.setItem('token', JSON.stringify(userToken))
      setToken(userToken.token)
   }
   return {
      setToken: saveToken,
      token
   }
}

export default useToken
