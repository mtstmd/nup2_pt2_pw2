import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function CategoryForm() {
  const [category, setCategory] = useState({ name: '' })
  const [error, setError] = useState(null) 
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { error: 'Você precisa estar autenticado para acessar esta página.' } });
    } else if (id) {
      fetchCategory();
    }
  }, [id, navigate]);

  const fetchCategory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3335/api/v1/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategory(response.data);
      setError(null); 
    } catch (error) {
      console.error('Error fetching category:', error);
      setError('Failed to fetch category. Please try again later.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (id) {
        await axios.put(`http://localhost:3335/api/v1/categories/${id}`, category, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post('http://localhost:3335/api/v1/categories', category, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      navigate('/categories');
    } catch (error) {
      console.error('Error saving category:', error);
      setError('Failed to save category. Please try again later.');
    }
  };

  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value })
  }

  return (
    <div>
      <h2>{id ? 'Edit Category' : 'Add New Category'}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" value={category.name} onChange={handleChange} required />
        </Form.Group>
        <Button variant="primary" type="submit">
          {id ? 'Update' : 'Create'} Category
        </Button>
      </Form>
    </div>
  )
}