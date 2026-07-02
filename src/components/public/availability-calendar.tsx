"use client";

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  User, 
  Phone, 
  Mail, 
  Users, 
  Check, 
  AlertCircle, 
  Clock, 
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn, formatDateBR, calculateNights } from '@/lib/utils';
import { Booking, Cabin, ADMIN_WHATSAPP_NUMBER } from '@/types';

// Fallback estático das 20 cabanas se o banco falhar
const DEFAULT_CABINS: Cabin[] = Array.from({ length: 20 }, (_, idx) => {
  const num = idx + 1;
  const numStr = String(num).padStart(2, '0');
  return {
    id: String(num),
    name: `Cabana ${numStr}`,
    description: `Acomodação charmosa com hidromassagem e lareira.`,
    capacity: num === 9 ? 6 : (num === 3 || num === 8 || num === 15 || num === 17 ? 4 : (num === 18 ? 5 : 2)),
    price_per_night: num === 20 ? 900 : (num === 9 ? 800 : (num === 18 ? 750 : (num === 1 || num === 5 ? 450 : 500))),
    is_active: true,
    image_url: null,
    created_at: ''
  };
});

export default function AvailabilityCalendar() {
  // Estados do Calendário
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  // Dados do Supabase
  const [cabins, setCabins] = useState<Cabin[]>(DEFAULT_CABINS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  
  // Seleção de Intervalo de Datas
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  
  // Cabana Selecionada após verificar disponibilidade
  const [selectedCabin, setSelectedCabin] = useState<Cabin | null>(null);
  
  // Estado do Modal de Lead
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [numGuests, setNumGuests] = useState<number>(2);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Carregar cabanas e todas as reservas do Supabase
  useEffect(() => {
    async function loadData() {
      try {
        setLoadingData(true);
        
        // 1. Carregar Cabanas
        const { data: dbCabins, error: cabinsErr } = await supabase
          .from('cabins')
          .select('*')
          .eq('is_active', true)
          .order('name');
        
        if (!cabinsErr && dbCabins && dbCabins.length > 0) {
          setCabins(dbCabins);
        }

        // 2. Carregar todas as Reservas não canceladas
        const { data: dbBookings, error: bookingsErr } = await supabase
          .from('bookings')
          .select('*')
          .neq('status', 'cancelado');

        if (!bookingsErr && dbBookings) {
          setBookings(dbBookings);
        }
      } catch (err) {
        console.error('Erro ao integrar com Supabase, usando mocks locais.', err);
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, []);

  // Reseta a cabana selecionada se o usuário mudar as datas de reserva
  useEffect(() => {
    setSelectedCabin(null);
  }, [checkIn, checkOut]);

  // Auxiliares de Navegação do Mês
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Lógica para gerar as datas do grid do calendário
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const totalPrevDays = new Date(year, month, 0).getDate();

    const days = [];

    // Dias do mês anterior para alinhamento
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, totalPrevDays - i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        formatted: formatDateString(prevDate)
      });
    }

    // Dias do mês atual
    for (let i = 1; i <= totalDays; i++) {
      const currDate = new Date(year, month, i);
      days.push({
        date: currDate,
        isCurrentMonth: true,
        formatted: formatDateString(currDate)
      });
    }

    // Dias do próximo mês
    const totalGridCells = 42;
    const nextDaysCount = totalGridCells - days.length;
    for (let i = 1; i <= nextDaysCount; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        formatted: formatDateString(nextDate)
      });
    }

    return days;
  };

  const formatDateString = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Verifica se um dia específico está no passado
  const isDateInPast = (dateStr: string) => {
    const todayStr = formatDateString(new Date());
    return dateStr < todayStr;
  };

  // Manipula o clique nos dias
  const handleDateClick = (dateStr: string) => {
    if (isDateInPast(dateStr)) return;

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dateStr);
      setCheckOut(null);
    } else {
      if (dateStr < checkIn) {
        setCheckIn(dateStr);
      } else {
        setCheckOut(dateStr);
      }
    }
  };

  // Retorna se o dia está selecionado no intervalo
  const isDateSelected = (dateStr: string) => {
    if (checkIn === dateStr) return 'start';
    if (checkOut === dateStr) return 'end';
    
    if (checkIn && checkOut) {
      return dateStr > checkIn && dateStr < checkOut ? 'middle' : null;
    }
    
    if (checkIn && hoveredDate && !checkOut) {
      return dateStr > checkIn && dateStr <= hoveredDate ? 'hover-range' : null;
    }

    return null;
  };

  // FUNÇÃO CRÍTICA: Verifica se uma cabana específica está disponível no período selecionado
  const isCabinAvailable = (cabinId: string) => {
    if (!checkIn || !checkOut) return false;

    // Retorna verdadeiro se NÃO houver reservas conflitantes para esta cabana no período
    return !bookings.some(booking => {
      if (booking.cabin_id !== cabinId || booking.status === 'cancelado') return false;
      
      // Conflito de intervalo: (CheckIn_Usuário < Checkout_Existente) E (Checkout_Usuário > Checkin_Existente)
      return checkIn < booking.check_out_date && checkOut > booking.check_in_date;
    });
  };

  // Envio do Lead & Agendamento
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut || !selectedCabin) return;

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      // 1. Criar/buscar Lead do cliente
      const { data: existingClient, error: clientFetchError } = await supabase
        .from('clients')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (clientFetchError) throw clientFetchError;

      let clientId = existingClient?.id;

      if (!clientId) {
        const { data: newClient, error: clientInsertError } = await supabase
          .from('clients')
          .insert({ name, email, phone, status: 'novo' })
          .select('id')
          .single();

        if (clientInsertError) throw clientInsertError;
        clientId = newClient.id;
      } else {
        await supabase
          .from('clients')
          .update({ name, phone, status: 'novo' })
          .eq('id', clientId);
      }

      // 2. Gravar Reserva no Banco (como pré-agendamento pendente)
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          cabin_id: selectedCabin.id,
          client_id: clientId,
          check_in_date: checkIn,
          check_out_date: checkOut,
          status: 'pendente',
          num_guests: numGuests,
          notes: `Lead gerado pelo site público. Qtd hóspedes: ${numGuests}`
        });

      if (bookingError) throw bookingError;

      setSuccess(true);

      // 3. Redirecionar ao WhatsApp da Fazenda
      const nights = calculateNights(checkIn, checkOut);
      const totalPrice = nights * selectedCabin.price_per_night;
      
      const message = `Olá, Fazenda Águas Claras! 🌿\n\nGostaria de solicitar a reserva da *${selectedCabin.name}*.\n\n*Informações do Hóspede:*\n👤 Nome: ${name}\n📧 E-mail: ${email}\n📱 WhatsApp: ${phone}\n\n*Período Solicitado:*\n📅 Entrada: ${formatDateBR(checkIn)}\n📅 Saída: ${formatDateBR(checkOut)}\n🌙 Duração: ${nights} noites\n👥 Hóspedes: ${numGuests} pessoa(s)\n💰 Valor Estimado: R$ ${totalPrice.toFixed(2)}\n\nPor favor, confirmem a disponibilidade! Obrigado.`;

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${ADMIN_WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
      
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        setIsModalOpen(false);
        setCheckIn(null);
        setCheckOut(null);
        setSelectedCabin(null);
        setSuccess(false);
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Houve um erro ao processar sua solicitação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const days = getDaysInMonth();
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  return (
    <div className="w-full bg-white dark:bg-stone-900 border border-stone-250 dark:border-stone-800 rounded-3xl shadow-xl overflow-hidden space-y-6">
      
      {/* 1. SELETOR DE DATAS (CALENDÁRIO GENERALISTA) */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-950 text-white p-6 flex justify-between items-center border-b border-stone-850">
        <div>
          <h3 className="text-xl font-bold tracking-wide flex items-center gap-2 text-amber-400">
            <CalendarIcon className="w-5.5 h-5.5 text-amber-500" />
            1. Período da Estadia
          </h3>
          <p className="text-stone-300 text-xs mt-0.5">Selecione as datas de check-in e check-out</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrevMonth} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Mês Anterior"
          >
            <ChevronLeft className="w-5 h-5 text-stone-300" />
          </button>
          <span className="font-semibold min-w-[120px] text-center text-sm text-stone-100">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button 
            onClick={handleNextMonth} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Próximo Mês"
          >
            <ChevronRight className="w-5 h-5 text-stone-300" />
          </button>
        </div>
      </div>

      {/* Grid de Dias do Calendário */}
      <div className="px-6 pb-2">
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-stone-400 mb-3">
          <div>Dom</div>
          <div>Seg</div>
          <div>Ter</div>
          <div>Qua</div>
          <div>Qui</div>
          <div>Sex</div>
          <div>Sáb</div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            const isPast = isDateInPast(day.formatted);
            const selection = isDateSelected(day.formatted);
            
            return (
              <button
                key={idx}
                disabled={isPast}
                onClick={() => handleDateClick(day.formatted)}
                onMouseEnter={() => setHoveredDate(day.formatted)}
                onMouseLeave={() => setHoveredDate(null)}
                className={cn(
                  "h-11 w-full rounded-xl flex flex-col justify-center items-center text-sm font-bold transition-all relative border border-transparent",
                  
                  // Mês fora de foco
                  !day.isCurrentMonth && "text-stone-300 dark:text-stone-700",
                  
                  // Datas passadas
                  isPast && "text-stone-300 dark:text-stone-800 cursor-not-allowed bg-stone-50/50 dark:bg-stone-950/20 line-through",
                  
                  // Dias livres selecionáveis
                  !isPast && day.isCurrentMonth && "text-stone-750 dark:text-stone-300 hover:border-amber-500 hover:bg-amber-500/5",
                  
                  // Estilos do intervalo de seleção (Amber/Gold Theme)
                  selection === 'start' && "bg-amber-600 text-white rounded-xl shadow-md z-10",
                  selection === 'end' && "bg-amber-600 text-white rounded-xl shadow-md z-10",
                  selection === 'middle' && "bg-amber-100/60 text-amber-900 dark:bg-amber-950/20 dark:text-amber-300 rounded-none",
                  selection === 'hover-range' && "bg-amber-100/40 text-amber-800 dark:bg-amber-950/10 rounded-none border-dashed border-amber-300"
                )}
              >
                <span>{day.date.getDate()}</span>
                {day.formatted === formatDateString(new Date()) && (
                  <span className={cn(
                    "absolute bottom-1 w-1.5 h-1.5 rounded-full",
                    selection ? "bg-white" : "bg-amber-650"
                  )} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. GRID DAS CABANAS DISPONÍVEIS (NUMERAÇÃO DE 01 A 20) */}
      <div className="border-t border-stone-200 dark:border-stone-800 p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-stone-850 dark:text-stone-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            2. Seleção de Cabana
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {checkIn && checkOut 
              ? "Clique em um dos quadradinhos verdes abaixo para selecionar a cabana disponível."
              : "Defina o período da estadia acima para verificar a disponibilidade das cabanas."}
          </p>
        </div>

        {/* Grid de 20 Quadrados das Cabanas */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
          {cabins.map((cabin) => {
            const numLabel = cabin.name.replace(/\D/g, ''); // Extrai apenas o número da cabana (ex: "Cabana 03" -> "03")
            const isDatesSelected = checkIn && checkOut;
            const available = isDatesSelected && isCabinAvailable(cabin.id);
            const isSelected = selectedCabin?.id === cabin.id;

            return (
              <button
                key={cabin.id}
                type="button"
                disabled={!available}
                onClick={() => setSelectedCabin(cabin)}
                className={cn(
                  "h-12 w-full rounded-xl border flex flex-col items-center justify-center text-sm font-extrabold transition-all relative",
                  
                  // Estado sem data selecionada (Cinza neutro)
                  !isDatesSelected && "bg-stone-50 border-stone-200 text-stone-400 cursor-not-allowed",
                  
                  // Ocupada / Indisponível no período (Vermelho / Riscado)
                  isDatesSelected && !available && "bg-red-50/50 border-red-100 text-red-400 line-through cursor-not-allowed",
                  
                  // Disponível (Verde)
                  isDatesSelected && available && "bg-emerald-50 hover:bg-emerald-100 border-emerald-250 text-emerald-800 hover:scale-103",
                  
                  // Selecionada (Destaque dourado)
                  isSelected && "ring-4 ring-amber-500 bg-emerald-100 border-amber-600 text-emerald-900 scale-105 shadow-md"
                )}
                title={
                  !isDatesSelected 
                    ? "Selecione as datas primeiro" 
                    : available 
                      ? `${cabin.name} (Disponível - R$ ${cabin.price_per_night}/noite)` 
                      : `${cabin.name} (Ocupada ou bloqueada no período)`
                }
              >
                <span>{numLabel || cabin.name}</span>
                {isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-600 rounded-full flex items-center justify-center text-[9px] text-white">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legendas dos Quadrinhos */}
        <div className="flex flex-wrap gap-4 text-[11px] text-stone-500 justify-center pt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-stone-50 border border-stone-200" />
            <span>Aguardando Período</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-red-50/50 border border-red-100 line-through" />
            <span>Ocupado / Indisponível</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-emerald-50 border border-emerald-250" />
            <span>Disponível para Locação</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded border-2 border-amber-650 bg-emerald-100 ring-2 ring-amber-500" />
            <span>Sua Seleção</span>
          </div>
        </div>
      </div>

      {/* 3. RESUMO DA ESTADIA & SOLICITAÇÃO */}
      <div className="p-6 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {checkIn && !checkOut && (
            <p className="text-xs text-stone-500">
              Agora selecione o dia de <strong className="text-amber-700">Check-out (Saída)</strong> no calendário.
            </p>
          )}
          {checkIn && checkOut && !selectedCabin && (
            <p className="text-xs text-stone-600 dark:text-stone-400 font-semibold">
              Período: {formatDateBR(checkIn)} a {formatDateBR(checkOut)} ({calculateNights(checkIn, checkOut)} noites). <span className="text-emerald-700 font-bold block mt-1">Selecione uma cabana em verde acima.</span>
            </p>
          )}
          {checkIn && checkOut && selectedCabin && (
            <div className="text-xs text-stone-600 dark:text-stone-400">
              <p className="font-semibold">
                Período: <strong className="text-stone-850 dark:text-stone-200">{formatDateBR(checkIn)}</strong> a <strong className="text-stone-850 dark:text-stone-200">{formatDateBR(checkOut)}</strong>
              </p>
              <p className="mt-0.5">
                Cabana Selecionada: <strong className="text-emerald-800 dark:text-emerald-400 font-bold">{selectedCabin.name}</strong> • Diária: R$ {selectedCabin.price_per_night.toFixed(2)}
              </p>
              <div className="text-[10px] text-stone-400 mt-1">
                Valor estimado: R$ {(calculateNights(checkIn, checkOut) * selectedCabin.price_per_night).toFixed(2)} (por {calculateNights(checkIn, checkOut)} noites)
              </div>
            </div>
          )}
          {!checkIn && (
            <p className="text-xs text-stone-500">Nenhum período selecionado.</p>
          )}
        </div>
        
        <button
          disabled={!checkIn || !checkOut || !selectedCabin}
          onClick={() => setIsModalOpen(true)}
          className={cn(
            "px-6 py-3 rounded-full text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm",
            checkIn && checkOut && selectedCabin
              ? "bg-amber-600 hover:bg-amber-700 hover:shadow-md cursor-pointer"
              : "bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed"
          )}
        >
          <CalendarIcon className="w-4 h-4" />
          Solicitar Reserva
        </button>
      </div>

      {/* MODAL DE DADOS DO LEAD */}
      {isModalOpen && selectedCabin && checkIn && checkOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl overflow-hidden border border-stone-250 dark:border-stone-800">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-stone-900 to-stone-950 text-white flex justify-between items-center">
              <div>
                <h4 className="text-lg font-bold">Solicitar Pré-Agendamento</h4>
                <p className="text-xs text-amber-400 mt-0.5">{selectedCabin.name}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white text-2xl font-light"
              >
                &times;
              </button>
            </div>

            {/* Modal Body / Form */}
            {success ? (
              <div className="p-8 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <h5 className="text-xl font-bold text-stone-800 dark:text-stone-100">Solicitação Enviada!</h5>
                <p className="text-xs text-stone-500 mt-2">
                  Redirecionando para o WhatsApp da Fazenda Águas Claras...
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 font-medium">
                  <Clock className="w-4 h-4 animate-spin" /> Conectando ao WhatsApp
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="p-6 space-y-4">
                
                {/* Resumo */}
                <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-2xl text-xs space-y-1.5 border border-stone-200 dark:border-stone-800">
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-medium">Cabana:</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">{selectedCabin.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-medium">Período:</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">
                      {formatDateBR(checkIn)} a {formatDateBR(checkOut)} ({calculateNights(checkIn, checkOut)} noites)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-medium">Valor Total Estimado:</span>
                    <span className="font-bold text-emerald-800 dark:text-emerald-400">
                      R$ {(calculateNights(checkIn, checkOut) * selectedCabin.price_per_night).toFixed(2)}
                    </span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-550 dark:text-stone-400 mb-1">Nome Completo</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Nome completo do hóspede"
                        className="w-full pl-10 pr-4 py-2.5 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-stone-950 text-stone-800 dark:text-stone-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-550 dark:text-stone-400 mb-1">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="hospede@email.com"
                        className="w-full pl-10 pr-4 py-2.5 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-stone-950 text-stone-800 dark:text-stone-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-550 dark:text-stone-400 mb-1">WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="(47) 99999-9999"
                        className="w-full pl-10 pr-4 py-2.5 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-stone-950 text-stone-800 dark:text-stone-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-550 dark:text-stone-400 mb-1">Quantidade de Hóspedes</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                      <select
                        value={numGuests}
                        onChange={e => setNumGuests(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-2.5 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-stone-950 text-stone-800 dark:text-stone-200 appearance-none"
                      >
                        {Array.from({ length: selectedCabin.capacity }, (_, idx) => idx + 1).map(n => (
                          <option key={n} value={n}>{n} {n === 1 ? 'pessoa' : 'pessoas'} (Máx: {selectedCabin.capacity})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-stone-250 dark:border-stone-800 rounded-xl text-sm font-semibold text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-950 transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" /> Processando...
                      </>
                    ) : (
                      <>
                        Confirmar e Ir p/ WhatsApp
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
