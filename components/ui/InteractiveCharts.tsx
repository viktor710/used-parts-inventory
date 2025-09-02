"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  BarChart3,
  PieChart,
  TrendingUp,
  Download,
  RefreshCw
} from 'lucide-react';

interface ChartData {
  label: string;
  value: number;
  color: string;
  percentage?: number;
}

/**
 * Компонент интерактивных графиков для аналитики
 */
export const InteractiveCharts: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');

  // Моковые данные для графиков
  const salesData: ChartData[] = [
    { label: 'Двигатели', value: 450000, color: '#3B82F6', percentage: 35 },
    { label: 'Трансмиссия', value: 320000, color: '#10B981', percentage: 25 },
    { label: 'Подвеска', value: 280000, color: '#F59E0B', percentage: 22 },
    { label: 'Тормоза', value: 180000, color: '#EF4444', percentage: 14 },
    { label: 'Электрика', value: 80000, color: '#8B5CF6', percentage: 4 }
  ];

  const categoryData: ChartData[] = [
    { label: 'Доступные', value: 45, color: '#10B981', percentage: 60 },
    { label: 'Зарезервированные', value: 15, color: '#F59E0B', percentage: 20 },
    { label: 'Продано', value: 12, color: '#3B82F6', percentage: 16 },
    { label: 'Утилизировано', value: 3, color: '#EF4444', percentage: 4 }
  ];

  const monthlyTrends: ChartData[] = [
    { label: 'Янв', value: 120000, color: '#3B82F6' },
    { label: 'Фев', value: 150000, color: '#3B82F6' },
    { label: 'Мар', value: 180000, color: '#3B82F6' },
    { label: 'Апр', value: 220000, color: '#3B82F6' },
    { label: 'Май', value: 280000, color: '#3B82F6' },
    { label: 'Июн', value: 320000, color: '#3B82F6' }
  ];

  const periods = [
    { key: 'week', label: 'Неделя' },
    { key: 'month', label: 'Месяц' },
    { key: 'quarter', label: 'Квартал' },
    { key: 'year', label: 'Год' }
  ];

  const categories = [
    { key: 'all', label: 'Все категории' },
    { key: 'engine', label: 'Двигатели' },
    { key: 'transmission', label: 'Трансмиссия' },
    { key: 'suspension', label: 'Подвеска' },
    { key: 'brakes', label: 'Тормоза' },
    { key: 'electrical', label: 'Электрика' }
  ];

  // Обработка изменения периода
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    setIsLoading(true);
    
    // Имитация загрузки данных
    setTimeout(() => {
      setIsLoading(false);
      console.log('Период изменен:', period);
    }, 500);
  };

  // Обработка изменения категории
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    console.log('Категория изменена:', category);
  };

  // Экспорт данных
  const handleExport = (type: 'pdf' | 'excel') => {
    console.log(`Экспорт в ${type.toUpperCase()}`);
  };

  // Обновление данных
  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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

  // Получение данных для отображения
  const getDisplayData = () => {
    switch (chartType) {
      case 'bar':
        return salesData;
      case 'pie':
        return categoryData;
      case 'line':
        return monthlyTrends;
      default:
        return salesData;
    }
  };

  const displayData = getDisplayData();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Аналитика продаж
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshData}
              disabled={isLoading}
              className="p-1"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('pdf')}
              className="text-xs"
            >
              <Download className="w-3 h-3 mr-1" />
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('excel')}
              className="text-xs"
            >
              <Download className="w-3 h-3 mr-1" />
              Excel
            </Button>
          </div>
        </div>

        {/* Фильтры */}
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-neutral-700">Период:</span>
            {periods.map((period) => (
              <Button
                key={period.key}
                variant={selectedPeriod === period.key ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handlePeriodChange(period.key)}
                className="text-xs"
              >
                {period.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-neutral-700">Категория:</span>
            {categories.map((category) => (
              <Button
                key={category.key}
                variant={selectedCategory === category.key ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleCategoryChange(category.key)}
                className="text-xs"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Типы графиков */}
        <div className="flex flex-wrap gap-2 mt-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-neutral-700">Тип графика:</span>
            <Button
              variant={chartType === 'bar' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
              className="text-xs"
            >
              <BarChart3 className="w-3 h-3 mr-1" />
              Столбцы
            </Button>
            <Button
              variant={chartType === 'pie' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setChartType('pie')}
              className="text-xs"
            >
              <PieChart className="w-3 h-3 mr-1" />
              Круговая
            </Button>
            <Button
              variant={chartType === 'line' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
              className="text-xs"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              Линейный
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-neutral-400 animate-spin mx-auto mb-2" />
              <p className="text-neutral-600">Загрузка данных...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* График */}
            <div className="h-64 bg-neutral-50 rounded-lg p-4">
              {chartType === 'bar' && (
                <div className="h-full flex items-end justify-between space-x-2">
                  {displayData.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full rounded-t transition-all duration-500 hover:opacity-80 cursor-pointer"
                        style={{
                          height: `${(item.value / Math.max(...displayData.map(d => d.value))) * 200}px`,
                          backgroundColor: item.color
                        }}
                        title={`${item.label}: ${formatCurrency(item.value)}`}
                      />
                      <span className="text-xs text-neutral-600 mt-2 text-center">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {chartType === 'pie' && (
                <div className="h-full flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    {displayData.map((item, index) => {
                      const total = displayData.reduce((sum, d) => sum + d.value, 0);
                      const percentage = (item.value / total) * 100;
                      const angle = (percentage / 100) * 360;
                      
                      return (
                        <div
                          key={index}
                          className="absolute inset-0 rounded-full border-8 transition-all duration-300 hover:scale-105 cursor-pointer"
                          style={{
                            borderColor: item.color,
                            transform: `rotate(${index * 90}deg)`,
                            clipPath: `polygon(50% 50%, 50% 0%, ${50 + Math.cos(angle * Math.PI / 180) * 50}% ${50 + Math.sin(angle * Math.PI / 180) * 50}%)`
                          }}
                          title={`${item.label}: ${item.value} (${percentage.toFixed(1)}%)`}
                        />
                      );
                    })}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-neutral-700">
                        {displayData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {chartType === 'line' && (
                <div className="h-full flex items-end justify-between space-x-2">
                  {displayData.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-2 rounded-full transition-all duration-500 hover:scale-150 cursor-pointer"
                        style={{
                          height: `${(item.value / Math.max(...displayData.map(d => d.value))) * 200}px`,
                          backgroundColor: item.color
                        }}
                        title={`${item.label}: ${formatCurrency(item.value)}`}
                      />
                      <span className="text-xs text-neutral-600 mt-2">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Легенда */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {displayData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors"
                >
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {item.label}
                    </p>
                    <p className="text-xs text-neutral-600">
                      {formatCurrency(item.value)}
                      {item.percentage && ` (${item.percentage}%)`}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">
                  {formatCurrency(displayData.reduce((sum, item) => sum + item.value, 0))}
                </p>
                <p className="text-sm text-neutral-600">Общая сумма</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {displayData.length}
                </p>
                <p className="text-sm text-neutral-600">Категорий</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">
                  {formatCurrency(Math.max(...displayData.map(item => item.value)))}
                </p>
                <p className="text-sm text-neutral-600">Максимум</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
