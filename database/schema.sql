-- Database Schema para Focus App - Railway PostgreSQL
-- Este arquivo contém todas as tabelas necessárias para o backend

-- Criar extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de perfis de usuário
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL DEFAULT 'Usuário',
    email VARCHAR(255) NOT NULL DEFAULT 'usuario@exemplo.com',
    avatar TEXT,
    join_date VARCHAR(100) NOT NULL DEFAULT 'Janeiro 2024',
    total_tasks INTEGER NOT NULL DEFAULT 0,
    completed_tasks INTEGER NOT NULL DEFAULT 0,
    pomodoros_completed INTEGER NOT NULL DEFAULT 0,
    streak INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Tabela de configurações do usuário
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    notifications BOOLEAN NOT NULL DEFAULT true,
    sound_enabled BOOLEAN NOT NULL DEFAULT true,
    pomodoro_notifications BOOLEAN NOT NULL DEFAULT true,
    task_reminders BOOLEAN NOT NULL DEFAULT true,
    auto_save BOOLEAN NOT NULL DEFAULT true,
    theme VARCHAR(20) NOT NULL DEFAULT 'blue' CHECK (theme IN ('blue', 'green', 'purple', 'red')),
    language VARCHAR(5) NOT NULL DEFAULT 'pt' CHECK (language IN ('pt', 'en', 'es')),
    volume INTEGER NOT NULL DEFAULT 50 CHECK (volume >= 0 AND volume <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Tabela de conquistas
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    achievement_id VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de conquistas do usuário
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    achievement_id VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    unlocked BOOLEAN NOT NULL DEFAULT false,
    unlocked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

-- Tabela de tarefas (opcional - para futuras funcionalidades)
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'Média' CHECK (category IN ('Alta', 'Média', 'Baixa')),
    completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de sessões de pomodoro (opcional - para estatísticas detalhadas)
CREATE TABLE pomodoro_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    session_type VARCHAR(20) NOT NULL CHECK (session_type IN ('work', 'shortBreak', 'longBreak')),
    duration_minutes INTEGER NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_pomodoro_sessions_user_id ON pomodoro_sessions(user_id);
CREATE INDEX idx_pomodoro_sessions_completed_at ON pomodoro_sessions(completed_at);

-- Triggers para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_achievements_updated_at BEFORE UPDATE ON user_achievements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir conquistas padrão
INSERT INTO achievements (achievement_id, name, description, icon) VALUES
('first-task', 'Primeira Tarefa', 'Complete sua primeira tarefa', 'Award'),
('focus-master', 'Foco Total', 'Complete 10 pomodoros', 'Target'),
('task-master', 'Mestre das Tarefas', 'Complete 50 tarefas', 'Trophy'),
('streak-keeper', 'Sequência Perfeita', 'Mantenha uma sequência de 7 dias', 'Flame');

-- Função para criar um usuário completo
CREATE OR REPLACE FUNCTION create_user_complete(
    p_user_id VARCHAR(255),
    p_name VARCHAR(255) DEFAULT 'Usuário',
    p_email VARCHAR(255) DEFAULT 'usuario@exemplo.com'
)
RETURNS JSON AS $$
DECLARE
    profile_record RECORD;
    settings_record RECORD;
    achievement_record RECORD;
    achievements_json JSON;
BEGIN
    -- Criar usuário
    INSERT INTO users (id) VALUES (p_user_id) ON CONFLICT (id) DO NOTHING;
    
    -- Criar perfil
    INSERT INTO user_profiles (user_id, name, email, join_date)
    VALUES (p_user_id, p_name, p_email, to_char(CURRENT_DATE, 'Month YYYY'))
    ON CONFLICT (user_id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        updated_at = CURRENT_TIMESTAMP;
    
    -- Criar configurações
    INSERT INTO user_settings (user_id)
    VALUES (p_user_id)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Criar conquistas padrão para o usuário
    INSERT INTO user_achievements (user_id, achievement_id, name, description, icon)
    SELECT p_user_id, achievement_id, name, description, icon
    FROM achievements
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
    
    -- Buscar dados criados
    SELECT * INTO profile_record FROM user_profiles WHERE user_id = p_user_id;
    SELECT * INTO settings_record FROM user_settings WHERE user_id = p_user_id;
    
    -- Buscar conquistas como JSON
    SELECT json_agg(
        json_build_object(
            'id', achievement_id,
            'name', name,
            'description', description,
            'icon', icon,
            'unlocked', unlocked,
            'unlockedAt', unlocked_at
        )
    ) INTO achievements_json
    FROM user_achievements WHERE user_id = p_user_id;
    
    -- Retornar dados completos
    RETURN json_build_object(
        'profile', json_build_object(
            'id', p_user_id,
            'name', profile_record.name,
            'email', profile_record.email,
            'avatar', profile_record.avatar,
            'joinDate', profile_record.join_date,
            'totalTasks', profile_record.total_tasks,
            'completedTasks', profile_record.completed_tasks,
            'pomodorosCompleted', profile_record.pomodoros_completed,
            'streak', profile_record.streak,
            'achievements', COALESCE(achievements_json, '[]'::json)
        ),
        'settings', json_build_object(
            'notifications', settings_record.notifications,
            'soundEnabled', settings_record.sound_enabled,
            'pomodoroNotifications', settings_record.pomodoro_notifications,
            'taskReminders', settings_record.task_reminders,
            'autoSave', settings_record.auto_save,
            'theme', settings_record.theme,
            'language', settings_record.language,
            'volume', settings_record.volume
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar perfil
CREATE OR REPLACE FUNCTION update_user_profile(
    p_user_id VARCHAR(255),
    p_profile JSON
)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- Atualizar perfil
    UPDATE user_profiles SET
        name = COALESCE((p_profile->>'name')::VARCHAR(255), name),
        email = COALESCE((p_profile->>'email')::VARCHAR(255), email),
        avatar = COALESCE((p_profile->>'avatar')::TEXT, avatar),
        total_tasks = COALESCE((p_profile->>'totalTasks')::INTEGER, total_tasks),
        completed_tasks = COALESCE((p_profile->>'completedTasks')::INTEGER, completed_tasks),
        pomodoros_completed = COALESCE((p_profile->>'pomodorosCompleted')::INTEGER, pomodoros_completed),
        streak = COALESCE((p_profile->>'streak')::INTEGER, streak),
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = p_user_id;
    
    -- Retornar dados atualizados
    SELECT create_user_complete(p_user_id) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar configurações
CREATE OR REPLACE FUNCTION update_user_settings(
    p_user_id VARCHAR(255),
    p_settings JSON
)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- Atualizar configurações
    UPDATE user_settings SET
        notifications = COALESCE((p_settings->>'notifications')::BOOLEAN, notifications),
        sound_enabled = COALESCE((p_settings->>'soundEnabled')::BOOLEAN, sound_enabled),
        pomodoro_notifications = COALESCE((p_settings->>'pomodoroNotifications')::BOOLEAN, pomodoro_notifications),
        task_reminders = COALESCE((p_settings->>'taskReminders')::BOOLEAN, task_reminders),
        auto_save = COALESCE((p_settings->>'autoSave')::BOOLEAN, auto_save),
        theme = COALESCE((p_settings->>'theme')::VARCHAR(20), theme),
        language = COALESCE((p_settings->>'language')::VARCHAR(5), language),
        volume = COALESCE((p_settings->>'volume')::INTEGER, volume),
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = p_user_id;
    
    -- Retornar dados atualizados
    SELECT create_user_complete(p_user_id) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql;
