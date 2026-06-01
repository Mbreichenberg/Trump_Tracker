// ============================================================
// POLICIES DATA — TERM 2 (2025–present)
// To add a new policy: copy an existing object and fill in fields.
// Each policy has: id, category, title, description,
//   deathsToDate, deathsProjected, projectedYear,
//   ratePerYear (for live counter), sources[]
// ============================================================

export const CATEGORIES = {
  FOREIGN_AID: { id: "FOREIGN_AID", label: "Foreign Aid & Global Health", color: "#ef4444", icon: "🌍" },
  ENVIRONMENT: { id: "ENVIRONMENT", label: "Environment & Climate", color: "#22c55e", icon: "🌿" },
  HEALTHCARE:  { id: "HEALTHCARE",  label: "Domestic Healthcare",         color: "#3b82f6", icon: "🏥" },
  VACCINES:    { id: "VACCINES",    label: "Vaccines & Infectious Disease",color: "#a855f7", icon: "💉" },
  IRAN_WAR:    { id: "IRAN_WAR",    label: "Iran War (2026)",              color: "#f97316", icon: "💣" },
  IMMIGRATION: { id: "IMMIGRATION", label: "Immigration Policy",           color: "#eab308", icon: "🚧" },
  DISASTER:    { id: "DISASTER",    label: "Climate & Disaster Prep",      color: "#06b6d4", icon: "🌪️" },
};

// ratePerYear: estimated additional deaths per year attributable to this policy
// Used to animate a live counter (deaths per second = ratePerYear / 31,536,000)

