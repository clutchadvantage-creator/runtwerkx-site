import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import LibraryPageLayout from './LibraryPageLayout'
import {
  addPdfFooter,
  addPdfHeader,
  addPdfSection,
  createLetterPdf,
  toPdfFileName,
} from '../../utils/pdfExport'

const incidentFilters = [
  'All',
  'General emergency',
  'Medical response',
  'Fire safety',
  'Hazmat response',
  'Confined space',
  'Electrical emergency',
  'Fall response',
  'Weather emergency',
  'Security emergency',
]

const protocolEntries = [
  {
    title: 'Initial incident response',
    industry: 'All industries',
    category: 'General emergency',
    trigger: 'Any injury, release, fire, equipment strike, or uncontrolled hazard.',
    actions: [
      'Stop work immediately and protect yourself before assisting others.',
      'Raise the alarm using the site method: radio, pull station, phone tree, or verbal alert.',
      'Isolate the hazard if it can be done safely without increasing exposure.',
      'Report who is involved, exact location, hazard type, and whether emergency services are needed.',
    ],
    source: 'OSHA emergency action planning and general duty expectations.',
    officialLink: 'https://www.osha.gov/etools/evacuation-plans-procedures',
  },
  {
    title: 'Medical emergency and serious injury',
    industry: 'All industries',
    category: 'Medical response',
    trigger: 'Severe bleeding, unconscious worker, crush injury, electric shock, or heat stress collapse.',
    actions: [
      'Call emergency services and send someone to meet responders at the site entrance.',
      'Shut down nearby operations and keep access routes open for rescue personnel.',
      'Provide first aid or CPR only if trained and only when the scene is safe.',
      'Preserve the incident area for investigation once life hazards are controlled.',
    ],
    source: 'OSHA first aid guidance and common industrial emergency response practice.',
    officialLink: 'https://www.osha.gov/medical-first-aid',
  },
  {
    title: 'Fire or explosion response',
    industry: 'All industries',
    category: 'Fire safety',
    trigger: 'Visible flame, smoke condition, gas ignition, flash event, or explosion risk.',
    actions: [
      'Activate the site fire alarm and begin evacuation toward the assigned assembly point.',
      'Only use an extinguisher if you are trained, the fire is small, and you have a clear exit path.',
      'Account for personnel at the muster point and report missing workers immediately.',
      'Do not re-enter until fire command or site leadership gives the all clear.',
    ],
    source: 'NFPA emergency evacuation principles and OSHA emergency action plan requirements.',
    officialLink: 'https://www.osha.gov/emergency-preparedness/fire',
    relatedStandards: [
      {
        label: 'NFPA fire and life safety references',
        to: '/knowledge-library/industry-standards?query=NFPA&filter=Fire%20%26%20life%20safety&scope=All',
      },
    ],
  },
  {
    title: 'Hazardous material spill or release',
    industry: 'Manufacturing, shipping, fabrication',
    category: 'Hazmat response',
    trigger: 'Chemical leak, drum breach, vapor release, fuel spill, or unknown substance.',
    actions: [
      'Keep untrained personnel out of the area and establish an isolation perimeter.',
      'Use the SDS and site spill procedures to identify PPE, containment, and notification needs.',
      'Shut down ignition sources and drainage paths if that can be done safely.',
      'Escalate to hazmat-qualified responders when the release exceeds site response capability.',
    ],
    source: 'OSHA HAZWOPER response principles and standard spill control practice.',
    officialLink: 'https://www.osha.gov/hazwoper',
    relatedStandards: [
      {
        label: 'Hazmat and shipping standards',
        to: '/knowledge-library/industry-standards?query=hazmat&filter=Hazmat%20%26%20shipping&scope=Shipping',
      },
    ],
  },
  {
    title: 'Confined space emergency',
    industry: 'Construction, manufacturing, maintenance',
    category: 'Confined space',
    trigger: 'Entrant collapse, atmospheric alarm, loss of communication, or engulfment risk.',
    actions: [
      'Do not enter for rescue unless you are part of the trained rescue plan.',
      'Call emergency responders and activate the confined space rescue procedure immediately.',
      'Use retrieval equipment when the permit setup allows non-entry rescue.',
      'Control entry points and maintain atmospheric monitoring until responders take over.',
    ],
    source: 'OSHA permit-required confined space requirements.',
    officialLink: 'https://www.osha.gov/confined-spaces',
    relatedStandards: [
      {
        label: 'Confined space standards',
        to: '/knowledge-library/industry-standards?query=confined%20space&filter=Confined%20space&scope=Maintenance',
      },
    ],
  },
  {
    title: 'Electrical contact or arc flash event',
    industry: 'Construction, maintenance, manufacturing',
    category: 'Electrical emergency',
    trigger: 'Shock incident, energized contact, arc flash, or equipment fault.',
    actions: [
      'Do not touch the injured person until the circuit is de-energized or isolated.',
      'Secure the electrical source using lockout procedures or emergency disconnects if trained.',
      'Call emergency services and begin CPR or AED use only after the hazard is removed.',
      'Quarantine the equipment and keep the area preserved for electrical investigation.',
    ],
    source: 'OSHA electrical safety rules with NFPA 70E response expectations.',
    officialLink: 'https://www.osha.gov/electrical',
    relatedStandards: [
      {
        label: 'NFPA 70E and electrical standards',
        to: '/knowledge-library/industry-standards?query=NFPA%2070E&filter=Electrical&scope=Maintenance',
      },
      {
        label: 'Energy isolation standards',
        to: '/knowledge-library/industry-standards?query=lockout&filter=Energy%20control&scope=Maintenance',
      },
    ],
  },
  {
    title: 'Working at height fall incident',
    industry: 'Construction, maintenance, steel erection',
    category: 'Fall response',
    trigger: 'Worker fall, suspended worker, anchor failure, or dropped object event.',
    actions: [
      'Call emergency rescue immediately and initiate the site suspension trauma rescue plan.',
      'Keep the area below the incident clear from secondary exposure and falling material.',
      'Do not move the worker unless there is an immediate life threat such as fire or collapse.',
      'Inspect surrounding tie-off points and stop all similar work until the incident is reviewed.',
    ],
    source: 'OSHA fall protection requirements and recognized rescue planning practice.',
    officialLink: 'https://www.osha.gov/fall-protection',
    relatedStandards: [
      {
        label: 'Fall protection standards',
        to: '/knowledge-library/industry-standards?query=fall&filter=Fall%20protection&scope=Field',
      },
    ],
  },
  {
    title: 'Severe weather and tornado sheltering',
    industry: 'All industries',
    category: 'Weather emergency',
    trigger: 'Tornado warning, lightning threat, extreme wind, or severe storm alert.',
    actions: [
      'Stop exposed outdoor work, crane picks, elevated work, and vehicle movement as directed.',
      'Move personnel to the designated shelter area and verify headcount.',
      'Secure loose materials, hot work, and temporary power if time and conditions allow.',
      'Resume operations only after management confirms conditions are safe and the warning has passed.',
    ],
    source: 'FEMA and OSHA severe weather preparedness guidance.',
    officialLink: 'https://www.ready.gov/severe-weather',
  },
  {
    title: 'Active threat or workplace violence',
    industry: 'All industries',
    category: 'Security emergency',
    trigger: 'Armed threat, violent intruder, credible threat report, or active attack.',
    actions: [
      'Follow the site security protocol: run, hide, fight only as a last resort and only when necessary to survive.',
      'Call law enforcement when safe to do so and provide exact location, description, and number of suspects.',
      'Silence devices, barricade entry points, and stay out of hallways or open work areas.',
      'Do not leave secure cover until law enforcement gives direct instructions.',
    ],
    source: 'DHS active shooter guidance and common workplace violence response practice.',
    officialLink: 'https://www.cisa.gov/topics/physical-security/active-shooter-preparedness',
  },
]

