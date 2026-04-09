import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import LibraryPageLayout from './LibraryPageLayout'
import {
  addPdfChecklistSection,
  addPdfFooter,
  addPdfHeader,
  addPdfSection,
  createLetterPdf,
  toPdfFileName,
} from '../../utils/pdfExport'

const standardFilters = [
  'All',
  'Fall protection',
  'Welding',
  'Machine safety',
  'Energy control',
  'Electrical',
  'Rigging & cranes',
  'Fire & life safety',
  'Hazmat & shipping',
  'Confined space',
  'Pressure systems',
  'PPE',
]

const projectScopeFilters = ['All', 'Shop', 'Field', 'Maintenance', 'Shipping', 'Office']

const standardsEntries = [
  {
    title: 'Fall protection for construction work',
    industry: 'Construction',
    category: 'Fall protection',
    code: 'OSHA 1926 Subpart M',
    summary:
      'Core fall protection requirements for guardrails, personal fall arrest, covers, edge exposure, and leading-edge work.',
    fieldUse:
      'Use this as the first check when crews are exposed to drops, roof edges, floor openings, steel erection edges, or elevated access systems.',
    watchFor:
      'Common misses include non-rated anchor points, incomplete rescue planning, and using fall arrest where guardrails or access changes should be the first control.',
    officialLink:
      'https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.500',
    projectScopes: ['Field', 'Maintenance'],
  },
  {
    title: 'Steel erection safety requirements',
    industry: 'Construction / Steel',
    category: 'Fall protection',
    code: 'OSHA 1926 Subpart R',
    summary:
      'Steel erection rules covering decking, connectors, hoisting, controlled decking zones, and structural stability during erection.',
    fieldUse:
      'Relevant when steel is actively being flown, connected, decked, stabilized, or when multiple trades are sharing the steel sequence.',
    watchFor:
      'Verify sequence planning, column anchorage, decking control, connector fall exposure, and communication between crane crews and ironworkers.',
    officialLink: 'https://www.osha.gov/steel-erection',
    projectScopes: ['Field'],
  },
  {
    title: 'Scaffold requirements and platform safety',
    industry: 'Construction / Maintenance',
    category: 'Fall protection',
    code: 'OSHA 1926 Subpart L',
    summary:
      'Requirements for scaffold design, loading, access, planking, fall protection, and inspection responsibility.',
    fieldUse:
      'Check this for supported scaffolds, suspended platforms, interior access towers, and temporary work platforms.',
    watchFor:
      'Frequent failures include incomplete planking, improper access, overloaded bays, and daily inspections not being documented or performed.',
    officialLink: 'https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.450',
    projectScopes: ['Field', 'Maintenance'],
  },
  {
    title: 'Structural welding on steel',
    industry: 'Fabrication / Construction',
    category: 'Welding',
    code: 'AWS D1.1',
    summary:
      'Primary structural welding code for steel covering procedure qualification, welder qualification, inspection, and workmanship.',
    fieldUse:
      'Use when reviewing WPS requirements, welder continuity, joint prep, visual inspection expectations, and acceptance criteria on structural steel.',
    watchFor:
      'Common issues include using the wrong filler, skipping preheat checks, welding outside approved procedures, and assuming shop rules carry into field conditions.',
    officialLink: 'https://www.aws.org/standards/page/d11',
    projectScopes: ['Shop', 'Field'],
  },
  {
    title: 'Machine guarding and point-of-operation protection',
    industry: 'Manufacturing',
    category: 'Machine safety',
    code: 'OSHA 1910 Subpart O',
    summary:
      'Machine guarding requirements focused on point-of-operation hazards, rotating parts, nip points, and exposure to moving components.',
    fieldUse:
      'Apply this when reviewing saws, brakes, punches, conveyors, robotic cells, or any operation where personnel work near moving equipment.',
    watchFor:
      'The usual failure is treating removed or bypassed guards as temporary. Another is assuming awareness alone is a substitute for physical guarding.',
    officialLink: 'https://www.osha.gov/machine-guarding',
    projectScopes: ['Shop', 'Maintenance'],
  },
  {
    title: 'Control of hazardous energy',
    industry: 'Manufacturing / Maintenance',
    category: 'Energy control',
    code: 'OSHA 1910.147',
    summary:
      'Lockout and tagout requirements for isolating hazardous energy during servicing, maintenance, setup, and certain adjustment work.',
    fieldUse:
      'Use this for mechanical, electrical, pneumatic, hydraulic, thermal, or gravity-stored energy that could move or re-energize during service.',
    watchFor:
      'Big misses include skipping try-out verification, ignoring stored energy, and using production shortcuts for work that actually qualifies as servicing.',
    officialLink: 'https://www.osha.gov/control-hazardous-energy',
    projectScopes: ['Shop', 'Field', 'Maintenance'],
  },
  {
    title: 'Respiratory protection program requirements',
    industry: 'General industry / Fabrication',
    category: 'PPE',
    code: 'OSHA 1910.134',
    summary:
      'Respiratory protection rules covering selection, medical evaluation, fit testing, maintenance, and written program controls.',
    fieldUse:
      'Use this for welding fume, coating application, dust exposure, silica work, chemical cleaning, and any airborne hazard requiring respirator use.',
    watchFor:
      'Typical failures are using the wrong cartridge, skipping fit tests, poor facial-hair control, and treating voluntary use like a full compliant program.',
    officialLink: 'https://www.osha.gov/respiratory-protection',
    projectScopes: ['Shop', 'Field', 'Maintenance'],
  },
  {
    title: 'Confined space entry requirements',
    industry: 'Manufacturing / Construction / Maintenance',
    category: 'Confined space',
    code: 'OSHA 1910.146',
    summary:
      'Permit-required confined space rules covering hazards, permits, atmospheric testing, rescue provisions, and entry roles.',
    fieldUse:
      'This applies to tanks, pits, vessels, vaults, bins, and similar spaces where entry hazards are created by design, atmosphere, engulfment, or configuration.',
    watchFor:
      'Common breakdowns include poor atmospheric verification, no true rescue capability, and letting routine work blur permit-required hazards.',
    officialLink: 'https://www.osha.gov/confined-spaces',
    projectScopes: ['Field', 'Maintenance'],
  },
  {
    title: 'Electrical safe work expectations',
    industry: 'Construction / Maintenance / Manufacturing',
    category: 'Electrical',
    code: 'NFPA 70E',
    summary:
      'Widely used electrical safety standard for energized work justification, shock and arc flash boundaries, PPE, and safe work planning.',
    fieldUse:
      'Use this when energized troubleshooting, panel access, testing, temporary power work, or electrical maintenance planning is involved.',
    watchFor:
      'Do not confuse availability of PPE with permission to work energized. Justification, boundaries, labeling, and qualified-person status still matter.',
    officialLink: 'https://www.nfpa.org/codes-and-standards/nfpa-70e-standard-development/70e',
    projectScopes: ['Shop', 'Field', 'Maintenance'],
  },
  {
    title: 'Cranes, hoists, and lifting operations',
    industry: 'Construction / Fabrication / Yard operations',
    category: 'Rigging & cranes',
    code: 'OSHA 1926 Subpart CC',
    summary:
      'Construction crane and derrick requirements covering setup, inspections, signaling, operator qualification, and work around power lines.',
    fieldUse:
      'Use for mobile crane picks, structural steel hoisting, rigging planning, critical lifts, and any suspended load exposure on site.',
    watchFor:
      'Frequent misses include ground bearing pressure, power-line clearance, improvised rigging choices, and undefined lift path control.',
    officialLink: 'https://www.osha.gov/cranes-derricks',
    projectScopes: ['Field', 'Shipping'],
  },
  {
    title: 'Rigging hardware and sling practices',
    industry: 'Construction / Fabrication / Shipping',
    category: 'Rigging & cranes',
    code: 'ASME B30.9 / B30.26',
    summary:
      'Recognized standards for slings, shackles, hooks, and below-the-hook lifting hardware used in rigging operations.',
    fieldUse:
      'Useful when reviewing sling choice, inspection frequency, load angle effects, shackle orientation, and hardware working load limits.',
    watchFor:
      'Mistakes usually show up as unverified capacity reductions, damaged sling reuse, side-loading hooks or shackles, and poor center-of-gravity control.',
    officialLink: 'https://www.asme.org/codes-standards/find-codes-standards/b30-9-slings',
    projectScopes: ['Shop', 'Field', 'Shipping'],
  },
  {
    title: 'Fire prevention and life safety planning',
    industry: 'All industries',
    category: 'Fire & life safety',
    code: 'NFPA 1 / NFPA 101',
    summary:
      'Fire code and life safety code references for occupancy hazards, egress, suppression readiness, and emergency planning basics.',
    fieldUse:
      'Use these when reviewing exits, housekeeping, temporary fire exposure, occupancy changes, hot work, or overall building emergency readiness.',
    watchFor:
      'Do not reduce fire readiness to extinguisher placement alone. Egress, separation, alarm function, ignition control, and housekeeping all matter.',
    officialLink: 'https://www.nfpa.org/codes-and-standards',
    projectScopes: ['Shop', 'Field', 'Maintenance', 'Office'],
  },
  {
    title: 'Hazardous materials shipping requirements',
    industry: 'Shipping / Logistics / Manufacturing',
    category: 'Hazmat & shipping',
    code: '49 CFR / PHMSA / IMDG',
    summary:
      'U.S. and international hazmat transport requirements covering packaging, marking, placarding, documentation, and response information.',
    fieldUse:
      'Apply this when shipping chemicals, gases, batteries, fuels, coatings, or any regulated dangerous goods by road, rail, air, or vessel.',
    watchFor:
      'Typical errors are packaging mismatch, incomplete papers, wrong UN identification, and assuming domestic shipping rules match maritime requirements.',
    officialLink: 'https://www.phmsa.dot.gov/hazmat',
    projectScopes: ['Shipping', 'Shop', 'Office'],
  },
  {
    title: 'Pressure piping in process systems',
    industry: 'Process / Manufacturing / Energy',
    category: 'Pressure systems',
    code: 'ASME B31.3',
    summary:
      'Process piping standard covering materials, fabrication, examination, testing, and safe design expectations for pressure systems.',
    fieldUse:
      'Use this for plant piping, skids, process modules, piping modifications, and repairs where pressure integrity and code traceability matter.',
    watchFor:
      'Do not treat field modifications as simple fit-up work. Material traceability, weld procedures, pressure boundaries, and test requirements still apply.',
    officialLink: 'https://www.asme.org/codes-standards/find-codes-standards/b31-3-process-piping',
    projectScopes: ['Shop', 'Field', 'Maintenance'],
  },
  {
    title: 'Personal protective equipment assessment',
    industry: 'All industries',
    category: 'PPE',
    code: 'OSHA 1910 Subpart I',
    summary:
      'PPE requirements for hazard assessment, selection, employee training, and maintenance across general industry work.',
    fieldUse:
      'Use this to verify whether gloves, eye protection, face shields, hearing protection, FR gear, and specialty PPE actually match the real hazard.',
    watchFor:
      'The biggest failure is assuming visible PPE equals compliance. The right type, rating, fit, and training matter more than simply wearing something.',
    officialLink: 'https://www.osha.gov/personal-protective-equipment',
    projectScopes: ['Shop', 'Field', 'Maintenance', 'Shipping', 'Office'],
  },
]

