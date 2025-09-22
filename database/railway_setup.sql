-- Setup completo para Railway PostgreSQL
-- Execute este arquivo no seu banco PostgreSQL do Railway

-- 1. Criar extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Criar tabelas
\i database/migrations/001_initial_setup.sql

-- 3. Criar funções e triggers
\i database/functions.sql

-- 4. Testar a configuração
-- Criar um usuário de teste
SELECT create_user_complete('test_user_123', 'Usuário Teste', 'teste@exemplo.com');

-- Verificar se foi criado corretamente
SELECT get_user_complete('test_user_123');

-- Testar atualização de perfil
SELECT update_user_profile('test_user_123', '{"name": "Nome Atualizado", "totalTasks": 5}'::json);

-- Testar atualização de configurações
SELECT update_user_settings('test_user_123', '{"theme": "green", "notifications": false}'::json);

-- Limpar usuário de teste
DELETE FROM users WHERE id = 'test_user_123';

-- Verificar estrutura final
\dt

-- Verificar funções criadas
\df
