import React, { useState } from 'react';
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
    <div className="App">
      <h1>Processamento de CSV</h1>
      <label>
        Caminho do Arquivo CSV:
        <input type="text" value={filePath} onChange={(e) => setFilePath(e.target.value)} />
      </label>
      <button onClick={handleSubmit}>Processar</button>
      {result && (
        <div>
          <h2>Resultado:</h2>
          {result.map((fornecedorData, index) => (
            <div key={index}>
              <h3 style={{ backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}` }}>
                {fornecedorData.Fornecedor}
              </h3>
              <table>
                <thead>
                  <tr>
                    {fornecedorData.Produtos.length > 0 &&
                      Object.keys(fornecedorData.Produtos[0]).map((header) => (
                        <th key={header}>{header}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {fornecedorData.Produtos.map((produto, idx) => (
                    <tr key={idx}>
                      {Object.values(produto).map((value, i) => (
                        <td key={i}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