const taskSelectorMap = {
  welding: [
    'AWS D1.1 — Structural Welding Code',
    'OSHA 1910.134 — Respiratory Protection',
    'NFPA 51B — Hot Work Controls',
  ],
  fall: [
    'OSHA 1926 Subpart M — Fall Protection',
    'OSHA 1926 Subpart L — Scaffolds',
    'ANSI Z359 — Fall Protection Code Suite',
  ],
  loto: [
    'OSHA 1910.147 — Lockout / Tagout',
    'NFPA 70E — Electrical Safe Work Planning',
  ],
  lifting: [
    'OSHA 1926 Subpart CC — Cranes and Derricks',
    'ASME B30.9 — Slings',
    'ASME B30.26 — Rigging Hardware',
  ],
  hazmat: [
    '49 CFR / PHMSA — Hazmat Transport',
    'IMO IMDG Code — Dangerous Goods by Sea',
    'OSHA HAZWOPER — Response Readiness',
  ],
  electrical: [
    'NFPA 70E — Electrical Safety',
    'OSHA 1910 Subpart S — Electrical',
    'NFPA 70 — National Electrical Code',
  ],
}

const printableStandardTitles = [
  'Fall protection for construction work',
  'Structural welding on steel',
  'Control of hazardous energy',
  'Confined space entry requirements',
  'Electrical safe work expectations',
]

