import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import './App.css';

function App() {
  const [filePath, setFilePath] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath }),
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
      <TextField
        label="Caminho do Arquivo CSV"
        fullWidth
        value={filePath}
        onChange={(e) => setFilePath(e.target.value)}
        margin="normal"
        variant="outlined"
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
                          <TableCell key={header}>{header}</TableCell>
                        ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fornecedorData.Produtos.map((produto, idx) => (
                      <TableRow key={idx}>
                        {Object.values(produto).map((value, i) => (
                          <TableCell key={i}>{value}</TableCell>
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