export const POLICIES_TERM2 = [
  // ─── FOREIGN AID ──────────────────────────────────────────
  {
    id: "usaid_shutdown",
    category: "FOREIGN_AID",
    title: "USAID Dismantlement",
    date: "January 2025",
    description:
      "On Jan 24, 2025 the Trump administration issued a stop-work order shutting down USAID overnight. The agency had provided over 40% of global humanitarian funding, keeping millions alive with HIV medication, vaccines, food aid, and malaria treatment.",
    deathsToDate: 600000,
    deathsProjected: 14000000,
    projectedYear: 2030,
    ratePerYear: 650000,
    startYear: 2025,
    projectionModel: "frontLoaded",
    modelParams: { decayFactor: 0.82 },
    sources: [
      { label: "Sherman/Meeks Congressional Report", url: "https://sherman.house.gov/media-center/press-releases/one-year-after-trumps-usaid-shutdown-sherman-meeks-lead-all-foreign" },
      { label: "The Lancet Study (Feb 2026)", url: "https://www.cnn.com/2026/02/04/world/lancet-usaid-global-aid-cuts-intl" },
      { label: "UCLA Fielding School of Public Health", url: "https://npr.org/2025/07/01/nx-s1-5452513/trump-usaid-foreign-aid-deaths" },
      { label: "UN Human Rights Experts Letter", url: "https://www.ohchr.org/en/press-releases/2025/07/us-government-fuelling-global-humanitarian-catastrophe-un-experts" },
    ],
  },
  {
    id: "hiv_aids_cuts",
    category: "FOREIGN_AID",
    title: "Global HIV/AIDS Program Cuts",
    date: "February 2025",
    description:
      "PEPFAR and HIV clinic funding halted across sub-Saharan Africa. HIV clinics closed in South Africa. Children like Evan Anzoo — born HIV+ and kept alive by U.S. aid — lost medication access and died.",
    deathsToDate: 100000,
    deathsProjected: 2000000,
    projectedYear: 2030,
    ratePerYear: 120000,
    startYear: 2025,
    projectionModel: "frontLoaded",
    modelParams: { decayFactor: 0.80 },
    sources: [
      { label: "CNN: HIV Clinics Closing in South Africa", url: "https://www.cnn.com/2026/02/04/world/lancet-usaid-global-aid-cuts-intl" },
      { label: "NPR: USAID Foreign Aid Deaths", url: "https://www.npr.org/sections/goats-and-soda/2025/07/01/nx-s1-5452513/trump-usaid-foreign-aid-deaths" },
    ],
  },
  {
    id: "malaria_tb_cuts",
    category: "FOREIGN_AID",
    title: "Global Malaria & Tuberculosis Funding Cuts",
    date: "February 2025",
    description:
      "Malaria prevention programs including bed nets, spraying campaigns, and TB drug programs were halted in Africa and Asia. These programs had driven historic declines in two of the world's biggest killers.",
    deathsToDate: 80000,
    deathsProjected: 1500000,
    projectedYear: 2030,
    ratePerYear: 95000,
    startYear: 2025,
    projectionModel: "frontLoaded",
    modelParams: { decayFactor: 0.84 },
    sources: [
      { label: "NPR: USAID Deaths Study", url: "https://www.npr.org/sections/goats-and-soda/2025/07/01/nx-s1-5452513/trump-usaid-foreign-aid-deaths" },
      { label: "Lancet Study (July 2025)", url: "https://fortune.com/2025/07/01/14-million-people-die-trump-cuts-us-foreign-aid-study-finds" },
    ],
  },
  {
    id: "child_nutrition_cuts",
    category: "FOREIGN_AID",
    title: "Global Child Nutrition / Food Aid Cuts",
    date: "January 2025",
    description:
      "USAID-funded nutrition programs for children under 5 were terminated. Oxfam projects the first rise in child mortality in this century, with a child potentially dying of malnutrition every 40 seconds by 2030.",
    deathsToDate: 200000,
    deathsProjected: 3000000,
    projectedYear: 2030,
    ratePerYear: 220000,
    startYear: 2025,
    projectionModel: "frontLoaded",
    modelParams: { decayFactor: 0.78 },
    sources: [
      { label: "Oxfam America Analysis", url: "https://www.oxfamamerica.org/explore/issues/making-foreign-aid-work/what-do-trumps-proposed-foreign-aid-cuts-mean/" },
      { label: "UN Experts Letter (July 2025)", url: "https://www.ohchr.org/en/press-releases/2025/07/us-government-fuelling-global-humanitarian-catastrophe-un-experts" },
    ],
  },
  {
    id: "who_withdrawal",
    category: "FOREIGN_AID",
    title: "WHO Withdrawal",
    date: "January 2025",
    description:
      "Trump withdrew the U.S. from the World Health Organization on day one, crippling global disease surveillance infrastructure. Infectious disease specialists warned the U.S. is now ill-prepared for pandemic response.",
    deathsToDate: 30000,
    deathsProjected: 500000,
    projectedYear: 2030,
    ratePerYear: 40000,
    startYear: 2025,
    projectionModel: "exponential",
    modelParams: { growthFactor: 1.05 },
    sources: [
      { label: "CBS News: Ebola/Hantavirus & Trump Cuts", url: "https://www.cbsnews.com/news/ebola-hantavirus-outbreak-trump-health-agency-cuts/" },
    ],
  },

  // ─── ENVIRONMENT ──────────────────────────────────────────
  {
    id: "epa_rollbacks",
    category: "ENVIRONMENT",
    title: "EPA Regulatory Rollbacks (31 Rules)",
    date: "March 2025",
    description:
      "EPA Administrator Lee Zeldin announced rollbacks of 31 major pollution rules, calling it 'the greatest day of deregulation.' A Guardian analysis found these rules were projected to save nearly 200,000 lives over 25 years.",
    deathsToDate: 8000,
    deathsProjected: 200000,
    projectedYear: 2050,
    ratePerYear: 8000,
    startYear: 2025,
    projectionModel: "exponential",
    modelParams: { growthFactor: 1.07 },
    sources: [
      { label: "The Guardian: EPA Pollution Rollbacks", url: "https://www.aol.com/news/epa-aims-cut-pollution-rules-100054846.html" },
      { label: "Environmental Protection Network", url: "https://www.environmentalprotectionnetwork.org/epafacts/facts-rollbacks-of-pollution-rules-will-cost-over-200k-lives/" },
      { label: "EDF: EPA Health Rollbacks (May 2026)", url: "https://blogs.edf.org/climate411/2026/05/26/epas-many-rollbacks-of-pollution-protections-ignore-the-value-of-lives-saved/" },
    ],
  },
  {
    id: "power_plant_rules",
    category: "ENVIRONMENT",
    title: "Power Plant Greenhouse Gas Rules Repealed",
    date: "June 2025",
    description:
      "EPA rolled back Biden-era rules limiting greenhouse gases and mercury from coal and gas power plants. This undoes the estimated prevention of 30,000 annual deaths and $275 billion in annual health benefits.",
    deathsToDate: 30000,
    deathsProjected: 750000,
    projectedYear: 2050,
    ratePerYear: 30000,
    startYear: 2025,
    projectionModel: "exponential",
    modelParams: { growthFactor: 1.07 },
    sources: [
      { label: "AP Analysis: EPA Rollbacks & Deaths", url: "https://www.marketbeat.com/articles/trumps-epa-targets-environmental-rules-projected-to-save-billions--and-many-thousands-of-lives-2025-06-05" },
      { label: "MarketBeat: Power Plant Rules", url: "https://www.marketbeat.com/articles/epa-set-to-roll-back-rules-that-limit-greenhouse-gases-and-mercury-from-us-power-plants-2025-06-11" },
    ],
  },
  {
    id: "endangerment_finding",
    category: "ENVIRONMENT",
    title: "Endangerment Finding Reversal",
    date: "March 2025",
    description:
      "EPA moved to reverse the landmark 2009 finding that greenhouse gases endanger public health — the legal foundation for all U.S. climate regulation. Makes climate denial official U.S. policy, with cascading generational consequences.",
    deathsToDate: 0,
    deathsProjected: 10000000,
    projectedYear: 2100,
    ratePerYear: 50000,
    startYear: 2025,
    projectionModel: "exponential",
    modelParams: { growthFactor: 1.10 },
    sources: [
      { label: "Climate Action Campaign Tracker", url: "https://www.actonclimate.com/trumptracker/" },
      { label: "The Guardian: EPA Rollbacks", url: "https://www.aol.com/news/epa-aims-cut-pollution-rules-100054846.html" },
    ],
  },
  {
    id: "clean_water_rollback",
    category: "ENVIRONMENT",
    title: "Clean Water Protections Rolled Back",
    date: "April 2025",
    description:
      "Protections for rivers, streams, and wetlands eliminated, exposing communities to contaminated drinking water. PM2.5 and other pollutants increase waterborne and respiratory disease mortality.",
    deathsToDate: 5000,
    deathsProjected: 100000,
    projectedYear: 2050,
    ratePerYear: 5000,
    startYear: 2025,
    projectionModel: "flat",
    modelParams: {},
    sources: [
      { label: "AOL: Trump Environmental Programs & Health Risks", url: "https://www.aol.com/news/trump-gutting-nations-environmental-programs-100033476.html" },
    ],
  },

  // ─── DOMESTIC HEALTHCARE ──────────────────────────────────
  {
    id: "medicaid_cuts",
    category: "HEALTHCARE",
    title: "Medicaid Cuts (One Big Beautiful Bill)",
    date: "July 4, 2025",
    description:
      "Trump's signature legislation cut nearly $1 trillion from Medicaid through work requirements and reduced federal funding. The CBO projects 7.6 million people will lose insurance by 2034, with research linking this to tens of thousands of annual preventable deaths.",
    deathsToDate: 5000,
    deathsProjected: 400000,
    projectedYear: 2034,
    ratePerYear: 40000,
    startYear: 2025,
    projectionModel: "lagged",
    modelParams: { lagMonths: 36 },
    sources: [
      { label: "JAMA Health Forum Study", url: "https://www.nbcnews.com/health/health-news/another-report-suggests-medicaid-cuts-lead-thousands-deaths-rcna219086" },
      { label: "Don Moynihan: How Trump's Bill Will Kill Americans", url: "https://donmoynihan.substack.com/p/how-trumps-big-bad-bill-will-kill" },
      { label: "PBS NewsHour: Medicaid at 60", url: "https://www.pbs.org/newshour/nation/60-years-after-medicaid-was-signed-into-law-trumps-one-big-beautiful-bill-is-chiseling-it-back" },
    ],
  },
  {
    id: "snap_cuts",
    category: "HEALTHCARE",
    title: "SNAP / Food Stamp Cuts",
    date: "July 2025",
    description:
      "Work requirements expanded to 2.4 million new people under the One Big Beautiful Bill, ending food assistance for vulnerable Americans including veterans, caregivers, and the homeless. CAP estimates 69,600 additional deaths.",
    deathsToDate: 2000,
    deathsProjected: 69600,
    projectedYear: 2034,
    ratePerYear: 8000,
    startYear: 2025,
    projectionModel: "lagged",
    modelParams: { lagMonths: 24 },
    sources: [
      { label: "Newsweek: SNAP Cuts & 70,000 Deaths", url: "https://www.newsweek.com/snap-benefits-update-trumps-cuts-could-lead-to-70000-deaths-11711692" },
      { label: "WSWS: SNAP Cuts Take Effect", url: "https://www.wsws.org/en/articles/2026/02/03/nkzk-f03.html" },
    ],
  },
  {
    id: "nih_cuts",
    category: "HEALTHCARE",
    title: "NIH Budget Cut 40% ($18 Billion)",
    date: "May 2025",
    description:
      "NIH's discretionary budget slashed from $45B to $27.5B, cutting 1,200 staff and 7,000+ clinical trials. Cancer, Alzheimer's, and infectious disease research hobbled. Every year of delayed research compounds future deaths.",
    deathsToDate: 3000,
    deathsProjected: 500000,
    projectedYear: 2050,
    ratePerYear: 20000,
    startYear: 2025,
    projectionModel: "lagged",
    modelParams: { lagMonths: 48 },
    sources: [
      { label: "Science AAAS: NIH Budget Cut", url: "https://www.science.org/content/article/trump-s-proposed-budget-details-dramatic-cuts-biomedical-research-and-global-health" },
      { label: "Yahoo: Trump Cuts Will Cause More Cancer Deaths", url: "https://www.yahoo.com/news/opinion-trump-cuts-federal-health-163000461.html" },
    ],
  },
  {
    id: "cdc_cuts",
    category: "HEALTHCARE",
    title: "CDC Budget Cut 44% ($4 Billion)",
    date: "May 2025",
    description:
      "CDC budget cratered from $9.2B to $5.2B. Eliminated: newborn deafness testing, blood lead monitoring in children, firearm injury research, STI/Lyme disease tracking, and tobacco-cessation programs.",
    deathsToDate: 4000,
    deathsProjected: 200000,
    projectedYear: 2050,
    ratePerYear: 12000,
    startYear: 2025,
    projectionModel: "lagged",
    modelParams: { lagMonths: 30 },
    sources: [
      { label: "Science AAAS: NIH/CDC Proposals", url: "https://www.science.org/content/article/trump-proposes-massive-nih-budget-cut-and-reorganization" },
      { label: "STAT: Trump Budget & Health Agencies", url: "https://www.statnews.com/2025/05/02/skinny-budget-trump-hhs-cuts-white-house-proposes-deep-reductions-nih-cdc/" },
    ],
  },
  {
    id: "hhs_layoffs",
    category: "HEALTHCARE",
    title: "HHS Staff Cuts (20,000 Layoffs)",
    date: "March 2025",
    description:
      "DOGE-directed cuts fired 25% of HHS staff. The FDA lost 3,500 staffers approving new medicines. NIH lost 1,200 researchers. Cancer screening programs, drug trials, and surveillance systems all degraded.",
    deathsToDate: 5000,
    deathsProjected: 150000,
    projectedYear: 2040,
    ratePerYear: 15000,
    startYear: 2025,
    projectionModel: "lagged",
    modelParams: { lagMonths: 18 },
    sources: [
      { label: "Yahoo: Cancer Deaths & Trump Cuts", url: "https://www.yahoo.com/news/opinion-trump-cuts-federal-health-163000461.html" },
    ],
  },
  {
    id: "aca_subsidy_cuts",
    category: "HEALTHCARE",
    title: "ACA Marketplace Subsidy Lapse",
    date: "July 2025",
    description:
      "Enhanced ACA premium tax credits — which subsidized coverage for those earning up to $60,240 — were allowed to lapse, stripping millions of affordable insurance and producing an estimated 8,800 additional annual deaths.",
    deathsToDate: 3000,
    deathsProjected: 88000,
    projectedYear: 2034,
    ratePerYear: 8800,
    startYear: 2025,
    projectionModel: "lagged",
    modelParams: { lagMonths: 24 },
    sources: [
      { label: "Don Moynihan: How Trump's Bill Will Kill Americans", url: "https://donmoynihan.substack.com/p/how-trumps-big-bad-bill-will-kill" },
    ],
  },
  {
    id: "drug_treatment_cuts",
    category: "HEALTHCARE",
    title: "Drug Treatment Program Cuts (Opioid Crisis)",
    date: "2025",
    description:
      "Trump dismantled Biden-era harm reduction and treatment programs — expanded naloxone access, buprenorphine, Medicaid-funded rehab — pivoting to a militarized drug war. Experts credit those programs with saving tens of thousands of lives.",
    deathsToDate: 15000,
    deathsProjected: 150000,
    projectedYear: 2030,
    ratePerYear: 15000,
    startYear: 2025,
    projectionModel: "flat",
    modelParams: {},
    sources: [
      { label: "NPR: Trump's Fentanyl Policy Pivot", url: "https://www.npr.org/2025/12/31/nx-s1-5653370/trump-fentanyl-drug-policy-pivot" },
    ],
  },
  {
    id: "nursing_home_staffing",
    category: "HEALTHCARE",
    title: "Nursing Home Staffing Mandate Delayed 10 Years",
    date: "July 2025",
    description:
      "The Big Beautiful Bill delayed a federal minimum staffing mandate for nursing homes by 10 years. Research estimates this will cause 13,000 additional deaths among vulnerable elderly residents.",
    deathsToDate: 2000,
    deathsProjected: 130000,
    projectedYear: 2035,
    ratePerYear: 13000,
    startYear: 2025,
    projectionModel: "lagged",
    modelParams: { lagMonths: 24 },
    sources: [
      { label: "Don Moynihan: How Trump's Bill Will Kill Americans", url: "https://donmoynihan.substack.com/p/how-trumps-big-bad-bill-will-kill" },
    ],
  },

  // ─── VACCINES & INFECTIOUS DISEASE ───────────────────────
  {
    id: "vaccine_undermining",
    category: "VACCINES",
    title: "Vaccine Program Undermining / RFK Jr.",
    date: "January 2025",
    description:
      "RFK Jr. appointed as HHS Secretary. Vaccination framed as 'personal choice.' Measles cases surged past 1,100 in 2026, putting the U.S. at risk of losing elimination status. A Texas child died of measles — the first death since 2015.",
    deathsToDate: 12,
    deathsProjected: 5000,
    projectedYear: 2030,
    ratePerYear: 500,
    startYear: 2025,
    projectionModel: "exponential",
    modelParams: { growthFactor: 1.10 },
    sources: [
      { label: "Axios: Measles Surge (Mar 2026)", url: "https://www.axios.com/2026/03/04/measles-cases-outbreak-vaccine-trump" },
      { label: "Heather Cox Richardson: Texas Measles Death", url: "https://heathercoxrichardson.substack.com/p/february-27-2025" },
    ],
  },
  {
    id: "pandemic_preparedness",
    category: "VACCINES",
    title: "Pandemic Preparedness Defunded",
    date: "2025",
    description:
      "Public health infrastructure gutted by DOGE cuts. The U.S. is now unprepared for pandemic response, with Ebola and hantavirus outbreaks exposing the vulnerability. Disease surveillance in Congo was cut off mid-outbreak.",
    deathsToDate: 500,
    deathsProjected: 2000000,
    projectedYear: 2035,
    ratePerYear: 10000,
    startYear: 2025,
    projectionModel: "exponential",
    modelParams: { growthFactor: 1.08 },
    sources: [
      { label: "CBS News: Ebola, Hantavirus & Trump Cuts", url: "https://www.cbsnews.com/news/ebola-hantavirus-outbreak-trump-health-agency-cuts/" },
    ],
  },
  {
    id: "bird_flu",
    category: "VACCINES",
    title: "Bird Flu (H5N1) Pandemic Preparedness Cuts",
    date: "2025",
    description:
      "DOGE cuts hobbled the U.S. response to H5N1 bird flu spreading through poultry and dairy herds. Vaccine development and surveillance capacity reduced during a critical window of potential spillover to humans.",
    deathsToDate: 50,
    deathsProjected: 500000,
    projectedYear: 2030,
    ratePerYear: 5000,
    startYear: 2025,
    projectionModel: "exponential",
    modelParams: { growthFactor: 1.15 },
    sources: [
      { label: "Heather Cox Richardson: Bird Flu & DOGE Cuts", url: "https://heathercoxrichardson.substack.com/p/february-27-2025" },
    ],
  },

  // ─── IRAN WAR ─────────────────────────────────────────────
  {
    id: "iran_us_strikes",
    category: "IRAN_WAR",
    title: "U.S.–Israel Military Strikes on Iran",
    date: "February 28, 2026",
    description:
      "Trump authorized joint U.S.–Israel strikes on Iran beginning Feb 28, 2026. The stated goals were regime change and dismantlement of Iran's nuclear program. The war produced thousands of deaths across multiple countries before a ceasefire in April 2026.",
    deathsToDate: 8817,
    deathsProjected: 8817,
    projectedYear: 2026,
    ratePerYear: 0,
    startYear: 2026,
    projectionModel: "historical",
    modelParams: {},
    sources: [
      { label: "Wikipedia: Casualties of the 2026 Iran War", url: "https://en.wikipedia.org/wiki/Casualties_of_the_2026_Iran_war" },
      { label: "NPR: Iran War Coverage (Mar 2026)", url: "https://www.npr.org/2026/03/10/nx-s1-5742828/iran-war-us-trump" },
    ],
  },
  {
    id: "iran_civilian",
    category: "IRAN_WAR",
    title: "Iranian Civilian Deaths in Strikes",
    date: "February–April 2026",
    description:
      "HRANA documented 1,701 confirmed civilian deaths in Iran from U.S. and Israeli strikes, including strikes on schools, hospitals, and heritage sites. True toll is believed to be higher due to limited access.",
    deathsToDate: 1701,
    deathsProjected: 1701,
    projectedYear: 2026,
    ratePerYear: 0,
    startYear: 2026,
    projectionModel: "historical",
    modelParams: {},
    sources: [
      { label: "Wikipedia: 2026 Iran War Casualties", url: "https://en.wikipedia.org/wiki/Casualties_of_the_2026_Iran_war" },
    ],
  },
  {
    id: "iran_lebanon",
    category: "IRAN_WAR",
    title: "Lebanon Casualties from War Escalation",
    date: "February–April 2026",
    description:
      "Iran-backed Hezbollah exchanged strikes with Israel throughout the 2026 war. Lebanese health officials confirmed 2,586 deaths as conflict spread into Lebanon's civilian infrastructure.",
    deathsToDate: 2586,
    deathsProjected: 2586,
    projectedYear: 2026,
    ratePerYear: 0,
    startYear: 2026,
    projectionModel: "historical",
    modelParams: {},
    sources: [
      { label: "Wikipedia: 2026 Iran War Casualties", url: "https://en.wikipedia.org/wiki/Casualties_of_the_2026_Iran_war" },
      { label: "NBC News: Iran War Live Updates", url: "https://www.nbcnews.com/world/middle-east/live-blog/live-updates-iran-war-israel-us-hezbollah-lebanon-khamenei-trump-rcna261259" },
    ],
  },
  {
    id: "us_service_members",
    category: "IRAN_WAR",
    title: "U.S. Service Members Killed",
    date: "February–April 2026",
    description:
      "15 U.S. service members were killed in the Iran war, with 538 wounded. The Pentagon was also found to have altered casualty statistics, scrubbing wounded soldiers from official tallies.",
    deathsToDate: 15,
    deathsProjected: 15,
    projectedYear: 2026,
    ratePerYear: 0,
    startYear: 2026,
    projectionModel: "historical",
    modelParams: {},
    sources: [
      { label: "Wikipedia: 2026 Iran War", url: "https://en.wikipedia.org/wiki/2026_Iran_war" },
      { label: "The Intercept: Pentagon Casualty Cover-Up", url: "https://theintercept.com/2026/04/22/iran-war-military-casualties-wounded/" },
    ],
  },

  // ─── IMMIGRATION ──────────────────────────────────────────
  {
    id: "mass_deportation",
    category: "IMMIGRATION",
    title: "Mass Deportation Campaign",
    date: "January 2025",
    description:
      "The Trump administration shifted enforcement to prioritize all 14 million undocumented immigrants, deporting people to dangerous conditions, cutting them off from ongoing medical treatment, and separating families from healthcare infrastructure.",
    deathsToDate: 500,
    deathsProjected: 5000,
    projectedYear: 2028,
    ratePerYear: 1000,
    startYear: 2025,
    projectionModel: "lagged",
    modelParams: { lagMonths: 18 },
    sources: [
      { label: "KFF: Immigration Policy & Health Coverage", url: "https://www.kff.org/immigrant-health/recent-trump-administration-policies-that-impact-health-coverage-and-care-for-immigrant-families/" },
    ],
  },
  {
    id: "immigrant_healthcare_cuts",
    category: "IMMIGRATION",
    title: "Immigrant Healthcare Eligibility Cuts",
    date: "July 2025",
    description:
      "The One Big Beautiful Bill stripped lawfully present immigrants of eligibility for Medicaid, CHIP, and ACA coverage. Approximately 1.4 million undocumented immigrants and millions of legal residents lost access to care.",
    deathsToDate: 2000,
    deathsProjected: 30000,
    projectedYear: 2034,
    ratePerYear: 3000,
    startYear: 2025,
    projectionModel: "lagged",
    modelParams: { lagMonths: 24 },
    sources: [
      { label: "KFF: Immigration & Health Coverage", url: "https://www.kff.org/immigrant-health/recent-trump-administration-policies-that-impact-health-coverage-and-care-for-immigrant-families/" },
      { label: "WSWS: SNAP & Immigrant Cuts", url: "https://www.wsws.org/en/articles/2026/02/03/nkzk-f03.html" },
    ],
  },

  // ─── DISASTER PREP ────────────────────────────────────────
  {
    id: "fema_cuts",
    category: "DISASTER",
    title: "FEMA & Disaster Response Weakening",
    date: "2025",
    description:
      "Budget cuts and staffing reductions weakened FEMA's capacity during an era of increasing extreme weather events. Climate-intensified hurricanes, floods, and wildfires are deadlier when emergency response infrastructure is degraded.",
    deathsToDate: 500,
    deathsProjected: 10000,
    projectedYear: 2030,
    ratePerYear: 1000,
    startYear: 2025,
    projectionModel: "exponential",
    modelParams: { growthFactor: 1.04 },
    sources: [
      { label: "Climate Action Campaign Tracker", url: "https://www.actonclimate.com/trumptracker/" },
    ],
  },
  {
    id: "nws_noaa_cuts",
    category: "DISASTER",
    title: "National Weather Service / NOAA Staff Cuts",
    date: "2025",
    description:
      "Hundreds of NOAA and NWS positions cut, degrading hurricane and tornado warning infrastructure. NWS offices in tornado-prone areas lost forecasters, potentially delaying life-saving warnings.",
    deathsToDate: 200,
    deathsProjected: 5000,
    projectedYear: 2030,
    ratePerYear: 500,
    startYear: 2025,
    projectionModel: "exponential",
    modelParams: { growthFactor: 1.04 },
    sources: [
      { label: "Climate Action Campaign Tracker", url: "https://www.actonclimate.com/trumptracker/" },
    ],
  },
  {
    id: "ncar_elimination",
    category: "DISASTER",
    title: "National Center for Atmospheric Research Eliminated",
    date: "2025",
    description:
      "OMB Director Russ Vought announced plans to dismantle NCAR — the nation's primary lab for extreme weather research, air pollution science, and climate modeling. Generations of climate adaptation knowledge are now at risk.",
    deathsToDate: 0,
    deathsProjected: 1000000,
    projectedYear: 2100,
    ratePerYear: 20000,
    startYear: 2025,
    projectionModel: "exponential",
    modelParams: { growthFactor: 1.06 },
    sources: [
      { label: "Climate Action Campaign Tracker", url: "https://www.actonclimate.com/trumptracker/" },
    ],
  },
];

