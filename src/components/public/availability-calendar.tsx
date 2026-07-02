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
  HelpCircle 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn, formatDateBR, calculateNights } from '@/lib/utils';
import { Booking, ADMIN_WHATSAPP_NUMBER } from '@/types';

interface AvailabilityCalendarProps {
  cabinId: string;
  cabinName: string;
  capacity: number;
  pricePerNight: number;
}

export default function AvailabilityCalendar({
  cabinId,
  cabinName,
  capacity,
  pricePerNight
}: AvailabilityCalendarProps) {
  // Estados do Calendário
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState<boolean>(true);
  
  // Seleção de Intervalo
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  
  // Estado do Modal de Lead
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [numGuests, setNumGuests] = useState<number>(2);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Carregar reservas da cabana do Supabase
  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoadingBookings(true);
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('cabin_id', cabinId)
          .neq('status', 'cancelado'); // Ignora reservas canceladas

        if (error) throw error;
        setBookings(data || []);
      } catch (err) {
        console.error('Erro ao carregar reservas:', err);
      } finally {
        setLoadingBookings(false);
      }
    }

    fetchBookings();
  }, [cabinId]);

  // Auxiliares de Navegação do Mês
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Lógica para gerar os dias do mês
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Primeiro dia da semana do mês (0 = Domingo, 6 = Sábado)
    const firstDayIndex = new Date(year, month, 1).getDay();
    // Total de dias no mês atual
    const totalDays = new Date(year, month + 1, 0).getDate();
    // Total de dias no mês anterior
    const totalPrevDays = new Date(year, month, 0).getDate();

    const days = [];

    // Preencher dias do mês anterior para alinhar o grid do calendário
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, totalPrevDays - i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        formatted: formatDateString(prevDate)
      });
    }

    // Preencher dias do mês atual
    for (let i = 1; i <= totalDays; i++) {
      const currDate = new Date(year, month, i);
      days.push({
        date: currDate,
        isCurrentMonth: true,
        formatted: formatDateString(currDate)
      });
    }

    // Preencher dias do próximo mês para completar o grid (geralmente 42 células)
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

  // Formata objeto Date para 'YYYY-MM-DD'
  const formatDateString = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Verifica o status de um dia específico
  const getDateStatus = (dateStr: string) => {
    const todayStr = formatDateString(new Date());
    
    // Passado bloqueado
    if (dateStr < todayStr) return 'past';

    // Procura por reserva ou manutenção
    const match = bookings.find(b => {
      const start = b.check_in_date;
      const end = b.check_out_date;
      return dateStr >= start && dateStr <= end;
    });

    if (match) {
      return match.status; // 'confirmado', 'pendente' ou 'manutencao'
    }

    return 'free';
  };

  // Verifica se o intervalo selecionado entra em conflito com alguma reserva
  const hasOverlap = (start: string, end: string) => {
    return bookings.some(b => {
      // Ignora reservas canceladas
      if (b.status === 'cancelado') return false;
      
      const bStart = b.check_in_date;
      const bEnd = b.check_out_date;
      
      // Checa sobreposição: (StartA <= EndB) e (EndA >= StartB)
      return start <= bEnd && end >= bStart;
    });
  };

  // Manipula clique nos dias do calendário
  const handleDateClick = (dateStr: string) => {
    const status = getDateStatus(dateStr);
    
    // Não permite selecionar datas passadas, confirmadas ou em manutenção
    if (status === 'past' || status === 'confirmado' || status === 'manutencao') {
      return;
    }

    if (!checkIn || (checkIn && checkOut)) {
      // Inicia nova seleção
      setCheckIn(dateStr);
      setCheckOut(null);
    } else {
      // Se clicou em uma data anterior ao check-in, redefine o check-in
      if (dateStr < checkIn) {
        setCheckIn(dateStr);
      } else {
        // Verifica se há conflitos no meio do caminho
        if (hasOverlap(checkIn, dateStr)) {
          alert('Atenção: O período selecionado possui dias reservados no meio. Escolha outro intervalo.');
          setCheckIn(dateStr);
          return;
        }
        setCheckOut(dateStr);
      }
    }
  };

  // Determina se a data está na seleção ou no hover do range
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

  // Envio final (Supabase + WhatsApp)
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) return;

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      // 1. Cadastrar Cliente (ou buscar se já existe por e-mail/telefone)
      const { data: existingClient, error: clientFetchError } = await supabase
        .from('clients')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (clientFetchError) throw clientFetchError;

      let clientId = existingClient?.id;

      if (!clientId) {
        // Cria um novo cliente/lead
        const { data: newClient, error: clientInsertError } = await supabase
          .from('clients')
          .insert({
            name,
            email,
            phone,
            status: 'novo'
          })
          .select('id')
          .single();

        if (clientInsertError) throw clientInsertError;
        clientId = newClient.id;
      } else {
        // Atualiza status do cliente se necessário
        await supabase
          .from('clients')
          .update({ name, phone, status: 'novo' })
          .eq('id', clientId);
      }

      // 2. Criar a reserva (Pré-agendamento pendente)
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          cabin_id: cabinId,
          client_id: clientId,
          check_in_date: checkIn,
          check_out_date: checkOut,
          status: 'pendente',
          num_guests: numGuests,
          notes: `Lead gerado pelo site público. Qtd pessoas: ${numGuests}`
        });

      if (bookingError) throw bookingError;

      setSuccess(true);

      // 3. Montar a mensagem do WhatsApp e redirecionar
      const nights = calculateNights(checkIn, checkOut);
      const totalPrice = nights * pricePerNight;
      
      const message = `Olá, Fazenda Águas Claras! 🌿\n\nGostaria de solicitar o pré-agendamento da *${cabinName}*.\n\n*Detalhes do Hóspede:*\n👤 Nome: ${name}\n📧 E-mail: ${email}\n📱 WhatsApp: ${phone}\n\n*Detalhes da Estadia:*\n📅 Entrada: ${formatDateBR(checkIn)}\n📅 Saída: ${formatDateBR(checkOut)}\n🌙 Duração: ${nights} noites\n👥 Hóspedes: ${numGuests} pessoa(s)\n💰 Valor Estimado: R$ ${totalPrice.toFixed(2)}\n\nPor favor, confirmem a disponibilidade! Obrigado.`;

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${ADMIN_WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
      
      // Delay curto para feedback visual de sucesso antes de redirecionar
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        setIsModalOpen(false);
        // Reseta estados
        setCheckIn(null);
        setCheckOut(null);
        setSuccess(false);
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Houve um erro ao processar sua reserva. Tente novamente.');
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
    <div className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-xl overflow-hidden">
      {/* Cabeçalho do Calendário */}
      <div className="p-6 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold tracking-wide">Disponibilidade</h3>
          <p className="text-emerald-100 text-xs mt-0.5">Selecione datas de Check-in e Check-out</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrevMonth} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Mês Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold min-w-[120px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button 
            onClick={handleNextMonth} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Próximo Mês"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid de Dias */}
      <div className="p-6">
        {loadingBookings ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400">
            <Clock className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
            <p className="text-sm">Carregando calendário de ocupação...</p>
          </div>
        ) : (
          <>
            {/* Dias da semana */}
            <div className="grid grid-cols-7 gap-1 text-center font-medium text-xs text-stone-500 dark:text-stone-400 mb-2">
              <div>Dom</div>
              <div>Seg</div>
              <div>Ter</div>
              <div>Qua</div>
              <div>Qui</div>
              <div>Sex</div>
              <div>Sáb</div>
            </div>

            {/* Dias do mês */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, idx) => {
                const status = getDateStatus(day.formatted);
                const selection = isDateSelected(day.formatted);
                const isPast = status === 'past';
                const isReserved = status === 'confirmado' || status === 'pendente';
                const isMaintenance = status === 'manutencao';
                
                return (
                  <button
                    key={idx}
                    disabled={isPast || isReserved || isMaintenance}
                    onClick={() => handleDateClick(day.formatted)}
                    onMouseEnter={() => setHoveredDate(day.formatted)}
                    onMouseLeave={() => setHoveredDate(null)}
                    className={cn(
                      "h-11 w-full rounded-xl flex flex-col justify-center items-center text-sm font-medium transition-all relative border border-transparent",
                      
                      // Meses fora de foco
                      !day.isCurrentMonth && "text-stone-300 dark:text-stone-700",
                      
                      // Statuses específicos
                      isPast && "text-stone-300 dark:text-stone-800 cursor-not-allowed bg-stone-50 dark:bg-stone-900/50 line-through",
                      isReserved && "text-red-800 dark:text-red-300 cursor-not-allowed bg-red-50 dark:bg-red-950/20 line-through",
                      isMaintenance && "text-amber-800 dark:text-amber-300 cursor-not-allowed bg-amber-50 dark:bg-amber-950/20 [background-image:repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(245,158,11,0.1)_5px,rgba(245,158,11,0.1)_10px)]",
                      
                      // Dias Livres normais
                      status === 'free' && day.isCurrentMonth && "text-stone-700 dark:text-stone-300 hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20",
                      
                      // Estilos de seleção
                      selection === 'start' && "bg-emerald-700 text-white rounded-xl shadow-md z-10",
                      selection === 'end' && "bg-emerald-700 text-white rounded-xl shadow-md z-10",
                      selection === 'middle' && "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200 rounded-none",
                      selection === 'hover-range' && "bg-emerald-50/70 text-emerald-700 dark:bg-emerald-950/20 rounded-none border-dashed border-emerald-300"
                    )}
                  >
                    <span>{day.date.getDate()}</span>
                    {/* Indicador visual inferior se for hoje */}
                    {day.formatted === formatDateString(new Date()) && (
                      <span className={cn(
                        "absolute bottom-1 w-1.5 h-1.5 rounded-full",
                        selection ? "bg-white" : "bg-emerald-600"
                      )} />
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Legenda */}
        <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500 justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-md border border-stone-200 dark:border-stone-700" />
            <span>Livre</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-md bg-red-50 border border-red-200 line-through text-red-800" />
            <span>Ocupado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-md bg-amber-50 border border-amber-200 [background-image:repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(245,158,11,0.1)_2px,rgba(245,158,11,0.1)_5px)]" />
            <span>Manutenção</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-md bg-emerald-700" />
            <span>Selecionado</span>
          </div>
        </div>
      </div>

      {/* Caixa de Resumo e Ação */}
      <div className="p-6 bg-stone-50 dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {checkIn && !checkOut && (
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Escolha a data de <strong className="text-emerald-700">Saída (Check-out)</strong>
            </p>
          )}
          {checkIn && checkOut && (
            <div className="text-sm text-stone-600 dark:text-stone-400">
              Período selecionado: <strong className="text-stone-800 dark:text-stone-200">{formatDateBR(checkIn)}</strong> a <strong className="text-stone-800 dark:text-stone-200">{formatDateBR(checkOut)}</strong>
              <div className="text-xs text-stone-500 mt-0.5">
                Total de {calculateNights(checkIn, checkOut)} diárias (R$ {(calculateNights(checkIn, checkOut) * pricePerNight).toFixed(2)})
              </div>
            </div>
          )}
          {!checkIn && (
            <p className="text-sm text-stone-500">Nenhuma data selecionada no momento.</p>
          )}
        </div>
        
        <button
          disabled={!checkIn || !checkOut}
          onClick={() => setIsModalOpen(true)}
          className={cn(
            "px-6 py-3 rounded-full text-white font-semibold transition-all flex items-center justify-center gap-2",
            checkIn && checkOut
              ? "bg-emerald-700 hover:bg-emerald-800 shadow-md hover:shadow-lg"
              : "bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed"
          )}
        >
          <CalendarIcon className="w-5 h-5" />
          Solicitar Disponibilidade
        </button>
      </div>

      {/* MODAL / DIALOG DE RESERVA (Lead Capture Form) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800">
            {/* Cabeçalho do Modal */}
            <div className="p-6 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex justify-between items-center">
              <div>
                <h4 className="text-lg font-bold">Solicitar Pré-Agendamento</h4>
                <p className="text-xs text-emerald-100 mt-0.5">{cabinName}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white text-2xl font-light"
              >
                &times;
              </button>
            </div>

            {/* Conteúdo / Form */}
            {success ? (
              <div className="p-8 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <h5 className="text-xl font-bold text-stone-800 dark:text-stone-100">Solicitação Registrada!</h5>
                <p className="text-sm text-stone-500 mt-2">
                  Estamos redirecionando você para o nosso WhatsApp para confirmar os detalhes...
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 font-medium">
                  <Clock className="w-4 h-4 animate-spin" /> Conectando ao WhatsApp
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="p-6 space-y-4">
                {/* Resumo do período */}
                <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-2xl text-xs space-y-1.5 border border-stone-100 dark:border-stone-800">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Cabana selecionada:</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">{cabinName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Check-in:</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">{checkIn ? formatDateBR(checkIn) : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Check-out:</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">{checkOut ? formatDateBR(checkOut) : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Duração:</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">{checkIn && checkOut ? `${calculateNights(checkIn, checkOut)} noites` : ''}</span>
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
                    <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Nome Completo</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Ex: João Silva"
                        className="w-full pl-10 pr-4 py-2 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-stone-950 text-stone-800 dark:text-stone-200"
                      />
                    </div>
                  </div>

                  {/* E-mail */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">E-mail para confirmação</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Ex: joao@exemplo.com"
                        className="w-full pl-10 pr-4 py-2 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-stone-950 text-stone-800 dark:text-stone-200"
                      />
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Telefone / WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="Ex: (47) 99999-9999"
                        className="w-full pl-10 pr-4 py-2 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-stone-950 text-stone-800 dark:text-stone-200"
                      />
                    </div>
                  </div>

                  {/* Quantidade de Pessoas */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Quantidade de Hóspedes</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                      <select
                        value={numGuests}
                        onChange={e => setNumGuests(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-2 border border-stone-200 dark:border-stone-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-stone-950 text-stone-800 dark:text-stone-200 appearance-none"
                      >
                        {Array.from({ length: capacity }, (_, idx) => idx + 1).map(n => (
                          <option key={n} value={n}>{n} {n === 1 ? 'pessoa' : 'pessoas'} (Máx: {capacity})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-stone-200 dark:border-stone-800 rounded-xl text-sm font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-950 transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" /> Enviando...
                      </>
                    ) : (
                      <>
                        Enviar e ir para WhatsApp
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
