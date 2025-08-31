import { useState, useEffect, useCallback } from 'react';
import { InventoryStats } from '@/types';

/**
 * Хук для получения статистики с адаптивным обновлением
 */
export function useStats() {
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Функция для загрузки статистики
  const fetchStats = useCallback(async () => {
    try {
      console.log('🔧 [DEBUG] useStats: Загрузка статистики');
      setLoading(true);
      setError(null);

      const response = await fetch('/api/stats');
      const result = await response.json();

      if (result.success) {
        console.log('🔧 [DEBUG] useStats: Статистика загружена:', result.data);
        setStats(result.data);
        setLastUpdated(new Date());
      } else {
        console.error('🔧 [DEBUG] useStats: Ошибка загрузки:', result.error);
        setError(result.error || 'Ошибка загрузки статистики');
      }
    } catch (error) {
      console.error('🔧 [DEBUG] useStats: Ошибка сети:', error);
      setError('Ошибка сети при загрузке статистики');
    } finally {
      setLoading(false);
    }
  }, []);

  // Загружаем статистику при монтировании компонента
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Автоматическое обновление каждые 5 минут
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔧 [DEBUG] useStats: Автоматическое обновление статистики');
      fetchStats();
    }, 5 * 60 * 1000); // 5 минут

    return () => clearInterval(interval);
  }, [fetchStats]);

  // Функция для принудительного обновления
  const refresh = useCallback(() => {
    console.log('🔧 [DEBUG] useStats: Принудительное обновление статистики');
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    lastUpdated,
    refresh
  };
}

/**
 * Хук для получения статистики с оптимизацией для мобильных устройств
 */
export function useResponsiveStats() {
  const { stats, loading, error, lastUpdated, refresh } = useStats();
  const [isMobile, setIsMobile] = useState(false);

  // Определяем, является ли устройство мобильным
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Оптимизируем интервал обновления для мобильных устройств
  useEffect(() => {
    const interval = setInterval(() => {
      // На мобильных устройствах обновляем реже для экономии трафика
      if (!isMobile) {
        refresh();
      }
    }, isMobile ? 10 * 60 * 1000 : 5 * 60 * 1000); // 10 минут на мобильных, 5 на десктопе

    return () => clearInterval(interval);
  }, [isMobile, refresh]);

  return {
    stats,
    loading,
    error,
    lastUpdated,
    refresh,
    isMobile
  };
}
