import React, { useState, useEffect } from 'react';
import { Heart, Thermometer, Droplet, Activity, Send, Share2, Calendar, Filter, UserPlus, Mail, Eye, Users, Pill, Clock, TrendingUp, Edit2, Trash2, Plus, BarChart3, LineChart, PieChart } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts';

const MedicalApp = () => {
  const [activeTab, setActiveTab] = useState('insert');
  const [formData, setFormData] = useState({
    pressione: '',
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
      glicemia: true,
      temperatura: true,
      sintomi: true,
      medicine: true
    }
  });
  const [showShareModal, setShowShareModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [sharedWith, setSharedWith] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [chartType, setChartType] = useState('pressione');

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
      },
      {
        id: 4,
        date: '2025-08-28',
        time: '19:45',
        pressione: '122/79',
        glicemia: '88',
        temperatura: '36.7',
        sintomi: 'Tutto nella norma'
      },
      {
        id: 5,
        date: '2025-08-27',
        time: '08:30',
        pressione: '115/75',
        glicemia: '90',
        temperatura: '36.3',
        sintomi: 'Sensazione di benessere'
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMedicineChange = (field, value) => {
    setMedicineData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.pressione && !formData.glicemia && !formData.temperatura) {
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
      alert('Dati aggiornati con successo! ✨');
    } else {
      const newEntry = {
        id: Date.now(),
        date: formData.data,
        time: formData.ora,
        pressione: formData.pressione,
        glicemia: formData.glicemia,
        temperatura: formData.temperatura,
        sintomi: formData.sintomi
      };

      setMedicalData(prev => [newEntry, ...prev]);
      alert('Dati salvati con successo! 🎉');
    }

    setFormData({ 
      pressione: '', 
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
      alert('Medicina aggiornata con successo! 💊');
    } else {
      const newMedicine = {
        id: Date.now(),
        ...medicineData
      };

      setMedicines(prev => [...prev, newMedicine]);
      alert('Medicina aggiunta con successo! 💊');
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
    if (window.confirm('Sei sicuro di voler eliminare questa misurazione?')) {
      setMedicalData(prev => prev.filter(item => item.id !== id));
      alert('Misurazione eliminata! 🗑️');
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
      setActiveTab('medicines');
    }
  };

  const deleteMedicine = (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa medicina?')) {
      setMedicines(prev => prev.filter(item => item.id !== id));
      alert('Medicina eliminata! 🗑️');
    }
  };

  const handleInvite = () => {
    if (!shareData.email.includes('@') || !shareData.nome) {
      alert('Inserisci email e nome validi!');
      return;
    }

    const inviteInfo = {
      email: shareData.email,
      nome: shareData.nome,
      ruolo: shareData.ruolo,
      invitedDate: new Date().toLocaleString('it-IT'),
      status: 'Invitato'
    };

    setSharedWith(prev => [inviteInfo, ...prev]);
    setShowInviteModal(false);
    
    // Simula invio email
    alert(`✅ Invito inviato a ${shareData.nome} (${shareData.email})!\n\n📧 Email inviata con:\n- Link per scaricare MediConnect\n- Istruzioni per l'accesso\n- Spiegazione dell'app`);
    
    setShareData({
      email: '',
      nome: '',
      ruolo: 'medico',
      startDate: '',
      endDate: '',
      includeData: { pressione: true, glicemia: true, temperatura: true, sintomi: true, medicine: true }
    });
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
      medicineCount: shareData.includeData.medicine ? medicines.length : 0,
      dateRange: shareData.startDate && shareData.endDate ? 
        `${shareData.startDate} - ${shareData.endDate}` : 'Tutti i dati',
      sharedDate: new Date().toLocaleString('it-IT')
    };

    setSharedWith(prev => prev.map(item => 
      item.email === shareData.email 
        ? { ...item, ...shareInfo, status: 'Dati condivisi' }
        : item
    ));
    
    setShowShareModal(false);
    alert(`✅ Dati condivisi con ${shareInfo.email}!\n📊 ${shareInfo.dataCount} misurazioni\n💊 ${shareInfo.medicineCount} medicine`);
  };

  const filteredMedicalData = filterDate ? 
    medicalData.filter(entry => entry.date === filterDate) : 
    medicalData;

  // Prepara dati per grafici
  const chartData = medicalData.slice(-10).reverse().map(entry => ({
    date: new Date(entry.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }),
    pressione_sys: entry.pressione ? parseInt(entry.pressione.split('/')[0]) : null,
    pressione_dia: entry.pressione ? parseInt(entry.pressione.split('/')[1]) : null,
    glicemia: entry.glicemia ? parseInt(entry.glicemia) : null,
    temperatura: entry.temperatura ? parseFloat(entry.temperatura) : null
  })).filter(item => item.pressione_sys || item.glicemia || item.temperatura);

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
    tabContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginBottom: '20px',
      justifyContent: 'center'
    },
    tab: {
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      padding: '12px 20px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
      fontSize: '14px',
      fontWeight: '600'
    },
    activeTab: {
      backgroundColor: '#4299e1',
      color: 'white',
      borderColor: '#4299e1',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(66, 153, 225, 0.3)'
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
    buttonDanger: {
      backgroundColor: '#e53e3e',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '14px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    buttonSecondary: {
      backgroundColor: '#a0aec0',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '14px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
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
    select: {
      padding: '14px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      cursor: 'pointer'
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
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      position: 'relative'
    },
    medicineCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '15px',
      borderLeft: '5px solid #805ad5',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      position: 'relative'
    },
    actionButtons: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      display: 'flex',
      gap: '8px'
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
    chartContainer: {
      height: '400px',
      marginTop: '20px'
    },
    chartButtons: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: 'rgba(113, 128, 150, 0.1)',
      borderRadius: '16px',
      color: '#718096'
    }
  };

  const renderInsertTab = () => (
    <div style={styles.card}>
      <h2 style={{...styles.historyTitle, marginBottom: '20px'}}>
        📊 {editingId ? 'Modifica Misurazione' : 'Inserisci Nuovi Dati'}
      </h2>
      
      <div style={styles.formGrid}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            <Calendar size={16} />
            Data misurazione
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
            Ora misurazione
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
            <Heart size={16} color="#e53e3e" />
            Pressione Arteriosa
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
            <Droplet size={16} color="#3182ce" />
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
            <Thermometer size={16} color="#dd6b20" />
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
            <Activity size={16} color="#805ad5" />
            Sintomi e Note
          </label>
          <textarea
            placeholder="Descrivi eventuali sintomi o note..."
            value={formData.sintomi}
            onChange={(e) => handleInputChange('sintomi', e.target.value)}
            style={styles.textarea}
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        style={{...styles.buttonPrimary, width: '100%', fontSize: '18px', padding: '16px'}}
      >
        <Send size={20} />
        {editingId ? 'Aggiorna Dati' : 'Salva Dati Medici'}
      </button>

      {editingId && (
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              pressione: '', 
              glicemia: '', 
              temperatura: '', 
              sintomi: '',
              data: new Date().toISOString().split('T')[0],
              ora: new Date().toTimeString().slice(0, 5)
            });
          }}
          style={{...styles.buttonSecondary, width: '100%', marginTop: '10px'}}
        >
          Annulla Modifica
        </button>
      )}
    </div>
  );

  const renderMedicinesTab = () => (
    <div style={styles.card}>
      <h2 style={{...styles.historyTitle, marginBottom: '20px'}}>
        💊 {editingMedicine ? 'Modifica Medicina' : 'Aggiungi Medicina'}
      </h2>
      
      <div style={styles.formGrid}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            <Pill size={16} />
            Nome Medicina *
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
            Orario assunzione *
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
            <option value="secondo_necessità">Secondo necessità</option>
          </select>
        </div>

        <div style={{...styles.inputGroup, gridColumn: '1 / -1'}}>
          <label style={styles.label}>
            <Activity size={16} />
            Note aggiuntive
          </label>
          <textarea
            placeholder="es. A stomaco pieno, durante i pasti..."
            value={medicineData.note}
            onChange={(e) => handleMedicineChange('note', e.target.value)}
            style={styles.textarea}
          />
        </div>
      </div>

      <button
        onClick={handleMedicineSubmit}
        style={{...styles.buttonSuccess, width: '100%', fontSize: '18px', padding: '16px'}}
      >
        <Plus size={20} />
        {editingMedicine ? 'Aggiorna Medicina' : 'Aggiungi Medicina'}
      </button>

      {editingMedicine && (
        <button
          onClick={() => {
            setEditingMedicine(null);
            setMedicineData({
              nome: '',
              dosaggio: '',
              ora: '',
              frequenza: 'quotidiana',
              note: ''
            });
          }}
          style={{...styles.buttonSecondary, width: '100%', marginTop: '10px'}}
        >
          Annulla Modifica
        </button>
      )}

      {/* Lista Medicine */}
      <div style={{marginTop: '30px'}}>
        <h3 style={{...styles.historyTitle, marginBottom: '20px', fontSize: '1.3rem'}}>
          📋 Le Tue Medicine ({medicines.length})
        </h3>
        
        {medicines.length === 0 ? (
          <div style={styles.emptyState}>
            <Pill size={48} color="#a0aec0" style={{marginBottom: '20px'}} />
            <h3 style={{color: '#4a5568', marginBottom: '10px'}}>Nessuna medicina registrata</h3>
            <p style={{color: '#718096'}}>Aggiungi la tua prima medicina per iniziare il monitoraggio</p>
          </div>
        ) : (
          medicines.map(medicine => (
            <div key={medicine.id} style={styles.medicineCard}>
              <div style={styles.actionButtons}>
                <button
                  onClick={() => editMedicine(medicine.id)}
                  style={styles.buttonSecondary}
                  title="Modifica"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => deleteMedicine(medicine.id)}
                  style={styles.buttonDanger}
                  title="Elimina"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px'}}>
                <div style={{
                  backgroundColor: '#805ad5',
                  color: 'white',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Pill size={24} />
                </div>
                <div>
                  <h4 style={{margin: '0 0 5px 0', fontSize: '18px', fontWeight: 'bold', color: '#2d3748'}}>
                    {medicine.nome}
                  </h4>
                  <p style={{margin: 0, color: '#718096', fontSize: '14px'}}>
                    {medicine.dosaggio} • {medicine.frequenza}
                  </p>
                </div>
              </div>

              <div style={styles.valuesGrid}>
                <div style={{...styles.valueCard, borderTop: '3px solid #805ad5'}}>
                  <div style={styles.valueLabel}>🕐 Orario</div>
                  <div style={{...styles.valueNumber, color: '#805ad5'}}>{medicine.ora}</div>
                </div>
                <div style={{...styles.valueCard, borderTop: '3px solid #48bb78'}}>
                  <div style={styles.valueLabel}>📅 Frequenza</div>
                  <div style={{...styles.valueNumber, fontSize: '14px', color: '#48bb78'}}>
                    {medicine.frequenza.replace('_', ' ')}
                  </div>
                </div>
              </div>

              {medicine.note && (
                <div style={{...styles.symptomsCard, backgroundColor: '#f0fff4', borderColor: '#9ae6b4'}}>
                  <div style={{...styles.valueLabel, color: '#2f855a', marginBottom: '8px'}}>
                    📝 Note:
                  </div>
                  <div style={{color: '#2d3748', lineHeight: '1.5'}}>
                    {medicine.note}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderHistoryTab = () => (
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
              style={styles.buttonDanger}
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
              <div style={styles.actionButtons}>
                <button
                  onClick={() => editData(entry.id)}
                  style={styles.buttonSecondary}
                  title="Modifica"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => deleteData(entry.id)}
                  style={styles.buttonDanger}
                  title="Elimina"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div style={styles.dateTime}>
                <Calendar size={16} />
                <span>{new Date(entry.date).toLocaleDateString('it-IT', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
                <span>•</span>
                <Clock size={16} />
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
  );

  const renderChartsTab = () => (
    <div style={styles.card}>
      <h2 style={{...styles.historyTitle, marginBottom: '20px'}}>📈 Grafici e Andamenti</h2>
      
      <div style={styles.chartButtons}>
        <button
          onClick={() => setChartType('pressione')}
          style={{
            ...styles.tab,
            ...(chartType === 'pressione' ? styles.activeTab : {})
          }}
        >
          <Heart size={16} />
          Pressione
        </button>
        <button
          onClick={() => setChartType('glicemia')}
          style={{
            ...styles.tab,
            ...(chartType === 'glicemia' ? styles.activeTab : {})
          }}
        >
          <Droplet size={16} />
          Glicemia
        </button>
        <button
          onClick={() => setChartType('temperatura')}
          style={{
            ...styles.tab,
            ...(chartType === 'temperatura' ? styles.activeTab : {})
          }}
        >
          <Thermometer size={16} />
          Temperatura
        </button>
      </div>

      {chartData.length === 0 ? (
        <div style={styles.emptyState}>
          <BarChart3 size={48} color="#a0aec0" style={{marginBottom: '20px'}} />
          <h3 style={{color: '#4a5568', marginBottom: '10px'}}>Nessun dato per i grafici</h3>
          <p style={{color: '#718096'}}>Aggiungi alcune misurazioni per visualizzare i grafici</p>
        </div>
      ) : (
        <div style={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'pressione' ? (
              <RechartsLineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#718096"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#718096"
                  style={{ fontSize: '12px' }}
                  domain={['dataMin - 10', 'dataMax + 10']}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="pressione_sys" 
                  stroke="#e53e3e" 
                  strokeWidth={3}
                  name="Sistolica"
                  connectNulls={false}
                  dot={{ fill: '#e53e3e', strokeWidth: 2, r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="pressione_dia" 
                  stroke="#3182ce" 
                  strokeWidth={3}
                  name="Diastolica"
                  connectNulls={false}
                  dot={{ fill: '#3182ce', strokeWidth: 2, r: 6 }}
                />
              </RechartsLineChart>
            ) : chartType === 'glicemia' ? (
              <RechartsBarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#718096"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#718096"
                  style={{ fontSize: '12px' }}
                  domain={['dataMin - 10', 'dataMax + 10']}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar 
                  dataKey="glicemia" 
                  fill="#3182ce"
                  name="Glicemia (mg/dL)"
                  radius={[4, 4, 0, 0]}
                />
              </RechartsBarChart>
            ) : (
              <RechartsLineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#718096"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#718096"
                  style={{ fontSize: '12px' }}
                  domain={[35, 40]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="temperatura" 
                  stroke="#dd6b20" 
                  strokeWidth={3}
                  name="Temperatura (°C)"
                  connectNulls={false}
                  dot={{ fill: '#dd6b20', strokeWidth: 2, r: 6 }}
                />
              </RechartsLineChart>
            )}
          </ResponsiveContainer>
        </div>
      )}

      {/* Statistiche rapide */}
      <div style={{marginTop: '30px'}}>
        <h3 style={{...styles.historyTitle, fontSize: '1.3rem', marginBottom: '15px'}}>
          📊 Statistiche Rapide
        </h3>
        <div style={styles.valuesGrid}>
          {chartType === 'pressione' && (
            <>
              <div style={{...styles.valueCard, borderTop: '3px solid #e53e3e'}}>
                <div style={styles.valueLabel}>📈 Media Sistolica</div>
                <div style={{...styles.valueNumber, color: '#e53e3e'}}>
                  {chartData.length > 0 
                    ? Math.round(chartData.filter(d => d.pressione_sys).reduce((a, b) => a + b.pressione_sys, 0) / chartData.filter(d => d.pressione_sys).length)
                    : '-'
                  }
                </div>
                <div style={styles.valueUnit}>mmHg</div>
              </div>
              <div style={{...styles.valueCard, borderTop: '3px solid #3182ce'}}>
                <div style={styles.valueLabel}>📉 Media Diastolica</div>
                <div style={{...styles.valueNumber, color: '#3182ce'}}>
                  {chartData.length > 0 
                    ? Math.round(chartData.filter(d => d.pressione_dia).reduce((a, b) => a + b.pressione_dia, 0) / chartData.filter(d => d.pressione_dia).length)
                    : '-'
                  }
                </div>
                <div style={styles.valueUnit}>mmHg</div>
              </div>
            </>
          )}
          {chartType === 'glicemia' && (
            <>
              <div style={{...styles.valueCard, borderTop: '3px solid #3182ce'}}>
                <div style={styles.valueLabel}>📈 Media Glicemia</div>
                <div style={{...styles.valueNumber, color: '#3182ce'}}>
                  {chartData.length > 0 
                    ? Math.round(chartData.filter(d => d.glicemia).reduce((a, b) => a + b.glicemia, 0) / chartData.filter(d => d.glicemia).length)
                    : '-'
                  }
                </div>
                <div style={styles.valueUnit}>mg/dL</div>
              </div>
              <div style={{...styles.valueCard, borderTop: '3px solid #48bb78'}}>
                <div style={styles.valueLabel}>🎯 Misurazioni</div>
                <div style={{...styles.valueNumber, color: '#48bb78'}}>
                  {chartData.filter(d => d.glicemia).length}
                </div>
                <div style={styles.valueUnit}>totali</div>
              </div>
            </>
          )}
          {chartType === 'temperatura' && (
            <>
              <div style={{...styles.valueCard, borderTop: '3px solid #dd6b20'}}>
                <div style={styles.valueLabel}>📈 Media Temperatura</div>
                <div style={{...styles.valueNumber, color: '#dd6b20'}}>
                  {chartData.length > 0 
                    ? (chartData.filter(d => d.temperatura).reduce((a, b) => a + b.temperatura, 0) / chartData.filter(d => d.temperatura).length).toFixed(1)
                    : '-'
                  }
                </div>
                <div style={styles.valueUnit}>°C</div>
              </div>
              <div style={{...styles.valueCard, borderTop: '3px solid #805ad5'}}>
                <div style={styles.valueLabel}>🌡️ Variazione</div>
                <div style={{...styles.valueNumber, color: '#805ad5'}}>
                  {chartData.length > 1 ? 
                    `±${((Math.max(...chartData.filter(d => d.temperatura).map(d => d.temperatura)) - Math.min(...chartData.filter(d => d.temperatura).map(d => d.temperatura))).toFixed(1))}` 
                    : '-'
                  }
                </div>
                <div style={styles.valueUnit}>°C</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderShareTab = () => (
    <div style={styles.card}>
      <div style={styles.historyHeader}>
        <h2 style={styles.historyTitle}>👥 Gestione Condivisioni</h2>
        <div style={{display: 'flex', gap: '10px'}}>
          <button
            onClick={() => setShowInviteModal(true)}
            style={styles.buttonSuccess}
          >
            <UserPlus size={18} />
            Invita Persona
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            style={styles.buttonPrimary}
          >
            <Share2 size={18} />
            Condividi Dati
          </button>
        </div>
      </div>

      {sharedWith.length === 0 ? (
        <div style={styles.emptyState}>
          <Users size={48} color="#a0aec0" style={{marginBottom: '20px'}} />
          <h3 style={{color: '#4a5568', marginBottom: '10px'}}>Nessuna condivisione attiva</h3>
          <p style={{color: '#718096'}}>Invita il tuo medico o altre persone per condividere i tuoi dati</p>
        </div>
      ) : (
        <div>
          <h3 style={{...styles.historyTitle, fontSize: '1.3rem', marginBottom: '20px'}}>
            📤 Persone con accesso ai tuoi dati
          </h3>
          {sharedWith.map((share, index) => (
            <div key={index} style={{
              ...styles.dataCard,
              borderLeft: share.status === 'Dati condivisi' ? '5px solid #48bb78' : '5px solid #f6ad55',
              backgroundColor: share.status === 'Dati condivisi' ? 'rgba(72, 187, 120, 0.05)' : 'rgba(246, 173, 85, 0.05)'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px'}}>
                <div>
                  <div style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    {share.ruolo === 'medico' ? '👨‍⚕️' : '👤'} {share.nome || share.email.split('@')[0]}
                    <span style={{
                      backgroundColor: share.status === 'Dati condivisi' ? '#48bb78' : '#f6ad55',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}>
                      {share.status}
                    </span>
                  </div>
                  <div style={{color: '#718096', marginBottom: '4px'}}>
                    📧 {share.email}
                  </div>
                  <div style={{color: '#718096', marginBottom: '4px'}}>
                    🏷️ {share.ruolo}
                  </div>
                </div>
              </div>

              {share.dataCount !== undefined && (
                <div style={styles.valuesGrid}>
                  <div style={{...styles.valueCard, borderTop: '3px solid #4299e1'}}>
                    <div style={styles.valueLabel}>📊 Misurazioni</div>
                    <div style={{...styles.valueNumber, color: '#4299e1'}}>{share.dataCount}</div>
                    <div style={styles.valueUnit}>condivise</div>
                  </div>
                  <div style={{...styles.valueCard, borderTop: '3px solid #805ad5'}}>
                    <div style={styles.valueLabel}>💊 Medicine</div>
                    <div style={{...styles.valueNumber, color: '#805ad5'}}>{share.medicineCount || 0}</div>
                    <div style={styles.valueUnit}>condivise</div>
                  </div>
                  <div style={{...styles.valueCard, borderTop: '3px solid #48bb78'}}>
                    <div style={styles.valueLabel}>📅 Periodo</div>
                    <div style={{fontSize: '12px', fontWeight: 'bold', color: '#48bb78'}}>
                      {share.dateRange}
                    </div>
                  </div>
                </div>
              )}

              <div style={{color: '#a0aec0', fontSize: '12px', marginTop: '10px'}}>
                🕐 {share.invitedDate || share.sharedDate}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        {/* Header */}
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>🏥 MediConnect</h1>
            <p style={styles.subtitle}>Monitora la tua salute con semplicità e condividila con chi vuoi</p>
          </div>

          {/* Navigation Tabs */}
          <div style={styles.tabContainer}>
            <button
              onClick={() => setActiveTab('insert')}
              style={{
                ...styles.tab,
                ...(activeTab === 'insert' ? styles.activeTab : {})
              }}
            >
              <Send size={16} />
              Inserisci Dati
            </button>
            <button
              onClick={() => setActiveTab('medicines')}
              style={{
                ...styles.tab,
                ...(activeTab === 'medicines' ? styles.activeTab : {})
              }}
            >
              <Pill size={16} />
              Medicine
            </button>
            <button
              onClick={() => setActiveTab('history')}
              style={{
                ...styles.tab,
                ...(activeTab === 'history' ? styles.activeTab : {})
              }}
            >
              <Activity size={16} />
              Storico
            </button>
            <button
              onClick={() => setActiveTab('charts')}
              style={{
                ...styles.tab,
                ...(activeTab === 'charts' ? styles.activeTab : {})
              }}
            >
              <TrendingUp size={16} />
              Grafici
            </button>
            <button
              onClick={() => setActiveTab('share')}
              style={{
                ...styles.tab,
                ...(activeTab === 'share' ? styles.activeTab : {})
              }}
            >
              <Share2 size={16} />
              Condividi
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'insert' && renderInsertTab()}
        {activeTab === 'medicines' && renderMedicinesTab()}
        {activeTab === 'history' && renderHistoryTab()}
        {activeTab === 'charts' && renderChartsTab()}
        {activeTab === 'share' && renderShareTab()}

        {/* Footer */}
        <div style={{...styles.card, textAlign: 'center', color: '#718096'}}>
          <div style={{marginBottom: '10px'}}>
            🔒 <strong>I tuoi dati sono sicuri e privati</strong>
          </div>
          <div style={{fontSize: '14px'}}>
            📱 <strong>Per installare l'app:</strong> Menu Chrome (⋮) → "Aggiungi alla schermata Home"
          </div>
        </div>

        {/* Modal Invito */}
        {showInviteModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h3 style={{...styles.historyTitle, marginBottom: '25px'}}>
                👥 Invita una Persona
              </h3>
              
              <div style={{...styles.inputGroup, marginBottom: '20px'}}>
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

              <div style={{...styles.inputGroup, marginBottom: '20px'}}>
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

              <div style={{...styles.inputGroup, marginBottom: '25px'}}>
                <label style={styles.label}>
                  <Activity size={16} />
                  Ruolo
                </label>
                <select
                  value={shareData.ruolo}
                  onChange={(e) => setShareData(prev => ({ ...prev, ruolo: e.target.value }))}
                  style={styles.select}
                >
                  <option value="medico">👨‍⚕️ Medico</option>
                  <option value="familiare">👨‍👩‍👧‍👦 Familiare</option>
                  <option value="caregiver">🤝 Caregiver</option>
                  <option value="altro">👤 Altro</option>
                </select>
              </div>

              <div style={{
                backgroundColor: '#e6fffa',
                border: '2px solid #4fd1c7',
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '20px'
              }}>
                <div style={{fontWeight: 'bold', color: '#234e52', marginBottom: '8px'}}>
                  📨 Cosa riceverà la persona invitata:
                </div>
                <ul style={{color: '#234e52', margin: 0, paddingLeft: '20px'}}>
                  <li>Link per scaricare MediConnect</li>
                  <li>Istruzioni per accedere ai tuoi dati</li>
                  <li>Spiegazione dell'app e delle funzionalità</li>
                </ul>
              </div>

              <div style={{display: 'flex', gap: '15px', justifyContent: 'flex-end'}}>
                <button
                  onClick={() => setShowInviteModal(false)}
                  style={styles.buttonSecondary}
                >
                  ❌ Annulla
                </button>
                <button
                  onClick={handleInvite}
                  style={styles.buttonSuccess}
                >
                  <Send size={16} />
                  Invia Invito
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Condivisione */}
        {showShareModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h3 style={{...styles.historyTitle, marginBottom: '25px'}}>
                📤 Condividi Dati Medici
              </h3>
              
              <div style={{...styles.inputGroup, marginBottom: '20px'}}>
                <label style={styles.label}>
                  <Mail size={16} />
                  Email destinatario
                </label>
                <input
                  type="email"
                  placeholder="Seleziona dalla lista o inserisci email"
                  value={shareData.email}
                  onChange={(e) => setShareData(prev => ({ ...prev, email: e.target.value }))}
                  style={styles.input}
                />
                {sharedWith.length > 0 && (
                  <div style={{marginTop: '10px'}}>
                    <div style={{fontSize: '12px', color: '#718096', marginBottom: '5px'}}>
                      💡 Seleziona dalla lista:
                    </div>
                    {sharedWith.map((person, index) => (
                      <button
                        key={index}
                        onClick={() => setShareData(prev => ({ ...prev, email: person.email }))}
                        style={{
                          backgroundColor: '#f7fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          margin: '2px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          display: 'inline-block'
                        }}
                      >
                        {person.nome || person.email.split('@')[0]} ({person.email})
                      </button>
                    ))}
                  </div>
                )}
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
                  sintomi: '💭 Sintomi e Note',
                  medicine: '💊 Medicine e Terapie'
                }).map(([key, label]) => (
                  <label
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #e2e8f0',
                      marginBottom: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
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
              <div style={{
                backgroundColor: '#f0fff4',
                border: '2px solid #9ae6b4',
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '20px'
              }}>
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
                    const medicineCount = shareData.includeData.medicine ? medicines.length : 0;
                    return (
                      <>
                        <div>📊 {count} registrazioni mediche</div>
                        <div>💊 {medicineCount} medicine</div>
                      </>
                    );
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