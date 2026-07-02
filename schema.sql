-- Inicialização do Banco de Dados - Hotel Fazenda Águas Claras

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- =========================================================================
-- 1. Tabela: cabins
-- =========================================================================
CREATE TABLE IF NOT EXISTS cabins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    price_per_night DECIMAL(10, 2) NOT NULL DEFAULT 350.00,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- 2. Tabela: clients (Leads)
-- =========================================================================
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'novo' CHECK (status IN ('novo', 'em contato', 'convertido')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- 3. Tabela: bookings (Agendamentos e Bloqueios)
-- =========================================================================
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cabin_id UUID NOT NULL REFERENCES cabins(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL, -- Se o cliente for deletado, mantém a reserva
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado', 'manutencao')),
    num_guests INTEGER NOT NULL DEFAULT 1 CHECK (num_guests > 0),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Validação: Check-out deve ser após o Check-in
    CONSTRAINT check_dates CHECK (check_out_date > check_in_date)
);

-- Índice para busca rápida de reservas por cabana e intervalo
CREATE INDEX IF NOT EXISTS idx_bookings_cabin_dates ON bookings (cabin_id, check_in_date, check_out_date);

-- Restrição de exclusão: impede reservas concorrentes sobrepostas para a mesma cabana (exceto se canceladas)
-- Exclui sobreposição temporal (&&) para a mesma cabana (=)
ALTER TABLE bookings 
ADD CONSTRAINT no_overlapping_bookings 
EXCLUDE USING gist (
    cabin_id WITH =, 
    daterange(check_in_date, check_out_date, '[]') WITH &&
) 
WHERE (status <> 'cancelado');


-- =========================================================================
-- 4. Segurança de Nível de Linha (Row Level Security - RLS)
-- =========================================================================
ALTER TABLE cabins ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Políticas para CABINS
CREATE POLICY "Qualquer pessoa pode visualizar cabanas ativas" 
    ON cabins FOR SELECT 
    USING (is_active = TRUE);

CREATE POLICY "Apenas administradores podem modificar cabanas" 
    ON cabins FOR ALL 
    TO authenticated 
    USING (true);

-- Políticas para CLIENTS (Leads)
CREATE POLICY "Clientes podem se cadastrar (Criar Lead)" 
    ON clients FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Apenas administradores podem gerenciar clientes" 
    ON clients FOR ALL 
    TO authenticated 
    USING (true);

-- Políticas para BOOKINGS
CREATE POLICY "Qualquer pessoa pode visualizar reservas para checar disponibilidade" 
    ON bookings FOR SELECT 
    USING (true);

CREATE POLICY "Clientes podem solicitar pre-agendamentos" 
    ON bookings FOR INSERT 
    WITH CHECK (status = 'pendente' OR status = 'manutencao');

CREATE POLICY "Apenas administradores podem gerenciar reservas" 
    ON bookings FOR ALL 
    TO authenticated 
    USING (true);


-- =========================================================================
-- 5. Carga de Dados Inicial (Seed para as 20 Cabanas)
-- =========================================================================
INSERT INTO cabins (name, description, capacity, price_per_night, image_url)
VALUES 
('Cabana Vale Verde', 'Cabana aconchegante com vista para o vale verde e banheira de hidromassagem.', 2, 450.00, '/images/cabins/vale-verde.jpg'),
('Cabana Recanto da Serra', 'Cabana rústica no alto da montanha, ideal para casais.', 2, 480.00, '/images/cabins/recanto-serra.jpg'),
('Cabana Sol Nascente', 'Excelente iluminação natural pela manhã e deck privativo.', 4, 600.00, '/images/cabins/sol-nascente.jpg'),
('Cabana Lago Azul', 'Localizada às margens do lago, com pier próprio para pesca e contemplação.', 3, 520.00, '/images/cabins/lago-azul.jpg'),
('Cabana Brisa do Bosque', 'Cercada por mata nativa, perfeita para quem busca silêncio e conexão.', 2, 420.00, '/images/cabins/brisa-bosque.jpg'),
('Cabana das Flores', 'Jardim florido privativo e lareira interna a lenha.', 2, 460.00, '/images/cabins/flores.jpg'),
('Cabana do Lago', 'Vista panorâmica do lago com banheira externa aquecida.', 2, 550.00, '/images/cabins/do-lago.jpg'),
('Cabana Vista Alegre', 'Deck suspenso com uma das vistas mais bonitas da fazenda.', 4, 650.00, '/images/cabins/vista-alegre.jpg'),
('Cabana Pinheiro', 'Cabana familiar espaçosa entre pinheiros centenários.', 6, 800.00, '/images/cabins/pinheiro.jpg'),
('Cabana Cachoeira', 'Próxima ao riacho com o som relaxante da queda d''água.', 2, 490.00, '/images/cabins/cachoeira.jpg'),
('Cabana Araucária', 'Estrutura alpina clássica e banheira estilo vitoriano.', 2, 500.00, '/images/cabins/araucaria.jpg'),
('Cabana Sol da Manhã', 'Grande painel de vidro voltado para o leste.', 3, 530.00, '/images/cabins/sol-manha.jpg'),
('Cabana Lua Cheia', 'Teto de vidro sobre a cama para observar as estrelas.', 2, 580.00, '/images/cabins/lua-cheia.jpg'),
('Cabana Estrela', 'Ambiente moderno e minimalista integrado à natureza.', 2, 470.00, '/images/cabins/estrela.jpg'),
('Cabana das Pedras', 'Construída com pedras locais, lareira e adega climatizada.', 4, 700.00, '/images/cabins/pedras.jpg'),
('Cabana Cantinho da Paz', 'Afastada das áreas de lazer, máxima privacidade.', 2, 440.00, '/images/cantinho-paz.jpg'),
('Cabana Beira Rio', 'A poucos passos do rio que corta a propriedade.', 4, 590.00, '/images/cabins/beira-rio.jpg'),
('Cabana Recanto Feliz', 'Amplo espaço externo com churrasqueira e rede de descanso.', 5, 750.00, '/images/cabins/recanto-feliz.jpg'),
('Cabana Bela Vista', 'Ponto mais alto da propriedade com pôr do sol espetacular.', 2, 600.00, '/images/cabins/bela-vista.jpg'),
('Cabana Monte Branco', 'Design escandinavo, sauna privativa e piso aquecido.', 2, 900.00, '/images/cabins/monte-branco.jpg')
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description, 
    capacity = EXCLUDED.capacity, 
    price_per_night = EXCLUDED.price_per_night,
    image_url = EXCLUDED.image_url;
