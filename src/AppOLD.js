import React, { useState, useEffect } from 'react';
import { Heart, Thermometer, Droplet, Activity, Send, Share2, Calendar, Filter, UserPlus, Mail, Users, Pill, Clock, TrendingUp, Edit2, Trash2, Plus, BarChart3, Printer } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts';

const MedicalApp = () => {
  const [activeTab, setActiveTab] = useState('insert');
  const [formData, setFormData] = useState({
    pressione: '',
    battiti: '',
    saturazione: '',
    glicemia: '',
    temperatura: '',
    sintomi: '',
    data: new Date().toISOString().split('T')[0],
    ora: new Date().toTimeString().slice(0, 5)
  });

  const [medicineData, setMedicineData] = useState({
    nome: '',
    dosaggio: '',
    ora: '',
    frequenza: 'quotidiana',
    note: ''
  });

  const [medicalData, setMedicalData] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingMedicine, setEditingMedicine] = useState(null);
  
  const [shareData, setShareData] = useState({
    email: '',
    nome: '',
    ruolo: 'medico',
    startDate: '',
    endDate: '',
    includeData: {
      pressione: true,
      battiti: true,
      saturazione: true,
      glicemia: true,
      temperatura: true,
      sintomi: true,
      medicine: true
    }
  });
  
  const [showShareModal, setShowShareModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [sharedWith, setSharedWith] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [chartType, setChartType] = useState('pressione');
  
  const [printOptions, setPrintOptions] = useState({
    includeHistory: true,
    includeCharts: true,
    chartTypes: {
      pressione: true,
      battiti: false,
      saturazione: false,
      glicemia: true,
      temperatura: false
    },
    dateRange: {
      start: '',
      end: ''
    }
  });

  // Initialize with sample data
  useEffect(() => {
    const sampleData = [
      {
        id: 1,
        date: '2025-08-31',
        time: '09:00',
        pressione: '125/82',
        battiti: '75',
        saturazione: '98',
        glicemia: '98',
        temperatura: '36.8',
        sintomi: 'Leggero mal di testa mattutino'
      },
      {
        id: 2,
        date: '2025-08-30',
        time: '14:30',
        pressione: '120/80',
        battiti: '72',
        saturazione: '97',
        glicemia: '95',
        temperatura: '36.5',
        sintomi: 'Stanchezza generale'
      },
      {
        id: 3,
        date: '2025-08-29',
        time: '08:15',
        pressione: '118/78',
        battiti: '68',
        saturazione: '99',
        glicemia: '92',
        temperatura: '36.4',
        sintomi: 'Nessun sintomo particolare'
      }
    ];
    
    const sampleMedicines = [
      {
        id: 1,
        nome: 'Enalapril',
        dosaggio: '10mg',
        ora: '08:00',
        frequenza: 'quotidiana',
        note: 'A stomaco pieno'
      },
      {
        id: 2,
        nome: 'Metformina',
        dosaggio: '500mg',
        ora: '12:00',
        frequenza: 'quotidiana',
        note: 'Durante i pasti'
      }
    ];

    setMedicalData(sampleData);
    setMedicines(sampleMedicines);
  }, []);

  // Simulate email sending
  const sendEmail = async (emailData) => {
    try {
      console.log('Email inviata:', emailData.to);
      console.log('Oggetto:', emailData.subject);
      console.log('Contenuto HTML:', emailData.html);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { status: 200, messageId: `msg_${Date.now()}` };
    } catch (error) {
      throw new Error('Errore invio email: ' + error.message);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMedicineChange = (field, value) => {
    setMedicineData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.pressione && !formData.battiti && !formData.saturazione && 
        !formData.glicemia && !formData.temperatura) {
      alert('Inserisci almeno un valore!');
      return;
    }

    if (editingId) {
      setMedicalData(prev => prev.map(item => 
        item.id === editingId 
          ? { ...item, ...formData, time: formData.ora }
          : item
      ));
      setEditingId(null);
      alert('Dati aggiornati con successo!');
    } else {
      const newEntry = {
        id: Date.now(),
        date: formData.data,
        time: formData.ora,
        pressione: formData.pressione,
        battiti: formData.battiti,
        saturazione: formData.saturazione,
        glicemia: formData.glicemia,
        temperatura: formData.temperatura,
        sintomi: formData.sintomi
      };

      setMedicalData(prev => [newEntry, ...prev]);
      alert('Dati salvati con successo!');
    }

    setFormData({ 
      pressione: '', 
      battiti: '',
      saturazione: '',
      glicemia: '', 
      temperatura: '', 
      sintomi: '',
      data: new Date().toISOString().split('T')[0],
      ora: new Date().toTimeString().slice(0, 5)
    });
  };

  const handleMedicineSubmit = () => {
    if (!medicineData.nome || !medicineData.dosaggio || !medicineData.ora) {
      alert('Compila tutti i campi obbligatori!');
      return;
    }

    if (editingMedicine) {
      setMedicines(prev => prev.map(item => 
        item.id === editingMedicine 
          ? { ...item, ...medicineData }
          : item
      ));
      setEditingMedicine(null);
      alert('Medicina aggiornata!');
    } else {
      const newMedicine = { id: Date.now(), ...medicineData };
      setMedicines(prev => [...prev, newMedicine]);
      alert('Medicina aggiunta!');
    }

    setMedicineData({
      nome: '',
      dosaggio: '',
      ora: '',
      frequenza: 'quotidiana',
      note: ''
    });
  };

  const editData = (id) => {
    const item = medicalData.find(d => d.id === id);
    if (item) {
      setFormData({
        pressione: item.pressione || '',
        battiti: item.battiti || '',
        saturazione: item.saturazione || '',
        glicemia: item.glicemia || '',
        temperatura: item.temperatura || '',
        sintomi: item.sintomi || '',
        data: item.date,
        ora: item.time
      });
      setEditingId(id);
      setActiveTab('insert');
    }
  };

  const deleteData = (id) => {
    if (window.confirm('Eliminare questa misurazione?')) {
      setMedicalData(prev => prev.filter(item => item.id !== id));
      alert('Misurazione eliminata!');
    }
  };

  const editMedicine = (id) => {
    const medicine = medicines.find(m => m.id === id);
    if (medicine) {
      setMedicineData({
        nome: medicine.nome,
        dosaggio: medicine.dosaggio,
        ora: medicine.ora,
        frequenza: medicine.frequenza,
        note: medicine.note || ''
      });
      setEditingMedicine(id);
    }
  };

  const deleteMedicine = (id) => {
    if (window.confirm('Eliminare questa medicina?')) {
      setMedicines(prev => prev.filter(item => item.id !== id));
      alert('Medicina eliminata!');
    }
  };

  const handleInvite = async () => {
    if (!shareData.email.includes('@') || !shareData.nome) {
      alert('Inserisci email e nome validi!');
      return;
    }

    try {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4299e1;">MediConnect - Invito</h1>
          <p>Ciao ${shareData.nome},</p>
          <p>Sei stato invitato a utilizzare MediConnect per monitorare i dati sanitari.</p>
          <p>Ruolo: ${shareData.ruolo}</p>
          <p>Scarica l'app e inizia subito!</p>
        </div>
      `;

      await sendEmail({
        to: shareData.email,
        subject: 'Invito MediConnect',
        html: emailHtml
      });

      setSharedWith(prev => [...prev, {
        email: shareData.email,
        nome: shareData.nome,
        ruolo: shareData.ruolo,
        invitedDate: new Date().toLocaleString('it-IT'),
        status: 'Invitato'
      }]);

      setShowInviteModal(false);
      alert('Invito inviato con successo! Controlla la console per i dettagli.');
      
    } catch (error) {
      alert('Errore invio invito: ' + error.message);
    }

    setShareData({
      email: '',
      nome: '',
      ruolo: 'medico',
      startDate: '',
      endDate: '',
      includeData: { pressione: true, battiti: true, saturazione: true, glicemia: true, temperatura: true, sintomi: true, medicine: true }
    });
  };

  const handleShare = async () => {
    if (!shareData.email.includes('@')) {
      alert('Inserisci un email valida!');
      return;
    }

    try {
      let dataToShare = medicalData;
      if (shareData.startDate || shareData.endDate) {
        dataToShare = medicalData.filter(entry => {
          const entryDate = new Date(entry.date);
          const start = shareData.startDate ? new Date(shareData.startDate) : new Date('1900-01-01');
          const end = shareData.endDate ? new Date(shareData.endDate) : new Date('2100-12-31');
          return entryDate >= start && entryDate <= end;
        });
      }

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4299e1;">Dati Medici Condivisi</h1>
          <p>Hai ricevuto nuovi dati medici da MediConnect.</p>
          <p>Misurazioni: ${dataToShare.length}</p>
          <p>Medicine: ${shareData.includeData.medicine ? medicines.length : 0}</p>
          <p>Periodo: ${shareData.startDate && shareData.endDate ? 
            shareData.startDate + ' - ' + shareData.endDate : 'Tutti i dati'}</p>
        </div>
      `;

      await sendEmail({
        to: shareData.email,
        subject: 'Dati Medici - MediConnect',
        html: emailHtml
      });

      const shareInfo = {
        email: shareData.email,
        dataCount: dataToShare.length,
        medicineCount: shareData.includeData.medicine ? medicines.length : 0,
        dateRange: shareData.startDate && shareData.endDate ? 
          shareData.startDate + ' - ' + shareData.endDate : 'Tutti i dati',
        sharedDate: new Date().toLocaleString('it-IT'),
        status: 'Dati condivisi'
      };

      setSharedWith(prev => prev.map(item => 
        item.email === shareData.email ? { ...item, ...shareInfo } : item
      ));
      
      setShowShareModal(false);
      alert('Dati condivisi con successo! Controlla la console per i dettagli.');

    } catch (error) {
      alert('Errore condivisione: ' + error.message);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    let content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>MediConnect - Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .header { text-align: center; margin-bottom: 30px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>MediConnect - Report Medico</h1>
          <p>Generato il ${new Date().toLocaleDateString('it-IT')}</p>
        </div>
    `;

    if (printOptions.includeHistory) {
      content += '<h2>Storico Misurazioni</h2><table><tr><th>Data</th><th>Ora</th><th>Pressione</th><th>Battiti</th><th>Saturazione</th><th>Glicemia</th><th>Temperatura</th><th>Note</th></tr>';
      medicalData.forEach(entry => {
        content += `<tr>
          <td>${new Date(entry.date).toLocaleDateString('it-IT')}</td>
          <td>${entry.time}</td>
          <td>${entry.pressione || '-'}</td>
          <td>${entry.battiti || '-'}</td>
          <td>${entry.saturazione || '-'}</td>
          <td>${entry.glicemia || '-'}</td>
          <td>${entry.temperatura || '-'}</td>
          <td>${entry.sintomi || '-'}</td>
        </tr>`;
      });
      content += '</table>';
    }

    if (printOptions.includeCharts) {
      content += '<h2>Grafici</h2><p>I grafici sono disponibili nella versione digitale dell\'app.</p>';
    }

    content += '</body></html>';
    
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
    setShowPrintModal(false);
  };

  const filteredMedicalData = filterDate ? 
    medicalData.filter(entry => entry.date === filterDate) : 
    medicalData;

  const chartData = medicalData.slice(-10).reverse().map(entry => ({
    date: new Date(entry.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }),
    pressione_sys: entry.pressione ? parseInt(entry.pressione.split('/')[0]) : null,
    pressione_dia: entry.pressione ? parseInt(entry.pressione.split('/')[1]) : null,
    battiti: entry.battiti ? parseInt(entry.battiti) : null,
    saturazione: entry.saturazione ? parseInt(entry.saturazione) : null,
    glicemia: entry.glicemia ? parseInt(entry.glicemia) : null,
    temperatura: entry.temperatura ? parseFloat(entry.temperatura) : null
  }));

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '25px',
      marginBottom: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#2d3748',
      textAlign: 'center',
      margin: '0 0 10px 0'
    },
    subtitle: {
      fontSize: '1rem',
      color: '#4a5568',
      textAlign: 'center',
      marginBottom: '20px'
    },
    tabContainer: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    tab: {
      backgroundColor: '#f7fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '10px 15px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    activeTab: {
      backgroundColor: '#4299e1',
      color: 'white'
    },
    formGrid: {
      display: 'grid',
      gap: '15px',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      marginBottom: '20px'
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
      marginBottom: '5px',
      gap: '5px'
    },
    input: {
      padding: '10px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px'
    },
    textarea: {
      padding: '10px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      minHeight: '80px',
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif'
    },
    select: {
      padding: '10px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px'
    },
    button: {
      backgroundColor: '#4299e1',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 20px',
      fontSize: '14px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    buttonSuccess: {
      backgroundColor: '#48bb78',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 15px',
      fontSize: '14px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    buttonDanger: {
      backgroundColor: '#e53e3e',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '6px 10px',
      fontSize: '12px',
      cursor: 'pointer'
    },
    buttonSecondary: {
      backgroundColor: '#a0aec0',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '6px 10px',
      fontSize: '12px',
      cursor: 'pointer'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '25px',
      width: '100%',
      maxWidth: '500px',
      maxHeight: '80vh',
      overflow: 'auto'
    },
    dataCard: {
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '10px',
      padding: '15px',
      marginBottom: '10px',
      position: 'relative'
    },
    actionButtons: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      display: 'flex',
      gap: '5px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px',
      color: '#718096'
    }
  };

  return (
    <div style={styles.container}>
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        
        {/* Header */}
        <div style={styles.card}>
          <h1 style={styles.title}>🏥 MediConnect</h1>
          <p style={styles.subtitle}>Monitora la tua salute con semplicità</p>
          
          <div style={styles.tabContainer}>
            {[
              {id: 'insert', icon: Send, label: 'Inserisci'},
              {id: 'medicines', icon: Pill, label: 'Medicine'},
              {id: 'history', icon: Activity, label: 'Storico'},
              {id: 'charts', icon: TrendingUp, label: 'Grafici'},
              {id: 'share', icon: Share2, label: 'Condividi'}
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab.id ? styles.activeTab : {})
                }}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Insert Tab */}
        {activeTab === 'insert' && (
          <div style={styles.card}>
            <h2>{editingId ? 'Modifica Misurazione' : 'Inserisci Dati'}</h2>
            
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <Calendar size={16} />
                  Data
                </label>
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) => handleInputChange('data', e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <Clock size={16} />
                  Ora
                </label>
                <input
                  type="time"
                  value={formData.ora}
                  onChange={(e) => handleInputChange('ora', e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <Heart size={16} />
                  Pressione
                </label>
                <input
                  type="text"
                  placeholder="es. 120/80"
                  value={formData.pressione}
                  onChange={(e) => handleInputChange('pressione', e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <Activity size={16} />
                  Battiti (bpm)
                </label>
                <input
                  type="number"
                  placeholder="es. 72"
                  value={formData.battiti}
                  onChange={(e) => handleInputChange('battiti', e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <Droplet size={16} />
                  Saturazione O2 (%)
                </label>
                <input
                  type="number"
                  placeholder="es. 98"
                  min="0"
                  max="100"
                  value={formData.saturazione}
                  onChange={(e) => handleInputChange('saturazione', e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <Droplet size={16} />
                  Glicemia (mg/dL)
                </label>
                <input
                  type="number"
                  placeholder="es. 95"
                  value={formData.glicemia}
                  onChange={(e) => handleInputChange('glicemia', e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <Thermometer size={16} />
                  Temperatura (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="es. 36.5"
                  value={formData.temperatura}
                  onChange={(e) => handleInputChange('temperatura', e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={{...styles.inputGroup, gridColumn: '1 / -1'}}>
                <label style={styles.label}>
                  <Activity size={16} />
                  Sintomi e Note
                </label>
                <textarea
                  placeholder="Descrivi eventuali sintomi..."
                  value={formData.sintomi}
                  onChange={(e) => handleInputChange('sintomi', e.target.value)}
                  style={styles.textarea}
                />
              </div>
            </div>

            <button onClick={handleSubmit} style={styles.button}>
              <Send size={16} />
              {editingId ? 'Aggiorna' : 'Salva'}
            </button>
          </div>
        )}

        {/* Medicines Tab */}
        {activeTab === 'medicines' && (
          <div style={styles.card}>
            <h2>{editingMedicine ? 'Modifica Medicina' : 'Aggiungi Medicina'}</h2>
            
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <Pill size={16} />
                  Nome *
                </label>
                <input
                  type="text"
                  placeholder="es. Enalapril"
                  value={medicineData.nome}
                  onChange={(e) => handleMedicineChange('nome', e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <Activity size={16} />
                  Dosaggio *
                </label>
                <input
                  type="text"
                  placeholder="es. 10mg"
                  value={medicineData.dosaggio}
                  onChange={(e) => handleMedicineChange('dosaggio', e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <Clock size={16} />
                  Orario *
                </label>
                <input
                  type="time"
                  value={medicineData.ora}
                  onChange={(e) => handleMedicineChange('ora', e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <Calendar size={16} />
                  Frequenza
                </label>
                <select
                  value={medicineData.frequenza}
                  onChange={(e) => handleMedicineChange('frequenza', e.target.value)}
                  style={styles.select}
                >
                  <option value="quotidiana">Quotidiana</option>
                  <option value="bigiornaliera">Due volte al giorno</option>
                  <option value="settimanale">Settimanale</option>
                  <option value="secondo_necessità">Al bisogno</option>
                </select>
              </div>

              <div style={{...styles.inputGroup, gridColumn: '1 / -1'}}>
                <label style={styles.label}>
                  <Activity size={16} />
                  Note
                </label>
                <textarea
                  placeholder="es. A stomaco pieno..."
                  value={medicineData.note}
                  onChange={(e) => handleMedicineChange('note', e.target.value)}
                  style={styles.textarea}
                />
              </div>
            </div>

            <button onClick={handleMedicineSubmit} style={styles.buttonSuccess}>
              <Plus size={16} />
              {editingMedicine ? 'Aggiorna' : 'Aggiungi'}
            </button>

            <div style={{marginTop: '20px'}}>
              <h3>Medicine ({medicines.length})</h3>
              {medicines.length === 0 ? (
                <div style={styles.emptyState}>
                  <Pill size={48} />
                  <p>Nessuna medicina registrata</p>
                </div>
              ) : (
                medicines.map(medicine => (
                  <div key={medicine.id} style={styles.dataCard}>
                    <div style={styles.actionButtons}>
                      <button
                        onClick={() => editMedicine(medicine.id)}
                        style={styles.buttonSecondary}
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => deleteMedicine(medicine.id)}
                        style={styles.buttonDanger}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <h4>{medicine.nome} - {medicine.dosaggio}</h4>
                    <p>Orario: {medicine.ora} | Frequenza: {medicine.frequenza}</p>
                    {medicine.note && <p><em>{medicine.note}</em></p>}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div style={styles.card}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h2>Storico ({filteredMedicalData.length}/{medicalData.length})</h2>
              <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                <Filter size={16} />
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  style={styles.input}
                />
                {filterDate && (
                  <button onClick={() => setFilterDate('')} style={styles.buttonDanger}>
                    Reset
                  </button>
                )}
                <button onClick={() => setShowPrintModal(true)} style={styles.button}>
                  <Printer size={16} />
                  Stampa
                </button>
              </div>
            </div>
            
            {filteredMedicalData.length === 0 ? (
              <div style={styles.emptyState}>
                <Activity size={48} />
                <p>{filterDate ? 'Nessun dato per questa data' : 'Inizia il monitoraggio'}</p>
              </div>
            ) : (
              filteredMedicalData.map(entry => (
                <div key={entry.id} style={styles.dataCard}>
                  <div style={styles.actionButtons}>
                    <button onClick={() => editData(entry.id)} style={styles.buttonSecondary}>
                      <Edit2 size={12} />
                    </button>
                    <button onClick={() => deleteData(entry.id)} style={styles.buttonDanger}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                  
                  <div style={{marginBottom: '10px'}}>
                    <strong>{new Date(entry.date).toLocaleDateString('it-IT')} - {entry.time}</strong>
                  </div>
                  
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px'}}>
                    {entry.pressione && <div><strong>Pressione:</strong> {entry.pressione}</div>}
                    {entry.battiti && <div><strong>Battiti:</strong> {entry.battiti} bpm</div>}
                    {entry.saturazione && <div><strong>Saturazione:</strong> {entry.saturazione}%</div>}
                    {entry.glicemia && <div><strong>Glicemia:</strong> {entry.glicemia} mg/dL</div>}
                    {entry.temperatura && <div><strong>Temperatura:</strong> {entry.temperatura}°C</div>}
                  </div>
                  
                  {entry.sintomi && (
                    <div style={{marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px'}}>
                      <strong>Note:</strong> {entry.sintomi}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Charts Tab */}
        {activeTab === 'charts' && (
          <div style={styles.card}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h2>Grafici e Andamenti</h2>
              <button onClick={() => setShowPrintModal(true)} style={styles.button}>
                <Printer size={16} />
                Stampa Grafici
              </button>
            </div>
            
            <div style={{display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap'}}>
              {[
                {id: 'pressione', icon: Heart, label: 'Pressione'},
                {id: 'battiti', icon: Activity, label: 'Battiti'},
                {id: 'saturazione', icon: Droplet, label: 'Saturazione'},
                {id: 'glicemia', icon: Droplet, label: 'Glicemia'},
                {id: 'temperatura', icon: Thermometer, label: 'Temperatura'}
              ].map(chart => (
                <button
                  key={chart.id}
                  onClick={() => setChartType(chart.id)}
                  style={{
                    ...styles.tab,
                    ...(chartType === chart.id ? styles.activeTab : {})
                  }}
                >
                  <chart.icon size={16} />
                  {chart.label}
                </button>
              ))}
            </div>

            {chartData.length === 0 ? (
              <div style={styles.emptyState}>
                <BarChart3 size={48} />
                <p>Aggiungi dati per visualizzare i grafici</p>
              </div>
            ) : (
              <div style={{height: '400px', width: '100%'}}>
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'pressione' ? (
                    <RechartsLineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="pressione_sys" 
                        stroke="#e53e3e" 
                        name="Sistolica"
                        connectNulls={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="pressione_dia" 
                        stroke="#3182ce" 
                        name="Diastolica"
                        connectNulls={false}
                      />
                    </RechartsLineChart>
                  ) : chartType === 'battiti' ? (
                    <RechartsLineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="battiti" 
                        stroke="#e53e3e" 
                        name="Battiti (bpm)"
                        connectNulls={false}
                      />
                    </RechartsLineChart>
                  ) : chartType === 'saturazione' ? (
                    <RechartsLineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[90, 100]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="saturazione" 
                        stroke="#e53e3e" 
                        name="Saturazione O2 (%)"
                        connectNulls={false}
                      />
                    </RechartsLineChart>
                  ) : chartType === 'glicemia' ? (
                    <RechartsBarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="glicemia" fill="#3182ce" name="Glicemia (mg/dL)" />
                    </RechartsBarChart>
                  ) : (
                    <RechartsLineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[35, 40]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="temperatura" 
                        stroke="#dd6b20" 
                        name="Temperatura (°C)"
                        connectNulls={false}
                      />
                    </RechartsLineChart>
                  )}
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Share Tab */}
        {activeTab === 'share' && (
          <div style={styles.card}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h2>Gestione Condivisioni</h2>
              <div style={{display: 'flex', gap: '10px'}}>
                <button onClick={() => setShowInviteModal(true)} style={styles.buttonSuccess}>
                  <UserPlus size={16} />
                  Invita
                </button>
                <button onClick={() => setShowShareModal(true)} style={styles.button}>
                  <Share2 size={16} />
                  Condividi
                </button>
              </div>
            </div>

            {sharedWith.length === 0 ? (
              <div style={styles.emptyState}>
                <Users size={48} />
                <p>Nessuna condivisione attiva</p>
              </div>
            ) : (
              sharedWith.map((share, index) => (
                <div key={index} style={styles.dataCard}>
                  <h4>{share.nome || share.email.split('@')[0]} ({share.ruolo})</h4>
                  <p>Email: {share.email}</p>
                  <p>Status: {share.status}</p>
                  <p>Data: {share.invitedDate || share.sharedDate}</p>
                  {share.dataCount && <p>Dati condivisi: {share.dataCount} misurazioni</p>}
                </div>
              ))
            )}
          </div>
        )}

        {/* Modals */}
        {showInviteModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h3>Invita una Persona</h3>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <Mail size={16} />
                  Email *
                </label>
                <input
                  type="email"
                  placeholder="dott.rossi@ospedale.it"
                  value={shareData.email}
                  onChange={(e) => setShareData(prev => ({ ...prev, email: e.target.value }))}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <Users size={16} />
                  Nome *
                </label>
                <input
                  type="text"
                  placeholder="Dr. Mario Rossi"
                  value={shareData.nome}
                  onChange={(e) => setShareData(prev => ({ ...prev, nome: e.target.value }))}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Ruolo</label>
                <select
                  value={shareData.ruolo}
                  onChange={(e) => setShareData(prev => ({ ...prev, ruolo: e.target.value }))}
                  style={styles.select}
                >
                  <option value="medico">Medico</option>
                  <option value="familiare">Familiare</option>
                  <option value="caregiver">Caregiver</option>
                  <option value="altro">Altro</option>
                </select>
              </div>

              <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px'}}>
                <button onClick={() => setShowInviteModal(false)} style={styles.buttonSecondary}>
                  Annulla
                </button>
                <button onClick={handleInvite} style={styles.buttonSuccess}>
                  <Send size={16} />
                  Invia Invito
                </button>
              </div>
            </div>
          </div>
        )}

        {showShareModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h3>Condividi Dati</h3>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email destinatario</label>
                <input
                  type="email"
                  placeholder="Inserisci email"
                  value={shareData.email}
                  onChange={(e) => setShareData(prev => ({ ...prev, email: e.target.value }))}
                  style={styles.input}
                />
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Data inizio</label>
                  <input
                    type="date"
                    value={shareData.startDate}
                    onChange={(e) => setShareData(prev => ({ ...prev, startDate: e.target.value }))}
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Data fine</label>
                  <input
                    type="date"
                    value={shareData.endDate}
                    onChange={(e) => setShareData(prev => ({ ...prev, endDate: e.target.value }))}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px'}}>
                <button onClick={() => setShowShareModal(false)} style={styles.buttonSecondary}>
                  Annulla
                </button>
                <button onClick={handleShare} style={styles.buttonSuccess}>
                  <Send size={16} />
                  Condividi
                </button>
              </div>
            </div>
          </div>
        )}

        {showPrintModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h3>Opzioni di Stampa</h3>
              
              <div style={{marginBottom: '15px'}}>
                <label style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px'}}>
                  <input
                    type="checkbox"
                    checked={printOptions.includeHistory}
                    onChange={(e) => setPrintOptions(prev => ({ ...prev, includeHistory: e.target.checked }))}
                  />
                  Includi Storico Misurazioni
                </label>
                
                <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <input
                    type="checkbox"
                    checked={printOptions.includeCharts}
                    onChange={(e) => setPrintOptions(prev => ({ ...prev, includeCharts: e.target.checked }))}
                  />
                  Includi Grafici (solo riferimenti)
                </label>
              </div>

              <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
                <button onClick={() => setShowPrintModal(false)} style={styles.buttonSecondary}>
                  Annulla
                </button>
                <button onClick={handlePrint} style={styles.button}>
                  <Printer size={16} />
                  Stampa
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