import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/database-service'
import { CreatePartInput } from '@/types'

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

    console.log('🔧 [DEBUG] API /api/parts GET: Запрос с параметрами:', { page, limit, filters })

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
    
    console.log('🔧 [DEBUG] API /api/parts POST: Создание запчасти:', body)

    // Валидация входных данных
    if (!body.zapchastName || !body.category || !body.carId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Отсутствуют обязательные поля: zapchastName, category, carId' 
        },
        { status: 400 }
      )
    }

    // Проверяем, что автомобиль существует
    const car = await dbService.getCarById(body.carId)
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
      zapchastName: body.zapchastName,
      category: body.category,
      carId: body.carId,
      condition: body.condition || 'good',
      status: body.status || 'available',
      price: parseFloat(body.price) || 0,
      description: body.description || '',
      location: body.location || '',
      supplier: body.supplier || '',
      purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : new Date(),
      purchasePrice: parseFloat(body.purchasePrice) || 0,
      images: body.images || [],
      notes: body.notes || ''
    }

    const newPart = await dbService.createPart(partData)

    console.log('✅ [DEBUG] API /api/parts POST: Запчасть создана:', newPart.id)

    return NextResponse.json({
      success: true,
      data: newPart
    }, { status: 201 })

  } catch (error) {
    console.error('❌ [ERROR] API /api/parts POST:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка при создании запчасти' 
      },
      { status: 500 }
    )
  }
}
