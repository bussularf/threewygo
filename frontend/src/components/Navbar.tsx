import React from 'react';
import { Box, Button, Flex, HStack, IconButton, useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { HamburgerIcon } from '@chakra-ui/icons';

const Navbar: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg="teal.500" p={4}>
      <Flex justify="space-between" align="center">
        <Link to="/" style={{ color: 'white', fontSize: '24px', textDecoration: 'none' }}>
          Manage Course
        </Link>
        
        <Flex display={{ base: 'none', md: 'flex' }}>
          <Link to="/create-course">
            <Button colorScheme="teal" mr={4}>
              Criar Curso
            </Button>
          </Link>
          <Link to="/courses-report">
            <Button colorScheme="teal">
              Relatório
            </Button>
          </Link>
        </Flex>
        
        <IconButton 
          icon={<HamburgerIcon />} 
          colorScheme="teal" 
          aria-label="Menu" 
          display={{ base: 'flex', md: 'none' }} 
          onClick={onOpen}
        />
      </Flex>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <HStack spacing={4} align="flex-start" direction="column">
              <Link to="/create-course">
                <Button colorScheme="teal" w="100%">
                  Criar Curso
                </Button>
              </Link>
              <Link to="/courses-report">
                <Button colorScheme="teal" w="100%">
                  Relatório
                </Button>
              </Link>
            </HStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
