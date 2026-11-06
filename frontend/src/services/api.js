import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getStats = () =>
    api.get('/stats');

export const getStudents = (params = {}) =>
    api.get('/students', { params });

export const getStudent = (id) =>
    api.get(`/students/${id}`);

export const addStudent = (data) =>
    api.post('/students', data);

export const updateStudent = (id, data) =>
    api.put(`/students/${id}`, data);

export const deleteStudent = (id) =>
    api.delete(`/students/${id}`);

export const getCourses = () =>
    api.get('/courses');

export const addCourse = (data) =>
    api.post('/courses', data);

export const deleteCourse = (id) =>
    api.delete(`/courses/${id}`);