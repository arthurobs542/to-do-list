-- Exemplos de consultas para testar o banco
-- Execute estas queries para verificar se tudo está funcionando

-- 1. Criar um usuário de teste
SELECT create_user_complete('test_user_001', 'João Silva', 'joao@exemplo.com');

-- 2. Buscar dados do usuário criado
SELECT get_user_complete('test_user_001');

-- 3. Atualizar perfil do usuário
SELECT update_user_profile('test_user_001', '{
  "name": "João Silva Santos",
  "email": "joao.santos@exemplo.com",
  "totalTasks": 15,
  "completedTasks": 12,
  "pomodorosCompleted": 8,
  "streak": 3
}'::json);

-- 4. Atualizar configurações
SELECT update_user_settings('test_user_001', '{
  "theme": "green",
  "notifications": false,
  "soundEnabled": true,
  "volume": 80,
  "language": "en"
}'::json);

-- 5. Desbloquear uma conquista
SELECT unlock_achievement('test_user_001', 'first-task');

-- 6. Verificar conquistas do usuário
SELECT 
  achievement_id,
  name,
  description,
  unlocked,
  unlocked_at
FROM user_achievements 
WHERE user_id = 'test_user_001'
ORDER BY unlocked DESC, name;

-- 7. Verificar estatísticas do usuário
SELECT 
  up.name,
  up.email,
  up.total_tasks,
  up.completed_tasks,
  up.pomodoros_completed,
  up.streak,
  ROUND((up.completed_tasks::DECIMAL / NULLIF(up.total_tasks, 0)) * 100, 2) as completion_rate
FROM user_profiles up
WHERE up.user_id = 'test_user_001';

-- 8. Verificar configurações
SELECT 
  us.theme,
  us.notifications,
  us.sound_enabled,
  us.volume,
  us.language
FROM user_settings us
WHERE us.user_id = 'test_user_001';

-- 9. Listar todas as conquistas disponíveis
SELECT 
  achievement_id,
  name,
  description,
  icon
FROM achievements
ORDER BY achievement_id;

-- 10. Verificar usuários criados
SELECT 
  u.id,
  u.created_at,
  up.name,
  up.email,
  up.total_tasks,
  up.completed_tasks
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
ORDER BY u.created_at DESC;

-- 11. Estatísticas gerais (se houver múltiplos usuários)
SELECT 
  COUNT(*) as total_users,
  SUM(up.total_tasks) as total_tasks,
  SUM(up.completed_tasks) as total_completed,
  SUM(up.pomodoros_completed) as total_pomodoros,
  AVG(up.streak) as avg_streak
FROM users u
JOIN user_profiles up ON u.id = up.user_id;

-- 12. Conquistas mais populares
SELECT 
  ua.achievement_id,
  a.name,
  COUNT(*) as users_unlocked,
  ROUND((COUNT(*)::DECIMAL / (SELECT COUNT(*) FROM users)) * 100, 2) as percentage
FROM user_achievements ua
JOIN achievements a ON ua.achievement_id = a.achievement_id
WHERE ua.unlocked = true
GROUP BY ua.achievement_id, a.name
ORDER BY users_unlocked DESC;

-- 13. Testar verificação automática de conquistas
SELECT check_and_unlock_achievements('test_user_001');

-- 14. Verificar se conquistas foram desbloqueadas automaticamente
SELECT 
  achievement_id,
  name,
  unlocked,
  unlocked_at
FROM user_achievements 
WHERE user_id = 'test_user_001' AND unlocked = true
ORDER BY unlocked_at DESC;

-- 15. Limpar dados de teste (opcional)
-- DELETE FROM users WHERE id = 'test_user_001';

-- 16. Verificar estrutura das tabelas
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- 17. Verificar índices criados
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 18. Verificar funções criadas
SELECT 
  routine_name,
  routine_type,
  data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;
