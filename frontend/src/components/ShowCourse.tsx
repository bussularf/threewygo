import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Heading, Text, Spinner, Alert, AlertIcon, VStack, Button } from '@chakra-ui/react';

interface Video {
  id: number;
  urls: string[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  endDate: string;
}

const ShowCourse: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/courses/${id}`);
        const apiCourse = response.data.course;
        const course = {
          ...apiCourse,
          title: apiCourse.title,
          endDate: apiCourse.end_date,
        };

        const fetchedVideos = response.data.videos || [];
        setCourse(course);
        setVideos(fetchedVideos);
      } catch (error) {
        setError('Erro ao buscar detalhes do curso');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const deleteCourse = async () => {
    const confirmDelete = window.confirm('Tem certeza que deseja deletar este curso?');
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:3000/api/v1/courses/${id}`);
      navigate('/');
    } catch (error) {
      setError('Erro ao deletar o curso');
    }
  };

  if (loading) return <Spinner size="lg" />;
  if (error) return <Alert status="error"><AlertIcon />{error}</Alert>;

  return (
    <Box>
      {course ? (
        <>
          <Heading as="h2" size="xl" mb={4}>{course.title}</Heading>
          <Text fontSize="lg" mb={4}>{course.description}</Text>
          <Text>Data de Término: {new Date(course.endDate).toLocaleDateString()}</Text>

          {/* Update Button */}
          <Box mt={4}>
            <Link to={`/courses/${id}/edit`}>
              <Button colorScheme="teal">Editar Curso</Button>
            </Link>
          </Box>

          {/* Delete Button */}
          <Box mt={4}>
            <Button colorScheme="red" onClick={deleteCourse}>
              Deletar Curso
            </Button>
          </Box>

          <VStack spacing={4} mt={6} align="stretch">
            <Heading as="h3" size="lg">Vídeos</Heading>
            {videos.length > 0 ? (
              videos.map((video) => (
                <Box key={video.id} p={4} borderWidth={1} borderRadius="lg">
                  <Text>Vídeo ID: {video.id}</Text>
                  {video.urls.map((url, index) => (
                    <Box key={index} mt={2} width="100%">
                      <video style={{ maxWidth: '600px', width: '100%', height: 'auto' }} controls>
                        <source src={url} type="video/mp4" />
                        Seu navegador não suporta o elemento de vídeo.
                      </video>
                    </Box>
                  ))}
                </Box>
              ))
            ) : (
              <Text>Nenhum vídeo encontrado.</Text>
            )}
          </VStack>
        </>
      ) : (
        <Text>Curso não encontrado.</Text>
      )}
    </Box>
  );
};

export default ShowCourse;
