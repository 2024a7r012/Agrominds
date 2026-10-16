/**
 * Agricultural Knowledge Service
 * Provides educational and scientifically grounded agricultural resources
 */

const AGRICULTURAL_RECORDS = [
  // CROPS
  {
    id: 'crop-wheat',
    category: 'crops',
    title: 'Wheat Cultivation Guide (Triticum aestivum)',
    slug: 'wheat-cultivation-guide',
    summary: 'Comprehensive cultivation management for wheat, ideal for Rabi season in temperate to subtropical regions.',
    content: {
      scientific_name: 'Triticum aestivum',
      optimal_temperature: '15°C to 25°C',
      soil_requirement: 'Well-drained loams and clay loams rich in organic matter (pH 6.0 - 7.5)',
      sowing_window: 'November 1 to November 25 (Timely sown), late sown up to December 15',
      seed_rate: '100 - 125 kg/ha',
      critical_irrigation_stages: [
        'Crown Root Initiation (CRI) - 20-25 days after sowing (Most critical)',
        'Tillering stage - 40-45 days after sowing',
        'Jointing stage - 60-65 days after sowing',
        'Flowering stage - 80-85 days after sowing',
        'Milking stage - 100-105 days after sowing'
      ],
      nutrient_management: 'NPK 120:60:40 kg/ha. Apply full P & K and 1/3 N at sowing; remaining N in two equal splits with first and second irrigations.',
      harvesting_indicators: 'Grains become hard and moisture drops below 14%, golden-yellow plant canopy.'
    },
    tags: ['rabi', 'cereal', 'food-grain', 'staple']
  },
  {
    id: 'crop-rice',
    category: 'crops',
    title: 'Rice / Paddy Agronomy & Water Management',
    slug: 'rice-paddy-agronomy',
    summary: 'Best practices for high-yielding rice crops under puddled transplanted and direct-seeded conditions.',
    content: {
      scientific_name: 'Oryza sativa',
      optimal_temperature: '22°C to 32°C',
      soil_requirement: 'Heavy clay or clay loams with low water permeability (pH 5.5 - 7.0)',
      sowing_window: 'June to July (Kharif/Monsoon)',
      seed_rate: '35 - 40 kg/ha for nursery transplanting; 20 - 25 kg/ha for direct-seeded rice (DSR)',
      water_management: 'Maintain shallow water layer (2-5 cm) during active tillering to panicle initiation. Introduce Alternate Wetting and Drying (AWD) to conserve up to 30% water.',
      nutrient_management: 'NPK 100-150:50:50 kg/ha with Zinc Sulfate application (25 kg/ha) to prevent Khaira disease.',
      harvesting_indicators: '80-85% of grains in the panicle turn golden straw color.'
    },
    tags: ['kharif', 'cereal', 'water-intensive', 'staple']
  },
  {
    id: 'crop-cotton',
    category: 'crops',
    title: 'Cotton Production & Bollworm Defense',
    slug: 'cotton-production-defense',
    summary: 'Commercial cash crop guide focusing on fiber quality, spacing, and integrated pest suppression.',
    content: {
      scientific_name: 'Gossypium hirsutum',
      optimal_temperature: '21°C to 30°C',
      soil_requirement: 'Deep black soils (Vertisols) with good water-holding capacity',
      sowing_window: 'April to May (irrigated), June (rainfed)',
      spacing: '90 cm x 60 cm for hybrids',
      key_challenges: 'Pink Bollworm, sucking pests (whiteflies, jassids, thrips)',
      fertilizer_recommendation: 'NPK 120:60:60 kg/ha with micronutrient sprays of Magnesium and Boron during boll development.'
    },
    tags: ['cash-crop', 'fiber', 'kharif', 'commercial']
  },
  {
    id: 'crop-tomato',
    category: 'crops',
    title: 'Tomato Greenhouse and Open Field Management',
    slug: 'tomato-open-field-management',
    summary: 'Intensive vegetable management with staking, drip fertigation, and disease control.',
    content: {
      scientific_name: 'Solanum lycopersicum',
      optimal_temperature: '18°C to 27°C (pollen viability drops above 32°C)',
      soil_requirement: 'Sandy loam rich in humus, well drained (pH 6.0 - 6.8)',
      irrigation: 'Drip irrigation with 4 LPH drippers; avoid overhead irrigation to curb fungal blight.',
      disease_watch: 'Early Blight, Late Blight, Tomato Leaf Curl Virus (transmitted by Whitefly)',
      spacing: '60 cm x 45 cm for determinate varieties; 90 cm x 45 cm for indeterminate (trellised).'
    },
    tags: ['vegetable', 'horticulture', 'drip-fertigation', 'high-value']
  },

  // SOIL HEALTH
  {
    id: 'soil-black-cotton',
    category: 'soil',
    title: 'Managing Black Soil (Vertisols) for High Productivity',
    slug: 'managing-black-soil-vertisols',
    summary: 'High clay content soils characterized by swelling upon wetting and deep cracking upon drying.',
    content: {
      characteristics: 'Rich in Calcium, Magnesium, and Potassium; naturally deficient in Nitrogen and Organic Carbon.',
      drainage_strategies: 'Broad Bed and Furrow (BBF) systems prevent waterlogging during heavy monsoon spells.',
      tillage_advice: 'Perform primary tillage immediately post-harvest while soil retains slight moisture to avoid impenetrable hard clods.',
      organic_enhancement: 'Apply 10 tonnes/ha Farmyard Manure (FYM) or green manuring with Sunn hemp to improve soil structure.'
    },
    tags: ['soil-management', 'vertisol', 'clay', 'drainage']
  },
  {
    id: 'soil-alluvial',
    category: 'soil',
    title: 'Alluvial Soil Health & Nutrient Balance',
    slug: 'alluvial-soil-health-balance',
    summary: 'Fertile river-basin soils requiring balanced micronutrient replenishment.',
    content: {
      characteristics: 'Loamy texture, good drainage, highly responsive to fertilization, often deficient in Zinc and Nitrogen.',
      amendments: 'Soil testing every 2 seasons. Biofertilizers such as Azotobacter and Phosphate Solubilizing Bacteria (PSB).',
      compaction_mitigation: 'Sub-soiling every 3 years to break plough pans caused by continuous tractor operations.'
    },
    tags: ['soil-management', 'alluvial', 'fertility', 'testing']
  },

  // IRRIGATION & WATER
  {
    id: 'irrigation-drip',
    category: 'irrigation',
    title: 'Drip Irrigation Setup, Maintenance & Fertigation',
    slug: 'drip-irrigation-maintenance-fertigation',
    summary: 'Precision irrigation delivering water directly to root zones with up to 60% water efficiency.',
    content: {
      efficiency_rating: '85% - 95% water utilization efficiency',
      operating_pressure: '1.0 to 1.5 kg/cm²',
      filtration_system: 'Disc filter combined with Hydrocyclone sand separator for borewell waters.',
      acid_treatment: 'Flushing with dilute Hydrochloric Acid (0.6% v/v) or Phosphoric Acid twice per season to dissolve mineral scale.'
    },
    tags: ['irrigation', 'water-conservation', 'precision-agriculture', 'sustainability']
  },
  {
    id: 'irrigation-sprinkler',
    category: 'irrigation',
    title: 'Micro-Sprinkler Systems for Closely Spaced Crops',
    slug: 'micro-sprinkler-systems',
    summary: 'Ideal for groundnuts, pulses, garlic, and nurseries with uniform water distribution.',
    content: {
      efficiency_rating: '70% - 80% water efficiency',
      advantage: 'Creates microclimatic cooling during sudden heatwave spikes in early summer.',
      maintenance: 'Check nozzle orifices regularly for silt deposits and maintain uniform pipeline elevation.'
    },
    tags: ['irrigation', 'water-conservation', 'sprinklers']
  },

  // PESTS & DISEASES
  {
    id: 'pest-fall-armyworm',
    category: 'pests',
    title: 'Fall Armyworm (Spodoptera frugiperda) Management',
    slug: 'fall-armyworm-management',
    summary: 'Aggressive invasive pest affecting maize, sorghum, and millets.',
    content: {
      symptoms: 'Shot-holes in leaves, whorl feeding, large masses of sawdust-like frass inside the central leaf whorl.',
      organic_control: 'Whorl application of Neem seed kernel extract (NSKE 5%) or Bacillus thuringiensis (Bt) @ 2g/L.',
      biological_agents: 'Release Trichogramma egg parasitoids @ 50,000/acre at initial egg-laying sighting.',
      chemical_caution: 'Apply recommended insecticides (e.g. Chlorantraniliprole) only as a last resort in rotated chemistry.'
    },
    tags: ['pests', 'maize', 'entomology', 'biocontrol']
  },
  {
    id: 'disease-powdery-mildew',
    category: 'pests',
    title: 'Powdery Mildew Identification and Eco-friendly Control',
    slug: 'powdery-mildew-control',
    summary: 'Fungal affliction characterized by talcum powder-like fungal patches on leaf surfaces.',
    content: {
      causal_organism: 'Various fungal species (Erysiphe, Podosphaera)',
      favoring_conditions: 'Warm dry days followed by cool humid nights without rain.',
      organic_remedy: 'Foliar spray of Potassium Bicarbonate (3g/L) or Wettable Sulfur (2g/L). Maintain open canopy aeration through pruning.'
    },
    tags: ['diseases', 'fungal', 'organic-control']
  },

  // SEASONAL
  {
    id: 'season-kharif',
    category: 'seasonal',
    title: 'Kharif Sowing Readiness & Monsoon Contingency Plan',
    slug: 'kharif-monsoon-contingency-plan',
    summary: 'Strategic planning for June-October rainy season crops under erratic rainfall scenarios.',
    content: {
      key_crops: ['Paddy', 'Soybean', 'Maize', 'Pigeon pea (Arhar)', 'Green gram (Moong)', 'Cotton'],
      delayed_monsoon_protocol: 'Switch to short-duration drought-tolerant varieties (e.g., Pearl millet, Sesame) if monsoon delays past mid-July.',
      soil_prep: 'Pre-monsoon deep summer ploughing to eradicate resting pupae and improve rainfall percolation.'
    },
    tags: ['seasons', 'kharif', 'monsoon', 'contingency']
  },
  {
    id: 'season-rabi',
    category: 'seasonal',
    title: 'Rabi Season Winter Cultivation Roadmap',
    slug: 'rabi-winter-cultivation-roadmap',
    summary: 'Winter crop schedule optimizing residual soil moisture and cooler daylight cycles.',
    content: {
      key_crops: ['Wheat', 'Mustard', 'Gram / Chickpea', 'Barley', 'Lentils', 'Potato'],
      frost_protection: 'Provide light night irrigation or smoke blanketing on boundaries during predicted freeze alerts.',
      residue_management: 'Employ Happy Seeder or Super Seeder machines to sow wheat directly into standing rice stubble without burning.'
    },
    tags: ['seasons', 'rabi', 'winter', 'residue-management']
  },

  // PRACTICES
  {
    id: 'practices-ipm',
    category: 'practices',
    title: 'Integrated Pest Management (IPM) Fundamentals',
    slug: 'integrated-pest-management-fundamentals',
    summary: 'Ecological approach combining cultural, physical, biological, and measured chemical tactics.',
    content: {
      core_pillars: [
        'Routine field scouting and Economic Threshold Level (ETL) determination',
        'Pheromone traps and yellow/blue sticky traps for population monitoring',
        'Conservation of predatory insects (ladybird beetles, chrysoperla, spiders)',
        'Judicious, targeted chemical pesticide usage only when ETL is crossed'
      ],
      benefits: 'Reduces chemical input costs by 35-50%, prevents insect resistance, preserves beneficial pollinators.'
    },
    tags: ['sustainability', 'ipm', 'cost-reduction', 'organic']
  },
  {
    id: 'practices-crop-rotation',
    category: 'practices',
    title: 'Strategic Crop Rotation and Legume Integration',
    slug: 'strategic-crop-rotation-legumes',
    summary: 'Breaking pest cycles and replenishing natural nitrogen through legumes.',
    content: {
      nitrogen_fixation: 'Legumes fix between 50 to 150 kg of atmospheric nitrogen per hectare via symbiotic Rhizobium bacteria.',
      rotation_examples: [
        'Paddy - Wheat - Green Gram (Summer Mung)',
        'Maize - Mustard - Cowpea',
        'Cotton - Chickpea'
      ]
    },
    tags: ['soil-health', 'sustainability', 'nitrogen-fixation']
  }
];

