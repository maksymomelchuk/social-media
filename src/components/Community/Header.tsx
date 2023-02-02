import { Box, Button, Flex, Icon, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { FaReddit } from 'react-icons/fa'
import { Community } from '../../atoms/communitiesAtom'
import useCommunityData from '../../hooks/useCommunityData'

type HeaderProps = {
  communityData: Community
}

const Header: React.FC<HeaderProps> = ({ communityData }) => {
  const { communityStateValue, onJoinOrLeaveCommunity, loading } =
    useCommunityData()
  const isJoined = !!communityStateValue.mySnippets.find(
    (item) => item.communityId === communityData.id
  )

  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" bg="blue.400"></Box>
      <Flex justify="center" bg="white" flexGrow={1}>
        <Flex width="95%" maxWidth="860px">
          {communityData.imageURL ? (
            <Image />
          ) : (
            <Icon
              as={FaReddit}
              fontSize={64}
              position="relative"
              top={-3}
              color="blue.500"
              border="4px solid white"
              borderRadius="50%"
            />
          )}
          <Flex padding="10px 16px">
            <Flex direction="column" mr={6}>
              <Text fontWeight={800} fontSize="16pt">
                {communityData.id}
              </Text>
              <Text fontWeight={600} fontSize="10pt" color="gray.500">
                r/{communityData.id}
              </Text>
            </Flex>
            <Button
              variant={isJoined ? 'outline' : 'solid'}
              height="30px"
              px={6}
              onClick={() => onJoinOrLeaveCommunity(communityData, isJoined)}
              isLoading={loading}
            >
              {isJoined ? 'Joined' : 'Join'}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
export default Header