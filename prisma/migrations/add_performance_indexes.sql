-- Миграция для добавления индексов производительности
-- Дата: 2025-01-27
-- Описание: Добавление индексов для оптимизации запросов

-- Индексы для таблицы parts
CREATE INDEX IF NOT EXISTS idx_parts_category ON parts(category);
CREATE INDEX IF NOT EXISTS idx_parts_status ON parts(status);
CREATE INDEX IF NOT EXISTS idx_parts_car_id ON parts(car_id);
CREATE INDEX IF NOT EXISTS idx_parts_created_at ON parts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_parts_updated_at ON parts(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_parts_price ON parts(price);
CREATE INDEX IF NOT EXISTS idx_parts_purchase_date ON parts(purchase_date DESC);
CREATE INDEX IF NOT EXISTS idx_parts_location ON parts(location);
CREATE INDEX IF NOT EXISTS idx_parts_supplier ON parts(supplier);

-- Составные индексы для частых запросов
CREATE INDEX IF NOT EXISTS idx_parts_category_status ON parts(category, status);
CREATE INDEX IF NOT EXISTS idx_parts_car_status ON parts(car_id, status);
CREATE INDEX IF NOT EXISTS idx_parts_category_price ON parts(category, price);
CREATE INDEX IF NOT EXISTS idx_parts_created_status ON parts(created_at DESC, status);

-- Индексы для таблицы cars
CREATE INDEX IF NOT EXISTS idx_cars_brand ON cars(brand);
CREATE INDEX IF NOT EXISTS idx_cars_model ON cars(model);
CREATE INDEX IF NOT EXISTS idx_cars_year ON cars(year);
CREATE INDEX IF NOT EXISTS idx_cars_body_type ON cars(body_type);
CREATE INDEX IF NOT EXISTS idx_cars_fuel_type ON cars(fuel_type);
CREATE INDEX IF NOT EXISTS idx_cars_created_at ON cars(created_at DESC);

-- Составные индексы для автомобилей
CREATE INDEX IF NOT EXISTS idx_cars_brand_model ON cars(brand, model);
CREATE INDEX IF NOT EXISTS idx_cars_brand_year ON cars(brand, year);
CREATE INDEX IF NOT EXISTS idx_cars_body_fuel ON cars(body_type, fuel_type);

-- Индексы для таблицы suppliers
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
CREATE INDEX IF NOT EXISTS idx_suppliers_email ON suppliers(email);
CREATE INDEX IF NOT EXISTS idx_suppliers_created_at ON suppliers(created_at DESC);

-- Индексы для таблицы customers
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at DESC);

-- Индексы для таблицы sales
CREATE INDEX IF NOT EXISTS idx_sales_part_id ON sales(part_id);
CREATE INDEX IF NOT EXISTS idx_sales_customer_id ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_sale_date ON sales(sale_date DESC);
CREATE INDEX IF NOT EXISTS idx_sales_price ON sales(price);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at DESC);

-- Составные индексы для продаж
CREATE INDEX IF NOT EXISTS idx_sales_date_price ON sales(sale_date DESC, price);
CREATE INDEX IF NOT EXISTS idx_sales_customer_date ON sales(customer_id, sale_date DESC);

-- Индексы для полнотекстового поиска (если поддерживается)
-- CREATE INDEX IF NOT EXISTS idx_parts_zapchast_name_fts ON parts USING gin(to_tsvector('russian', zapchast_name));
-- CREATE INDEX IF NOT EXISTS idx_parts_description_fts ON parts USING gin(to_tsvector('russian', description));

-- Комментарии к индексам
COMMENT ON INDEX idx_parts_category IS 'Индекс для фильтрации по категории запчастей';
COMMENT ON INDEX idx_parts_status IS 'Индекс для фильтрации по статусу запчастей';
COMMENT ON INDEX idx_parts_car_id IS 'Индекс для связи с автомобилями';
COMMENT ON INDEX idx_parts_created_at IS 'Индекс для сортировки по дате создания';
COMMENT ON INDEX idx_parts_category_status IS 'Составной индекс для фильтрации по категории и статусу';
COMMENT ON INDEX idx_cars_brand_model IS 'Составной индекс для поиска по бренду и модели';
COMMENT ON INDEX idx_sales_date_price IS 'Индекс для анализа продаж по дате и цене';

-- Проверка созданных индексов
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('parts', 'cars', 'suppliers', 'customers', 'sales')
ORDER BY tablename, indexname;
