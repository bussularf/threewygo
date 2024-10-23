import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Importa o Link para navegação
import axios from 'axios';
import { Box, Heading, Text, List, ListItem, Spinner, Alert, AlertIcon } from '@chakra-ui/react';

interface Course {
  id: number;
  title: string;
  description: string;
}

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get<Course[]>('http://localhost:3000/api/v1/courses');
        setCourses(response.data);
      } catch (error) {
        setError('Erro ao buscar cursos');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <Spinner size="lg" />;
  if (error) return <Alert status="error"><AlertIcon />{error}</Alert>;

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>Lista de Cursos</Heading>
      {courses.length === 0 ? (
        <Text>Nenhum curso disponível.</Text>
      ) : (
        <List spacing={3}>
          {courses.map(course => (
            <ListItem key={course.id}>
              <Link to={`/courses/${course.id}`}>
                <Text fontWeight="bold" color="teal.500">{course.title}</Text>
              </Link>
              <Text>{course.description}</Text>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default CourseList;
