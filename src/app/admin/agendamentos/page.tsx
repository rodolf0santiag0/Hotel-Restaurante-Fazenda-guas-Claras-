"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Users as UsersIcon, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Phone, 
  Mail, 
  CalendarRange, 
  Edit3,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  Wrench,
  AlertCircle
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
  
  // Cabana Selecionada no Admin
  const [activeCabin, setActiveCabin] = useState<Cabin>(MOCK_CABINS[0]);
  
  // Busca na lista de cabanas
  const [cabinSearchTerm, setCabinSearchTerm] = useState<string>('');
  
  // Estados de Filtros e Busca de Clientes
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  
  // Controle de Mês
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(6); // Julho (0-indexed: 6)

  // Loading
  const [loading, setLoading] = useState<boolean>(true);
  
  // Modal de Ação Rápida
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

  // Estados para Edição de Cabana
  const [isEditCabinModalOpen, setIsEditCabinModalOpen] = useState<boolean>(false);
  const [editCabinName, setEditCabinName] = useState<string>('');
  const [editCabinCapacity, setEditCabinCapacity] = useState<number>(2);
  const [editCabinPrice, setEditCabinPrice] = useState<number>(350);
  const [editCabinDescription, setEditCabinDescription] = useState<string>('');
  const [savingCabin, setSavingCabin] = useState<boolean>(false);

  const handleOpenEditCabin = (cabin: Cabin) => {
    setEditCabinName(cabin.name);
    setEditCabinCapacity(cabin.capacity);
    setEditCabinPrice(cabin.price_per_night);
    setEditCabinDescription(cabin.description || '');
    setIsEditCabinModalOpen(true);
  };

  const handleSaveCabin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCabin) return;

    setSavingCabin(true);
    try {
      const { error } = await supabase
        .from('cabins')
        .update({
          name: editCabinName,
          capacity: editCabinCapacity,
          price_per_night: editCabinPrice,
          description: editCabinDescription
        })
        .eq('id', activeCabin.id);

      if (error) throw error;

      await loadDatabaseData();
      setIsEditCabinModalOpen(false);

    } catch (err: any) {
      alert(`Erro ao atualizar cabana: ${err.message || err}`);
    } finally {
      setSavingCabin(false);
    }
  };

  // Inicializar e carregar dados
  const loadDatabaseData = async () => {
    try {
      setLoading(true);
      
      const { data: dbCabins, error: cabinsErr } = await supabase
        .from('cabins')
        .select('*')
        .order('name');
      
      if (!cabinsErr && dbCabins && dbCabins.length > 0) {
        setCabins(dbCabins);
        const currentActive = dbCabins.find(c => c.id === activeCabin.id) || dbCabins[0];
        setActiveCabin(currentActive);
      }

      const { data: dbBookings, error: bookingsErr } = await supabase
        .from('bookings')
        .select(`
          *,
          clients (*)
        `);
      
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
        cabin_id: '1',
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
        cabin_id: '2',
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
        cabin_id: '3',
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

  const getDaysInMonth = () => {
    const daysCount = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    return Array.from({ length: daysCount }, (_, i) => i + 1);
  };

  const getBookingForDay = (cabinId: string, day: number) => {
    const monthStr = String(selectedMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${selectedYear}-${monthStr}-${dayStr}`;

    return bookings.find(b => {
      if (b.status === 'cancelado') return false;
      return b.cabin_id === cabinId && dateStr >= b.check_in_date && dateStr <= b.check_out_date;
    }) || null;
  };

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
    <div className="min-h-screen bg-bgPrimary dark:bg-[#23170F] p-4 md:p-8 font-sans selection:bg-gold/25 selection:text-coffee">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-beige/40 pb-6">
        <div className="flex items-center gap-3">
          <div className="transition-transform duration-300 hover:scale-103">
            <img 
              src="/images/logo.png?v=4" 
              alt="Logo Fazenda Águas Claras"
              className="h-12 w-auto mix-blend-multiply dark:mix-blend-normal dark:brightness-0 dark:invert"
            />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-coffee dark:text-stone-100">Painel CRM & Agendamentos</h1>
            <p className="text-xs text-[#B58346] font-light">Fazenda Águas Claras • Gestão Administrativa</p>
          </div>
        </div>

        {/* Abas */}
        <div className="flex bg-[#EADDC8]/40 dark:bg-stone-900/50 p-1.5 rounded-2xl border border-beige/30">
          <button
            onClick={() => setActiveTab('agendamentos')}
            className={cn(
              "px-5 py-2.5 text-xs font-semibold rounded-xl transition-all duration-300 flex items-center gap-2",
              activeTab === 'agendamentos' 
                ? "bg-gold text-white shadow-sm"
                : "text-wood hover:text-coffee dark:text-stone-400"
            )}
          >
            <CalendarRange className="w-4 h-4" />
            Ocupação Individual
          </button>
          <button
            onClick={() => setActiveTab('clientes')}
            className={cn(
              "px-5 py-2.5 text-xs font-semibold rounded-xl transition-all duration-300 flex items-center gap-2",
              activeTab === 'clientes' 
                ? "bg-gold text-white shadow-sm"
                : "text-wood hover:text-coffee dark:text-stone-400"
            )}
          >
            <UsersIcon className="w-4 h-4" />
            Leads / Clientes
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="bg-bgCard dark:bg-[#2E1F17] rounded-3xl border border-beige/40 dark:border-stone-800 shadow-md overflow-hidden">
        
        {/* VIEW 1: AGENDAMENTOS */}
        {activeTab === 'agendamentos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-beige/40 dark:divide-stone-800 min-h-[600px]">
            
            {/* Coluna Esquerda: Seletor */}
            <div className="lg:col-span-4 p-6 space-y-6 bg-[#FAF7F2]/45 dark:bg-stone-950/20">
              <div className="space-y-1">
                <h3 className="text-xs font-serif font-bold text-coffee dark:text-stone-300 uppercase tracking-widest">Acomodações</h3>
                <p className="text-[11px] text-wood font-light">Selecione uma cabana para exibir a ocupação</p>
              </div>

              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filtrar cabanas..."
                  value={cabinSearchTerm}
                  onChange={e => setCabinSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-beige/40 dark:border-stone-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-gold bg-bgCard dark:bg-stone-950 text-coffee dark:text-stone-200"
                />
              </div>

              {/* Lista */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredCabins.map(cabin => {
                  const statusToday = getCabinStatusToday(cabin.id);
                  const isSelected = activeCabin.id === cabin.id;

                  return (
                    <button
                      key={cabin.id}
                      onClick={() => setActiveCabin(cabin)}
                      className={cn(
                        "w-full p-4 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between gap-3",
                        isSelected 
                          ? "bg-gold border-gold text-white shadow-md shadow-gold/10" 
                          : "bg-bgCard dark:bg-stone-900 border-beige/30 dark:border-stone-800 hover:border-gold/30 hover:bg-gold/5 text-coffee dark:text-stone-200"
                      )}
                    >
                      <div className="space-y-1">
                        <div className="font-serif font-bold text-sm">{cabin.name}</div>
                        <div className={cn(
                          "text-[10px] font-light",
                          isSelected ? "text-stone-200" : "text-wood"
                        )}>
                          Capacidade: {cabin.capacity}p • R$ {cabin.price_per_night}
                        </div>
                      </div>

                      <span className={cn(
                        "text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border",
                        statusToday === 'free' && (isSelected ? "bg-white/20 border-white/30 text-white" : "bg-emerald-50 border-emerald-100 text-emerald-800"),
                        statusToday === 'confirmado' && (isSelected ? "bg-white/20 border-white/30 text-white" : "bg-blue-50 border-blue-100 text-blue-800"),
                        statusToday === 'pendente' && (isSelected ? "bg-white/20 border-white/30 text-white" : "bg-amber-50 border-amber-100 text-amber-800"),
                        statusToday === 'manutencao' && (isSelected ? "bg-white/20 border-white/30 text-white" : "bg-red-50 border-red-100 text-red-800")
                      )}>
                        {statusToday === 'free' ? 'Livre' : statusToday === 'manutencao' ? 'Manut' : 'Ocup'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Coluna Direita: Ocupação Detalhada */}
            <div className="lg:col-span-8 p-6 space-y-6">
              
              {/* Header Cabana */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-beige/20 dark:border-stone-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-coffee dark:text-stone-200 flex items-center gap-2">
                    <CalendarIcon className="w-5.5 h-5.5 text-gold" />
                    Ocupação: {activeCabin.name}
                  </h2>
                  <p className="text-xs text-wood font-light leading-relaxed max-w-md mt-0.5">
                    {activeCabin.description || 'Cabana padrão de luxo com lareira e hidromassagem.'}
                  </p>
                  <button
                    onClick={() => handleOpenEditCabin(activeCabin)}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold/10 hover:bg-gold hover:text-white text-gold text-[10px] font-bold rounded-lg border border-gold/20 transition-all duration-200"
                  >
                    <Edit3 className="w-3 h-3" /> Editar Cabana
                  </button>
                </div>

                {/* Controles de Mês */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <select
                    value={selectedMonth}
                    onChange={e => setSelectedMonth(Number(e.target.value))}
                    className="px-3.5 py-2 border border-beige/40 dark:border-stone-800 rounded-xl text-xs focus:outline-none bg-bgCard dark:bg-stone-900 text-coffee dark:text-stone-200 font-semibold"
                  >
                    {monthNames.map((name, idx) => (
                      <option key={idx} value={idx}>{name}</option>
                    ))}
                  </select>

                  <select
                    value={selectedYear}
                    onChange={e => setSelectedYear(Number(e.target.value))}
                    className="px-3.5 py-2 border border-beige/40 dark:border-stone-800 rounded-xl text-xs focus:outline-none bg-bgCard dark:bg-stone-900 text-coffee dark:text-stone-200 font-semibold"
                  >
                    <option value={2026}>2026</option>
                    <option value={2027}>2027</option>
                  </select>
                  
                  <button
                    onClick={loadDatabaseData}
                    className="p-2 border border-beige/40 dark:border-stone-800 rounded-xl text-wood hover:text-coffee hover:bg-stone-50 dark:hover:bg-stone-950 transition-all duration-200"
                    title="Atualizar Dados"
                  >
                    <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
                  </button>
                </div>
              </div>

              {/* 1. VISÃO LINHA DO TEMPO */}
              <div className="space-y-3">
                <h4 className="text-xs font-serif font-bold text-wood uppercase tracking-widest flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-gold" /> Linha do Tempo Mensal
                </h4>
                <div className="overflow-x-auto border border-beige/30 dark:border-stone-800 rounded-2xl shadow-sm">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#FAF7F2]/45 dark:bg-stone-950 border-b border-beige/30 dark:border-stone-800">
                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-wood min-w-[120px]">Dia</th>
                        {daysInMonth.map(day => (
                          <th key={day} className="px-1.5 py-2.5 text-center text-xs font-bold text-wood border-l border-beige/20 dark:border-stone-800 min-w-[32px]">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-stone-50/10">
                        <td className="px-4 py-4 text-xs font-bold text-coffee dark:text-stone-300">Status</td>
                        {daysInMonth.map(day => {
                          const booking = getBookingForDay(activeCabin.id, day);
                          let cellBg = "bg-transparent hover:bg-gold/5";
                          
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
                                "h-11 text-center text-[10px] cursor-pointer transition-all duration-200 border-l border-beige/20 dark:border-stone-800",
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

              {/* 2. VISÃO GRADE CALENDÁRIO */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-serif font-bold text-wood uppercase tracking-widest flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-gold" /> Visão Calendário
                </h4>
                
                <div className="border border-beige/30 dark:border-stone-800 rounded-3xl p-6 bg-[#FAF7F2]/45 dark:bg-stone-950/20 shadow-sm">
                  <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold uppercase tracking-wider text-wood mb-3">
                    <div>Dom</div>
                    <div>Seg</div>
                    <div>Ter</div>
                    <div>Qua</div>
                    <div>Qui</div>
                    <div>Sex</div>
                    <div>Sáb</div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: new Date(selectedYear, selectedMonth, 1).getDay() }).map((_, idx) => (
                      <div key={`offset-${idx}`} className="h-12 bg-[#FAF7F2]/10 dark:bg-stone-900/10 rounded-xl" />
                    ))}
                    
                    {daysInMonth.map(day => {
                      const booking = getBookingForDay(activeCabin.id, day);
                      let cellClass = "bg-bgCard hover:bg-beige/10 dark:bg-stone-900 dark:hover:bg-stone-800 border border-beige/20 dark:border-stone-800 text-coffee dark:text-stone-300";
                      
                      if (booking) {
                        if (booking.status === 'confirmado') cellClass = "bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600 shadow-sm";
                        else if (booking.status === 'pendente') cellClass = "bg-amber-400 border-amber-400 text-stone-900 hover:bg-amber-500 shadow-sm";
                        else if (booking.status === 'manutencao') cellClass = "bg-red-500 border-red-500 text-white [background-image:repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.15)_2px,rgba(255,255,255,0.15)_5px)] hover:opacity-90 shadow-sm";
                      }

                      return (
                        <button
                          key={day}
                          onClick={() => handleCellClick(activeCabin, day)}
                          className={cn(
                            "h-12 rounded-xl flex flex-col justify-between p-1.5 text-xs font-bold transition-all duration-200 relative border",
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
              <div className="flex flex-wrap gap-5 justify-center text-[10px] uppercase font-bold tracking-wider text-wood border-t border-beige/20 dark:border-stone-800 pt-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-bgCard dark:bg-stone-900 border border-beige/40 dark:border-stone-800" />
                  <span>Disponível</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-amber-400" />
                  <span>Pré-Agendamento</span>
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

        {/* VIEW 2: CLIENTES */}
        {activeTab === 'clientes' && (
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-serif font-bold text-coffee dark:text-stone-200">Base de Clientes e Leads</h2>
                <p className="text-xs text-wood font-light">Total de {filteredClients.length} leads cadastrados</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Buscar nome, e-mail..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border border-beige/40 dark:border-stone-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-gold bg-bgCard dark:bg-stone-900 text-coffee dark:text-stone-200 w-[200px]"
                  />
                </div>

                <div className="flex items-center gap-1.5 border border-beige/40 dark:border-stone-800 p-2.5 rounded-xl text-xs bg-[#FAF7F2]/45 dark:bg-stone-900 text-coffee dark:text-stone-300">
                  <Filter className="w-4 h-4 text-[#B58346]" />
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="focus:outline-none bg-transparent font-semibold"
                  >
                    <option value="todos">Todos Status</option>
                    <option value="novo">Novo</option>
                    <option value="em contato">Em Contato</option>
                    <option value="convertido">Convertido</option>
                  </select>
                </div>

                {/* Botão Primário Dourado */}
                <button
                  onClick={handleExportClientsCSV}
                  className="px-5 py-2.5 bg-gold hover:bg-coffee text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all duration-300"
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-beige/30 dark:border-stone-800 rounded-2xl shadow-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#FAF7F2]/45 dark:bg-stone-950 border-b border-beige/30 dark:border-stone-800 text-left text-[10px] font-bold text-wood uppercase tracking-widest">
                    <th className="px-6 py-4">Nome</th>
                    <th className="px-6 py-4">Contato</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 font-serif">Criado em</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige/20 dark:divide-stone-800">
                  {filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-sm text-stone-400 font-light">
                        Nenhum lead encontrado com os filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map(client => (
                      <tr key={client.id} className="hover:bg-stone-50/10 text-xs">
                        <td className="px-6 py-4 font-bold text-coffee dark:text-stone-200">
                          {client.name}
                        </td>
                        <td className="px-6 py-4 space-y-1">
                          <div className="flex items-center gap-2 text-wood dark:text-stone-400">
                            <Mail className="w-3.5 h-3.5" />
                            <span>{client.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-wood dark:text-stone-400">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{client.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider",
                            client.status === 'novo' && "bg-blue-50 text-blue-800 border border-blue-100",
                            client.status === 'em contato' && "bg-amber-50 text-amber-800 border border-amber-100",
                            client.status === 'convertido' && "bg-emerald-50 text-emerald-800 border border-emerald-100"
                          )}>
                            {client.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-stone-500 font-light">
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
                            className="inline-flex items-center justify-center p-2 rounded-xl bg-[#FAF7F2] border border-beige/40 text-coffee hover:bg-beige/10 transition-colors"
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

      {/* MODAL DETALHE/CRIAÇÃO DE RESERVA (Framer Motion + AnimatePresence) */}
      <AnimatePresence>
        {isDetailModalOpen && selectedDayInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Card */}
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="relative w-full max-w-md bg-bgCard dark:bg-[#2E1F17] rounded-[2rem] shadow-2xl overflow-hidden border border-beige/40 dark:border-stone-800 z-10"
            >
              <div className="p-6 bg-coffee text-white flex justify-between items-center border-b border-beige/10">
                <div>
                  <h4 className="text-lg font-serif font-bold text-gold">
                    {selectedDayInfo.booking ? 'Gerenciar Reserva' : 'Bloquear / Agendar'}
                  </h4>
                  <p className="text-xs text-stone-300 font-light mt-0.5">
                    {selectedDayInfo.cabin.name} • {formatDateBR(selectedDayInfo.dateStr)}
                  </p>
                </div>
                <button 
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-white hover:text-gold text-2xl font-light transition-colors"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSaveBookingAdmin} className="p-6 space-y-4">
                <div className="space-y-3">
                  {adminBookingStatus !== 'manutencao' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-wood mb-1">Nome do Hóspede</label>
                        <input
                          type="text"
                          required
                          value={adminGuestName}
                          onChange={e => setAdminGuestName(e.target.value)}
                          placeholder="Nome completo"
                          className="w-full px-4 py-2.5 border border-beige/40 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-[#FAF7F2] dark:bg-stone-950 text-coffee dark:text-stone-250"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-wood mb-1">WhatsApp</label>
                        <input
                          type="text"
                          required
                          value={adminGuestPhone}
                          onChange={e => setAdminGuestPhone(e.target.value)}
                          placeholder="(47) 99999-9999"
                          className="w-full px-4 py-2.5 border border-beige/40 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-[#FAF7F2] dark:bg-stone-950 text-coffee dark:text-stone-250"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-wood mb-1">E-mail</label>
                        <input
                          type="email"
                          required
                          value={adminGuestEmail}
                          onChange={e => setAdminGuestEmail(e.target.value)}
                          placeholder="cliente@email.com"
                          className="w-full px-4 py-2.5 border border-beige/40 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-[#FAF7F2] dark:bg-stone-950 text-coffee dark:text-stone-250"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-wood mb-1">Status da Ocupação</label>
                    <select
                      value={adminBookingStatus}
                      onChange={e => setAdminBookingStatus(e.target.value as BookingStatus)}
                      className="w-full px-4 py-2.5 border border-beige/40 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-[#FAF7F2] dark:bg-stone-950 text-coffee dark:text-stone-250"
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
                      <label className="block text-xs font-bold text-wood mb-1">Quantidade de Hóspedes</label>
                      <input
                        type="number"
                        min={1}
                        max={selectedDayInfo.cabin.capacity}
                        value={adminNumGuests}
                        onChange={e => setAdminNumGuests(Number(e.target.value))}
                        className="w-full px-4 py-2.5 border border-beige/40 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-[#FAF7F2] dark:bg-stone-950 text-coffee dark:text-stone-250"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-wood mb-1">Notas Administrativas</label>
                    <textarea
                      value={adminNotes}
                      onChange={e => setAdminNotes(e.target.value)}
                      placeholder="Detalhes adicionais..."
                      rows={3}
                      className="w-full px-4 py-2.5 border border-beige/40 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-[#FAF7F2] dark:bg-stone-950 text-coffee dark:text-stone-250 resize-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDetailModalOpen(false)}
                    className="flex-1 py-3 border border-beige rounded-xl text-sm font-semibold text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={updatingBooking}
                    className="flex-1 py-3 bg-gold hover:bg-coffee text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 border border-gold/10"
                  >
                    {updatingBooking ? 'Salvando...' : 'Confirmar'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DE EDIÇÃO DE CABANA */}
      <AnimatePresence>
        {isEditCabinModalOpen && activeCabin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditCabinModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Card */}
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="relative w-full max-w-md bg-bgCard dark:bg-[#2E1F17] rounded-[2rem] shadow-2xl overflow-hidden border border-beige/40 dark:border-stone-800 z-10"
            >
              <div className="p-6 bg-coffee text-white flex justify-between items-center border-b border-beige/10">
                <div>
                  <h4 className="text-lg font-serif font-bold text-gold">Editar Cabana</h4>
                  <p className="text-xs text-stone-300 font-light mt-0.5">{activeCabin.name}</p>
                </div>
                <button 
                  onClick={() => setIsEditCabinModalOpen(false)}
                  className="text-white hover:text-gold text-2xl font-light transition-colors"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSaveCabin} className="p-6 space-y-4">
                <div className="space-y-3">
                  {/* Nome da Cabana */}
                  <div>
                    <label className="block text-xs font-bold text-wood mb-1">Nome da Cabana</label>
                    <input
                      type="text"
                      required
                      value={editCabinName}
                      onChange={e => setEditCabinName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-beige/40 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-[#FAF7F2] dark:bg-stone-950 text-coffee dark:text-stone-250 font-bold"
                    />
                  </div>

                  {/* Capacidade */}
                  <div>
                    <label className="block text-xs font-bold text-wood mb-1">Capacidade Máxima (Hóspedes)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={editCabinCapacity}
                      onChange={e => setEditCabinCapacity(Number(e.target.value))}
                      className="w-full px-4 py-2.5 border border-beige/40 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-[#FAF7F2] dark:bg-stone-950 text-coffee dark:text-stone-250"
                    />
                  </div>

                  {/* Valor por Noite */}
                  <div>
                    <label className="block text-xs font-bold text-wood mb-1">Valor da Diária (R$)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={0.01}
                      value={editCabinPrice}
                      onChange={e => setEditCabinPrice(Number(e.target.value))}
                      className="w-full px-4 py-2.5 border border-beige/40 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-[#FAF7F2] dark:bg-stone-950 text-coffee dark:text-stone-250 font-bold text-emerald-800 dark:text-emerald-400"
                    />
                  </div>

                  {/* Descrição */}
                  <div>
                    <label className="block text-xs font-bold text-wood mb-1">Descrição / Detalhes</label>
                    <textarea
                      value={editCabinDescription}
                      onChange={e => setEditCabinDescription(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-beige/40 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold bg-[#FAF7F2] dark:bg-stone-950 text-coffee dark:text-stone-250 resize-none font-light leading-relaxed"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditCabinModalOpen(false)}
                    className="flex-1 py-3 border border-beige rounded-xl text-sm font-semibold text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={savingCabin}
                    className="flex-1 py-3 bg-gold hover:bg-coffee text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 border border-gold/10"
                  >
                    {savingCabin ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
