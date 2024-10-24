import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface CourseResponse {
  title: string;
}

const CourseForm: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [videosFile, setVideosFile] = useState<FileList | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !description || !endDate || !videosFile || !photoFile) {
      toast({
        title: 'Erro de validação.',
        description: 'Por favor, preencha todos os campos.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('course[title]', title);
    formData.append('course[description]', description);
    formData.append('course[end_date]', endDate.toISOString());

    if (videosFile) {
      for (let i = 0; i < videosFile.length; i++) {
        formData.append('course[videos][]', videosFile[i]);
      }
    }

    if (photoFile) {
      formData.append('course[photo]', photoFile);
    }

    try {
      const response = await axios.post<CourseResponse>('http://localhost:3000/api/v1/courses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setTitle('');
      setDescription('');
      setEndDate(null);
      setVideosFile(null);
      setPhotoFile(null);
      toast({
        title: 'Curso criado.',
        description: `O curso "${response.data.title}" foi criado com sucesso!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erro ao criar curso:', error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao criar o curso. Tente novamente.';
        toast({
          title: 'Erro ao criar curso.',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Erro ao criar curso.',
          description: 'Ocorreu um erro inesperado. Tente novamente.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={4} borderWidth={1} borderRadius="md" boxShadow="md">
      <Heading as="h2" size="lg" mb={4}>Criar Novo Curso</Heading>
      <FormControl mb={4} isRequired>
        <FormLabel>Título:</FormLabel>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite o título do curso"
        />
      </FormControl>
      <FormControl mb={4} isRequired>
        <FormLabel>Descrição:</FormLabel>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Digite a descrição do curso"
        />
      </FormControl>
      <FormControl mb={4} isRequired>
        <FormLabel>Data de Término:</FormLabel>
        <DatePicker
          selected={endDate}
          onChange={(date: Date | null) => setEndDate(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Selecione a data de término"
          className="chakra-input"
        />
      </FormControl>
      <FormControl mb={4} isRequired>
        <FormLabel>Vídeos:</FormLabel>
        <Input
          type="file"
          accept="video/*"
          multiple
          onChange={(e) => setVideosFile(e.target.files || null)}
        />
      </FormControl>
      <FormControl mb={4} isRequired>
        <FormLabel>Capa do Vídeo:</FormLabel>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
        />
      </FormControl>
      <Button colorScheme="teal" type="submit">Criar Curso</Button>
    </Box>
  );
};

export default CourseForm;
