"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { haversineMiles } from "@/lib/geo";
import StationMap, { type MapStation } from "./StationMap";
import { MapPin, Navigation, Fuel, Star, LocateFixed } from "lucide-react";

type Station = MapStation & { timings: string | null; favorite: boolean };

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  active: { label: "Active", cls: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  maintenance: { label: "Coming soon", cls: "bg-amber-50 text-amber-700 ring-amber-600/20" },
  offline: { label: "Offline", cls: "bg-red-50 text-red-700 ring-red-600/20" },
};

export default function Finder({
  stations,
  center,
}: {
  stations: Station[];
  center: { lat: number; lng: number };
}) {
  const [miles, setMiles] = useState(25);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(true);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocating(false);
      setDenied(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocating(false);
        setDenied(true);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  const withDistance = useMemo(() => {
    const origin = userPos ?? center;
    return stations
      .map((s) => ({
        ...s,
        distance: s.latitude != null ? haversineMiles(origin.lat, origin.lng, s.latitude, s.longitude) : Infinity,
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [stations, userPos, center]);

  const inRange = useMemo(
    () => (userPos ? withDistance.filter((s) => s.distance <= miles) : withDistance),
    [withDistance, miles, userPos]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* remaining-miles control */}
      <div className="rounded-2xl border border-[--border] bg-surface p-4 shadow-card">
        <label className="flex items-center gap-2 text-sm font-medium text-ink-soft">
          <Navigation size={15} className="text-brand-500" /> Remaining miles in your tank
        </label>
        <div className="mt-3 flex items-center gap-3">
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={miles}
            onChange={(e) => setMiles(Number(e.target.value))}
            className="h-2 flex-1 cursor-pointer accent-brand-500"
          />
          <span className="w-16 text-right font-display text-lg font-bold tabular text-ink">{miles} mi</span>
        </div>
        <p className="mt-1 text-xs text-ink-muted">
          We only show stations that can properly fill your tank at your current range.
        </p>
      </div>

      {/* map */}
      <StationMap stations={inRange} userPos={userPos} center={userPos ?? center} />

      {/* location state */}
      {locating && (
        <p className="flex items-center gap-2 text-sm text-ink-muted"><LocateFixed size={15} className="animate-pulse text-brand-500" /> Finding your location…</p>
      )}
      {denied && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Location off — showing all stations near Dayton. Enable location for accurate range filtering.
        </p>
      )}

      {/* list */}
      <div className="flex flex-col gap-2">
        <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
          {userPos ? `${inRange.length} within ${miles} mi` : `${inRange.length} stations`}
        </p>
        {inRange.map((s) => {
          const st = STATUS_LABEL[s.status] ?? STATUS_LABEL.offline;
          return (
            <Link key={s.id} href={`/app/stations/${s.id}`} className="flex items-center gap-3 rounded-xl border border-[--border] bg-surface p-3.5 shadow-card transition hover:shadow-md">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600"><Fuel size={18} /></span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1 truncate font-display text-sm font-semibold text-ink">
                  {s.title}
                  {s.favorite && <Star size={13} className="fill-amber-400 text-amber-400" />}
                </p>
                <p className="flex items-center gap-1 truncate text-xs text-ink-muted"><MapPin size={11} /> {s.address}</p>
              </div>
              <div className="text-right">
                <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${st.cls}`}>{st.label}</span>
                {s.distance !== Infinity && userPos && (
                  <p className="mt-1 font-mono text-[11px] text-ink-muted">{s.distance.toFixed(1)} mi</p>
                )}
              </div>
            </Link>
          );
        })}
        {inRange.length === 0 && (
          <p className="rounded-xl border border-dashed border-[--border] bg-surface px-4 py-6 text-center text-sm text-ink-muted">
            No stations within {miles} miles. Increase your range above.
          </p>
        )}
      </div>
    </div>
  );
}
