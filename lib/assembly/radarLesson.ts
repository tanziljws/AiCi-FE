import type { CameraPreset } from "@/lib/assembly/AssemblyScene";
import type { StepStateSnapshot } from "@/lib/assembly/types";
import {
  DEFAULT_MODEL_URL,
  GUIDE_IMAGES,
  getDebugPartLabel,
  getRadarCameraPreset,
  getWorkspacePreviewImage,
  RADAR_AUTO_CAMERA_OFFSET,
  RADAR_AUTO_CAMERA_STEP_RANGE,
  RADAR_BASE_STAND_PART_NAME,
  RADAR_FIXED_CAMERA_POSITIONS,
  RADAR_INTRO,
  RADAR_PARTS,
  RADAR_PART_PACKS,
  RADAR_PARTS_BY_ID,
  RADAR_REFERENCE_PREVIEW_IMAGE,
  RADAR_STEP_CAMERA_OVERRIDES,
  RADAR_TRANSFORM_DEBUG_ENABLED,
} from "@/lib/assembly/radarLessonContent";
import {
  RADAR_LEARNING_STEP_SPECS,
  RADAR_LESSON_RUNTIME,
  RADAR_STEPS,
  RADAR_STEP_SEQUENCE_SIGNATURE,
  RADAR_TOTAL_STEPS_LABEL,
  resolveRadarStepRuntimeBehavior,
} from "@/lib/assembly/radarLessonSteps";
import type {
  RadarCameraResolutionInput,
  RadarLessonDerivedState,
  RadarLessonRuntimeFacade,
} from "@/lib/assembly/radarLessonTypes";

export * from "@/lib/assembly/radarLessonTypes";
export {
  DEFAULT_MODEL_URL,
  GUIDE_IMAGES,
  getDebugPartLabel,
  getRadarCameraPreset,
  getWorkspacePreviewImage,
  RADAR_AUTO_CAMERA_OFFSET,
  RADAR_AUTO_CAMERA_STEP_RANGE,
  RADAR_BASE_STAND_PART_NAME,
  RADAR_BEAM9_PART_NAME,
  RADAR_FIXED_CAMERA_POSITIONS,
  RADAR_HEAD_CONTROL_PART_NAME,
  RADAR_HEAD_PART_NAME,
  RADAR_INTRO,
  RADAR_MC_PART_NAME,
  RADAR_PARTS,
  RADAR_PART_PACKS,
  RADAR_PARTS_BY_ID,
  RADAR_REFERENCE_PREVIEW_IMAGE,
  RADAR_STEP_CAMERA_OVERRIDES,
  RADAR_TRANSFORM_DEBUG_ENABLED,
  RADARBOT_1_PART_NAME,
} from "@/lib/assembly/radarLessonContent";
export {
  computeRadarStepSequenceSignature,
  createRadarSteps,
  formatRadarPhysicalPartName,
  getRadarPhysicalStartOffset,
  RADAR_FRONT_LOCK_FIXED_PART_INDEXES,
  RADAR_HEAD_CONTROL_PART_INDEXES,
  RADAR_HEAD_HIDE_PART_NAMES,
  RADAR_HEAD_SOURCE_PART_INDEXES,
  RADAR_INITIAL_STEP_STATE,
  RADAR_LEARNING_STEP_SPECS,
  RADAR_LESSON_RUNTIME,
  RADAR_PHASE_ONE_PART_INDEXES,
  RADARBOT_1_HIDE_PART_NAMES,
  RADARBOT_1_SOURCE_PART_INDEXES,
  RADAR_STEP_SEQUENCE_SIGNATURE,
  RADAR_STEPS,
  RADAR_TOTAL_STEPS,
  RADAR_TOTAL_STEPS_LABEL,
  resolveRadarStepRuntimeBehavior,
  validateRadarLessonConfiguration,
} from "@/lib/assembly/radarLessonSteps";

const RADAR_CAMERA_TRANSITION_DURATION = 0.72;

function roundRadarCameraValue(value: number): number {
  return Number(value.toFixed(3));
}

function computeRadarCameraTarget(
  focusPoints: Array<[number, number, number]>,
): [number, number, number] | null {
  if (!focusPoints.length) return null;

  const target = focusPoints.reduce(
    (accumulator, point) => {
      accumulator[0] += point[0];
      accumulator[1] += point[1];
      accumulator[2] += point[2];
      return accumulator;
    },
    [0, 0, 0] as [number, number, number],
  );

  const count = focusPoints.length;
  target[0] /= count;
  target[1] /= count;
  target[2] /= count;

  return [
    roundRadarCameraValue(target[0]),
    roundRadarCameraValue(target[1] + 0.02),
    roundRadarCameraValue(target[2]),
  ];
}

