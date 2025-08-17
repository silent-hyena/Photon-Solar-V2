import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";



mapboxgl.accessToken =
  "pk.eyJ1IjoiYXl1c2hwYW53YXIiLCJhIjoiY21lYTd6MGRzMHlqMjJtczh2amdsNGdsbyJ9.KJr8aGAW1k3fxbzPdovPcg";

type Props = { setLocation: (coords: number[]) => void };

export default function MapPicker({ setLocation }: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {

    // ✅ Prevent re-init: if map already exists, do nothing
    if (mapRef.current || !mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [77.209, 28.6139],
      zoom: 12,
    });
    mapRef.current = map;

    
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken as string,
      mapboxgl: mapboxgl as unknown as typeof import("mapbox-gl"),
      marker: false,
    });
    map.addControl(geocoder, "top");

    // Search result → place marker & update parent
    geocoder.on("result", (e) => {
      const coords = e.result.geometry.coordinates as [number, number];
      const pos = [coords[1], coords[0]];
      setLocation(pos);

      if (markerRef.current) markerRef.current.remove();
      markerRef.current = new mapboxgl.Marker().setLngLat(coords).addTo(map);
      map.flyTo({ center: coords, zoom: Math.max(map.getZoom(), 12) });
    });

    // Click → place red marker & update parent
    const onClick = (e: mapboxgl.MapMouseEvent ) => {
      const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];

      const pos = [coords[1], coords[0]];
      setLocation(pos);

      if (markerRef.current) markerRef.current.remove();
      markerRef.current = new mapboxgl.Marker({ color: "red" })
        .setLngLat(coords)
        .addTo(map);
    };
    map.on("click", onClick);

    // Cleanup
    return () => {
      map.off("click", onClick);
      map.removeControl(geocoder);
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once



  return <div ref={mapContainerRef} className="mapBox" />;
}
