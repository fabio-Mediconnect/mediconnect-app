import React, { useState, useEffect } from 'react';
import { Heart, Thermometer, Droplet, Activity, Send, Share2, Calendar, Filter, UserPlus, Mail, Eye, Users } from 'lucide-react';

const MedicalApp = () => {
  const [formData, setFormData] = useState({
    pressione: '',
    glicemia: '',
    temperatura: '',
    sintomi: '',
    data: new Date().toISOString().split('T')[0]
  });

  const [medicalData, setMedicalData] = useState([]);
  const [shareData, setShareData] = useState({
    email: '',
    startDate: '',
    endDate: '',
    includeData: {
      pressione: true,
      glicemia: true,
      temperatura: true,
      sintomi: true
    }
  });
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharedWith, setSharedWith] = useState([]);
  const [filterDate, setFilterDate] = useState('');

  // Inizializza con dati di esempio
  useEffect(() => {
    const sampleData = [
      {
        id: 1,
        date: '2025-08-31',
        time: '09:00',
        pressione: '125/82',
        glicemia: '98',
        temperatura: '36.8',
        sintomi: 'Leggero mal di testa mattutino'
      },
      {
        id: 2,
        date: '2025-08-30',
        time: '14:30',
        pressione: '120/80',
        glicemia: '95',
        temperatura: '36.5',
        sintomi: 'Leggero mal di testa, stanchezza'
      },
      {
        id: 3,
        date: '2025-08-29',
        time: '08:15',
        pressione: '118/78',
        glicemia: '92',
        temperatura: '36.4',
        sintomi: 'Nessun sintomo particolare'
      }
    ];
    setMedicalData(sampleData);
  }, []);

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
      date: formData.data,
      time: new Date().toLocaleTimeString('it-IT'),
      pressione: formData.pressione,
      glicemia: formData.glicemia,
      temperatura: formData.temperatura,
      sintomi: formData.sintomi
    };

    setMedicalData(prev => [newEntry, ...prev]);
    setFormData({ 
      pressione: '', 
      glicemia: '', 
      temperatura: '', 
      sintomi: '',
      data: new Date().toISOString().split('T')[0]
    });
    alert('Dati salvati con successo! 🎉');
  };

  const handleShare = () => {
    if (!shareData.email.includes('@')) {
      alert('Inserisci un email valida!');
      return;
    }

    let dataToShare = medicalData;
    if (shareData.startDate || shareData.endDate) {
      dataToShare = medicalData.filter(entry => {
        const entryDate = new Date(entry.date);
        const start = shareData.startDate ? new Date(shareData.startDate) : new Date('1900-01-01');
        const end = shareData.endDate ? new Date(shareData.endDate) : new Date('2100-12-31');
        return entryDate >= start && entryDate <= end;
      });
    }

    const shareInfo = {
      email: shareData.email,
      dataCount: dataToShare.length,
      dateRange: shareData.startDate && shareData.endDate ? 
        `${shareData.startDate} - ${shareData.endDate}` : 'Tutti i dati',
      sharedDate: new Date().toLocaleString('it-IT')
    };

    setSharedWith(prev => [shareInfo, ...prev]);
    setShowShareModal(false);
    setShareData({
      email: '',
      startDate: '',
      endDate: '',
      includeData: { pressione: true, glicemia: true, temperatura: true, sintomi: true }
    });

    alert(`✅ Dati condivisi con ${shareInfo.email}!\n📊 ${shareInfo.dataCount} registrazioni inviate`);
  };

  const filteredMedicalData = filterDate ? 
    medicalData.filter(entry => entry.date === filterDate) : 
    medicalData;

  // CSS integrato
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    innerContainer: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      padding: '25px',
      marginBottom: '25px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#2d3748',
      margin: '0 0 10px 0',
      textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#4a5568',
      margin: '0 0 20px 0'
    },
    buttonPrimary: {
      backgroundColor: '#4299e1',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(66, 153, 225, 0.3)'
    },
    buttonSuccess: {
      backgroundColor: '#48bb78',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(72, 187, 120, 0.3)'
    },
    formGrid: {
      display: 'grid',
      gap: '20px',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      marginBottom: '25px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '8px',
      gap: '6px'
    },
    input: {
      padding: '14px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      backgroundColor: 'rgba(255, 255, 255, 0.9)'
    },
    textarea: {
      padding: '14px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '16px',
      minHeight: '100px',
      resize: 'vertical',
      fontFamily: 'inherit',
      transition: 'all 0.3s ease',
      backgroundColor: 'rgba(255, 255, 255, 0.9)'
    },
    historyHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '15px',
      marginBottom: '20px'
    },
    historyTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#2d3748',
      margin: 0
    },
    filterContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      flexWrap: 'wrap'
    },
    dataCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '15px',
      borderLeft: '5px solid #4299e1',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    },
    dateTime: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      fontSize: '14px',
      color: '#718096',
      fontWeight: '600',
      marginBottom: '15px',
      padding: '8px 12px',
      backgroundColor: 'rgba(66, 153, 225, 0.1)',
      borderRadius: '8px'
    },
    valuesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '12px',
      marginBottom: '15px'
    },
    valueCard: {
      backgroundColor: '#f7fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '12px',
      textAlign: 'center',
      transition: 'all 0.3s ease'
    },
    valueLabel: {
      fontSize: '12px',
      color: '#718096',
      marginBottom: '4px',
      fontWeight: '600'
    },
    valueNumber: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '2px'
    },
    valueUnit: {
      fontSize: '11px',
      color: '#a0aec0'
    },
    symptomsCard: {
      backgroundColor: '#fff5f5',
      border: '1px solid #fed7d7',
      borderRadius: '12px',
      padding: '15px'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '30px',
      width: '100%',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)'
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px',
      borderRadius: '8px',
      border: '2px solid #e2e8f0',
      marginBottom: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    preview: {
      backgroundColor: '#f0fff4',
      border: '2px solid #9ae6b4',
      borderRadius: '12px',
      padding: '15px',
      marginBottom: '20px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: 'rgba(113, 128, 150, 0.1)',
      borderRadius: '16px',
      color: '#718096'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        {/* Header */}
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>🏥 MediConnect</h1>
            <p style={styles.subtitle}>Monitora la tua salute con semplicità</p>
            
            <button
              onClick={() => setShowShareModal(true)}
              style={styles.buttonSuccess}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <Share2 size={20} />
              Condividi Dati
            </button>
          </div>
        </div>

        {/* Form inserimento */}
        <div style={styles.card}>
          <h2 style={{...styles.historyTitle, marginBottom: '20px'}}>📊 Inserisci Nuovi Dati</h2>
          
          <div style={styles.formGrid}>
            {/* Data */}
            <div style={{...styles.inputGroup, gridColumn: '1 / -1'}}>
              <label style={styles.label}>
                <Calendar size={16} />
                Data misurazione
              </label>
              <input
                type="date"
                value={formData.data}
                onChange={(e) => handleInputChange('data', e.target.value)}
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#4299e1'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Pressione */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <Heart size={16} color="#e53e3e" />
                Pressione Arteriosa
              </label>
              <input
                type="text"
                placeholder="es. 120/80"
                value={formData.pressione}
                onChange={(e) => handleInputChange('pressione', e.target.value)}
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#e53e3e'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Glicemia */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <Droplet size={16} color="#3182ce" />
                Glicemia
              </label>
              <input
                type="number"
                placeholder="es. 95"
                value={formData.glicemia}
                onChange={(e) => handleInputChange('glicemia', e.target.value)}
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#3182ce'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Temperatura */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <Thermometer size={16} color="#dd6b20" />
                Temperatura Corporea
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="es. 36.5"
                value={formData.temperatura}
                onChange={(e) => handleInputChange('temperatura', e.target.value)}
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#dd6b20'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Sintomi */}
            <div style={{...styles.inputGroup, gridColumn: '1 / -1'}}>
              <label style={styles.label}>
                <Activity size={16} color="#805ad5" />
                Sintomi e Note
              </label>
              <textarea
                placeholder="Descrivi eventuali sintomi o note..."
                value={formData.sintomi}
                onChange={(e) => handleInputChange('sintomi', e.target.value)}
                style={styles.textarea}
                onFocus={(e) => e.target.style.borderColor = '#805ad5'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            style={{...styles.buttonPrimary, width: '100%', fontSize: '18px', padding: '16px'}}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#3182ce';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#4299e1';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <Send size={20} />
            Salva Dati Medici
          </button>
        </div>

        {/* Storico */}
        <div style={styles.card}>
          <div style={styles.historyHeader}>
            <h2 style={styles.historyTitle}>
              📋 Storico Dati ({filteredMedicalData.length}/{medicalData.length})
            </h2>
            
            <div style={styles.filterContainer}>
              <Filter size={18} color="#718096" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                style={{...styles.input, width: 'auto', minWidth: '150px'}}
              />
              {filterDate && (
                <button
                  onClick={() => setFilterDate('')}
                  style={{
                    backgroundColor: '#e53e3e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    cursor: 'pointer'
                  }}
                >
                  ✕ Reset
                </button>
              )}
            </div>
          </div>
          
          {filteredMedicalData.length === 0 ? (
            <div style={styles.emptyState}>
              <Activity size={48} color="#a0aec0" style={{marginBottom: '20px'}} />
              <h3 style={{color: '#4a5568', marginBottom: '10px'}}>
                {filterDate ? 'Nessun dato per questa data' : 'Inizia il tuo monitoraggio'}
              </h3>
              <p style={{color: '#718096'}}>
                {filterDate ? 'Prova con una data diversa' : 'Aggiungi la tua prima misurazione medica!'}
              </p>
            </div>
          ) : (
            <div>
              {filteredMedicalData.map(entry => (
                <div key={entry.id} style={styles.dataCard}>
                  <div style={styles.dateTime}>
                    <Calendar size={16} />
                    <span>{new Date(entry.date).toLocaleDateString('it-IT', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                    <span>•</span>
                    <span>{entry.time}</span>
                  </div>
                  
                  <div style={styles.valuesGrid}>
                    {entry.pressione && (
                      <div style={{...styles.valueCard, borderTop: '3px solid #e53e3e'}}>
                        <div style={styles.valueLabel}>❤️ Pressione</div>
                        <div style={{...styles.valueNumber, color: '#e53e3e'}}>{entry.pressione}</div>
                        <div style={styles.valueUnit}>mmHg</div>
                      </div>
                    )}
                    {entry.glicemia && (
                      <div style={{...styles.valueCard, borderTop: '3px solid #3182ce'}}>
                        <div style={styles.valueLabel}>🩸 Glicemia</div>
                        <div style={{...styles.valueNumber, color: '#3182ce'}}>{entry.glicemia}</div>
                        <div style={styles.valueUnit}>mg/dL</div>
                      </div>
                    )}
                    {entry.temperatura && (
                      <div style={{...styles.valueCard, borderTop: '3px solid #dd6b20'}}>
                        <div style={styles.valueLabel}>🌡️ Temperatura</div>
                        <div style={{...styles.valueNumber, color: '#dd6b20'}}>{entry.temperatura}</div>
                        <div style={styles.valueUnit}>°C</div>
                      </div>
                    )}
                  </div>
                  
                  {entry.sintomi && (
                    <div style={styles.symptomsCard}>
                      <div style={{...styles.valueLabel, color: '#805ad5', marginBottom: '8px'}}>
                        💭 Sintomi e Note:
                      </div>
                      <div style={{color: '#2d3748', lineHeight: '1.5'}}>
                        {entry.sintomi}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lista condivisioni */}
        {sharedWith.length > 0 && (
          <div style={styles.card}>
            <h3 style={{...styles.historyTitle, marginBottom: '20px'}}>📤 Storico Condivisioni</h3>
            {sharedWith.map((share, index) => (
              <div key={index} style={{
                ...styles.dataCard,
                borderLeft: '5px solid #48bb78',
                backgroundColor: 'rgba(72, 187, 120, 0.05)'
              }}>
                <div style={{fontSize: '16px', fontWeight: 'bold', marginBottom: '8px'}}>
                  📧 {share.email}
                </div>
                <div style={{color: '#718096', marginBottom: '4px'}}>
                  📊 {share.dataCount} registrazioni condivise
                </div>
                <div style={{color: '#718096', marginBottom: '4px'}}>
                  📅 Periodo: {share.dateRange}
                </div>
                <div style={{color: '#a0aec0', fontSize: '12px'}}>
                  🕐 {share.sharedDate}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{...styles.card, textAlign: 'center', color: '#718096'}}>
          <div style={{marginBottom: '10px'}}>
            🔒 <strong>I tuoi dati sono sicuri e privati</strong>
          </div>
          <div style={{fontSize: '14px'}}>
            📱 <strong>Per installare l'app:</strong> Menu Chrome (⋮) → "Aggiungi alla schermata Home"
          </div>
        </div>

        {/* Modal Condivisione */}
        {showShareModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h3 style={{...styles.historyTitle, marginBottom: '25px'}}>
                📤 Condividi Dati Medici
              </h3>
              
              {/* Email destinatario */}
              <div style={{...styles.inputGroup, marginBottom: '20px'}}>
                <label style={styles.label}>
                  <Mail size={16} />
                  Email destinatario
                </label>
                <input
                  type="email"
                  placeholder="dott.rossi@ospedale.it"
                  value={shareData.email}
                  onChange={(e) => setShareData(prev => ({ ...prev, email: e.target.value }))}
                  style={styles.input}
                />
              </div>

              {/* Periodo */}
              <div style={{marginBottom: '20px'}}>
                <label style={{...styles.label, marginBottom: '10px'}}>
                  <Calendar size={16} />
                  Periodo dati da condividere
                </label>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                  <div>
                    <label style={{fontSize: '12px', color: '#718096', marginBottom: '5px', display: 'block'}}>
                      Data inizio
                    </label>
                    <input
                      type="date"
                      value={shareData.startDate}
                      onChange={(e) => setShareData(prev => ({ ...prev, startDate: e.target.value }))}
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label style={{fontSize: '12px', color: '#718096', marginBottom: '5px', display: 'block'}}>
                      Data fine
                    </label>
                    <input
                      type="date"
                      value={shareData.endDate}
                      onChange={(e) => setShareData(prev => ({ ...prev, endDate: e.target.value }))}
                      style={styles.input}
                    />
                  </div>
                </div>
                <div style={{fontSize: '12px', color: '#a0aec0', marginTop: '8px'}}>
                  💡 Lascia vuoto per condividere tutti i dati
                </div>
              </div>

              {/* Selezione dati */}
              <div style={{marginBottom: '25px'}}>
                <label style={{...styles.label, marginBottom: '15px'}}>
                  <Activity size={16} />
                  Tipi di dati da condividere
                </label>
                
                {Object.entries({
                  pressione: '❤️ Pressione Arteriosa',
                  glicemia: '🩸 Glicemia',
                  temperatura: '🌡️ Temperatura Corporea', 
                  sintomi: '💭 Sintomi e Note'
                }).map(([key, label]) => (
                  <label
                    key={key}
                    style={{
                      ...styles.checkboxContainer,
                      backgroundColor: shareData.includeData[key] ? 'rgba(66, 153, 225, 0.1)' : '#f7fafc',
                      borderColor: shareData.includeData[key] ? '#4299e1' : '#e2e8f0'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={shareData.includeData[key]}
                      onChange={(e) => setShareData(prev => ({
                        ...prev,
                        includeData: { ...prev.includeData, [key]: e.target.checked }
                      }))}
                      style={{marginRight: '12px', transform: 'scale(1.2)'}}
                    />
                    <span style={{fontSize: '14px', fontWeight: '500'}}>{label}</span>
                  </label>
                ))}
              </div>

              {/* Anteprima */}
              <div style={styles.preview}>
                <div style={{fontWeight: 'bold', color: '#2f855a', marginBottom: '8px'}}>
                  📋 Anteprima condivisione
                </div>
                <div style={{color: '#2f855a'}}>
                  {(() => {
                    let count = medicalData.length;
                    if (shareData.startDate || shareData.endDate) {
                      count = medicalData.filter(entry => {
                        const entryDate = new Date(entry.date);
                        const start = shareData.startDate ? new Date(shareData.startDate) : new Date('1900-01-01');
                        const end = shareData.endDate ? new Date(shareData.endDate) : new Date('2100-12-31');
                        return entryDate >= start && entryDate <= end;
                      }).length;
                    }
                    return `📊 ${count} registrazioni saranno condivise`;
                  })()}
                </div>
              </div>

              {/* Bottoni */}
              <div style={{display: 'flex', gap: '15px', justifyContent: 'flex-end'}}>
                <button
                  onClick={() => setShowShareModal(false)}
                  style={{
                    backgroundColor: '#a0aec0',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    cursor: 'pointer'
                  }}
                >
                  ❌ Annulla
                </button>
                <button
                  onClick={handleShare}
                  style={styles.buttonSuccess}
                >
                  <Send size={16} />
                  Condividi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalApp;