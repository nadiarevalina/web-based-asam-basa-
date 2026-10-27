export type SampleNature = 'asam_kuat' | 'asam_lemah' | 'netral' | 'basa_lemah' | 'basa_kuat'

export interface ChemicalSample {
  id: string
  name: string
  formula: string
  category: 'sehari-hari' | 'laboratorium'
  approximatePh: number
  nature: SampleNature
  initialColor: string
  description: string
  ionPresent: string
}

export interface IndicatorColorResult {
  colorName: string
  colorHex: string
  paperColorHex?: string
  behaviorNote?: string
}

export interface Indicator {
  id: string
  name: string
  type: 'kertas' | 'sintesis' | 'universal' | 'alami'
  phRange: string
  description: string
  tips: string
  getColorResult: (ph: number) => IndicatorColorResult
}

export interface SimulationRecord {
  id: string
  sampleName: string
  indicatorName: string
  ph: number
  colorName: string
  colorHex: string
  natureLabel: string
  timestamp: string
}

export interface QuizQuestion {
  id: number
  question: string
  options: { key: string; text: string }[]
  correctAnswer: string
  explanation: string
  topic: string
}

export interface PhCalculationStep {
  stepNumber: number
  title: string
  equation: string
  explanation: string
}

export interface PhCalculationResult {
  solutionType: 'asam_kuat' | 'basa_kuat'
  compoundName: string
  molarity: number
  ionFormula: string
  ionConcentration: number
  pOh?: number
  ph: number
  natureLabel: string
  steps: PhCalculationStep[]
}

export interface TopicModule {
  id: string
  title: string
  tagline: string
  badge: string
  description: string
  icon: string
  targetSectionId: string
  keyPoints: string[]
}