const agencies = [
  {
    name: 'OSHA',
    region: 'United States',
    type: 'Workplace safety',
    supports: 'General industry, construction, emergency action plans, reporting, worker protection.',
    contact: 'Federal OSHA offices and state plans',
    href: 'https://www.osha.gov',
  },
  {
    name: 'NFPA',
    region: 'United States',
    type: 'Fire and life safety',
    supports: 'Fire response planning, alarms, evacuation, suppression systems, electrical safety codes.',
    contact: 'Codes, standards, and fire protection guidance',
    href: 'https://www.nfpa.org',
  },
  {
    name: 'FEMA',
    region: 'United States',
    type: 'Disaster and weather preparedness',
    supports: 'Severe weather, disaster response planning, continuity, and readiness guidance.',
    contact: 'National preparedness resources',
    href: 'https://www.ready.gov',
  },
  {
    name: 'CISA',
    region: 'United States',
    type: 'Security and threat preparedness',
    supports: 'Active threat, workplace violence, cyber-physical risk, and facility security guidance.',
    contact: 'Protective security and active shooter preparedness',
    href: 'https://www.cisa.gov',
  },
  {
    name: 'MSHA',
    region: 'United States',
    type: 'Mining safety',
    supports: 'Mine emergency response, underground rescue, reporting, and miner protection.',
    contact: 'Mine Safety and Health Administration',
    href: 'https://www.msha.gov',
  },
  {
    name: 'PHMSA',
    region: 'United States',
    type: 'Hazmat transportation',
    supports: 'Hazardous materials transport, shipping incident guidance, and emergency response information.',
    contact: 'Pipeline and Hazardous Materials Safety Administration',
    href: 'https://www.phmsa.dot.gov',
  },
  {
    name: 'Transport Canada',
    region: 'Canada',
    type: 'Transport and dangerous goods',
    supports: 'Transportation emergencies, dangerous goods rules, and federal transport safety guidance.',
    contact: 'Canadian transport safety and TDG resources',
    href: 'https://tc.canada.ca',
  },
  {
    name: 'CCOHS',
    region: 'Canada',
    type: 'Occupational health and safety',
    supports: 'Workplace emergency procedures, hazard controls, and safety program guidance.',
    contact: 'Canadian Centre for Occupational Health and Safety',
    href: 'https://www.ccohs.ca',
  },
  {
    name: 'IMO',
    region: 'International',
    type: 'Maritime safety',
    supports: 'Shipping emergencies, dangerous goods, vessel safety, and maritime response frameworks.',
    contact: 'International Maritime Organization',
    href: 'https://www.imo.org',
  },
]

