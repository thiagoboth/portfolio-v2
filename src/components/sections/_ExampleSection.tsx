/**
 * EXEMPLO — como uma seção deve consumir outProgress / inProgress
 *
 * Copie o padrão abaixo para qualquer seção (Hero, Sobre, Serviços…).
 * As duas animações (OUT e IN) nunca acontecem ao mesmo tempo:
 *   outProgress vai de 0→1 enquanto o usuário sai da seção (primeira metade)
 *   inProgress  vai de 0→1 enquanto a próxima seção entra (segunda metade)
 */

import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useScrollStore } from '../../store/scrollStore'

// ─── Seção de SAÍDA (current section) ────────────────────────────────────────
export function ExampleSectionOut() {
  const outProgress = useScrollStore(s => s.outProgress)

  // outProgress: 0→1 → conteúdo some para cima e some
  const opacity   = 1 - outProgress               // 1 → 0
  const translateY = outProgress * -60             // 0px → -60px

  return (
    <motion.div
      style={{
        opacity,
        y: translateY,
        // willChange garante GPU layer durante a animação
        willChange: 'opacity, transform',
      }}
    >
      {/* conteúdo da seção */}
    </motion.div>
  )
}

// ─── Seção de ENTRADA (next section) ─────────────────────────────────────────
export function ExampleSectionIn() {
  const inProgress = useScrollStore(s => s.inProgress)

  // inProgress: 0→1 → conteúdo sobe de baixo e aparece
  const opacity   = inProgress                     // 0 → 1
  const translateY = (1 - inProgress) * 60         // 60px → 0px

  return (
    <motion.div
      style={{
        opacity,
        y: translateY,
        willChange: 'opacity, transform',
      }}
    >
      {/* conteúdo da seção */}
    </motion.div>
  )
}

// ─── Alternativa com useTransform (mais idiomática no Framer) ────────────────
// Se você preferir usar MotionValue em vez de state do Zustand:
import { useMotionValue as mv, useTransform as ut } from 'framer-motion'

export function ExampleWithMotionValue() {
  // 1. Leia do Zustand como MotionValue customizado
  const rawProgress = useScrollStore(s => s.outProgress)
  const progress = mv(rawProgress)
  progress.set(rawProgress)

  const opacity    = ut(progress, [0, 1], [1, 0])
  const translateY = ut(progress, [0, 1], [0, -60])
  const scale      = ut(progress, [0, 1], [1, 0.95])

  return (
    <motion.section
      style={{ opacity, y: translateY, scale }}
      data-section            // obrigatório para ResizeObserver
      id="nome-da-secao"      // obrigatório para getNextSection()
    >
      {/* conteúdo */}
    </motion.section>
  )
}

// ─── Matemática de referência ─────────────────────────────────────────────────
//
// progress  outProgress  inProgress   O que está acontecendo
// ────────  ───────────  ──────────   ──────────────────────────────────────────
//   0.00        0.00        0.00      Scroll chegou na zona de transição
//   0.25        0.50        0.00      Seção atual em 50% do seu fade-out
//   0.50        1.00        0.00      Seção atual sumiu completamente
//   0.75        1.00        0.50      Próxima seção em 50% do seu fade-in
//   1.00        1.00        1.00      Transição completa, snap vai disparar