class AgricultureService {
  getCategories() {
    return [
      { id: 'all', name: 'All Resources', description: 'Browse all agricultural guides' },
      { id: 'crops', name: 'Crop Cultivation', description: 'Production guides for cereals, cash crops, and vegetables' },
      { id: 'soil', name: 'Soil & Fertility', description: 'Soil health analysis, nutrient balance, and amendments' },
      { id: 'irrigation', name: 'Water & Irrigation', description: 'Drip systems, water conservation, and scheduling' },
      { id: 'pests', name: 'Pests & Diseases', description: 'Diagnostics, symptoms, biological and integrated control' },
      { id: 'seasonal', name: 'Seasonal Guides', description: 'Kharif, Rabi, and summer cultivation calendars' },
      { id: 'practices', name: 'Sustainable Practices', description: 'IPM, zero tillage, composts, and organic systems' }
    ];
  }

  getRecords({ category, search, tag, limit = 50, offset = 0 } = {}) {
    let filtered = [...AGRICULTURAL_RECORDS];

    if (category && category !== 'all') {
      filtered = filtered.filter((r) => r.category.toLowerCase() === category.toLowerCase());
    }

    if (tag) {
      filtered = filtered.filter((r) => r.tags.includes(tag.toLowerCase()));
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter((r) =>
        r.title.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    return {
      records: paginated,
      total,
      limit,
      offset
    };
  }

  getRecordBySlug(slug) {
    return AGRICULTURAL_RECORDS.find((r) => r.slug === slug) || null;
  }

  getRecordById(id) {
    return AGRICULTURAL_RECORDS.find((r) => r.id === id) || null;
  }
}

module.exports = new AgricultureService();
