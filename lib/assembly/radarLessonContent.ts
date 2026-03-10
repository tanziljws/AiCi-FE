import type { CameraPreset } from "@/lib/assembly/AssemblyScene";
import {
  RADAR_BASE_STAND_PART_NAME,
  RADAR_HEAD_CONTROL_PART_NAME,
  RADARBOT_1_PART_NAME,
  RADAR_HEAD_PART_NAME,
} from "@/lib/assembly/radarStlFallback";
import type {
  RadarGuideImages,
  RadarIntroContent,
  RadarPart,
  RadarPartPack,
} from "@/lib/assembly/radarLessonTypes";

export {
  RADAR_BASE_STAND_PART_NAME,
  RADAR_HEAD_CONTROL_PART_NAME,
  RADARBOT_1_PART_NAME,
  RADAR_HEAD_PART_NAME,
};

export const RADAR_MC_PART_NAME = "radar_step_mc";
export const RADAR_BEAM9_PART_NAME = "radar_step_37";
export const RADAR_TRANSFORM_DEBUG_ENABLED = false;
export const RADAR_REFERENCE_PREVIEW_IMAGE =
  "/learning/radar/guide/radar-right-preview.png";
export const GUIDE_IMAGES: RadarGuideImages = {
  story: "/learning/radar/guide/radar-02.png",
  progressive1: "/learning/radar/guide/guide1.png",
};
export const DEFAULT_MODEL_URL = "/learning/radar/models/radar-assembly.glb";

export const RADAR_INTRO: RadarIntroContent = {
  title: "Sonar Radar",
  description:
    "Bangun modul radar berbasis sensor secara bertahap. Anda akan merakit frame utama, connector tengah, panel samping, dan pengunci akhir sampai struktur radar lengkap dan siap dipelajari lebih lanjut.",
  outcomes: [
    "Kenali urutan assembly part inti dan posisi tiap connector pada struktur radar.",
    "Latih ketelitian membaca orientasi part, arah masuk, dan alignment antar frame.",
    "Gunakan workspace 3D untuk mengikuti step satu per satu sampai assembly final.",
  ],
};

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

export const RADAR_PART_PACKS: RadarPartPack[] = [
  { id: "intro", title: "Intro", startStep: 1, endStep: 1 },
  { id: "base-1", title: "Frame 1", startStep: 2, endStep: 5 },
  { id: "base-2", title: "Frame 2", startStep: 6, endStep: 9 },
  { id: "center-lock", title: "Center Lock", startStep: 10, endStep: 12 },
  { id: "side-panels", title: "Side Panels", startStep: 13, endStep: 15 },
  { id: "mc-core", title: "Main Controller", startStep: 16, endStep: 21 },
  { id: "lower-support", title: "Lower Support", startStep: 22, endStep: 22 },
  { id: "upper-assembly", title: "Upper Assembly", startStep: 23, endStep: 51 },
];

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