const agencyBodies = [
  {
    name: 'OSHA',
    region: 'United States',
    type: 'Regulatory safety authority',
    supports:
      'Federal workplace safety standards, interpretations, emphasis programs, reporting obligations, and training resources.',
    href: 'https://www.osha.gov',
  },
  {
    name: 'ANSI',
    region: 'United States',
    type: 'Consensus standards coordination',
    supports:
      'Cross-industry consensus standards used alongside regulations for equipment, systems, testing, and safe work practices.',
    href: 'https://www.ansi.org',
  },
  {
    name: 'NFPA',
    region: 'United States',
    type: 'Fire and electrical standards body',
    supports:
      'Fire codes, hot work planning, life safety, emergency egress, and electrical safety frameworks such as NFPA 70 and 70E.',
    href: 'https://www.nfpa.org',
  },
  {
    name: 'AWS',
    region: 'United States',
    type: 'Welding standards body',
    supports:
      'Welding codes, qualification rules, workmanship expectations, certification programs, and inspection guidance.',
    href: 'https://www.aws.org',
  },
  {
    name: 'AISC',
    region: 'United States',
    type: 'Steel construction authority',
    supports:
      'Structural steel specifications, design references, fabrication guidance, and erection resources.',
    href: 'https://www.aisc.org',
  },
  {
    name: 'ASME',
    region: 'International',
    type: 'Mechanical and pressure systems standards',
    supports:
      'Pressure piping, vessels, lifting devices, mechanical systems, and technical code development across process industries.',
    href: 'https://www.asme.org',
  },
  {
    name: 'API',
    region: 'United States',
    type: 'Process and energy standards',
    supports:
      'Standards for petroleum, process, inspection, fixed equipment, storage, and operational integrity.',
    href: 'https://www.api.org',
  },
  {
    name: 'PHMSA',
    region: 'United States',
    type: 'Hazmat transport authority',
    supports:
      'Hazardous materials transport rules, emergency response guidance, and packaging and shipping requirements.',
    href: 'https://www.phmsa.dot.gov',
  },
  {
    name: 'IMO',
    region: 'International',
    type: 'Maritime standards authority',
    supports:
      'International vessel safety, dangerous goods shipping, and marine transport compliance guidance.',
    href: 'https://www.imo.org',
  },
  {
    name: 'ISO',
    region: 'International',
    type: 'Management and technical standards',
    supports:
      'Quality systems, safety management frameworks, documentation control, and recognized international standardization.',
    href: 'https://www.iso.org',
  },
]

