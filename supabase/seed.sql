-- Insertar categorías
insert into public.categories (name, slug, description, sort_order) values
('Churrascos', 'churrascos', 'Sándwiches contundentes, pan dorado y carne caliente con el sello de la casa.', 1),
('Completos', 'completos', 'Clásicos rápidos, cremosos y bien cargados para resolver el antojo.', 2),
('As', 'as', 'Formato callejero, sabroso y directo para comer sin vueltas.', 3),
('Para compartir', 'para-compartir', 'Porciones grandes para la mesa, pensadas para dos o cuatro personas.', 4),
('Acompañamientos', 'acompanamientos', 'Papas y extras calientes para cerrar el pedido como corresponde.', 5),
('Salsas y extras', 'aderezos', 'Aderezos útiles para personalizar el pedido sin complicarlo.', 6),
('Bebidas', 'bebidas', 'Bebidas frías para acompañar completos, churrascos y porciones compartidas.', 7)
on conflict (slug) do nothing;

-- Insertar productos iniciales (asociados a sus categorías usando subconsultas de slug)
insert into public.products (category_id, category_slug, name, slug, description, price, image_url, is_available, is_active, is_featured, serves, sort_order) values
((select id from public.categories where slug = 'churrascos'), 'churrascos', 'Churrasco Italiano', 'churrasco-italiano', 'Carne jugosa, palta cremosa, tomate fresco y mayo de la casa en pan dorado.', 7990, '', true, true, true, null, 1),
((select id from public.categories where slug = 'churrascos'), 'churrascos', 'Churrasco Tomate', 'churrasco-tomate', 'Carne caliente y tomate fresco para un sabor simple, limpio y bien armado.', 5990, '', true, true, false, null, 2),
((select id from public.categories where slug = 'churrascos'), 'churrascos', 'Churrasco Palta', 'churrasco-palta', 'Carne sabrosa con una capa generosa de palta molida y textura cremosa.', 6990, '', true, true, false, null, 3),
((select id from public.categories where slug = 'churrascos'), 'churrascos', 'Barros Luco', 'barros-luco', 'Carne caliente y queso fundido en una combinación clásica, simple y ganadora.', 6990, '', true, true, true, null, 4),
((select id from public.categories where slug = 'churrascos'), 'churrascos', 'Chacarero', 'chacarero', 'Carne, tomate, porotos verdes y ají para un clásico chileno con carácter.', 7990, '', true, true, true, null, 5),
((select id from public.categories where slug = 'churrascos'), 'churrascos', 'Chemilico', 'chemilico', 'Churrasco con huevo, contundente y caliente, para cuando el hambre viene seria.', 7990, '', true, true, false, null, 6),
((select id from public.categories where slug = 'completos'), 'completos', 'Completo Italiano', 'completo-italiano', 'Vienesa caliente, palta, tomate y mayo: el clásico que nunca falla.', 3590, '', true, true, true, null, 7),
((select id from public.categories where slug = 'completos'), 'completos', 'Completo Palta', 'completo-palta', 'Vienesa y palta cremosa en una versión sencilla, suave y bien generosa.', 3290, '', true, true, false, null, 8),
((select id from public.categories where slug = 'completos'), 'completos', 'Completo Tomate', 'completo-tomate', 'Vienesa caliente, tomate fresco y mayo suave para pedir algo directo.', 2990, '', true, true, false, null, 9),
((select id from public.categories where slug = 'as'), 'as', 'As Italiano', 'as-italiano', 'Versión callejera con palta, tomate y mayo generosa en pan tostado.', 3990, '', true, true, false, null, 10),
((select id from public.categories where slug = 'as'), 'as', 'As Tomate', 'as-tomate', 'Rápido, fresco y sabroso, ideal para sumar algo rico sin pensarlo demasiado.', 3590, '', true, true, false, null, 11),
((select id from public.categories where slug = 'as'), 'as', 'As Palta', 'as-palta', 'Pan caliente, vienesa y palta molida en una mezcla simple y cremosa.', 3790, '', true, true, false, null, 12),
((select id from public.categories where slug = 'para-compartir'), 'para-compartir', 'Salchipapas para dos', 'salchipapas-para-dos', 'Papas doradas con salchichas, listas para compartir entre dos personas.', 7590, '', true, true, true, 2, 13),
((select id from public.categories where slug = 'para-compartir'), 'para-compartir', 'Chorrillana para dos', 'chorrillana-para-dos', 'Papas, carne y sabor contundente para una mesa chica con hambre real.', 13590, '', true, true, true, 2, 14),
((select id from public.categories where slug = 'para-compartir'), 'para-compartir', 'Salchipapas para cuatro', 'salchipapas-para-cuatro', 'Formato familiar con papas doradas y salchichas para compartir sin quedarse corto.', 15490, '', true, true, false, 4, 15),
((select id from public.categories where slug = 'para-compartir'), 'para-compartir', 'Chorrillana para cuatro', 'chorrillana-para-cuatro', 'La chorrillana grande para el grupo completo, contundente y lista para picar.', 19990, '', true, true, false, 4, 16),
((select id from public.categories where slug = 'acompanamientos'), 'acompanamientos', 'Papas fritas', 'papas-fritas', 'Papas calientes y crocantes, el acompañamiento que siempre levanta el pedido.', 3990, '', true, true, true, null, 17),
((select id from public.categories where slug = 'acompanamientos'), 'acompanamientos', 'Papas con orégano', 'papas-con-oregano', 'Papas doradas con orégano, aromáticas y perfectas para sumar al carrito.', 4890, '', true, true, true, null, 18),
((select id from public.categories where slug = 'aderezos'), 'aderezos', 'Salsa Rikki-Tikki', 'salsa-rikki-tikki', 'Toque de la casa para darle más gracia a papas, completos o churrascos.', 600, '', true, true, false, null, 19),
((select id from public.categories where slug = 'aderezos'), 'aderezos', 'Mayo ajo', 'mayo-ajo', 'Aderezo cremoso con ajo, ideal para untar papas o reforzar el sándwich.', 600, '', true, true, false, null, 20),
((select id from public.categories where slug = 'aderezos'), 'aderezos', 'Ají verde', 'aji-verde', 'Picante fresco y medido para quienes quieren subirle un punto al pedido.', 500, '', true, true, false, null, 21),
((select id from public.categories where slug = 'bebidas'), 'bebidas', 'Bebida 1.5L', 'bebida-15l', 'Botella grande y fría para acompañar pedidos compartidos.', 3500, '', true, true, true, null, 22),
((select id from public.categories where slug = 'bebidas'), 'bebidas', 'Lata 350 cc', 'lata-350cc', 'Lata fría para completar tu sándwich, completo o papas.', 1500, '', true, true, false, null, 23),
((select id from public.categories where slug = 'bebidas'), 'bebidas', 'Lata 220 cc', 'lata-220cc', 'Formato pequeño, rápido y directo para acompañar el antojo.', 800, '', true, true, false, null, 24),
((select id from public.categories where slug = 'bebidas'), 'bebidas', 'Energética', 'energetica', 'Bebida fría con energía extra para acompañar el pedido con algo distinto.', 3000, '', true, true, false, null, 25)
on conflict (slug) do nothing;
