-- ============================================
-- Seed Data: Institution Settings
-- Initial configuration for Demo School
-- ============================================
INSERT INTO
    public.institution_settings (
        institution_name,
        total_seats,
        contract_end_date,
        subscription_plan
    )
VALUES
    ('Demo School', 500, CURRENT_DATE, '$49');