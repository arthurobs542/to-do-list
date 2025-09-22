-- Funções auxiliares para o Focus App
-- Execute após criar as tabelas

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_achievements_updated_at ON user_achievements;
CREATE TRIGGER update_user_achievements_updated_at BEFORE UPDATE ON user_achievements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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

-- Função para buscar dados completos do usuário
CREATE OR REPLACE FUNCTION get_user_complete(p_user_id VARCHAR(255))
RETURNS JSON AS $$
DECLARE
    profile_record RECORD;
    settings_record RECORD;
    achievements_json JSON;
    result JSON;
BEGIN
    -- Verificar se o usuário existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_user_id) THEN
        -- Se não existe, criar
        SELECT create_user_complete(p_user_id) INTO result;
        RETURN result;
    END IF;
    
    -- Buscar dados existentes
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
    
    -- Retornar dados
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
    RETURN get_user_complete(p_user_id);
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar configurações
CREATE OR REPLACE FUNCTION update_user_settings(
    p_user_id VARCHAR(255),
    p_settings JSON
)
RETURNS JSON AS $$
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
    RETURN get_user_complete(p_user_id);
END;
$$ LANGUAGE plpgsql;

-- Função para desbloquear conquista
CREATE OR REPLACE FUNCTION unlock_achievement(
    p_user_id VARCHAR(255),
    p_achievement_id VARCHAR(100)
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Verificar se a conquista existe
    IF NOT EXISTS (SELECT 1 FROM achievements WHERE achievement_id = p_achievement_id) THEN
        RETURN false;
    END IF;
    
    -- Desbloquear conquista
    UPDATE user_achievements SET
        unlocked = true,
        unlocked_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = p_user_id AND achievement_id = p_achievement_id;
    
    -- Retornar true se foi atualizada
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Função para verificar e desbloquear conquistas automaticamente
CREATE OR REPLACE FUNCTION check_and_unlock_achievements(p_user_id VARCHAR(255))
RETURNS VOID AS $$
DECLARE
    profile_record RECORD;
BEGIN
    -- Buscar dados do perfil
    SELECT * INTO profile_record FROM user_profiles WHERE user_id = p_user_id;
    
    -- Verificar conquistas baseadas nas estatísticas
    IF profile_record.completed_tasks >= 1 THEN
        PERFORM unlock_achievement(p_user_id, 'first-task');
    END IF;
    
    IF profile_record.pomodoros_completed >= 10 THEN
        PERFORM unlock_achievement(p_user_id, 'focus-master');
    END IF;
    
    IF profile_record.completed_tasks >= 50 THEN
        PERFORM unlock_achievement(p_user_id, 'task-master');
    END IF;
    
    IF profile_record.streak >= 7 THEN
        PERFORM unlock_achievement(p_user_id, 'streak-keeper');
    END IF;
END;
$$ LANGUAGE plpgsql;
