export interface MarcaCarro {
  marca: string;
  modelos: string[];
}
 
export const CARROS_BRASIL: MarcaCarro[] = [
  {
    marca: 'Chevrolet',
    modelos: ['Onix', 'Onix Plus', 'Tracker', 'Cruze', 'Montana', 'S10', 'Spin', 'Equinox', 'Blazer', 'Trailblazer', 'Trax', 'Cobalt', 'Prisma', 'Agile', 'Celta'],
  },
  {
    marca: 'Fiat',
    modelos: ['Argo', 'Cronos', 'Pulse', 'Fastback', 'Strada', 'Toro', 'Ducato', 'Uno', 'Mobi', 'Palio', 'Grand Siena', 'Bravo', 'Doblo', '500'],
  },
  {
    marca: 'Volkswagen',
    modelos: ['Polo', 'Polo Track', 'Virtus', 'T-Cross', 'Nivus', 'Tiguan', 'Taos', 'Amarok', 'Saveiro', 'Voyage', 'Gol', 'Fox', 'Jetta', 'Passat', 'Golf'],
  },
  {
    marca: 'Toyota',
    modelos: ['Corolla', 'Corolla Cross', 'Yaris', 'Hilux', 'Hilux SW4', 'RAV4', 'Prius', 'Camry', 'Land Cruiser', 'Etios'],
  },
  {
    marca: 'Hyundai',
    modelos: ['HB20', 'HB20S', 'HB20X', 'Creta', 'Tucson', 'Santa Fe', 'Ioniq 5', 'Ioniq 6', 'Kona', 'Azera', 'Veloster'],
  },
  {
    marca: 'Jeep',
    modelos: ['Renegade', 'Compass', 'Commander', 'Wrangler', 'Gladiator', 'Cherokee', 'Grand Cherokee'],
  },
  {
    marca: 'Renault',
    modelos: ['Kwid', 'Sandero', 'Logan', 'Duster', 'Captur', 'Kardian', 'Oroch', 'Master', 'Zoe'],
  },
  {
    marca: 'Honda',
    modelos: ['Civic', 'City', 'City Hatch', 'HR-V', 'WR-V', 'CR-V', 'Accord', 'Fit', 'Brio'],
  },
  {
    marca: 'Ford',
    modelos: ['Ka', 'Ka Sedan', 'EcoSport', 'Ranger', 'Bronco Sport', 'Maverick', 'Territory', 'Fusion', 'Edge', 'Explorer', 'F-150'],
  },
  {
    marca: 'Nissan',
    modelos: ['Kicks', 'Versa', 'Sentra', 'Frontier', 'March', 'Leaf', 'Murano', 'Pathfinder'],
  },
  {
    marca: 'Citroën',
    modelos: ['C3', 'C3 Aircross', 'C4 Cactus', 'Basalt', 'C5 Aircross', 'Jumpy', 'Berlingo'],
  },
  {
    marca: 'Peugeot',
    modelos: ['208', '2008', '3008', '5008', '408', 'Landtrek', 'Expert'],
  },
  {
    marca: 'Mitsubishi',
    modelos: ['L200 Triton', 'Eclipse Cross', 'Outlander', 'ASX', 'Pajero Sport', 'Pajero Full'],
  },
  {
    marca: 'Kia',
    modelos: ['Sportage', 'Stinger', 'Soul', 'Carnival', 'Sorento', 'Telluride', 'EV6', 'Niro'],
  },
  {
    marca: 'BMW',
    modelos: ['116i', '118i', '120i', '125i', '218i', '220i', '320i', '330i', '520i', '530i', 'X1', 'X3', 'X5', 'X6', 'X7', 'M3', 'M5'],
  },
  {
    marca: 'Mercedes-Benz',
    modelos: ['A 200', 'A 250', 'CLA 200', 'C 180', 'C 300', 'E 200', 'E 300', 'GLA 200', 'GLB 200', 'GLC 300', 'GLE 400', 'GLS 450', 'AMG GT'],
  },
  {
    marca: 'Audi',
    modelos: ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8', 'e-tron'],
  },
  {
    marca: 'Volvo',
    modelos: ['XC40', 'XC60', 'XC90', 'S60', 'S90', 'V60', 'C40'],
  },
  {
    marca: 'Land Rover',
    modelos: ['Range Rover Evoque', 'Range Rover Velar', 'Range Rover Sport', 'Range Rover', 'Discovery Sport', 'Discovery', 'Defender'],
  },
  {
    marca: 'Porsche',
    modelos: ['Cayenne', 'Macan', 'Panamera', '911', 'Taycan', 'Boxster', 'Cayman'],
  },
  {
    marca: 'RAM',
    modelos: ['Rampage', '1500', '2500', 'ProMaster'],
  },
  {
    marca: 'Subaru',
    modelos: ['Forester', 'Outback', 'Impreza', 'WRX', 'BRZ', 'XV', 'Ascent'],
  },
  {
    marca: 'Suzuki',
    modelos: ['Jimny', 'Vitara', 'Swift', 'S-Cross', 'Baleno'],
  },
  {
    marca: 'Chery',
    modelos: ['Tiggo 2 Pro', 'Tiggo 5x Pro', 'Tiggo 7 Pro', 'Tiggo 8 Pro', 'Arrizo 6 Pro'],
  },
  {
    marca: 'BYD',
    modelos: ['Dolphin', 'Seal', 'Song Pro', 'Han', 'Yuan Plus', 'King'],
  },
  {
    marca: 'GWM',
    modelos: ['Haval H6', 'Haval H1', 'Ora 03', 'Tank 300'],
  },
  {
    marca: 'Outro',
    modelos: ['Outro modelo'],
  },
];
 
export const getMarcas = (): string[] => CARROS_BRASIL.map((c) => c.marca);
 
export const getModelosPorMarca = (marca: string): string[] => {
  const found = CARROS_BRASIL.find((c) => c.marca === marca);
  return found ? found.modelos : [];
};