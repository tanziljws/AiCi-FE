import type { CameraPreset } from "@/lib/assembly/AssemblyScene";
import type {
  AssemblyStep,
  StepOffset,
  StepStateSnapshot,
} from "@/lib/assembly/types";
import {
  RADAR_BASE_STAND_PART_NAME,
  RADAR_HEAD_CONTROL_PART_NAME,
  RADARBOT_1_PART_NAME,
  RADAR_HEAD_PART_NAME,
} from "@/lib/assembly/radarStlFallback";

export {
  RADAR_BASE_STAND_PART_NAME,
  RADAR_HEAD_CONTROL_PART_NAME,
  RADARBOT_1_PART_NAME,
  RADAR_HEAD_PART_NAME,
};

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

export type RadarLessonRuntime = {
  stepSpecs: RadarLearningStepSpec[];
  steps: AssemblyStep[];
  totalSteps: number;
  totalStepsLabel: string;
  stepSequenceSignature: string;
  initialStepState: StepStateSnapshot;
};

export type RadarLessonRuntimeFacade = RadarLessonRuntime & {
  intro: typeof RADAR_INTRO;
  guideImages: typeof GUIDE_IMAGES;
  referencePreviewImage: string;
  defaultModelUrl: string;
  transformDebugEnabled: boolean;
  parts: RadarPart[];
  partPacks: readonly RadarPartPack[];
  getDebugPartLabel: typeof getDebugPartLabel;
  getWorkspacePreviewImage: typeof getWorkspacePreviewImage;
  getSceneConfigSignature: typeof getRadarSceneConfigSignature;
  getDerivedState: typeof getRadarLessonDerivedState;
  resolveCameraPreset: typeof resolveRadarCameraPreset;
  resolveStepRuntimeBehavior: typeof resolveRadarStepRuntimeBehavior;
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

export const RADAR_MC_PART_NAME = "radar_step_mc";
export const RADAR_BEAM9_PART_NAME = "radar_step_37";
export const RADAR_TRANSFORM_DEBUG_ENABLED = false;
export const RADAR_REFERENCE_PREVIEW_IMAGE =
  "/learning/radar/guide/radar-right-preview.png";
export const GUIDE_IMAGES = {
  story: "/learning/radar/guide/radar-02.png",
  progressive1: "/learning/radar/guide/guide1.png",
};
export const DEFAULT_MODEL_URL = "/learning/radar/models/radar-assembly.glb";

export const RADAR_INTRO = {
  title: "Sonar Radar",
  description:
    "Bangun modul radar berbasis sensor secara bertahap. Anda akan merakit frame utama, connector tengah, panel samping, dan pengunci akhir sampai struktur radar lengkap dan siap dipelajari lebih lanjut.",
  outcomes: [
    "Kenali urutan assembly part inti dan posisi tiap connector pada struktur radar.",
    "Latih ketelitian membaca orientasi part, arah masuk, dan alignment antar frame.",
    "Gunakan workspace 3D untuk mengikuti step satu per satu sampai assembly final.",
  ],
};

const RADAR_CAMERA_TRANSITION_DURATION = 0.72;

function roundRadarCameraValue(value: number): number {
  return Number(value.toFixed(3));
}

export function getDebugPartLabel(partName: string): string {
  if (partName === RADAR_MC_PART_NAME) return "MC";
  if (partName === RADAR_BASE_STAND_PART_NAME) return "BASE STAND";
  if (partName === RADAR_HEAD_CONTROL_PART_NAME) return "HEAD CONTROL";
  if (partName === RADARBOT_1_PART_NAME) return "RADARBOT_1";
  if (partName === RADAR_HEAD_PART_NAME) return "RADAR HEAD";
  return partName.replace("radar_step_", "step_");
}

export function getWorkspacePreviewImage(stepNumber: number): string {
  if (stepNumber <= 26) return GUIDE_IMAGES.progressive1;
  return RADAR_REFERENCE_PREVIEW_IMAGE;
}

export const RADAR_PARTS: RadarPart[] = [
  {
    id: "mc",
    code: "MC",
    name: "Main Controller",
    qty: 1,
    note: "Unit kontrol utama radar.",
    previewBg: "bg-[#edf1f4]",
    accent: "#9aa6b2",
    stlFile: "MC.obj",
    previewRotation: [-0.2, 0.62, 0],
  },
  {
    id: "p70",
    code: "P70",
    name: "Frame utama",
    qty: 2,
    note: "Dua frame kuning utama pada inti radar.",
    previewBg: "bg-[#fff1bf]",
    accent: "#d29a00",
    stlFile: "P70_version-1.STL",
    previewRotation: [-0.9, 0.15, 0],
  },
  {
    id: "fixed",
    code: "2780",
    name: "Fixed connector",
    qty: 44,
    note: "Pin merah samping, atas, bawah, tengah, dan lock depan.",
    previewBg: "bg-[#ffe0e0]",
    accent: "#d9485f",
    stlFile: "2780_fixed.stl",
    previewRotation: [0.5, 0.9, -0.25],
  },
  {
    id: "c11",
    code: "C11",
    name: "Konektor tengah",
    qty: 3,
    note: "Connector pusat dan connector tambahan di cluster atas.",
    previewBg: "bg-[#fff1bf]",
    accent: "#d29a00",
    stlFile: "C11.STL",
    previewRotation: [0.45, 0.75, 0],
  },
  {
    id: "s06",
    code: "S06",
    name: "Sensor S06",
    qty: 1,
    note: "Modul sensor S06 di depan cluster C11 dan fixed atas.",
    previewBg: "bg-[#e8f8ff]",
    accent: "#4fb8d3",
    stlFile: "S06.obj",
    previewRotation: [-0.12, 0.55, 0],
  },
  {
    id: "s05",
    code: "S05",
    name: "Sensor S05",
    qty: 2,
    note: "Dua modul S05 di sisi kiri dan kanan depan cluster fixed terakhir.",
    previewBg: "bg-[#e8f8ff]",
    accent: "#35b7d6",
    stlFile: "S05.obj",
    previewRotation: [-0.08, 0.62, 0],
  },
  {
    id: "s03",
    code: "S03",
    name: "Sensor S03",
    qty: 1,
    note: "Modul sensor S03 untuk tahap akhir assembly kepala radar.",
    previewBg: "bg-[#e8f8ff]",
    accent: "#3db3cf",
    stlFile: "S03.obj",
    previewRotation: [-0.08, 0.62, 0],
  },
  {
    id: "p72",
    code: "P72",
    name: "Panel samping",
    qty: 4,
    note: "Panel abu-abu pengapit empat sisi assembly.",
    previewBg: "bg-[#e7edf2]",
    accent: "#708397",
    stlFile: "P72_version-2.STL",
    previewRotation: [0.25, 0.85, 0],
  },
  {
    id: "p34",
    code: "P34",
    name: "Bracket P34",
    qty: 4,
    note: "Penguat bawah dan penguat area atas.",
    previewBg: "bg-[#eef2f6]",
    accent: "#94a3b8",
    stlFile: "P34.STL",
    previewRotation: [-0.6, 0.55, 0.12],
  },
  {
    id: "p35",
    code: "P35",
    name: "Connector P35",
    qty: 2,
    note: "Penghubung tengah untuk cluster atas dan bawah.",
    previewBg: "bg-[#feebec]",
    accent: "#ef4444",
    stlFile: "P35.STL",
    previewRotation: [-0.55, 0.75, 0],
  },
  {
    id: "p36",
    code: "P36",
    name: "Connector P36",
    qty: 1,
    note: "Connector akhir yang dipasang di depan pasangan fixed baru.",
    previewBg: "bg-[#e7efff]",
    accent: "#2563eb",
    stlFile: "P36.STL",
    previewRotation: [-0.55, 0.75, 0],
  },
  {
    id: "c6",
    code: "C6",
    name: "Connector C6",
    qty: 2,
    note: "Pengunci sisi atas kiri dan kanan.",
    previewBg: "bg-[#fff1bf]",
    accent: "#d4a000",
    stlFile: "C6.STL",
    previewRotation: [0.45, 0.7, 0.2],
  },
  {
    id: "s01",
    code: "S01",
    name: "Sensor S01",
    qty: 1,
    note: "Modul S01 untuk tahap assembly akhir setelah bracket P34.",
    previewBg: "bg-[#e8f8ff]",
    accent: "#4fb8d3",
    stlFile: "S01.obj",
    previewRotation: [-0.08, 0.62, 0],
  },
  {
    id: "radar-head",
    code: "R-HEAD",
    name: "Radar Head",
    qty: 1,
    note: "Subassembly kepala radar yang sudah dilas menjadi satu blok.",
    previewBg: "bg-[#e8f8ff]",
    accent: "#4fb8d3",
    stlFile: "S01.obj",
    previewRotation: [-0.08, 0.62, 0],
  },
  {
    id: "servo",
    code: "SERVO",
    name: "Servo Combined",
    qty: 1,
    note: "Modul servo gabungan untuk assembly radar bagian atas.",
    previewBg: "bg-[#eceff3]",
    accent: "#3d434c",
    stlFile: "SERVO_combined.obj",
    previewRotation: [-0.18, 0.62, 0],
  },
  {
    id: "base-stand",
    code: "BASE",
    name: "Base Stand",
    qty: 1,
    note: "Subassembly dasar yang sudah jadi sebagai satu blok utuh.",
    previewBg: "bg-[#eef5ff]",
    accent: "#6e88a6",
    stlFile: "P70_version-1.STL",
    previewRotation: [-0.55, 0.35, 0],
  },
  {
    id: "head-control",
    code: "HEAD",
    name: "Head Control",
    qty: 1,
    note: "Subassembly kepala radar sebagai satu blok utuh.",
    previewBg: "bg-[#eef4ff]",
    accent: "#6e88a6",
    stlFile: "SERVO_combined.obj",
    previewRotation: [-0.1, 0.5, 0],
  },
  {
    id: "c4",
    code: "C4",
    name: "Connector C4",
    qty: 6,
    note: "Connector kanan luar dan puncak assembly.",
    previewBg: "bg-[#fff1bf]",
    accent: "#d4a000",
    stlFile: "C4.STL",
    previewRotation: [0.4, 0.85, 0.1],
  },
  {
    id: "beam9",
    code: "9H",
    name: "Straight beam 9-hole",
    qty: 1,
    note: "Beam depan sebagai pengunci final.",
    previewBg: "bg-[#e7efff]",
    accent: "#2563eb",
    stlFile: "9holes_Straight_Beam_LEGO_Technic.stl",
    previewRotation: [-0.55, 0.72, 0],
  },
];

export const RADAR_PARTS_BY_ID = new Map(
  RADAR_PARTS.map((part) => [part.id, part] as const),
);

export const RADAR_PART_PACKS = [
  { id: "intro", title: "Intro", startStep: 1, endStep: 1 },
  { id: "base-1", title: "Frame 1", startStep: 2, endStep: 5 },
  { id: "base-2", title: "Frame 2", startStep: 6, endStep: 9 },
  { id: "center-lock", title: "Center Lock", startStep: 10, endStep: 12 },
  { id: "side-panels", title: "Side Panels", startStep: 13, endStep: 15 },
  { id: "mc-core", title: "Main Controller", startStep: 16, endStep: 21 },
  { id: "lower-support", title: "Lower Support", startStep: 22, endStep: 22 },
  { id: "upper-assembly", title: "Upper Assembly", startStep: 23, endStep: 51 },
] as const;

export type RadarPartPack = (typeof RADAR_PART_PACKS)[number];

const RADAR_CAMERA_PRESETS: Array<{
  startStep: number;
  endStep: number;
  preset: CameraPreset;
}> = [
  {
    startStep: 1,
    endStep: 15,
    preset: {
      position: [5.8, 4.6, 7.8],
      target: [0, 0.5, 0.42],
      duration: 0.72,
    },
  },
  {
    startStep: 16,
    endStep: 26,
    preset: {
      position: [3.9, 3.4, 4.8],
      target: [0, 1.3, 0.64],
      duration: 0.72,
    },
  },
  {
    startStep: 27,
    endStep: 27,
    preset: {
      position: [-1.32, 1.159, 4.514],
      target: [-1.05, 1.45, 0.55],
      duration: 0.82,
    },
  },
  {
    startStep: 28,
    endStep: 29,
    preset: {
      position: [2.02, 1.059, 2.24],
      target: [-1.05, 1.45, 0.55],
      duration: 0.82,
    },
  },
  {
    startStep: 30,
    endStep: 31,
    preset: {
      position: [0.933, 2.877, 2.239],
      target: [-0.72, 0.98, 0.22],
      duration: 0.82,
    },
  },
  {
    startStep: 32,
    endStep: 50,
    preset: {
      position: [-2.342, 2.146, 3.865],
      target: [-0.72, 0.98, 0.22],
      duration: 0.82,
    },
  },
];

export const RADAR_AUTO_CAMERA_STEP_RANGE = {
  start: 2,
  end: 15,
} as const;

export const RADAR_AUTO_CAMERA_OFFSET: [number, number, number] = [
  2.05,
  1.45,
  2.61,
];

export const RADAR_FIXED_CAMERA_POSITIONS: Array<{
  position: [number, number, number];
  target?: [number, number, number];
}> = [
  { position: [-2.563, 1.914, -1.197] },
  { position: [2.495, 1.769, 2.059] },
  { position: [1.264, 1.792, -2.946] },
  { position: [-2.889, 1.682, 0.312] },
  { position: [2.723, 2.713, 1.694] },
  { position: [2.232, 2.163, 0.935] },
  { position: [0.017, 2.53, -3.675] },
  { position: [-3.635, 2.1, -0.702] },
  {
    position: [-0.484, 2.069, 4.596],
    target: [0, 0.6, 1.59],
  },
  {
    position: [-0.484, 2.069, 4.596],
    target: [0, 0.6, 1.59],
  },
];

export const RADAR_STEP_CAMERA_OVERRIDES = new Map<
  number,
  {
    position: [number, number, number];
    target?: [number, number, number];
  }
>([
  [4, { position: [2.412, 1.596, 1.114], target: [0.45, 0.6, 0.14] }],
  [5, { position: [1.044, 1.585, -2.437], target: [-0.15, 0.55, -0.018] }],
  [7, { position: [-2.556, 1.567, 0.241], target: [-0.095, 0.5, 0.979] }],
  [8, { position: [2.304, 1.356, 1.805], target: [-0.04, 0.39, 0.423] }],
  [9, { position: [-0.575, 1.648, 2.947], target: [0.32, 0.08, 0.489] }],
  [10, { position: [1.859, 2.1, 1.541] }],
  [11, { position: [1.859, 2.1, 1.541] }],
  [12, { position: [1.756, 1.711, 2.057] }],
  [13, { position: [0.744, 1.707, -2.985] }],
  [14, { position: [-3.393, 1.767, 0.048] }],
  [15, { position: [0.651, 2.232, 3.93], target: [0, 0.423, 0.487] }],
  [16, { position: [1.699, 2.812, 3.014], target: [-0.11, 0.59, -0.053] }],
  [17, { position: [1.699, 2.812, 3.014], target: [-0.11, 0.59, -0.053] }],
  [18, { position: [-1.063, 2.096, 2.476], target: [0.22, 1.081, 0.75] }],
  [19, { position: [-1.063, 2.096, 2.476], target: [0.22, 1.081, 0.75] }],
  [20, { position: [1.29, 2.544, -0.251], target: [-0.71, 0.75, 1.125] }],
  [21, { position: [2.254, 2.534, 1.443] }],
  [22, { position: [1.719, 3.078, 1.673], target: [0.38, 1.76, 0.64] }],
  [23, { position: [1.719, 3.078, 1.673], target: [0.38, 1.76, 0.64] }],
  [24, { position: [-1.553, 2.29, -0.576], target: [-0.318, 1.501, 0.528] }],
  [25, { position: [1.596, 2.212, 1.429], target: [0.47, 1.581, 0.527] }],
  [26, { position: [0.568, 2.397, -1.187], target: [-0.16, 1.471, 0.53] }],
  [28, { position: [-1.32, 1.159, 4.514], target: [-1.05, 1.45, 0.55] }],
  [29, { position: [2.02, 1.059, 2.24], target: [-1.05, 1.45, 0.55] }],
  [30, { position: [-0.513, 1.148, 1.847], target: [-1.86, 0.88, 0.53] }],
  [31, { position: [-3.548, 2.793, 2.996], target: [-1.59, 1.16, 0.22] }],
  [32, { position: [-3.548, 2.793, 2.996], target: [-1.59, 1.16, 0.22] }],
  [33, { position: [-1.739, 3.634, 0.037], target: [-2.65, 1.63, 1.77] }],
  [34, { position: [-1.42, 3.449, -1.188], target: [-2.63, 1.76, 0.43] }],
  [35, { position: [-1.42, 3.449, -1.188], target: [-2.63, 1.76, 0.43] }],
  [36, { position: [-3.658, 3.233, -1.387], target: [-2.63, 1.88, 0.1] }],
  [37, { position: [-2.916, 3.49, 1.522], target: [-2.51, 2.32, 0.31] }],
  [39, { position: [1.461, 2.46, -1.1], target: [-0.72, 0.98, 0.22] }],
  [40, { position: [1.461, 2.46, -1.1], target: [-0.72, 0.98, 0.22] }],
  [41, { position: [1.461, 2.46, -1.1], target: [-0.72, 0.98, 0.22] }],
  [42, { position: [1.461, 2.46, -1.1], target: [-0.72, 0.98, 0.22] }],
  [43, { position: [1.503, 3.255, -1.597], target: [-0.72, 0.98, 0.22] }],
  [44, { position: [1.503, 3.255, -1.597], target: [-0.72, 0.98, 0.22] }],
  [45, { position: [-2.434, 3.678, 0.824], target: [-0.72, 0.98, 0.22] }],
  [46, { position: [-2.434, 3.678, 0.824], target: [-0.72, 0.98, 0.22] }],
  [47, { position: [-3.323, 3.209, 1.199], target: [-0.85, 0.95, 0.63] }],
  [48, { position: [-2.278, 4.376, 0.808], target: [-2.02, 1.39, 0.8] }],
  [49, { position: [0.5, 3.224, 1.16], target: [-2.64, -0.11, 0.23] }],
  [50, { position: [0.5, 3.224, 1.16], target: [-2.64, -0.11, 0.23] }],
  [51, { position: [-3.823, 3.308, -2.764], target: [-1.68, 1.24, 0.25] }],
]);

export function getRadarCameraPreset(stepNumber: number): CameraPreset {
  return (
    RADAR_CAMERA_PRESETS.find(
      (entry) => stepNumber >= entry.startStep && stepNumber <= entry.endStep,
    )?.preset ?? {
      position: [5, 4, 7.5],
      target: [0, 0.4, 0.25],
      duration: 0.72,
    }
  );
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

const LEGACY_RADAR_START_OFFSETS: Record<number, StepOffset> = {
  1: { x: -0.78, y: 0.02, z: 0 },
  2: { x: -0.78, y: 0.02, z: 0 },
  3: { x: 0.78, y: 0.02, z: 0 },
  4: { x: 0.78, y: 0.02, z: 0 },
  5: { x: 0, y: 0.02, z: -0.78 },
  6: { x: 0, y: 0.02, z: -0.78 },
  7: { x: 0, y: 0.02, z: -0.78 },
  8: { x: 0, y: 0.02, z: 0.18 },
  9: { x: -0.78, y: 0.02, z: 0 },
  10: { x: -0.78, y: 0.02, z: 0 },
  11: { x: 0.78, y: 0.02, z: 0 },
  12: { x: 0.78, y: 0.02, z: 0 },
  13: { x: 0, y: 0.02, z: 0.78 },
  14: { x: 0, y: 0.02, z: 0.78 },
  15: { x: 0, y: 0.02, z: 0.78 },
  16: { x: 0, y: 0.82, z: 0 },
  17: { x: 0, y: 0.82, z: 0 },
  18: { x: 0, y: 0.82, z: 0 },
  19: { x: 0, y: 0.82, z: 0 },
  20: { x: 0, y: 0.88, z: 0 },
  21: { x: 0, y: 0.02, z: -0.82 },
  22: { x: -0.92, y: 0.02, z: 0 },
  23: { x: 0.92, y: 0.02, z: 0 },
  24: { x: 0, y: 0.02, z: 0.82 },
};

export function formatRadarPhysicalPartName(partIndex: number): string {
  if (partIndex === 0) return RADAR_MC_PART_NAME;
  return `radar_step_${String(partIndex).padStart(2, "0")}`;
}

export function getRadarPhysicalStartOffset(
  partIndex: number,
): StepOffset | undefined {
  if (partIndex === 0) {
    return { x: 0, y: 0.92, z: 0 };
  }

  const legacyOffset = LEGACY_RADAR_START_OFFSETS[partIndex - 1];
  return legacyOffset ? { ...legacyOffset } : undefined;
}

export const RADAR_PHASE_ONE_PART_INDEXES = Array.from(
  { length: 25 },
  (_, index) => index + 1,
);
export const RADAR_HEAD_CONTROL_PART_INDEXES = [
  0, 33, 34, 40, 41, 42, 43, 44, 45, 46,
];
export const RADAR_FRONT_LOCK_FIXED_PART_INDEXES = [66, 67, 68, 69, 70, 71];
export const RADAR_HEAD_SOURCE_PART_INDEXES = [
  29,
  30,
  31,
  32,
  35,
  36,
  37,
  39,
  ...RADAR_FRONT_LOCK_FIXED_PART_INDEXES,
];
export const RADARBOT_1_SOURCE_PART_INDEXES = Array.from(
  { length: 19 },
  (_, index) => index + 47,
);
export const RADAR_HEAD_HIDE_PART_NAMES = RADAR_HEAD_SOURCE_PART_INDEXES.map(
  (partIndex) => formatRadarPhysicalPartName(partIndex),
);
export const RADARBOT_1_HIDE_PART_NAMES = [
  RADARBOT_1_PART_NAME,
  RADAR_BASE_STAND_PART_NAME,
  RADAR_HEAD_CONTROL_PART_NAME,
  ...RADARBOT_1_SOURCE_PART_INDEXES.map((partIndex) =>
    formatRadarPhysicalPartName(partIndex),
  ),
];

export const RADAR_LEARNING_STEP_SPECS: RadarLearningStepSpec[] = [
  {
    partId: null,
    quantity: 0,
    partIndexes: [],
    instruction:
      "Amati workspace awal terlebih dahulu. Semua part masih disembunyikan.",
  },
  {
    partId: "p70",
    quantity: 1,
    partIndexes: [1],
    instruction:
      "Mulai dengan menempatkan frame P70 pertama sebagai dasar assembly radar.",
  },
  {
    partId: "fixed",
    quantity: 2,
    partIndexes: [2, 3],
    instruction:
      "Pasang dua fixed connector sisi kiri pada frame pertama sekaligus.",
  },
  {
    partId: "fixed",
    quantity: 2,
    partIndexes: [4, 5],
    instruction: "Pasang dua fixed connector sisi kanan pada frame pertama.",
  },
  {
    partId: "fixed",
    quantity: 3,
    partIndexes: [6, 7, 8],
    instruction:
      "Lengkapi sisi bawah frame pertama dengan tiga fixed connector.",
  },
  {
    partId: "p70",
    quantity: 1,
    partIndexes: [9],
    instruction:
      "Tambahkan frame P70 kedua dan sejajarkan dengan frame pertama.",
  },
  {
    partId: "fixed",
    quantity: 2,
    partIndexes: [10, 11],
    instruction: "Pasang dua fixed connector sisi kiri pada frame kedua.",
  },
  {
    partId: "fixed",
    quantity: 2,
    partIndexes: [12, 13],
    instruction: "Pasang dua fixed connector sisi kanan pada frame kedua.",
  },
  {
    partId: "fixed",
    quantity: 3,
    partIndexes: [14, 15, 16],
    instruction: "Lengkapi sisi atas frame kedua dengan tiga fixed connector.",
  },
  {
    partId: "fixed",
    quantity: 2,
    partIndexes: [17, 18],
    instruction: "Pasang dua fixed connector tengah pada frame pertama.",
  },
  {
    partId: "fixed",
    quantity: 2,
    partIndexes: [19, 20],
    instruction: "Pasang dua fixed connector tengah pada frame kedua.",
  },
  {
    partId: "c11",
    quantity: 1,
    partIndexes: [21],
    instruction: "Turunkan konektor C11 dari atas ke pusat empat fixed tengah.",
  },
  {
    partId: "p72",
    quantity: 1,
    partIndexes: [22],
    instruction: "Pasang panel P72 bagian bawah sebagai penopang luar pertama.",
  },
  {
    partId: "p72",
    quantity: 2,
    partIndexes: [23, 24],
    instruction:
      "Pasang dua panel P72 samping kiri dan kanan untuk mengapit rangka tengah.",
  },
  {
    partId: "p72",
    quantity: 1,
    partIndexes: [25],
    instruction: "Lengkapi sisi atas dengan satu panel P72 terakhir.",
  },
  {
    partId: "mc",
    quantity: 1,
    partIndexes: [0],
    instruction:
      "Munculkan unit MC utama di atas struktur bawah yang sudah siap.",
    hidePartIndexesBeforeStart: RADAR_PHASE_ONE_PART_INDEXES,
    hidePartIndexesOnComplete: RADAR_PHASE_ONE_PART_INDEXES,
  },
  {
    partId: "mc",
    quantity: 1,
    partIndexes: [0],
    instruction:
      "Flip unit MC agar orientasinya berbalik sebelum support bawah dipasang.",
    partOverrides: {
      0: {
        startOffset: { x: 0, y: 0, z: 0 },
        targetRotation: [Math.PI, Math.PI, 0],
      },
    },
  },
  {
    partId: "c4",
    quantity: 2,
    partIndexes: [33, 34],
    instruction:
      "Munculkan dua connector C4 sejajar di atas MC terlebih dahulu, tanpa dipasang dulu.",
    partOverrides: {
      33: {
        startOffset: { x: 0, y: 0, z: 0 },
        targetPosition: [-0.38, 1.52, 0.54],
      },
      34: {
        startOffset: { x: 0, y: 0, z: 0 },
        targetPosition: [0.38, 1.52, 0.54],
      },
    },
  },
  {
    partId: "c4",
    quantity: 2,
    partIndexes: [33, 34],
    instruction:
      "Dorong dua connector C4 ke depan sampai masuk ke posisi final di atas MC.",
  },
  {
    partId: "c6",
    quantity: 2,
    partIndexes: [40, 41],
    instruction:
      "Munculkan dua connector C6 dari sisi kiri dan kanan terlebih dahulu.",
    partOverrides: {
      40: {
        startOffset: { x: 0, y: 0, z: 0 },
        targetPosition: [-0.95, 1.52, 0.67],
      },
      41: {
        startOffset: { x: 0, y: 0, z: 0 },
        targetPosition: [0.96, 1.52, 0.67],
      },
    },
  },
  {
    partId: "c6",
    quantity: 2,
    partIndexes: [40, 41],
    instruction:
      "Geser dua connector C6 dari sisi kiri dan kanan masuk ke arah tengah.",
  },
  {
    partId: "c4",
    quantity: 2,
    partIndexes: [42, 43],
    instruction:
      "Munculkan dua connector C4 berikutnya di area tengah terlebih dahulu.",
    partOverrides: {
      42: {
        startOffset: { x: 0, y: 0, z: 0 },
        targetPosition: [-0.38, 2.05, 0.49],
      },
      43: {
        startOffset: { x: 0, y: 0, z: 0 },
        targetPosition: [0.38, 2.05, 0.49],
      },
    },
  },
  {
    partId: "c4",
    quantity: 2,
    partIndexes: [42, 43],
    instruction:
      "Geser dua connector C4 dari tengah menuju posisi final di layer atas.",
  },
  {
    partId: "c4",
    quantity: 1,
    partIndexes: [44],
    instruction:
      "Munculkan connector C4 pertama dari tengah lalu geser ke posisi final kiri.",
    partOverrides: {
      44: {
        startOffset: { x: 0.35, y: 0, z: 0 },
      },
    },
  },
  {
    partId: "c4",
    quantity: 1,
    partIndexes: [45],
    instruction:
      "Munculkan connector C4 kedua dari tengah lalu geser ke posisi final kanan.",
    partOverrides: {
      45: {
        startOffset: { x: -0.35, y: 0, z: 0 },
      },
    },
  },
  {
    partId: "servo",
    quantity: 1,
    partIndexes: [46],
    instruction:
      "Turunkan modul SERVO combined ke pusat cluster atas sebagai aktuator utama radar.",
    hidePartIndexesOnComplete: RADAR_HEAD_CONTROL_PART_INDEXES,
    partOverrides: {
      46: {
        startOffset: { x: 0, y: 0, z: 0.71 },
      },
    },
  },
  {
    partId: "base-stand",
    quantity: 1,
    partIndexes: [],
    customParts: [
      {
        name: RADAR_BASE_STAND_PART_NAME,
        startOffset: { x: 0, y: 0, z: 0 },
        disableHighlight: true,
      },
      {
        name: RADAR_HEAD_CONTROL_PART_NAME,
        startOffset: { x: 0, y: 0, z: 0 },
        targetPosition: [0, 1.594, 0.55],
        targetRotation: [0, 0, 3.142],
        disableHighlight: true,
      },
    ],
    instruction:
      "Tampilkan kembali blok BASE STAND, lalu flip HEAD CONTROL sampai orientasinya menghadap arah yang benar.",
  },
  {
    partId: "head-control",
    quantity: 1,
    partIndexes: [],
    instruction:
      "Amati orientasi HEAD CONTROL sebentar sebelum digeser ke kiri.",
  },
  {
    partId: "head-control",
    quantity: 1,
    partIndexes: [],
    customParts: [
      {
        name: RADAR_HEAD_CONTROL_PART_NAME,
        targetPosition: [-2.44, 1.594, 0.55],
        targetRotation: [0, 0, 3.142],
      },
    ],
    instruction:
      "Geser HEAD CONTROL ke kiri sampai sejajar dengan blok BASE STAND.",
  },
  {
    partId: "head-control",
    quantity: 1,
    partIndexes: [],
    instruction:
      "Amati hasil posisi HEAD CONTROL terlebih dahulu sebelum connector C11 mulai ditambahkan.",
  },
  {
    partId: "c11",
    quantity: 2,
    partIndexes: [47, 48],
    instruction:
      "Tambahkan dua connector C11 di dekat cluster MC yang sudah jadi sebagai connector atas tambahan.",
    partOverrides: {
      47: {
        startOffset: { x: 0, y: 0.63, z: 0 },
      },
      48: {
        startOffset: { x: 0, y: 0.63, z: 0 },
      },
    },
  },
  {
    partId: "fixed",
    quantity: 4,
    partIndexes: [49, 50, 51, 52],
    instruction:
      "Tambahkan empat fixed connector di depan dua C11 atas, masing-masing dua connector per sisi.",
    partOverrides: {
      49: {
        startOffset: { x: 0, y: 0, z: 0.46 },
      },
      50: {
        startOffset: { x: 0, y: 0, z: 0.46 },
      },
      51: {
        startOffset: { x: 0, y: 0, z: 0.46 },
      },
      52: {
        startOffset: { x: 0, y: 0, z: 0.46 },
      },
    },
  },
  {
    partId: "s06",
    quantity: 1,
    partIndexes: [53],
    instruction:
      "Tambahkan modul S06 di depan cluster empat fixed atas sebagai komponen sensor berikutnya.",
    partOverrides: {
      53: {
        startOffset: { x: 0, y: 0, z: 0.45 },
      },
    },
  },
  {
    partId: "fixed",
    quantity: 4,
    partIndexes: [54, 55, 56, 57],
    instruction:
      "Tambahkan empat fixed connector berikutnya di depan modul S06, masing-masing dua connector per sisi.",
    partOverrides: {
      54: {
        startOffset: { x: -0.43, y: 0, z: 0 },
      },
      55: {
        startOffset: { x: -0.43, y: 0, z: 0 },
      },
      56: {
        startOffset: { x: 0.36, y: 0, z: 0 },
      },
      57: {
        startOffset: { x: 0.36, y: 0, z: 0 },
      },
    },
  },
  {
    partId: "p35",
    quantity: 2,
    partIndexes: [58, 59],
    instruction:
      "Tambahkan dua connector P35 di depan cluster fixed terbaru sebagai penghubung berikutnya.",
    partOverrides: {
      58: {
        startOffset: { x: 0.45, y: 0, z: 0 },
        targetPosition: [-2.01, 2.16, 0.07],
        targetRotation: [0, 0, 0],
      },
      59: {
        startOffset: { x: -0.46, y: 0, z: 0 },
        targetPosition: [-2.87, 2.16, 0.07],
        targetRotation: [0, 0, 3.142],
      },
    },
  },
  {
    partId: "fixed",
    quantity: 4,
    partIndexes: [60, 61, 62, 63],
    instruction:
      "Tambahkan empat fixed connector di depan dua connector P35 baru, masing-masing dua connector per sisi.",
    partOverrides: {
      60: {
        startOffset: { x: 0, y: 0, z: -0.43 },
        targetPosition: [-1.96, 2.16, -0.08],
        targetRotation: [0, 1.55, 3.142],
      },
      61: {
        startOffset: { x: 0, y: 0, z: -0.43 },
        targetPosition: [-2.15, 2.16, -0.08],
        targetRotation: [0, 1.55, 3.142],
      },
      62: {
        startOffset: { x: 0, y: 0, z: -0.43 },
        targetPosition: [-2.73, 2.16, -0.08],
        targetRotation: [0, 1.55, 3.142],
      },
      63: {
        startOffset: { x: 0, y: 0, z: -0.43 },
        targetPosition: [-2.92, 2.16, -0.08],
        targetRotation: [0, 1.55, 3.142],
      },
    },
  },
  {
    partId: "s05",
    quantity: 2,
    partIndexes: [64, 65],
    partOverrides: {
      64: {
        startOffset: { x: 0, y: 0, z: -0.52 },
        targetPosition: [-2.83, 2.25, -0.21],
        targetRotation: [-1.57, 0, 0],
      },
      65: {
        startOffset: { x: 0, y: 0, z: -0.52 },
        targetPosition: [-2.05, 2.25, -0.21],
        targetRotation: [-1.57, 0, 0],
      },
    },
    instruction:
      "Tambahkan dua modul S05 di sisi kiri dan kanan, tepat di depan cluster fixed terakhir.",
  },
  {
    partId: null,
    quantity: 0,
    partIndexes: [],
    hidePartNamesOnComplete: RADARBOT_1_HIDE_PART_NAMES,
    instruction:
      "Sembunyikan seluruh subassembly yang sudah jadi lalu satukan sebagai blok radarbot_1 agar fokus pindah ke komponen pengunci akhir.",
  },
  {
    partId: "beam9",
    quantity: 1,
    partIndexes: [37],
    partOverrides: {
      37: {
        targetPosition: [0, 1.46, -0.1],
        targetRotation: [1.57, 0, 0],
      },
    },
    instruction: "Pasang beam 9-hole di bagian depan sebagai pengunci utama.",
  },
  {
    partId: "fixed",
    quantity: 6,
    partIndexes: RADAR_FRONT_LOCK_FIXED_PART_INDEXES,
    partOverrides: {
      66: {
        startOffset: { x: 0, y: 0.43, z: 0 },
        targetPosition: [-0.44, 1.52, -0.1],
        targetRotation: [1.57, 1.55, 3.142],
      },
      67: {
        startOffset: { x: 0, y: 0.43, z: 0 },
        targetPosition: [-0.33, 1.52, -0.1],
        targetRotation: [1.57, 1.55, 3.142],
      },
      68: {
        startOffset: { x: 0, y: 0.43, z: 0 },
        targetPosition: [-0.22, 1.52, -0.1],
        targetRotation: [1.57, 1.55, 3.142],
      },
      69: {
        startOffset: { x: 0, y: 0.43, z: 0 },
        targetPosition: [0.22, 1.52, -0.1],
        targetRotation: [1.57, 1.55, 3.142],
      },
      70: {
        startOffset: { x: 0, y: 0.43, z: 0 },
        targetPosition: [0.33, 1.52, -0.1],
        targetRotation: [1.57, 1.55, 3.142],
      },
      71: {
        startOffset: { x: 0, y: 0.43, z: 0 },
        targetPosition: [0.44, 1.52, -0.1],
        targetRotation: [1.57, 1.55, 3.142],
      },
    },
    instruction:
      "Tambahkan enam fixed connector merah di sepanjang beam depan untuk mengunci rangkaian akhir.",
  },
  {
    partId: "p34",
    quantity: 2,
    partIndexes: [29, 39],
    partOverrides: {
      29: {
        startOffset: { x: 0, y: 0.27, z: 0 },
        targetPosition: [-0.5, 1.58, -0.1],
        targetRotation: [0, 3.131, 0],
      },
      39: {
        startOffset: { x: 0, y: 0.27, z: 0 },
        targetPosition: [0.5, 1.58, -0.1],
        targetRotation: [0, -0.011, 0],
      },
    },
    instruction:
      "Pasang dua bracket P34 sebagai pengunci tambahan setelah beam 9-hole terpasang.",
  },
  {
    partId: "s01",
    quantity: 1,
    partIndexes: [30],
    partOverrides: {
      30: {
        startOffset: { x: 0, y: 0.38, z: 0 },
        targetPosition: [0, 1.62, -0.21],
        targetRotation: [0, 0, 0],
      },
    },
    instruction:
      "Pasang modul S01 setelah bracket P34 selesai ditempatkan.",
  },
  {
    partId: "fixed",
    quantity: 4,
    partIndexes: [31, 32, 35, 36],
    partOverrides: {
      31: {
        startOffset: { x: 0, y: 0, z: -0.35 },
        targetPosition: [0.675, 1.58, -0.15],
        targetRotation: [3.14, 1.55, 3.142],
      },
      32: {
        startOffset: { x: 0, y: 0, z: -0.35 },
        targetPosition: [0.555, 1.58, -0.15],
        targetRotation: [3.14, 1.55, 3.142],
      },
      35: {
        startOffset: { x: 0, y: 0, z: -0.35 },
        targetPosition: [-0.555, 1.58, -0.15],
        targetRotation: [3.14, 1.55, 3.142],
      },
      36: {
        startOffset: { x: 0, y: 0, z: -0.35 },
        targetPosition: [-0.675, 1.58, -0.15],
        targetRotation: [3.14, 1.55, 3.142],
      },
    },
    instruction:
      "Tambahkan empat fixed connector merah di sekitar modul S01 sebagai pengunci tahap berikutnya.",
  },
  {
    partId: "radar-head",
    quantity: 1,
    partIndexes: [],
    hidePartNamesOnComplete: RADAR_HEAD_HIDE_PART_NAMES,
    instruction:
      "Amati area final terlebih dahulu sebelum subassembly radar_head dan radarbot_1 ditampilkan.",
  },
  {
    partId: "radar-head",
    quantity: 1,
    partIndexes: [],
    customParts: [
      {
        name: RADARBOT_1_PART_NAME,
        startOffset: { x: 0, y: 0, z: 0 },
        targetPosition: [-1.485, 1.561, 0.653],
        disableHighlight: true,
      },
      {
        name: RADAR_HEAD_PART_NAME,
        startOffset: { x: 0, y: 0, z: 0.48 },
        targetPosition: [-1.474, 2.35, -0.117],
        targetRotation: [0, 0, 0],
      },
    ],
    instruction:
      "Tampilkan kembali subassembly bawah, lalu turunkan radar_head ke posisi final di atas radarbot_1.",
  },
  {
    partId: "radar-head",
    quantity: 1,
    partIndexes: [],
    instruction:
      "Radar_head sudah berada di posisi final di atas radarbot_1. Lanjut ke pengunci berikutnya.",
  },
  {
    partId: "fixed",
    quantity: 2,
    partIndexes: [28, 38],
    partOverrides: {
      28: {
        startOffset: { x: -0.496, y: 0, z: 0 },
        targetPosition: [-2.004, 2.1, 0.543],
        targetRotation: [0, 0, 0],
      },
      38: {
        startOffset: { x: -0.486, y: 0, z: 0 },
        targetPosition: [-2.014, 2.1, 0.923],
        targetRotation: [0, 0, 0],
      },
    },
    instruction:
      "Pasang dua fixed connector merah sebagai pengunci tambahan di area bawah radar head.",
  },
  {
    partId: "s03",
    quantity: 1,
    partIndexes: [26],
    partOverrides: {
      26: {
        startOffset: { x: -0.39, y: 0, z: 0 },
        targetPosition: [-2.11, 2, 0.72],
        targetRotation: [-1.571, 0, 1.57],
      },
    },
    instruction:
      "Tambahkan modul S03 sebagai komponen sensor tahap akhir di area kepala radar.",
  },
  {
    partId: "fixed",
    quantity: 2,
    partIndexes: [72, 73],
    partOverrides: {
      72: {
        startOffset: { x: 0.4, y: 0, z: 0 },
        targetPosition: [-0.95, 2.2, 0.92],
        targetRotation: [-1.571, 0, 3.15],
      },
      73: {
        startOffset: { x: 0.4, y: 0, z: 0 },
        targetPosition: [-0.95, 2.1, 0.92],
        targetRotation: [-1.571, 0, 3.15],
      },
    },
    instruction: "Tambahkan dua fixed connector merah baru di sekitar modul S03.",
  },
  {
    partId: "p36",
    quantity: 1,
    partIndexes: [74],
    partOverrides: {
      74: {
        startOffset: { x: 0.35, y: 0, z: 0 },
        targetPosition: [-0.9, 2.1, 0.97],
        targetRotation: [-1.571, -1.55, 3.15],
      },
    },
    instruction:
      "Tambahkan connector P36 di depan radar_step_73 sebagai pengunci akhir area sensor.",
  },
  {
    partId: null,
    quantity: 0,
    partIndexes: [27],
    partOverrides: {
      27: {
        startOffset: { x: 0, y: 0, z: 0 },
        targetPosition: [0, -20, -0.21],
        targetRotation: [0, 0, 0],
      },
    },
    instruction: "Rapikan alignment akhir setelah semua pengunci utama terpasang.",
  },
];

const RADAR_STEP_ENTER_PREVIEW_RULES = new Map<number, RadarStepEnterPreviewRule>([
  [
    27,
    {
      parts: [
        { name: RADAR_BASE_STAND_PART_NAME, transform: "final" },
        { name: RADAR_HEAD_CONTROL_PART_NAME, transform: "start" },
      ],
    },
  ],
  [
    39,
    {
      parts: [{ name: RADAR_BEAM9_PART_NAME, transform: "start" }],
    },
  ],
  [
    45,
    {
      hidePartNames: RADAR_HEAD_HIDE_PART_NAMES,
      parts: [
        { name: RADARBOT_1_PART_NAME, transform: "final" },
        { name: RADAR_HEAD_PART_NAME, transform: "start" },
      ],
    },
  ],
]);

const RADAR_STEP_NAVIGATION_RULES = new Map<number, RadarStepNavigationRule>([
  [29, { cameraPresetStepOnNext: 30 }],
  [37, { skipForwardSteps: 1 }],
  [39, { skipBackwardSteps: 1 }],
  [
    45,
    {
      hidePartNamesBeforeNext: [
        ...RADAR_HEAD_HIDE_PART_NAMES,
        RADARBOT_1_PART_NAME,
        RADAR_HEAD_PART_NAME,
      ],
    },
  ],
]);

export function resolveRadarStepRuntimeBehavior(
  stepNumber: number,
): RadarStepRuntimeBehavior {
  return {
    enterPreview: RADAR_STEP_ENTER_PREVIEW_RULES.get(stepNumber) ?? null,
    navigation: RADAR_STEP_NAVIGATION_RULES.get(stepNumber) ?? null,
  };
}

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`[radarLesson] ${message}`);
  }
}

