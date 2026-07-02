"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

// Dados da Galeria de Fotos do Local (Fotos reais enviadas pelo usuário)
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
    description: 'Uma mesa repleta do tradicional café colonial produzido inteiramente de forma artesanal na fazenda com receitas herdadas.',
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
  const [activeGalleryIdx, setActiveGalleryIdx] = useState<number | null>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-bgPrimary text-coffee font-sans selection:bg-gold/25 selection:text-coffee">
      
      {/* FLOATING HEADER NAVBAR (Glassmorphism + Premium Shadow) */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/75 backdrop-blur-md border-b border-beige/40 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo (Transparent PNG / Blended Brown Logo) */}
          <div className="cursor-pointer transition-transform duration-300 hover:scale-103" onClick={() => scrollToSection('reserva')}>
            <img 
              src="/images/logo.png?v=3" 
              alt="Logo Fazenda Águas Claras"
              className="h-14 w-auto mix-blend-multiply"
            />
          </div>
          
          {/* Menu de Navegação (Serif Clássico) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-serif font-medium text-coffee">
            <button onClick={() => scrollToSection('reserva')} className="hover:text-gold transition-colors duration-200">Reserva</button>
            <button onClick={() => scrollToSection('comodidades')} className="hover:text-gold transition-colors duration-200">Lazer & Gastronomia</button>
            <button onClick={() => scrollToSection('galeria')} className="hover:text-gold transition-colors duration-200">Galeria</button>
            <button onClick={() => scrollToSection('eventos')} className="hover:text-gold transition-colors duration-200">Eventos</button>
          </nav>

          {/* CTA de Reserva (Botão Primário Dourado) */}
          <div>
            <button 
              onClick={() => scrollToSection('reserva')}
              className="px-6 py-2.5 bg-gold hover:bg-coffee text-white text-xs font-semibold rounded-full transition-all duration-300 shadow-md shadow-gold/10 hover:shadow-lg hover:shadow-coffee/20 hover:-translate-y-0.5"
            >
              Reservar Agora
            </button>
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION (Gradiente Marrom + Parallax Suave + Framer Motion) */}
      <section className="relative h-screen flex items-center justify-center bg-coffee overflow-hidden">
        {/* Overlay com gradiente de marrom suave */}
        <div className="absolute inset-0 bg-gradient-to-b from-coffee/85 via-coffee/45 to-coffee/95 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(199,154,82,0.18),transparent)] z-10" />
        
        {/* Imagem de Fundo (Parallax Leve via Scale) */}
        <motion.div 
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1.02, opacity: 0.65 }}
          transition={{ duration: 2.2, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/images/hero-bg.jpg')",
          }}
        />

        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center text-white space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gold/15 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-widest text-gold border border-gold/30"
          >
            <Compass className="w-3.5 h-3.5 text-gold" /> Conexão & Charme na Natureza
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="text-4xl md:text-7xl font-serif font-bold tracking-tight leading-tight"
          >
            Fazenda <span className="bg-gradient-to-r from-gold via-amber-250 to-beige bg-clip-text text-transparent">Águas Claras</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="text-base md:text-lg text-[#F5EFE4] max-w-2xl mx-auto font-light leading-relaxed font-sans"
          >
            Hospede-se em nossas exclusivas cabanas de charme integradas à natureza. Lareira, hidromassagem e o legítimo café colonial da serra.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8 }}
            className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            {/* Botão Primário Dourado */}
            <button 
              onClick={() => scrollToSection('reserva')}
              className="w-full sm:w-auto px-8 py-4 bg-gold hover:bg-coffee text-white font-semibold rounded-full shadow-lg shadow-gold/15 hover:shadow-coffee/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group border border-gold/10"
            >
              Ver Disponibilidade
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            
            {/* Botão Secundário Transparente */}
            <button 
              onClick={() => scrollToSection('comodidades')}
              className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-gold text-gold hover:text-white font-semibold rounded-full border border-gold backdrop-blur-sm transition-all duration-300"
            >
              Conhecer Lazer
            </button>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 cursor-pointer opacity-70 hover:opacity-100 transition-opacity" onClick={() => scrollToSection('reserva')}>
          <span className="text-[9px] uppercase tracking-widest text-[#F5EFE4] font-serif">Reservar Estadia</span>
          <div className="w-5 h-8 border border-[#F5EFE4]/40 rounded-full flex justify-center p-1">
            <div className="w-1 h-1.5 bg-gold rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* 2. RESERVAS E CALENDÁRIO */}
      <section id="reserva" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-gold font-serif">Conforto Boutique</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-coffee">
            Nossas Cabanas Premium
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto my-2 rounded-full" />
          <p className="text-xs md:text-sm text-wood max-w-xl mx-auto font-light leading-relaxed">
            Todas as nossas cabanas compartilham do mesmo padrão de excelência arquitetônica e aconchego. Escolha as datas de estadia e selecione o número de sua preferência.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Lado Esquerdo: Detalhes das Cabanas (Card Estilo Creme Premium) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-bgCard border border-beige/40 rounded-[2.5rem] overflow-hidden shadow-md shadow-coffee/5 hover:shadow-lg hover:shadow-coffee/10 hover:-translate-y-0.5 transition-all duration-300">
              <div className="relative h-72 bg-stone-100 overflow-hidden">
                <img 
                  src="/images/fazenda-paisagem.jpg" 
                  alt="Cabana Premium"
                  className="w-full h-full object-cover hover:scale-103 transition-transform duration-700"
                />
                <span className="absolute bottom-4 right-4 text-[9px] font-bold bg-coffee/80 backdrop-blur-sm text-white px-3 py-1 rounded-full uppercase tracking-wider">
                  Estrutura Rústica Chic
                </span>
              </div>

              {/* Informações */}
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-2 text-gold bg-gold/5 px-3.5 py-1 rounded-full text-xs font-medium w-fit border border-gold/10">
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  Ambiente Acolhedor e Reservado
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-serif font-bold text-coffee">Charme & Conforto</h3>
                  <p className="text-xs text-wood leading-relaxed font-light">
                    Nossas cabanas possuem isolamento acústico e térmico completo, lareira ecológica interna, ar-condicionado quente/frio, deck de madeira externo, smart TV de alta definição e internet via fibra óptica de alta velocidade.
                  </p>
                </div>

                {/* Comodidades Inclusas */}
                <div className="border-t border-beige/40 pt-6 space-y-4">
                  <h4 className="text-xs font-bold text-coffee uppercase tracking-wider font-serif">Equipadas com:</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs text-wood">
                    <div className="flex items-center gap-2.5">
                      <Flame className="w-4 h-4 text-gold" />
                      <span className="font-light">Lareira Ecológica</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Waves className="w-4 h-4 text-gold" />
                      <span className="font-light">Hidromassagem Dupla</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Coffee className="w-4 h-4 text-gold" />
                      <span className="font-light">Cafeteira Nespresso</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-gold" />
                      <span className="font-light">Cama King Size</span>
                    </div>
                  </div>
                </div>

                {/* Informativo */}
                <div className="border-t border-beige/40 pt-6 space-y-2">
                  <p className="text-xs text-coffee flex items-center gap-1.5 font-serif font-bold">
                    <Info className="w-4 h-4 text-gold shrink-0" />
                    Como funciona a reserva?
                  </p>
                  <p className="text-[11px] text-wood leading-relaxed font-light">
                    Escolha as datas desejadas no calendário de reservas ao lado. O sistema listará instantaneamente quais das nossas 20 cabanas estão livres (quadrados verdes). Basta selecionar o número da cabana livre de sua preferência para solicitar a locação!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito: Calendário de Disponibilidade Embutido */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-gold/5 border border-gold/10 p-6 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-coffee text-sm font-serif">Verifique a disponibilidade abaixo</h4>
                <p className="text-xs text-wood font-light">Selecione as datas desejadas no calendário para verificar as cabanas livres.</p>
              </div>
            </div>

            <AvailabilityCalendar />
          </div>

        </div>
      </section>

      {/* 3. COMODIDADES E LAZER (Cards com Elevação e Fundo Creme) */}
      <section id="comodidades" className="py-24 bg-bgSecondary border-t border-b border-beige/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gold font-serif">Experiências de Fazenda</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-coffee">
              Lazer Completo de Hotel Fazenda
            </h2>
            <div className="w-16 h-0.5 bg-gold mx-auto my-2 rounded-full" />
            <p className="text-xs md:text-sm text-wood max-w-xl mx-auto font-light leading-relaxed">
              Do café da manhã artesanal à piscina térmica integrada à floresta, criamos espaços pensados para o seu bem-estar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Café Colonial */}
            <div className="bg-bgCard p-8 rounded-3xl border border-beige/40 shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 space-y-4 group">
              <div className="w-12 h-12 bg-gold/10 text-gold rounded-2xl flex items-center justify-center transition-colors group-hover:bg-gold group-hover:text-white duration-300">
                <Coffee className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif font-bold text-coffee">Café Colonial</h3>
              <p className="text-xs text-wood leading-relaxed font-light">
                Bolos artesanais, pães assados na hora, geleias com frutas colhidas no pomar e queijo fresco artesanal produzidos inteiramente na fazenda.
              </p>
            </div>

            {/* Piscina Aquecida */}
            <div className="bg-bgCard p-8 rounded-3xl border border-beige/40 shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 space-y-4 group">
              <div className="w-12 h-12 bg-gold/10 text-gold rounded-2xl flex items-center justify-center transition-colors group-hover:bg-gold group-hover:text-white duration-300">
                <Waves className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif font-bold text-coffee">Piscina Térmica</h3>
              <p className="text-xs text-wood leading-relaxed font-light">
                Piscina interna aquecida a 32°C com teto de vidro panorâmico, permitindo mergulhos relaxantes sob a lua ou nos dias mais frios de inverno.
              </p>
            </div>

            {/* Trilhas e Natureza */}
            <div className="bg-bgCard p-8 rounded-3xl border border-beige/40 shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 space-y-4 group">
              <div className="w-12 h-12 bg-gold/10 text-gold rounded-2xl flex items-center justify-center transition-colors group-hover:bg-gold group-hover:text-white duration-300">
                <Map className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif font-bold text-coffee">Trilhas Ecológicas</h3>
              <p className="text-xs text-wood leading-relaxed font-light">
                Caminhadas em mata preservada, visita à nossa mini-cachoeira privativa e o bosque temático dos dinossauros que as crianças adoram.
              </p>
            </div>

            {/* Lareira e Adega */}
            <div className="bg-bgCard p-8 rounded-3xl border border-beige/40 shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 space-y-4 group">
              <div className="w-12 h-12 bg-gold/10 text-gold rounded-2xl flex items-center justify-center transition-colors group-hover:bg-gold group-hover:text-white duration-300">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif font-bold text-coffee">Noites de Lareira</h3>
              <p className="text-xs text-wood leading-relaxed font-light">
                Nossas cabanas contam com adega de vinhos selecionados e lareira interna a lenha para esquentar suas noites frias de serra.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. GALERIA DE FOTOS DO LOCAL */}
      <section id="galeria" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-gold font-serif">Nossos Cenários</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-coffee">
            O Aconchego em Detalhes
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto my-2 rounded-full" />
          <p className="text-xs md:text-sm text-wood max-w-xl mx-auto font-light leading-relaxed">
            Explore cliques reais de nossa estrutura e sinta um pouco da atmosfera de relaxamento e aconchego que espera por você.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {GALLERY_IMAGES.map((img, idx) => (
            <div 
              key={idx}
              onClick={() => setActiveGalleryIdx(idx)}
              className="bg-bgCard border border-beige/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group"
            >
              <div className="relative h-64 overflow-hidden bg-[#FAF7F2]">
                <img 
                  src={img.src} 
                  alt={img.title} 
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[9px] font-bold text-coffee px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {img.category}
                </span>
              </div>
              <div className="p-5 space-y-1.5">
                <h4 className="font-serif font-bold text-coffee text-sm flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-gold" /> {img.title}
                </h4>
                <p className="text-[11px] text-wood leading-relaxed font-light">{img.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SEÇÃO DE EVENTOS & EXPERIÊNCIAS (Gradiente Marrom Suave) */}
      <section id="eventos" className="py-24 bg-coffee text-white border-t border-beige/10 relative overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('/images/fazenda-paisagem.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-coffee/95 via-coffee/90 to-coffee/95" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gold font-serif">Vivências Exclusivas</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-white">
              Eventos & Experiências
            </h2>
            <div className="w-16 h-0.5 bg-gold mx-auto my-2 rounded-full" />
            <p className="text-xs text-stone-400 font-light">
              Participe de nossos festivais gastronômicos e atividades temáticas elaboradas para tornar cada momento na serra inesquecível.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {EVENTS_DATA.map((event) => (
              <div 
                key={event.id}
                className="bg-[#2E1F17]/90 border border-beige/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-gold/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden bg-stone-900">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  {event.highlight && (
                    <span className="absolute top-4 right-4 bg-gold text-[#2E1F17] text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                      Destaque da Fazenda
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-gold font-semibold">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{event.time}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-white group-hover:text-gold transition-colors duration-200">{event.title}</h3>
                    <p className="text-xs text-stone-300 leading-relaxed font-light">{event.description}</p>
                  </div>

                  <a 
                    href={`https://api.whatsapp.com/send?phone=5547999999999&text=${encodeURIComponent(`Olá! Gostaria de obter mais informações sobre o evento: ${event.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-transparent hover:bg-gold hover:text-white border border-gold text-gold text-center text-xs font-semibold rounded-xl transition-all duration-300 block"
                  >
                    Saber Mais no WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER (Fundo Escuro Premium #23170F) */}
      <footer className="bg-bgFooter text-stone-400 py-16 border-t border-beige/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="space-y-4">
            
            {/* Logo transparent inverted */}
            <div className="mb-2">
              <img 
                src="/images/logo.png?v=3" 
                alt="Logo Fazenda Águas Claras"
                className="h-14 w-auto invert mix-blend-screen"
              />
            </div>
            <p className="text-xs leading-relaxed max-w-sm font-light">
              Um refúgio de paz e luxo rústico. Conecte-se com a natureza sem abrir mão do conforto de alta categoria.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Contato & Localização</h4>
            <p className="text-xs flex items-center gap-1.5 font-light">
              <MapPin className="w-4 h-4 text-gold" />
              <span>Estrada Geral das Águas Claras, KM 12 • Serra Catarinense</span>
            </p>
            <p className="text-xs font-light leading-relaxed">
              WhatsApp: (47) 99999-9999<br />
              Email: contato@fazendaaguasclaras.com.br
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Administração</h4>
            <p className="text-xs font-light">
              Acesso restrito para funcionários e gerência.
            </p>
            <a 
              href="/admin/agendamentos" 
              className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-white font-semibold transition-colors duration-200"
            >
              Acessar Painel CRM Admin
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 border-t border-beige/10 pt-8 text-center text-xs text-stone-600">
          <p>© {new Date().getFullYear()} Hotel Fazenda Águas Claras. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* MODAL LIGHTBOX DE GALERIA (Substituição com Framer Motion) */}
      <AnimatePresence>
        {activeGalleryIdx !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
            onClick={() => setActiveGalleryIdx(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white hover:text-gold text-3xl font-light transition-colors"
              onClick={() => setActiveGalleryIdx(null)}
            >
              &times;
            </button>
            
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-4xl max-h-[85vh] flex flex-col items-center gap-4"
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={GALLERY_IMAGES[activeGalleryIdx].src} 
                alt={GALLERY_IMAGES[activeGalleryIdx].title} 
                className="max-h-[72vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-beige/25"
              />
              <div className="text-center text-white space-y-1 max-w-xl">
                <h5 className="font-serif font-bold text-lg text-gold">{GALLERY_IMAGES[activeGalleryIdx].title}</h5>
                <p className="text-xs text-stone-300 font-light">{GALLERY_IMAGES[activeGalleryIdx].description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