const usJurisdictions = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia',
]

const statePlanAuthorities = {
  Alaska: { name: 'AKOSH', href: 'https://labor.alaska.gov/lss/oshhome.htm', coverage: 'Full state plan.' },
  Arizona: { name: 'ADOSH', href: 'https://www.azica.gov/divisions/adosh', coverage: 'Full state plan.' },
  California: { name: 'Cal/OSHA', href: 'https://www.dir.ca.gov/dosh/', coverage: 'Full state plan.' },
  Connecticut: { name: 'CONN-OSHA / Federal OSHA', href: 'https://portal.ct.gov/dol/divisions/occupational-safety-and-health', coverage: 'Public-sector state plan with federal OSHA private-sector coverage.' },
  Hawaii: { name: 'HIOSH', href: 'https://labor.hawaii.gov/hiosh/', coverage: 'Full state plan.' },
  Illinois: { name: 'Illinois Public Sector Plan / Federal OSHA', href: 'https://labor.illinois.gov/safety/public-safety.html', coverage: 'Public-sector state plan with federal OSHA private-sector coverage.' },
  Indiana: { name: 'IOSHA', href: 'https://www.in.gov/dol/iosha/', coverage: 'Full state plan.' },
  Iowa: { name: 'Iowa OSHA', href: 'https://labor.iowa.gov/iosh', coverage: 'Full state plan.' },
  Kentucky: { name: 'Kentucky OSH', href: 'https://labor.ky.gov/standards/Pages/KOSH.aspx', coverage: 'Full state plan.' },
  Maine: { name: 'Maine Workplace Safety and Health / Federal OSHA', href: 'https://www.maine.gov/labor/bls/whatsnew', coverage: 'Public-sector state plan with federal OSHA private-sector coverage.' },
  Maryland: { name: 'MOSH', href: 'https://www.dllr.state.md.us/labor/mosh/', coverage: 'Full state plan.' },
  Michigan: { name: 'MIOSHA', href: 'https://www.michigan.gov/leo/bureaus-agencies/miosha', coverage: 'Full state plan.' },
  Minnesota: { name: 'MNOSHA', href: 'https://www.dli.mn.gov/business/workplace-safety-and-health/mnosha-compliance', coverage: 'Full state plan.' },
  Nevada: { name: 'Nevada OSHA', href: 'https://dir.nv.gov/OSHA/home/', coverage: 'Full state plan.' },
  'New Jersey': { name: 'PEOSH / Federal OSHA', href: 'https://www.nj.gov/health/workplacehealthandsafety/peosh/', coverage: 'Public-sector state plan with federal OSHA private-sector coverage.' },
  'New Mexico': { name: 'New Mexico OSHA Bureau', href: 'https://www.env.nm.gov/occupational_health_safety/', coverage: 'Full state plan.' },
  'New York': { name: 'PESH / Federal OSHA', href: 'https://dol.ny.gov/public-employee-safety-health-pesh', coverage: 'Public-sector state plan with federal OSHA private-sector coverage.' },
  'North Carolina': { name: 'NC OSH', href: 'https://www.labor.nc.gov/safety-and-health', coverage: 'Full state plan.' },
  Oregon: { name: 'Oregon OSHA', href: 'https://osha.oregon.gov', coverage: 'Full state plan.' },
  'South Carolina': { name: 'SC OSHA', href: 'https://llr.sc.gov/wcc/osha/', coverage: 'Full state plan.' },
  Tennessee: { name: 'TOSHA', href: 'https://www.tn.gov/workforce/injuries-at-work/tosha.html', coverage: 'Full state plan.' },
  Utah: { name: 'UOSH', href: 'https://laborcommission.utah.gov/divisions/uosh/', coverage: 'Full state plan.' },
  Vermont: { name: 'VOSHA', href: 'https://labor.vermont.gov/vosha', coverage: 'Full state plan.' },
  Virginia: { name: 'VOSH', href: 'https://www.doli.virginia.gov/labor-law/vosh-program/', coverage: 'Full state plan.' },
  Washington: { name: 'WA L&I DOSH', href: 'https://www.lni.wa.gov/safety-health/', coverage: 'Full state plan.' },
  Wyoming: { name: 'Wyoming OSHA', href: 'https://wyomingworkforce.org/workers-safety-and-comp/', coverage: 'State-plan coverage for most private and public employment.' },
}

