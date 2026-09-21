import "server-only";
import { getAllVehicles } from "@/data/catalog";
import { vehicleTitle } from "@/lib/vehicle-utils";
import { batteryConsumption100, gridConsumption100 } from "@/lib/vehicle-calcs";
import type { VehiclePreset } from "@/components/calculators/kit";

/** Liste compacte des modèles du catalogue, passée aux calculateurs clients. */
export async function getVehiclePresets(): Promise<VehiclePreset[]> {
  return (await getAllVehicles()).map((v) => ({
    id: v.id,
    label: vehicleTitle(v),
    usable: v.batteryUsable,
    batteryConsumption: batteryConsumption100(v),
    gridConsumption: gridConsumption100(v),
    acKw: v.chargingAC,
    dcKw: v.chargingDC,
  }));
}
