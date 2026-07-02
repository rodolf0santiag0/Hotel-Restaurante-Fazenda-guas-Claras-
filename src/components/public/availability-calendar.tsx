"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Info,
  Sparkles
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
  
  // Cabana Selecionada
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

  // Carregar cabanas e reservas
  useEffect(() => {
    async function loadData() {
      try {
        setLoadingData(true);
        
        const { data: dbCabins, error: cabinsErr } = await supabase
          .from('cabins')
          .select('*')
          .eq('is_active', true)
          .order('name');
        
        if (!cabinsErr && dbCabins && dbCabins.length > 0) {
          setCabins(dbCabins);
        }

        const { data: dbBookings, error: bookingsErr } = await supabase
          .from('bookings')
          .select('*')
          .neq('status', 'cancelado');

        if (!bookingsErr && dbBookings) {
          setBookings(dbBookings);
        }
      } catch (err) {
        console.error('Erro ao carregar dados do Supabase, rodando localmente com mocks.', err);
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, []);

  // Reseta cabana se datas mudarem
  useEffect(() => {
    setSelectedCabin(null);
  }, [checkIn, checkOut]);

  // Navegação do Mês
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Gerar dias
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const totalPrevDays = new Date(year, month, 0).getDate();

    const days = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, totalPrevDays - i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        formatted: formatDateString(prevDate)
      });
    }

    for (let i = 1; i <= totalDays; i++) {
      const currDate = new Date(year, month, i);
      days.push({
        date: currDate,
        isCurrentMonth: true,
        formatted: formatDateString(currDate)
      });
    }

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

  const isDateInPast = (dateStr: string) => {
    const todayStr = formatDateString(new Date());
    return dateStr < todayStr;
  };

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

  const isCabinAvailable = (cabinId: string) => {
    if (!checkIn || !checkOut) return false;

    return !bookings.some(booking => {
      if (booking.cabin_id !== cabinId || booking.status === 'cancelado') return false;
      return checkIn < booking.check_out_date && checkOut > booking.check_in_date;
    });
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut || !selectedCabin) return;

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
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
    <div className="w-full bg-[#FFFDF9] dark:bg-[#2E1F17] border border-beige/40 dark:border-stone-800 rounded-[2rem] shadow-md shadow-coffee/5 overflow-hidden space-y-6">
      
      {/* 1. SELETOR DE DATAS */}
      <div className="bg-coffee text-white p-6 flex justify-between items-center border-b border-beige/10">
        <div>
          <h3 className="text-lg font-serif font-bold tracking-wide flex items-center gap-2 text-gold">
            <CalendarIcon className="w-5 h-5 text-gold" />
            1. Período da Estadia
          </h3>
          <p className="text-stone-300 text-[11px] mt-0.5 font-light">Selecione as datas de check-in e check-out</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrevMonth} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
            title="Mês Anterior"
          >
            <ChevronLeft className="w-4 h-4 text-stone-300" />
          </button>
          <span className="font-serif font-bold min-w-[110px] text-center text-xs text-stone-100 uppercase tracking-widest">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button 
            onClick={handleNextMonth} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
            title="Próximo Mês"
          >
            <ChevronRight className="w-4 h-4 text-stone-300" />
          </button>
        </div>
      </div>

      {/* Grid do Calendário */}
      <div className="px-6 pb-2">
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] uppercase tracking-wider text-wood mb-3">
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
                  "h-11 w-full rounded-xl flex flex-col justify-center items-center text-xs font-bold transition-all duration-200 relative border border-transparent",
                  
                  // Mês fora de foco
                  !day.isCurrentMonth && "text-stone-300 dark:text-stone-700",
                  
                  // Datas passadas
                  isPast && "text-stone-300 dark:text-stone-700 cursor-not-allowed bg-stone-50/50 dark:bg-stone-900/10 line-through",
                  
                  // Dias livres
                  !isPast && day.isCurrentMonth && "text-coffee dark:text-stone-300 hover:border-gold hover:bg-gold/5",
                  
                  // Selecionado / Hover (Dourado Premium)
                  selection === 'start' && "bg-gold text-white rounded-xl shadow-md z-10 hover:bg-gold",
                  selection === 'end' && "bg-gold text-white rounded-xl shadow-md z-10 hover:bg-gold",
                  selection === 'middle' && "bg-gold/10 text-coffee dark:bg-gold/5 dark:text-gold rounded-none",
                  selection === 'hover-range' && "bg-gold/5 text-gold rounded-none border-dashed border-gold/30"
                )}
              >
                <span>{day.date.getDate()}</span>
                {day.formatted === formatDateString(new Date()) && (
                  <span className={cn(
                    "absolute bottom-1.5 w-1 h-1 rounded-full",
                    selection ? "bg-white" : "bg-gold"
                  )} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. GRID DAS CABANAS */}
      <div className="border-t border-beige/40 dark:border-stone-800 p-6 space-y-4">
        <div>
          <h3 className="text-base font-serif font-bold text-coffee dark:text-stone-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold" />
            2. Seleção de Cabana
          </h3>
          <p className="text-xs text-wood font-light mt-0.5">
            {checkIn && checkOut 
              ? "Clique em um número verde abaixo para selecionar sua cabana preferida."
              : "Defina o período acima para verificar a disponibilidade das cabanas."}
          </p>
        </div>

        {/* Grid de 20 Quadrados */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5">
          {cabins.map((cabin) => {
            const numLabel = cabin.name.replace(/\D/g, '');
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
                  "h-12 w-full rounded-xl border flex flex-col items-center justify-center text-xs font-bold transition-all duration-300 relative",
                  
                  // Sem data
                  !isDatesSelected && "bg-[#FAF7F2]/60 border-beige/40 text-stone-400 cursor-not-allowed",
                  
                  // Ocupada
                  isDatesSelected && !available && "bg-red-50/30 border-red-100/50 text-red-300 line-through cursor-not-allowed",
                  
                  // Disponível (Verde Suave)
                  isDatesSelected && available && "bg-emerald-50/50 hover:bg-emerald-100/70 border-emerald-200 text-emerald-800 hover:scale-103",
                  
                  // Selecionada (Destaque Ouro com borda)
                  isSelected && "ring-4 ring-gold/20 bg-emerald-100 border-gold text-emerald-950 scale-105 shadow-md shadow-gold/5"
                )}
                title={
                  !isDatesSelected 
                    ? "Selecione as datas primeiro" 
                    : available 
                      ? `${cabin.name} (Livre - R$ ${cabin.price_per_night}/noite)` 
                      : `${cabin.name} (Ocupada no período)`
                }
              >
                <span>{numLabel || cabin.name}</span>
                {isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold rounded-full flex items-center justify-center text-[8px] text-white">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legendas */}
        <div className="flex flex-wrap gap-4 text-[10px] text-wood justify-center pt-2 font-light">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-[#FAF7F2] border border-beige/40" />
            <span>Aguardando datas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-red-50/30 border border-red-100/50 line-through" />
            <span>Ocupada</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-50/50 border border-emerald-200" />
            <span>Disponível</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded border-2 border-gold bg-emerald-100 ring-2 ring-gold/20" />
            <span>Selecionada</span>
          </div>
        </div>
      </div>

      {/* 3. RESUMO DA ESTADIA & AÇÃO */}
      <div className="p-6 bg-[#F5EFE4]/45 dark:bg-stone-900/50 border-t border-beige/40 dark:border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          {checkIn && !checkOut && (
            <p className="text-xs text-wood">
              Selecione o dia de <strong className="text-gold">Saída (Check-out)</strong> no calendário acima.
            </p>
          )}
          {checkIn && checkOut && !selectedCabin && (
            <p className="text-xs text-wood font-medium">
              Período: {formatDateBR(checkIn)} a {formatDateBR(checkOut)} ({calculateNights(checkIn, checkOut)} noites). <span className="text-emerald-800 font-bold block mt-0.5">Agora escolha o número da cabana livre (em verde) acima.</span>
            </p>
          )}
          {checkIn && checkOut && selectedCabin && (
            <div className="text-xs text-wood space-y-0.5 font-light">
              <p className="font-normal text-coffee dark:text-stone-200">
                Estadia: <strong className="font-semibold">{formatDateBR(checkIn)}</strong> a <strong className="font-semibold">{formatDateBR(checkOut)}</strong> ({calculateNights(checkIn, checkOut)} noites)
              </p>
              <p>
                Cabana: <strong className="text-emerald-800 dark:text-emerald-400 font-semibold">{selectedCabin.name}</strong> • Diária: R$ {selectedCabin.price_per_night.toFixed(2)}
              </p>
              <div className="text-[10px] text-stone-400 font-medium">
                Valor estimado: R$ {(calculateNights(checkIn, checkOut) * selectedCabin.price_per_night).toFixed(2)}
              </div>
            </div>
          )}
          {!checkIn && (
            <p className="text-xs text-stone-500 font-light">Nenhum período selecionado.</p>
          )}
        </div>
        
        {/* Botão Primário Dourado */}
        <button
          disabled={!checkIn || !checkOut || !selectedCabin}
          onClick={() => setIsModalOpen(true)}
          className={cn(
            "px-6 py-3 rounded-full text-white font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-sm shadow-gold/10 hover:shadow-lg",
            checkIn && checkOut && selectedCabin
              ? "bg-gold hover:bg-coffee hover:-translate-y-0.5 cursor-pointer"
              : "bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed"
          )}
        >
          <CalendarIcon className="w-4 h-4" />
          Solicitar Reserva
        </button>
      </div>

      {/* MODAL DE DADOS DO LEAD (Framer Motion + AnimatePresence) */}
      <AnimatePresence>
        {isModalOpen && selectedCabin && checkIn && checkOut && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop com blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Card */}
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-lg bg-[#FFFDF9] dark:bg-[#2E1F17] rounded-[2rem] shadow-2xl overflow-hidden border border-beige/40 dark:border-stone-800 z-10"
            >
              {/* Header */}
              <div className="p-6 bg-coffee text-white flex justify-between items-center border-b border-beige/10">
                <div>
                  <h4 className="text-lg font-serif font-bold text-gold">Solicitar Pré-Agendamento</h4>
                  <p className="text-xs text-stone-300 font-light mt-0.5">{selectedCabin.name}</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/80 hover:text-gold text-2xl font-light transition-colors"
                >
                  &times;
                </button>
              </div>

              {/* Form / Content */}
              {success ? (
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-8 h-8" />
                  </div>
                  <h5 className="text-xl font-serif font-bold text-coffee dark:text-stone-100">Solicitação Enviada!</h5>
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
                  <div className="p-4 bg-[#FAF7F2] dark:bg-stone-950/40 rounded-2xl text-xs space-y-1.5 border border-beige/30 dark:border-stone-800">
                    <div className="flex justify-between">
                      <span className="text-stone-500 font-medium">Acomodação:</span>
                      <span className="font-bold text-coffee dark:text-stone-200">{selectedCabin.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500 font-medium">Período:</span>
                      <span className="font-bold text-coffee dark:text-stone-200">
                        {formatDateBR(checkIn)} a {formatDateBR(checkOut)} ({calculateNights(checkIn, checkOut)} noites)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500 font-medium">Valor Total:</span>
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
                    {/* Nome */}
                    <div>
                      <label className="block text-xs font-bold text-wood mb-1">Nome Completo</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="Nome completo do hóspede"
                          className="w-full pl-10 pr-4 py-2.5 border border-beige/40 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent bg-[#FAF7F2] dark:bg-stone-950 text-coffee dark:text-stone-200"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-wood mb-1">E-mail</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="hospede@email.com"
                          className="w-full pl-10 pr-4 py-2.5 border border-beige/40 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent bg-[#FAF7F2] dark:bg-stone-950 text-coffee dark:text-stone-200"
                        />
                      </div>
                    </div>

                    {/* Telefone */}
                    <div>
                      <label className="block text-xs font-bold text-wood mb-1">WhatsApp</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="Ex: (47) 99999-9999"
                          className="w-full pl-10 pr-4 py-2.5 border border-beige/40 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent bg-[#FAF7F2] dark:bg-stone-950 text-coffee dark:text-stone-200"
                        />
                      </div>
                    </div>

                    {/* Hóspedes */}
                    <div>
                      <label className="block text-xs font-bold text-wood mb-1">Quantidade de Pessoas</label>
                      <div className="relative">
                        <Users className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                        <select
                          value={numGuests}
                          onChange={e => setNumGuests(Number(e.target.value))}
                          className="w-full pl-10 pr-4 py-2.5 border border-beige/40 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent bg-[#FAF7F2] dark:bg-stone-950 text-coffee dark:text-stone-200 appearance-none"
                        >
                          {Array.from({ length: selectedCabin.capacity }, (_, idx) => idx + 1).map(n => (
                            <option key={n} value={n}>{n} {n === 1 ? 'pessoa' : 'pessoas'} (Máx: {selectedCabin.capacity})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-3 border border-beige rounded-xl text-sm font-semibold text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 bg-gold hover:bg-coffee text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 border border-gold/10"
                    >
                      {isSubmitting ? (
                        <>
                          <Clock className="w-4 h-4 animate-spin" /> Enviando...
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