const officialLinks = [
  {
    title: 'OSHA Laws and Regulations',
    description: 'Federal workplace safety standards and regulation index for general industry, construction, and maritime.',
    href: 'https://www.osha.gov/laws-regs',
  },
  {
    title: 'ANSI Standards Portal',
    description: 'Consensus standards coordination across industrial systems, equipment, testing, and safe work practices.',
    href: 'https://www.ansi.org',
  },
  {
    title: 'NFPA Codes and Standards',
    description: 'Official fire, life safety, hot work, electrical, and emergency-planning code references.',
    href: 'https://www.nfpa.org/codes-and-standards',
  },
  {
    title: 'AWS Standards',
    description: 'Official welding code listings, qualification references, and welding-related standards.',
    href: 'https://www.aws.org/standards',
  },
  {
    title: 'AISC Standards and Specifications',
    description: 'Structural steel standards, design references, and steel construction resources.',
    href: 'https://www.aisc.org/standards/',
  },
  {
    title: 'ASME Codes and Standards',
    description: 'Mechanical, piping, pressure equipment, and lifting standards used across process industries.',
    href: 'https://www.asme.org/codes-standards',
  },
  {
    title: 'PHMSA Hazardous Materials',
    description: 'Hazmat transport rules, emergency response guidance, and shipping compliance references.',
    href: 'https://www.phmsa.dot.gov/hazmat',
  },
  {
    title: 'IMO Dangerous Goods and Maritime Safety',
    description: 'International maritime safety requirements and dangerous goods transport references.',
    href: 'https://www.imo.org/en/OurWork/Safety/Pages/DangerousGoodsDefault.aspx',
  },
]

const checklistTemplates = [
  {
    id: 'shop',
    title: 'Shop Pre-Job Standards Checklist',
    audience: 'Fabrication, production, machine areas, welding bays',
    focus: ['Machine guarding', 'LOTO', 'Welding code and hot work', 'PPE and ventilation', 'Material handling'],
  },
  {
    id: 'field',
    title: 'Field Pre-Job Standards Checklist',
    audience: 'Construction, installation, service crews, steel erection',
    focus: ['Fall protection', 'Rigging and lifting', 'Scaffold/access', 'Site emergency readiness', 'Temporary power'],
  },
  {
    id: 'maintenance',
    title: 'Maintenance Pre-Job Standards Checklist',
    audience: 'Shutdowns, repairs, troubleshooting, service work',
    focus: ['Energy isolation', 'Electrical boundaries', 'Confined space', 'Line breaking', 'Return-to-service checks'],
  },
  {
    id: 'shipping',
    title: 'Shipping and Logistics Standards Checklist',
    audience: 'Warehousing, transport prep, loading, hazmat movement',
    focus: ['Hazmat documentation', 'Load securement', 'Lifting hardware', 'Labels and placards', 'Vehicle and route coordination'],
  },
  {
    id: 'office',
    title: 'Office and Planning Standards Checklist',
    audience: 'Project managers, coordinators, estimators, supervisors',
    focus: ['Current code edition', 'Jurisdiction check', 'Client specifications', 'Pre-job briefing content', 'Inspection and record planning'],
  },
]