// ============================================================
// TERM 1 DATA (2017–2021) — for comparison
// Sources: peer-reviewed retrospective studies, CBO analyses
// ============================================================

export const POLICIES_TERM1 = [
  {
    id: "t1_aca_sabotage",
    category: "HEALTHCARE",
    title: "ACA Repeal Attempts & Sabotage",
    date: "2017–2020",
    description:
      "Individual mandate eliminated, short-term plan proliferation, outreach cuts, and open enrollment period slashed. Studies estimate 13,000–19,000 additional annual deaths from coverage losses.",
    deathsToDate: 52000,
    ratePerYear: 13000,
    startYear: 2017,
    sources: [
      { label: "Harvard/JAMA: ACA Sabotage Deaths", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6640038/" },
    ],
  },
  {
    id: "t1_epa_rollbacks",
    category: "ENVIRONMENT",
    title: "Term 1 EPA Rollbacks (100+ Rules)",
    date: "2017–2021",
    description:
      "Trump rolled back over 100 environmental regulations in his first term, including clean power plan, mercury rules, and auto emission standards. Harvard studies link rollbacks to increased air pollution mortality.",
    deathsToDate: 22000,
    ratePerYear: 5500,
    startYear: 2017,
    sources: [
      { label: "Columbia Law: Environmental Rollback Tracker", url: "https://climate.law.columbia.edu/content/trump-rollbacks" },
    ],
  },
  {
    id: "t1_covid_mismanagement",
    category: "VACCINES",
    title: "COVID-19 Pandemic Mismanagement",
    date: "2020–2021",
    description:
      "Delayed response, PPE shortages, rejected WHO test kits, discouraged masks, undermined CDC, held packed rallies. Researchers estimate 100,000–400,000 excess U.S. deaths attributable to policy failures.",
    deathsToDate: 180000,
    ratePerYear: 90000,
    startYear: 2020,
    sources: [
      { label: "Columbia U: Preventable COVID Deaths", url: "https://www.publichealth.columbia.edu/research/program-forced-migration-and-health/us-could-have-avoided-40-covid-19-deaths-if-we-had-acted" },
      { label: "Lancet Commission: COVID & Policy", url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(21)01043-7/fulltext" },
    ],
  },
  {
    id: "t1_usaid_cuts",
    category: "FOREIGN_AID",
    title: "Term 1 Foreign Aid Cuts",
    date: "2017–2021",
    description:
      "Trump cut foreign aid by ~30% in his first term, including WHO withdrawal, PEPFAR underfunding threats, and Palestinian aid cuts. Less severe than Term 2 but still cost tens of thousands of lives globally.",
    deathsToDate: 40000,
    ratePerYear: 10000,
    startYear: 2017,
    sources: [
      { label: "Kaiser Family Foundation: U.S. Global Health Funding", url: "https://www.kff.org/global-health-policy/" },
    ],
  },
  {
    id: "t1_opioid",
    category: "HEALTHCARE",
    title: "Opioid Crisis Policy Failures",
    date: "2017–2021",
    description:
      "Despite declaring opioids a public health emergency, treatment funding lagged demand. 225,000+ Americans died of overdoses during Trump's first term — the worst 4-year period in history at that time.",
    deathsToDate: 225000,
    ratePerYear: 56000,
    startYear: 2017,
    sources: [
      { label: "CDC: Drug Overdose Data", url: "https://www.cdc.gov/drugoverdose/deaths/index.html" },
    ],
  },
  {
    id: "t1_immigration_deaths",
    category: "IMMIGRATION",
    title: "Immigration Detention Deaths & Family Separation",
    date: "2017–2021",
    description:
      "At least 21 people died in ICE detention. Thousands of separated children suffered long-term trauma. Asylum seekers returned to dangerous conditions under Remain in Mexico saw documented killings.",
    deathsToDate: 21,
    ratePerYear: 5,
    startYear: 2017,
    sources: [
      { label: "ACLU: Deaths in ICE Detention", url: "https://www.aclu.org/report/fatal-neglect-how-ice-ignores-deaths-its-custody" },
    ],
  },
  {
    id: "t1_climate",
    category: "DISASTER",
    title: "Paris Climate Agreement Withdrawal",
    date: "2017",
    description:
      "U.S. withdrawal from the Paris Agreement delayed global climate action. Each degree of warming produces tens of thousands of additional deaths annually from heat, storms, flooding, and drought worldwide.",
    deathsToDate: 15000,
    ratePerYear: 3000,
    startYear: 2017,
    sources: [
      { label: "Nature: Climate Change & Mortality", url: "https://www.nature.com/articles/s41558-021-01042-4" },
    ],
  },
  {
    id: "t1_snap_cuts",
    category: "HEALTHCARE",
    title: "SNAP Work Requirement Proposals",
    date: "2018–2019",
    description:
      "Proposed work requirements would have cut 750,000 people from food assistance. Though largely blocked by courts, administrative chilling effects reduced enrollment and food security nationwide.",
    deathsToDate: 3000,
    ratePerYear: 750,
    startYear: 2018,
    sources: [
      { label: "CBPP: SNAP Work Requirements", url: "https://www.cbpp.org/research/food-assistance/snap-works-for-americas-workers" },
    ],
  },
];