export function resolveRadarCameraPreset({
  stepNumber,
  currentStepIndex,
  currentPartId,
  focusPoints,
}: RadarCameraResolutionInput): CameraPreset {
  const fallbackPreset = getRadarCameraPreset(stepNumber);
  const stepCameraOverride = RADAR_STEP_CAMERA_OVERRIDES.get(stepNumber) ?? null;
  const computedTarget =
    computeRadarCameraTarget(focusPoints) ?? fallbackPreset.target;

  if (stepCameraOverride) {
    return {
      position: stepCameraOverride.position,
      target: stepCameraOverride.target ?? computedTarget,
      duration: RADAR_CAMERA_TRANSITION_DURATION,
    };
  }

  if (
    stepNumber < RADAR_AUTO_CAMERA_STEP_RANGE.start ||
    stepNumber > RADAR_AUTO_CAMERA_STEP_RANGE.end ||
    !focusPoints.length
  ) {
    return fallbackPreset;
  }

  if (currentPartId === "fixed") {
    const fixedOccurrenceIndex =
      RADAR_LEARNING_STEP_SPECS.slice(0, currentStepIndex + 1).filter(
        (step) => step.partId === "fixed",
      ).length - 1;
    const fixedCameraPreset =
      RADAR_FIXED_CAMERA_POSITIONS[fixedOccurrenceIndex] ?? null;

    if (fixedCameraPreset) {
      return {
        position: fixedCameraPreset.position,
        target: fixedCameraPreset.target ?? computedTarget,
        duration: RADAR_CAMERA_TRANSITION_DURATION,
      };
    }
  }

  return {
    position: [
      roundRadarCameraValue(computedTarget[0] + RADAR_AUTO_CAMERA_OFFSET[0]),
      roundRadarCameraValue(computedTarget[1] + RADAR_AUTO_CAMERA_OFFSET[1]),
      roundRadarCameraValue(computedTarget[2] + RADAR_AUTO_CAMERA_OFFSET[2]),
    ],
    target: computedTarget,
    duration: RADAR_CAMERA_TRANSITION_DURATION,
  };
}

export const radarLessonRuntime: RadarLessonRuntimeFacade = {
  ...RADAR_LESSON_RUNTIME,
  intro: RADAR_INTRO,
  guideImages: GUIDE_IMAGES,
  referencePreviewImage: RADAR_REFERENCE_PREVIEW_IMAGE,
  defaultModelUrl: DEFAULT_MODEL_URL,
  transformDebugEnabled: RADAR_TRANSFORM_DEBUG_ENABLED,
  parts: RADAR_PARTS,
  partPacks: RADAR_PART_PACKS,
  getDebugPartLabel,
  getWorkspacePreviewImage,
  getSceneConfigSignature: getRadarSceneConfigSignature,
  getDerivedState: getRadarLessonDerivedState,
  resolveCameraPreset: resolveRadarCameraPreset,
  resolveStepRuntimeBehavior: resolveRadarStepRuntimeBehavior,
};

export function getRadarSceneConfigSignature(
  assemblySceneSignature: string,
): string {
  return `${RADAR_TOTAL_STEPS_LABEL}:${RADAR_STEP_SEQUENCE_SIGNATURE}:${assemblySceneSignature}`;
}

export function getRadarLessonDerivedState(
  stepState: StepStateSnapshot,
): RadarLessonDerivedState {
  const hasRemainingSteps = stepState.currentStepIndex < stepState.totalSteps;
  const upcomingStepNumber = hasRemainingSteps
    ? stepState.currentStepIndex + 1
    : stepState.totalSteps;
  const currentLearningStep = hasRemainingSteps
    ? (RADAR_STEPS[stepState.currentStepIndex] ?? null)
    : null;
  const currentLearningSpec = hasRemainingSteps
    ? (RADAR_LEARNING_STEP_SPECS[stepState.currentStepIndex] ?? null)
    : null;
  const currentPack =
    RADAR_PART_PACKS.find(
      (pack) =>
        upcomingStepNumber >= pack.startStep &&
        upcomingStepNumber <= pack.endStep,
    ) ?? RADAR_PART_PACKS[RADAR_PART_PACKS.length - 1];
  const currentPart = currentLearningSpec?.partId
    ? (RADAR_PARTS_BY_ID.get(currentLearningSpec.partId) ?? null)
    : null;
  const currentStepQuantity = currentLearningSpec?.quantity ?? 0;
  const currentInstruction =
    currentLearningStep?.instruction ??
    "Assembly selesai. Semua part sudah ditempatkan.";
  const currentPartEmptyMessage = hasRemainingSteps
    ? currentLearningSpec?.hidePartNamesOnComplete?.includes(
          RADAR_BASE_STAND_PART_NAME,
        )
      ? "Subassembly radarbot_1 sedang disiapkan supaya fokus pindah ke komponen akhir."
      : "Belum ada part yang dimunculkan. Tekan Next untuk mulai dari MC."
    : "Semua part sudah selesai ditempatkan.";
  const desiredWorkspacePreviewSrc =
    getWorkspacePreviewImage(upcomingStepNumber);
  const sequenceProgressPercent =
    stepState.totalSteps <= 1
      ? 0
      : (Math.max(upcomingStepNumber - 1, 0) / (stepState.totalSteps - 1)) *
        100;
  const sequenceHandlePercent = Math.min(
    98,
    Math.max(2, sequenceProgressPercent),
  );
  const sequenceMarkers = RADAR_PART_PACKS.slice(0, -1).map(
    (pack) => (pack.endStep / stepState.totalSteps) * 100,
  );

  return {
    hasRemainingSteps,
    upcomingStepNumber,
    currentLearningStep,
    currentLearningSpec,
    currentPack,
    currentPart,
    currentStepQuantity,
    currentInstruction,
    currentPartEmptyMessage,
    desiredWorkspacePreviewSrc,
    sequenceProgressPercent,
    sequenceHandlePercent,
    sequenceMarkers,
  };
}
