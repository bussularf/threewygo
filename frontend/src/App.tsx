import React from 'react';
import { Box } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CourseList from './components/CourseList'; 
import CourseForm from './components/CourseForm';
import ShowCourse from './components/ShowCourse';
import CourseUpdateForm from './components/CourseUpdateForm';
import CoursesReport from './components/CoursesReport';

const App: React.FC = () => {
  return (
    <Box bg="#C0EBA6" minHeight="100vh">
      <Navbar />
      <Routes>
        <Route path="/" element={<CourseList />} />
        <Route path="/create-course" element={<CourseForm />} />
        <Route path="/courses/:id" element={<ShowCourse />} />
        <Route path="/courses/:id/edit" element={<CourseUpdateForm />} />
        <Route path="/courses-report" element={<CoursesReport/>} />
        </Routes>
    </Box>
  );
};

export default App;