const officialLinks = [
  {
    title: 'OSHA Emergency Preparedness and Response',
    description: 'Emergency action plans, medical response, fire response, and incident preparedness guidance.',
    href: 'https://www.osha.gov/emergency-preparedness',
  },
  {
    title: 'OSHA Evacuation Plans and Procedures',
    description: 'Planning expectations for alarms, evacuation routes, critical operations, and accountability.',
    href: 'https://www.osha.gov/etools/evacuation-plans-procedures',
  },
  {
    title: 'NFPA Emergency Evacuation Planning Guide',
    description: 'Fire and evacuation planning concepts that support industrial emergency readiness.',
    href: 'https://www.nfpa.org/education-and-research/emergency-response/emergency-evacuation-planning-guide',
  },
  {
    title: 'Ready.gov Emergency Preparedness',
    description: 'Federal planning resources for severe weather, continuity, communications, and disaster response.',
    href: 'https://www.ready.gov',
  },
  {
    title: 'CISA Active Shooter Preparedness',
    description: 'Official threat response and workplace violence preparedness resources.',
    href: 'https://www.cisa.gov/topics/physical-security/active-shooter-preparedness',
  },
  {
    title: 'PHMSA Emergency Response Guidebook',
    description: 'Hazardous materials shipping and emergency response reference material.',
    href: 'https://www.phmsa.dot.gov/hazmat/erg/emergency-response-guidebook-erg',
  },
]

const printableProtocolTitles = [
  'Medical emergency and serious injury',
  'Fire or explosion response',
  'Hazardous material spill or release',
  'Electrical contact or arc flash event',
  'Confined space emergency',
]

