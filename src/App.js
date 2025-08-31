import React, { useState } from 'react';
import { Heart, Thermometer, Droplet, Activity, Send } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({
    pressione: '',
    glicemia: '',
    temperatura: '',
    sintomi: ''
  });

  const [medicalData, setMedicalData] = useState([]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.pressione && !formData.glicemia && !formData.temperatura) {
      alert('Inserisci almeno un valore!');
      return;
    }

    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('it-IT'),
      time: new Date().toLocaleTimeString('it-IT'),
      ...formData
    };

    setMedicalData(prev => [newEntry, ...prev]);
    setFormData({ pressione: '', glicemia: '', temperatura: '', sintomi: '' });
    alert('Dati salvati!');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>🏥 MediConnect</h1>
        <p>La tua app per monitorare i dati medici</p>
      </div>

      {/* Form inserimento */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h2>📊 Inserisci Nuovi Dati</h2>
        
        <div style={{ display: 'grid', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              <Heart size={16} style={{ marginRight: '5px' }} />
              Pressione (es. 120/80):
            </label>
            <input
              type="text"
              placeholder="120/80"
              value={formData.pressione}
              onChange={(e) => handleInputChange('pressione', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              <Droplet size={16} style={{ marginRight: '5px' }} />
              Glicemia (mg/dL):
            </label>
            <input
              type="number"
              placeholder="95"
              value={formData.glicemia}
              onChange={(e) => handleInputChange('glicemia', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              <Thermometer size={16} style={{ marginRight: '5px' }} />
              Temperatura (°C):
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="36.5"
              value={formData.temperatura}
              onChange={(e) => handleInputChange('temperatura', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Sintomi:
            </label>
            <textarea
              placeholder="Descrivi i tuoi sintomi..."
              value={formData.sintomi}
              onChange={(e) => handleInputChange('sintomi', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', height: '80px' }}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          <Send size={16} style={{ marginRight: '5px' }} />
          Salva Dati
        </button>
      </div>

      {/* Storico */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
        <h2>📋 Storico Dati ({medicalData.length} registrazioni)</h2>
        
        {medicalData.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
            Nessun dato inserito ancora. Aggiungi la prima misurazione! 
          </p>
        ) : (
          <div>
            {medicalData.map(entry => (
              <div key={entry.id} style={{
                backgroundColor: 'white',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '5px',
                borderLeft: '4px solid #007bff'
              }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                  {entry.date} - {entry.time}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                  {entry.pressione && (
                    <div>
                      <strong>Pressione:</strong> {entry.pressione} mmHg
                    </div>
                  )}
                  {entry.glicemia && (
                    <div>
                      <strong>Glicemia:</strong> {entry.glicemia} mg/dL
                    </div>
                  )}
                  {entry.temperatura && (
                    <div>
                      <strong>Temperatura:</strong> {entry.temperatura}°C
                    </div>
                  )}
                </div>
                
                {entry.sintomi && (
                  <div style={{ marginTop: '10px' }}>
                    <strong>Sintomi:</strong> {entry.sintomi}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
        🔒 I tuoi dati sono sicuri e privati
      </div>
    </div>
  );
}

export default App;