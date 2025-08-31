import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/database-service'
import { CreatePartInput } from '@/types'
import { PartSchema, ValidationService } from '@/lib/validation'
import { Logger } from '@/lib/logger'

/**
 * GET /api/parts - Получение списка запчастей с пагинацией и фильтрацией
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Параметры пагинации
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    // Параметры фильтрации
    const category = searchParams.get('category') || undefined
    const status = searchParams.get('status') || undefined
    const carId = searchParams.get('carId') || undefined
    const location = searchParams.get('location') || undefined
    
    const filters: any = {}
    if (category) filters.category = category
    if (status) filters.status = status
    if (carId) filters.carId = carId
    if (location) filters.location = location

    Logger.info('API /api/parts GET: Запрос получен', { page, limit, filters })

    const result = await dbService.getParts(page, limit, filters)

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('❌ [ERROR] API /api/parts GET:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка при получении списка запчастей' 
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/parts - Создание новой запчасти
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    Logger.info('API /api/parts POST: Создание запчасти', { body })

    // Валидация входных данных с использованием Zod
    const validationResult = ValidationService.validate(PartSchema, body)
        if (!validationResult.success) {
      Logger.validation('PartSchema', validationResult.errors, body);
      return NextResponse.json(
        {
          success: false,
          error: 'Ошибка валидации данных',
          details: validationResult.errors
        },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    // Проверяем, что автомобиль существует
    const car = await dbService.getCarById(validatedData.carId)
    if (!car) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Автомобиль с указанным ID не найден' 
        },
        { status: 404 }
      )
    }

    const partData: CreatePartInput = {
      zapchastName: validatedData.zapchastName,
      category: validatedData.category,
      carId: validatedData.carId,
      condition: validatedData.condition,
      status: validatedData.status,
      price: validatedData.price,
      description: validatedData.description,
      location: validatedData.location,
      supplier: validatedData.supplier,
      purchaseDate: validatedData.purchaseDate,
      purchasePrice: validatedData.purchasePrice,
      images: validatedData.images.filter((url): url is string => url !== undefined),
      notes: validatedData.notes || ''
    }

    const newPart = await dbService.createPart(partData)

    console.log('✅ [DEBUG] API /api/parts POST: Запчасть создана:', newPart.id)

    return NextResponse.json({
      success: true,
      data: newPart
    }, { status: 201 })

  } catch (error) {
    Logger.error('API /api/parts POST: Ошибка при создании запчасти', error as Error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка при создании запчасти' 
      },
      { status: 500 }
    )
  }
}
