import { authModalState } from '@/src/atoms/authModalAtom'
import { auth } from '@/src/firebase/clientApp'
import { Input, Button, Flex, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { FIREBASE_ERRORS } from '@/src/firebase/errors'

const SignUp: React.FC = () => {
  const setAuthModalState = useSetRecoilState(authModalState)
  const [signUpForm, setSignUpForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')

  const [createUserWithEmailAndPassword, user, loading, userError] =
    useCreateUserWithEmailAndPassword(auth)

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (error) {
      setError('')
    }
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    createUserWithEmailAndPassword(signUpForm.email, signUpForm.password)
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  return (
    <form onSubmit={onSubmit}>
      <Input
        onChange={onChange}
        required
        name="email"
        placeholder="email"
        type="email"
        mb={2}
        fontSize="10pt"
        _placeholder={{ color: 'gray.500' }}
        _hover={{
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        _focus={{
          outline: 'none',
        }}
        bg="gray.50"
      />
      <Input
        required
        onChange={onChange}
        name="password"
        placeholder="password"
        type="password"
        mb={2}
        fontSize="10pt"
        _placeholder={{ color: 'gray.500' }}
        _hover={{
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        _focus={{
          outline: 'none',
        }}
        bg="gray.50"
      />
      <Input
        required
        onChange={onChange}
        name="confirmPassword"
        placeholder="confirm password"
        type="password"
        mb={2}
        fontSize="10pt"
        _placeholder={{ color: 'gray.500' }}
        _hover={{
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        _focus={{
          outline: 'none',
        }}
        bg="gray.50"
      />
      {
        <Text textAlign="center" color="red" fontSize="10pt">
          {error ||
            FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
        </Text>
      }
      <Button
        type="submit"
        width="100%"
        height="36px"
        my={2}
        isLoading={loading}
      >
        Sign Up
      </Button>
      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={2}>Already a redditor?</Text>
        <Text
          color="blue.500"
          fontWeight={700}
          cursor="pointer"
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: 'login',
            }))
          }
        >
          LOG IN
        </Text>
      </Flex>
    </form>
  )
}
export default SignUp
