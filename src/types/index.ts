// Definições de Tipos - Hotel Fazenda Águas Claras

export interface Cabin {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  is_active: boolean;
  price_per_night: number;
  image_url: string | null;
  created_at: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'novo' | 'em contato' | 'convertido';
  created_at: string;
}

export type BookingStatus = 'pendente' | 'confirmado' | 'cancelado' | 'manutencao';

export interface Booking {
  id: string;
  cabin_id: string;
  client_id: string | null;
  check_in_date: string; // Formato YYYY-MM-DD
  check_out_date: string; // Formato YYYY-MM-DD
  status: BookingStatus;
  num_guests: number;
  notes: string | null;
  created_at: string;
  // Campos populados em queries joins
  cabins?: Cabin;
  clients?: Client;
}

// Configurações do WhatsApp
export const ADMIN_WHATSAPP_NUMBER = '5547999999999'; // Substituir pelo número real do hotel
