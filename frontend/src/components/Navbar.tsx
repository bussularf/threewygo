import React from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom'; // Importando Link do React Router

const Navbar: React.FC = () => {
  return (
    <Box bg="teal.500" p={4}>
      <Flex justify="space-between" align="center">
        <Link to="/" style={{ color: 'white', fontSize: '24px', textDecoration: 'none' }}>
          Manage Course
        </Link> {/* Adicionando o Link aqui */}
        <Link to="/create-course"> {/* Link para criar curso */}
          <Button colorScheme="teal">
            Criar Curso
          </Button>
        </Link>
      </Flex>
    </Box>
  );
};

export default Navbar;
