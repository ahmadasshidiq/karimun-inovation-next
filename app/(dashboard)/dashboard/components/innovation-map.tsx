"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";

import type { DashboardMapPoint } from "../page.config";

const KARIMUN_CENTER: [number, number] = [1.05, 103.4];

const innovationMarker = L.divIcon({
  className: "innovation-map-marker",
  html: '<span class="innovation-map-marker__pulse"></span><span class="innovation-map-marker__dot"></span>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

function FitInnovationBounds({ points }: { points: DashboardMapPoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) {
      map.setView(KARIMUN_CENTER, 9);
      return;
    }

    if (points.length === 1) {
      map.setView([points[0].latitude, points[0].longitude], 13);
      return;
    }

    map.fitBounds(
      L.latLngBounds(points.map((point) => [point.latitude, point.longitude])),
      { padding: [45, 45], maxZoom: 13 },
    );
  }, [map, points]);

  return null;
}

export default function InnovationMap({ points }: { points: DashboardMapPoint[] }) {
  const validPoints = useMemo(
    () =>
      points.filter(
        (point) =>
          Number.isFinite(point.latitude) && Number.isFinite(point.longitude),
      ),
    [points],
  );

  return (
    <MapContainer
      center={KARIMUN_CENTER}
      zoom={9}
      scrollWheelZoom
      className="size-full"
    >
      <TileLayer
        attribution="Tiles &copy; Esri"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />
      <FitInnovationBounds points={validPoints} />
      {validPoints.map((point) => (
        <Marker
          key={point.id}
          position={[point.latitude, point.longitude]}
          icon={innovationMarker}
        >
          <Tooltip direction="top" offset={[0, -12]} opacity={1}>
            <div className="min-w-40 py-0.5">
              <p className="font-semibold text-slate-900">{point.name}</p>
              <p className="mt-0.5 text-xs text-slate-500">{point.institution}</p>
            </div>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