function downloadChecklistTemplate(template) {
  const { pdf, margin, pageWidth, pageHeight, maxWidth } = createLetterPdf()
  let cursorY = 48

  cursorY = addPdfHeader(pdf, {
    margin,
    maxWidth,
    cursorY,
    eyebrow: 'PRE-JOB STANDARDS CHECKLIST',
    title: template.title,
    subtitle: `Audience: ${template.audience}`,
  })

  cursorY = addPdfSection(pdf, {
    cursorY: cursorY + 12,
    margin,
    maxWidth,
    pageHeight,
    label: 'USE THIS TEMPLATE FOR',
    body: 'Pre-job planning, supervisor review, toolbox discussions, and documentation of the standards and code topics that need to be confirmed before work starts.',
  })

  cursorY = addPdfChecklistSection(pdf, {
    cursorY,
    margin,
    maxWidth,
    pageWidth,
    pageHeight,
    label: 'CHECKLIST ITEMS',
    items: template.focus,
  })

  cursorY = addPdfSection(pdf, {
    cursorY: cursorY + 8,
    margin,
    maxWidth,
    pageHeight,
    label: 'JOB INFORMATION',
    body: 'Project: ____________________\nLocation: ____________________\nSupervisor: ____________________\nDate: ____________________\nApplicable standards and revisions: ____________________',
    minHeight: 92,
  })

  addPdfFooter(pdf, {
    cursorY,
    margin,
    maxWidth,
    pageHeight,
    text: 'This template is intended as a printable planning sheet. Final pre-job requirements should also reflect customer specifications, permits, local jurisdiction rules, and your internal procedures.',
  })

  pdf.save(`${toPdfFileName(template.id)}-pre-job-standards-checklist.pdf`)
}

function downloadStandardSheet(entry) {
  const { pdf, margin, pageHeight, maxWidth } = createLetterPdf()
  let cursorY = 48

  cursorY = addPdfHeader(pdf, {
    margin,
    maxWidth,
    cursorY,
    eyebrow: 'INDUSTRY STANDARDS QUICK SHEET',
    title: entry.title,
  })

  cursorY = addPdfSection(pdf, {
    cursorY: cursorY + 22,
    margin,
    maxWidth,
    pageHeight,
    label: 'INDUSTRY / CATEGORY',
    body: `${entry.industry} / ${entry.category}`,
    minHeight: 70,
  })
  cursorY = addPdfSection(pdf, {
    cursorY,
    margin,
    maxWidth,
    pageHeight,
    label: 'CODE / STANDARD',
    body: entry.code,
    minHeight: 70,
  })
  cursorY = addPdfSection(pdf, {
    cursorY,
    margin,
    maxWidth,
    pageHeight,
    label: 'WHAT IT COVERS',
    body: entry.summary,
    minHeight: 70,
  })
  cursorY = addPdfSection(pdf, {
    cursorY,
    margin,
    maxWidth,
    pageHeight,
    label: 'FIELD APPLICATION',
    body: entry.fieldUse,
    minHeight: 70,
  })
  cursorY = addPdfSection(pdf, {
    cursorY,
    margin,
    maxWidth,
    pageHeight,
    label: 'COMMON WATCH-OUT',
    body: entry.watchFor,
    minHeight: 70,
  })
  cursorY = addPdfSection(pdf, {
    cursorY,
    margin,
    maxWidth,
    pageHeight,
    label: 'OFFICIAL SOURCE',
    body: entry.officialLink,
    minHeight: 70,
  })

  addPdfFooter(pdf, {
    cursorY,
    margin,
    maxWidth,
    pageHeight,
    text: 'This quick sheet is for field reference only. Final decisions should always follow your project specifications, site procedures, customer requirements, and the current official edition of the applicable standard.',
  })

  pdf.save(`${toPdfFileName(entry.code)}-standard-sheet.pdf`)
}

function OverviewPanel() {
  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
          ― Standards Overview ―
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white">
          Better standards use starts with faster recognition
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <h3 className="text-lg font-semibold text-white">What this hub is for</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">
            This page is a field-oriented shortcut into the standards most often touched by construction, fabrication, manufacturing, maintenance, and shipping work.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <h3 className="text-lg font-semibold text-white">How to use it</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Start with the task selector or category filters, confirm the most likely governing code, then move to the official body for the current edition and project-specific detail.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <h3 className="text-lg font-semibold text-white">Where teams go wrong</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">
            The usual failure is assuming a familiar task means the rules are unchanged. Scope, environment, edition, and jurisdiction can shift the controlling requirement fast.
          </p>
        </div>
      </div>
    </section>
  )
}

