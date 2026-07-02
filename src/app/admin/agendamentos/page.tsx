"use client";

import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Users as UsersIcon, 
  Search, 
  Filter, 
  Download, 
  Wrench, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Phone, 
  Mail, 
  CalendarRange, 
  Edit3,
  TrendingUp,
  FileText,
  Clock,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn, formatDateBR, calculateNights } from '@/lib/utils';
import { Cabin, Client, Booking, BookingStatus } from '@/types';

// Cabanas Mock para Fallback
const MOCK_CABINS: Cabin[] = [
  { id: '1', name: 'Cabana 01 - Vale Verde', description: 'Vista para o vale verde e banheira de hidromassagem.', capacity: 2, is_active: true, price_per_night: 450, image_url: null, created_at: '' },
  { id: '2', name: 'Cabana 02 - Recanto da Serra', description: 'Cabana rústica no alto da montanha, ideal para casais.', capacity: 2, is_active: true, price_per_night: 480, image_url: null, created_at: '' },
  { id: '3', name: 'Cabana 03 - Sol Nascente', description: 'Excelente iluminação natural pela manhã e deck privativo.', capacity: 4, is_active: true, price_per_night: 600, image_url: null, created_at: '' },
  { id: '4', name: 'Cabana 04 - Lago Azul', description: 'Localizada às margens do lago, com pier próprio para pesca.', capacity: 3, is_active: true, price_per_night: 520, image_url: null, created_at: '' },
  { id: '5', name: 'Cabana 05 - Brisa do Bosque', description: 'Cercada por mata nativa, perfeita para quem busca silêncio.', capacity: 2, is_active: true, price_per_night: 420, image_url: null, created_at: '' },
  { id: '6', name: 'Cabana 06 - Das Flores', description: 'Jardim florido privativo e lareira interna a lenha.', capacity: 2, is_active: true, price_per_night: 460, image_url: null, created_at: '' },
  { id: '7', name: 'Cabana 07 - Do Lago', description: 'Vista panorâmica do lago com banheira externa aquecida.', capacity: 2, is_active: true, price_per_night: 550, image_url: null, created_at: '' },
  { id: '8', name: 'Cabana 08 - Vista Alegre', description: 'Deck suspenso com uma das vistas mais bonitas da fazenda.', capacity: 4, is_active: true, price_per_night: 650, image_url: null, created_at: '' },
  { id: '9', name: 'Cabana 09 - Pinheiro', description: 'Cabana familiar espaçosa entre pinheiros centenários.', capacity: 6, is_active: true, price_per_night: 800, image_url: null, created_at: '' },
  { id: '10', name: 'Cabana 10 - Cachoeira', description: 'Próxima ao riacho com o som relaxante da queda d\'água.', capacity: 2, is_active: true, price_per_night: 490, image_url: null, created_at: '' },
  { id: '11', name: 'Cabana 11 - Araucária', description: 'Estrutura alpina clássica e banheira estilo vitoriano.', capacity: 2, is_active: true, price_per_night: 500, image_url: null, created_at: '' },
  { id: '12', name: 'Cabana 12 - Sol da Manhã', description: 'Grande painel de vidro voltado para o leste.', capacity: 3, is_active: true, price_per_night: 530, image_url: null, created_at: '' },
  { id: '13', name: 'Cabana 13 - Lua Cheia', description: 'Teto de vidro sobre a cama para observar as estrelas.', capacity: 2, is_active: true, price_per_night: 580, image_url: null, created_at: '' },
  { id: '14', name: 'Cabana 14 - Estrela', description: 'Ambiente moderno e minimalista integrado à natureza.', capacity: 2, is_active: true, price_per_night: 470, image_url: null, created_at: '' },
  { id: '15', name: 'Cabana 15 - Das Pedras', description: 'Construída com pedras locais, lareira e adega.', capacity: 4, is_active: true, price_per_night: 700, image_url: null, created_at: '' },
  { id: '16', name: 'Cabana 16 - Cantinho da Paz', description: 'Afastada das áreas de lazer, máxima privacidade.', capacity: 2, is_active: true, price_per_night: 440, image_url: null, created_at: '' },
  { id: '17', name: 'Cabana 17 - Beira Rio', description: 'A poucos passos do rio que corta a propriedade.', capacity: 4, is_active: true, price_per_night: 590, image_url: null, created_at: '' },
  { id: '18', name: 'Cabana 18 - Recanto Feliz', description: 'Amplo espaço externo com churrasqueira.', capacity: 5, is_active: true, price_per_night: 750, image_url: null, created_at: '' },
  { id: '19', name: 'Cabana 19 - Bela Vista', description: 'Ponto mais alto da propriedade com pôr do sol espetacular.', capacity: 2, is_active: true, price_per_night: 600, image_url: null, created_at: '' },
  { id: '20', name: 'Cabana 20 - Monte Branco', description: 'Design escandinavo, sauna privativa e piso aquecido.', capacity: 2, is_active: true, price_per_night: 900, image_url: null, created_at: '' }
];

