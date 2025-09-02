"use client";

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { AlertTriangle, Trash2, ArrowLeft } from 'lucide-react';

export default function DeleteCarPage() {
  const router = useRouter();
  const params = useParams();
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
    show: boolean;
  }>({ type: 'success', message: '', show: false });

  const carId = params['id'] as string;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/cars/${carId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setToast({
          type: 'success',
          message: 'Автомобиль успешно удален',
          show: true
        });
        
        setTimeout(() => {
          router.push('/cars');
        }, 1000);
      } else {
        setToast({
          type: 'error',
          message: result.error || 'Ошибка при удалении автомобиля',
          show: true
        });
      }
    } catch {
      setToast({
        type: 'error',
        message: 'Ошибка при удалении автомобиля',
        show: true
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/cars/${carId}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <AlertTriangle className="w-6 h-6 mr-3" />
                  Подтверждение удаления
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-neutral-600">
                  Вы уверены, что хотите удалить этот автомобиль? 
                  Это действие нельзя отменить.
                </p>
                
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={deleting}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Отмена
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1"
                  >
                    {deleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Удаление...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Удалить
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}
