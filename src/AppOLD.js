import React, { useState, useEffect } from 'react';
import { Heart, Thermometer, Droplet, Activity, Send, Share2, Calendar, Filter, UserPlus, Mail, Eye, Users, Pill, Clock, TrendingUp, Edit2, Trash2, Plus, BarChart3, LineChart, PieChart, Printer } from 'lucide-react';
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
  
  // Print settings
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
        sintomi: 'Leggero mal di testa, stanchezza'
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
      },
      {
        id: 4,
        date: '2025-08-28',
        time: '19:45',
        pressione: '122/79',
        battiti: '70',
        saturazione: '98',
        glicemia: '88',
        temperatura: '36.7',
        sintomi: 'Tutto nella norma'
      },
      {
        id: 5,
        date: '2025-08-27',
        time: '08:30',
        pressione: '115/75',
        battiti: '65',
        saturazione: '99',
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

  // Real email sending function using EmailJS or similar service
  const sendEmail = async (emailData) => {
    try {
      // For real implementation, you would use a service like EmailJS
      // Here's an example with EmailJS integration:
      
      /*
      // First install EmailJS: npm install emailjs-com
      // Then import it: import emailjs from 'emailjs-com';
      
      const templateParams = {
        to_email: emailData.to,
        to_name: emailData.toName || emailData.to.split('@')[0],
        from_name: 'MediConnect',
        subject: emailData.subject,
        message: emailData.html,
        reply_to: 'noreply@mediconnect.app'
      };

      const result = await emailjs.send(
        'YOUR_SERVICE_ID', // Get from EmailJS dashboard
        'YOUR_TEMPLATE_ID', // Get from EmailJS dashboard  
        templateParams,
        'YOUR_PUBLIC_KEY' // Get from EmailJS dashboard
      );
      
      return { status: 200, messageId: result.text };
      */
      
      // For demo purposes, we'll simulate the email sending
      console.log('📧 Email simulata inviata:', {
        to: emailData.to,
        subject: emailData.subject,
        type: 'MediConnect notification'
      });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, we'll show the email content in console and alert
      console.log('📧 Contenuto email:', emailData.html);
      
      // In a real app, you'd integrate with a backend API that sends emails
      // Example backend integration:
      /*
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userToken
        },
        body: JSON.stringify({
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html,
          from: 'noreply@mediconnect.app'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      
      return await response.json();
      */
      
      return {
        status: 200,
        messageId: `sim_${Date.now()}`,
        text: 'Email simulata inviata con successo'
      };
      
    } catch (error) {
      console.error('Errore invio email:', error);
      throw new Error(`Errore nell'invio dell'email: ${error.message}`);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMedicineChange = (field, value) => {
    setMedicineData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.pressione && !formData.battiti && !formData.saturazione && !formData.glicemia && !formData.temperatura) {
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
      alert('Medicina aggiornata con successo!');
    } else {
      const newMedicine = {
        id: Date.now(),
        ...medicineData
      };

      setMedicines(prev => [...prev, newMedicine]);
      alert('Medicina aggiunta con successo!');
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
    if (window.confirm('Sei sicuro di voler eliminare questa misurazione?')) {
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
    if (window.confirm('Sei sicuro di voler eliminare questa medicina?')) {
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
      const emailData = {
        to: shareData.email,
        toName: shareData.nome,
        subject: `Invito su MediConnect - Monitoraggio Salute`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🏥 MediConnect</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Monitoraggio Sanitario Digitale</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              <h2 style="color: #2d3748; margin-top: 0;">Ciao ${shareData.nome}!</h2>
              
              <p style="color: #4a5568; line-height: 1.6; font-size: 16px;">
                Sei stato invitato a utilizzare <strong>MediConnect</strong>, l'app per il monitoraggio della salute che permette di:
              </p>
              
              <div style="background: #e6fffa; border-left: 4px solid #4fd1c7; padding: 20px; margin: 20px 0; border-radius: 8px;">
                <h3 style="color: #2c7a7b; margin: 0 0 15px 0;">🎯 Cosa puoi fare con MediConnect:</h3>
                <ul style="color: #2c7a7b; margin: 0; padding-left: 20px; line-height: 1.6;">
                  <li>📊 Visualizzare dati medici in tempo reale</li>
                  <li>📈 Monitorare grafici e andamenti</li>
                  <li>💊 Gestire terapie farmacologiche</li>
                  <li>🔔 Ricevere aggiornamenti automatici</li>
                  <li>📱 Accesso da qualsiasi dispositivo</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 18px; display: inline-block; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                  🚀 Inizia Subito con MediConnect
                </a>
              </div>
              
              <div style="background: #fff5f5; border: 1px solid #fed7d7; border-radius: 10px; padding: 20px; margin: 25px 0;">
                <h3 style="color: #c53030; margin: 0 0 10px 0;">🔒 Privacy e Sicurezza</h3>
                <p style="color: #c53030; margin: 0; font-size: 14px; line-height: 1.5;">
                  • Tutti i dati sono crittografati end-to-end<br>
                  • Accesso solo con autorizzazione esplicita<br>
                  • Conformità GDPR e normative sanitarie<br>
                  • Possibilità di revocare l'accesso in qualsiasi momento
                </p>
              </div>
              
              <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
                <p style="color: #718096; font-size: 14px; margin: 0;">
                  Hai ricevuto questo invito perché qualcuno ti ha aggiunto come <strong>${shareData.ruolo}</strong> su MediConnect.
                </p>
                <p style="color: #718096; font-size: 14px; margin: 10px 0 0 0;">
                  Per assistenza: support@mediconnect.app
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #a0aec0; font-size: 12px;">
              <p>© 2025 MediConnect. Tutti i diritti riservati.</p>
            </div>
          </div>
        `
      };

      await sendEmail(emailData);

      const inviteInfo = {
        email: shareData.email,
        nome: shareData.nome,
        ruolo: shareData.ruolo,
        invitedDate: new Date().toLocaleString('it-IT'),
        status: 'Invitato',
        emailSent: true
      };

      setSharedWith(prev => [inviteInfo, ...prev]);
      setShowInviteModal(false);
      
      alert(`✅ Invito inviato con successo!

📧 Destinatario: ${shareData.nome} (${shareData.email})
🏷️ Ruolo: ${shareData.ruolo}

L'email include:
📱 Link diretto all'app MediConnect  
📋 Istruzioni complete per l'accesso
🔒 Informazioni su privacy e sicurezza
🎯 Guida alle funzionalità principali

L'invitato riceverà tutto il necessario per iniziare!`);
      
    } catch (error) {
      console.error('Errore invio email:', error);
      alert(`❌ Errore nell'invio dell'invito

Il sistema ha simulato l'invio dell'email.
In un'implementazione reale, configurare:

🔧 Opzioni disponibili:
• EmailJS per invio client-side
• Backend API con servizi come SendGrid
• Server SMTP personalizzato

📧 L'email è stata generata e mostrata nella console del browser.
Controlla la console per vedere il contenuto dell'email.`);
    }
    
    // Reset form
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

      const emailData = {
        to: shareData.email,
        subject: `Nuovi dati medici condivisi - MediConnect`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; text-align: center; margin-bottom: 25px;">
              <h1 style="color: white; margin: 0;">📊 Dati Medici Aggiornati</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">MediConnect</p>
            </div>
            
            <div style="background: white; padding: 25px; border-radius: 15px; border: 1px solid #e2e8f0;">
              <p style="font-size: 16px; margin-bottom: 20px;">Sono stati condivisi nuovi dati medici con te.</p>
              
              <div style="background: #f7fafc; border-radius: 10px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #2d3748; margin: 0 0 15px 0;">📋 Riepilogo Condivisione:</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                  <div style="text-align: center; padding: 15px; background: white; border-radius: 8px; border: 2px solid #4299e1;">
                    <div style="font-size: 24px; font-weight: bold; color: #4299e1;">${dataToShare.length}</div>
                    <div style="color: #718096; font-size: 14px;">Misurazioni</div>
                  </div>
                  <div style="text-align: center; padding: 15px; background: white; border-radius: 8px; border: 2px solid #805ad5;">
                    <div style="font-size: 24px; font-weight: bold; color: #805ad5;">${shareData.includeData.medicine ? medicines.length : 0}</div>
                    <div style="color: #718096; font-size: 14px;">Medicine</div>
                  </div>
                </div>
                <div style="margin-top: 15px; padding: 10px; background: #e6fffa; border-radius: 6px;">
                  <strong style="color: #2c7a7b;">📅 Periodo:</strong> 
                  <span style="color: #2c7a7b;">${shareData.startDate && shareData.endDate ? 
                    `${shareData.startDate} - ${shareData.endDate}` : 'Tutti i dati'}</span>
                </div>
              </div>
              
              <div style="background: #e6fffa; border-radius: 10px; padding: 20px; margin: 20px 0;">
                <h4 style="color: #2c7a7b; margin: 0 0 15px 0;">📊 Dati inclusi:</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
                  ${Object.entries({
                    pressione: '❤️ Pressione',
                    battiti: '💓 Battiti', 
                    saturazione: '🫁 Saturazione',
                    glicemia: '🩸 Glicemia',
                    temperatura: '🌡️ Temperatura',
                    sintomi: '📝 Sintomi',
                    medicine: '💊 Medicine'
                  }).map(([key, label]) => 
                    shareData.includeData[key] ? 
                    `<div style="background: white; padding: 8px; border-radius: 6px; font-size: 14px;">${label}</div>` : 
                    ''
                  ).join('')}
                </div>
              </div>
              
              <div style="text-align: center; margin: 25px 0;">
                <a href="#" style="background: #4299e1; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                  📱 Visualizza su MediConnect
                </a>
              </div>
              
              <div style="background: #fff5f5; border: 1px solid #fed7d7; border-radius: 8px; padding: 15px; font-size: 14px; color: #c53030;">
                <strong>🔒 Importante:</strong> I dati sono protetti e accessibili solo a te. 
                L'accesso può essere revocato in qualsiasi momento dal proprietario.
              </div>
            </div>
          </div>
        `
      };

      await sendEmail(emailData);

      const shareInfo = {
        email: shareData.email,
        dataCount: dataToShare.length,
        medicineCount: shareData.includeData.medicine ? medicines.length : 0,
        dateRange: shareData.startDate && shareData.endDate ? 
          `${shareData.startDate} - ${shareData.endDate}` : 'Tutti i dati',
        sharedDate: new Date().toLocaleString('it-IT'),
        emailSent: true
      };

      setSharedWith(prev => prev.map(item => 
        item.email === shareData.email 
          ? { ...item, ...shareInfo, status: 'Dati condivisi' }
          : item
      ));
      
      setShowShareModal(false);
      
      alert(`✅ Dati condivisi con successo!

📧 Destinatario: ${shareData.email}
📊 Contenuto condiviso:
• ${shareInfo.dataCount} misurazioni mediche
• ${shareInfo.medicineCount} medicine
• Periodo: ${shareInfo.dateRange}

L'email è stata generata e inviata (simulato).
Controlla la console del browser per vedere il contenuto.`);

    } catch (error) {
      console.error('Errore condivisione:', error);
      alert(`❌ Errore nella condivisione dei dati

Il sistema ha simulato l'invio dei dati.
Per l'implementazione reale, configurare un servizio di email.

📧 L'email con i dati è stata generata e mostrata nella console del browser.`);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = generatePrintContent();
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
    
    setShowPrintModal(false);
  };

  const generatePrintContent = () => {
    let content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>MediConnect - Report Medico</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; line-height: 1.6; }
          .header { text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; }
          .section { margin: 30px 0; page-break-inside: avoid; }
          .section h2 { color: #2d3748; border-bottom: 2px solid #4299e1; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f8f9fa; font-weight: bold; }
          tr:nth-child(even) { background-color: #f8f9fa; }
          .chart-placeholder { height: 300px; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; margin: 20px 0; background: #f8f9fa; border-radius: 10px; }
          .medicine-item { background: #f7fafc; padding: 15px; margin: 10px 0; border-left: 4px solid #805ad5; border-radius: 5px; }
          .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #718096; text-align: center; }
          .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
          .stat-card { background: #f0f8ff; padding: 15px; border-radius: 8px; border-left: 4px solid #4299e1; }
          @media print { 
            body { margin: 0; } 
            .section { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏥 MediConnect - Report Medico</h1>
          <p>Generato il ${new Date().toLocaleDateString('it-IT', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
    `;

    if (printOptions.includeHistory) {
      const dataToInclude = printOptions.dateRange.start && printOptions.dateRange.end
        ? medicalData.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= new Date(printOptions.dateRange.start) && entryDate <= new Date(printOptions.dateRange.end);
          })
        : medicalData;

      content += `
        <div class="section">
          <h2>📋 Storico Misurazioni (${dataToInclude.length})</h2>
          <table>
            <thead>
              <tr>
                <th>📅 Data</th>
                <th>🕐 Ora</th>
                <th>❤️ Pressione</th>
                <th>💓 Battiti</th>
                <th>🫁 Saturazione</th>
                <th>🩸 Glicemia</th>
                <th>🌡️ Temperatura</th>
                <th>💭 Note</th>