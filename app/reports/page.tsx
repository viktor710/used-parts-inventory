"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';

import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  Car,
  Search
} from 'lucide-react';

// Динамический импорт компонентов с интерактивностью
const DebugPanel = dynamic(() => import('@/components/debug/DebugPanel').then(mod => ({ default: mod.DebugPanel })), {
  ssr: false
});

/**
 * Интерфейс для отчета
 */
interface Report {
  id: string;
  title: string;
  description: string;
  type: 'sales' | 'inventory' | 'financial' | 'customers' | 'cars';
  format: 'pdf' | 'excel' | 'csv';
  lastGenerated?: string;
  status: 'available' | 'generating' | 'error';
  icon: React.ComponentType<any>;
}

/**
 * Страница отчетов
 */
export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Отладочная информация
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 [DEBUG] ReportsPage: Компонент рендерится');
  }

  // Инициализация отчетов
  useEffect(() => {
    const initializeReports = () => {
      const defaultReports: Report[] = [
        {
          id: 'sales-summary',
          title: 'Сводка продаж',
          description: 'Общая статистика продаж за выбранный период',
          type: 'sales',
          format: 'pdf',
          status: 'available',
          icon: ShoppingCart
        },
        {
          id: 'inventory-status',
          title: 'Статус инвентаря',
          description: 'Текущее состояние склада и доступность запчастей',
          type: 'inventory',
          format: 'excel',
          status: 'available',
          icon: Package
        },
        {
          id: 'financial-report',
          title: 'Финансовый отчет',
          description: 'Доходы, расходы и прибыльность',
          type: 'financial',
          format: 'pdf',
          status: 'available',
          icon: DollarSign
        },
        {
          id: 'customer-analytics',
          title: 'Аналитика клиентов',
          description: 'Статистика по клиентам и их активности',
          type: 'customers',
          format: 'excel',
          status: 'available',
          icon: Users
        },
        {
          id: 'cars-inventory',
          title: 'Инвентарь автомобилей',
          description: 'Список всех автомобилей в системе',
          type: 'cars',
          format: 'csv',
          status: 'available',
          icon: Car
        },
        {
          id: 'monthly-sales',
          title: 'Месячные продажи',
          description: 'Детальный отчет по продажам за месяц',
          type: 'sales',
          format: 'pdf',
          status: 'available',
          icon: TrendingUp
        }
      ];

      setReports(defaultReports);
      setLoading(false);
    };

    initializeReports();
  }, []);

  // Фильтрация отчетов
  const filteredReports = reports.filter(report => {
    const matchesType = selectedType === 'all' || report.type === selectedType;
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Генерация отчета
  const generateReport = async (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    // Обновляем статус на "генерируется"
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, status: 'generating' as const } : r
    ));

    try {
      // Имитация генерации отчета
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Обновляем статус и время генерации
      setReports(prev => prev.map(r => 
        r.id === reportId ? { 
          ...r, 
          status: 'available' as const,
          lastGenerated: new Date().toLocaleString('ru-RU')
        } : r
      ));

      // Показываем уведомление об успехе
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ [DEBUG] Отчет "${report.title}" успешно сгенерирован`);
      }
    } catch (error) {
      console.error('Ошибка генерации отчета:', error);
      setReports(prev => prev.map(r => 
        r.id === reportId ? { ...r, status: 'error' as const } : r
      ));
    }
  };

  // Получение цвета для типа отчета
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sales': return 'text-blue-600 bg-blue-50';
      case 'inventory': return 'text-green-600 bg-green-50';
      case 'financial': return 'text-purple-600 bg-purple-50';
      case 'customers': return 'text-orange-600 bg-orange-50';
      case 'cars': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Получение цвета для формата
  const getFormatColor = (format: string) => {
    switch (format) {
      case 'pdf': return 'text-red-600 bg-red-50';
      case 'excel': return 'text-green-600 bg-green-50';
      case 'csv': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="flex h-[calc(100vh-4rem)]">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="container-custom py-8">
              <div className="animate-pulse">
                <div className="h-8 bg-neutral-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-neutral-200 rounded w-1/2 mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-48 bg-neutral-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container-custom py-8">
            {/* Заголовок страницы */}
            <PageHeader
              title="Отчеты"
              subtitle="Генерация и управление отчетами системы"
              count={filteredReports.length}
            >
              <div className="flex items-center space-x-3">
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Настроить расписание
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Экспорт всех
                </Button>
              </div>
            </PageHeader>

            {/* Фильтры и поиск */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Поиск */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Поиск отчетов..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Фильтр по типу */}
                <div className="sm:w-48">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">Все типы</option>
                    <option value="sales">Продажи</option>
                    <option value="inventory">Инвентарь</option>
                    <option value="financial">Финансы</option>
                    <option value="customers">Клиенты</option>
                    <option value="cars">Автомобили</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Сетка отчетов */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                             {filteredReports.map((report) => {
                 const TypeIcon = report.icon;
                
                return (
                  <Card key={report.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <TypeIcon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{report.title}</CardTitle>
                            <p className="text-sm text-neutral-600 mt-1">{report.description}</p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Метаданные отчета */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                              {report.type}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFormatColor(report.format)}`}>
                              {report.format.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Время последней генерации */}
                        {report.lastGenerated && (
                          <div className="text-xs text-neutral-500">
                            Последняя генерация: {report.lastGenerated}
                          </div>
                        )}

                        {/* Кнопки действий */}
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => generateReport(report.id)}
                            disabled={report.status === 'generating'}
                            className="flex-1"
                            variant="primary"
                          >
                            {report.status === 'generating' ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Генерация...
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4 mr-2" />
                                Сгенерировать
                              </>
                            )}
                          </Button>
                          
                          {report.status === 'available' && report.lastGenerated && (
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        {/* Статус */}
                        {report.status === 'error' && (
                          <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                            Ошибка генерации отчета
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Пустое состояние */}
            {filteredReports.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">Отчеты не найдены</h3>
                <p className="text-neutral-600 mb-4">
                  Попробуйте изменить фильтры или поисковый запрос
                </p>
                <Button
                  onClick={() => {
                    setSelectedType('all');
                    setSearchQuery('');
                  }}
                  variant="outline"
                >
                  Сбросить фильтры
                </Button>
              </div>
            )}
          </div>
        </main>
        <DebugPanel />
      </div>
    </div>
  );
}
