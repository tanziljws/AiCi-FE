import type {
  AssemblyStep,
  StepOffset,
  StepStateSnapshot,
} from "@/lib/assembly/types";
import {
  RADAR_BASE_STAND_PART_NAME,
  RADAR_BEAM9_PART_NAME,
  RADAR_HEAD_CONTROL_PART_NAME,
  RADAR_HEAD_PART_NAME,
  RADAR_MC_PART_NAME,
  RADAR_PART_PACKS,
  RADAR_PARTS_BY_ID,
  RADAR_STEP_CAMERA_OVERRIDES,
  RADARBOT_1_PART_NAME,
} from "@/lib/assembly/radarLessonContent";
import type {
  RadarLearningStepSpec,
  RadarLessonRuntime,
  RadarStepEnterPreviewRule,
  RadarStepNavigationRule,
  RadarStepRuntimeBehavior,
} from "@/lib/assembly/radarLessonTypes";

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
