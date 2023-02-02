import { Flex } from '@chakra-ui/react'
import React from 'react'

type PageContentProps = {
  children: any
}

const PageContent: React.FC<PageContentProps> = ({ children }) => {
  return (
    <Flex justify="center" py={4} border="1px solid red">
      <Flex
        width="95%"
        justify="center"
        maxWidth="860px"
        border="1px solid green"
      >
        <Flex
          direction="column"
          width={{ base: '100%', md: '65%' }}
          mr={{ base: 0, md: 6 }}
          border="1px solid blue"
        >
          {children && children[0 as keyof typeof children]}
        </Flex>
        <Flex
          direction="column"
          display={{ base: 'none', md: 'flex' }}
          flexGrow={1}
          border="1px solid tomato"
        >
          {children && children[1 as keyof typeof children]}
        </Flex>
      </Flex>
    </Flex>
  )
}
export default PageContent
