import { geoCircle, geoOrthographic, geoPath } from 'd3-geo';

import { MOON_RADIUS_KM } from '@/lib/moon';

// The Moon's main near-side maria (dark lava plains): centre (selenographic lon, lat) and
// approximate diameter in km. Irregular ones (Procellarum, Frigoris) are approximated by circles.
const MARIA: [string, number, number, number][] = [
  ['Oceanus Procellarum', -57.4, 18.4, 1800],
  ['Mare Imbrium', -15.6, 32.8, 1146],
  ['Mare Serenitatis', 17.5, 28.0, 674],
  ['Mare Tranquillitatis', 31.4, 8.5, 873],
  ['Mare Crisium', 59.1, 17.0, 556],
  ['Mare Fecunditatis', 51.3, -7.8, 840],
  ['Mare Nectaris', 35.5, -15.2, 333],
  ['Mare Nubium', -16.6, -21.3, 715],
  ['Mare Humorum', -38.6, -24.4, 389],
  ['Mare Vaporum', 3.6, 13.3, 245],
  ['Mare Insularum', -30.9, 7.5, 513],
  ['Mare Cognitum', -23.1, -10.0, 376],
  ['Mare Frigoris', -10.0, 56.0, 700],
  ['Mare Frigoris', 20.0, 57.0, 600],
];

const MARIA_GEOJSON = {
  type: 'GeometryCollection' as const,
  geometries: MARIA.map(([, lon, lat, d]) =>
    geoCircle()
      .center([lon, lat])
      .radius(((d / 2 / MOON_RADIUS_KM) * 180) / Math.PI)(),
  ),
};

// The near side as seen from Earth: north up, lunar east (towards Mare Crisium) on the right.
export function moonView(cx: number, cy: number, r: number) {
  const projection = geoOrthographic().scale(r).translate([cx, cy]).rotate([0, 0]).clipAngle(90);
  return {
    maria: geoPath(projection)(MARIA_GEOJSON) ?? '',
    project: (lon: number, lat: number) => projection([lon, lat]),
  };
}
