"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Bug, X, RefreshCw, Monitor } from 'lucide-react';

/**
 * Интерфейс для отладочной информации
 */
interface DebugInfo {
  timestamp: string;
  component: string;
  message: string;
  data?: unknown;
}

/**
 * Компонент панели отладки
 * Отображает отладочную информацию в режиме разработки
 */
export const DebugPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [debugLogs, setDebugLogs] = useState<DebugInfo[]>([]);
  const [systemInfo, setSystemInfo] = useState({
    userAgent: '',
    viewport: { width: 0, height: 0 },
    timestamp: new Date().toISOString(),
  });

  // Перехват console.log для сбора отладочной информации
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const originalLog = console.log;
    console.log = (...args) => {
      // Вызываем оригинальный console.log
      originalLog.apply(console, args);
      
      // Парсим отладочные сообщения
      const message = args.join(' ');
      if (message.includes('[DEBUG]')) {
        const debugInfo: DebugInfo = {
          timestamp: new Date().toISOString(),
          component: extractComponent(message),
          message: extractMessage(message),
          data: args.length > 1 ? args.slice(1) : undefined,
        };
        
        setDebugLogs(prev => [debugInfo, ...prev.slice(0, 49)]); // Храним последние 50 записей
      }
    };

    // Получаем информацию о системе
    setSystemInfo({
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      timestamp: new Date().toISOString(),
    });

    // Обработчик изменения размера окна
    const handleResize = () => {
      setSystemInfo(prev => ({
        ...prev,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      }));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      console.log = originalLog;
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Извлечение названия компонента из отладочного сообщения
  const extractComponent = (message: string): string => {
    const match = message.match(/\[DEBUG\] (\w+):/);
    return match ? match[1] || 'Unknown' : 'Unknown';
  };

  // Извлечение сообщения из отладочного сообщения
  const extractMessage = (message: string): string => {
    const match = message.match(/\[DEBUG\] \w+: (.+)/);
    return match ? match[1] || message : message;
  };

  // Очистка логов
  const clearLogs = () => {
    setDebugLogs([]);
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Кнопка открытия панели отладки */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsVisible(!isVisible)}
          className="rounded-full w-12 h-12 shadow-lg"
        >
          <Bug className="w-5 h-5" />
        </Button>
      </div>

      {/* Панель отладки */}
      {isVisible && (
        <div className="fixed bottom-20 right-4 w-96 h-96 z-50">
          <Card className="h-full shadow-xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-sm">
                  <Bug className="w-4 h-4 mr-2" />
                  Панель отладки
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearLogs}
                    className="h-6 w-6 p-0"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsVisible(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-3 h-full overflow-hidden">
              <div className="h-full flex flex-col">
                {/* Информация о системе */}
                <div className="mb-3 p-2 bg-neutral-50 rounded text-xs">
                  <div className="flex items-center mb-1">
                    <Monitor className="w-3 h-3 mr-1" />
                    <span className="font-medium">Система</span>
                  </div>
                  <div className="space-y-1 text-neutral-600">
                    <div>Размер: {systemInfo.viewport.width}×{systemInfo.viewport.height}</div>
                    <div>Время: {new Date(systemInfo.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>

                {/* Логи */}
                <div className="flex-1 overflow-y-auto">
                  <div className="space-y-2">
                    {debugLogs.map((log, index) => (
                      <div key={index} className="p-2 bg-neutral-50 rounded text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="info" className="text-xs">
                            {log.component}
                          </Badge>
                          <span className="text-neutral-500">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-neutral-700 font-mono">
                          {log.message}
                        </div>
                        {log.data !== undefined && (
                          <details className="mt-1">
                            <summary className="cursor-pointer text-neutral-500">
                              Данные
                            </summary>
                            <pre className="mt-1 text-xs bg-neutral-100 p-1 rounded overflow-x-auto">
                              {JSON.stringify(log.data, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Статистика */}
                <div className="mt-2 pt-2 border-t border-neutral-200">
                  <div className="flex items-center justify-between text-xs text-neutral-600">
                    <span>Логов: {debugLogs.length}</span>
                    <span>Компонентов: {new Set(debugLogs.map(log => log.component)).size}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
