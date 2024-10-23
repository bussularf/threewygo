import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  useToast,
  Container,
  Stack,
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';

interface videos {
  id: number;
  urls: string[];
}

const CourseUpdateForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const numericCourseId = Number(id);

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [end_date, setEndDate] = useState<Date | null>(null);
  const [videosFile, setVideosFile] = useState<FileList | null>(null);
  const [existingVideos, setExistingVideos] = useState<videos[]>([]);
  const [removeVideoIds, setRemoveVideoIds] = useState<number[]>([]);
  const toast = useToast();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/courses/${numericCourseId}`);
        const courseData = response.data.course;

        setTitle(courseData.title);
        setDescription(courseData.description);
        setEndDate(new Date(courseData.end_date));
        setExistingVideos(response.data.videos || []);
      } catch (error) {
        console.error('Erro ao carregar dados do curso:', error);
        toast({
          title: 'Erro ao carregar curso.',
          description: 'Não foi possível carregar as informações do curso.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchCourse();
  }, [numericCourseId, toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('course[title]', title);
    formData.append('course[description]', description);
    if (end_date) formData.append('course[end_date]', end_date.toISOString());

    if (videosFile) {
      for (let i = 0; i < videosFile.length; i++) {
        formData.append('course[videos][]', videosFile[i]);
      }
    }

    if (removeVideoIds.length > 0) {
      removeVideoIds.forEach((id) => {
        formData.append('course[remove_video_ids][]', id.toString());
      });
    }

    try {
      await axios.put(`http://localhost:3000/api/v1/courses/${numericCourseId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: 'Curso atualizado.',
        description: 'As informações do curso foram atualizadas com sucesso!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setRemoveVideoIds([]);
    } catch (error) {
      console.error('Erro ao atualizar curso:', error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Erro ao atualizar o curso. Tente novamente.';
        toast({
          title: 'Erro ao atualizar curso.',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Erro ao atualizar curso.',
          description: 'Ocorreu um erro inesperado. Tente novamente.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleRemoveVideo = (videoId: number) => {
    setRemoveVideoIds((prev) => [...prev, videoId]);
    setExistingVideos((prev) => prev.filter((video) => video.id !== videoId));
  };

  return (
    <Container maxW="container.md" p={[4, 6, 8]} boxShadow="lg" borderWidth={1} borderRadius="md" mt={8}>
      <Heading as="h2" size="lg" mb={6} textAlign="center">
        Editar Curso
      </Heading>
      <Box as="form" onSubmit={handleSubmit}>
        <Stack spacing={5}>
          <FormControl isRequired>
            <FormLabel>Título:</FormLabel>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do curso"
              size="md"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Descrição:</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite a descrição do curso"
              size="md"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Data de Término:</FormLabel>
            <DatePicker
              selected={end_date}
              onChange={(date: Date | null) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecione a data de término"
              className="chakra-input"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Adicionar Novos Vídeos:</FormLabel>
            <Input
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => setVideosFile(e.target.files)}
              size="md"
            />
          </FormControl>
          <Box>
            <Heading as="h4" size="md" mt={4} mb={2}>
              Vídeos Existentes:
            </Heading>
            {existingVideos.length > 0 ? (
              existingVideos.map((video) => (
                <Box key={video.id} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <a href={video.urls[0]} target="_blank" rel="noopener noreferrer">
                    Vídeo {video.id}
                  </a>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleRemoveVideo(video.id)}
                  >
                    Remover
                  </Button>
                </Box>
              ))
            ) : (
              <p>Nenhum vídeo existente.</p>
            )}
          </Box>
          <Button colorScheme="teal" size="lg" type="submit" w="full">
            Atualizar Curso
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default CourseUpdateForm;
