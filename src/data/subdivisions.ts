// Generated from the ICS International Chronostratigraphic Chart, version 2026-06
// (https://github.com/i-c-stratigraphy/chart, chart.ttl). Colours are the official chart colours.
// Two fixes vs the source: the Ludlow ends at 422.7 Ma (where its last stage ends and the Pridoli
// begins), and the Aquitanian starts at 23.04 Ma to match the Miocene and Neogene.

export type Stage = { name: string; startMa: number; endMa: number; color: string };

export type Series = Stage & {
  stages: Stage[];
  // Carboniferous series sit inside the Mississippian and Pennsylvanian sub-periods.
  group?: string;
};

export const SERIES_BY_PERIOD: Record<string, Series[]> = {
  cambrian: [
    { name: 'Terreneuvian', startMa: 538.8, endMa: 521, color: '#8CB06C', stages: [
      { name: 'Fortunian', startMa: 538.8, endMa: 529, color: '#99B575' },
      { name: 'Stage 2', startMa: 529, endMa: 521, color: '#A6BA80' },
    ] },
    { name: 'Series 2', startMa: 521, endMa: 506.5, color: '#99C078', stages: [
      { name: 'Stage 3', startMa: 521, endMa: 514.5, color: '#A6C583' },
      { name: 'Stage 4', startMa: 514.5, endMa: 506.5, color: '#B3CA8E' },
    ] },
    { name: 'Miaolingian', startMa: 506.5, endMa: 497, color: '#A6CF86', stages: [
      { name: 'Wuliuan', startMa: 506.5, endMa: 504.5, color: '#B3D492' },
      { name: 'Drumian', startMa: 504.5, endMa: 500.5, color: '#BFD99D' },
      { name: 'Guzhangian', startMa: 500.5, endMa: 497, color: '#CCDFAA' },
    ] },
    { name: 'Furongian', startMa: 497, endMa: 486.85, color: '#B3E095', stages: [
      { name: 'Paibian', startMa: 497, endMa: 494.2, color: '#CCEBAE' },
      { name: 'Jiangshanian', startMa: 494.2, endMa: 491, color: '#D9F0BB' },
      { name: 'Stage 10', startMa: 491, endMa: 486.85, color: '#E6F5C9' },
    ] },
  ],
  ordovician: [
    { name: 'Lower Ordovician', startMa: 486.85, endMa: 471.3, color: '#1A9D6F', stages: [
      { name: 'Tremadocian', startMa: 486.85, endMa: 477.1, color: '#33A97E' },
      { name: 'Floian', startMa: 477.1, endMa: 471.3, color: '#41B087' },
    ] },
    { name: 'Middle Ordovician', startMa: 471.3, endMa: 458.2, color: '#4DB47E', stages: [
      { name: 'Dapingian', startMa: 471.3, endMa: 469.4, color: '#66C092' },
      { name: 'Darriwilian', startMa: 469.4, endMa: 458.2, color: '#74C69C' },
    ] },
    { name: 'Upper Ordovician', startMa: 458.2, endMa: 443.1, color: '#7FCA93', stages: [
      { name: 'Sandbian', startMa: 458.2, endMa: 452.8, color: '#8CD094' },
      { name: 'Katian', startMa: 452.8, endMa: 445.2, color: '#99D69F' },
      { name: 'Hirnantian', startMa: 445.2, endMa: 443.1, color: '#A6DBAB' },
    ] },
  ],
  silurian: [
    { name: 'Llandovery', startMa: 443.1, endMa: 432.9, color: '#99D7B3', stages: [
      { name: 'Rhuddanian', startMa: 443.1, endMa: 440.5, color: '#A6DCB5' },
      { name: 'Aeronian', startMa: 440.5, endMa: 438.6, color: '#B3E1C2' },
      { name: 'Telychian', startMa: 438.6, endMa: 432.9, color: '#BFE6CF' },
    ] },
    { name: 'Wenlock', startMa: 432.9, endMa: 426.7, color: '#B3E1C2', stages: [
      { name: 'Sheinwoodian', startMa: 432.9, endMa: 430.6, color: '#BFE6C3' },
      { name: 'Homerian', startMa: 430.6, endMa: 426.7, color: '#CCEBD1' },
    ] },
    { name: 'Ludlow', startMa: 426.7, endMa: 422.7, color: '#BFE6CF', stages: [
      { name: 'Gorstian', startMa: 426.7, endMa: 425, color: '#CCECDD' },
      { name: 'Ludfordian', startMa: 425, endMa: 422.7, color: '#D9F0DF' },
    ] },
    { name: 'Pridoli', startMa: 422.7, endMa: 419.62, color: '#E6F5E1', stages: [
    ] },
  ],
  devonian: [
    { name: 'Lower Devonian', startMa: 419.62, endMa: 393.47, color: '#E5AC4D', stages: [
      { name: 'Lochkovian', startMa: 419.62, endMa: 413.02, color: '#E5B75A' },
      { name: 'Pragian', startMa: 413.02, endMa: 410.62, color: '#E5C468' },
      { name: 'Emsian', startMa: 410.62, endMa: 393.47, color: '#E5D075' },
    ] },
    { name: 'Middle Devonian', startMa: 393.47, endMa: 382.31, color: '#F1C868', stages: [
      { name: 'Eifelian', startMa: 393.47, endMa: 387.95, color: '#F1D576' },
      { name: 'Givetian', startMa: 387.95, endMa: 382.31, color: '#F1E185' },
    ] },
    { name: 'Upper Devonian', startMa: 382.31, endMa: 358.86, color: '#F1E19D', stages: [
      { name: 'Frasnian', startMa: 382.31, endMa: 372.15, color: '#F2EDAD' },
      { name: 'Famennian', startMa: 372.15, endMa: 358.86, color: '#F2EDB3' },
    ] },
  ],
  carboniferous: [
    { name: 'Lower Mississippian', startMa: 358.86, endMa: 346.7, color: '#80AB6C', group: 'Mississippian', stages: [
      { name: 'Tournaisian', startMa: 358.86, endMa: 346.7, color: '#8CB06C' },
    ] },
    { name: 'Middle Mississippian', startMa: 346.7, endMa: 330.3, color: '#99B46C', group: 'Mississippian', stages: [
      { name: 'Visean', startMa: 346.7, endMa: 330.3, color: '#A6B96C' },
    ] },
    { name: 'Upper Mississippian', startMa: 330.3, endMa: 323.4, color: '#B3BE6C', group: 'Mississippian', stages: [
      { name: 'Serpukhovian', startMa: 330.3, endMa: 323.4, color: '#BFC26B' },
    ] },
    { name: 'Lower Pennsylvanian', startMa: 323.4, endMa: 315.2, color: '#8CBEB4', group: 'Pennsylvanian', stages: [
      { name: 'Bashkirian', startMa: 323.4, endMa: 315.2, color: '#99C2B5' },
    ] },
    { name: 'Middle Pennsylvanian', startMa: 315.2, endMa: 307, color: '#A6C7B7', group: 'Pennsylvanian', stages: [
      { name: 'Moscovian', startMa: 315.2, endMa: 307, color: '#B3CBB9' },
    ] },
    { name: 'Upper Pennsylvanian', startMa: 307, endMa: 298.9, color: '#BFD0BA', group: 'Pennsylvanian', stages: [
      { name: 'Kasimovian', startMa: 307, endMa: 303.7, color: '#BFD0C5' },
      { name: 'Gzhelian', startMa: 303.7, endMa: 298.9, color: '#CCD4C7' },
    ] },
  ],
  permian: [
    { name: 'Cisuralian', startMa: 298.9, endMa: 274.4, color: '#EF5845', stages: [
      { name: 'Asselian', startMa: 298.9, endMa: 293.52, color: '#E36350' },
      { name: 'Sakmarian', startMa: 293.52, endMa: 290.1, color: '#E36F5C' },
      { name: 'Artinskian', startMa: 290.1, endMa: 283.3, color: '#E37B68' },
      { name: 'Kungurian', startMa: 283.3, endMa: 274.4, color: '#E38776' },
    ] },
    { name: 'Guadalupian', startMa: 274.4, endMa: 259.857, color: '#FB745C', stages: [
      { name: 'Roadian', startMa: 274.4, endMa: 266.9, color: '#FB8069' },
      { name: 'Wordian', startMa: 266.9, endMa: 264.28, color: '#FB8D76' },
      { name: 'Capitanian', startMa: 264.28, endMa: 259.857, color: '#FB9A85' },
    ] },
    { name: 'Lopingian', startMa: 259.857, endMa: 251.902, color: '#FBA794', stages: [
      { name: 'Wuchiapingian', startMa: 259.857, endMa: 254.14, color: '#FCB4A2' },
      { name: 'Changhsingian', startMa: 254.14, endMa: 251.902, color: '#FCC0B2' },
    ] },
  ],
  triassic: [
    { name: 'Lower Triassic', startMa: 251.902, endMa: 247, color: '#983999', stages: [
      { name: 'Induan', startMa: 251.902, endMa: 250.8, color: '#A4469F' },
      { name: 'Olenekian', startMa: 250.8, endMa: 247, color: '#B051A5' },
    ] },
    { name: 'Middle Triassic', startMa: 247, endMa: 237, color: '#B168B1', stages: [
      { name: 'Anisian', startMa: 247, endMa: 241.464, color: '#BC75B7' },
      { name: 'Ladinian', startMa: 241.464, endMa: 237, color: '#C983BF' },
    ] },
    { name: 'Upper Triassic', startMa: 237, endMa: 201.4, color: '#BD8CC3', stages: [
      { name: 'Carnian', startMa: 237, endMa: 227.3, color: '#C99BCB' },
      { name: 'Norian', startMa: 227.3, endMa: 205.7, color: '#D6AAD3' },
      { name: 'Rhaetian', startMa: 205.7, endMa: 201.4, color: '#E3B9DB' },
    ] },
  ],
  jurassic: [
    { name: 'Lower Jurassic', startMa: 201.4, endMa: 174.7, color: '#42AED0', stages: [
      { name: 'Hettangian', startMa: 201.4, endMa: 199.5, color: '#4EB3D3' },
      { name: 'Sinemurian', startMa: 199.5, endMa: 192.9, color: '#67BCD8' },
      { name: 'Pliensbachian', startMa: 192.9, endMa: 184.2, color: '#80C5DD' },
      { name: 'Toarcian', startMa: 184.2, endMa: 174.7, color: '#99CEE3' },
    ] },
    { name: 'Middle Jurassic', startMa: 174.7, endMa: 161.5, color: '#80CFD8', stages: [
      { name: 'Aalenian', startMa: 174.7, endMa: 170.9, color: '#9AD9DD' },
      { name: 'Bajocian', startMa: 170.9, endMa: 168.2, color: '#A6DDE0' },
      { name: 'Bathonian', startMa: 168.2, endMa: 165.3, color: '#B3E2E3' },
      { name: 'Callovian', startMa: 165.3, endMa: 161.5, color: '#BFE7E5' },
    ] },
    { name: 'Upper Jurassic', startMa: 161.5, endMa: 143.1, color: '#B3E3EE', stages: [
      { name: 'Oxfordian', startMa: 161.5, endMa: 154.8, color: '#BFE7F1' },
      { name: 'Kimmeridgian', startMa: 154.8, endMa: 149.2, color: '#CCECF4' },
      { name: 'Tithonian', startMa: 149.2, endMa: 143.1, color: '#D9F1F7' },
    ] },
  ],
  cretaceous: [
    { name: 'Lower Cretaceous', startMa: 143.1, endMa: 100.5, color: '#8CCD57', stages: [
      { name: 'Berriasian', startMa: 143.1, endMa: 137.05, color: '#8CCD60' },
      { name: 'Valanginian', startMa: 137.05, endMa: 132.6, color: '#99D36A' },
      { name: 'Hauterivian', startMa: 132.6, endMa: 125.77, color: '#A6D975' },
      { name: 'Barremian', startMa: 125.77, endMa: 121.4, color: '#B3DF7F' },
      { name: 'Aptian', startMa: 121.4, endMa: 113.2, color: '#BFE48A' },
      { name: 'Albian', startMa: 113.2, endMa: 100.5, color: '#CCEA97' },
    ] },
    { name: 'Upper Cretaceous', startMa: 100.5, endMa: 66, color: '#A6D84A', stages: [
      { name: 'Cenomanian', startMa: 100.5, endMa: 93.9, color: '#B3DE53' },
      { name: 'Turonian', startMa: 93.9, endMa: 89.8, color: '#BFE35D' },
      { name: 'Coniacian', startMa: 89.8, endMa: 85.7, color: '#CCE968' },
      { name: 'Santonian', startMa: 85.7, endMa: 83.6, color: '#D9EF74' },
      { name: 'Campanian', startMa: 83.6, endMa: 72.2, color: '#E6F47F' },
      { name: 'Maastrichtian', startMa: 72.2, endMa: 66, color: '#F2FA8C' },
    ] },
  ],
  paleogene: [
    { name: 'Paleocene', startMa: 66, endMa: 56, color: '#FDA75F', stages: [
      { name: 'Danian', startMa: 66, endMa: 61.66, color: '#FDB462' },
      { name: 'Selandian', startMa: 61.66, endMa: 59.24, color: '#FEBF65' },
      { name: 'Thanetian', startMa: 59.24, endMa: 56, color: '#FDBF6F' },
    ] },
    { name: 'Eocene', startMa: 56, endMa: 33.9, color: '#FDB46C', stages: [
      { name: 'Ypresian', startMa: 56, endMa: 48.07, color: '#FCA773' },
      { name: 'Lutetian', startMa: 48.07, endMa: 41.03, color: '#FDB482' },
      { name: 'Bartonian', startMa: 41.03, endMa: 37.71, color: '#FDC091' },
      { name: 'Priabonian', startMa: 37.71, endMa: 33.9, color: '#FDCDA1' },
    ] },
    { name: 'Oligocene', startMa: 33.9, endMa: 23.04, color: '#FEC07A', stages: [
      { name: 'Rupelian', startMa: 33.9, endMa: 27.3, color: '#FED99A' },
      { name: 'Chattian', startMa: 27.3, endMa: 23.04, color: '#FEE6AA' },
    ] },
  ],
  neogene: [
    { name: 'Miocene', startMa: 23.04, endMa: 5.333, color: '#FFFF00', stages: [
      { name: 'Aquitanian', startMa: 23.04, endMa: 20.45, color: '#FFFF33' },
      { name: 'Burdigalian', startMa: 20.45, endMa: 15.98, color: '#FFFF41' },
      { name: 'Langhian', startMa: 15.98, endMa: 13.82, color: '#FFFF4D' },
      { name: 'Serravallian', startMa: 13.82, endMa: 11.63, color: '#FFFF59' },
      { name: 'Tortonian', startMa: 11.63, endMa: 7.246, color: '#FFFF66' },
      { name: 'Messinian', startMa: 7.246, endMa: 5.333, color: '#FFFF73' },
    ] },
    { name: 'Pliocene', startMa: 5.333, endMa: 2.58, color: '#FFFF99', stages: [
      { name: 'Zanclean', startMa: 5.333, endMa: 3.6, color: '#FFFFB3' },
      { name: 'Piacenzian', startMa: 3.6, endMa: 2.58, color: '#FFFFBF' },
    ] },
  ],
  quaternary: [
    { name: 'Pleistocene', startMa: 2.58, endMa: 0.0117, color: '#FFEFAF', stages: [
      { name: 'Gelasian', startMa: 2.58, endMa: 1.8, color: '#FFEDB3' },
      { name: 'Calabrian', startMa: 1.8, endMa: 0.774, color: '#FFF2BA' },
      { name: 'Chibanian', startMa: 0.774, endMa: 0.129, color: '#FFF2C7' },
      { name: 'Upper Pleistocene', startMa: 0.129, endMa: 0.0117, color: '#FFF2D3' },
    ] },
    { name: 'Holocene', startMa: 0.0117, endMa: 0, color: '#FEEBD2', stages: [
      { name: 'Greenlandian', startMa: 0.0117, endMa: 0.0082, color: '#FEECDB' },
      { name: 'Northgrippian', startMa: 0.0082, endMa: 0.0042, color: '#FDECE4' },
      { name: 'Meghalayan', startMa: 0.0042, endMa: 0, color: '#FDEDEC' },
    ] },
  ],
};
