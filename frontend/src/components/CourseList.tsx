import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Heading,
  Text,
  Grid,
  Image,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

interface Course {
  id: number;
  title: string;
  description: string;
  photo_url: string;
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
        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
          {courses.map(course => (
            <Link to={`/courses/${course.id}`} key={course.id}>
              <Box borderWidth={1} borderRadius="md" overflow="hidden">
                <Text p={2} fontWeight="bold" color="teal.500" textAlign="center">
                  {course.title}
                </Text>
                <Text p={2}>{course.description}</Text>
                <Image 
                  src={course.photo_url}
                  alt={course.title}
                  objectFit="cover" 
                  width="100%"
                  height="150px"
                />
              </Box>
            </Link>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default CourseList;
