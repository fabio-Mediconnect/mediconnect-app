import React, { useState, useEffect } from 'react';
import { User, UserPlus, Heart, Thermometer, Droplet, Activity, Send, Mail, Eye, Edit3, Save, X, TrendingUp, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const MedicalDataApp = () => {
  const [userType, setUserType] = useState('patient');
  const [currentUser, setCurrentUser] = useState({ name: 'Mario Rossi', email: 'mario.rossi@email.com' });
  const [medicalData, setMedicalData] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [authorizedDoctors, setAuthorizedDoctors] = useState([]);
  const [currentPatientData, setCurrentPatientData] = useState(null);
  const [activeTab, setActiveTab] = useState('data');
  
  const [formData, setFormData] = useState({
    pressione: '',
    glicemia: '',
    temperatura: '',
    sintomi: ''
  });
  const [inviteEmail, setInviteEmail] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [editingDiagnosis, setEditingDiagnosis] = useState(false);

  useEffect(() => {
    if (userType === 'patient') {
      setMedicalData([
        {
          id: 1,
          date: '2025-08-31',
          time: '09:00',
          pressione: '125/82',
          pressione_sys: 125,
          pressione_dia: 82,
          glicemia: '98',
          glicemia_num: 98,
          temperatura: '36.8',
          temperatura_num: 36.8,
          sintomi: 'Leggero mal di testa mattutino',
          diagnosis: '',
          treatment: '',
          doctorName: ''
        },
        {
          id: 2,
          date: '2025-08-30',
          time: '14:30',
          pressione: '120/80',
          pressione_sys: 120,
          pressione_dia: 80,
          glicemia: '95',
          glicemia_num: 95,
          temperatura: '36.5',
          temperatura_num: 36.5,
          sintomi: 'Leggero mal di testa, stanchezza',
          diagnosis: 'Valori nella norma. Stress lavorativo possibile causa dei sintomi.',
          treatment: 'Riposo, idratazione. Controllo tra una settimana.',
          doctorName: 'Dr. Maria Bianchi'
        },
        {
          id: 3,
          date: '2025-08-29',
          time: '08:15',
          pressione: '118/78',
          pressione_sys: 118,
          pressione_dia: 78,
          glicemia: '92',
          glicemia_num: 92,
          temperatura: '36.4',
          temperatura_num: 36.4,
          sintomi: 'Nessun sintomo particolare',
          diagnosis: 'Valori ottimali.',
          treatment: 'Continuare stile di vita attuale.',
          doctorName: 'Dr. Maria Bianchi'
        },
        {
          id: 4,
          date: '2025-08-28',
          time: '19:20',
          pressione: '140/90',
          pressione_sys: 140,
          pressione_dia: 90,
          glicemia: '110',
          glicemia_num: 110,
          temperatura: '37.1',
          temperatura_num: 37.1,
          sintomi: 'Mal di testa intenso, nausea',
          diagnosis: 'Pressione leggermente elevata. Monitorare.',
          treatment: 'Ridurre sale, aumentare attività fisica.',
          doctorName: 'Dr. Maria Bianchi'
        },
        {
          id: 5,
          date: '2025-08-27',
          time: '16:45',
          pressione: '135/88',
          pressione_sys: 135,
          pressione_dia: 88,
          glicemia: '88',
          glicemia_num: 88,
          temperatura: '36.6',
          temperatura_num: 36.6,
          sintomi: 'Affaticamento dopo pranzo',
          diagnosis: 'Glicemia nella norma, pressione da monitorare.',
          treatment: 'Dieta equilibrata, controllo settimanale.',
          doctorName: 'Dr. Maria Bianchi'
        }
      ]);
      setAuthorizedDoctors([
        { name: 'Dr. Maria Bianchi', email: 'maria.bianchi@ospedale.it', specialty: 'Medicina Generale' }
      ]);
    } else {
      setCurrentPatientData({
        id: 1,
        date: '2025-08-31',
        time: '09:15',
        patientName: 'Mario Rossi',
        patientEmail: 'mario.rossi@email.com',
        pressione: '130/85',
        pressione_sys: 130,
        pressione_dia: 85,
        glicemia: '105',
        glicemia_num: 105,
        temperatura: '37.2',
        temperatura_num: 37.2,
        sintomi: 'Mal di testa persistente, vertigini occasionali, difficoltà nel dormire',
        diagnosis: '',
        treatment: ''
      });
    }
  }, [userType]);

  const getPressureColor = (systolic, diastolic) => {
    if (systolic < 90 || diastolic < 60) return '#3B82F6';
    if (systolic <= 119 && diastolic <= 79) return '#10B981';
    if (systolic <= 129 || diastolic <= 79) return '#F59E0B';
    if (systolic <= 139 || diastolic <= 89) return '#F97316';
    return '#EF4444';
  };

  const getGlucoseColor = (glucose) => {
    if (glucose < 70) return '#3B82F6';
    if (glucose <= 99) return '#10B981';
    if (glucose <= 125) return '#F59E0B';
    if (glucose <= 180) return '#F97316';
    return '#EF4444';
  };

  const getTemperatureColor = (temp) => {
    if (temp < 36) return '#3B82F6';
    if (temp <= 37.2) return '#10B981';
    if (temp <= 38) return '#F59E0B';
    if (temp <= 39) return '#F97316';
    return '#EF4444';
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitData = () => {
    if (!formData.pressione && !formData.glicemia && !formData.temperatura && !formData.sintomi) {
      alert('Inserire almeno un dato medico');
      return;
    }

    let pressione_sys = null, pressione_dia = null;
    if (formData.pressione) {
      const pressureParts = formData.pressione.split('/');
      if (pressureParts.length === 2) {
        pressione_sys = parseInt(pressureParts[0]);
        pressione_dia = parseInt(pressureParts[1]);
      }
    }

    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
      ...formData,
      pressione_sys,
      pressione_dia,
      glicemia_num: formData.glicemia ? parseFloat(formData.glicemia) : null,
      temperatura_num: formData.temperatura ? parseFloat(formData.temperatura) : null,
      diagnosis: '',
      treatment: '',
      doctorName: ''
    };

    setMedicalData(prev => [newEntry, ...prev]);
    setFormData({ pressione: '', glicemia: '', temperatura: '', sintomi: '' });
    alert('Dati medici inviati con successo!');
  };

  const handleInviteDoctor = () => {
    if (!inviteEmail.includes('@')) {
      alert('Inserire un indirizzo email valido');
      return;
    }

    const newInvitation = {
      id: Date.now(),
      email: inviteEmail,
      status: 'sent',
      date: new Date().toISOString().split('T')[0]
    };

    setInvitations(prev => [...prev, newInvitation]);
    setInviteEmail('');
    alert(`Invito inviato a ${newInvitation.email}`);
  };

  const handleSaveDiagnosis = () => {
    if (!diagnosis.trim()) {
      alert('Inserire una diagnosi');
      return;
    }

    setCurrentPatientData(prev => ({
      ...prev,
      diagnosis,
      treatment,
      doctorName: 'Dr. Maria Bianchi'
    }));
    setEditingDiagnosis(false);
    alert('Diagnosi e cura salvate con successo!');
  };

  const prepareChartData = () => {
    return medicalData
      .filter(entry => entry.pressione_sys || entry.glicemia_num)
      .map(entry => ({
        date: entry.date,
        dateDisplay: new Date(entry.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }),
        pressione_sys: entry.pressione_sys,
        pressione_dia: entry.pressione_dia,
        glicemia: entry.glicemia_num,
        temperatura: entry.temperatura_num
      }))
      .reverse();
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Data: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}${entry.name.includes('Pressione') ? ' mmHg' : 
                entry.name.includes('Glicemia') ? ' mg/dL' : '°C'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const ChartsView = () => {
    const chartData = prepareChartData();
    
    if (chartData.length === 0) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <TrendingUp className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500">Nessun dato disponibile per i grafici</p>
          <p className="text-sm text-gray-400">Inserisci almeno 2 misurazioni per visualizzare i trend</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Heart className="mr-2 text-red-600" size={20} />
            Storico Pressione Arteriosa
          </h3>
          
          <div className="mb-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span>Bassa (&lt;90/60)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span>Normale (90-119/60-79)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
              <span>Elevata (120-129/&lt;80)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
              <span>Alta Stadio 1 (130-139/80-89)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span>Alta Stadio 2 (≥140/≥90)</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dateDisplay" />
              <YAxis domain={[60, 160]} />
              <Tooltip content={<CustomTooltip />} />
              
              <ReferenceLine y={90} stroke="#3B82F6" strokeDasharray="2 2" />
              <ReferenceLine y={120} stroke="#10B981" strokeDasharray="2 2" />
              <ReferenceLine y={130} stroke="#F59E0B" strokeDasharray="2 2" />
              <ReferenceLine y={140} stroke="#EF4444" strokeDasharray="2 2" />
              
              <Line 
                type="monotone" 
                dataKey="pressione_sys" 
                stroke="#DC2626" 
                strokeWidth={3}
                name="Pressione Sistolica"
                dot={{ fill: '#DC2626', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="pressione_dia" 
                stroke="#7C3AED" 
                strokeWidth={3}
                name="Pressione Diastolica"
                dot={{ fill: '#7C3AED', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Droplet className="mr-2 text-blue-600" size={20} />
            Storico Glicemia
          </h3>
          
          <div className="mb-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span>Ipoglicemia (&lt;70)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span>Normale (70-99)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
              <span>Prediabete (100-125)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
              <span>Diabete (126-180)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span>Diabete Severo (&gt;180)</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.filter(d => d.glicemia)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dateDisplay" />
              <YAxis domain={[60, 200]} />
              <Tooltip content={<CustomTooltip />} />
              
              <ReferenceLine y={70} stroke="#3B82F6" strokeDasharray="2 2" />
              <ReferenceLine y={100} stroke="#10B981" strokeDasharray="2 2" />
              <ReferenceLine y={126} stroke="#F59E0B" strokeDasharray="2 2" />
              <ReferenceLine y={180} stroke="#EF4444" strokeDasharray="2 2" />
              
              <Line 
                type="monotone" 
                dataKey="glicemia" 
                stroke="#059669" 
                strokeWidth={3}
                name="Glicemia"
                dot={(props) => {
                  const color = getGlucoseColor(props.payload.glicemia);
                  return <circle cx={props.cx} cy={props.cy} r={5} fill={color} strokeWidth={2} stroke="#fff" />;
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Thermometer className="mr-2 text-orange-600" size={20} />
            Storico Temperatura Corporea
          </h3>
          
          <div className="mb-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span>Ipotermia (&lt;36°C)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span>Normale (36-37.2°C)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
              <span>Febbre Lieve (37.3-38°C)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
              <span>Febbre (38.1-39°C)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span>Febbre Alta (&gt;39°C)</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.filter(d => d.temperatura)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dateDisplay" />
              <YAxis domain={[35, 40]} />
              <Tooltip content={<CustomTooltip />} />
              
              <ReferenceLine y={36} stroke="#3B82F6" strokeDasharray="2 2" />
              <ReferenceLine y={37.2} stroke="#10B981" strokeDasharray="2 2" />
              <ReferenceLine y={38} stroke="#F59E0B" strokeDasharray="2 2" />
              <ReferenceLine y={39} stroke="#EF4444" strokeDasharray="2 2" />
              
              <Line 
                type="monotone" 
                dataKey="temperatura" 
                stroke="#EA580C" 
                strokeWidth={3}
                name="Temperatura"
                dot={(props) => {
                  const color = getTemperatureColor(props.payload.temperatura);
                  return <circle cx={props.cx} cy={props.cy} r={5} fill={color} strokeWidth={2} stroke="#fff" />;
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const PatientView = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <User className="text-blue-600" size={24} />
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              <Calendar size={16} style={{ marginRight: '5px' }} />
              Data misurazione:
            </label>
            <input
              type="date"
              value={formData.data}
              onChange={(e) => handleInputChange('data', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">Pannello Paziente</h2>
            <p className="text-gray-600">{currentUser.name} - {currentUser.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('data')}
            className={`flex-1 p-4 text-center font-medium flex items-center justify-center ${
              activeTab === 'data' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <Activity className="mr-2" size={16} />
            Dati Medici
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`flex-1 p-4 text-center font-medium flex items-center justify-center ${
              activeTab === 'charts' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <TrendingUp className="mr-2" size={16} />
            Grafici e Trend
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'data' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Activity className="mr-2 text-green-600" size={20} />
                  Inserisci Nuovi Dati Medici
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Heart className="inline mr-1" size={16} />
                      Pressione Arteriosa (mmHg)
                    </label>
                    <input
                      type="text"
                      placeholder="es. 120/80"
                      className="w-full p-2 border rounded-md"
                      value={formData.pressione}
                      onChange={(e) => handleInputChange('pressione', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Droplet className="inline mr-1" size={16} />
                      Glicemia (mg/dL)
                    </label>
                    <input
                      type="number"
                      placeholder="es. 95"
                      className="w-full p-2 border rounded-md"
                      value={formData.glicemia}
                      onChange={(e) => handleInputChange('glicemia', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Thermometer className="inline mr-1" size={16} />
                      Temperatura Corporea (°C)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="es. 36.5"
                      className="w-full p-2 border rounded-md"
                      value={formData.temperatura}
                      onChange={(e) => handleInputChange('temperatura', e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrizione Sintomi
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Descrivi i tuoi sintomi..."
                    className="w-full p-2 border rounded-md"
                    value={formData.sintomi}
                    onChange={(e) => handleInputChange('sintomi', e.target.value)}
                  />
                </div>

                <button
                  onClick={handleSubmitData}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Send className="mr-2" size={16} />
                  Invia Dati
                </button>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <UserPlus className="mr-2 text-purple-600" size={20} />
                  Invita Medico
                </h3>
                
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Email del medico..."
                    className="flex-1 p-2 border rounded-md"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                  <button
                    onClick={handleInviteDoctor}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center"
                  >
                    <Mail className="mr-1" size={16} />
                    Invita
                  </button>
                </div>

                {invitations.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">Inviti Inviati:</h4>
                    {invitations.map(inv => (
                      <div key={inv.id} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {inv.email} - {inv.date} ({inv.status === 'sent' ? 'Inviato' : 'Accettato'})
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {authorizedDoctors.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Medici Autorizzati</h3>
                  {authorizedDoctors.map((doctor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <div className="font-medium">{doctor.name}</div>
                        <div className="text-sm text-gray-600">{doctor.email} - {doctor.specialty}</div>
                      </div>
                      <div className="text-green-600">✓ Autorizzato</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <ChartsView />
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar className="mr-2 text-gray-600" size={20} />
          Storico Completo Dati Medici ({medicalData.length} registrazioni)
        </h3>
        {medicalData.length === 0 ? (
          <p className="text-gray-500">Nessun dato inserito ancora</p>
        ) : (
          <div className="space-y-4">
            {medicalData.map(entry => (
              <div key={entry.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm text-gray-600">{entry.date} - {entry.time}</div>
                  {!entry.diagnosis && (
                    <div className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
                      IN ATTESA DIAGNOSI
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  {entry.pressione && (
                    <div>
                      <span className="text-xs text-gray-500">Pressione:</span>
                      <div 
                        className="font-medium p-1 rounded text-white text-center"
                        style={{ backgroundColor: getPressureColor(entry.pressione_sys, entry.pressione_dia) }}
                      >
                        {entry.pressione} mmHg
                      </div>
                    </div>
                  )}
                  {entry.glicemia && (
                    <div>
                      <span className="text-xs text-gray-500">Glicemia:</span>
                      <div 
                        className="font-medium p-1 rounded text-white text-center"
                        style={{ backgroundColor: getGlucoseColor(entry.glicemia_num) }}
                      >
                        {entry.glicemia} mg/dL
                      </div>
                    </div>
                  )}
                  {entry.temperatura && (
                    <div>
                      <span className="text-xs text-gray-500">Temperatura:</span>
                      <div 
                        className="font-medium p-1 rounded text-white text-center"
                        style={{ backgroundColor: getTemperatureColor(entry.temperatura_num) }}
                      >
                        {entry.temperatura}°C
                      </div>
                    </div>
                  )}
                </div>

                {entry.sintomi && (
                  <div className="mb-3">
                    <span className="text-xs text-gray-500">Sintomi:</span>
                    <div className="text-sm">{entry.sintomi}</div>
                  </div>
                )}

                {entry.diagnosis && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-800 mb-1">
                      Diagnosi - {entry.doctorName}
                    </div>
                    <div className="text-sm text-blue-700 mb-2">{entry.diagnosis}</div>
                    {entry.treatment && (
                      <div>
                        <div className="text-sm font-medium text-blue-800 mb-1">Cura Prescritta:</div>
                        <div className="text-sm text-blue-700">{entry.treatment}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const DoctorView = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <User className="text-green-600" size={24} />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Pannello Medico</h2>
            <p className="text-gray-600">Dr. Maria Bianchi - Medicina Generale</p>
          </div>
        </div>
      </div>

      {currentPatientData && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Eye className="mr-2 text-blue-600" size={20} />
            Dati Paziente: {currentPatientData.patientName}
          </h3>
          
          <div className="border-l-4 border-orange-500 pl-4 py-3 bg-orange-50 rounded-r-lg mb-4">
            <div className="flex justify-between items-start mb-2">
              <div className="text-sm text-gray-600">
                {currentPatientData.date} - {currentPatientData.time}
              </div>
              <div className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
                NUOVO
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              {currentPatientData.pressione && (
                <div>
                  <span className="text-xs text-gray-500">Pressione:</span>
                  <div 
                    className="font-medium p-1 rounded text-white text-center text-sm"
                    style={{ backgroundColor: getPressureColor(currentPatientData.pressione_sys, currentPatientData.pressione_dia) }}
                  >
                    {currentPatientData.pressione} mmHg
                  </div>
                </div>
              )}
              {currentPatientData.glicemia && (
                <div>
                  <span className="text-xs text-gray-500">Glicemia:</span>
                  <div 
                    className="font-medium p-1 rounded text-white text-center text-sm"
                    style={{ backgroundColor: getGlucoseColor(currentPatientData.glicemia_num) }}
                  >
                    {currentPatientData.glicemia} mg/dL
                  </div>
                </div>
              )}
              {currentPatientData.temperatura && (
                <div>
                  <span className="text-xs text-gray-500">Temperatura:</span>
                  <div 
                    className="font-medium p-1 rounded text-white text-center text-sm"
                    style={{ backgroundColor: getTemperatureColor(currentPatientData.temperatura_num) }}
                  >
                    {currentPatientData.temperatura}°C
                  </div>
                </div>
              )}
            </div>

            {currentPatientData.sintomi && (
              <div className="mb-4">
                <span className="text-xs text-gray-500">Sintomi Descritti:</span>
                <div className="text-sm text-orange-700">{currentPatientData.sintomi}</div>
              </div>
            )}

            <div className="mt-4 p-3 bg-white rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">Diagnosi e Cura</h4>
                {!editingDiagnosis ? (
                  <button
                    onClick={() => setEditingDiagnosis(true)}
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                  >
                    <Edit3 size={14} className="mr-1" />
                    Modifica
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveDiagnosis}
                      className="text-green-600 hover:text-green-800 flex items-center text-sm"
                    >
                      <Save size={14} className="mr-1" />
                      Salva
                    </button>
                    <button
                      onClick={() => setEditingDiagnosis(false)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {editingDiagnosis ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Diagnosi
                    </label>
                    <textarea
                      rows="3"
                      placeholder="Inserisci la diagnosi..."
                      className="w-full p-2 border rounded-md"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cura Prescritta
                    </label>
                    <textarea
                      rows="3"
                      placeholder="Inserisci la cura e le indicazioni..."
                      className="w-full p-2 border rounded-md"
                      value={treatment}
                      onChange={(e) => setTreatment(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {currentPatientData.diagnosis ? (
                    <>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Diagnosi:</span>
                        <div className="text-sm text-gray-800">{currentPatientData.diagnosis}</div>
                      </div>
                      {currentPatientData.treatment && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Cura:</span>
                          <div className="text-sm text-gray-800">{currentPatientData.treatment}</div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      Clicca "Modifica" per aggiungere diagnosi e cura
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Storico Paziente per il Medico */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Storico Completo Paziente</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <Heart className="mx-auto mb-2 text-red-600" size={24} />
            <div className="text-sm text-gray-600">Ultima Pressione</div>
            <div className="font-bold text-lg">130/85 mmHg</div>
            <div className="text-xs text-orange-600">Leggermente Elevata</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <Droplet className="mx-auto mb-2 text-blue-600" size={24} />
            <div className="text-sm text-gray-600">Ultima Glicemia</div>
            <div className="font-bold text-lg">105 mg/dL</div>
            <div className="text-xs text-yellow-600">Prediabete</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <Thermometer className="mx-auto mb-2 text-orange-600" size={24} />
            <div className="text-sm text-gray-600">Ultima Temperatura</div>
            <div className="font-bold text-lg">37.2°C</div>
            <div className="text-xs text-orange-600">Febbre Lieve</div>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 mb-4">
          Totale misurazioni: {medicalData.length} | Periodo: {medicalData.length > 0 ? `${medicalData[medicalData.length-1]?.date} - ${medicalData[0]?.date}` : 'N/A'}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            MediConnect - Condivisione Dati Medici
          </h1>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setUserType('patient')}
              className={`px-4 py-2 rounded-md flex items-center ${
                userType === 'patient' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <User className="mr-2" size={16} />
              Vista Paziente
            </button>
            <button
              onClick={() => setUserType('doctor')}
              className={`px-4 py-2 rounded-md flex items-center ${
                userType === 'doctor' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <User className="mr-2" size={16} />
              Vista Medico
            </button>
          </div>
        </div>

        {userType === 'patient' ? <PatientView /> : <DoctorView />}

        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-600">
          <p>🔒 I tuoi dati medici sono protetti e condivisi solo con i medici autorizzati</p>
          <p className="mt-1">📊 I grafici mostrano i trend con codici colore basati sui valori medici standard</p>
          <p className="mt-1">📱 Questa è una demo dell'app - In produzione includerebbe autenticazione sicura</p>
        </div>
      </div>
    </div>
  );
};

export default MedicalDataApp;