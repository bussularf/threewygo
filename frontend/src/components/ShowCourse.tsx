import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Heading, Text, Spinner, Alert, AlertIcon, VStack, Button, Stack, Flex } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';

interface Video {
  id: number;
  urls: string[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  end_date: string;
  state: string;
}

const ShowCourse: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [totalVideoSize, setTotalVideoSize] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/courses/${id}`);
        const course = response.data.course;
        const fetchedVideos = response.data.videos || [];
        const totalVideoSize = response.data.total_video_size;

        setCourse(course);
        setVideos(fetchedVideos);
        setTotalVideoSize(totalVideoSize);
      } catch (error) {
        setError('Erro ao buscar detalhes do curso');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

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
    <Box m={2}>
      {course ? (
        <>
          <Flex align="center" justify="space-between" mb={4}>
            <Heading as="h2" size="lg">
              {course.title}
            </Heading>
            <IconButton 
              aria-label="Voltar"
              icon={<ChevronLeftIcon />}
              onClick={handleBack}
              variant="outline"
              size="sm"
              colorScheme="teal"
            />
          </Flex>
          <Text fontSize="lg" mb={4}>{course.description}</Text>
          <Text>Data de Término: {course.end_date}</Text>
          <Text>Situação: {course.state}</Text>
          <Text>Tamanho Total dos Vídeos: {totalVideoSize} GB</Text>

          <Box mt={4}>
            <Stack direction="row" spacing={4} align="center">
              <Link to={`/courses/${id}/edit`}>
                <Button colorScheme="teal">Editar Curso</Button>
              </Link>
              <Button colorScheme="red" onClick={deleteCourse}>
                Deletar Curso
              </Button>
            </Stack>
          </Box>

          <VStack spacing={4} mt={6} align="stretch">
            <Heading as="h3" size="lg">Vídeos</Heading>
            {videos.length > 0 ? (
              videos.map((video) => (
                <Box key={video.id} p={4} borderWidth={1} borderRadius="lg">
                  <Text>Vídeo ID: {video.id}</Text>
                  {video.urls.map((url, index) => (
                    <Box key={index} mt={2} width="100%">
                      <video
                        style={{
                          maxWidth: '100%',
                          width: '600px',
                          height: '340px',
                        }}
                        controls
                      >
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
