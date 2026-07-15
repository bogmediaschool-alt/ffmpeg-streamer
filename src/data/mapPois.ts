import type { MapPoi } from "../types";

export const dortmundPosition: [number, number] = [51.4896, 7.5511];

export const mapPois: MapPoi[] = [
  {
    id: "hotel-schuren",
    category: "Hotel",
    name: "Hotel Schuren Demo",
    detail: "Quiet stay near Berghofen",
    position: [51.4924, 7.5433],
    distanceKm: 2.4,
    minutes: 7,
  },
  {
    id: "hospital-hoerde",
    category: "Hospital",
    name: "Horde Medical Center",
    detail: "Emergency department",
    position: [51.4868, 7.5139],
    distanceKm: 4.2,
    minutes: 12,
  },
  {
    id: "parking-am-see",
    category: "Parking",
    name: "Lake Parking",
    detail: "Covered parking",
    position: [51.4912, 7.5316],
    distanceKm: 1.6,
    minutes: 5,
  },
  {
    id: "fuel-b236",
    category: "Fuel",
    name: "B236 Fuel Stop",
    detail: "Open 24 hours",
    position: [51.5004, 7.5459],
    distanceKm: 2.9,
    minutes: 8,
  },
  {
    id: "restaurant-emscher",
    category: "Restaurant",
    name: "Emscher Kitchen",
    detail: "Casual dining",
    position: [51.4841, 7.5608],
    distanceKm: 1.9,
    minutes: 6,
  },
];
