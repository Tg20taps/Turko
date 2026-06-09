insert into public.categories (name, slug, description, sort_order) values
('Churrascos', 'churrascos', 'Clasicos contundentes con carne, pan fresco y el sello de la casa.', 1),
('Completos', 'completos', 'Completos rapidos, sabrosos y preparados para el antojo.', 2),
('As', 'as', 'El formato callejero que salva cualquier hambre seria.', 3),
('Para compartir', 'para-compartir', 'Porciones grandes para picar entre dos o cuatro.', 4),
('Acompanamientos', 'acompanamientos', 'Extras dorados para cerrar el pedido como corresponde.', 5),
('Bebidas', 'bebidas', 'Bebidas heladas para acompanar el bajon.', 6)
on conflict (slug) do nothing;

-- Los productos iniciales estan en src/data/menu.ts. Puedes importarlos manualmente o crear un script de carga
-- cuando confirmes las imagenes definitivas del local.
