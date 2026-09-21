import { slugify } from "@/lib/vehicle-utils";
import type {
  BatteryChemistry,
  BodyType,
  DriveType,
  Vehicle,
} from "@/types";

/**
 * CATALOGUE VÉHICULES — POLITIQUE DE DONNÉES
 * ------------------------------------------
 * Les caractéristiques techniques proviennent de la fiche EV Database citée
 * dans `source` (source spécialisée, pas une source constructeur) et ont été
 * relevées le SOURCE_CHECKED_AT. Rien n'a été estimé ni complété à la main :
 * une donnée absente de la source vaut `null` et s'affiche « Non disponible ».
 *
 * - Le prix France n'est pas collecté (les prix publiés par la source sont des
 *   prix néerlandais/allemands, non transposables) : `price` vaut `null`.
 * - La consommation WLTP est conservée uniquement si elle est cohérente avec
 *   capacité utile × autonomie (voir scripts/check-vehicle-data.mjs).
 * - Les garanties véhicule ne sont pas collectées (`warranty: null`).
 *
 * STATUT (V3) : ce fichier est désormais le JEU DE DONNÉES INITIAL (seed) de la
 * base PostgreSQL/Supabase (`npm run db:import`) et le repli de développement
 * quand DATABASE_URL est absente. La source de vérité est la base ; les pages ne
 * l'importent jamais directement : elles passent par `@/data/catalog`.
 */

export const SOURCE_CHECKED_AT = "2026-09-21";
const SOURCE_NAME = "EV Database";
const SOURCE_BASE = "https://ev-database.org/";

const brandNames: Record<string, string> = {
  BYD: "BYD",
  BMW: "BMW",
  MG: "MG",
  Cupra: "CUPRA",
};

/** Ligne du catalogue : ordre positionnel documenté par `Row`. */
type Row = [
  brand: string,
  model: string,
  version: string,
  years: string,
  body: BodyType,
  drive: DriveType,
  chemistry: BatteryChemistry | null,
  batteryGross: number | null,
  batteryUsable: number,
  rangeWltp: number,
  consumptionWhKm: number | null,
  powerKw: number,
  powerPs: number,
  torque: number | null,
  acc0to100: number | null,
  topSpeed: number | null,
  chargingAC: number,
  chargingDC: number | null,
  dc10to80: number | null,
  length: number,
  width: number,
  height: number,
  weight: number | null,
  trunk: number | null,
  trunkMax: number | null,
  seats: number,
  batteryWarranty: string | null,
  sourcePath: string,
];

