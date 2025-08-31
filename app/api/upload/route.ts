import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'general';

    console.log('🔧 [DEBUG] API /api/upload: Получен запрос на загрузку:', {
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      folder: folder
    });

    if (!file) {
      console.error('🔧 [DEBUG] API /api/upload: Файл не найден');
      return NextResponse.json(
        { error: 'Файл не найден' },
        { status: 400 }
      );
    }

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      console.error('🔧 [DEBUG] API /api/upload: Неподдерживаемый тип файла:', file.type);
      return NextResponse.json(
        { error: 'Поддерживаются только изображения' },
        { status: 400 }
      );
    }

    // Конвертируем файл в base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;

    console.log('🔧 [DEBUG] API /api/upload: Загрузка на Cloudinary...');

    // Загружаем на Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        base64String,
        {
          folder: `sait/${folder}`,
          resource_type: 'auto',
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('🔧 [DEBUG] API /api/upload: Ошибка Cloudinary:', error);
            reject(error);
          } else {
            console.log('🔧 [DEBUG] API /api/upload: Успешная загрузка на Cloudinary:', {
              publicId: result?.public_id,
              secureUrl: result?.secure_url
            });
            resolve(result);
          }
        }
      );
    });

    console.log('🔧 [DEBUG] API /api/upload: Загрузка завершена успешно');

    return NextResponse.json({
      success: true,
      data: uploadResult
    });

  } catch (error) {
    console.error('🔧 [DEBUG] API /api/upload: Ошибка загрузки:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке файла' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json(
        { error: 'ID изображения не указан' },
        { status: 400 }
      );
    }

    // Удаляем изображение из Cloudinary
    const deleteResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    return NextResponse.json({
      success: true,
      data: deleteResult
    });

  } catch (error) {
    console.error('Ошибка удаления:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении файла' },
      { status: 500 }
    );
  }
}
