"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Target,
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

interface Prediction {
  id: string;
  title: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  period: string;
}

interface Recommendation {
  id: string;
  type: 'pricing' | 'inventory' | 'marketing' | 'operation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  priority: 'high' | 'medium' | 'low';
  action?: string;
}

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

interface SmartWidgetsProps {
  onPredictionClick?: (prediction: Prediction) => void;
  onRecommendationClick?: (recommendation: Recommendation) => void;
  onAlertClick?: (alert: Alert) => void;
}

/**
 * Компонент умных виджетов с прогнозами и рекомендациями
 */
export const SmartWidgets: React.FC<SmartWidgetsProps> = ({
  onPredictionClick,
  onRecommendationClick,
  onAlertClick
}) => {
  const [activeTab, setActiveTab] = useState<'predictions' | 'recommendations' | 'alerts'>('predictions');

  // Моковые данные прогнозов
  const predictions: Prediction[] = [
    {
      id: '1',
      title: 'Прогноз продаж на месяц',
      value: 1250000,
      change: 15,
      trend: 'up',
      confidence: 85,
      period: 'Следующий месяц'
    },
    {
      id: '2',
      title: 'Ожидаемый спрос на двигатели',
      value: 8,
      change: -5,
      trend: 'down',
      confidence: 72,
      period: '2 недели'
    },
    {
      id: '3',
      title: 'Прогноз выручки',
      value: 2800000,
      change: 22,
      trend: 'up',
      confidence: 91,
      period: 'Квартал'
    },
    {
      id: '4',
      title: 'Ожидаемые расходы',
      value: 450000,
      change: 8,
      trend: 'up',
      confidence: 78,
      period: 'Месяц'
    }
  ];

  // Моковые данные рекомендаций
  const recommendations: Recommendation[] = [
    {
      id: '1',
      type: 'pricing',
      title: 'Повысить цену на двигатели BMW',
      description: 'Анализ рынка показывает, что цены на двигатели BMW M54 можно увеличить на 10-15% без потери спроса',
      impact: 'high',
      priority: 'high',
      action: 'Увеличить цену на 12%'
    },
    {
      id: '2',
      type: 'inventory',
      title: 'Пополнить запас тормозных колодок',
      description: 'Запас тормозных колодок заканчивается. Рекомендуется заказать 50 комплектов',
      impact: 'medium',
      priority: 'high',
      action: 'Заказать 50 комплектов'
    },
    {
      id: '3',
      type: 'marketing',
      title: 'Запустить рекламную кампанию',
      description: 'Анализ показывает, что реклама в социальных сетях может увеличить продажи на 20%',
      impact: 'high',
      priority: 'medium',
      action: 'Создать рекламную кампанию'
    },
    {
      id: '4',
      type: 'operation',
      title: 'Оптимизировать складские процессы',
      description: 'Внедрение системы штрих-кодов может сократить время обработки заказов на 30%',
      impact: 'medium',
      priority: 'low',
      action: 'Изучить системы штрих-кодов'
    }
  ];

  // Моковые данные алертов
  const alerts: Alert[] = [
    {
      id: '1',
      type: 'warning',
      title: 'Низкий запас тормозных дисков',
      message: 'Осталось только 3 комплекта тормозных дисков. Необходимо пополнить запас.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false
    },
    {
      id: '2',
      type: 'error',
      title: 'Просроченная оплата',
      message: 'Клиент Иван Петров не оплатил заказ №1234 в течение 7 дней.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isRead: false
    },
    {
      id: '3',
      type: 'success',
      title: 'Рекордные продажи',
      message: 'В этом месяце продажи выросли на 25% по сравнению с прошлым месяцем!',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      isRead: true
    },
    {
      id: '4',
      type: 'info',
      title: 'Новый клиент',
      message: 'Зарегистрирован новый VIP-клиент с бюджетом более 500,000 ₽.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      isRead: true
    }
  ];

  // Получение иконки для типа рекомендации
  const getRecommendationIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'pricing':
        return DollarSign;
      case 'inventory':
        return Package;
      case 'marketing':
        return Target;
      case 'operation':
        return Clock;
      default:
        return Lightbulb;
    }
  };





  // Форматирование валюты
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Форматирование времени
  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Только что';
    if (hours < 24) return `${hours} ч назад`;
    if (days < 7) return `${days} дн назад`;
    return timestamp.toLocaleDateString('ru-RU');
  };

  return (
    <div className="space-y-6">
      {/* Заголовок с табами */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900">Умные виджеты</h2>
        <div className="flex space-x-1 bg-neutral-100 rounded-lg p-1">
          {[
            { key: 'predictions', label: 'Прогнозы', icon: TrendingUp },
            { key: 'recommendations', label: 'Рекомендации', icon: Lightbulb },
            { key: 'alerts', label: 'Алерты', icon: AlertTriangle }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.key as any)}
              className="text-xs"
            >
              <tab.icon className="w-3 h-3 mr-1" />
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Контент табов */}
      {activeTab === 'predictions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {predictions.map((prediction) => (
            <Card 
              key={prediction.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onPredictionClick?.(prediction)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{prediction.title}</CardTitle>
                  <Badge variant="default" className="text-xs">
                    {prediction.confidence}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {prediction.value > 1000000 
                        ? formatCurrency(prediction.value)
                        : prediction.value.toLocaleString()
                      }
                    </span>
                    <div className="flex items-center space-x-1">
                      {prediction.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-success" />
                      ) : prediction.trend === 'down' ? (
                        <TrendingDown className="w-4 h-4 text-error" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-neutral-300 rounded"></div>
                      )}
                      <span className={`text-sm font-medium ${
                        prediction.trend === 'up' ? 'text-success' : 
                        prediction.trend === 'down' ? 'text-error' : 'text-neutral-500'
                      }`}>
                        {prediction.change > 0 ? '+' : ''}{prediction.change}%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-600">
                    Период: {prediction.period}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          {recommendations.map((recommendation) => {
            const Icon = getRecommendationIcon(recommendation.type);
            return (
              <Card 
                key={recommendation.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onRecommendationClick?.(recommendation)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-neutral-900">
                          {recommendation.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant={recommendation.impact === 'high' ? 'error' : 'default'} className="text-xs">
                            {recommendation.impact}
                          </Badge>
                          <Badge variant={recommendation.priority === 'high' ? 'error' : 'default'} className="text-xs">
                            {recommendation.priority}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-600 mb-3">
                        {recommendation.description}
                      </p>
                      {recommendation.action && (
                        <Button variant="outline" size="sm" className="text-xs">
                          {recommendation.action}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all duration-200 ${
                alert.isRead 
                  ? 'bg-neutral-50 border-neutral-300 hover:bg-neutral-100' 
                  : 'bg-blue-50 border-primary hover:bg-blue-100'
              }`}
              onClick={() => onAlertClick?.(alert)}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  alert.isRead ? 'bg-neutral-200' : 'bg-primary text-white'
                }`}>
                  {alert.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                  {alert.type === 'error' && <XCircle className="w-4 h-4" />}
                  {alert.type === 'success' && <CheckCircle className="w-4 h-4" />}
                  {alert.type === 'info' && <Info className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium ${
                      alert.isRead ? 'text-neutral-700' : 'text-neutral-900'
                    }`}>
                      {alert.title}
                    </h3>
                    <span className="text-xs text-neutral-500">
                      {formatTime(alert.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 mt-1">
                    {alert.message}
                  </p>
                </div>
                {!alert.isRead && (
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