function validatePartIndexList(
  stepNumber: number,
  label: string,
  partIndexes: number[] | undefined,
) {
  if (!partIndexes) return;

  const uniquePartIndexes = new Set<number>();
  for (const partIndex of partIndexes) {
    invariant(
      Number.isInteger(partIndex) && partIndex >= 0,
      `Step ${stepNumber} has invalid ${label} part index "${partIndex}".`,
    );
    invariant(
      !uniquePartIndexes.has(partIndex),
      `Step ${stepNumber} defines duplicate ${label} part index "${partIndex}".`,
    );
    uniquePartIndexes.add(partIndex);
  }
}

export function validateRadarLessonConfiguration(
  stepSpecs: RadarLearningStepSpec[] = RADAR_LEARNING_STEP_SPECS,
): void {
  invariant(stepSpecs.length > 0, "Lesson must define at least one step.");

  stepSpecs.forEach((stepSpec, index) => {
    const stepNumber = index + 1;

    invariant(
      stepSpec.partId === null || RADAR_PARTS_BY_ID.has(stepSpec.partId),
      `Step ${stepNumber} references unknown partId "${stepSpec.partId}".`,
    );
    invariant(
      Number.isInteger(stepSpec.quantity) && stepSpec.quantity >= 0,
      `Step ${stepNumber} has invalid quantity "${stepSpec.quantity}".`,
    );
    invariant(
      stepSpec.partId !== null || stepSpec.quantity === 0,
      `Step ${stepNumber} cannot use quantity "${stepSpec.quantity}" without a partId.`,
    );

    validatePartIndexList(stepNumber, "step", stepSpec.partIndexes);
    validatePartIndexList(
      stepNumber,
      "hide-before-start",
      stepSpec.hidePartIndexesBeforeStart,
    );
    validatePartIndexList(
      stepNumber,
      "hide-on-complete",
      stepSpec.hidePartIndexesOnComplete,
    );

    const stepPartIndexSet = new Set(stepSpec.partIndexes);
    Object.keys(stepSpec.partOverrides ?? {}).forEach((partIndexKey) => {
      const partIndex = Number(partIndexKey);

      invariant(
        stepPartIndexSet.has(partIndex),
        `Step ${stepNumber} defines an override for part "${partIndex}" outside partIndexes.`,
      );
    });

    const customPartNames = new Set<string>();
    stepSpec.customParts?.forEach((part, partIndex) => {
      invariant(
        part.name.trim().length > 0,
        `Step ${stepNumber} customParts[${partIndex}] must have a name.`,
      );
      invariant(
        !customPartNames.has(part.name),
        `Step ${stepNumber} defines duplicate custom part "${part.name}".`,
      );
      customPartNames.add(part.name);
    });
  });

  let expectedPackStartStep = 1;
  RADAR_PART_PACKS.forEach((pack) => {
    invariant(
      pack.startStep <= pack.endStep,
      `Pack "${pack.id}" has an invalid step range ${pack.startStep}-${pack.endStep}.`,
    );
    invariant(
      pack.startStep === expectedPackStartStep,
      `Pack "${pack.id}" should start at step ${expectedPackStartStep}, found ${pack.startStep}.`,
    );
    invariant(
      pack.endStep <= stepSpecs.length,
      `Pack "${pack.id}" ends at step ${pack.endStep}, beyond total steps ${stepSpecs.length}.`,
    );

    expectedPackStartStep = pack.endStep + 1;
  });
  invariant(
    expectedPackStartStep === stepSpecs.length + 1,
    `Pack coverage ends at step ${expectedPackStartStep - 1}, expected ${stepSpecs.length}.`,
  );

  RADAR_STEP_CAMERA_OVERRIDES.forEach((_, stepNumber) => {
    invariant(
      stepNumber >= 1 && stepNumber <= stepSpecs.length,
      `Camera override references out-of-range step ${stepNumber}.`,
    );
  });

  RADAR_STEP_ENTER_PREVIEW_RULES.forEach((rule, stepNumber) => {
    invariant(
      stepNumber >= 1 && stepNumber <= stepSpecs.length,
      `Preview rule references out-of-range step ${stepNumber}.`,
    );
    invariant(
      rule.parts.length > 0,
      `Preview rule for step ${stepNumber} must define at least one part.`,
    );
  });

  RADAR_STEP_NAVIGATION_RULES.forEach((rule, stepNumber) => {
    invariant(
      stepNumber >= 1 && stepNumber <= stepSpecs.length,
      `Navigation rule references out-of-range step ${stepNumber}.`,
    );

    if (rule.cameraPresetStepOnNext) {
      invariant(
        rule.cameraPresetStepOnNext >= 1 &&
          rule.cameraPresetStepOnNext <= stepSpecs.length,
        `Navigation rule for step ${stepNumber} references invalid camera preset step ${rule.cameraPresetStepOnNext}.`,
      );
    }

    if (rule.skipForwardSteps) {
      invariant(
        stepNumber + 1 + rule.skipForwardSteps <= stepSpecs.length,
        `Navigation rule for step ${stepNumber} skips beyond the lesson end.`,
      );
    }

    if (rule.skipBackwardSteps) {
      invariant(
        stepNumber - 1 - rule.skipBackwardSteps >= 1,
        `Navigation rule for step ${stepNumber} skips before the lesson start.`,
      );
    }
  });
}

