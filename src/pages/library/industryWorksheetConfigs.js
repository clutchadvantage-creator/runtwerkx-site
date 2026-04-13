import {
  AlertTriangle,
  CheckSquare,
  ClipboardCheck,
  FileText,
  HardHat,
  ShieldCheck,
  Truck,
} from 'lucide-react'

export const MANUFACTURING_WORKSHEET_CONFIG = {
  industryName: 'Manufacturing',
  pageTitle: 'Manufacturing Worksheets',
  pageUrl: 'https://runtwerkx.com/knowledge-library/manufacturing/worksheets',
  backgroundImageSrc: '/images/manufacturing.png',
  draftStorageKey: 'runtwerkx-manufacturing-worksheet-drafts',
  offlineActionQueueKey: 'runtwerkx-manufacturing-offline-action-queue',
  offlineActionHistoryKey: 'runtwerkx-manufacturing-offline-action-history',
  sourceLabel: 'RuntWerkx Manufacturing Worksheets',
  pdfHeaderTitle: 'RuntWerkx Manufacturing Worksheet',
  metaDescription:
    'Fill, sign, validate, print, export branded PDFs, and move worksheet drafts for manufacturing forms covering startup checks, changeovers, quality holds, receiving, and equipment readiness.',
  parentPath: '/knowledge-library/manufacturing',
  parentLabel: 'Back to Manufacturing',
  heroEyebrow: '― Manufacturing Tools ―',
  heroDescription:
    'Fill, sign, save locally, validate, print, export branded PDFs, and share production-ready worksheets used in daily manufacturing work.',
  heroSubtext:
    'These sheets are built for line startup checks, changeovers, quality hold control, material receiving, equipment readiness, and maintenance handoff across real plant-floor operations.',
  libraryEyebrow: '― Worksheet Library ―',
  libraryTitle: 'Production forms operators, leads, and supervisors can move fast',
  libraryDescription:
    'Pick a worksheet, complete it in the browser, capture handwritten signatures, validate required fields, export a branded PDF, move one worksheet or the full draft pack between devices, print it, or download a filled HTML copy.',
  draftPackFilenamePrefix: 'runtwerkx-manufacturing-drafts',
  worksheets: [
    {
      key: 'line-startup-checklist',
      title: 'Line Startup Checklist',
      eyebrow: 'Shift Readiness',
      icon: ClipboardCheck,
      description:
        'Use this worksheet before production begins to confirm staffing, tooling, materials, quality references, and first-piece expectations are aligned.',
      sections: [
        {
          title: 'Shift Information',
          rows: [
            { type: 'field', label: 'Plant / Line', inputType: 'text', required: true },
            { type: 'field', label: 'Date', inputType: 'date', required: true },
            { type: 'field', label: 'Shift', inputType: 'select', options: ['First', 'Second', 'Third', 'Weekend'], required: true },
            { type: 'field', label: 'Team Lead', inputType: 'signature', required: true },
            { type: 'field', label: 'Current Product / SKU', inputType: 'text', required: true },
          ],
        },
        {
          title: 'Startup Checks',
          rows: [
            { type: 'check', label: 'Active work instructions and revision level are confirmed at the station.' },
            { type: 'check', label: 'Material, labels, tooling, and fixtures are staged for the opening run.' },
            { type: 'check', label: 'First-piece quality checks and sample limits are understood.' },
            { type: 'check', label: 'Downtime escalation path and support contacts are known for the shift.' },
            { type: 'check', label: 'Safety devices, guards, and housekeeping are acceptable for startup.' },
          ],
        },
        {
          title: 'Issues / Constraints',
          rows: [{ type: 'textarea', label: 'Issues / Constraints', placeholder: 'List shortages, machine concerns, or process risks before startup.', rows: 5 }],
        },
      ],
    },
    {
      key: 'production-changeover-sheet',
      title: 'Production Changeover Sheet',
      eyebrow: 'Setup Control',
      icon: AlertTriangle,
      description:
        'Use this worksheet when changing products, tooling, or setups so the next run starts with the right references, checks, and handoff visibility.',
      sections: [
        {
          title: 'Changeover Details',
          rows: [
            { type: 'field', label: 'Line / Cell', inputType: 'text', required: true },
            { type: 'field', label: 'From Product', inputType: 'text', required: true },
            { type: 'field', label: 'To Product', inputType: 'text', required: true },
            { type: 'field', label: 'Changeover Start', inputType: 'time', required: true },
            { type: 'field', label: 'Responsible Lead', inputType: 'signature', required: true },
          ],
        },
        {
          title: 'Changeover Checks',
          rows: [
            { type: 'check', label: 'Old components, labels, and staging material were cleared from the station.' },
            { type: 'check', label: 'Tooling, fixtures, recipes, and machine settings match the incoming product.' },
            { type: 'check', label: 'Quality sample requirements and verification plan are visible at startup.' },
            { type: 'check', label: 'Maintenance or setup concerns were resolved before release to production.' },
          ],
        },
        {
          title: 'Changeover Notes',
          rows: [{ type: 'textarea', label: 'Changeover Notes', placeholder: 'Record delays, setup corrections, or carryover concerns.', rows: 5 }],
        },
      ],
    },
    {
      key: 'quality-hold-log',
      title: 'Quality Hold Log',
      eyebrow: 'Containment Tracking',
      icon: ShieldCheck,
      description:
        'Use this worksheet to document product holds, suspect quantity, disposition, and release steps while the issue is still contained.',
      sections: [
        {
          title: 'Hold Information',
          rows: [
            { type: 'field', label: 'Part / SKU', inputType: 'text', required: true },
            { type: 'field', label: 'Lot / Batch', inputType: 'text', required: true },
            { type: 'field', label: 'Date Opened', inputType: 'date', required: true },
            { type: 'field', label: 'Quality Lead', inputType: 'signature', required: true },
          ],
        },
        {
          title: 'Hold Entries',
          rows: [
            {
              type: 'table',
              columns: [
                { label: 'Area / Cell', inputType: 'text', required: true },
                { label: 'Qty', inputType: 'number', required: true },
                { label: 'Issue', inputType: 'text', required: true },
                { label: 'Disposition', inputType: 'text', required: true },
              ],
              rowCount: 5,
            },
          ],
        },
        {
          title: 'Containment / Release Notes',
          rows: [{ type: 'textarea', label: 'Containment / Release Notes', placeholder: 'Document sorting, rework, MRB direction, or release approval notes.', rows: 5 }],
        },
      ],
    },
    {
      key: 'delivery-inspection-sheet',
      title: 'Receiving Inspection Sheet',
      eyebrow: 'Incoming Material Control',
      icon: Truck,
      description:
        'Use this worksheet to inspect inbound material for quantity, condition, paperwork, labeling, and routing before it disappears into production flow.',
      sections: [
        {
          title: 'Receiving Information',
          rows: [
            { type: 'field', label: 'Plant / Receiving Area', inputType: 'text', required: true },
            { type: 'field', label: 'Date Received', inputType: 'date', required: true },
            { type: 'field', label: 'Time Received', inputType: 'time', required: true },
            { type: 'field', label: 'Supplier / Carrier', inputType: 'text', required: true },
            { type: 'field', label: 'PO / Packing Slip', inputType: 'text', required: true },
            { type: 'field', label: 'Received By', inputType: 'signature', required: true },
          ],
        },
        {
          title: 'Receiving Checks',
          rows: [
            { type: 'check', label: 'Quantity matches the purchase order and packing slip.' },
            { type: 'check', label: 'Packaging and pallets arrived without visible damage.' },
            { type: 'check', label: 'Labels, lot IDs, or cert packages are present as required.' },
            { type: 'check', label: 'Material was routed to the correct stock or inspection area.' },
            { type: 'check', label: 'Shortages, overages, or damage were photographed and reported.' },
          ],
        },
        {
          title: 'Exceptions / Notes',
          rows: [{ type: 'textarea', label: 'Exceptions / Notes', placeholder: 'Record shortages, damaged packaging, or missing certs.', rows: 5 }],
        },
      ],
    },
    {
      key: 'equipment-checklist',
      title: 'Machine Readiness Checklist',
      eyebrow: 'Equipment Verification',
      icon: CheckSquare,
      description:
        'Use this worksheet for pre-shift machine checks so guards, controls, condition, and open defects are visible before production starts.',
      sections: [
        {
          title: 'Machine Information',
          rows: [
            { type: 'field', label: 'Machine / Cell ID', inputType: 'text', required: true },
            { type: 'field', label: 'Operator / Technician', inputType: 'signature', required: true },
            { type: 'field', label: 'Date', inputType: 'date', required: true },
            { type: 'field', label: 'Shift', inputType: 'select', options: ['Pre-Shift', 'Mid-Shift', 'Post-Shift'], required: true },
            { type: 'field', label: 'Current Job / Product', inputType: 'text', required: true },
            { type: 'field', label: 'Hour Meter / Cycle Count', inputType: 'number' },
          ],
        },
        {
          title: 'Condition Checks',
          rows: [
            { type: 'check', label: 'Guards, interlocks, and emergency stop functions were verified.' },
            { type: 'check', label: 'Fluids, air, lubrication, and visible leaks were checked.' },
            { type: 'check', label: 'Fixtures, tooling, sensors, and wear items are serviceable.' },
            { type: 'check', label: 'Active setup parameters and documents match the scheduled run.' },
            { type: 'check', label: 'Any defects were reported or locked out before production.' },
          ],
        },
        {
          title: 'Defects / Repairs / Remarks',
          rows: [{ type: 'textarea', label: 'Defects / Repairs / Remarks', placeholder: 'Describe maintenance requests, adjustments, or hold conditions.', rows: 5 }],
        },
      ],
    },
  ],
}

