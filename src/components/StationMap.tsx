"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export type MapStation = {
  id: number;
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  status: string;
  pricePerKg: number;
};

const COLOR: Record<string, string> = {
  active: "#0b8a4b",
  maintenance: "#b77816",
  offline: "#b23b2e",
};

export default function StationMap({
  stations,
  userPos,
  center,
  className = "h-[280px] w-full",
}: {
  stations: MapStation[];
  userPos: { lat: number; lng: number } | null;
  center: { lat: number; lng: number };
  className?: string;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leafletRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const layerRef = useRef<any>(null);
  const router = useRouter();

  // init once
  useEffect(() => {
    let cancelled = false;
    let ro: ResizeObserver | null = null;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !elRef.current || mapRef.current) return;
      leafletRef.current = L;
      const map = L.map(elRef.current, { zoomControl: true, attributionControl: true }).setView(
        [center.lat, center.lng],
        11
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);
      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      draw();
      // keep the map sized to its container across responsive layout changes
      if ("ResizeObserver" in window && elRef.current) {
        ro = new ResizeObserver(() => map.invalidateSize());
        ro.observe(elRef.current);
      }
    })();
    return () => {
      cancelled = true;
      if (ro) ro.disconnect();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // redraw markers when stations / user position change
  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stations, userPos]);

  function draw() {
    const L = leafletRef.current;
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!L || !map || !layer) return;
    layer.clearLayers();

    if (userPos) {
      L.circleMarker([userPos.lat, userPos.lng], {
        radius: 7,
        color: "#fff",
        weight: 2,
        fillColor: "#1877a8",
        fillOpacity: 1,
      })
        .addTo(layer)
        .bindPopup("You are here");
      map.setView([userPos.lat, userPos.lng], map.getZoom() < 10 ? 11 : map.getZoom());
    }

    stations.forEach((s) => {
      if (s.latitude == null || s.longitude == null) return;
      const color = COLOR[s.status] ?? COLOR.offline;
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:20px;height:20px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.45)"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 20],
        popupAnchor: [0, -18],
      });
      const marker = L.marker([s.latitude, s.longitude], { icon }).addTo(layer);
      marker.bindPopup(
        `<div style="font-family:system-ui"><b>${s.title}</b><br>${s.address}<br>$${s.pricePerKg}/kg</div>`
      );
      marker.on("click", () => router.push(`/app/stations/${s.id}`));
    });
  }

  return <div ref={elRef} className={`${className} overflow-hidden rounded-xl border border-[--border]`} />;
}