validateRadarLessonConfiguration();

export function createRadarSteps(
  stepSpecs: RadarLearningStepSpec[],
): AssemblyStep[] {
  return stepSpecs.map((stepSpec, index) => {
    const no = String(index + 1).padStart(2, "0");
    const hidePartsOnComplete = [
      ...(stepSpec.hidePartIndexesOnComplete?.map((partIndex) =>
        formatRadarPhysicalPartName(partIndex),
      ) ?? []),
      ...(stepSpec.hidePartNamesOnComplete ?? []),
    ];
    const hidePartsBeforeStart = [
      ...(stepSpec.hidePartIndexesBeforeStart?.map((partIndex) =>
        formatRadarPhysicalPartName(partIndex),
      ) ?? []),
    ];

    return {
      id: `step-${no}`,
      label: `Step ${no}`,
      instruction: stepSpec.instruction,
      hidePartsBeforeStart,
      parts: [
        ...stepSpec.partIndexes.map((partIndex) => {
          const partOverride = stepSpec.partOverrides?.[partIndex];

          return {
            name: formatRadarPhysicalPartName(partIndex),
            startOffset:
              partOverride?.startOffset ??
              getRadarPhysicalStartOffset(partIndex),
            targetOffset: partOverride?.targetOffset,
            targetPosition: partOverride?.targetPosition,
            targetRotation: partOverride?.targetRotation,
          };
        }),
        ...(stepSpec.customParts ?? []).map((part) => ({
          name: part.name,
          startOffset: part.startOffset,
          targetOffset: part.targetOffset,
          targetPosition: part.targetPosition,
          targetRotation: part.targetRotation,
          disableHighlight: part.disableHighlight,
        })),
      ],
      hidePartsOnComplete: hidePartsOnComplete.length
        ? hidePartsOnComplete
        : undefined,
    };
  });
}

