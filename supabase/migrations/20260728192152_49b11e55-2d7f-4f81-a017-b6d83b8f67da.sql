
-- Seed catalog for a newly created store
CREATE OR REPLACE FUNCTION public.seed_store_catalog(_store_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cat_esp UUID;
  cat_acomp UUID;
  cat_beb UUID;
BEGIN
  INSERT INTO public.categories (store_id, name, sort_order) VALUES (_store_id, 'Espetinhos', 1) RETURNING id INTO cat_esp;
  INSERT INTO public.categories (store_id, name, sort_order) VALUES (_store_id, 'Acompanhamentos', 2) RETURNING id INTO cat_acomp;
  INSERT INTO public.categories (store_id, name, sort_order) VALUES (_store_id, 'Bebidas', 3) RETURNING id INTO cat_beb;

  INSERT INTO public.products (store_id, category_id, name, price_cents, is_meat, sort_order) VALUES
    (_store_id, cat_esp, 'Espetinho de Carne', 900, true, 1),
    (_store_id, cat_esp, 'Espetinho de Frango', 900, true, 2),
    (_store_id, cat_esp, 'Espetinho de Frango c/ Bacon', 1000, true, 3),
    (_store_id, cat_esp, 'Espetinho de Linguiça', 900, true, 4),
    (_store_id, cat_esp, 'Espetinho de Coração', 900, true, 5),
    (_store_id, cat_esp, 'Espetinho de Queijo Coalho', 1000, false, 6),
    (_store_id, cat_esp, 'Espetinho de Kafta', 1000, true, 7),
    (_store_id, cat_esp, 'Espetinho de Medalhão', 1200, true, 8);

  INSERT INTO public.products (store_id, category_id, name, price_cents, sort_order) VALUES
    (_store_id, cat_acomp, 'Pão de Alho', 800, 1),
    (_store_id, cat_acomp, 'Farofa', 500, 2),
    (_store_id, cat_acomp, 'Vinagrete', 500, 3),
    (_store_id, cat_acomp, 'Mandioca Frita', 1500, 4);

  INSERT INTO public.products (store_id, category_id, name, price_cents, sort_order) VALUES
    (_store_id, cat_beb, 'Refrigerante Lata', 600, 1),
    (_store_id, cat_beb, 'Água Mineral', 400, 2),
    (_store_id, cat_beb, 'Suco Natural', 800, 3),
    (_store_id, cat_beb, 'Cerveja Long Neck', 1000, 4);
END;
$$;

REVOKE ALL ON FUNCTION public.seed_store_catalog(UUID) FROM PUBLIC, anon, authenticated;

-- Replace handle_new_user: super-admin path OR store_owner + seed
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _store_name TEXT;
  _new_store_id UUID;
BEGIN
  -- Super-admin path: no store, no seed
  IF NEW.email = 'admin@admin.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'super_admin')
      ON CONFLICT (user_id, role) DO NOTHING;
    RETURN NEW;
  END IF;

  _store_name := COALESCE(NEW.raw_user_meta_data->>'store_name', 'Minha Loja');

  INSERT INTO public.stores (owner_user_id, name, subscription_status, trial_ends_at)
  VALUES (NEW.id, _store_name, 'trial', now() + INTERVAL '7 days')
  ON CONFLICT (owner_user_id) DO NOTHING
  RETURNING id INTO _new_store_id;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'store_owner')
    ON CONFLICT (user_id, role) DO NOTHING;

  IF _new_store_id IS NOT NULL THEN
    PERFORM public.seed_store_catalog(_new_store_id);
  END IF;

  RETURN NEW;
END;
$$;
