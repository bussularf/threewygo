import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box, 
  Heading, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Spinner, 
  Alert, 
  AlertIcon, 
  Input, 
  Button,
  IconButton,
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const CoursesReport: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [end_date, setEndDate] = useState<string>('');

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/v1/courses/report', {
        params: { end_date: end_date }
      });
      setCourses(response.data.courses || []);
    } catch (error) {
      setError('Erro ao buscar relatório de cursos');
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const downloadCSV = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/courses/report_csv', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'cursos_relatorio.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setError('Erro ao baixar o relatório em CSV');
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (loading) return <Spinner size="lg" />;
  if (error) return <Alert status="error"><AlertIcon />{error}</Alert>;

  return (
    <Box p={4}>
      <Heading as="h2" size="xl" mb={4}>Relatório de Cursos</Heading>
      <Box mb={4} display={{ base: "block", md: "flex" }} gap={4}>
        <Input
          type="date"
          placeholder="Data de Término"
          value={end_date}
          onChange={(e) => setEndDate(e.target.value)}
          width={{ base: "100%", md: "auto" }}
        />
        <Button colorScheme="teal" onClick={fetchReport} mt={{ base: 2, md: 0 }}>
          Filtrar
        </Button>
        <Button colorScheme="blue" onClick={downloadCSV} mt={{ base: 2, md: 0 }} ml={{ md: 2 }}>
          Baixar CSV
        </Button>
        <IconButton 
            aria-label="Voltar"
            icon={<ChevronLeftIcon />}
            onClick={handleBack}
            variant="outline"
            size="sm"
            colorScheme="teal"
        />
      </Box>

      <Table variant="simple" size={{ base: "sm", md: "md" }}>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Título</Th>
            <Th>Descrição</Th>
            <Th>Data de Término</Th>
            <Th>GB ocupado</Th>
          </Tr>
        </Thead>
        <Tbody>
          {courses && courses.length > 0 ? (
            courses.map((course) => (
              <Tr key={course.course.id}>
                <Td>{course.course.id}</Td>
                <Td>{course.course.title}</Td>
                <Td>{course.course.description}</Td>
                <Td>{course.course.end_date}</Td>
                <Td>{course.total_video_size} GB</Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={5}>Nenhum curso encontrado.</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default CoursesReport;
