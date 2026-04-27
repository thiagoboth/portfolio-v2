import { useScrollStore } from '../store/scrollStore'

/**
 * Hook que retorna opacity, y e pointerEvents para o WRAPPER externo
 * de uma seção, baseado em outProgress e inProgress do scrollStore.
 *
 * Regras:
 *  - Se esta seção É a ativa → mostra normalmente, faz OUT via outProgress
 *  - Se a seção ANTERIOR é a ativa → esta seção faz IN via inProgress
 *  - Senão → invisível (antes ou depois da ativa)
 */
export function useSectionTransition(sectionId: string) {
  const activeSectionId = useScrollStore(s => s.activeSectionId)
  const outProgress     = useScrollStore(s => s.outProgress)
  const inProgress      = useScrollStore(s => s.inProgress)
  const sections        = useScrollStore(s => s.sections)

  // ── Guard: sections not measured yet → show first section, hide others ──
  if (sections.length === 0) {
    const isFirst = sectionId === activeSectionId // 'hero' by default
    return {
      opacity: isFirst ? 1 : 0,
      y: isFirst ? 0 : 40,
      pointerEvents: (isFirst ? 'auto' : 'none') as 'auto' | 'none',
    }
  }

  const idx    = sections.findIndex(s => s.id === sectionId)
  const prevId = idx > 0 ? sections[idx - 1]?.id : null

  let opacity: number
  let y: number

  if (activeSectionId === sectionId) {
    // ── Esta seção É a ativa ──────────────────────────────────────────────────
    // Totalmente visível (opacity 1, y 0) enquanto o usuário lê.
    // Quando entra na zona de transição, outProgress 0→1 faz o fade-out.
    opacity = 1 - outProgress     // 1 → 0
    y       = -40 * outProgress   // 0 → -40px
  } else if (prevId !== null && activeSectionId === prevId) {
    // ── A seção anterior é a ativa e está saindo → esta seção entra ───────────
    // inProgress 0→1 faz o fade-in.
    opacity = inProgress           // 0 → 1
    y       = 40 * (1 - inProgress) // 40px → 0
  } else {
    // ── Alguma outra seção é a ativa ──────────────────────────────────────────
    const activeIdx = sections.findIndex(s => s.id === activeSectionId)
    if (activeIdx >= 0 && activeIdx < idx) {
      // Ainda não chegou nesta seção
      opacity = 0
      y       = 40
    } else {
      // Já passou desta seção
      opacity = 0
      y       = -40
    }
  }

  const pointerEvents: 'auto' | 'none' = opacity > 0.1 ? 'auto' : 'none'

  return { opacity, y, pointerEvents }
}