export const SHIPPING_WORKSHEET_CONFIG = {
  industryName: 'Shipping',
  pageTitle: 'Shipping Worksheets',
  pageUrl: 'https://runtwerkx.com/knowledge-library/shipping/worksheets',
  backgroundImageSrc: '/images/shipping.png',
  draftStorageKey: 'runtwerkx-shipping-worksheet-drafts',
  offlineActionQueueKey: 'runtwerkx-shipping-offline-action-queue',
  offlineActionHistoryKey: 'runtwerkx-shipping-offline-action-history',
  sourceLabel: 'RuntWerkx Shipping Worksheets',
  pdfHeaderTitle: 'RuntWerkx Shipping Worksheet',
  metaDescription:
    'Fill, sign, validate, print, export branded PDFs, and move worksheet drafts for shipping forms covering outbound readiness, trucking dispatch, rail release, maritime container handoff, air cargo acceptance, claims and OS&D review, delivery intake, and equipment checks.',
  parentPath: '/knowledge-library/shipping',
  parentLabel: 'Back to Shipping',
  heroEyebrow: '― Shipping Tools ―',
  heroDescription:
    'Fill, sign, save locally, validate, print, export branded PDFs, and share shipping worksheets used in outbound, trucking, railway, maritime, air cargo, receiving, packaging, hazmat, and export operations.',
  heroSubtext:
    'These sheets are built for shipment readiness, trucking dispatch, railcar release, maritime container handoff, air cargo acceptance, hazmat review, export documentation, claims and OS&D investigation, delivery receiving, and forklift or yard-equipment checks.',
  libraryEyebrow: '― Worksheet Library ―',
  libraryTitle: 'Shipping forms crews can fill, sign, and hand off cleanly across every major freight mode',
  libraryDescription:
    'Pick a worksheet, complete it in the browser, capture handwritten signatures, validate key fields, export a branded PDF, move one worksheet or the full draft pack between devices, print it, or download a filled HTML copy for trucking, rail, maritime, air, hazmat, export, and general shipping workflows.',
  draftPackFilenamePrefix: 'runtwerkx-shipping-drafts',
  worksheets: [
    {
      key: 'outbound-shipment-checklist',
      title: 'Outbound Shipment Checklist',
      eyebrow: 'Shipment Readiness',
      icon: ClipboardCheck,
      description:
        'Use this worksheet before a load leaves the dock to confirm packaging, labels, paperwork, routing, and customer instructions are aligned.',
      sections: [
        {
          title: 'Shipment Information',
          rows: [
            { type: 'field', label: 'Shipment / Order', inputType: 'text', required: true },
            { type: 'field', label: 'Carrier', inputType: 'text', required: true },
            { type: 'field', label: 'Pickup Date', inputType: 'date', required: true },
            { type: 'field', label: 'Dock Lead', inputType: 'signature', required: true },
            { type: 'field', label: 'Destination', inputType: 'text', required: true },
          ],
        },
        {
          title: 'Readiness Checks',
          rows: [
            { type: 'check', label: 'Packaging method matches the shipment mode and damage risk.' },
            { type: 'check', label: 'Labels, paperwork, and shipment IDs match the customer instruction.' },
            { type: 'check', label: 'Counts, pallets, and piece totals were verified before carrier handoff.' },
            { type: 'check', label: 'Special handling, securement, or temperature instructions are attached to the load.' },
            { type: 'check', label: 'Photos or condition records were captured when required.' },
          ],
        },
        {
          title: 'Shipment Notes',
          rows: [{ type: 'textarea', label: 'Shipment Notes', placeholder: 'Record late changes, securement notes, or carrier exceptions.', rows: 5 }],
        },
      ],
    },
    {
      key: 'trucking-dispatch-handoff',
      title: 'Trucking Dispatch & Pickup Handoff',
      eyebrow: 'Highway Freight Control',
      icon: Truck,
      description:
        'Use this worksheet when a truckload or LTL move is being dispatched so appointment timing, trailer condition, route notes, and driver handoff stay visible.',
      sections: [
        {
          title: 'Dispatch Information',
          rows: [
            { type: 'field', label: 'Shipment / Load ID', inputType: 'text', required: true },
            { type: 'field', label: 'Carrier / Broker', inputType: 'text', required: true },
            { type: 'field', label: 'Driver Name', inputType: 'text' },
            { type: 'field', label: 'Trailer / Equipment Type', inputType: 'text', required: true },
            { type: 'field', label: 'Pickup Appointment', inputType: 'time', required: true },
            { type: 'field', label: 'Dispatch Lead', inputType: 'signature', required: true },
          ],
        },
        {
          title: 'Dispatch and Handoff Checks',
          rows: [
            { type: 'check', label: 'Pickup number, destination, and route notes match the tender or dispatch instruction.' },
            { type: 'check', label: 'Trailer condition, cleanliness, and load suitability were checked before loading.' },
            { type: 'check', label: 'Seal, securement, stop sequence, and special-handling instructions were communicated to the driver.' },
            { type: 'check', label: 'Bills, BOL details, and customer paperwork are complete and match the load.' },
            { type: 'check', label: 'Detention risk, late changes, or dock constraints were documented before release.' },
          ],
        },
        {
          title: 'Dispatch Notes / Exceptions',
          rows: [{ type: 'textarea', label: 'Dispatch Notes / Exceptions', placeholder: 'Record appointment changes, trailer issues, route restrictions, or customer instructions.', rows: 5 }],
        },
      ],
    },
    {
      key: 'railcar-loading-release-sheet',
      title: 'Railcar / Intermodal Loading Release Sheet',
      eyebrow: 'Railway Freight Control',
      icon: FileText,
      description:
        'Use this worksheet for rail or intermodal moves so equipment suitability, weight distribution, securement, and release instructions are checked before handoff.',
      sections: [
        {
          title: 'Rail Shipment Information',
          rows: [
            { type: 'field', label: 'Shipment / Rail Reference', inputType: 'text', required: true },
            { type: 'field', label: 'Rail Carrier / Terminal', inputType: 'text', required: true },
            { type: 'field', label: 'Railcar / Container ID', inputType: 'text', required: true },
            { type: 'field', label: 'Release Date', inputType: 'date', required: true },
            { type: 'field', label: 'Release Time', inputType: 'time', required: true },
            { type: 'field', label: 'Responsible Lead', inputType: 'signature', required: true },
          ],
        },
        {
          title: 'Rail Release Checks',
          rows: [
            { type: 'check', label: 'Railcar or intermodal equipment was inspected and is suitable for the commodity and loading method.' },
            { type: 'check', label: 'Weight distribution, blocking, bracing, and securement were checked before release.' },
            { type: 'check', label: 'Waybill details, routing instructions, and interchange references match the shipment plan.' },
            { type: 'check', label: 'Placards, labels, seals, or documentation were applied as required.' },
            { type: 'check', label: 'Terminal cut-off, siding timing, or interchange constraints were documented.' },
          ],
        },
        {
          title: 'Rail Notes / Constraints',
          rows: [{ type: 'textarea', label: 'Rail Notes / Constraints', placeholder: 'Record clearance concerns, securement notes, terminal timing, or release exceptions.', rows: 5 }],
        },
      ],
    },
    {
      key: 'maritime-container-handoff',
      title: 'Maritime Container Handoff Sheet',
      eyebrow: 'Ocean Freight Control',
      icon: ShieldCheck,
      description:
        'Use this worksheet when stuffing or releasing an ocean container so container condition, booking details, seals, and export handoff requirements stay controlled.',
      sections: [
        {
          title: 'Container Information',
          rows: [
            { type: 'field', label: 'Booking / Shipment Reference', inputType: 'text', required: true },
            { type: 'field', label: 'Steamship Line / Forwarder', inputType: 'text', required: true },
            { type: 'field', label: 'Container Number', inputType: 'text', required: true },
            { type: 'field', label: 'Seal Number', inputType: 'text' },
            { type: 'field', label: 'Port / Terminal', inputType: 'text', required: true },
            { type: 'field', label: 'Container Lead', inputType: 'signature', required: true },
          ],
        },
        {
          title: 'Container Handoff Checks',
          rows: [
            { type: 'check', label: 'Container condition, cleanliness, doors, and floor were inspected before loading.' },
            { type: 'check', label: 'Cargo was blocked, braced, protected from moisture, and loaded to fit vessel transit risk.' },
            { type: 'check', label: 'Booking references, export paperwork, and port cut-off details match the shipment plan.' },
            { type: 'check', label: 'Seal application, weight declaration, and piece count were verified before release.' },
            { type: 'check', label: 'Any customs, inspection, or terminal constraints were captured below.' },
          ],
        },
        {
          title: 'Maritime Notes / Export Exceptions',
          rows: [{ type: 'textarea', label: 'Maritime Notes / Export Exceptions', placeholder: 'Record VGM issues, port cut-off risks, customs holds, or container-condition concerns.', rows: 5 }],
        },
      ],
    },
    {
      key: 'air-cargo-acceptance-checklist',
      title: 'Air Cargo Acceptance Checklist',
      eyebrow: 'Air Freight Readiness',
      icon: AlertTriangle,
      description:
        'Use this worksheet before tendering air freight so airwaybill data, dimensions, screening status, and packaging acceptance checks are complete.',
      sections: [
        {
          title: 'Air Shipment Information',
          rows: [
            { type: 'field', label: 'Shipment / AWB Reference', inputType: 'text', required: true },
            { type: 'field', label: 'Airline / Forwarder', inputType: 'text', required: true },
            { type: 'field', label: 'Flight Date', inputType: 'date', required: true },
            { type: 'field', label: 'Acceptance Time', inputType: 'time', required: true },
            { type: 'field', label: 'Airport / Cargo Terminal', inputType: 'text', required: true },
            { type: 'field', label: 'Air Cargo Lead', inputType: 'signature', required: true },
          ],
        },
        {
          title: 'Acceptance Checks',
          rows: [
            { type: 'check', label: 'Weight, dimensions, piece count, and shipment description match the airwaybill or booking record.' },
            { type: 'check', label: 'Packaging is suitable for ramp handling, stacking limits, and special temperature or pressure concerns.' },
            { type: 'check', label: 'Labels, handling marks, and security or screening status are complete as required.' },
            { type: 'check', label: 'Cut-off time, terminal requirements, and dangerous-goods or special-cargo conditions were reviewed.' },
            { type: 'check', label: 'Any discrepancies were corrected before tender to the airline or forwarder.' },
          ],
        },
        {
          title: 'Acceptance Notes / Discrepancies',
          rows: [{ type: 'textarea', label: 'Acceptance Notes / Discrepancies', placeholder: 'Record weight corrections, label issues, terminal timing risks, or acceptance delays.', rows: 5 }],
        },
      ],
    },
    {
      key: 'hazmat-pre-shipment-review',
      title: 'Hazmat Pre-Shipment Review',
      eyebrow: 'Dangerous Goods Control',
      icon: AlertTriangle,
      description:
        'Use this worksheet before releasing regulated freight so classification, markings, paperwork, packaging, and segregation checks are visible before handoff.',
      sections: [
        {
          title: 'Hazmat Shipment Information',
          rows: [
            { type: 'field', label: 'Shipment / Order Reference', inputType: 'text', required: true },
            { type: 'field', label: 'Proper Shipping Name / Commodity', inputType: 'text', required: true },
            { type: 'field', label: 'UN / NA Number', inputType: 'text', required: true },
            { type: 'field', label: 'Hazard Class / Division', inputType: 'text', required: true },
            { type: 'field', label: 'Shipping Mode', inputType: 'select', options: ['Truck', 'Rail', 'Maritime', 'Air'], required: true },
            { type: 'field', label: 'Compliance Lead', inputType: 'signature', required: true },
          ],
        },
        {
          title: 'Hazmat Verification Checks',
          rows: [
            { type: 'check', label: 'Classification, packing group, and quantity limits were verified for the selected mode.' },
            { type: 'check', label: 'Packaging, closures, and overpacks meet the shipment requirement.' },
            { type: 'check', label: 'Marks, labels, placards, and emergency-response information are correct and visible.' },
            { type: 'check', label: 'Shipping papers, declarations, and carrier-specific hazmat requirements are complete.' },
            { type: 'check', label: 'Segregation, loading, stowage, and temperature or compatibility restrictions were checked.' },
          ],
        },
        {
          title: 'Hazmat Notes / Exceptions',
          rows: [{ type: 'textarea', label: 'Hazmat Notes / Exceptions', placeholder: 'Record limited-quantity status, carrier restrictions, missing paperwork, or any regulated-shipment exceptions.', rows: 5 }],
        },
      ],
    },
    {
      key: 'export-documentation-handoff',
      title: 'Export Documentation Handoff',
      eyebrow: 'International Shipping Control',
      icon: FileText,
      description:
        'Use this worksheet when a shipment is moving internationally so export paperwork, filing status, consignee details, and release conditions stay visible before handoff.',
      sections: [
        {
          title: 'Export Shipment Information',
          rows: [
            { type: 'field', label: 'Shipment / Booking Reference', inputType: 'text', required: true },
            { type: 'field', label: 'Consignee / Country', inputType: 'text', required: true },
            { type: 'field', label: 'Incoterm', inputType: 'text' },
            { type: 'field', label: 'Forwarder / Broker', inputType: 'text', required: true },
            { type: 'field', label: 'Scheduled Departure Date', inputType: 'date', required: true },
            { type: 'field', label: 'Export Coordinator', inputType: 'signature', required: true },
          ],
        },
        {
          title: 'Export Handoff Checks',
          rows: [
            { type: 'check', label: 'Commercial invoice, packing list, and booking or forwarding references are complete.' },
            { type: 'check', label: 'EEI / AES filing status, license requirements, and screening checks were confirmed if required.' },
            { type: 'check', label: 'Marks, country-of-origin details, and customer-specific export instructions match the shipment.' },
            { type: 'check', label: 'Customs, broker, and terminal cut-off requirements were reviewed before release.' },
            { type: 'check', label: 'All shipment identifiers match the physical load, paperwork, and carrier booking.' },
          ],
        },
        {
          title: 'Export Notes / Holds',
          rows: [{ type: 'textarea', label: 'Export Notes / Holds', placeholder: 'Record filing delays, document holds, screening questions, or broker instructions.', rows: 5 }],
        },
      ],
    },
    {
      key: 'freight-claims-osd-investigation',
      title: 'Freight Loss / OS&D Investigation',
      eyebrow: 'Claims and Damage Review',
      icon: ShieldCheck,
      description:
        'Use this worksheet when freight arrives damaged, short, over, or missing so evidence, carrier notice, and claim details stay organized while the event is still fresh.',
      sections: [
        {
          title: 'Claim Information',
          rows: [
            { type: 'field', label: 'Claim / Incident Reference', inputType: 'text', required: true },
            { type: 'field', label: 'BOL / PRO / AWB / Container Ref', inputType: 'text', required: true },
            { type: 'field', label: 'Carrier / Forwarder', inputType: 'text', required: true },
            { type: 'field', label: 'Date Discovered', inputType: 'date', required: true },
            { type: 'field', label: 'Claim Type', inputType: 'select', options: ['Damage', 'Shortage', 'Overage', 'Loss', 'Concealed Damage'], required: true },
            { type: 'field', label: 'Investigation Lead', inputType: 'signature', required: true },
          ],
        },
        {
          title: 'Investigation Checks',
          rows: [
            { type: 'check', label: 'Physical count was verified against the BOL, packing list, or receipt paperwork.' },
            { type: 'check', label: 'Photos were captured of the freight, packaging, labels, and conveyance condition.' },
            { type: 'check', label: 'Seal status, trailer or container condition, and visible handling evidence were documented.' },
            { type: 'check', label: 'Carrier, consignee, or internal stakeholders were notified within the required claim window.' },
            { type: 'check', label: 'Affected freight was isolated, tagged, or held to preserve evidence and prevent mix-up.' },
          ],
        },
        {
          title: 'Affected Freight Log',
          rows: [
            {
              type: 'table',
              columns: [
                { label: 'Item / SKU', inputType: 'text', required: true },
                { label: 'Qty Affected', inputType: 'number', required: true },
                { label: 'Condition', inputType: 'text', required: true },
                { label: 'Packaging / Location', inputType: 'text', required: true },
                { label: 'Photo / Evidence Ref', inputType: 'text' },
              ],
              rowCount: 4,
            },
          ],
        },
        {
          title: 'Claim Notes / Corrective Actions',
          rows: [{ type: 'textarea', label: 'Claim Notes / Corrective Actions', placeholder: 'Record carrier responses, inspection findings, salvage decisions, root-cause observations, or next claim steps.', rows: 5 }],
        },
      ],
    },
    {
      key: 'dock-handoff-form',
      title: 'Dock Handoff Form',
      eyebrow: 'Load Transfer',
      icon: FileText,
      description:
        'Use this worksheet when staging turns into carrier handoff so status, open items, and special instructions stay visible.',
      sections: [
        {
          title: 'Handoff Information',
          rows: [
            { type: 'field', label: 'Dock / Door', inputType: 'text', required: true },
            { type: 'field', label: 'Turning Over From', inputType: 'signature', required: true },
            { type: 'field', label: 'Turning Over To', inputType: 'signature', required: true },
            { type: 'field', label: 'Date', inputType: 'date', required: true },
            { type: 'field', label: 'Time', inputType: 'time', required: true },
          ],
        },
        {
          title: 'Status Checks',
          rows: [
            { type: 'check', label: 'Load is packaged, labeled, and ready for the assigned carrier.' },
            { type: 'check', label: 'Bills, customs docs, or customer paperwork are complete.' },
            { type: 'check', label: 'Open shortages, damaged cartons, or routing issues are listed below.' },
            { type: 'check', label: 'Special loading sequence or securement requirements were communicated.' },
          ],
        },
        {
          title: 'Open Items / Constraints',
          rows: [{ type: 'textarea', label: 'Open Items / Constraints', placeholder: 'List paperwork gaps, loading sequence notes, or dock constraints.', rows: 5 }],
        },
      ],
    },
    {
      key: 'packaging-inspection-sheet',
      title: 'Packaging Inspection Sheet',
      eyebrow: 'Transit Protection',
      icon: HardHat,
      description:
        'Use this worksheet to verify carton, crate, pallet, and securement quality before a load is released.',
      sections: [
        {
          title: 'Package Information',
          rows: [
            { type: 'field', label: 'Order / Shipment', inputType: 'text', required: true },
            { type: 'field', label: 'Package Type', inputType: 'select', options: ['Carton', 'Pallet', 'Crate', 'Mixed'], required: true },
            { type: 'field', label: 'Inspector', inputType: 'signature', required: true },
            { type: 'field', label: 'Inspection Date', inputType: 'date', required: true },
          ],
        },
        {
          title: 'Package Checks',
          rows: [
            { type: 'check', label: 'Protection matches weight, fragility, and route risk.' },
            { type: 'check', label: 'Corners, edges, void fill, and top protection are acceptable.' },
            { type: 'check', label: 'Labels, orientation marks, and destination IDs are readable.' },
            { type: 'check', label: 'Stretch wrap, banding, or crate closure is complete.' },
          ],
        },
        {
          title: 'Packaging Exceptions',
          rows: [{ type: 'textarea', label: 'Packaging Exceptions', placeholder: 'Record weak packaging points, rework, or transit-risk concerns.', rows: 5 }],
        },
      ],
    },
    {
      key: 'delivery-inspection-sheet',
      title: 'Inbound Delivery Inspection Sheet',
      eyebrow: 'Receiving Control',
      icon: Truck,
      description:
        'Use this worksheet to inspect inbound freight for counts, visible damage, paperwork, and routing before the shipment leaves the dock, terminal, port, or cargo area.',
      sections: [
        {
          title: 'Delivery Information',
          rows: [
            { type: 'field', label: 'Facility / Receiving Area', inputType: 'text', required: true },
            { type: 'field', label: 'Date Received', inputType: 'date', required: true },
            { type: 'field', label: 'Time Received', inputType: 'time', required: true },
            { type: 'field', label: 'Vendor / Carrier', inputType: 'text', required: true },
            { type: 'field', label: 'BOL / PRO / Packing Slip', inputType: 'text', required: true },
            { type: 'field', label: 'Received By', inputType: 'signature', required: true },
          ],
        },
        {
          title: 'Receiving Checks',
          rows: [
            { type: 'check', label: 'Count matches carrier paperwork, transfer record, and expected delivery details.' },
            { type: 'check', label: 'Pallets, cartons, crates, containers, or air-cargo pieces arrived without visible damage.' },
            { type: 'check', label: 'Labels, routing marks, and shipment IDs are present and readable.' },
            { type: 'check', label: 'Shipment was routed to the correct staging, hold, or inspection area.' },
            { type: 'check', label: 'Exceptions, shortages, seal concerns, or damage were photographed and reported.' },
          ],
        },
        {
          title: 'Exceptions / Damage / Notes',
          rows: [{ type: 'textarea', label: 'Exceptions / Damage / Notes', placeholder: 'Record shortages, damaged freight, or paperwork issues.', rows: 5 }],
        },
      ],
    },
    {
      key: 'equipment-checklist',
      title: 'Forklift / Yard Equipment Checklist',
      eyebrow: 'Equipment Readiness',
      icon: CheckSquare,
      description:
        'Use this worksheet for pre-shift dock equipment checks so tires, forks, alarms, brakes, and defects are logged before use.',
      sections: [
        {
          title: 'Equipment Information',
          rows: [
            { type: 'field', label: 'Equipment Type / ID', inputType: 'text', required: true },
            { type: 'field', label: 'Operator', inputType: 'signature', required: true },
            { type: 'field', label: 'Date', inputType: 'date', required: true },
            { type: 'field', label: 'Shift', inputType: 'select', options: ['Pre-Shift', 'Mid-Shift', 'Post-Shift'], required: true },
            { type: 'field', label: 'Dock / Yard Area', inputType: 'text', required: true },
            { type: 'field', label: 'Hour Meter', inputType: 'number' },
          ],
        },
        {
          title: 'Condition Checks',
          rows: [
            { type: 'check', label: 'Brakes, steering, horns, and alarms function correctly.' },
            { type: 'check', label: 'Forks, mast, tires, battery, and visible leaks were checked.' },
            { type: 'check', label: 'Seatbelt, lights, mirrors, and emergency controls are serviceable.' },
            { type: 'check', label: 'Inspection tag and load plate are present and readable.' },
            { type: 'check', label: 'Any defects were tagged out or reported before operation.' },
          ],
        },
        {
          title: 'Defects / Repairs / Remarks',
          rows: [{ type: 'textarea', label: 'Defects / Repairs / Remarks', placeholder: 'Describe damage, battery issues, or tag-out conditions.', rows: 5 }],
        },
      ],
    },
  ],
}

