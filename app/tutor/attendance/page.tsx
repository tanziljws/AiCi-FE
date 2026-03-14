"use client";

import { useEffect, useMemo, useState } from "react";
import { api, TutorSession } from "@/lib/api";
import { AlertCircle } from "lucide-react";

type AttendanceValue = "Hadir" | "Izin" | "Alpha";

const attendanceOptions: AttendanceValue[] = ["Hadir", "Izin", "Alpha"];
const STORAGE_KEY = "aici_tutor_attendance_v1";

type StoredAttendance = Record<string, Record<string, AttendanceValue>>;

export default function TutorAttendancePage() {
    const [sessions, setSessions] = useState<TutorSession[]>([]);
    const [selectedClassKey, setSelectedClassKey] = useState<string>("");
    const [selectedWeek, setSelectedWeek] = useState<number>(1);
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [sessionError, setSessionError] = useState<string | null>(null);
    const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceValue>>({});

    const classGroups = useMemo(() => {
        const map = new Map<string, { key: string; label: string; sessions: TutorSession[] }>();
        sessions.forEach((session) => {
            const key = [
                session.project ?? "-",
                session.level ?? "-",
                session.room ?? "-",
                session.day_label ?? "-",
                session.time_range ?? "-",
            ].join("|");
            const label = `${session.project ?? "-"} • ${session.level ?? "-"} • ${session.room ?? "-"}`;
            const existing = map.get(key);
            if (existing) {
                existing.sessions.push(session);
            } else {
                map.set(key, { key, label, sessions: [session] });
            }
        });
        return Array.from(map.values());
    }, [sessions]);

    const selectedClass = useMemo(
        () => classGroups.find((group) => group.key === selectedClassKey) ?? null,
        [classGroups, selectedClassKey]
    );

    const weekSessions = useMemo(() => {
        const classSessions = selectedClass?.sessions ?? [];
        const sorted = [...classSessions].sort((a, b) => {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            if (dateA && dateB && dateA !== dateB) return dateA - dateB;
            const meetingA = a.meeting ?? 0;
            const meetingB = b.meeting ?? 0;
            return meetingA - meetingB;
        });
        return sorted.map((session, index) => ({
            week: session.meeting ?? index + 1,
            session,
        }));
    }, [selectedClass?.sessions]);

    const selectedWeekSession = useMemo(() => {
        return weekSessions.find((entry) => entry.week === selectedWeek)?.session ?? weekSessions[0]?.session ?? null;
    }, [selectedWeek, weekSessions]);

    const selectedWeekKey = useMemo(() => {
        return `${selectedClassKey || "class"}::week-${selectedWeek}`;
    }, [selectedClassKey, selectedWeek]);

    useEffect(() => {
        setLoadingSessions(true);
        setSessionError(null);
        api.tutor
            .dashboard()
            .then((response) => {
                if (!response.success || !response.data) {
                    throw new Error(response.message || "Gagal memuat data tutor.");
                }
                const nextSessions = response.data.sessions ?? [];
                setSessions(nextSessions);
                setLoadingSessions(false);
                if (nextSessions.length) {
                    const firstGroup = (() => {
                        const map = new Map<string, { key: string; label: string; sessions: TutorSession[] }>();
                        nextSessions.forEach((session) => {
                            const key = [
                                session.project ?? "-",
                                session.level ?? "-",
                                session.room ?? "-",
                                session.day_label ?? "-",
                                session.time_range ?? "-",
                            ].join("|");
                            const label = `${session.project ?? "-"} • ${session.level ?? "-"} • ${session.room ?? "-"}`;
                            const existing = map.get(key);
                            if (existing) {
                                existing.sessions.push(session);
                            } else {
                                map.set(key, { key, label, sessions: [session] });
                            }
                        });
                        return map.values().next().value ?? null;
                    })();
                    if (firstGroup) {
                        setSelectedClassKey(firstGroup.key);
                        const firstMeeting = firstGroup.sessions[0]?.meeting ?? 1;
                        setSelectedWeek(firstMeeting);
                    }
                }
            })
            .catch(() => {
                setLoadingSessions(false);
                setSessionError("Gagal memuat jadwal tutor.");
            });
    }, []);

    useEffect(() => {
        if (!selectedWeekSession) return;
        const students = selectedWeekSession.students ?? [];

        let stored: StoredAttendance = {};
        try {
            stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as StoredAttendance;
        } catch {
            stored = {};
        }
        const existing = stored[selectedWeekKey] ?? {};

        const nextMap: Record<string, AttendanceValue> = {};
        students.forEach((student) => {
            nextMap[student.name] = existing[student.name] ?? "Hadir";
        });
        setAttendanceMap(nextMap);
    }, [selectedWeekKey, selectedWeekSession]);

    const handleAttendanceChange = (studentName: string, value: AttendanceValue) => {
        setAttendanceMap((prev) => {
            const updated = { ...prev, [studentName]: value };
            let stored: StoredAttendance = {};
            try {
                stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as StoredAttendance;
            } catch {
                stored = {};
            }
            stored[selectedWeekKey] = updated;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
            return updated;
        });
    };

    const students = selectedWeekSession?.students ?? [];
    const weekOptions = useMemo(() => weekSessions.map((entry) => entry.week), [weekSessions]);
    const attendanceSummary = useMemo(() => {
        return students.reduce(
            (acc, student) => {
                const value = attendanceMap[student.name] ?? "Hadir";
                acc[value] += 1;
                return acc;
            },
            { Hadir: 0, Izin: 0, Alpha: 0 } as Record<AttendanceValue, number>
        );
    }, [attendanceMap, students]);

    const historyRows = useMemo(() => {
        let stored: StoredAttendance = {};
        try {
            stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as StoredAttendance;
        } catch {
            stored = {};
        }

        return weekSessions.map((entry) => {
            const key = `${selectedClassKey || "class"}::week-${entry.week}`;
            const map = stored[key] ?? {};
            const summary = Object.values(map).reduce(
                (acc, value) => {
                    acc[value as AttendanceValue] += 1;
                    return acc;
                },
                { Hadir: 0, Izin: 0, Alpha: 0 } as Record<AttendanceValue, number>
            );
            const hasData = Object.keys(map).length > 0;
            return {
                week: entry.week,
                date: entry.session.date ?? "-",
                summary,
                hasData,
            };
        });
    }, [selectedClassKey, weekSessions]);

    useEffect(() => {
        if (!weekOptions.length) return;
        if (!weekOptions.includes(selectedWeek)) {
            setSelectedWeek(weekOptions[0]);
        }
    }, [selectedWeek, weekOptions]);

    return (
        <div className="space-y-8">
            <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary/40">
                    Tutor Tools
                </p>
                <h1 className="text-3xl font-bold text-primary">Absensi Siswa</h1>
                <p className="text-primary/60 mt-2">
                    Pilih kelas, lalu tandai kehadiran siswa.
                </p>
            </div>

            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-8 space-y-4">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">
                            Kelas
                        </label>
                        {classGroups.length > 1 ? (
                            <select
                                value={selectedClassKey}
                                onChange={(e) => setSelectedClassKey(e.target.value)}
                                className="min-w-[260px] w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-semibold text-primary"
                            >
                                {classGroups.length === 0 && <option value="">Belum ada kelas</option>}
                                {classGroups.map((group) => (
                                    <option key={group.key} value={group.key}>
                                        {group.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-semibold text-primary">
                                {classGroups[0]
                                    ? classGroups[0].label
                                    : "Belum ada kelas"}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">
                            Week
                        </label>
                        <select
                            value={selectedWeek}
                            onChange={(e) => setSelectedWeek(Number(e.target.value))}
                            className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-semibold text-primary"
                        >
                            {weekOptions.map((week) => (
                                <option key={week} value={week}>
                                    Week {week}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="h-[50px] bg-white text-primary font-bold px-4 py-3 rounded-2xl border border-gray-200 hover:border-primary/30 transition-all"
                        disabled={loadingSessions}
                    >
                        {loadingSessions ? "Memuat..." : "Refresh"}
                    </button>
                </div>

                {sessionError && (
                    <div className="text-xs font-semibold text-red-500 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {sessionError}
                    </div>
                )}
            </div>

            {selectedWeekSession ? (
                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-8 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/40">
                                Detail Pertemuan
                            </p>
                            <h2 className="mt-2 text-xl font-bold text-primary">
                                Week {selectedWeek} • {selectedWeekSession.project ?? "-"}
                            </h2>
                            <p className="text-sm text-primary/60 mt-2">
                                {selectedWeekSession.day_label ?? "-"} • {selectedWeekSession.time_range ?? "-"} • {selectedWeekSession.room ?? "-"}
                            </p>
                        </div>
                        <div className="text-sm text-primary/70">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/40">
                                Tanggal
                            </p>
                            <p className="mt-2 font-semibold text-primary">
                                {selectedWeekSession.date ?? "-"}
                            </p>
                        </div>
                    </div>
                </div>
            ) : null}

            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-10 space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-primary">Daftar Siswa</h2>
                        <p className="text-primary/50 text-sm">
                            Week {selectedWeek} • Total siswa: {students.length}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs font-semibold">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                            Hadir: {attendanceSummary.Hadir}
                        </span>
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                            Izin: {attendanceSummary.Izin}
                        </span>
                        <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700">
                            Alpha: {attendanceSummary.Alpha}
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-[10px] font-bold text-primary/30 uppercase tracking-[0.2em]">
                            <tr>
                                <th className="px-6 py-4">Nama</th>
                                <th className="px-4 py-4">Week {selectedWeek}</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-semibold text-primary/70">
                            {students.map((student, index) => (
                                <tr key={`${student.name}-${index}`} className="border-b border-gray-100 last:border-none">
                                    <td className="px-6 py-4">{student.name}</td>
                                    <td className="px-4 py-4">
                                        <select
                                            value={attendanceMap[student.name] || "Hadir"}
                                            onChange={(e) =>
                                                handleAttendanceChange(student.name, e.target.value as AttendanceValue)
                                            }
                                            className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm font-semibold text-primary"
                                        >
                                            {attendanceOptions.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            {students.length === 0 && (
                                <tr>
                                    <td className="px-6 py-6 text-sm text-primary/50" colSpan={2}>
                                        Belum ada siswa untuk jadwal ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-8 space-y-4">
                <div>
                    <h2 className="text-xl font-bold text-primary">History Kehadiran</h2>
                    <p className="text-primary/50 text-sm">
                        Rekap kehadiran per minggu untuk kelas ini.
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-[10px] font-bold text-primary/30 uppercase tracking-[0.2em]">
                            <tr>
                                <th className="px-6 py-4">Week</th>
                                <th className="px-4 py-4">Tanggal</th>
                                <th className="px-4 py-4">Hadir</th>
                                <th className="px-4 py-4">Izin</th>
                                <th className="px-4 py-4">Alpha</th>
                                <th className="px-4 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-semibold text-primary/70">
                            {historyRows.map((row) => (
                                <tr key={row.week} className="border-b border-gray-100 last:border-none">
                                    <td className="px-6 py-4">Week {row.week}</td>
                                    <td className="px-4 py-4">{row.date}</td>
                                    <td className="px-4 py-4">{row.summary.Hadir}</td>
                                    <td className="px-4 py-4">{row.summary.Izin}</td>
                                    <td className="px-4 py-4">{row.summary.Alpha}</td>
                                    <td className="px-4 py-4">
                                        {row.hasData ? (
                                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 text-xs font-semibold">
                                                Tersimpan
                                            </span>
                                        ) : (
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-500 text-xs font-semibold">
                                                Belum diisi
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {!historyRows.length && (
                                <tr>
                                    <td className="px-6 py-6 text-sm text-primary/50" colSpan={6}>
                                        Belum ada data history untuk kelas ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