function StandardsSelector() {
  const [selection, setSelection] = useState('welding')

  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
          ― Quick Selector ―
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white">What type of work are you doing?</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
          Pick the work type to quickly narrow the standards that most often apply before you dive into the searchable library.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {[
          ['welding', 'Welding'],
          ['fall', 'Working at Height'],
          ['loto', 'Lockout / Tagout'],
          ['lifting', 'Lifting / Rigging'],
          ['hazmat', 'Hazmat / Shipping'],
          ['electrical', 'Electrical Work'],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelection(key)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              selection === key
                ? 'border-green-400/40 bg-green-500/15 text-green-300'
                : 'border-white/10 bg-black/40 text-white/75 hover:border-green-400/25 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-green-400/20 bg-black/60 p-5">
        <h3 className="text-lg font-semibold text-green-400">Recommended standards to check first</h3>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-7 text-white/80">
          {taskSelectorMap[selection].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ChecklistTemplatesPanel() {
  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
          ― Downloadable Templates ―
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white">Pre-job standards checklist templates</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
          Download printable PDF-style checklist templates for the most common project contexts so teams can document standards review before work begins.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {checklistTemplates.map((template) => (
          <div
            key={template.id}
            className="rounded-2xl border border-white/10 bg-black/40 p-5"
          >
            <h3 className="text-xl font-bold text-white">{template.title}</h3>
            <p className="mt-3 text-sm leading-7 text-white/70">{template.audience}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-6 text-white/75">
              {template.focus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => downloadChecklistTemplate(template)}
              className="mt-5 rounded-full border border-green-400/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-300 transition hover:bg-green-500/15 hover:text-green-200"
            >
              Download PDF
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

function StandardsLibrary({ initialSearch = '', initialFilter = 'All', initialScope = 'All' }) {
  const [search, setSearch] = useState(initialSearch)
  const [activeFilter, setActiveFilter] = useState(initialFilter)
  const [activeScope, setActiveScope] = useState(initialScope)

  useEffect(() => {
    setSearch(initialSearch)
    setActiveFilter(initialFilter)
    setActiveScope(initialScope)
  }, [initialFilter, initialScope, initialSearch])

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase()

    return standardsEntries.filter((entry) => {
      const filterMatches = activeFilter === 'All' || entry.category === activeFilter
      const scopeMatches =
        activeScope === 'All' || (entry.projectScopes ?? []).includes(activeScope)
      const haystack = [
        entry.title,
        entry.industry,
        entry.category,
        entry.code,
        entry.summary,
        entry.fieldUse,
        entry.watchFor,
        ...(entry.projectScopes ?? []),
      ]
        .join(' ')
        .toLowerCase()

      const queryMatches = !query || haystack.includes(query)

      return filterMatches && scopeMatches && queryMatches
    })
  }, [activeFilter, activeScope, search])

  const printableEntries = useMemo(
    () => standardsEntries.filter((entry) => printableStandardTitles.includes(entry.title)),
    []
  )

  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
            ― Searchable Library ―
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white">Standards and code lookup</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
            Search by standard number, hazard, industry, or work type. These summaries are built to make the standard easier to find, not to replace the official text.
          </p>
        </div>

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search welding, rigging, 1910.147, confined space..."
          className="w-full rounded-full border border-green-400/30 bg-black/60 px-4 py-2 text-white transition placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-green-400 sm:w-96"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {standardFilters.map((filter) => (
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

      <div className="mb-8 flex flex-wrap gap-3">
        {projectScopeFilters.map((scope) => (
          <button
            key={scope}
            type="button"
            onClick={() => setActiveScope(scope)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              activeScope === scope
                ? 'border-green-400/40 bg-green-500/15 text-green-300'
                : 'border-white/10 bg-black/40 text-white/70 hover:border-green-400/25 hover:text-white'
            }`}
          >
            {scope}
          </button>
        ))}
      </div>

      <div className="mb-8 rounded-2xl border border-white/10 bg-black/40 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-400">
          ― Printable Sheets ―
        </p>
        <h3 className="mt-3 text-xl font-bold text-white">One-page core standard sheets</h3>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-white/70">
          Download the most common field references as PDFs for binders, planning boards, toolbox talks, or supervisor packets.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {printableEntries.map((entry) => (
            <button
              key={entry.title}
              type="button"
              onClick={() => downloadStandardSheet(entry)}
              className="rounded-full border border-green-400/25 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-300 transition hover:bg-green-500/15 hover:text-green-200"
            >
              Download {entry.code} PDF
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredEntries.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-white/60">
            No standards matched that search. Try broader terms like OSHA, welding, fall, lockout, crane, or NFPA.
          </div>
        ) : (
          filteredEntries.map((entry) => (
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
                  <div className="mt-3 inline-flex rounded-full border border-green-400/20 bg-green-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-green-300">
                    {entry.code}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {entry.projectScopes.map((scope) => (
                      <span
                        key={scope}
                        className="rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
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

              <div className="mt-5 grid gap-5 lg:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-400">What it covers</p>
                  <p className="mt-3 text-sm leading-7 text-white/75">{entry.summary}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-400">Field application</p>
                  <p className="mt-3 text-sm leading-7 text-white/75">{entry.fieldUse}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-400">Watch for</p>
                  <p className="mt-3 text-sm leading-7 text-white/75">{entry.watchFor}</p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

function StatePlanLookup() {
  const [selectedState, setSelectedState] = useState('Texas')

  const selectedAuthority = useMemo(() => {
    const authority = statePlanAuthorities[selectedState]

    if (authority) {
      return authority
    }

    return {
      name: 'Federal OSHA',
      href: `https://www.osha.gov/${selectedState.toLowerCase().replace(/\s+/g, '-')}`,
      coverage: 'Federal OSHA coverage for most private-sector and federal employment.',
    }
  }, [selectedState])

  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
            ― U.S. Jurisdiction Lookup ―
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white">OSHA and state-plan finder</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
            Select a state to check whether the work is primarily under federal OSHA or a state plan, then use the authority page to confirm local emphasis, interpretations, and reporting expectations.
          </p>
        </div>

        <select
          value={selectedState}
          onChange={(event) => setSelectedState(event.target.value)}
          className="w-full rounded-full border border-green-400/30 bg-black/60 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-400 lg:w-80"
        >
          {usJurisdictions.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.5fr]">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-green-400">Selected jurisdiction</div>
          <h3 className="mt-3 text-2xl font-bold text-white">{selectedState}</h3>
          <p className="mt-4 text-sm leading-7 text-white/70">
            Standards use is not just about the code body. Enforcement and interpretation can shift by jurisdiction, especially where state plans or public-sector programs apply.
          </p>
        </div>

        <a
          href={selectedAuthority.href}
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:border-green-400/25 hover:bg-black/50"
        >
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-green-400">Safety authority</div>
          <h3 className="mt-3 text-xl font-bold text-white">{selectedAuthority.name}</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">{selectedAuthority.coverage}</p>
          <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-7 text-white/60">
            Use this authority link to verify local program detail, reporting expectations, interpretation letters, and state-specific enforcement emphasis.
          </p>
        </a>
      </div>
    </section>
  )
}

function StandardsBodiesLookup() {
  const [region, setRegion] = useState('All')

  const filteredBodies = useMemo(() => {
    if (region === 'All') {
      return agencyBodies
    }

    return agencyBodies.filter((body) => body.region === region)
  }, [region])

  return (
    <section className="rounded-[1.75rem] border border-green-500/15 bg-black/50 p-8 shadow-[0_0_35px_rgba(34,197,94,0.06)]">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">
            ― Standards Bodies ―
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white">Find the right code authority</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
            Use this to determine whether you should be looking at a regulator, a consensus body, a fire and electrical code publisher, or an international shipping authority.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {['All', 'United States', 'International'].map((option) => (
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
        {filteredBodies.map((body) => (
          <a
            key={body.name}
            href={body.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:border-green-400/25 hover:bg-black/50"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-green-400">{body.region}</div>
            <h3 className="mt-3 text-xl font-bold text-white">{body.name}</h3>
            <p className="mt-2 text-sm font-medium text-white/70">{body.type}</p>
            <p className="mt-4 text-sm leading-7 text-white/70">{body.supports}</p>
          </a>
        ))}
      </div>
    </section>
  )
}

export default function IndustryStandards() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const initialSearch = searchParams.get('query') ?? ''
  const initialFilter = searchParams.get('filter') ?? 'All'
  const initialScope = searchParams.get('scope') ?? 'All'

  return (
    <LibraryPageLayout
      eyebrow="― Standards & Codes ―"
      title="Industry Standards Quick Reference"
      description="Searchable cross-industry standards, code bodies, and jurisdiction references for construction, fabrication, manufacturing, maintenance, and shipping work."
      intro="Built as a fast-use standards hub: identify the likely governing code quickly, understand where it applies in the field, and jump to the official source without losing the site’s established styling."
      customContent={
        <div className="space-y-12">
          <OverviewPanel />
          <StandardsSelector />
          <ChecklistTemplatesPanel />
          <StandardsLibrary
            initialSearch={initialSearch}
            initialFilter={initialFilter}
            initialScope={initialScope}
          />
          <StatePlanLookup />
          <StandardsBodiesLookup />
        </div>
      }
      sections={[]}
      links={officialLinks}
    />
  )
}
