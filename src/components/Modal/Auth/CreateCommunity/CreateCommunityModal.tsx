import { auth, firestore } from '@/src/firebase/clientApp'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Text,
  Input,
  Stack,
  Checkbox,
  Flex,
  Icon,
} from '@chakra-ui/react'
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import React, { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { BsFillEyeFill, BsFillPersonFill } from 'react-icons/bs'
import { HiLockClosed } from 'react-icons/hi'

type CreateCommunityModalProps = {
  open: boolean
  handleClose: () => void
}

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  open,
  handleClose,
}) => {
  const [user] = useAuthState(auth)
  const [communityName, setCommunityName] = useState('')
  const [charsRemaining, setCharsRemaining] = useState(21)
  const [communityType, setCommunityType] = useState('public')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 21) {
      return
    }
    setCommunityName(event.target.value)
    setCharsRemaining(21 - event.target.value.length)
  }

  const onCommunityTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCommunityType(event.target.name)
  }

  const handleCreateCommunity = async () => {
    if (error) {
      setError('')
    }
    const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/
    if (format.test(communityName) || communityName.length < 3) {
      setError(
        'Community names must be between 3 to 25 letters and can contain only letters, numbers or underscores'
      )
      return
    }
    setLoading(true)
    try {
      const communityDocRef = doc(firestore, 'communities', communityName)

      // Transaction
      await runTransaction(firestore, async (transaction) => {
        // Check if community exists in db
        const communityDoc = await transaction.get(communityDocRef)
        if (communityDoc.exists()) {
          throw new Error(
            `Sorry, 'r/${communityName}' is already taken. Try another.`
          )
        }
        // Create community
        transaction.set(communityDocRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          privacyType: communityType,
        })
        // Create community snippet on user
        transaction.set(
          doc(firestore, `users/${user?.uid}/communitySnippets`, communityName),
          {
            communityId: communityName,
            isModerator: true,
          }
        )
      })
    } catch (error: any) {
      console.log('handleCreateCommunity error', error)
      setError(error.message)
    }

    setLoading(false)
  }

  return (
    <>
      <Modal isOpen={open} onClose={handleClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            flexDirection="column"
            fontSize="15pt"
            padding={3}
          >
            Create a community
          </ModalHeader>
          <Box px={3}>
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column" py={3}>
              <Text fontSize={15} fontWeight={600}>
                Name
              </Text>
              <Text fontSize={11} color="gray.500">
                Community names including capitalization can`t be changed`
              </Text>
              <Text
                position="relative"
                top="28px"
                left="10px"
                width="20px"
                color="gray.400"
              >
                r/
              </Text>
              <Input
                position="relative"
                value={communityName}
                size="sm"
                pl="22px"
                onChange={handleChange}
              />
              <Text
                mt={1}
                fontSize="9pt"
                color={charsRemaining === 0 ? 'red' : 'gray.500'}
              >
                {charsRemaining} Characters remaining
              </Text>
              <Text color="red" fontSize="9pt" pt={1}>
                {error}
              </Text>
              <Box my={4}>
                <Text fontWeight={600} fontSize={15}>
                  Community Type
                </Text>
                <Stack spacing={2}>
                  <Checkbox
                    isChecked={communityType === 'public'}
                    name="public"
                    onChange={onCommunityTypeChange}
                  >
                    <Flex align="center">
                      <Icon as={BsFillPersonFill} color="gray.500" mr={2} />
                      <Text fontSize="10pt" mr={1}>
                        Public
                      </Text>
                      <Text fontSize="8pt" color="gray.500" pt={0.5}>
                        Anyone can view, post and comment to this community
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    isChecked={communityType === 'restricted'}
                    name="restricted"
                    onChange={onCommunityTypeChange}
                  >
                    <Flex align="center">
                      <Icon as={BsFillEyeFill} color="gray.500" mr={2} />
                      <Text fontSize="10pt" mr={1}>
                        Restricted
                      </Text>
                      <Text fontSize="8pt" color="gray.500">
                        Anyone can view, only approved users can post
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    isChecked={communityType === 'private'}
                    name="private"
                    onChange={onCommunityTypeChange}
                  >
                    <Flex align="center">
                      <Icon as={HiLockClosed} color="gray.500" mr={2} />
                      <Text fontSize="10pt" mr={1}>
                        Private
                      </Text>
                      <Text fontSize="8pt" color="gray.500">
                        Only approved users can view and post to this community
                      </Text>
                    </Flex>
                  </Checkbox>
                </Stack>
              </Box>
            </ModalBody>
          </Box>

          <ModalFooter bg="gray.100" borderRadius="0px 0px 10px 10px">
            <Button
              variant="outline"
              height="30px"
              mr={3}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              height="30px"
              onClick={handleCreateCommunity}
              isLoading={loading}
            >
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
export default CreateCommunityModal