const usStateLookup = [
  { state: 'Alabama', emergencyAgency: 'Alabama Emergency Management Agency', emergencyHref: 'https://ema.alabama.gov', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/alabama' },
  { state: 'Alaska', emergencyAgency: 'Alaska Division of Homeland Security and Emergency Management', emergencyHref: 'https://ready.alaska.gov', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/alaska' },
  { state: 'Arizona', emergencyAgency: 'Arizona Department of Emergency and Military Affairs', emergencyHref: 'https://dema.az.gov', oshaAgency: 'ADOSH', oshaHref: 'https://www.azica.gov/divisions/adosh' },
  { state: 'Arkansas', emergencyAgency: 'Arkansas Division of Emergency Management', emergencyHref: 'https://adem.arkansas.gov', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/arkansas' },
  { state: 'California', emergencyAgency: 'California Governor’s Office of Emergency Services', emergencyHref: 'https://www.caloes.ca.gov', oshaAgency: 'Cal/OSHA', oshaHref: 'https://www.dir.ca.gov/dosh/' },
  { state: 'Colorado', emergencyAgency: 'Colorado Division of Homeland Security and Emergency Management', emergencyHref: 'https://dhsem.colorado.gov', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/colorado' },
  { state: 'Connecticut', emergencyAgency: 'Connecticut Division of Emergency Management and Homeland Security', emergencyHref: 'https://portal.ct.gov/demhs', oshaAgency: 'CONN-OSHA', oshaHref: 'https://portal.ct.gov/dol/divisions/occupational-safety-and-health' },
  { state: 'Delaware', emergencyAgency: 'Delaware Emergency Management Agency', emergencyHref: 'https://dema.delaware.gov', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/delaware' },
  { state: 'Florida', emergencyAgency: 'Florida Division of Emergency Management', emergencyHref: 'https://www.floridadisaster.org', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/florida' },
  { state: 'Georgia', emergencyAgency: 'Georgia Emergency Management and Homeland Security Agency', emergencyHref: 'https://gema.georgia.gov', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/georgia' },
  { state: 'Hawaii', emergencyAgency: 'Hawaii Emergency Management Agency', emergencyHref: 'https://dod.hawaii.gov/hiema/', oshaAgency: 'HIOSH', oshaHref: 'https://labor.hawaii.gov/hiosh/' },
  { state: 'Idaho', emergencyAgency: 'Idaho Office of Emergency Management', emergencyHref: 'https://ioem.idaho.gov', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/idaho' },
  { state: 'Illinois', emergencyAgency: 'Illinois Emergency Management Agency and Office of Homeland Security', emergencyHref: 'https://iemaohs.illinois.gov', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/illinois' },
  { state: 'Indiana', emergencyAgency: 'Indiana Department of Homeland Security', emergencyHref: 'https://www.in.gov/dhs/', oshaAgency: 'IOSHA', oshaHref: 'https://www.in.gov/dol/iosha/' },
  { state: 'Iowa', emergencyAgency: 'Iowa Homeland Security and Emergency Management', emergencyHref: 'https://homelandsecurity.iowa.gov', oshaAgency: 'IOSH', oshaHref: 'https://labor.iowa.gov/iosh' },
  { state: 'Kansas', emergencyAgency: 'Kansas Division of Emergency Management', emergencyHref: 'https://www.kansastag.gov/kdem.asp', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/kansas' },
  { state: 'Kentucky', emergencyAgency: 'Kentucky Emergency Management', emergencyHref: 'https://kyem.ky.gov', oshaAgency: 'Kentucky OSH', oshaHref: 'https://labor.ky.gov/standards/Pages/KOSH.aspx' },
  { state: 'Louisiana', emergencyAgency: 'Louisiana Governor’s Office of Homeland Security and Emergency Preparedness', emergencyHref: 'https://gohsep.la.gov', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/louisiana' },
  { state: 'Maine', emergencyAgency: 'Maine Emergency Management Agency', emergencyHref: 'https://www.maine.gov/mema/', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/maine' },
  { state: 'Maryland', emergencyAgency: 'Maryland Department of Emergency Management', emergencyHref: 'https://mdem.maryland.gov', oshaAgency: 'MOSH', oshaHref: 'https://www.dllr.state.md.us/labor/mosh/' },
  { state: 'Massachusetts', emergencyAgency: 'Massachusetts Emergency Management Agency', emergencyHref: 'https://www.mass.gov/orgs/massachusetts-emergency-management-agency', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/massachusetts' },
  { state: 'Michigan', emergencyAgency: 'Michigan State Police Emergency Management and Homeland Security Division', emergencyHref: 'https://www.michigan.gov/msp/divisions/emhsd', oshaAgency: 'MIOSHA', oshaHref: 'https://www.michigan.gov/leo/bureaus-agencies/miosha' },
  { state: 'Minnesota', emergencyAgency: 'Minnesota Homeland Security and Emergency Management', emergencyHref: 'https://dps.mn.gov/divisions/hsem', oshaAgency: 'MNOSHA', oshaHref: 'https://www.dli.mn.gov/business/workplace-safety-and-health/mnosha-compliance' },
  { state: 'Mississippi', emergencyAgency: 'Mississippi Emergency Management Agency', emergencyHref: 'https://www.msema.org', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/mississippi' },
  { state: 'Missouri', emergencyAgency: 'Missouri State Emergency Management Agency', emergencyHref: 'https://sema.dps.mo.gov', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/missouri' },
  { state: 'Montana', emergencyAgency: 'Montana Disaster and Emergency Services', emergencyHref: 'https://des.mt.gov', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/montana' },
  { state: 'Nebraska', emergencyAgency: 'Nebraska Emergency Management Agency', emergencyHref: 'https://nema.nebraska.gov', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/nebraska' },
  { state: 'Nevada', emergencyAgency: 'Nevada Division of Emergency Management', emergencyHref: 'https://dem.nv.gov', oshaAgency: 'NV OSHA', oshaHref: 'https://dir.nv.gov/OSHA/home/' },
  { state: 'New Hampshire', emergencyAgency: 'New Hampshire Homeland Security and Emergency Management', emergencyHref: 'https://www.nh.gov/hsem/', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/new-hampshire' },
  { state: 'New Jersey', emergencyAgency: 'New Jersey Office of Emergency Management', emergencyHref: 'https://www.njohsp.gov/jerseyready', oshaAgency: 'PEOSH / Federal OSHA', oshaHref: 'https://www.nj.gov/health/workplacehealthandsafety/peosh/' },
  { state: 'New Mexico', emergencyAgency: 'New Mexico Department of Homeland Security and Emergency Management', emergencyHref: 'https://www.dhsem.nm.gov', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/new-mexico' },
  { state: 'New York', emergencyAgency: 'New York State Division of Homeland Security and Emergency Services', emergencyHref: 'https://www.dhses.ny.gov', oshaAgency: 'PESH / Federal OSHA', oshaHref: 'https://dol.ny.gov/public-employee-safety-health-pesh' },
  { state: 'North Carolina', emergencyAgency: 'North Carolina Emergency Management', emergencyHref: 'https://www.ncdps.gov/ncem', oshaAgency: 'NC OSH', oshaHref: 'https://www.labor.nc.gov/safety-and-health' },
  { state: 'North Dakota', emergencyAgency: 'North Dakota Department of Emergency Services', emergencyHref: 'https://www.des.nd.gov', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/north-dakota' },
  { state: 'Ohio', emergencyAgency: 'Ohio Emergency Management Agency', emergencyHref: 'https://ema.ohio.gov', oshaAgency: 'Public Employment Risk Reduction / Federal OSHA', oshaHref: 'https://www.com.ohio.gov/dico/wpl/' },
  { state: 'Oklahoma', emergencyAgency: 'Oklahoma Department of Emergency Management', emergencyHref: 'https://oklahoma.gov/oem.html', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/oklahoma' },
  { state: 'Oregon', emergencyAgency: 'Oregon Department of Emergency Management', emergencyHref: 'https://www.oregon.gov/oem', oshaAgency: 'Oregon OSHA', oshaHref: 'https://osha.oregon.gov' },
  { state: 'Pennsylvania', emergencyAgency: 'Pennsylvania Emergency Management Agency', emergencyHref: 'https://www.pema.pa.gov', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/pennsylvania' },
  { state: 'Rhode Island', emergencyAgency: 'Rhode Island Emergency Management Agency', emergencyHref: 'https://riema.ri.gov', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/rhode-island' },
  { state: 'South Carolina', emergencyAgency: 'South Carolina Emergency Management Division', emergencyHref: 'https://www.scemd.org', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/south-carolina' },
  { state: 'South Dakota', emergencyAgency: 'South Dakota Office of Emergency Management', emergencyHref: 'https://dps.sd.gov/emergency-services/emergency-management', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/south-dakota' },
  { state: 'Tennessee', emergencyAgency: 'Tennessee Emergency Management Agency', emergencyHref: 'https://www.tn.gov/tema.html', oshaAgency: 'TOSHA', oshaHref: 'https://www.tn.gov/workforce/injuries-at-work/tosha.html' },
  { state: 'Texas', emergencyAgency: 'Texas Division of Emergency Management', emergencyHref: 'https://tdem.texas.gov', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/texas' },
  { state: 'Utah', emergencyAgency: 'Utah Division of Emergency Management', emergencyHref: 'https://dem.utah.gov', oshaAgency: 'UOSH', oshaHref: 'https://laborcommission.utah.gov/divisions/uosh/' },
  { state: 'Vermont', emergencyAgency: 'Vermont Emergency Management', emergencyHref: 'https://vem.vermont.gov', oshaAgency: 'VOSHA', oshaHref: 'https://labor.vermont.gov/vosha' },
  { state: 'Virginia', emergencyAgency: 'Virginia Department of Emergency Management', emergencyHref: 'https://www.vaemergency.gov', oshaAgency: 'VOSH', oshaHref: 'https://www.doli.virginia.gov/labor-law/vosh-program/' },
  { state: 'Washington', emergencyAgency: 'Washington Emergency Management Division', emergencyHref: 'https://mil.wa.gov/emergency-management-division', oshaAgency: 'WA L&I DOSH', oshaHref: 'https://www.lni.wa.gov/safety-health/' },
  { state: 'West Virginia', emergencyAgency: 'West Virginia Emergency Management Division', emergencyHref: 'https://emd.wv.gov', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/west-virginia' },
  { state: 'Wisconsin', emergencyAgency: 'Wisconsin Emergency Management', emergencyHref: 'https://wem.wi.gov', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/wisconsin' },
  { state: 'Wyoming', emergencyAgency: 'Wyoming Office of Homeland Security', emergencyHref: 'https://wysafer.wyo.gov/wyohs', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/wyoming' },
  { state: 'District of Columbia', emergencyAgency: 'DC Homeland Security and Emergency Management Agency', emergencyHref: 'https://hsema.dc.gov', oshaAgency: 'Federal OSHA', oshaHref: 'https://www.osha.gov/dc' },
]

function downloadProtocolSheet(entry) {
  const { pdf, margin, pageHeight, maxWidth } = createLetterPdf()
  let cursorY = 48

  cursorY = addPdfHeader(pdf, {
    margin,
    maxWidth,
    cursorY,
    eyebrow: 'EMERGENCY PROTOCOL SHEET',
    title: entry.title,
  })

  cursorY = addPdfSection(pdf, {
    cursorY: cursorY + 22,
    margin,
    maxWidth,
    pageHeight,
    label: 'INDUSTRY / CATEGORY',
    body: `${entry.industry} / ${entry.category}`,
  })
  cursorY = addPdfSection(pdf, {
    cursorY,
    margin,
    maxWidth,
    pageHeight,
    label: 'TRIGGER',
    body: entry.trigger,
  })

  const stepLines = entry.actions.flatMap((action, index) => `${index + 1}. ${action}`)
  cursorY = addPdfSection(pdf, {
    cursorY,
    margin,
    maxWidth,
    pageHeight,
    label: 'IMMEDIATE RESPONSE STEPS',
    body: stepLines.join('\n'),
  })
  cursorY = addPdfSection(pdf, {
    cursorY,
    margin,
    maxWidth,
    pageHeight,
    label: 'BASED ON',
    body: entry.source,
  })
  cursorY = addPdfSection(pdf, {
    cursorY,
    margin,
    maxWidth,
    pageHeight,
    label: 'OFFICIAL SOURCE',
    body: entry.officialLink,
  })

  addPdfFooter(pdf, {
    cursorY,
    margin,
    maxWidth,
    pageHeight,
    text: 'This quick sheet supports field reference only. For active emergencies call local emergency services first and follow your company emergency action plan, rescue procedures, and supervisor notification chain.',
  })

  pdf.save(`${toPdfFileName(entry.title)}-emergency-protocol.pdf`)
}

function OverviewPanel() {
  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
          ― Protocol Overview ―
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white">
          Emergency response has to be simple under pressure
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <h3 className="text-lg font-semibold text-white">Immediate priorities</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Protect life first, raise the alarm fast, isolate the hazard when safe,
            and get accurate information to site leadership or emergency responders.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <h3 className="text-lg font-semibold text-white">General rule set</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Do not improvise beyond your training. Follow site plans, use the nearest
            communication method, and keep rescue access and muster accountability clear.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <h3 className="text-lg font-semibold text-white">What this page gives you</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Searchable response protocols, cross-industry emergency guidance, agency lookup,
            and official resources for deeper procedures and location-specific support.
          </p>
        </div>
      </div>
    </section>
  )
}

function ProtocolLibrary() {
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const nextSearch = params.get('query') ?? ''
    const nextFilter = params.get('filter') ?? 'All'

    setSearch(nextSearch)
    setActiveFilter(incidentFilters.includes(nextFilter) ? nextFilter : 'All')
  }, [location.search])

  const filteredProtocols = useMemo(() => {
    const query = search.trim().toLowerCase()

    return protocolEntries.filter((entry) => {
      const filterMatches = activeFilter === 'All' || entry.category === activeFilter
      const haystack = [
        entry.title,
        entry.industry,
        entry.category,
        entry.trigger,
        entry.source,
        ...entry.actions,
      ]
        .join(' ')
        .toLowerCase()

      const queryMatches = !query || haystack.includes(query)

      return filterMatches && queryMatches
    })
  }, [activeFilter, search])

  const printableEntries = useMemo(
    () => protocolEntries.filter((entry) => printableProtocolTitles.includes(entry.title)),
    []
  )

  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
            ― Searchable Library ―
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white">Emergency protocol lookup</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
            Search scenarios, industries, or hazards to quickly scan the main response steps.
            These are practical quick references built from standard emergency planning concepts,
            not a replacement for your site-specific emergency action plan.
          </p>
        </div>

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search fire, spill, injury, confined space, storm..."
          className="w-full rounded-full border border-green-400/30 bg-black/60 px-4 py-2 text-white transition placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-green-400 sm:w-96"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {incidentFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              activeFilter === filter
                ? 'border-green-400/40 bg-green-500/15 text-green-300'
                : 'border-white/10 bg-black/40 text-white/70 hover:border-green-400/25 hover:text-white'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mb-8 rounded-2xl border border-white/10 bg-black/40 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-400">
              ― Printable Sheets ―
            </p>
            <h3 className="mt-3 text-xl font-bold text-white">One-page critical protocol sheets</h3>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-white/70">
              Download compact PDF reference sheets for the highest-risk scenarios and keep them with field binders, response stations, or toolbox training packets.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {printableEntries.map((entry) => (
            <button
              key={entry.title}
              type="button"
              onClick={() => downloadProtocolSheet(entry)}
              className="rounded-full border border-green-400/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-300 transition hover:bg-green-500/15 hover:text-green-200"
            >
              Download {entry.title} PDF
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredProtocols.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-white/60">
            No protocols matched that search. Try a broader term like injury, fire, spill, storm, or lockout.
          </div>
        ) : (
          filteredProtocols.map((entry) => (
            <article
              key={entry.title}
              className="rounded-2xl border border-white/10 bg-black/40 p-6 transition hover:border-green-400/25 hover:bg-black/50"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-green-400">
                    <span>{entry.industry}</span>
                    <span className="text-white/35">/</span>
                    <span>{entry.category}</span>
                  </div>
                  <h3 className="mt-3 text-2xl font-bold text-white">{entry.title}</h3>
                </div>

                <a
                  href={entry.officialLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center rounded-full border border-green-400/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-300 transition hover:bg-green-500/15 hover:text-green-200"
                >
                  Official source
                </a>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_1.8fr]">
                <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-400">
                    Trigger or scenario
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/75">{entry.trigger}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-green-400">
                    Based on
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/75">{entry.source}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-400">
                    Immediate response steps
                  </p>
                  <ol className="mt-3 space-y-3 text-sm leading-7 text-white/80">
                    {entry.actions.map((action, index) => (
                      <li key={action} className="flex gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-green-400/25 bg-green-500/10 text-xs font-semibold text-green-300">
                          {index + 1}
                        </span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {entry.relatedStandards?.length ? (
                <div className="mt-5 rounded-2xl border border-white/10 bg-black/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-400">
                    Related standards
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {entry.relatedStandards.map((standard) => (
                      <Link
                        key={standard.label}
                        to={standard.to}
                        className="rounded-full border border-green-400/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-300 transition hover:bg-green-500/15 hover:text-green-200"
                      >
                        {standard.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          ))
        )}
      </div>
    </section>
  )
}

function USStateAgencyLookup() {
  const [selectedState, setSelectedState] = useState('Texas')

  const selectedEntry = useMemo(
    () => usStateLookup.find((entry) => entry.state === selectedState) ?? usStateLookup[0],
    [selectedState]
  )

  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
            ― U.S. State Lookup ―
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white">State-by-state emergency agency finder</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
            Select a U.S. state to jump directly to its official emergency management agency and the matching OSHA or state-plan safety authority. This is meant for planning and escalation support, not as a substitute for calling 911 during an active emergency.
          </p>
        </div>

        <select
          value={selectedState}
          onChange={(event) => setSelectedState(event.target.value)}
          className="w-full rounded-full border border-green-400/30 bg-black/60 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-400 lg:w-80"
        >
          {usStateLookup.map((entry) => (
            <option key={entry.state} value={entry.state}>
              {entry.state}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_1.4fr]">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-green-400">
            Selected jurisdiction
          </div>
          <h3 className="mt-3 text-2xl font-bold text-white">{selectedEntry.state}</h3>
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/50 p-4 text-sm leading-7 text-white/70">
            During an active emergency: call <span className="font-semibold text-white">911</span> first, then notify site leadership, the customer or owner representative if required, and the agency contacts below when your procedure requires it.
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <a
            href={selectedEntry.emergencyHref}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:border-green-400/25 hover:bg-black/50"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-green-400">
              Emergency management
            </div>
            <h3 className="mt-3 text-xl font-bold text-white">{selectedEntry.emergencyAgency}</h3>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Official state-level emergency alerts, disaster coordination, response planning, and recovery resources.
            </p>
          </a>

          <a
            href={selectedEntry.oshaHref}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:border-green-400/25 hover:bg-black/50"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-green-400">
              Safety authority
            </div>
            <h3 className="mt-3 text-xl font-bold text-white">{selectedEntry.oshaAgency}</h3>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Official workplace safety and health resource for reporting, regulatory guidance, and emergency-related worker protection requirements.
            </p>
          </a>
        </div>
      </div>
    </section>
  )
}

function AgencyLookup() {
  const [region, setRegion] = useState('All')

  const filteredAgencies = useMemo(() => {
    if (region === 'All') {
      return agencies
    }

    return agencies.filter((agency) => agency.region === region)
  }, [region])

  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
            ― Agencies & Location Lookup ―
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white">Find the right authority faster</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
            Use this quick filter to narrow official agencies by jurisdiction. For active emergencies,
            always call local emergency services first, then follow your site notification chain.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {['All', 'United States', 'Canada', 'International'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRegion(option)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                region === option
                  ? 'border-green-400/40 bg-green-500/15 text-green-300'
                  : 'border-white/10 bg-black/40 text-white/70 hover:border-green-400/25 hover:text-white'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredAgencies.map((agency) => (
          <a
            key={agency.name}
            href={agency.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:border-green-400/25 hover:bg-black/50"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-green-400">
              {agency.region}
            </div>
            <h3 className="mt-3 text-xl font-bold text-white">{agency.name}</h3>
            <p className="mt-2 text-sm font-medium text-white/70">{agency.type}</p>
            <p className="mt-4 text-sm leading-7 text-white/70">{agency.supports}</p>
            <div className="mt-4 border-t border-white/10 pt-4 text-sm text-white/60">
              {agency.contact}
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

export default function EmergencyProtocols() {
  return (
    <LibraryPageLayout
      eyebrow="― Emergency Response ―"
      title="Emergency Response Protocols"
      description="Searchable cross-industry emergency procedures, agency guidance, and official response resources for high-risk industrial scenarios."
      intro="Built as a fast-use emergency reference: clear actions first, official sources second, and consistent site styling throughout."
      customContent={
        <div className="space-y-12">
          <OverviewPanel />
          <ProtocolLibrary />
          <USStateAgencyLookup />
          <AgencyLookup />
        </div>
      }
      sections={[]}
      links={officialLinks}
    />
  )
}
