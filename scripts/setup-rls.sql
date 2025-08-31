-- Скрипт для настройки Row Level Security (RLS) в Supabase
-- Этот скрипт должен быть выполнен в SQL Editor в Supabase Dashboard

-- Включаем RLS для всех таблиц
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Создаем политики для таблицы cars
-- Разрешаем чтение всем аутентифицированным пользователям
CREATE POLICY "Allow read access for authenticated users" ON cars
    FOR SELECT USING (auth.role() = 'authenticated');

-- Разрешаем создание аутентифицированным пользователям
CREATE POLICY "Allow insert for authenticated users" ON cars
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Разрешаем обновление владельцам записи (в будущем можно добавить поле owner_id)
CREATE POLICY "Allow update for authenticated users" ON cars
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Разрешаем удаление владельцам записи
CREATE POLICY "Allow delete for authenticated users" ON cars
    FOR DELETE USING (auth.role() = 'authenticated');

-- Создаем политики для таблицы parts
CREATE POLICY "Allow read access for authenticated users" ON parts
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow insert for authenticated users" ON parts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users" ON parts
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow delete for authenticated users" ON parts
    FOR DELETE USING (auth.role() = 'authenticated');

-- Создаем политики для таблицы suppliers
CREATE POLICY "Allow read access for authenticated users" ON suppliers
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow insert for authenticated users" ON suppliers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users" ON suppliers
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow delete for authenticated users" ON suppliers
    FOR DELETE USING (auth.role() = 'authenticated');

-- Создаем политики для таблицы customers
CREATE POLICY "Allow read access for authenticated users" ON customers
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow insert for authenticated users" ON customers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users" ON customers
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow delete for authenticated users" ON customers
    FOR DELETE USING (auth.role() = 'authenticated');

-- Создаем политики для таблицы sales
CREATE POLICY "Allow read access for authenticated users" ON sales
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow insert for authenticated users" ON sales
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users" ON sales
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow delete for authenticated users" ON sales
    FOR DELETE USING (auth.role() = 'authenticated');

-- Создаем индексы для улучшения производительности
CREATE INDEX idx_parts_category ON parts(category);
CREATE INDEX idx_parts_status ON parts(status);
CREATE INDEX idx_parts_car_id ON parts(car_id);
CREATE INDEX idx_parts_location ON parts(location);
CREATE INDEX idx_parts_supplier ON parts(supplier);

CREATE INDEX idx_cars_brand ON cars(brand);
CREATE INDEX idx_cars_model ON cars(model);
CREATE INDEX idx_cars_year ON cars(year);
CREATE INDEX idx_cars_vin ON cars(vin);

CREATE INDEX idx_sales_part_id ON sales(part_id);
CREATE INDEX idx_sales_customer_id ON sales(customer_id);
CREATE INDEX idx_sales_sale_date ON sales(sale_date);

-- Создаем функцию для поиска запчастей с полным текстом
CREATE OR REPLACE FUNCTION search_parts(search_query TEXT)
RETURNS TABLE (
    id TEXT,
    zapchast_name TEXT,
    category TEXT,
    car_id TEXT,
    condition TEXT,
    status TEXT,
    price DECIMAL,
    description TEXT,
    location TEXT,
    supplier TEXT,
    purchase_date TIMESTAMP,
    purchase_price DECIMAL,
    images TEXT[],
    notes TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.zapchast_name,
        p.category,
        p.car_id,
        p.condition,
        p.status,
        p.price,
        p.description,
        p.location,
        p.supplier,
        p.purchase_date,
        p.purchase_price,
        p.images,
        p.notes,
        p.created_at,
        p.updated_at
    FROM parts p
    LEFT JOIN cars c ON p.car_id = c.id
    WHERE 
        p.zapchast_name ILIKE '%' || search_query || '%'
        OR p.description ILIKE '%' || search_query || '%'
        OR c.brand ILIKE '%' || search_query || '%'
        OR c.model ILIKE '%' || search_query || '%'
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Создаем функцию для получения статистики инвентаря
CREATE OR REPLACE FUNCTION get_inventory_stats()
RETURNS TABLE (
    total_parts BIGINT,
    available_parts BIGINT,
    reserved_parts BIGINT,
    sold_parts BIGINT,
    total_value DECIMAL,
    average_price DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_parts,
        COUNT(*) FILTER (WHERE status = 'available') as available_parts,
        COUNT(*) FILTER (WHERE status = 'reserved') as reserved_parts,
        COUNT(*) FILTER (WHERE status = 'sold') as sold_parts,
        COALESCE(SUM(price), 0) as total_value,
        COALESCE(AVG(price), 0) as average_price
    FROM parts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Создаем функцию для получения статистики автомобилей
CREATE OR REPLACE FUNCTION get_car_stats()
RETURNS TABLE (
    total_cars BIGINT,
    brand_distribution JSONB,
    year_distribution JSONB,
    body_type_distribution JSONB,
    fuel_type_distribution JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_cars,
        jsonb_object_agg(brand, count) as brand_distribution,
        jsonb_object_agg(year::TEXT, count) as year_distribution,
        jsonb_object_agg(body_type, count) as body_type_distribution,
        jsonb_object_agg(fuel_type, count) as fuel_type_distribution
    FROM (
        SELECT 
            brand,
            COUNT(*) as count
        FROM cars 
        GROUP BY brand
    ) brand_stats,
    (
        SELECT 
            year,
            COUNT(*) as count
        FROM cars 
        GROUP BY year
    ) year_stats,
    (
        SELECT 
            body_type,
            COUNT(*) as count
        FROM cars 
        GROUP BY body_type
    ) body_type_stats,
    (
        SELECT 
            fuel_type,
            COUNT(*) as count
        FROM cars 
        GROUP BY fuel_type
    ) fuel_type_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Комментарии к функциям
COMMENT ON FUNCTION search_parts(TEXT) IS 'Функция для поиска запчастей по тексту с учетом связанных автомобилей';
COMMENT ON FUNCTION get_inventory_stats() IS 'Функция для получения статистики инвентаря запчастей';
COMMENT ON FUNCTION get_car_stats() IS 'Функция для получения статистики автомобилей';
