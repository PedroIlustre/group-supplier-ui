import React, { useState } from 'react';
import { Button, Container, Typography, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Input } from '@mui/material';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!file) {
        throw new Error('Por favor, selecione um arquivo.');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:3000/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Erro ao chamar o serviço:', error.message);
      setResult(null);
    }
  };

  return (
    <Container className="App" maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Processamento de CSV
      </Typography>
      <Input
        type="file"
        inputProps={{ accept: '.csv' }}
        onChange={handleFileChange}
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Processar
      </Button>
      {result && (
        <div>
          <Typography variant="h5" gutterBottom>
            Resultado:
          </Typography>
          {result.map((fornecedorData, index) => (
            <Paper key={index} elevation={3} style={{ marginBottom: '16px', padding: '16px' }}>
              <Typography variant="h6" style={{ marginBottom: '8px', backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}` }}>
                {fornecedorData.Fornecedor}
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {fornecedorData.Produtos.length > 0 &&
                        Object.keys(fornecedorData.Produtos[0]).map((header) => (
                          header !== 'Descontinuado' && <TableCell key={header}>{header}</TableCell>
                        ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fornecedorData.Produtos.map((produto, idx) => (
                      <TableRow key={idx}>
                        {Object.keys(produto).map((key) => (
                          key !== 'Descontinuado' && <TableCell key={key}>{produto[key]}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ))}
        </div>
      )}
    </Container>
  );
}

export default App;