// Leads Mock
const MOCK_CLIENTS: Client[] = [
  { id: 'c1', name: 'Carlos Eduardo', email: 'carlos.edu@gmail.com', phone: '(47) 98822-1133', status: 'novo', created_at: '2026-07-01T14:32:00Z' },
  { id: 'c2', name: 'Mariana Costa', email: 'mariana.c@hotmail.com', phone: '(11) 99122-3344', status: 'em contato', created_at: '2026-06-30T10:15:00Z' },
  { id: 'c3', name: 'Roberto Santos', email: 'roberto.santos@outlook.com', phone: '(48) 98855-4422', status: 'convertido', created_at: '2026-06-28T18:45:00Z' },
  { id: 'c4', name: 'Patrícia Souza', email: 'paty.souza@gmail.com', phone: '(51) 99766-5544', status: 'novo', created_at: '2026-07-02T09:12:00Z' },
];

export default function CRMAdminPage() {
  // Tabs: 'agendamentos' | 'clientes'
  const [activeTab, setActiveTab] = useState<'agendamentos' | 'clientes'>('agendamentos');
  
  // Dados principais
  const [cabins, setCabins] = useState<Cabin[]>(MOCK_CABINS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  
  // Cabana Selecionada no Admin (Filtro à esquerda)
  const [activeCabin, setActiveCabin] = useState<Cabin>(MOCK_CABINS[0]);
  
  // Busca na lista de cabanas (esquerda)
  const [cabinSearchTerm, setCabinSearchTerm] = useState<string>('');
  
  // Estados de Filtros e Busca de Clientes (aba Clientes)
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  
  // Controle de Mês no Gantt/Calendário
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(6); // Julho (0-indexed: 6)

  // Loading
  const [loading, setLoading] = useState<boolean>(true);
  
  // Modal de Ação Rápida (Administrador clica em célula no Gantt)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedDayInfo, setSelectedDayInfo] = useState<{
    dateStr: string;
    cabin: Cabin;
    booking: Booking | null;
  } | null>(null);

  // Estados do Form do Admin
  const [adminGuestName, setAdminGuestName] = useState<string>('');
  const [adminGuestPhone, setAdminGuestPhone] = useState<string>('');
  const [adminGuestEmail, setAdminGuestEmail] = useState<string>('');
  const [adminBookingStatus, setAdminBookingStatus] = useState<BookingStatus>('pendente');
  const [adminNumGuests, setAdminNumGuests] = useState<number>(1);
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [updatingBooking, setUpdatingBooking] = useState<boolean>(false);

  // Inicializar e carregar dados do Supabase
  const loadDatabaseData = async () => {
    try {
      setLoading(true);
      
      // Carregar Cabanas do banco
      const { data: dbCabins, error: cabinsErr } = await supabase
        .from('cabins')
        .select('*')
        .order('name');
      
      if (!cabinsErr && dbCabins && dbCabins.length > 0) {
        setCabins(dbCabins);
        // Atualiza a cabana ativa caso sua referência tenha mudado
        const currentActive = dbCabins.find(c => c.id === activeCabin.id) || dbCabins[0];
        setActiveCabin(currentActive);
      }

      // Carregar Reservas
      const { data: dbBookings, error: bookingsErr } = await supabase
        .from('bookings')
        .select(`
          *,
          clients (*)
        `);
      
      // Carregar Leads
      const { data: dbClients, error: clientsErr } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (!bookingsErr && dbBookings) {
        setBookings(dbBookings);
      } else {
        generateMockBookings();
      }

      if (!clientsErr && dbClients) {
        setClients(dbClients);
      }

    } catch (err) {
      console.error("Erro ao integrar com Supabase, usando mocks.", err);
      generateMockBookings();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseData();
  }, []);

  // Cria reservas fictícias para demonstração se o banco estiver vazio
  const generateMockBookings = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    
    const mockB: Booking[] = [
      {
        id: 'b1',
        cabin_id: '1',
        client_id: 'c1',
        check_in_date: `${y}-${m}-02`,
        check_out_date: `${y}-${m}-06`,
        status: 'confirmado',
        num_guests: 2,
        notes: 'Casal comemorando aniversário de casamento',
        created_at: '',
        clients: MOCK_CLIENTS[0]
      },
      {
        id: 'b2',
        cabin_id: '1', // Cabana Vale Verde
        client_id: 'c2',
        check_in_date: `${y}-${m}-12`,
        check_out_date: `${y}-${m}-15`,
        status: 'pendente',
        num_guests: 2,
        notes: 'Solicitou café no quarto',
        created_at: '',
        clients: MOCK_CLIENTS[1]
      },
      {
        id: 'b3',
        cabin_id: '2', // Cabana Recanto da Serra
        client_id: 'c2',
        check_in_date: `${y}-${m}-04`,
        check_out_date: `${y}-${m}-08`,
        status: 'pendente',
        num_guests: 4,
        notes: 'Solicitou berço para bebê',
        created_at: '',
        clients: MOCK_CLIENTS[1]
      },
      {
        id: 'b4',
        cabin_id: '3', // Cabana Sol Nascente
        client_id: null,
        check_in_date: `${y}-${m}-10`,
        check_out_date: `${y}-${m}-15`,
        status: 'manutencao',
        num_guests: 1,
        notes: 'Pintura interna e troca de aquecedor',
        created_at: ''
      },
      {
        id: 'b5',
        cabin_id: '3',
        client_id: 'c3',
        check_in_date: `${y}-${m}-18`,
        check_out_date: `${y}-${m}-22`,
        status: 'confirmado',
        num_guests: 3,
        notes: 'Cliente recorrente',
        created_at: '',
        clients: MOCK_CLIENTS[2]
      }
    ];
    setBookings(mockB);
  };

  // Gerar dias do mês selecionado
  const getDaysInMonth = () => {
    const daysCount = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    return Array.from({ length: daysCount }, (_, i) => i + 1);
  };

  // Retorna reserva em vigor para uma cabana em um dia específico
  const getBookingForDay = (cabinId: string, day: number) => {
    const monthStr = String(selectedMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${selectedYear}-${monthStr}-${dayStr}`;

    return bookings.find(b => {
      if (b.status === 'cancelado') return false;
      return b.cabin_id === cabinId && dateStr >= b.check_in_date && dateStr <= b.check_out_date;
    }) || null;
  };

  // Manipular clique em um dia
  const handleCellClick = (cabin: Cabin, day: number) => {
    const monthStr = String(selectedMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${selectedYear}-${monthStr}-${dayStr}`;

    const booking = getBookingForDay(cabin.id, day);

    setSelectedDayInfo({
      dateStr,
      cabin,
      booking
    });

    if (booking) {
      setAdminGuestName(booking.clients?.name || 'Bloqueio administrativo');
      setAdminGuestPhone(booking.clients?.phone || '');
      setAdminGuestEmail(booking.clients?.email || '');
      setAdminBookingStatus(booking.status);
      setAdminNumGuests(booking.num_guests);
      setAdminNotes(booking.notes || '');
    } else {
      setAdminGuestName('');
      setAdminGuestPhone('');
      setAdminGuestEmail('');
      setAdminBookingStatus('pendente');
      setAdminNumGuests(1);
      setAdminNotes('Reserva criada via Painel Admin');
    }

    setIsDetailModalOpen(true);
  };

  // Salvar alterações de reserva (Criar / Editar / Cancelar)
  const handleSaveBookingAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDayInfo) return;

    setUpdatingBooking(true);
    const { dateStr, cabin, booking } = selectedDayInfo;

    try {
      if (booking) {
        if (adminBookingStatus === 'cancelado') {
          const { error } = await supabase
            .from('bookings')
            .update({ status: 'cancelado' })
            .eq('id', booking.id);
            
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('bookings')
            .update({
              status: adminBookingStatus,
              num_guests: adminNumGuests,
              notes: adminNotes
            })
            .eq('id', booking.id);

          if (error) throw error;

          if (booking.client_id) {
            await supabase
              .from('clients')
              .update({
                name: adminGuestName,
                phone: adminGuestPhone,
                email: adminGuestEmail
              })
              .eq('id', booking.client_id);
          }
        }
      } else {
        let clientId = null;
        if (adminBookingStatus !== 'manutencao' && adminGuestName) {
          const { data: newClient } = await supabase
            .from('clients')
            .insert({
              name: adminGuestName,
              email: adminGuestEmail,
              phone: adminGuestPhone,
              status: 'convertido'
            })
            .select('id')
            .single();
          
          if (newClient) clientId = newClient.id;
        }

        const { error } = await supabase
          .from('bookings')
          .insert({
            cabin_id: cabin.id,
            client_id: clientId,
            check_in_date: dateStr,
            check_out_date: dateStr,
            status: adminBookingStatus,
            num_guests: adminNumGuests,
            notes: adminNotes
          });

        if (error) throw error;
      }

      await loadDatabaseData();
      setIsDetailModalOpen(false);

    } catch (err: any) {
      alert(`Erro ao salvar: ${err.message || err}`);
    } finally {
      setUpdatingBooking(false);
    }
  };

  // Exportar Clientes para CSV
  const handleExportClientsCSV = () => {
    const headers = 'Nome,Email,Telefone,Status,Data de Criacao\n';
    const rows = filteredClients.map(c => 
      `"${c.name}","${c.email}","${c.phone}","${c.status}","${formatDateBR(c.created_at.split('T')[0])}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_aguas_claras_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  // Filtros
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          client.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          client.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'todos' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCabins = cabins.filter(cabin => 
    cabin.name.toLowerCase().includes(cabinSearchTerm.toLowerCase())
  );

  const daysInMonth = getDaysInMonth();

  // Verifica ocupação da cabana ativa HOJE
  const getCabinStatusToday = (cabinId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const match = bookings.find(b => 
      b.cabin_id === cabinId && 
      b.status !== 'cancelado' && 
      todayStr >= b.check_in_date && 
      todayStr <= b.check_out_date
    );
    return match ? match.status : 'free';
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 p-4 md:p-8 font-sans">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-stone-200 dark:border-stone-850 pb-6">
        <div className="flex items-center gap-3">
          <div>
            <img 
              src="/images/logo.png?v=3" 
              alt="Logo Fazenda Águas Claras"
              className="h-12 w-auto mix-blend-multiply dark:mix-blend-normal dark:brightness-0 dark:invert"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100">Painel CRM & Agendamentos</h1>
            <p className="text-xs text-stone-500">Fazenda Águas Claras • Gestão Administrativa</p>
          </div>
        </div>

        {/* Abas */}
        <div className="flex bg-stone-200 dark:bg-stone-900 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('agendamentos')}
            className={cn(
              "px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2",
              activeTab === 'agendamentos' 
                ? "bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            )}
          >
            <CalendarRange className="w-4 h-4" />
            Ocupação Individual
          </button>
          <button
            onClick={() => setActiveTab('clientes')}
            className={cn(
              "px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2",
              activeTab === 'clientes' 
                ? "bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            )}
          >
            <UsersIcon className="w-4 h-4" />
            Leads / Clientes
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-850 shadow-md overflow-hidden">
        
        {/* VIEW 1: AGENDAMENTOS INDIVIDUAIS (SPLIT-SCREEN) */}
        {activeTab === 'agendamentos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stone-200 dark:divide-stone-800 min-h-[600px]">
            
            {/* Coluna Esquerda: Seletor de Cabanas */}
            <div className="lg:col-span-4 p-6 space-y-6 bg-stone-50/50 dark:bg-stone-900/10">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider">Acomodações</h3>
                <p className="text-xs text-stone-500">Selecione uma cabana para exibir os dias de ocupação</p>
              </div>

              {/* Busca de Cabana */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filtrar por nome..."
                  value={cabinSearchTerm}
                  onChange={e => setCabinSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-stone-200 dark:border-stone-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 dark:bg-stone-900 text-stone-800 dark:text-stone-200"
                />
              </div>

              {/* Lista das Cabanas */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredCabins.map(cabin => {
                  const statusToday = getCabinStatusToday(cabin.id);
                  const isSelected = activeCabin.id === cabin.id;

                  return (
                    <button
                      key={cabin.id}
                      onClick={() => setActiveCabin(cabin)}
                      className={cn(
                        "w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3",
                        isSelected 
                          ? "bg-emerald-800 border-emerald-800 text-white shadow-md shadow-emerald-950/10" 
                          : "bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 hover:border-emerald-750 hover:bg-emerald-900/5 text-stone-800 dark:text-stone-250"
                      )}
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-sm">{cabin.name}</div>
                        <div className={cn(
                          "text-[10px]",
                          isSelected ? "text-emerald-200" : "text-stone-400"
                        )}>
                          Capacidade: {cabin.capacity}p • Diária: R$ {cabin.price_per_night}
                        </div>
                      </div>

                      {/* Badge de status de ocupação hoje */}
                      <span className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border",
                        statusToday === 'free' && (isSelected ? "bg-emerald-700/50 border-emerald-600 text-white" : "bg-emerald-50 border-emerald-200 text-emerald-800"),
                        statusToday === 'confirmado' && (isSelected ? "bg-blue-800/50 border-blue-600 text-white" : "bg-blue-50 border-blue-200 text-blue-800"),
                        statusToday === 'pendente' && (isSelected ? "bg-amber-800/50 border-amber-600 text-white" : "bg-amber-50 border-amber-200 text-amber-800"),
                        statusToday === 'manutencao' && (isSelected ? "bg-red-800/50 border-red-600 text-white" : "bg-red-50 border-red-200 text-red-800")
                      )}>
                        {statusToday === 'free' ? 'Livre' : statusToday === 'manutencao' ? 'Manut' : 'Ocup'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Coluna Direita: Ocupação Detalhada (Calendário e Linha de Tempo) */}
            <div className="lg:col-span-8 p-6 space-y-6">
              
              {/* Header da Cabana Ativa */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
                    <CalendarIcon className="w-5.5 h-5.5 text-emerald-850" />
                    Ocupação: {activeCabin.name}
                  </h2>
                  <p className="text-xs text-stone-500 leading-relaxed max-w-md">
                    {activeCabin.description || 'Cabana padrão de luxo com lareira e hidromassagem.'}
                  </p>
                </div>

                {/* Controles de Mês */}
                <div className="flex items-center gap-3 shrink-0">
                  <select
                    value={selectedMonth}
                    onChange={e => setSelectedMonth(Number(e.target.value))}
                    className="px-3 py-2 border border-stone-200 dark:border-stone-800 rounded-xl text-xs focus:outline-none dark:bg-stone-900 text-stone-800 dark:text-stone-200 font-semibold"
                  >
                    {monthNames.map((name, idx) => (
                      <option key={idx} value={idx}>{name}</option>
                    ))}
                  </select>

                  <select
                    value={selectedYear}
                    onChange={e => setSelectedYear(Number(e.target.value))}
                    className="px-3 py-2 border border-stone-200 dark:border-stone-800 rounded-xl text-xs focus:outline-none dark:bg-stone-900 text-stone-800 dark:text-stone-200 font-semibold"
                  >
                    <option value={2026}>2026</option>
                    <option value={2027}>2027</option>
                  </select>
                  
                  <button
                    onClick={loadDatabaseData}
                    className="p-2 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-600 hover:text-stone-800 hover:bg-stone-50 dark:text-stone-400 dark:hover:bg-stone-950 transition-all"
                    title="Atualizar Dados"
                  >
                    <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
                  </button>
                </div>
              </div>

              {/* 1. VISÃO LINHA DO TEMPO HORIZONTAL (GANTT INDIVIDUALE) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-800" /> Linha do Tempo Mensal
                </h4>
                <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 rounded-2xl">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-stone-50/50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800">
                        <th className="px-3 py-2.5 text-left text-xs font-bold text-stone-400 min-w-[120px]">Dia do Mês</th>
                        {daysInMonth.map(day => (
                          <th key={day} className="px-1.5 py-2 text-center text-xs font-bold text-stone-400 border-l border-stone-200 dark:border-stone-850 min-w-[32px]">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-stone-50/20">
                        <td className="px-3 py-4 text-xs font-bold text-stone-700 dark:text-stone-300">Status</td>
                        {daysInMonth.map(day => {
                          const booking = getBookingForDay(activeCabin.id, day);
                          let cellBg = "bg-transparent hover:bg-emerald-50/30";
                          
                          if (booking) {
                            if (booking.status === 'confirmado') cellBg = "bg-emerald-500 text-white hover:bg-emerald-600";
                            else if (booking.status === 'pendente') cellBg = "bg-amber-400 text-stone-900 hover:bg-amber-500";
                            else if (booking.status === 'manutencao') cellBg = "bg-red-500 text-white [background-image:repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.15)_2px,rgba(255,255,255,0.15)_5px)]";
                          }

                          return (
                            <td
                              key={day}
                              onClick={() => handleCellClick(activeCabin, day)}
                              className={cn(
                                "h-11 text-center text-[10px] cursor-pointer transition-all border-l border-stone-200 dark:border-stone-800",
                                cellBg
                              )}
                              title={booking ? `${booking.clients?.name || 'Bloqueio'} (${booking.status})` : 'Disponível - Clique para gerenciar'}
                            >
                              {booking && (
                                <span className="font-extrabold opacity-95">
                                  {booking.check_in_date.endsWith(String(day).padStart(2, '0')) 
                                    ? (booking.clients?.name ? booking.clients.name[0] : '🔧') 
                                    : '•'}
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. VISÃO GRADE CALENDÁRIO MENSAL INTEGRADA */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-emerald-800" /> Visão Calendário
                </h4>
                
                {/* Lógica de renderização de calendário clássico de 7 colunas */}
                <div className="border border-stone-200 dark:border-stone-800 rounded-3xl p-6 bg-white dark:bg-stone-950/40">
                  <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-stone-400 mb-3">
                    <div>Dom</div>
                    <div>Seg</div>
                    <div>Ter</div>
                    <div>Qua</div>
                    <div>Qui</div>
                    <div>Sex</div>
                    <div>Sáb</div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2">
                    {/* Calcula offset do mês */}
                    {Array.from({ length: new Date(selectedYear, selectedMonth, 1).getDay() }).map((_, idx) => (
                      <div key={`offset-${idx}`} className="h-12 bg-stone-50/20 dark:bg-stone-900/10 rounded-xl" />
                    ))}
                    
                    {/* Renderiza os dias do mês */}
                    {daysInMonth.map(day => {
                      const booking = getBookingForDay(activeCabin.id, day);
                      let cellClass = "bg-stone-50 hover:bg-stone-100 dark:bg-stone-900/60 dark:hover:bg-stone-900 border border-stone-200/40 dark:border-stone-800 text-stone-750 dark:text-stone-300";
                      
                      if (booking) {
                        if (booking.status === 'confirmado') cellClass = "bg-emerald-550 border-emerald-550 text-white hover:bg-emerald-600";
                        else if (booking.status === 'pendente') cellClass = "bg-amber-400 border-amber-400 text-stone-900 hover:bg-amber-500";
                        else if (booking.status === 'manutencao') cellClass = "bg-red-500 border-red-500 text-white [background-image:repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.15)_2px,rgba(255,255,255,0.15)_5px)] hover:opacity-90";
                      }

                      return (
                        <button
                          key={day}
                          onClick={() => handleCellClick(activeCabin, day)}
                          className={cn(
                            "h-12 rounded-xl flex flex-col justify-between p-1.5 text-xs font-bold transition-all relative border",
                            cellClass
                          )}
                        >
                          <span>{day}</span>
                          {booking && (
                            <span className="text-[8px] font-normal truncate w-full text-left opacity-90">
                              {booking.clients?.name ? booking.clients.name.split(' ')[0] : 'Bloqueio'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Legenda */}
              <div className="flex flex-wrap gap-6 justify-center text-[11px] font-semibold text-stone-500 border-t border-stone-100 dark:border-stone-850 pt-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-stone-50 border border-stone-200" />
                  <span>Disponível</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-amber-400" />
                  <span>Pré-Agendamento Pendente</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-emerald-500" />
                  <span>Confirmado</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-red-500 [background-image:repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.15)_2px,rgba(255,255,255,0.15)_5px)]" />
                  <span>Manutenção</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 2: LEADS / CLIENTES (DATA TABLE) */}
        {activeTab === 'clientes' && (
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-stone-800 dark:text-stone-200">Base de Clientes e Leads</h2>
                <p className="text-xs text-stone-500">Total de {filteredClients.length} leads cadastrados</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Buscar nome, e-mail..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-stone-900 text-stone-800 dark:text-stone-200 w-[200px]"
                  />
                </div>

                <div className="flex items-center gap-1.5 border border-stone-200 dark:border-stone-800 p-2 rounded-xl text-sm bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-300">
                  <Filter className="w-4 h-4 text-stone-400" />
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="focus:outline-none bg-transparent font-medium"
                  >
                    <option value="todos">Todos Status</option>
                    <option value="novo">Novo</option>
                    <option value="em contato">Em Contato</option>
                    <option value="convertido">Convertido</option>
                  </select>
                </div>

                <button
                  onClick={handleExportClientsCSV}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 rounded-2xl">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Nome</th>
                    <th className="px-6 py-4">Contato</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Criado em</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-sm text-stone-400">
                        Nenhum lead encontrado com os filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map(client => (
                      <tr key={client.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/40 text-sm">
                        <td className="px-6 py-4 font-bold text-stone-800 dark:text-stone-200">
                          {client.name}
                        </td>
                        <td className="px-6 py-4 space-y-1">
                          <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                            <Mail className="w-3.5 h-3.5" />
                            <span>{client.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{client.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                            client.status === 'novo' && "bg-blue-50 text-blue-800 border border-blue-100",
                            client.status === 'em contato' && "bg-amber-50 text-amber-800 border border-amber-100",
                            client.status === 'convertido' && "bg-emerald-50 text-emerald-800 border border-emerald-100"
                          )}>
                            {client.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-stone-500">
                          {formatDateBR(client.created_at.split('T')[0])}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <a
                            href={`https://api.whatsapp.com/send?phone=${client.phone.replace(/\D/g, '')}&text=${encodeURIComponent(`Olá, ${client.name}! Entramos em contato do Hotel Fazenda Águas Claras referente ao seu interesse em nossas cabanas.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            title="Conversar no WhatsApp"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                          
                          <button
                            onClick={async () => {
                              const nextStatus = client.status === 'novo' ? 'em contato' : client.status === 'em contato' ? 'convertido' : 'novo';
                              await supabase.from('clients').update({ status: nextStatus }).eq('id', client.id);
                              loadDatabaseData();
                            }}
                            className="inline-flex items-center justify-center p-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                            title="Alternar Status"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODAL DETALHE/CRIAÇÃO DE RESERVA (ADMIN DRAWER) */}
      {isDetailModalOpen && selectedDayInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800">
            <div className="p-6 bg-gradient-to-r from-emerald-800 to-teal-950 text-white flex justify-between items-center">
              <div>
                <h4 className="text-lg font-bold">
                  {selectedDayInfo.booking ? 'Gerenciar Reserva' : 'Bloquear / Agendar'}
                </h4>
                <p className="text-xs text-emerald-100 mt-0.5">
                  {selectedDayInfo.cabin.name} • {formatDateBR(selectedDayInfo.dateStr)}
                </p>
              </div>
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="text-white hover:text-stone-200 text-2xl font-light"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveBookingAdmin} className="p-6 space-y-4">
              <div className="space-y-3">
                {adminBookingStatus !== 'manutencao' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Nome do Hóspede</label>
                      <input
                        type="text"
                        required
                        value={adminGuestName}
                        onChange={e => setAdminGuestName(e.target.value)}
                        placeholder="Nome completo do lead/cliente"
                        className="w-full px-4 py-2 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none dark:bg-stone-950 text-stone-800 dark:text-stone-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">WhatsApp</label>
                      <input
                        type="text"
                        required
                        value={adminGuestPhone}
                        onChange={e => setAdminGuestPhone(e.target.value)}
                        placeholder="(47) 99999-9999"
                        className="w-full px-4 py-2 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none dark:bg-stone-950 text-stone-800 dark:text-stone-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">E-mail</label>
                      <input
                        type="email"
                        required
                        value={adminGuestEmail}
                        onChange={e => setAdminGuestEmail(e.target.value)}
                        placeholder="cliente@email.com"
                        className="w-full px-4 py-2 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none dark:bg-stone-950 text-stone-800 dark:text-stone-200"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Status da Ocupação</label>
                  <select
                    value={adminBookingStatus}
                    onChange={e => setAdminBookingStatus(e.target.value as BookingStatus)}
                    className="w-full px-4 py-2 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none dark:bg-stone-950 text-stone-800 dark:text-stone-200"
                  >
                    <option value="pendente">Pendente (Pré-Reserva)</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="manutencao">Bloqueio p/ Manutenção</option>
                    {selectedDayInfo.booking && (
                      <option value="cancelado">Cancelar Agendamento (Liberar Dia)</option>
                    )}
                  </select>
                </div>

                {adminBookingStatus !== 'manutencao' && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Quantidade de Hóspedes</label>
                    <input
                      type="number"
                      min={1}
                      max={selectedDayInfo.cabin.capacity}
                      value={adminNumGuests}
                      onChange={e => setAdminNumGuests(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none dark:bg-stone-950 text-stone-800 dark:text-stone-200"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Notas Administrativas</label>
                  <textarea
                    value={adminNotes}
                    onChange={e => setAdminNotes(e.target.value)}
                    placeholder="Detalhes adicionais, solicitações especiais..."
                    rows={3}
                    className="w-full px-4 py-2 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none dark:bg-stone-950 text-stone-800 dark:text-stone-200 resize-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="flex-1 py-3 border border-stone-200 dark:border-stone-800 rounded-xl text-sm font-semibold text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-950 transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={updatingBooking}
                  className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {updatingBooking ? 'Salvando...' : 'Confirmar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
