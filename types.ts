export enum AnalysisStatus {
  IDLE = 'IDLE',
  GENERATING_PART_1 = 'GENERATING_PART_1',
  GENERATING_PART_2 = 'GENERATING_PART_2',
  GENERATING_PART_3 = 'GENERATING_PART_3',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface SectionContent {
  part1: string;
  part2: string;
  part3: string;
}

export interface PromptConfig {
  topic: string;
}

export const DEFAULT_TOPIC = "六年级小学数学分数四则混合运算";