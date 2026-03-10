import type { CameraPreset } from "@/lib/assembly/AssemblyScene";
import type {
  AssemblyStep,
  StepOffset,
  StepStateSnapshot,
} from "@/lib/assembly/types";

export type RadarPart = {
  id: string;
  code: string;
  name: string;
  qty: number;
  note: string;
  previewBg: string;
  accent: string;
  stlFile: string;
  previewRotation?: [number, number, number];
};

export type RadarLearningStepSpec = {
  partId: RadarPart["id"] | null;
  quantity: number;
  partIndexes: number[];
  customParts?: Array<{
    name: string;
    startOffset?: StepOffset;
    targetOffset?: StepOffset;
    targetPosition?: [number, number, number];
    targetRotation?: [number, number, number];
    disableHighlight?: boolean;
  }>;
  instruction: string;
  hidePartIndexesBeforeStart?: number[];
  hidePartIndexesOnComplete?: number[];
  hidePartNamesOnComplete?: string[];
  partOverrides?: Partial<
    Record<
      number,
      {
        startOffset?: StepOffset;
        targetOffset?: StepOffset;
        targetPosition?: [number, number, number];
        targetRotation?: [number, number, number];
      }
    >
  >;
};

export type RadarStepEnterPreviewRule = {
  hidePartNames?: string[];
  parts: Array<{
    name: string;
    transform: "start" | "final";
  }>;
};

export type RadarStepNavigationRule = {
  skipForwardSteps?: number;
  skipBackwardSteps?: number;
  cameraPresetStepOnNext?: number;
  hidePartNamesBeforeNext?: string[];
};

export type RadarPartPack = {
  id: string;
  title: string;
  startStep: number;
  endStep: number;
};

export type RadarIntroContent = {
  title: string;
  description: string;
  outcomes: string[];
};

export type RadarGuideImages = {
  story: string;
  progressive1: string;
};

export type RadarLessonRuntime = {
  stepSpecs: RadarLearningStepSpec[];
  steps: AssemblyStep[];
  totalSteps: number;
  totalStepsLabel: string;
  stepSequenceSignature: string;
  initialStepState: StepStateSnapshot;
};

export type RadarLessonDerivedState = {
  hasRemainingSteps: boolean;
  upcomingStepNumber: number;
  currentLearningStep: AssemblyStep | null;
  currentLearningSpec: RadarLearningStepSpec | null;
  currentPack: RadarPartPack;
  currentPart: RadarPart | null;
  currentStepQuantity: number;
  currentInstruction: string;
  currentPartEmptyMessage: string;
  desiredWorkspacePreviewSrc: string;
  sequenceProgressPercent: number;
  sequenceHandlePercent: number;
  sequenceMarkers: number[];
};

export type RadarCameraResolutionInput = {
  stepNumber: number;
  currentStepIndex: number;
  currentPartId: RadarPart["id"] | null;
  focusPoints: Array<[number, number, number]>;
};

export type RadarStepRuntimeBehavior = {
  enterPreview: RadarStepEnterPreviewRule | null;
  navigation: RadarStepNavigationRule | null;
};

export type RadarLessonRuntimeFacade = RadarLessonRuntime & {
  intro: RadarIntroContent;
  guideImages: RadarGuideImages;
  referencePreviewImage: string;
  defaultModelUrl: string;
  transformDebugEnabled: boolean;
  parts: RadarPart[];
  partPacks: readonly RadarPartPack[];
  getDebugPartLabel: (partName: string) => string;
  getWorkspacePreviewImage: (stepNumber: number) => string;
  getSceneConfigSignature: (assemblySceneSignature: string) => string;
  getDerivedState: (stepState: StepStateSnapshot) => RadarLessonDerivedState;
  resolveCameraPreset: (
    input: RadarCameraResolutionInput,
  ) => CameraPreset;
  resolveStepRuntimeBehavior: (
    stepNumber: number,
  ) => RadarStepRuntimeBehavior;
};
