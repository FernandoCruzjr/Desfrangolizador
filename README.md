# Desfrangolizador

**Saia do modo frango.** Dieta flexível, treino de hipertrofia e acompanhamento do corpo em um só app.

Acesse: https://fernandocruzjr.github.io/Desfrangolizador/

Apresentação e como instalar: https://fernandocruzjr.github.io/Desfrangolizador/sobre.html

## O que o app faz

- **Plano sob medida:** gasto basal (Mifflin-St Jeor ou Katch-McArdle), gasto total, meta de +500 kcal para hipertrofia ou −500 kcal para secar, macros e água do dia.
- **Dieta flexível:** mais de 250 alimentos com macros, refeições do dia, troca de alimento grama a grama e suplementos com horário.
- **Treino de hipertrofia:** 45 exercícios por grupo muscular com execução detalhada, fichas prontas (Full body, Push/Pull/Legs, Upper/Lower) e próprias, carga, reps, RPE, descanso cronometrado e gráfico de 1RM.
- **Meu Progresso:** peso com média de 7 dias, medidas guiadas, % de gordura (Marinha dos EUA ou dobras), massa magra, cintura÷quadril e fotos de antes e depois.
- **Lembretes:** refeições, água e suplementos calculados pela hora que você acorda e dorme.
- **Níveis:** Frango → Em Evolução → Atleta → Avançado, conquistas e relatório em PDF.
- **Conta na nuvem (Supabase):** login com e-mail e senha; cada pessoa vê só os próprios dados.
- **Instalável:** funciona como app no celular e sem internet.

## Estrutura

- `index.html`: o app inteiro (gerado a partir de `src/`).
- `manifest.webmanifest`, `sw.js`, `icons/`: instalação e modo offline.
- `vendor/supabase.js`: cliente do Supabase (v2.45.4).
- `src/`: partes do código-fonte.
- `supabase/schema.sql`: tabela `user_docs` com RLS.
- `supabase/community.sql`: Comunidade (perfis, posts, curtidas, comentários, seguir, bloquear, denúncias e moderação) com RLS e o bucket `media` para fotos.