export function computeRadarStepSequenceSignature(
  steps: AssemblyStep[],
): string {
  return steps
    .map((step) =>
      [
        step.id,
        step.parts
          .map((part) =>
            [
              part.name,
              part.startOffset?.x ?? 0,
              part.startOffset?.y ?? 0,
              part.startOffset?.z ?? 0,
              part.targetOffset?.x ?? 0,
              part.targetOffset?.y ?? 0,
              part.targetOffset?.z ?? 0,
              part.targetPosition?.join(",") ?? "",
              part.targetRotation?.join(",") ?? "",
            ].join("@"),
          )
          .join(","),
        step.hidePartsOnComplete?.join(",") ?? "",
      ].join("|"),
    )
    .join("::");
}

export const RADAR_STEPS = createRadarSteps(RADAR_LEARNING_STEP_SPECS);
export const RADAR_TOTAL_STEPS = RADAR_STEPS.length;
export const RADAR_TOTAL_STEPS_LABEL = RADAR_TOTAL_STEPS.toString().padStart(
  2,
  "0",
);
export const RADAR_STEP_SEQUENCE_SIGNATURE =
  computeRadarStepSequenceSignature(RADAR_STEPS);
export const RADAR_INITIAL_STEP_STATE: StepStateSnapshot = {
  currentStepIndex: 0,
  totalSteps: RADAR_TOTAL_STEPS,
  isAnimating: false,
};

export const RADAR_LESSON_RUNTIME: RadarLessonRuntime = {
  stepSpecs: RADAR_LEARNING_STEP_SPECS,
  steps: RADAR_STEPS,
  totalSteps: RADAR_TOTAL_STEPS,
  totalStepsLabel: RADAR_TOTAL_STEPS_LABEL,
  stepSequenceSignature: RADAR_STEP_SEQUENCE_SIGNATURE,
  initialStepState: RADAR_INITIAL_STEP_STATE,
};

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
