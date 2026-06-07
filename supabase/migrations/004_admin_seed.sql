-- ============================================================
-- Crownport Logistics — Default Admin User Seed
-- Run in Supabase SQL Editor AFTER the schema migrations.
-- Creates a default admin login for the /admin panel.
-- IMPORTANT: Change the password before going to production.
-- ============================================================

-- Create the auth user (requires pgcrypto — enabled in Supabase by default)
DO $$
DECLARE
  admin_id UUID;
BEGIN
  -- Only create if not already exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@crownportlogistics.site') THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change
    ) VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'admin@crownportlogistics.site',
      crypt('CrownAdmin2024!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Admin User"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    )
    RETURNING id INTO admin_id;

    -- Create admin profile
    INSERT INTO public.admin_profiles (id, full_name, email, role, is_active)
    VALUES (admin_id, 'Admin User', 'admin@crownportlogistics.site', 'super_admin', true)
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE 'Admin user created: admin@crownportlogistics.site';
  ELSE
    SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@crownportlogistics.site';

    -- Ensure admin_profile exists
    INSERT INTO public.admin_profiles (id, full_name, email, role, is_active)
    VALUES (admin_id, 'Admin User', 'admin@crownportlogistics.site', 'super_admin', true)
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE 'Admin user already exists.';
  END IF;
END $$;

-- ============================================================
-- Login credentials (stored in .env.local for reference):
--   Email:    admin@crownportlogistics.site
--   Password: CrownAdmin2024!
--   URL:      /auth/login
-- ============================================================
