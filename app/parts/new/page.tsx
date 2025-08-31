"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { DebugPanel } from '@/components/debug/DebugPanel';
import { ToastContainer, useToast } from '@/components/ui/Toast';
import { 
  ArrowLeft, 
  Save, 
  X, 
  AlertCircle,
  Car,
  Plus,
  Check
} from 'lucide-react';
import { PartCondition, PartStatus, CreatePartInput, Car as CarType, CreateCarInput, BodyType, FuelType } from '@/types';
import { Autocomplete } from '@/components/ui/Autocomplete';

import { getCategoryByZapchastName } from '@/lib/zapchasti-categories';

/**
 * Интерфейс для формы добавления запчасти
 */
interface AddPartFormData {
  zapchastName: string;
  condition: PartCondition | '';
  status: PartStatus | '';
  price: string;
  description: string;
  location: string;
  supplier: string;
  purchaseDate: string;
  purchasePrice: string;
  notes: string;
  images: string[];
}

/**
 * Начальное состояние формы
 */
const initialFormData: AddPartFormData = {
  zapchastName: '',
  condition: '',
  status: '',
  price: '',
  description: '',
  location: '',
  supplier: '',
  purchaseDate: '',
  purchasePrice: '',
  notes: '',
  images: [],
};



const conditionOptions = [
  { value: 'excellent', label: 'Отличное' },
  { value: 'good', label: 'Хорошее' },
  { value: 'fair', label: 'Удовлетворительное' },
  { value: 'poor', label: 'Плохое' },
  { value: 'broken', label: 'Сломанное' },
];

const statusOptions = [
  { value: 'available', label: 'Доступна' },
  { value: 'reserved', label: 'Зарезервирована' },
  { value: 'sold', label: 'Продана' },
  { value: 'scrapped', label: 'Утилизирована' },
];

const bodyTypeOptions: { value: BodyType; label: string }[] = [
  { value: 'sedan', label: 'Седан' },
  { value: 'hatchback', label: 'Хэтчбек' },
  { value: 'wagon', label: 'Универсал' },
  { value: 'suv', label: 'Внедорожник' },
  { value: 'coupe', label: 'Купе' },
  { value: 'convertible', label: 'Кабриолет' },
  { value: 'pickup', label: 'Пикап' },
  { value: 'van', label: 'Минивэн' },
  { value: 'other', label: 'Прочее' },
];

const fuelTypeOptions: { value: FuelType; label: string }[] = [
  { value: 'gasoline', label: 'Бензин' },
  { value: 'diesel', label: 'Дизель' },
  { value: 'hybrid', label: 'Гибрид' },
  { value: 'electric', label: 'Электро' },
  { value: 'lpg', label: 'Газ' },
  { value: 'other', label: 'Прочее' },
];

/**
 * Компонент поля ввода
 */
interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'number' | 'date' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  value: string;
  onChange: (name: string, value: string) => void;
  error?: string | undefined;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  options = [],
  value,
  onChange,
  error
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(name, e.target.value);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          rows={3}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
            error ? 'border-error' : 'border-neutral-300'
          }`}
        />
      ) : type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={handleChange}
          required={required}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
            error ? 'border-error' : 'border-neutral-300'
          }`}
        >
          <option value="">Выберите {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
            error ? 'border-error' : 'border-neutral-300'
          }`}
        />
      )}
      
      {error && (
        <div className="flex items-center text-sm text-error">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

/**
 * Компонент выбора автомобиля
 */
interface CarSelectionProps {
  cars: CarType[];
  selectedCarId: string;
  onCarSelect: (carId: string) => void;
  onAddNewCar: () => void;
}

const CarSelection: React.FC<CarSelectionProps> = ({ cars, selectedCarId, onCarSelect, onAddNewCar }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Car className="w-5 h-5 mr-2" />
          Выберите автомобиль
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cars.length === 0 ? (
          <div className="text-center py-8">
            <Car className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600 mb-4">Автомобили не найдены</p>
            <Button onClick={onAddNewCar} variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Добавить первый автомобиль
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-3">
              {cars.map((car) => (
                <div
                  key={car.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedCarId === car.id
                      ? 'border-primary bg-primary/5'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                  onClick={() => onCarSelect(car.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-neutral-900">
                        {car.brand} {car.model} ({car.year})
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {car.bodyType}, {car.fuelType}, {car.engineVolume}
                      </p>
                    </div>
                    {selectedCarId === car.id && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-neutral-200">
              <Button onClick={onAddNewCar} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Добавить новый автомобиль
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Компонент добавления автомобиля
 */
interface AddCarFormProps {
  onCarCreated: (car: CarType) => void;
  onCancel: () => void;
}

const AddCarForm: React.FC<AddCarFormProps> = ({ onCarCreated, onCancel }) => {
  const [formData, setFormData] = useState<CreateCarInput>({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    bodyType: 'sedan',
    fuelType: 'gasoline',
    engineVolume: '',
    transmission: '',
    mileage: 0,
    vin: '',
    color: '',
    description: '',
    images: [],
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.brand.trim()) {
      newErrors['brand'] = 'Бренд обязателен';
    }
    if (!formData.model.trim()) {
      newErrors['model'] = 'Модель обязательна';
    }
    if (!formData.vin.trim()) {
      newErrors['vin'] = 'VIN обязателен';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        onCarCreated(result.data);
      } else {
        setErrors({ submit: result.error || 'Ошибка при создании автомобиля' });
      }
    } catch (error) {
      setErrors({ submit: 'Ошибка сети при создании автомобиля' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Добавить новый автомобиль
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Бренд"
              name="brand"
              placeholder="Например: BMW"
              required
              value={formData.brand}
              onChange={handleFieldChange}
              error={errors['brand']}
            />
            
            <FormField
              label="Модель"
              name="model"
              placeholder="Например: X5"
              required
              value={formData.model}
              onChange={handleFieldChange}
              error={errors['model']}
            />
            
            <FormField
              label="Год выпуска"
              name="year"
              type="number"
              required
              value={formData.year.toString()}
              onChange={handleFieldChange}
              error={errors['year']}
            />
            
            <FormField
              label="VIN"
              name="vin"
              placeholder="17-значный VIN номер"
              required
              value={formData.vin}
              onChange={handleFieldChange}
              error={errors['vin']}
            />
            
            <FormField
              label="Тип кузова"
              name="bodyType"
              type="select"
              required
              options={bodyTypeOptions}
              value={formData.bodyType}
              onChange={handleFieldChange}
              error={errors['bodyType']}
            />
            
            <FormField
              label="Тип топлива"
              name="fuelType"
              type="select"
              required
              options={fuelTypeOptions}
              value={formData.fuelType}
              onChange={handleFieldChange}
              error={errors['fuelType']}
            />
            
            <FormField
              label="Объем двигателя"
              name="engineVolume"
              placeholder="Например: 2.0L"
              value={formData.engineVolume}
              onChange={handleFieldChange}
              error={errors['engineVolume']}
            />
            
            <FormField
              label="Трансмиссия"
              name="transmission"
              placeholder="Например: Автомат"
              value={formData.transmission}
              onChange={handleFieldChange}
              error={errors['transmission']}
            />
            
            <FormField
              label="Пробег (км)"
              name="mileage"
              type="number"
              value={formData.mileage.toString()}
              onChange={handleFieldChange}
              error={errors['mileage']}
            />
            
            <FormField
              label="Цвет"
              name="color"
              placeholder="Например: Черный"
              value={formData.color}
              onChange={handleFieldChange}
              error={errors['color']}
            />
          </div>
          
          <FormField
            label="Описание"
            name="description"
            type="textarea"
            placeholder="Описание автомобиля..."
            value={formData.description}
            onChange={handleFieldChange}
            error={errors['description']}
          />
          
          <FormField
            label="Заметки"
            name="notes"
            type="textarea"
            placeholder="Дополнительные заметки..."
            value={formData.notes}
            onChange={handleFieldChange}
            error={errors['notes']}
          />
          
          {errors['submit'] && (
            <div className="flex items-center text-sm text-error">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors['submit']}
            </div>
          )}
          
          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Создание...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Создать автомобиль
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

/**
 * Основная страница добавления запчасти
 */
export default function AddPartPage() {
  const router = useRouter();
  const { toasts, removeToast, showSuccess, showError } = useToast();
  
  // Состояние пошагового процесса
  const [step, setStep] = useState<'car-selection' | 'add-car' | 'add-part'>('car-selection');
  const [selectedCarId, setSelectedCarId] = useState('');
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);
  const [cars, setCars] = useState<CarType[]>([]);
  const [loadingCars, setLoadingCars] = useState(true);
  
  // Состояние формы запчасти
  const [formData, setFormData] = useState<AddPartFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Отладочная информация
  console.log('🔧 [DEBUG] AddPartPage: Компонент рендерится');
  console.log('🔧 [DEBUG] AddPartPage: Текущий шаг:', step);
  console.log('🔧 [DEBUG] AddPartPage: Выбранный автомобиль:', selectedCarId);

  // Загрузка автомобилей
  useEffect(() => {
    const fetchCars = async () => {
      try {
        console.log('🔧 [DEBUG] AddPartPage: Загрузка автомобилей');
        const response = await fetch('/api/cars');
        const result = await response.json();
        
        if (result.success) {
          setCars(result.data.cars);
        } else {
          console.error('Ошибка при загрузке автомобилей:', result.error);
        }
      } catch (error) {
        console.error('Ошибка при загрузке автомобилей:', error);
      } finally {
        setLoadingCars(false);
      }
    };

    fetchCars();
  }, []);

  // Обработчик выбора автомобиля
  const handleCarSelect = (carId: string) => {
    setSelectedCarId(carId);
    const car = cars.find(c => c.id === carId);
    setSelectedCar(car || null);
    setStep('add-part');
  };

  // Обработчик добавления нового автомобиля
  const handleAddNewCar = () => {
    setStep('add-car');
  };

  // Обработчик создания автомобиля
  const handleCarCreated = (car: CarType) => {
    setCars(prev => [...prev, car]);
    setSelectedCarId(car.id);
    setSelectedCar(car);
    setStep('add-part');
    showSuccess('Автомобиль добавлен!', 'Теперь вы можете добавить запчасть для этого автомобиля');
  };

  // Обработчик отмены добавления автомобиля
  const handleCancelAddCar = () => {
    setStep('car-selection');
  };

  // Обработчик изменения полей формы запчасти
  const handleFieldChange = (name: string, value: string) => {
    if (name === 'images') {
      // Обработка изображений как массива
      try {
        const imagesArray = JSON.parse(value);
        setFormData(prev => ({ ...prev, [name]: imagesArray }));
      } catch {
        setFormData(prev => ({ ...prev, [name]: [] }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Валидация формы запчасти
  const validatePartForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.zapchastName.trim()) {
      newErrors['zapchastName'] = 'Выберите запчасть из списка';
    }
    if (!formData.condition) {
      newErrors['condition'] = 'Выберите состояние';
    }
    if (!formData.status) {
      newErrors['status'] = 'Выберите статус';
    }
    if (!formData.price) {
      newErrors['price'] = 'Цена обязательна';
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        newErrors['price'] = 'Цена должна быть положительным числом';
      }
    }
    if (!formData.location.trim()) {
      newErrors['location'] = 'Место хранения обязательно';
    }
    if (!formData.supplier.trim()) {
      newErrors['supplier'] = 'Поставщик обязателен';
    }
    if (!formData.purchaseDate) {
      newErrors['purchaseDate'] = 'Дата приобретения обязательна';
    }
    if (!formData.purchasePrice) {
      newErrors['purchasePrice'] = 'Цена приобретения обязательна';
    } else {
      const purchasePrice = parseFloat(formData.purchasePrice);
      if (isNaN(purchasePrice) || purchasePrice <= 0) {
        newErrors['purchasePrice'] = 'Цена приобретения должна быть положительным числом';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Отправка формы запчасти
  const handleSubmitPart = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔧 [DEBUG] AddPartPage: Отправка формы запчасти');
    
    if (!validatePartForm()) {
      console.log('🔧 [DEBUG] AddPartPage: Ошибки валидации:', errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Автоматически определяем категорию по названию запчасти
      const category = getCategoryByZapchastName(formData.zapchastName);
      
      const partData: CreatePartInput = {
        zapchastName: formData.zapchastName.trim(),
        category: category,
        carId: selectedCarId,
        condition: formData.condition as PartCondition,
        status: formData.status as PartStatus,
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        location: formData.location.trim(),
        supplier: formData.supplier.trim(),
        purchaseDate: new Date(formData.purchaseDate),
        purchasePrice: parseFloat(formData.purchasePrice),
        images: [],
        notes: formData.notes.trim(),
      };

      console.log('🔧 [DEBUG] AddPartPage: Отправка данных запчасти:', partData);

      const response = await fetch('/api/parts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partData),
      });

      const result = await response.json();

      if (result.success) {
        console.log('🔧 [DEBUG] AddPartPage: Запчасть успешно создана:', result.data);
        showSuccess('Запчасть добавлена!', 'Новая запчасть успешно добавлена в базу данных');
        
        setTimeout(() => {
          router.push('/parts');
        }, 2000);
      } else {
        console.error('🔧 [DEBUG] AddPartPage: Ошибка создания запчасти:', result.error);
        showError('Ошибка добавления', result.error || 'Не удалось добавить запчасть');
      }
    } catch (error) {
      console.error('🔧 [DEBUG] AddPartPage: Ошибка сети:', error);
      showError('Ошибка сети', 'Проверьте подключение к интернету');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Сброс формы запчасти
  const handleResetPart = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  // Рендер содержимого в зависимости от шага
  const renderContent = () => {
    switch (step) {
      case 'car-selection':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Выберите автомобиль
              </h2>
              <p className="text-neutral-600">
                Сначала выберите автомобиль, для которого добавляется запчасть
              </p>
            </div>
            
            {loadingCars ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                <p>Загрузка автомобилей...</p>
              </div>
            ) : (
              <CarSelection
                cars={cars}
                selectedCarId={selectedCarId}
                onCarSelect={handleCarSelect}
                onAddNewCar={handleAddNewCar}
              />
            )}
          </div>
        );

      case 'add-car':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Добавить новый автомобиль
              </h2>
              <p className="text-neutral-600">
                Заполните информацию об автомобиле
              </p>
            </div>
            
            <AddCarForm
              onCarCreated={handleCarCreated}
              onCancel={handleCancelAddCar}
            />
          </div>
        );

      case 'add-part':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Добавить запчасть
              </h2>
              <p className="text-neutral-600">
                Заполните информацию о запчасти для автомобиля
              </p>
              {selectedCar && (
                <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="font-medium text-primary">
                    {selectedCar.brand} {selectedCar.model} ({selectedCar.year})
                  </p>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmitPart} className="space-y-8">
              {/* Основная информация */}
              <Card>
                <CardHeader>
                  <CardTitle>Основная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">
                        Запчасть
                        <span className="text-error ml-1">*</span>
                      </label>
                      <Autocomplete
                        value={formData.zapchastName}
                        onChange={(value) => handleFieldChange('zapchastName', value)}
                        placeholder="Начните вводить название запчасти..."
                        error={errors['zapchastName'] || undefined}
                        required
                      />
                    </div>
                    
                    <FormField
                      label="Состояние"
                      name="condition"
                      type="select"
                      required
                      options={conditionOptions}
                      value={formData.condition}
                      onChange={handleFieldChange}
                      error={errors['condition']}
                    />
                    
                    <FormField
                      label="Статус"
                      name="status"
                      type="select"
                      required
                      options={statusOptions}
                      value={formData.status}
                      onChange={handleFieldChange}
                      error={errors['status']}
                    />
                  </div>
                  
                  <FormField
                    label="Описание"
                    name="description"
                    type="textarea"
                    placeholder="Подробное описание запчасти, особенности, комплектация..."
                    value={formData.description}
                    onChange={handleFieldChange}
                    error={errors['description']}
                  />
                </CardContent>
              </Card>

              {/* Цены */}
              <Card>
                <CardHeader>
                  <CardTitle>Цены</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Цена продажи (₽)"
                      name="price"
                      type="number"
                      placeholder="Например: 85000"
                      required
                      value={formData.price}
                      onChange={handleFieldChange}
                      error={errors['price']}
                    />
                    
                    <FormField
                      label="Цена приобретения (₽)"
                      name="purchasePrice"
                      type="number"
                      placeholder="Например: 65000"
                      required
                      value={formData.purchasePrice}
                      onChange={handleFieldChange}
                      error={errors['purchasePrice']}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Место хранения и поставщик */}
              <Card>
                <CardHeader>
                  <CardTitle>Место хранения и поставщик</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Место хранения"
                      name="location"
                      placeholder="Например: Склад А, полка 1"
                      required
                      value={formData.location}
                      onChange={handleFieldChange}
                      error={errors['location']}
                    />
                    
                    <FormField
                      label="Поставщик"
                      name="supplier"
                      placeholder="Например: Авторазборка BMW"
                      required
                      value={formData.supplier}
                      onChange={handleFieldChange}
                      error={errors['supplier']}
                    />
                    
                    <FormField
                      label="Дата приобретения"
                      name="purchaseDate"
                      type="date"
                      required
                      value={formData.purchaseDate}
                      onChange={handleFieldChange}
                      error={errors['purchaseDate']}
                    />
                  </div>
                  
                  <FormField
                    label="Дополнительные заметки"
                    name="notes"
                    type="textarea"
                    placeholder="Дополнительная информация, особенности, история..."
                    value={formData.notes}
                    onChange={handleFieldChange}
                    error={errors['notes']}
                  />
                </CardContent>
              </Card>

              {/* Изображения */}
              <Card>
                <CardHeader>
                  <CardTitle>Фотографии запчасти</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    images={formData.images}
                    onImagesChange={(images) => handleFieldChange('images', JSON.stringify(images))}
                    folder="parts"
                    maxImages={8}
                  />
                </CardContent>
              </Card>

              {/* Кнопки действий */}
              <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('car-selection')}
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад к выбору автомобиля
                </Button>
                
                <div className="flex items-center space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResetPart}
                    disabled={isSubmitting}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Сбросить
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/parts')}
                    disabled={isSubmitting}
                  >
                    Отмена
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="min-w-[120px]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Сохранение...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Сохранить
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container-custom py-8">
            {/* Заголовок страницы */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                    Добавить запчасть
                  </h1>
                  <p className="text-neutral-600">
                    {step === 'car-selection' && 'Сначала выберите автомобиль'}
                    {step === 'add-car' && 'Добавьте новый автомобиль'}
                    {step === 'add-part' && 'Заполните информацию о запчасти'}
                  </p>
                </div>
              </div>
            </div>

            {/* Основной контент */}
            {renderContent()}
          </div>
        </main>
      </div>
      
      {/* Панель отладки */}
      <DebugPanel />
      
      {/* Toast уведомления */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