// prettier-ignore
const rows: Row[] = [
  ["Tesla", "Model 3", "RWD", "2026", "berline", "RWD", "LFP", 64, 60, 572, 122, 208, 283, 420, 6.2, 201, 11, 175, 24, 4720, 1850, 1440, 1847, 594, 977, 5, "8 ans / 160 000 km", "car/3740/Tesla-Model-3-RWD"],
  ["Tesla", "Model 3", "Long Range RWD", "2024-2025", "berline", "RWD", "NMC", 78.1, 75, 702, 125, 235, 320, 450, 5.2, 201, 11, 250, 27, 4720, 1849, 1441, 1822, 594, 977, 5, "8 ans / 192 000 km", "car/3034/Tesla-Model-3-Long-Range-RWD"],
  ["Tesla", "Model Y", "RWD", "2025", "SUV", "RWD", "LFP", 64, 60, 500, 139, 220, 299, 420, 5.9, 201, 11, 175, 24, 4790, 1982, 1624, 2003, 854, 2138, 5, "8 ans / 160 000 km", "car/3103/Tesla-Model-Y-RWD"],
  ["Tesla", "Model Y", "Long Range AWD", "2025", "SUV", "AWD", "NMC", 78.1, 75, 568, 153, 378, 514, 493, 4.8, 201, 11, 250, 27, 4790, 1982, 1624, 2072, 854, 2138, 5, "8 ans", "car/3104/Tesla-Model-Y-Long-Range-AWD"],
  ["Renault", "5 E-Tech", "52 kWh 150 ch", "2024-2026", "citadine", "FWD", "NMC", 55, 52, 416, 148, 110, 150, 245, 8.0, 150, 11, 101, 31, 3922, 1808, 1498, 1504, 326, 1000, 5, "8 ans / 160 000 km", "car/2135/Renault-5-E-Tech-52kWh-150hp"],
  ["Renault", "4 E-Tech", "52 kWh 150 ch", "2025-2026", "SUV", "FWD", "NMC", 55, 52, 387, 160, 110, 150, 245, 8.2, 150, 11, 101, 31, 4143, 1796, 1552, 1537, 420, 1405, 5, "8 ans / 160 000 km", "car/3127/Renault-4-E-Tech-52kWh-150hp"],
  ["Renault", "Twingo E-Tech", "27,5 kWh", "2025-2026", "citadine", "FWD", "LFP", 29, 27.5, 263, 122, 60, 82, 175, 12.1, 130, 6.6, 50, 30, 3789, 1720, 1491, 1275, 360, 1000, 4, "8 ans / 160 000 km", "car/3392/Renault-Twingo-E-Tech-275-kWh"],
  ["Renault", "Scénic E-Tech", "EV87 220 ch", "2025-2026", "SUV", "FWD", "NMC", 92, 87, 623, 168, 160, 218, 300, 7.9, 170, 22, 150, 40, 4470, 1864, 1571, 1917, 545, 1670, 5, "8 ans / 160 000 km", "car/3219/Renault-Scenic-E-Tech-EV87-220hp"],
  ["Renault", "Mégane E-Tech", "EV60 220 ch", "2022-2025", "compacte", "FWD", "NMC", 65, 60, 450, 161, 160, 218, 300, 7.4, 160, 22, 129, 33, 4200, 1860, 1505, 1711, 440, 1332, 5, "8 ans / 160 000 km", "car/1521/Renault-Megane-E-Tech-EV60-220hp"],
  ["Citroën", "ë-C3", "Standard Range 44 kWh", "2024-2026", "citadine", "FWD", "LFP", 44, 43.8, 327, 164, 83, 113, 120, 11.5, 132, 7.4, 97, 31, 4015, 1755, 1577, 1491, 310, 1200, 5, "8 ans / 160 000 km", "car/2039/Citroen-e-C3-Standard-Range-44-kWh"],
  ["Citroën", "ë-C3 Aircross", "Extended Range 54 kWh", "2025-2026", "SUV", "FWD", "LFP", 54, 53.5, 401, 160, 83, 113, 125, 13.0, 143, 7.4, 100, 34, 4395, 1795, 1660, 1607, 460, 1600, 5, "8 ans / 160 000 km", "car/3228/Citroen-e-C3-Aircross-Extended-Range-54-kWh"],
  ["Peugeot", "e-208", "50 kWh", "2025-2026", "citadine", "FWD", "NMC", 54, 50.8, 433, null, 115, 154, 260, 8.2, 150, 11, 107, 28, 4055, 1745, 1430, 1530, 309, 1118, 5, "8 ans / 100 000 miles", "uk/car/3223/Peugeot-e-208-50-kWh"],
  ["Peugeot", "e-2008", "54 kWh", "2023-2026", "SUV", "FWD", "NMC", 54, 50.8, 406, null, 115, 154, 261, 9.1, 150, 7.4, 107, 28, 4304, 1775, 1523, 1623, 434, 1467, 5, "8 ans / 100 000 miles", "uk/car/1947/Peugeot-e-2008-54-kWh"],
  ["Peugeot", "e-3008", "97 kWh Long Range", "2024-2026", "SUV", "FWD", "NMC", 102, 96.9, 701, null, 170, 228, 345, 8.7, 171, 11, 160, 32, 4542, 1895, 1641, 2241, 588, 1663, 5, "8 ans / 100 000 miles", "uk/car/2005/Peugeot-e-3008-97-kWh-Long-Range"],
  ["Dacia", "Spring", "Electric 70", "2025-2026", "citadine", "FWD", "LFP", 24.3, 24, 226, 124, 52, 71, 137, 12.3, 125, 6.6, 40, 30, 3701, 1583, 1489, 1070, 308, 1004, 4, "8 ans", "car/3408/Dacia-Spring-Electric-70"],
  ["Fiat", "Grande Panda", "44 kWh", "2024-2026", "citadine", "FWD", "LFP", 44, 43.8, 322, 167, 83, 113, 122, 11.0, 132, 7.4, 97, 31, 3999, 1763, 1570, 1511, 361, 1315, 5, "8 ans / 160 000 km", "car/2251/Fiat-Grande-Panda"],
  ["Fiat", "500e", "Hatchback 42 kWh", "2020-2026", "citadine", "FWD", "NMC", 42, 37.3, 333, 138, 87, 118, 220, 9.0, 150, 11, 85, 25, 3631, 1683, 1529, 1365, 185, 550, 4, "8 ans / 160 000 km", "car/1285/Fiat-500e-Hatchback-42-kWh"],
  ["Opel", "Corsa Electric", "51 kWh", "2023-2025", "citadine", "FWD", "NMC", 51, 48.1, 406, 143, 115, 156, 260, 8.1, 150, 7.4, 100, 28, 4061, 1765, 1435, 1544, 267, 1042, 5, "8 ans / 160 000 km", "car/1942/Opel-Corsa-Electric-51-kWh"],
  ["Opel", "Mokka Electric", "54 kWh", "2024-2026", "SUV", "FWD", "NMC", 54, 50.8, 403, 154, 115, 156, 260, 9.0, 150, 7.4, 107, 28, 4150, 1787, 1534, 1615, 310, 1060, 5, "8 ans / 160 000 km", "car/3051/Opel-Mokka-Electric"],
  ["Ford", "Puma Gen-E", "Gen-E", "2024-2026", "SUV", "FWD", "NMC", 53, 43.6, 376, 131, 124, 169, 290, 8.0, 160, 11, 100, 23, 4214, 1805, 1555, 1563, 523, 1283, 5, "8 ans / 160 000 km", "car/3073/Ford-Puma-Gen-E"],
  ["Ford", "Explorer", "Extended Range RWD", "2024-2026", "SUV", "RWD", "NMC", 82, 77, 602, 139, 210, 286, 545, 6.4, 180, 11, 135, 28, 4468, 1872, 1630, 2090, 536, 1422, 5, "8 ans / 160 000 km", "car/2168/Ford-Explorer-Extended-Range-RWD"],
  ["Volkswagen", "ID.4", "Pro", "2023-2025", "SUV", "RWD", "NMC", 82, 77, 574, 157, 210, 286, 545, 6.7, 180, 11, 175, 28, 4584, 1852, 1631, 2144, 543, 1575, 5, "8 ans / 160 000 km", "car/2028/Volkswagen-ID4-Pro"],
  ["Volkswagen", "ID.7", "86 kWh", "2026", "berline", "RWD", "NMC", 91, 86, 703, 137, 210, 286, null, 6.6, 180, 11, 199, 29, 4961, 1862, 1536, 2227, 532, 1586, 5, "8 ans / 160 000 km", "car/3600/Volkswagen-ID7-86-kWh"],
  ["Škoda", "Elroq", "85", "2024-2026", "SUV", "RWD", "NMC", 82, 77, 573, 152, 210, 286, 545, 6.6, 180, 11, 175, 28, 4488, 1884, 1625, 2115, 470, 1580, 5, "8 ans / 160 000 km", "car/3033/Skoda-Elroq-85"],
  ["Škoda", "Enyaq", "85", "2026", "SUV", "RWD", "NMC", 82, 77, 582, 150, 210, 286, 545, 6.6, 180, 11, 165, 30, 4660, 1879, 1622, 2150, 585, 1710, 5, "8 ans / 160 000 km", "car/3570/Skoda-Enyaq-85"],
  ["Cupra", "Born", "170 kW 79 kWh", "2025-2026", "compacte", "RWD", "NMC", 84, 79, 559, 159, 170, 231, 310, 7.1, 160, 11, 185, 26, 4322, 1809, 1540, 1977, 385, 1267, 5, "8 ans / 160 000 km", "car/3263/CUPRA-Born-170-kW---79-kWh"],
  ["Audi", "Q4 e-tron", "40", "2025-2026", "SUV", "RWD", "NMC", 63, 59, 412, 165, 150, 204, 310, 8.1, 160, 11, 165, 24, 4588, 1865, 1632, 2035, 520, 1490, 5, "8 ans / 160 000 km", "car/3148/Audi-Q4-e-tron-40"],
  ["BMW", "iX1", "eDrive20", "2026", "SUV", "FWD", "NMC", 66.5, 65.2, 516, 142, 150, 204, 250, 8.6, 170, 11, 130, 30, 4500, 1845, 1616, 1940, 490, 1495, 5, "8 ans", "car/3458/BMW-iX1-eDrive20"],
  ["BMW", "i4", "eDrive40", "2025-2026", "berline", "RWD", "NMC", 83.9, 81.3, 613, 149, 250, 340, 430, 5.6, 190, 11, 205, 28, 4783, 1852, 1448, 2120, 470, 1290, 5, "8 ans / 160 000 km", "car/3205/BMW-i4-eDrive40"],
  ["BMW", "iX3", "40", "2026", "SUV", "RWD", "NMC", 87.5, 82.6, 637, 145, 235, 320, 500, 5.9, 200, 11, 300, 21, 4782, 1895, 1635, 2160, 520, 1750, 5, "8 ans / 160 000 km", "car/3505/BMW-iX3-40"],
  ["Mercedes-Benz", "CLA", "250+", "2025-2026", "berline", "RWD", "NMC", 90, 85, 792, 123, 200, 272, 335, 6.7, 210, 11, 353, 18, 4723, 1855, 1468, 2055, 405, null, 5, "8 ans / 160 000 km", "car/3139/Mercedes-Benz-CLA-250plus"],
  ["Mercedes-Benz", "GLA", "250+", "2026", "SUV", "RWD", "NMC", 90, 85, 657, 151, 200, 272, 335, 7.3, 210, 11, 353, 18, 4565, 1873, 1604, 2155, 410, 1400, 5, "8 ans / 160 000 km", "car/3686/Mercedes-Benz-GLA-250plus"],
  ["Hyundai", "Kona Electric", "65 kWh", "2023-2026", "SUV", "FWD", null, 68.5, 65.4, 514, 147, 160, 218, 255, 7.8, 172, 11, 105, 37, 4355, 1825, 1575, 1773, 466, 1300, 5, "8 ans", "car/1830/Hyundai-Kona-Electric-65-kWh"],
  ["Hyundai", "IONIQ 5", "84 kWh RWD", "2024-2026", "SUV", "RWD", "NMC", 84, 80, 570, 160, 168, 228, 350, 7.5, 185, 11, 263, 18, 4655, 1890, 1605, 2060, 520, 1580, 5, "8 ans / 160 000 km", "car/2236/Hyundai-IONIQ-5-84-kWh-RWD"],
  ["Hyundai", "INSTER", "Long Range", "2024-2026", "SUV", "FWD", "NMC", 49, 46, 370, 149, 85, 116, 147, 10.6, 150, 11, 85, 29, 3825, 1610, 1575, 1410, 351, 1059, 4, "8 ans / 160 000 km", "car/2231/Hyundai-INSTER-Long-Range"],
  ["Kia", "EV3", "Long Range", "2025-2026", "SUV", "FWD", "NMC", 81.4, 78, 605, 149, 150, 204, 283, 7.7, 170, 11, 135, 33, 4300, 1850, 1560, 1885, 460, 1251, 5, "7 ans / 150 000 km", "car/2212/Kia-EV3-Long-Range"],
  ["Kia", "EV6", "Long Range AWD", "2024-2026", "SUV", "AWD", "NMC", 84, 80, 546, 170, 239, 325, 605, 5.2, 188, 11, 263, 17, 4695, 1880, 1575, 2160, 490, 1290, 5, "7 ans", "car/3029/Kia-EV6-Long-Range-AWD"],
  ["Volvo", "EX30", "Single Motor Extended Range", "2023-2026", "SUV", "RWD", "NMC", 69, 65, 476, 170, 200, 272, 343, 5.3, 180, 11, 158, 28, 4233, 1837, 1549, 1850, 318, 904, 5, "8 ans", "car/1910/Volvo-EX30-Single-Motor-ER"],
  ["Volvo", "EX40", "P5 Long Range", "2026", "SUV", "RWD", "NMC", 82, 79, 576, 166, 185, 252, 420, 7.3, 180, 11, 207, 32, 4440, 1863, 1651, 2075, 410, 1400, 5, "8 ans", "car/3732/Volvo-EX40-P5-Long-Range"],
  ["BYD", "Dolphin Surf", "43,2 kWh Comfort", "2025-2026", "citadine", "FWD", "LFP", 46, 43.2, 310, 160, 115, 156, 220, 9.1, 150, 11, 85, 32, 3990, 1720, 1590, 1465, 308, 1037, 4, "8 ans", "car/3195/BYD-DOLPHIN-SURF-432-kWh-Comfort"],
  ["BYD", "Atto 3 Evo", "RWD Design", "2026", "SUV", "RWD", "LFP", 76, 74.8, 510, 164, 230, 313, 380, 5.5, 180, 11, 220, 25, 4455, 1875, 1615, 1955, 490, 1360, 5, "8 ans", "car/3474/BYD-ATTO-3-Evo-RWD-Design"],
  ["BYD", "Seal", "82,5 kWh AWD Excellence", "2023-2026", "berline", "AWD", "LFP", 84, 82.5, 520, 182, 390, 530, 670, 3.8, 180, 11, 150, 36, 4800, 1875, 1460, 2260, 400, 1440, 5, "8 ans ou 250 000 km", "car/2002/BYD-SEAL-825-kWh-AWD-Excellence"],
  ["MG", "MG4", "Urban Comfort Long Range", "2026", "compacte", "FWD", "LFP", 53.9, 52.8, 416, 153, 118, 160, 250, 9.5, 160, 11, 87, 31, 4395, 1842, 1549, 1595, 577, 1364, 5, "8 ans", "car/3471/MG-MG4-Urban-Comfort-Long-Range"],
  ["MG", "MGS5", "EV 64 kWh", "2025-2026", "SUV", "RWD", "NMC", 64, 62.1, 480, 155, 170, 231, 350, 6.3, 190, 6.6, 139, 31, 4476, 1849, 1621, 1755, 453, 1441, 5, "7 ans / 150 000 km", "car/3147/MG-MGS5-EV-64-kWh"],
  ["Nissan", "Leaf", "Extended Range 75 kWh", "2025-2026", "compacte", "FWD", "NMC", 79, 75.1, 624, 137, 160, 218, 355, 7.6, 160, 11, 150, 32, 4350, 1810, 1550, 1956, 437, 1052, 5, "8 ans / 160 000 km", "car/3366/Nissan-LEAF-Extended-Range-75-kWh"],
  ["smart", "#1", "Pro+", "2023-2026", "SUV", "RWD", "NMC", 66, 62, 420, 170, 200, 272, 343, 6.7, 180, 22, 150, 30, 4270, 1822, 1636, 1863, 323, 986, 5, "8 ans", "car/1667/Smart-1"],
  ["Porsche", "Macan", "4 Electric", "2025-2026", "SUV", "AWD", "NMC", 100, 94.9, 611, 178, 300, 408, 650, 5.2, 220, 11, 269, 23, 4784, 1938, 1622, 2405, 540, 1348, 5, "8 ans", "car/3379/Porsche-Macan-4-Electric"],
];

