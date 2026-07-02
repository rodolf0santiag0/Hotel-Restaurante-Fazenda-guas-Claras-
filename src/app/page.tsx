"use client";

import React, { useState } from 'react';
import { 
  Compass, 
  Coffee, 
  Waves, 
  Map, 
  Flame, 
  Users, 
  Calendar,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Info,
  CalendarDays,
  MapPin,
  Image as ImageIcon,
  Clock
} from 'lucide-react';
import AvailabilityCalendar from '@/components/public/availability-calendar';
import { Cabin } from '@/types';

// Lista das 20 Cabanas Padronizadas
const CABINS_LIST: Cabin[] = [
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

// Dados da Galeria de Fotos do Local (Fotos enviadas pelo usuário)
const GALLERY_IMAGES = [
  { src: '/images/cafe-colonial.jpg', title: 'O Verdadeiro Café Colonial', category: 'Gastronomia', description: 'Delícias artesanais preparadas na fazenda, com legado e tradição.' },
  { src: '/images/piscina-aquecida.jpg', title: 'Piscina Interna Aquecida', category: 'Lazer', description: 'Água climatizada a 32°C com vista panorâmica para relaxamento total.' },
  { src: '/images/dinossauro-bosque.jpg', title: 'Trilha dos Dinossauros', category: 'Aventura', description: 'Bosque temático com esculturas realistas de dinossauros entre a natureza.' },
  { src: '/images/fazenda-paisagem.jpg', title: 'Cenários da Fazenda', category: 'Natureza', description: 'Vista ampla dos nossos gramados, lagos e o ar puro da serra.' }
];

// Dados de Eventos
const EVENTS_DATA = [
  {
    id: 'e1',
    title: 'Festival do Café Colonial Artesanal',
    date: 'Todos os finais de semana',
    time: 'A partir das 08:30',
    description: 'Uma mesa repleta do tradicional café colonial produzido inteiramente de forma artesanal na fazenda.',
    image: '/images/cafe-colonial.jpg',
    highlight: true
  },
  {
    id: 'e2',
    title: 'Noite do Vinho, Lareira & Música',
    date: 'Sábados de Inverno',
    time: 'A partir das 19:30',
    description: 'Degustação de vinhos locais aquecidos pela fogueira de chão com música acústica ao vivo.',
    image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=600',
    highlight: false
  },
  {
    id: 'e3',
    title: 'Cavalgada Ecológica da Lua Cheia',
    date: 'Nas noites de Lua Cheia',
    time: 'A partir das 20:00',
    description: 'Passeio a cavalo guiado pelas trilhas da fazenda sob a iluminação natural da lua cheia.',
    image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=600',
    highlight: false
  }
];

export default function LandingPage() {
  const [selectedCabin, setSelectedCabin] = useState<Cabin>(CABINS_LIST[0]);
  const [activeGalleryIdx, setActiveGalleryIdx] = useState<number | null>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      
      {/* FLOATING HEADER NAVBAR */}
      <header className="absolute top-0 left-0 right-0 z-30 bg-transparent py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo Crop (Dark/White Logo on bottom 50% of the image) */}
          <div className="h-14 w-28 relative overflow-hidden cursor-pointer" onClick={() => scrollToSection('reserva')}>
            <img 
              src="/images/logo.jpg" 
              alt="Logo Fazenda Águas Claras"
              className="absolute bottom-0 left-0 w-full h-[200%] object-cover object-bottom"
            />
          </div>
          
          {/* Menu de Navegação */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-white/95">
            <button onClick={() => scrollToSection('reserva')} className="hover:text-amber-400 transition-colors">Reserva</button>
            <button onClick={() => scrollToSection('comodidades')} className="hover:text-amber-400 transition-colors">Lazer & Gastronomia</button>
            <button onClick={() => scrollToSection('galeria')} className="hover:text-amber-400 transition-colors">Galeria</button>
            <button onClick={() => scrollToSection('eventos')} className="hover:text-amber-400 transition-colors">Eventos</button>
          </nav>

          {/* CTA de Reserva */}
          <div>
            <button 
              onClick={() => scrollToSection('reserva')}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-full transition-all shadow-md hover:shadow-amber-900/20"
            >
              Reservar Agora
            </button>
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center bg-stone-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-900/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,160,101,0.15),transparent)] z-10" />
        
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-70 scale-105 transition-transform duration-[10000ms]"
          style={{ 
            backgroundImage: "url('/images/fazenda-paisagem.jpg')",
          }}
        />

        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center text-white space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber-650/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-amber-100 border border-amber-500/30">
            <Compass className="w-3.5 h-3.5" /> Conexão & Charme na Natureza
          </div>
          
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Fazenda <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 bg-clip-text text-transparent">Águas Claras</span>
          </h1>
          
          <p className="text-lg md:text-xl text-stone-200 max-w-2xl mx-auto font-light leading-relaxed">
            Hospede-se em nossas exclusivas cabanas de charme integradas à natureza. Lareira, hidromassagem e o legítimo café colonial da serra.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button 
              onClick={() => scrollToSection('reserva')}
              className="w-full sm:w-auto px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-full shadow-lg hover:shadow-amber-900/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
            >
              Ver Disponibilidade
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => scrollToSection('comodidades')}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border border-white/20 backdrop-blur-sm transition-all"
            >
              Conhecer Lazer
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 cursor-pointer opacity-70 hover:opacity-100 transition-opacity" onClick={() => scrollToSection('reserva')}>
          <span className="text-[10px] uppercase tracking-widest text-stone-300">Reservar Estadia</span>
          <div className="w-6 h-10 border-2 border-stone-400 rounded-full flex justify-center p-1">
            <div className="w-1.5 h-2 bg-stone-300 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* 2. NOSSA ACOMODAÇÃO E SELETOR DE RESERVA UNIFICADO */}
      <section id="reserva" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Conforto Padronizado</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-stone-800 dark:text-stone-100">
            Nossas Cabanas Premium
          </h2>
          <p className="text-sm md:text-base text-stone-500 max-w-xl mx-auto">
            Todas as nossas cabanas compartilham do mesmo padrão de excelência arquitetônica e aconchego. Escolha o número da sua preferência e planeje sua estadia.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Lado Esquerdo: Detalhes da Cabana */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="relative h-72 bg-stone-100">
                <img 
                  src="/images/fazenda-paisagem.jpg" 
                  alt="Cabana Premium"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-4 right-4 text-[10px] font-bold bg-black/60 text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Vista Externa
                </span>
              </div>

              {/* Informações de Destaque */}
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-2 text-amber-800 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-amber-650" />
                  Padrão Boutique de Hospedagem
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-stone-850">Aconchego & Tecnologia</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Nossas cabanas possuem isolamento acústico e térmico completo, lareira ecológica interna, ar-condicionado quente/frio, deck de madeira externo, smart TV de alta definição e internet via fibra óptica de alta velocidade.
                  </p>
                </div>

                {/* Comodidades Inclusas */}
                <div className="border-t border-stone-100 pt-6 space-y-3">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Comodidades Standard:</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs text-stone-600">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-amber-600" />
                      <span>Lareira Ecológica</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Waves className="w-4 h-4 text-amber-600" />
                      <span>Hidromassagem Dupla</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Coffee className="w-4 h-4 text-amber-600" />
                      <span>Cafeteira Nespresso</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-600" />
                      <span>Cama King Size</span>
                    </div>
                  </div>
                </div>

                {/* Seletor de Cabanas */}
                <div className="border-t border-stone-100 pt-6 space-y-3">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Selecione a Cabana para reservar:
                  </label>
                  <select
                    value={selectedCabin.id}
                    onChange={(e) => {
                      const found = CABINS_LIST.find(c => c.id === e.target.value);
                      if (found) setSelectedCabin(found);
                    }}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 text-stone-800 font-semibold appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem', backgroundRepeat: 'no-repeat' }}
                  >
                    {CABINS_LIST.map((cabin) => (
                      <option key={cabin.id} value={cabin.id}>
                        {cabin.name} (Capacidade: {cabin.capacity}p)
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-stone-400 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    As tarifas podem variar dependendo da capacidade e localização de cada unidade.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito: Calendário de Disponibilidade Embutido */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-amber-900/5 border border-amber-900/10 p-6 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/10 text-amber-700 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-stone-850">Verifique a disponibilidade abaixo</h4>
                <p className="text-xs text-stone-500">Selecione as datas desejadas no calendário da cabana escolhida para prosseguir.</p>
              </div>
            </div>

            <AvailabilityCalendar 
              cabinId={selectedCabin.id}
              cabinName={selectedCabin.name}
              capacity={selectedCabin.capacity}
              pricePerNight={selectedCabin.price_per_night}
            />
          </div>

        </div>
      </section>

      {/* 3. COMODIDADES E LAZER */}
      <section id="comodidades" className="py-24 bg-stone-100/60 border-t border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Experiências Exclusivas</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-stone-800">
              Lazer Completo de Hotel Fazenda
            </h2>
            <p className="text-sm md:text-base text-stone-500">
              Do café da manhã artesanal à piscina térmica integrada à floresta, criamos espaços pensados para o seu bem-estar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Café Colonial */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-800">Café Colonial</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Bolos artesanais, pães assados na hora, geleias com frutas colhidas no pomar e queijo fresco artesanal produzidos inteiramente na fazenda.
              </p>
            </div>

            {/* Piscina Aquecida */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center">
                <Waves className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-800">Piscina Térmica</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Piscina interna aquecida a 32°C com teto de vidro panorâmico, permitindo mergulhos relaxantes sob a lua ou nos dias mais frios de inverno.
              </p>
            </div>

            {/* Trilhas e Natureza */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center">
                <Map className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-800">Trilhas Ecológicas</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Caminhadas em mata preservada, visita à nossa mini-cachoeira privativa e o bosque temático dos dinossauros que as crianças adoram.
              </p>
            </div>

            {/* Lareira e Adega */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-50 text-red-700 rounded-2xl flex items-center justify-center">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-800">Noites de Lareira</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Nossas cabanas contam com adega de vinhos selecionados e lareira interna a lenha para esquentar suas noites frias de serra.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. GALERIA DE FOTOS DO LOCAL */}
      <section id="galeria" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Galeria de Fotos</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-stone-800 dark:text-stone-100">
            Nossos Cenários Encantadores
          </h2>
          <p className="text-sm md:text-base text-stone-500">
            Explore cliques reais de nossa estrutura e sinta um pouco da atmosfera de relaxamento e aconchego que espera por você.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {GALLERY_IMAGES.map((img, idx) => (
            <div 
              key={idx}
              onClick={() => setActiveGalleryIdx(idx)}
              className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <div className="relative h-64 overflow-hidden bg-stone-100">
                <img 
                  src={img.src} 
                  alt={img.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[9px] font-bold text-amber-850 px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {img.category}
                </span>
              </div>
              <div className="p-5 space-y-1.5">
                <h4 className="font-bold text-stone-800 text-sm flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-amber-600" /> {img.title}
                </h4>
                <p className="text-[11px] text-stone-500 leading-relaxed">{img.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SEÇÃO DE EVENTOS & EXPERIÊNCIAS */}
      <section id="eventos" className="py-24 bg-stone-900 text-white border-t border-stone-800 relative overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('/images/fazenda-paisagem.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Vivências Especiais</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
              Eventos & Experiências
            </h2>
            <p className="text-sm text-stone-400">
              Participe de nossos festivais gastronômicos e atividades temáticas elaboradas para tornar cada momento inesquecível.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {EVENTS_DATA.map((event) => (
              <div 
                key={event.id}
                className="bg-stone-950/80 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-amber-600/30 transition-colors"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  {event.highlight && (
                    <span className="absolute top-4 right-4 bg-amber-600 text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                      Destaque da Fazenda
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-amber-400 font-semibold">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{event.time}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">{event.title}</h3>
                    <p className="text-xs text-stone-400 leading-relaxed font-light">{event.description}</p>
                  </div>

                  <a 
                    href={`https://api.whatsapp.com/send?phone=5547999999999&text=${encodeURIComponent(`Olá! Gostaria de obter mais informações sobre o evento: ${event.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-stone-900 hover:bg-amber-600 hover:text-stone-950 border border-stone-800 hover:border-amber-600 text-center text-xs font-bold rounded-xl transition-all duration-300 block"
                  >
                    Saber Mais no WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-stone-950 text-stone-400 py-16 border-t border-stone-850">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="space-y-4">
            {/* Logo Crop */}
            <div className="h-12 w-24 relative overflow-hidden mb-2">
              <img 
                src="/images/logo.jpg" 
                alt="Logo Fazenda Águas Claras"
                className="absolute bottom-0 left-0 w-full h-[200%] object-cover object-bottom"
              />
            </div>
            <p className="text-xs leading-relaxed max-w-sm">
              Um refúgio de paz e luxo rústico. Conecte-se com a natureza sem abrir mão do conforto de alta categoria.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contato & Localização</h4>
            <p className="text-xs flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-650" />
              <span>Estrada Geral das Águas Claras, KM 12 • Serra Catarinense</span>
            </p>
            <p className="text-xs">
              WhatsApp: (47) 99999-9999<br />
              Email: contato@fazendaaguasclaras.com.br
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Administração</h4>
            <p className="text-xs">
              Acesso restrito para funcionários e gerência.
            </p>
            <a 
              href="/admin/agendamentos" 
              className="inline-flex items-center gap-1.5 text-xs text-amber-450 hover:text-amber-400 font-semibold"
            >
              Acessar Painel CRM Admin
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 border-t border-stone-850 pt-8 text-center text-xs text-stone-600">
          <p>© {new Date().getFullYear()} Hotel Fazenda Águas Claras. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* MODAL LIGHTBOX DE GALERIA */}
      {activeGalleryIdx !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setActiveGalleryIdx(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:text-stone-300 text-3xl font-light"
            onClick={() => setActiveGalleryIdx(null)}
          >
            &times;
          </button>
          
          <div 
            className="w-full max-w-4xl max-h-[85vh] flex flex-col items-center gap-4"
            onClick={e => e.stopPropagation()}
          >
            <img 
              src={GALLERY_IMAGES[activeGalleryIdx].src} 
              alt={GALLERY_IMAGES[activeGalleryIdx].title} 
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
            />
            <div className="text-center text-white space-y-1 max-w-xl">
              <h5 className="font-bold text-lg text-amber-400">{GALLERY_IMAGES[activeGalleryIdx].title}</h5>
              <p className="text-xs text-stone-300">{GALLERY_IMAGES[activeGalleryIdx].description}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
