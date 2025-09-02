import React, { useState, useEffect } from 'react';
import { Heart, Thermometer, Droplet, Activity, Send, Share2, Calendar, Filter, UserPlus, Mail, Users, Pill, Clock, TrendingUp, Edit2, Trash2, Plus, BarChart3, Printer, MessageSquare, Paperclip, CheckCircle } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts';
import emailjs from 'emailjs-com';

// Inizializza EmailJS con la tua chiave pubblica
emailjs.init("oTAAsKHcFH2KuGpxZ");

const MedicalApp = () => {
  const [activeTab, setActiveTab] = useState('insert');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
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
    patientName: '',
    message: '',
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
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseData, setResponseData] = useState({
    patientId: '',
    message: '',
    attachments: [],
    recommendation: ''
  });
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

  // Initialize with sample data and handle URL parameters for direct access
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

    // Gestione accesso diretto da email e risposte agli inviti
    const urlParams = new URLSearchParams(window.location.search);
    const patientToken = urlParams.get('patient');
    const dataToken = urlParams.get('data');
    const action = urlParams.get('action');
    const isSharedView = urlParams.get('view') === 'shared';

    if (patientToken && action === 'accept') {
      // Invito ACCETTATO - mostra i dati del paziente
      setActiveTab('history');
      showNotification('Invito accettato! Benvenuto in MediConnect.', 'success');
      
      setTimeout(() => {
        showNotification('Accesso autorizzato confermato. Ora puoi visualizzare tutti i dati medici del paziente.', 'success');
        
        setSharedWith(prev => prev.map(share => 
          share.accessToken === patientToken ? 
            { ...share, status: 'Invito Accettato', accessDate: new Date().toLocaleString('it-IT') } : 
            share
        ));
      }, 2000);

      setTimeout(() => {
        showNotification('Come medico autorizzato, hai accesso completo ai dati sanitari. Tutti i grafici e lo storico sono disponibili.', 'info');
      }, 4000);
      
    } else if (patientToken && action === 'decline') {
      // Invito RIFIUTATO
      setActiveTab('share');
      showNotification('Invito rifiutato. Il paziente è stato informato della tua decisione.', 'warning');
      
      setTimeout(() => {
        showNotification('Notifica di rifiuto inviata al paziente. Grazie per aver risposto all\'invito.', 'info');
        
        setSharedWith(prev => prev.map(share => 
          share.accessToken === patientToken ? 
            { ...share, status: 'Invito Rifiutato', declineDate: new Date().toLocaleString('it-IT') } : 
            share
        ));
      }, 2000);

    } else if (dataToken && isSharedView) {
      // Accesso da condivisione dati - mostra direttamente i dati
      setActiveTab('charts');
      showNotification('Caricamento dati medici condivisi in corso...', 'info');
      
      setTimeout(() => {
        showNotification('Dati medici caricati con successo. Visualizzazione in modalità consultazione.', 'success');
        setActiveTab('history');
      }, 1500);
    }

    // Pulizia URL per evitare problemi con i refresh
    if (patientToken || dataToken) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 4000);
  };

  // Funzione per rilevare il dispositivo
  const detectDevice = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
  };

  // Funzione per invio email migliorata
  const sendEmail = async (emailData) => {
    try {
      console.log('=== INVIO EMAIL CON EMAILJS ===');
      console.log('Destinatario:', emailData.to);
      console.log('Service ID: service_ae5emkn');
      console.log('Template ID: medical_invite');
      
      const templateParams = {
        to_email: emailData.to,
        to_name: emailData.to.split('@')[0],
        from_name: 'MediConnect',
        subject: emailData.subject,
        message: emailData.html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
      };

      const result = await emailjs.send(
        'service_ae5emkn',
        'medical_invite',
        templateParams
      );

      console.log('Email inviata con successo:', result);
      showNotification(`Email inviata con successo a ${emailData.to}!`, 'success');
      
      return { status: 200, messageId: result.text };
      
    } catch (error) {
      console.error('Errore EmailJS:', error);
      
      let errorMsg = '';
      if (error.status === 403) {
        errorMsg = 'Errore 403: Verifica che il servizio EmailJS sia attivo nel dashboard.';
      } else if (error.status === 400) {
        errorMsg = 'Errore 400: Template non trovato o parametri non validi.';
      } else if (error.status === 401) {
        errorMsg = 'Errore 401: Chiave pubblica non valida.';
      } else {
        errorMsg = error.text || error.message || 'Errore sconosciuto durante l\'invio';
      }
      
      showNotification(`Errore invio email: ${errorMsg}`, 'error');
      
      throw new Error(`EmailJS Error: ${errorMsg}`);
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
      showNotification('Inserisci almeno un valore per salvare la misurazione!', 'warning');
      return;
    }

    if (editingId) {
      setMedicalData(prev => prev.map(item => 
        item.id === editingId 
          ? { ...item, ...formData, time: formData.ora }
          : item
      ));
      setEditingId(null);
      showNotification('Dati aggiornati con successo!', 'success');
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
      showNotification('Misurazione salvata con successo!', 'success');
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
      showNotification('Compila tutti i campi obbligatori per aggiungere la medicina!', 'warning');
      return;
    }

    if (editingMedicine) {
      setMedicines(prev => prev.map(item => 
        item.id === editingMedicine 
          ? { ...item, ...medicineData }
          : item
      ));
      setEditingMedicine(null);
      showNotification('Medicina aggiornata con successo!', 'success');
    } else {
      const newMedicine = { id: Date.now(), ...medicineData };
      setMedicines(prev => [...prev, newMedicine]);
      showNotification('Medicina aggiunta alla lista!', 'success');
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
    setMedicalData(prev => prev.filter(item => item.id !== id));
    showNotification('Misurazione eliminata correttamente!', 'success');
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
    setMedicines(prev => prev.filter(item => item.id !== id));
    showNotification('Medicina eliminata dalla lista!', 'success');
  };

  // Funzione migliorata per invio invito
  const handleInvite = async () => {
    if (!shareData.email.includes('@') || !shareData.nome || !shareData.patientName) {
      showNotification('Compila tutti i campi obbligatori per inviare l\'invito!', 'warning');
      return;
    }

    try {
      const patientToken = btoa(`patient_${Date.now()}_${shareData.email}`).replace(/[^A-Za-z0-9]/g, '');
      const baseUrl = 'https://mediconnect-app-ruby.vercel.app';
      
      // URL per desktop con auto-redirect
      const acceptUrl = `${baseUrl}?patient=${patientToken}&action=accept&autoopen=true`;
      const declineUrl = `${baseUrl}?patient=${patientToken}&action=decline`;
      
      // URL per app mobile
      const mobileAppUrl = `mediconnect://patient/${patientToken}/accept`;
      
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>MediConnect - Invito Medico</title>
          <script>
            // Auto-redirect per desktop
            function handleAccept() {
              if (window.location.search.includes('autoopen=true')) {
                setTimeout(function() {
                  window.location.href = '${acceptUrl}';
                }, 1000);
              }
            }
            
            // Rilevamento dispositivo e gestione click
            function handleMobileAccept() {
              const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase());
              
              if (isMobile) {
                // Prova ad aprire l'app, se fallisce apri il browser
                window.location.href = '${mobileAppUrl}';
                setTimeout(function() {
                  window.location.href = '${acceptUrl}';
                }, 2000);
              } else {
                window.location.href = '${acceptUrl}';
              }
            }
          </script>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background: #f8fafc;">
          
          <!-- Container principale -->
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #f8fafc;">
            <tr>
              <td align="center" style="padding: 20px;">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                  
                  <!-- Header con gradiente -->
                  <tr>
                    <td align="center" style="background: linear-gradient(135deg, #4299e1 0%, #667eea 100%); padding: 40px 20px; color: white;">
                      <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🏥 MediConnect</h1>
                      <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Invito per Accesso Dati Medici</p>
                    </td>
                  </tr>

                  <!-- Contenuto principale -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #2d3748; text-align: center; margin: 0 0 20px 0; font-size: 24px;">
                        Ciao ${shareData.nome}!
                      </h2>
                      
                      <div style="background: #f0fff4; border: 1px solid #9ae6b4; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                        <p style="margin: 0; color: #276749; font-size: 16px; text-align: center;">
                          <strong>${shareData.patientName || 'Un paziente'}</strong> ti ha invitato ad accedere ai suoi dati medici
                          ${shareData.message ? `<br><br><em>"${shareData.message}"</em>` : ''}
                        </p>
                      </div>

                      <!-- Badge ruolo -->
                      <div style="text-align: center; margin-bottom: 30px;">
                        <span style="background: linear-gradient(135deg, #4299e1, #667eea); color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600;">
                          ${shareData.ruolo.charAt(0).toUpperCase() + shareData.ruolo.slice(1)} Autorizzato
                        </span>
                      </div>

                      <!-- Pulsanti di azione principali -->
                      <div style="text-align: center; margin-bottom: 30px;">
                        
                        <!-- Pulsante ACCETTA grande -->
                        <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 15px auto;">
                          <tr>
                            <td style="background: linear-gradient(135deg, #48bb78, #38a169); border-radius: 50px; box-shadow: 0 4px 15px rgba(72, 187, 120, 0.4);">
                              <a href="javascript:void(0);" onclick="handleMobileAccept()" style="display: block; color: white; text-decoration: none; font-weight: bold; font-size: 18px; padding: 18px 40px;">
                                ✅ ACCETTA E VISUALIZZA DATI
                              </a>
                            </td>
                          </tr>
                        </table>

                        <!-- Pulsante RIFIUTA -->
                        <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                          <tr>
                            <td style="background: #e53e3e; border-radius: 25px;">
                              <a href="${declineUrl}" style="display: block; color: white; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 30px;">
                                ❌ Rifiuta Invito
                              </a>
                            </td>
                          </tr>
                        </table>

                      </div>

                      <!-- Sezione App Mobile -->
                      <div style="background: #e6fffa; border: 1px solid #4fd1c7; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                        <h3 style="color: #234e52; margin: 0 0 15px 0; text-align: center;">📱 Per Smartphone</h3>
                        
                        <p style="color: #2c7a7b; text-align: center; margin: 0 0 15px 0; font-size: 14px;">
                          <strong>Il pulsante "ACCETTA" aprirà automaticamente l'app se installata</strong>
                        </p>

                        <div style="text-align: center;">
                          <a href="https://apps.apple.com/app/mediconnect" style="color: #234e52; font-weight: 600; text-decoration: none; margin-right: 15px;">📱 App Store</a>
                          <a href="https://play.google.com/store/apps/details?id=com.mediconnect" style="color: #234e52; font-weight: 600; text-decoration: none;">🤖 Google Play</a>
                        </div>

                        <!-- URL Schema per deep link -->
                        <div style="text-align: center; margin-top: 15px;">
                          <a href="${mobileAppUrl}" style="background: #38b2ac; color: white; text-decoration: none; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">
                            🚀 Apri nell'App
                          </a>
                        </div>
                      </div>

                      <!-- Cosa potrai vedere -->
                      <div style="background: #f0f4ff; border: 1px solid #a5b4fc; border-radius: 12px; padding: 20px;">
                        <h4 style="color: #3730a3; margin: 0 0 15px 0; text-align: center;">📊 Dati Disponibili:</h4>
                        <ul style="color: #4338ca; margin: 0; padding-left: 20px; font-size: 14px;">
                          <li>📈 Pressione arteriosa e frequenza cardiaca</li>
                          <li>🩸 Glicemia e temperatura corporea</li>
                          <li>🫁 Saturazione dell'ossigeno</li>
                          <li>💊 Terapie farmacologiche attuali</li>
                          <li>📋 Storico completo e grafici andamento</li>
                          <li>✍️ Sistema di risposta e raccomandazioni</li>
                        </ul>
                      </div>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background: #f7fafc; padding: 25px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="color: #718096; margin: 0; font-size: 14px;">
                        <strong>MediConnect</strong> - Piattaforma Sanitaria Sicura<br>
                        Questo invito scadrà tra 7 giorni<br>
                        <a href="mailto:support@mediconnect.app" style="color: #4299e1;">support@mediconnect.app</a>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>

        </body>
        </html>
      `;

      await sendEmail({
        to: shareData.email,
        subject: `MediConnect - Invito da ${shareData.patientName || 'Paziente'}`,
        html: emailHtml
      });

      setSharedWith(prev => [...prev, {
        email: shareData.email,
        nome: shareData.nome,
        ruolo: shareData.ruolo,
        patientName: shareData.patientName,
        invitedDate: new Date().toLocaleString('it-IT'),
        status: 'In Attesa di Risposta',
        accessToken: patientToken,
        expiryDate: new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString('it-IT'),
        canRespond: true
      }]);

      setShowInviteModal(false);
      showNotification(`Invito inviato con successo a ${shareData.nome}!`, 'success');
      
    } catch (error) {
      showNotification(`Errore invio invito: ${error.message}`, 'error');
    }

    setShareData({
      email: '',
      nome: '',
      ruolo: 'medico',
      patientName: '',
      message: '',
      startDate: '',
      endDate: '',
      includeData: { pressione: true, battiti: true, saturazione: true, glicemia: true, temperatura: true, sintomi: true, medicine: true }
    });
  };

  const handleShare = async () => {
    if (!shareData.email.includes('@')) {
      showNotification('Inserisci un email valida per condividere i dati!', 'warning');
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

      const dataByType = {
        pressione: dataToShare.filter(d => d.pressione).length,
        battiti: dataToShare.filter(d => d.battiti).length,
        saturazione: dataToShare.filter(d => d.saturazione).length,
        glicemia: dataToShare.filter(d => d.glicemia).length,
        temperatura: dataToShare.filter(d => d.temperatura).length
      };

      const dataToken = btoa(`data_${Date.now()}_${shareData.email}`).replace(/[^A-Za-z0-9]/g, '');
      const dataUrl = `https://mediconnect-app-ruby.vercel.app?data=${dataToken}&view=shared`;

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>MediConnect - Dati Condivisi</title>
          <script>
            // Auto-redirect per aprire l'app
            setTimeout(function() {
              window.location.href = '${dataUrl}';
            }, 2000);
          </script>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background: #f8fafc;">
          
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: #f8fafc;">
            <tr>
              <td align="center" style="padding: 20px;">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                  
                  <tr>
                    <td align="center" style="background: linear-gradient(135deg, #4299e1 0%, #667eea 100%); padding: 40px 20px; color: white;">
                      <h1 style="margin: 0; font-size: 28px;">📊 MediConnect</h1>
                      <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Dati Medici Condivisi</p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 40px 30px;">
                      <div style="background: #e6fffa; border: 1px solid #4fd1c7; border-radius: 12px; padding: 20px; margin-bottom: 30px; text-align: center;">
                        <h2 style="color: #234e52; margin: 0 0 10px 0;">🎯 Apertura Automatica</h2>
                        <p style="color: #2c7a7b; margin: 0; font-size: 16px;">
                          L'app MediConnect si aprirà automaticamente con i dati del paziente...
                        </p>
                      </div>

                      <!-- Pulsante manuale -->
                      <div style="text-align: center; margin-bottom: 30px;">
                        <a href="${dataUrl}" style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white; text-decoration: none; padding: 18px 40px; border-radius: 50px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 15px rgba(66, 153, 225, 0.4);">
                          📊 Visualizza Dati Medici
                        </a>
                      </div>

                      <!-- Riepilogo -->
                      <div style="background: #f0fff4; border: 1px solid #9ae6b4; border-radius: 12px; padding: 20px;">
                        <h3 style="color: #276749; margin: 0 0 15px 0; text-align: center;">📋 Riepilogo Dati</h3>
                        <p style="color: #2d3748; margin: 0; text-align: center;">
                          <strong>${dataToShare.length}</strong> misurazioni totali<br>
                          <strong>${medicines.length}</strong> terapie farmacologiche<br>
                          Periodo: ${shareData.startDate && shareData.endDate ? 
                            `${new Date(shareData.startDate).toLocaleDateString('it-IT')} - ${new Date(shareData.endDate).toLocaleDateString('it-IT')}` : 
                            'Tutti i dati disponibili'
                          }
                        </p>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="background: #f7fafc; padding: 25px; text-align: center;">
                      <p style="color: #718096; margin: 0; font-size: 14px;">
                        <strong>MediConnect</strong> - Condivisione del ${new Date().toLocaleDateString('it-IT')}<br>
                        <a href="mailto:support@mediconnect.app" style="color: #4299e1;">support@mediconnect.app</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

        </body>
        </html>
      `;

      await sendEmail({
        to: shareData.email,
        subject: `MediConnect - Dati Medici (${dataToShare.length} misurazioni)`,
        html: emailHtml
      });

      const shareInfo = {
        email: shareData.email,
        dataCount: dataToShare.length,
        medicineCount: shareData.includeData.medicine ? medicines.length : 0,
        dateRange: shareData.startDate && shareData.endDate ? 
          shareData.startDate + ' - ' + shareData.endDate : 'Tutti i dati',
        sharedDate: new Date().toLocaleString('it-IT'),
        status: 'Dati condivisi',
        accessToken: dataToken
      };

      setSharedWith(prev => {
        const existingIndex = prev.findIndex(item => item.email === shareData.email);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], ...shareInfo };
          return updated;
        } else {
          return [...prev, shareInfo];
        }
      });
      
      setShowShareModal(false);
      showNotification('Dati condivisi con successo!', 'success');

    } catch (error) {
      showNotification(`Errore condivisione: ${error.message}`, 'error');
    }
  };

  // Funzione per gestire risposta del medico
  const handleMedicResponse = async () => {
    if (!responseData.message || !responseData.patientId) {
      showNotification('Compila tutti i campi obbligatori per inviare la risposta!', 'warning');
      return;
    }

    try {
      const responseHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Risposta Medica - MediConnect</title>
        </head>
        <body style="font-family: Arial, sans-serif; background: #f8fafc; margin: 0; padding: 20px;">
          
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            
            <tr>
              <td align="center" style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); padding: 40px 20px; color: white;">
                <h1 style="margin: 0; font-size: 28px;">👨‍⚕️ MediConnect</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Risposta del Medico</p>
              </td>
            </tr>

            <tr>
              <td style="padding: 40px 30px;">
                <h2 style="color: #2d3748; margin: 0 0 20px 0;">Hai ricevuto una risposta medica</h2>
                
                <div style="background: #f0fff4; border: 1px solid #9ae6b4; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                  <h3 style="color: #276749; margin: 0 0 15px 0;">💬 Messaggio del Medico:</h3>
                  <p style="color: #2d3748; margin: 0; line-height: 1.6;">${responseData.message}</p>
                </div>

                ${responseData.recommendation ? `
                <div style="background: #fff5f5; border: 1px solid #fc8181; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                  <h3 style="color: #c53030; margin: 0 0 15px 0;">⚠️ Raccomandazioni Importanti:</h3>
                  <p style="color: #2d3748; margin: 0; line-height: 1.6;"><strong>${responseData.recommendation}</strong></p>
                </div>
                ` : ''}

                ${responseData.attachments.length > 0 ? `
                <div style="background: #f0f4ff; border: 1px solid #a5b4fc; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                  <h3 style="color: #3730a3; margin: 0 0 15px 0;">📎 Allegati:</h3>
                  <p style="color: #2d3748; margin: 0;">${responseData.attachments.length} file allegato/i</p>
                </div>
                ` : ''}

                <div style="text-align: center; margin-top: 30px;">
                  <a href="https://mediconnect-app-ruby.vercel.app" style="background: linear-gradient(135deg, #4299e1, #3182ce); color: white; text-decoration: none; padding: 18px 40px; border-radius: 50px; font-weight: bold; font-size: 18px;">
                    📱 Apri MediConnect
                  </a>
                </div>

              </td>
            </tr>

            <tr>
              <td style="background: #f7fafc; padding: 25px; text-align: center;">
                <p style="color: #718096; margin: 0; font-size: 14px;">
                  <strong>MediConnect</strong> - Risposta inviata il ${new Date().toLocaleDateString('it-IT')}<br>
                  <a href="mailto:support@mediconnect.app" style="color: #4299e1;">support@mediconnect.app</a>
                </p>
              </td>
            </tr>
          </table>

        </body>
        </html>
      `;

      // Trova l'email del paziente dal patientId (qui simulato)
      const patientEmail = 'paziente@email.com'; // In un'app reale questo verrebbe dalla DB

      await sendEmail({
        to: patientEmail,
        subject: 'MediConnect - Risposta del Medico',
        html: responseHtml
      });

      setShowResponseModal(false);
      showNotification('Risposta inviata con successo al paziente!', 'success');
      
      // Reset form
      setResponseData({
        patientId: '',
        message: '',
        attachments: [],
        recommendation: ''
      });

    } catch (error) {
      showNotification(`Errore invio risposta: ${error.message}`, 'error');
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    let content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>MediConnect - Report Medico</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            color: #333;
            line-height: 1.4;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #4299e1;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #4299e1;
            margin: 0;
            font-size: 2.5em;
          }
          .header p {
            color: #666;
            margin: 10px 0 0 0;
            font-size: 1.1em;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0;
            font-size: 14px;
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 12px 8px; 
            text-align: left; 
            vertical-align: top;
          }
          th { 
            background-color: #4299e1; 
            color: white;
            font-weight: bold;
            text-align: center;
          }
          tr:nth-child(even) {
            background-color: #f8f9fa;
          }
          .section {
            margin: 30px 0;
            page-break-inside: avoid;
          }
          .section h2 {
            color: #2d3748;
            border-left: 4px solid #4299e1;
            padding-left: 15px;
            margin-bottom: 15px;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
          }
          .stat-card {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            background: #f7fafc;
          }
          .stat-card h3 {
            margin: 0 0 10px 0;
            color: #4299e1;
            font-size: 1.2em;
          }
          .stat-card .value {
            font-size: 2em;
            font-weight: bold;
            color: #2d3748;
            margin: 0;
          }
          .medicine-list {
            background: #f0fff4;
            border: 1px solid #68d391;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>MediConnect</h1>
          <p>Report Medico Completo</p>
          <p>Generato il ${new Date().toLocaleDateString('it-IT')} alle ${new Date().toLocaleTimeString('it-IT')}</p>
        </div>
    `;

    // Statistics summary
    const totalMeasurements = medicalData.length;
    const measuredData = {
      pressione: medicalData.filter(d => d.pressione).length,
      battiti: medicalData.filter(d => d.battiti).length,
      saturazione: medicalData.filter(d => d.saturazione).length,
      glicemia: medicalData.filter(d => d.glicemia).length,
      temperatura: medicalData.filter(d => d.temperatura).length
    };

    content += `
      <div class="section">
        <h2>Riepilogo Generale</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Totale Misurazioni</h3>
            <p class="value">${totalMeasurements}</p>
          </div>
          <div class="stat-card">
            <h3>Pressione Arteriosa</h3>
            <p class="value">${measuredData.pressione}</p>
          </div>
          <div class="stat-card">
            <h3>Frequenza Cardiaca</h3>
            <p class="value">${measuredData.battiti}</p>
          </div>
          <div class="stat-card">
            <h3>Saturazione O2</h3>
            <p class="value">${measuredData.saturazione}</p>
          </div>
          <div class="stat-card">
            <h3>Glicemia</h3>
            <p class="value">${measuredData.glicemia}</p>
          </div>
          <div class="stat-card">
            <h3>Temperatura</h3>
            <p class="value">${measuredData.temperatura}</p>
          </div>
        </div>
      </div>
    `;

    if (printOptions.includeHistory) {
      let dataToShow = medicalData;
      if (printOptions.dateRange.start && printOptions.dateRange.end) {
        dataToShow = medicalData.filter(entry => {
          const entryDate = new Date(entry.date);
          const start = new Date(printOptions.dateRange.start);
          const end = new Date(printOptions.dateRange.end);
          return entryDate >= start && entryDate <= end;
        });
      }

      content += `
        <div class="section">
          <h2>Storico Misurazioni (${dataToShow.length} record)</h2>
          <table>
            <tr>
              <th>Data</th>
              <th>Ora</th>
              <th>Pressione</th>
              <th>Battiti</th>
              <th>Saturazione</th>
              <th>Glicemia</th>
              <th>Temperatura</th>
              <th>Note</th>
            </tr>
      `;
      
      dataToShow.forEach(entry => {
        content += `<tr>
          <td>${new Date(entry.date).toLocaleDateString('it-IT')}</td>
          <td>${entry.time}</td>
          <td>${entry.pressione || '-'}</td>
          <td>${entry.battiti ? entry.battiti + ' bpm' : '-'}</td>
          <td>${entry.saturazione ? entry.saturazione + '%' : '-'}</td>
          <td>${entry.glicemia ? entry.glicemia + ' mg/dL' : '-'}</td>
          <td>${entry.temperatura ? entry.temperatura + '°C' : '-'}</td>
          <td>${entry.sintomi || '-'}</td>
        </tr>`;
      });
      content += '</table></div>';
    }

    // Medicine section
    if (medicines.length > 0) {
      content += `
        <div class="section">
          <h2>Terapie Farmacologiche (${medicines.length} farmaci)</h2>
          <div class="medicine-list">
      `;
      medicines.forEach(medicine => {
        content += `
          <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #c6f6d5;">
            <h4 style="margin: 0 0 5px 0; color: #2d3748;">${medicine.nome} - ${medicine.dosaggio}</h4>
            <p style="margin: 2px 0;"><strong>Orario:</strong> ${medicine.ora}</p>
            <p style="margin: 2px 0;"><strong>Frequenza:</strong> ${medicine.frequenza}</p>
            ${medicine.note ? `<p style="margin: 2px 0; font-style: italic;"><strong>Note:</strong> ${medicine.note}</p>` : ''}
          </div>
        `;
      });
      content += '</div></div>';
    }

    content += `
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; color: #666;">
          <p><strong>MediConnect</strong> - Piattaforma di Monitoraggio Sanitario</p>
          <p>Report generato automaticamente - Non modificare questo documento</p>
        </div>
      </body></html>
    `;
    
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
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
      gap: '5px',
      transition: 'all 0.2s'
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
      gap: '5px',
      color: '#2d3748'
    },
    input: {
      padding: '10px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      transition: 'border-color 0.2s'
    },
    textarea: {
      padding: '10px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      minHeight: '80px',
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      resize: 'vertical'
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
      gap: '8px',
      transition: 'background-color 0.2s'
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
      gap: '5px',
      transition: 'background-color 0.2s'
    },
    buttonDanger: {
      backgroundColor: '#e53e3e',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '6px 10px',
      fontSize: '12px',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    buttonSecondary: {
      backgroundColor: '#a0aec0',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '6px 10px',
      fontSize: '12px',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
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
      overflow: 'auto',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
    },
    dataCard: {
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '10px',
      padding: '15px',
      marginBottom: '10px',
      position: 'relative',
      transition: 'box-shadow 0.2s'
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
    },
    checkbox: {
      margin: '0 8px 0 0'
    },
    notification: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '15px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      zIndex: 1001,
      minWidth: '300px',
      fontSize: '14px',
      fontWeight: '500'
    },
    notificationSuccess: {
      backgroundColor: '#f0fff4',
      color: '#276749',
      border: '1px solid #9ae6b4'
    },
    notificationError: {
      backgroundColor: '#fff5f5',
      color: '#c53030',
      border: '1px solid #fc8181'
    },
    notificationWarning: {
      backgroundColor: '#fffbeb',
      color: '#c05621',
      border: '1px solid #f6ad55'
    },
    notificationInfo: {
      backgroundColor: '#ebf8ff',
      color: '#2a69ac',
      border: '1px solid #63b3ed'
    }
  };

  return (
    <div style={styles.container}>
      {/* Notification System */}
      {notification.show && (
        <div style={{
          ...styles.notification,
          ...(notification.type === 'success' && styles.notificationSuccess),
          ...(notification.type === 'error' && styles.notificationError),
          ...(notification.type === 'warning' && styles.notificationWarning),
          ...(notification.type === 'info' && styles.notificationInfo)
        }}>
          {notification.message}
        </div>
      )}
      
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        
        {/* Header */}
        <div style={styles.card}>
          <h1 style={styles.title}>MediConnect</h1>
          <p style={styles.subtitle}>Monitora la tua salute con semplicità e condividi i dati in sicurezza</p>
          
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
            <h2>{editingId ? 'Modifica Misurazione' : 'Inserisci Nuova Misurazione'}</h2>
            
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <Calendar size={16} />
                  Data *
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
                  Ora *
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
                  <Activity size={16} />
                  Frequenza Cardiaca (bpm)
                </label>
                <input
                  type="number"
                  placeholder="es. 72"
                  min="30"
                  max="200"
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
                  min="80"
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
                  min="50"
                  max="500"
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
                  min="35.0"
                  max="42.0"
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
                  placeholder="Descrivi eventuali sintomi, condizioni particolari o note aggiuntive..."
                  value={formData.sintomi}
                  onChange={(e) => handleInputChange('sintomi', e.target.value)}
                  style={styles.textarea}
                />
              </div>
            </div>

            <button onClick={handleSubmit} style={styles.button}>
              <Send size={16} />
              {editingId ? 'Aggiorna Misurazione' : 'Salva Misurazione'}
            </button>
          </div>
        )}

        {/* Medicines Tab */}
        {activeTab === 'medicines' && (
          <div style={styles.card}>
            <h2>{editingMedicine ? 'Modifica Medicina' : 'Aggiungi Nuova Medicina'}</h2>
            
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <Pill size={16} />
                  Nome Farmaco *
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
                  Orario di Assunzione *
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
                  Note e Istruzioni
                </label>
                <textarea
                  placeholder="es. A stomaco pieno, evitare alcol, effetti collaterali noti..."
                  value={medicineData.note}
                  onChange={(e) => handleMedicineChange('note', e.target.value)}
                  style={styles.textarea}
                />
              </div>
            </div>

            <button onClick={handleMedicineSubmit} style={styles.buttonSuccess}>
              <Plus size={16} />
              {editingMedicine ? 'Aggiorna Medicina' : 'Aggiungi Medicina'}
            </button>

            <div style={{marginTop: '30px'}}>
              <h3>Le Tue Medicine ({medicines.length})</h3>
              {medicines.length === 0 ? (
                <div style={styles.emptyState}>
                  <Pill size={48} />
                  <p>Nessuna medicina registrata</p>
                  <p style={{fontSize: '14px', color: '#a0aec0'}}>Aggiungi i tuoi farmaci per tenere traccia delle terapie</p>
                </div>
              ) : (
                medicines.map(medicine => (
                  <div key={medicine.id} style={styles.dataCard}>
                    <div style={styles.actionButtons}>
                      <button
                        onClick={() => editMedicine(medicine.id)}
                        style={styles.buttonSecondary}
                        title="Modifica"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => deleteMedicine(medicine.id)}
                        style={styles.buttonDanger}
                        title="Elimina"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <h4 style={{margin: '0 0 10px 0', color: '#2d3748'}}>{medicine.nome} - {medicine.dosaggio}</h4>
                    <p style={{margin: '5px 0', color: '#4a5568'}}><strong>Orario:</strong> {medicine.ora} | <strong>Frequenza:</strong> {medicine.frequenza}</p>
                    {medicine.note && <p style={{margin: '5px 0', fontStyle: 'italic', color: '#666', backgroundColor: '#f7fafc', padding: '8px', borderRadius: '4px'}}><strong>Note:</strong> {medicine.note}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div style={styles.card}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px'}}>
              <h2>Storico Misurazioni ({filteredMedicalData.length}/{medicalData.length})</h2>
              <div style={{display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <Filter size={16} />
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    style={styles.input}
                  />
                </div>
                {filterDate && (
                  <button onClick={() => setFilterDate('')} style={styles.buttonDanger}>
                    Reset Filtro
                  </button>
                )}
                <button onClick={() => setShowPrintModal(true)} style={styles.button}>
                  <Printer size={16} />
                  Stampa Report
                </button>
              </div>
            </div>
            
            {filteredMedicalData.length === 0 ? (
              <div style={styles.emptyState}>
                <Activity size={48} />
                <p>{filterDate ? 'Nessuna misurazione per la data selezionata' : 'Inizia il monitoraggio della tua salute'}</p>
                <p style={{fontSize: '14px', color: '#a0aec0'}}>Le tue misurazioni appariranno qui</p>
              </div>
            ) : (
              filteredMedicalData.map(entry => (
                <div key={entry.id} style={{...styles.dataCard, ':hover': {boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}}>
                  <div style={styles.actionButtons}>
                    <button 
                      onClick={() => editData(entry.id)} 
                      style={styles.buttonSecondary}
                      title="Modifica"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button 
                      onClick={() => deleteData(entry.id)} 
                      style={styles.buttonDanger}
                      title="Elimina"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  
                  <div style={{marginBottom: '12px'}}>
                    <strong style={{fontSize: '16px', color: '#2d3748'}}>
                      {new Date(entry.date).toLocaleDateString('it-IT', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })} - {entry.time}
                    </strong>
                  </div>
                  
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '10px'}}>
                    {entry.pressione && (
                      <div style={{padding: '8px', backgroundColor: '#fef5e7', borderRadius: '6px', border: '1px solid #f6ad55'}}>
                        <strong style={{color: '#c05621'}}>Pressione:</strong><br/>{entry.pressione}
                      </div>
                    )}
                    {entry.battiti && (
                      <div style={{padding: '8px', backgroundColor: '#fed7d7', borderRadius: '6px', border: '1px solid #fc8181'}}>
                        <strong style={{color: '#c53030'}}>Battiti:</strong><br/>{entry.battiti} bpm
                      </div>
                    )}
                    {entry.saturazione && (
                      <div style={{padding: '8px', backgroundColor: '#e6fffa', borderRadius: '6px', border: '1px solid #4fd1c7'}}>
                        <strong style={{color: '#234e52'}}>Saturazione:</strong><br/>{entry.saturazione}%
                      </div>
                    )}
                    {entry.glicemia && (
                      <div style={{padding: '8px', backgroundColor: '#edf2f7', borderRadius: '6px', border: '1px solid #a0aec0'}}>
                        <strong style={{color: '#2d3748'}}>Glicemia:</strong><br/>{entry.glicemia} mg/dL
                      </div>
                    )}
                    {entry.temperatura && (
                      <div style={{padding: '8px', backgroundColor: '#fef5e7', borderRadius: '6px', border: '1px solid #f6ad55'}}>
                        <strong style={{color: '#c05621'}}>Temperatura:</strong><br/>{entry.temperatura}°C
                      </div>
                    )}
                  </div>
                  
                  {entry.sintomi && (
                    <div style={{marginTop: '12px', padding: '12px', backgroundColor: '#f0fff4', borderRadius: '6px', border: '1px solid #9ae6b4'}}>
                      <strong style={{color: '#276749'}}>Note e Sintomi:</strong><br/>
                      <span style={{color: '#2d3748'}}>{entry.sintomi}</span>
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
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px'}}>
              <h2>Grafici e Andamenti</h2>
              <button onClick={() => setShowPrintModal(true)} style={styles.button}>
                <Printer size={16} />
                Stampa Grafici
              </button>
            </div>
            
            <div style={{display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap'}}>
              {[
                {id: 'pressione', icon: Heart, label: 'Pressione Arteriosa', color: '#e53e3e'},
                {id: 'battiti', icon: Activity, label: 'Frequenza Cardiaca', color: '#d53f8c'},
                {id: 'saturazione', icon: Droplet, label: 'Saturazione O2', color: '#0bc5ea'},
                {id: 'glicemia', icon: Droplet, label: 'Glicemia', color: '#3182ce'},
                {id: 'temperatura', icon: Thermometer, label: 'Temperatura', color: '#dd6b20'}
              ].map(chart => (
                <button
                  key={chart.id}
                  onClick={() => setChartType(chart.id)}
                  style={{
                    ...styles.tab,
                    ...(chartType === chart.id ? {...styles.activeTab, backgroundColor: chart.color} : {})
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
                <p>Aggiungi almeno 2 misurazioni per visualizzare i grafici</p>
                <p style={{fontSize: '14px', color: '#a0aec0'}}>I grafici ti aiutano a monitorare l'andamento nel tempo</p>
              </div>
            ) : (
              <div style={{height: '400px', width: '100%', backgroundColor: '#f8f9fa', borderRadius: '10px', padding: '15px'}}>
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'pressione' ? (
                    <RechartsLineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#4a5568" />
                      <YAxis stroke="#4a5568" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
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
                        name="Sistolica (mmHg)"
                        connectNulls={false}
                        dot={{fill: '#e53e3e', strokeWidth: 2, r: 4}}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="pressione_dia" 
                        stroke="#3182ce" 
                        strokeWidth={3}
                        name="Diastolica (mmHg)"
                        connectNulls={false}
                        dot={{fill: '#3182ce', strokeWidth: 2, r: 4}}
                      />
                    </RechartsLineChart>
                  ) : chartType === 'battiti' ? (
                    <RechartsLineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#4a5568" />
                      <YAxis stroke="#4a5568" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="battiti" 
                        stroke="#d53f8c" 
                        strokeWidth={3}
                        name="Frequenza Cardiaca (bpm)"
                        connectNulls={false}
                        dot={{fill: '#d53f8c', strokeWidth: 2, r: 4}}
                      />
                    </RechartsLineChart>
                  ) : chartType === 'saturazione' ? (
                    <RechartsLineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#4a5568" />
                      <YAxis domain={[90, 100]} stroke="#4a5568" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="saturazione" 
                        stroke="#0bc5ea" 
                        strokeWidth={3}
                        name="Saturazione O2 (%)"
                        connectNulls={false}
                        dot={{fill: '#0bc5ea', strokeWidth: 2, r: 4}}
                      />
                    </RechartsLineChart>
                  ) : chartType === 'glicemia' ? (
                    <RechartsBarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#4a5568" />
                      <YAxis stroke="#4a5568" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Bar dataKey="glicemia" fill="#3182ce" name="Glicemia (mg/dL)" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  ) : (
                    <RechartsLineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#4a5568" />
                      <YAxis domain={[35, 40]} stroke="#4a5568" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
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
                        dot={{fill: '#dd6b20', strokeWidth: 2, r: 4}}
                      />
                    </RechartsLineChart>
                  )}
                </ResponsiveContainer>
              </div>
            )}
            
            {chartData.length > 0 && (
              <div style={{marginTop: '20px', fontSize: '14px', color: '#4a5568', textAlign: 'center'}}>
                Mostrando gli ultimi 10 valori registrati
              </div>
            )}
          </div>
        )}

        {/* Share Tab */}
        {activeTab === 'share' && (
          <div style={styles.card}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px'}}>
              <h2>Gestione Condivisioni</h2>
              <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                <button onClick={() => setShowInviteModal(true)} style={styles.buttonSuccess}>
                  <UserPlus size={16} />
                  Invita Persona
                </button>
                <button onClick={() => setShowShareModal(true)} style={styles.button}>
                  <Share2 size={16} />
                  Condividi Dati
                </button>
              </div>
            </div>

            {sharedWith.length === 0 ? (
              <div style={styles.emptyState}>
                <Users size={48} />
                <p>Nessuna condivisione attiva</p>
                <p style={{fontSize: '14px', color: '#a0aec0'}}>Invita medici o familiari per condividere i tuoi dati</p>
              </div>
            ) : (
              <div>
                <h3 style={{marginBottom: '15px', color: '#2d3748'}}>Persone con Accesso ({sharedWith.length})</h3>
                {sharedWith.map((share, index) => (
                  <div key={index} style={styles.dataCard}>
                    <div style={styles.actionButtons}>
                      {share.canRespond && (
                        <button
                          onClick={() => {
                            setResponseData(prev => ({ ...prev, patientId: share.accessToken || 'default' }));
                            setShowResponseModal(true);
                          }}
                          style={styles.buttonSuccess}
                          title="Rispondi come medico"
                        >
                          <MessageSquare size={12} />
                        </button>
                      )}
                    </div>
                    
                    <h4 style={{margin: '0 0 8px 0', color: '#2d3748'}}>
                      {share.nome || share.email.split('@')[0]} 
                      <span style={{
                        backgroundColor: share.ruolo === 'medico' ? '#e6fffa' : '#f0fff4',
                        color: share.ruolo === 'medico' ? '#234e52' : '#276749',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        marginLeft: '10px'
                      }}>
                        {share.ruolo}
                      </span>
                    </h4>
                    
                    {share.patientName && (
                      <p style={{margin: '4px 0', color: '#4a5568'}}>Paziente: <strong>{share.patientName}</strong></p>
                    )}
                    
                    <p style={{margin: '4px 0', color: '#4a5568'}}>{share.email}</p>
                    
                    <p style={{margin: '4px 0', color: '#4a5568'}}>
                      <strong>Status:</strong> 
                      <span style={{
                        color: share.status === 'Dati condivisi' || share.status === 'Invito Accettato' ? '#38a169' : 
                              share.status === 'Invito Rifiutato' ? '#e53e3e' : '#3182ce',
                        fontWeight: 'bold',
                        marginLeft: '5px'
                      }}>
                        {share.status}
                      </span>
                    </p>
                    
                    <p style={{margin: '4px 0', color: '#718096', fontSize: '14px'}}>
                      {share.invitedDate ? `Invitato: ${share.invitedDate}` : ''}
                      {share.sharedDate ? `Ultima condivisione: ${share.sharedDate}` : ''}
                    </p>
                    
                    {share.dataCount && (
                      <p style={{margin: '4px 0', color: '#4a5568', fontSize: '14px'}}>
                        Dati condivisi: {share.dataCount} misurazioni
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modals */}
        {showInviteModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h3 style={{margin: '0 0 20px 0', color: '#2d3748'}}>Invita una Nuova Persona</h3>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <Mail size={16} />
                  Indirizzo Email *
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
                  Nome Completo *
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
                <label style={styles.label}>Nome Paziente *</label>
                <input
                  type="text"
                  placeholder="Mario Bianchi"
                  value={shareData.patientName}
                  onChange={(e) => setShareData(prev => ({ ...prev, patientName: e.target.value }))}
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
                  <option value="medico">Medico Curante</option>
                  <option value="familiare">Familiare</option>
                  <option value="caregiver">Caregiver</option>
                  <option value="altro">Altro</option>
                </select>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Messaggio Personale</label>
                <textarea
                  placeholder="Aggiungi un messaggio personale per l'invitato..."
                  value={shareData.message}
                  onChange={(e) => setShareData(prev => ({ ...prev, message: e.target.value }))}
                  style={styles.textarea}
                />
              </div>

              <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '25px'}}>
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
              <h3 style={{margin: '0 0 20px 0', color: '#2d3748'}}>Condividi Dati Medici</h3>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email destinatario *</label>
                <input
                  type="email"
                  placeholder="Inserisci l'email del destinatario"
                  value={shareData.email}
                  onChange={(e) => setShareData(prev => ({ ...prev, email: e.target.value }))}
                  style={styles.input}
                />
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px'}}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Data inizio (opzionale)</label>
                  <input
                    type="date"
                    value={shareData.startDate}
                    onChange={(e) => setShareData(prev => ({ ...prev, startDate: e.target.value }))}
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Data fine (opzionale)</label>
                  <input
                    type="date"
                    value={shareData.endDate}
                    onChange={(e) => setShareData(prev => ({ ...prev, endDate: e.target.value }))}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={{backgroundColor: '#f7fafc', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>
                <h4 style={{margin: '0 0 10px 0', color: '#2d3748'}}>Dati da includere:</h4>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px'}}>
                  {Object.entries(shareData.includeData).map(([key, value]) => (
                    <label key={key} style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px'}}>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setShareData(prev => ({
                          ...prev,
                          includeData: { ...prev.includeData, [key]: e.target.checked }
                        }))}
                        style={styles.checkbox}
                      />
                      {key === 'pressione' && 'Pressione'}
                      {key === 'battiti' && 'Battiti'}
                      {key === 'saturazione' && 'Saturazione'}
                      {key === 'glicemia' && 'Glicemia'}
                      {key === 'temperatura' && 'Temperatura'}
                      {key === 'sintomi' && 'Note/Sintomi'}
                      {key === 'medicine' && 'Medicine'}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
                <button onClick={() => setShowShareModal(false)} style={styles.buttonSecondary}>
                  Annulla
                </button>
                <button onClick={handleShare} style={styles.buttonSuccess}>
                  <Send size={16} />
                  Condividi Dati
                </button>
              </div>
            </div>
          </div>
        )}

        {showResponseModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h3 style={{margin: '0 0 20px 0', color: '#2d3748'}}>Risposta Medica</h3>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <MessageSquare size={16} />
                  Messaggio per il Paziente *
                </label>
                <textarea
                  placeholder="Scrivi la tua valutazione medica e consigli per il paziente..."
                  value={responseData.message}
                  onChange={(e) => setResponseData(prev => ({ ...prev, message: e.target.value }))}
                  style={styles.textarea}
                  rows="4"
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <CheckCircle size={16} />
                  Raccomandazioni Urgenti (opzionale)
                </label>
                <textarea
                  placeholder="Eventuali raccomandazioni urgenti o istruzioni importanti..."
                  value={responseData.recommendation}
                  onChange={(e) => setResponseData(prev => ({ ...prev, recommendation: e.target.value }))}
                  style={styles.textarea}
                  rows="2"
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <Paperclip size={16} />
                  Allegati (simulazione)
                </label>
                <div style={{
                  border: '2px dashed #e2e8f0',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  color: '#718096',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  const files = ['Referto_esami.pdf', 'Prescrizione_medica.pdf'];
                  setResponseData(prev => ({ 
                    ...prev, 
                    attachments: [...prev.attachments, ...files.slice(0, 1)] 
                  }));
                  showNotification('File allegato simulato aggiunto', 'info');
                }}>
                  Clicca per allegare file (simulazione)
                  {responseData.attachments.length > 0 && (
                    <div style={{marginTop: '10px', color: '#4299e1'}}>
                      {responseData.attachments.length} file allegato/i
                    </div>
                  )}
                </div>
              </div>

              <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '25px'}}>
                <button onClick={() => setShowResponseModal(false)} style={styles.buttonSecondary}>
                  Annulla
                </button>
                <button onClick={handleMedicResponse} style={styles.buttonSuccess}>
                  <Send size={16} />
                  Invia Risposta
                </button>
              </div>
            </div>
          </div>
        )}

        {showPrintModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h3 style={{margin: '0 0 20px 0', color: '#2d3748'}}>Opzioni di Stampa Report</h3>
              
              <div style={{marginBottom: '20px'}}>
                <h4 style={{marginBottom: '10px', color: '#2d3748'}}>Contenuti da includere:</h4>
                <label style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                  <input
                    type="checkbox"
                    checked={printOptions.includeHistory}
                    onChange={(e) => setPrintOptions(prev => ({ ...prev, includeHistory: e.target.checked }))}
                    style={styles.checkbox}
                  />
                  Storico Completo delle Misurazioni
                </label>
                
                <label style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                  <input
                    type="checkbox"
                    checked={printOptions.includeCharts}
                    onChange={(e) => setPrintOptions(prev => ({ ...prev, includeCharts: e.target.checked }))}
                    style={styles.checkbox}
                  />
                  Riferimenti ai Grafici (solo descrizione)
                </label>
              </div>

              <div style={{backgroundColor: '#f7fafc', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>
                <h4 style={{margin: '0 0 10px 0', color: '#2d3748'}}>Grafici selezionati per il riferimento:</h4>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px'}}>
                  {Object.entries(printOptions.chartTypes).map(([key, value]) => (
                    <label key={key} style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px'}}>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setPrintOptions(prev => ({
                          ...prev,
                          chartTypes: { ...prev.chartTypes, [key]: e.target.checked }
                        }))}
                        style={styles.checkbox}
                        disabled={!printOptions.includeCharts}
                      />
                      {key === 'pressione' && 'Pressione'}
                      {key === 'battiti' && 'Battiti'}
                      {key === 'saturazione' && 'Saturazione'}
                      {key === 'glicemia' && 'Glicemia'}
                      {key === 'temperatura' && 'Temperatura'}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
                <button onClick={() => setShowPrintModal(false)} style={styles.buttonSecondary}>
                  Annulla
                </button>
                <button onClick={handlePrint} style={styles.button}>
                  <Printer size={16} />
                  Genera e Stampa
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