function build(r: Row): Vehicle {
  const [
    brand, model, version, years, bodyType, drive, chemistry,
    batteryGross, batteryUsable, rangeWltp, consumptionWhKm,
    powerKw, powerPs, torque, acc, topSpeed, chargingAC, chargingDC, dc10to80,
    length, width, height, weight, trunk, trunkMax, seats,
    batteryWarranty, sourcePath,
  ] = r;
  const brandSlug = slugify(brand);
  const modelSlug = slugify(model === "#1" ? "smart-1" : model);
  const versionSlug = slugify(version);
  return {
    id: `${brandSlug}-${modelSlug}-${versionSlug}`,
    brand: brandNames[brand] ?? brand,
    brandSlug,
    model,
    modelSlug,
    version,
    versionSlug,
    years,
    bodyType,
    drive,
    chemistry,
    batteryGross,
    batteryUsable,
    rangeWltp,
    consumptionWltp: consumptionWhKm === null ? null : consumptionWhKm / 10,
    powerKw,
    powerPs,
    torque,
    acceleration0to100: acc,
    topSpeed,
    chargingAC,
    chargingDC,
    chargingTime10to80: dc10to80,
    dimensions: { length, width, height },
    weight,
    trunkVolume: trunk,
    trunkVolumeMax: trunkMax,
    seats,
    batteryWarranty,
    warranty: null,
    price: null,
    source: {
      name: SOURCE_NAME,
      url: `${SOURCE_BASE}${sourcePath}`,
      dataType: "specialized",
      lastUpdated: SOURCE_CHECKED_AT,
    },
  };
}

export const vehicles: Vehicle[] = rows.map(build);
