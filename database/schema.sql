CREATE TABLE public.pais (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    nombre text NOT NULL UNIQUE,
    fecha_creacion timestamp
    with
        time zone NOT NULL DEFAULT now(),
        fecha_eliminacion timestamp
    with
        time zone,
        CONSTRAINT pais_pkey PRIMARY KEY (id)
);

CREATE TABLE public.empresa (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    nombre text NOT NULL UNIQUE,
    fecha_creacion timestamp
    with
        time zone NOT NULL DEFAULT now(),
        fecha_eliminacion timestamp
    with
        time zone,
        CONSTRAINT empresa_pkey PRIMARY KEY (id)
);

CREATE TABLE public.filial (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    empresa_id uuid NOT NULL,
    pais_id uuid NOT NULL,
    fecha_creacion timestamp
    with
        time zone NOT NULL DEFAULT now(),
        fecha_eliminacion timestamp
    with
        time zone,
        CONSTRAINT filial_pkey PRIMARY KEY (id),
        CONSTRAINT filial_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresa (id),
        CONSTRAINT filial_pais_id_fkey FOREIGN KEY (pais_id) REFERENCES public.pais (id)
);

CREATE TABLE public.sede (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    filial_id uuid NOT NULL,
    nombre text NOT NULL,
    direccion text NOT NULL,
    fecha_creacion timestamp
    with
        time zone NOT NULL DEFAULT now(),
        fecha_eliminacion timestamp
    with
        time zone,
        CONSTRAINT sede_pkey PRIMARY KEY (id),
        CONSTRAINT sede_filial_id_fkey FOREIGN KEY (filial_id) REFERENCES public.filial (id)
);

CREATE TABLE public.encuesta (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    sede_id uuid NOT NULL,
    fecha_creacion timestamp
    with
        time zone NOT NULL DEFAULT now(),
        CONSTRAINT encuesta_pkey PRIMARY KEY (id),
        CONSTRAINT encuesta_sede_id_fkey FOREIGN KEY (sede_id) REFERENCES public.sede (id)
);

CREATE TABLE public.pregunta (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  texto_pregunta text NOT NULL,
  tipo_respuesta text,
  orden smallint NOT NULL DEFAULT '0'::smallint,
  activo boolean NOT NULL DEFAULT false,
  fecha_creacion timestamp with time zone NOT NULL DEFAULT now(),
  fecha_eliminacion timestamp with time zone,
  CONSTRAINT pregunta_pkey PRIMARY KEY (id),
  CONSTRAINT pregunta_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresa(id)
);

CREATE TABLE public.respuesta (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    pregunta_id uuid NOT NULL,
    encuesta_id uuid NOT NULL,
    valor_respuesta text NOT NULL,
    fecha_creacion timestamp
    with
        time zone NOT NULL DEFAULT now(),
        CONSTRAINT respuesta_pkey PRIMARY KEY (id),
        CONSTRAINT respuesta_pregunta_id_fkey FOREIGN KEY (pregunta_id) REFERENCES public.pregunta (id),
        CONSTRAINT respuesta_encuesta_id_fkey FOREIGN KEY (encuesta_id) REFERENCES public.encuesta (id)
);