export const FABRICATION_WORKSHEET_CONFIG = {
  industryName: 'Fabrication',
  pageTitle: 'Fabrication Worksheets',
  pageUrl: 'https://runtwerkx.com/fabrication/worksheets',
  backgroundImageSrc: '/images/fabrication.png',
  draftStorageKey: 'runtwerkx-fabrication-worksheet-drafts',
  offlineActionQueueKey: 'runtwerkx-fabrication-offline-action-queue',
  offlineActionHistoryKey: 'runtwerkx-fabrication-offline-action-history',
  sourceLabel: 'RuntWerkx Fabrication Worksheets',
  pdfHeaderTitle: 'RuntWerkx Fabrication Worksheet',
  metaDescription:
    'Fill, sign, validate, print, export branded PDFs, and move worksheet drafts for fabrication forms covering fit-up, welding logs, heat trace, receiving, and machine readiness.',
  parentPath: '/fabrication',
  parentLabel: 'Back to Fabrication',
  heroEyebrow: '― Fabrication Tools ―',
  heroDescription:
    'Fill, sign, save locally, validate, print, export branded PDFs, and share fabrication worksheets used in shop, plate, beam, welding, and receiving workflows.',
  heroSubtext:
    'These sheets are built for fit-up inspection, weld parameter logging, material heat trace, incoming steel receiving, and equipment readiness across real fabrication operations.',
  libraryEyebrow: '― Worksheet Library ―',
  libraryTitle: 'Fabrication forms fitters, welders, leads, and shop coordinators can use now',
  libraryDescription:
    'Pick a worksheet, complete it in the browser, capture handwritten signatures, validate required fields, export a branded PDF, move one worksheet or the full draft pack between devices, print it, or download a filled HTML copy.',
  draftPackFilenamePrefix: 'runtwerkx-fabrication-drafts',
  worksheets: [
    {
      key: 'fit-up-inspection-sheet',
      title: 'Fit-Up Inspection Sheet',
      eyebrow: 'Assembly Verification',
      icon: ClipboardCheck,
      description:
        'Use this worksheet before welding or release to verify fit-up condition, match marks, gaps, references, and correction notes while the assembly is accessible.',
      sections: [
        {
          title: 'Assembly Information',
          rows: [
            { type: 'field', label: 'Job / Assembly', inputType: 'text', required: true },
            { type: 'field', label: 'Drawing / Revision', inputType: 'text', required: true },
            { type: 'field', label: 'Inspection Date', inputType: 'date', required: true },
            { type: 'field', label: 'Fitter / Inspector', inputType: 'signature', required: true },
            { type: 'field', label: 'Work Center', inputType: 'text', required: true },
          ],
        },
        {
          title: 'Fit-Up Checks',
          rows: [
            { type: 'check', label: 'Match marks, orientation, and member IDs are confirmed.' },
            { type: 'check', label: 'Critical dimensions, gaps, and root openings are within target.' },
            { type: 'check', label: 'Clamp strategy, tack placement, and sequence are acceptable.' },
            { type: 'check', label: 'Surface prep, bevel condition, and weld access are acceptable.' },
          ],
        },
        {
          title: 'Corrections / Notes',
          rows: [{ type: 'textarea', label: 'Corrections / Notes', placeholder: 'Record mismatch points, rework, or drawing clarification needs.', rows: 5 }],
        },
      ],
    },
    {
      key: 'weld-parameter-log',
      title: 'Weld Parameter Log',
      eyebrow: 'Process Tracking',
      icon: ShieldCheck,
      description:
        'Use this worksheet to record live welding settings, consumables, and operator notes so setup drift can be reviewed against the actual job.',
      sections: [
        {
          title: 'Weld Setup Information',
          rows: [
            { type: 'field', label: 'Job / WPS', inputType: 'text', required: true },
            { type: 'field', label: 'Machine / Station', inputType: 'text', required: true },
            { type: 'field', label: 'Process', inputType: 'select', options: ['GMAW', 'FCAW', 'SMAW', 'GTAW'], required: true },
            { type: 'field', label: 'Lead Welder', inputType: 'signature', required: true },
          ],
        },
        {
          title: 'Parameter Entries',
          rows: [
            {
              type: 'table',
              columns: [
                { label: 'Pass / Joint', inputType: 'text', required: true },
                { label: 'Voltage', inputType: 'text', required: true },
                { label: 'Wire Feed / Amps', inputType: 'text', required: true },
                { label: 'Gas / Polarity', inputType: 'text', required: true },
                { label: 'Position', inputType: 'text', required: true },
                { label: 'Notes', inputType: 'text' },
              ],
              rowCount: 5,
            },
          ],
        },
        {
          title: 'Observations',
          rows: [{ type: 'textarea', label: 'Observations', placeholder: 'Record arc behavior, spatter, fit-up impact, or corrective changes.', rows: 5 }],
        },
      ],
    },
    {
      key: 'material-heat-trace-log',
      title: 'Material Heat Trace Log',
      eyebrow: 'Traceability Control',
      icon: FileText,
      description:
        'Use this worksheet to track heat numbers, material IDs, and cut allocation so traceability survives cutting, staging, and assembly.',
      sections: [
        {
          title: 'Trace Information',
          rows: [
            { type: 'field', label: 'Job / Release', inputType: 'text', required: true },
            { type: 'field', label: 'Material Type', inputType: 'text', required: true },
            { type: 'field', label: 'Date', inputType: 'date', required: true },
            { type: 'field', label: 'Responsible Lead', inputType: 'signature', required: true },
          ],
        },
        {
          title: 'Heat Trace Entries',
          rows: [
            {
              type: 'table',
              columns: [
                { label: 'Piece / Mark', inputType: 'text', required: true },
                { label: 'Heat Number', inputType: 'text', required: true },
                { label: 'Cut / Location', inputType: 'text', required: true },
                { label: 'Status', inputType: 'text', required: true },
              ],
              rowCount: 6,
            },
          ],
        },
        {
          title: 'Trace Notes',
          rows: [{ type: 'textarea', label: 'Trace Notes', placeholder: 'Document re-identification, missing marks, or cert reference notes.', rows: 5 }],
        },
      ],
    },
    {
      key: 'delivery-inspection-sheet',
      title: 'Material Receiving Inspection Sheet',
      eyebrow: 'Incoming Material Control',
      icon: Truck,
      description:
        'Use this worksheet to inspect inbound steel, plate, or hardware for quantity, damage, certs, and routing before it enters fabrication flow.',
      sections: [
        {
          title: 'Receiving Information',
          rows: [
            { type: 'field', label: 'Shop / Receiving Area', inputType: 'text', required: true },
            { type: 'field', label: 'Date Received', inputType: 'date', required: true },
            { type: 'field', label: 'Time Received', inputType: 'time', required: true },
            { type: 'field', label: 'Supplier / Carrier', inputType: 'text', required: true },
            { type: 'field', label: 'PO / Packing Slip / Mill Cert', inputType: 'text', required: true },
            { type: 'field', label: 'Received By', inputType: 'signature', required: true },
          ],
        },
        {
          title: 'Receiving Checks',
          rows: [
            { type: 'check', label: 'Counts, lengths, or piece totals match the receiving documents.' },
            { type: 'check', label: 'Visible damage, distortion, or edge defects were checked.' },
            { type: 'check', label: 'Heat numbers, tags, and cert packages are present as required.' },
            { type: 'check', label: 'Material was routed to the correct rack, bay, or inspection area.' },
            { type: 'check', label: 'Exceptions, shortages, or freight damage were photographed and reported.' },
          ],
        },
        {
          title: 'Exceptions / Damage / Notes',
          rows: [{ type: 'textarea', label: 'Exceptions / Damage / Notes', placeholder: 'Record shortages, bowed material, missing certs, or damage.', rows: 5 }],
        },
      ],
    },
    {
      key: 'equipment-checklist',
      title: 'Machine / Equipment Checklist',
      eyebrow: 'Readiness Verification',
      icon: CheckSquare,
      description:
        'Use this worksheet for pre-shift fabrication equipment checks so condition, tooling, consumables, and defects are logged before production begins.',
      sections: [
        {
          title: 'Equipment Information',
          rows: [
            { type: 'field', label: 'Machine Type / ID', inputType: 'text', required: true },
            { type: 'field', label: 'Operator / User', inputType: 'signature', required: true },
            { type: 'field', label: 'Date', inputType: 'date', required: true },
            { type: 'field', label: 'Shift', inputType: 'select', options: ['Pre-Shift', 'Mid-Shift', 'Post-Shift'], required: true },
            { type: 'field', label: 'Work Center', inputType: 'text', required: true },
            { type: 'field', label: 'Hour Meter / Arc Time', inputType: 'number' },
          ],
        },
        {
          title: 'Condition Checks',
          rows: [
            { type: 'check', label: 'Power, gas, grounding, and visible leaks were checked.' },
            { type: 'check', label: 'Consumables, tooling, or torch components are serviceable.' },
            { type: 'check', label: 'Guards, fixtures, controls, and E-stop function correctly.' },
            { type: 'check', label: 'Current setup, program, or tooling matches the scheduled work.' },
            { type: 'check', label: 'Any defects were tagged out or reported before operation.' },
          ],
        },
        {
          title: 'Defects / Repairs / Remarks',
          rows: [{ type: 'textarea', label: 'Defects / Repairs / Remarks', placeholder: 'Describe worn consumables, machine drift, or maintenance needs.', rows: 5 }],
        },
      ],
    },
  ],
}