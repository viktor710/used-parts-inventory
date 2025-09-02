"use client";

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ToastContainer, useToast } from '@/components/ui/Toast';
import { AlertTriangle, Trash2, ArrowLeft, Loader2 } from 'lucide-react';

export default function DeletePartPage() {
  const router = useRouter();
  const params = useParams();
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const [deleting, setDeleting] = useState(false);

  const partId = params['id'] as string;

  const handleDelete = async () => {
    try {
      setDeleting(true);

      const response = await fetch(`/api/parts/${partId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        showSuccess('Успешно', 'Запчасть удалена');
        setTimeout(() => {
          router.push('/parts');
        }, 1000);
      } else {
        throw new Error(result.error || 'Ошибка удаления');
      }
    } catch (error) {
      console.error('Ошибка удаления запчасти:', error);
      showError('Ошибка', error instanceof Error ? error.message : 'Ошибка удаления запчасти');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/parts/${partId}`);
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
                  Вы уверены, что хотите удалить эту запчасть? 
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
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
