import { useEffect, useMemo, useRef, useState } from 'react'
import { jsPDF } from 'jspdf'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  AlertTriangle,
  CalendarDays,
  CheckSquare,
  ClipboardCheck,
  Download,
  FileSignature,
  FileText,
  HardHat,
  Mail,
  Printer,
  Share2,
  ShieldCheck,
  Truck,
  Upload,
} from 'lucide-react'

const PAGE_URL = 'https://runtwerkx.com/knowledge-library/construction/worksheets'
const PAGE_BACKGROUND_IMAGE_SRC = '/images/construction.png'
const DRAFT_STORAGE_KEY = 'runtwerkx-construction-worksheet-drafts'
const OFFLINE_ACTION_QUEUE_KEY = 'runtwerkx-construction-offline-action-queue'
const OFFLINE_ACTION_HISTORY_KEY = 'runtwerkx-construction-offline-action-history'

const INPUT_STYLES =
  'h-10 w-full min-w-0 rounded-xl border border-black/15 bg-white/75 px-3 text-sm text-black outline-none transition placeholder:text-black/30 focus:border-emerald-700/45 focus:bg-white'
const TEXTAREA_STYLES =
  'min-h-[104px] w-full resize-y rounded-xl border border-black/15 bg-white/75 px-3 py-2 text-sm leading-6 text-black outline-none transition placeholder:text-black/30 focus:border-emerald-700/45 focus:bg-white'

const WORKSHEETS = [
  {
    key: 'daily-site-checklist',
    title: 'Daily Site Checklist',
    eyebrow: 'Field Readiness',
    icon: ClipboardCheck,
    description:
      'Use this worksheet before active work starts to confirm drawings, access, staging, crew direction, hazards, and key material are aligned.',
    sections: [
      {
        title: 'Project and Crew Information',
        rows: [
          { type: 'field', label: 'Project / Site', inputType: 'text', placeholder: 'RuntWerkx Expansion - North Pad' },
          { type: 'field', label: 'Date', inputType: 'date' },
          { type: 'field', label: 'Shift', inputType: 'select', options: ['Day', 'Night', 'Weekend'] },
          { type: 'field', label: 'Crew Lead / Foreman', inputType: 'signature', required: true },
          { type: 'field', label: 'Work Area / Phase', inputType: 'text', placeholder: 'Steel framing / Zone C' },
        ],
      },
      {
        title: 'Readiness Checks',
        rows: [
          { type: 'check', label: 'Current drawing set and latest site direction are confirmed.' },
          { type: 'check', label: 'Work area access, lift paths, and material routes are clear.' },
          { type: 'check', label: 'Required material, hardware, and support gear are staged at the workface.' },
          { type: 'check', label: 'Crew understands the sequence, critical dimensions, and hold points.' },
          { type: 'check', label: 'Hazards, permits, and exposure controls have been reviewed for today.' },
        ],
      },
      {
        title: 'Issues / Constraints / Notes',
        rows: [{ type: 'textarea', label: 'Notes', placeholder: 'List access issues, missing materials, or constraints for the shift.', rows: 5 }],
      },
    ],
  },
  {
    key: 'lift-prep-sheet',
    title: 'Lift Prep Sheet',
    eyebrow: 'Rigging and Handling',
    icon: HardHat,
    description:
      'Use this worksheet to organize basic lift-prep conversation before material moves, especially when access, swing, and rigging assumptions need to be visible.',
    sections: [
      {
        title: 'Lift Information',
        rows: [
          { type: 'field', label: 'Lift Item / Description', inputType: 'text' },
          { type: 'field', label: 'Estimated Weight', inputType: 'number', placeholder: '12500' },
          { type: 'field', label: 'Pickup Point / Drop Point', inputType: 'text' },
          { type: 'field', label: 'Lift Date', inputType: 'date' },
          { type: 'field', label: 'Responsible Lead', inputType: 'signature', required: true },
        ],
      },
      {
        title: 'Prep Checks',
        rows: [
          { type: 'check', label: 'Weight source or basis has been confirmed.' },
          { type: 'check', label: 'Rigging method, lift points, and hardware have been reviewed.' },
          { type: 'check', label: 'Travel path, swing radius, and landing zone are clear.' },
          { type: 'check', label: 'Signal / communication method is understood by the crew.' },
          { type: 'check', label: 'Site conditions, weather, and nearby work are accounted for.' },
        ],
      },
      {
        title: 'Special Controls / Notes',
        rows: [{ type: 'textarea', label: 'Special Controls', placeholder: 'Tag line plan, weather limits, exclusion zones, or alternate path notes.', rows: 5 }],
      },
    ],
  },
  {
    key: 'anchor-log',
    title: 'Anchor Log',
    eyebrow: 'Installation Record',
    icon: ShieldCheck,
    description:
      'Use this worksheet to capture anchor location, size, embed, substrate notes, torque, and installation observations while the work is still accessible.',
    sections: [
      {
        title: 'Work Information',
        rows: [
          { type: 'field', label: 'Project / Area', inputType: 'text' },
          { type: 'field', label: 'Project / Area', inputType: 'text', required: true },
          { type: 'field', label: 'Installer / Crew', inputType: 'signature', required: true },
          { type: 'field', label: 'Anchor Type / Manufacturer', inputType: 'text', required: true },
          { type: 'field', label: 'Drawing / Detail Reference', inputType: 'text' },
          { type: 'field', label: 'Inspection Date', inputType: 'date', required: true },
        ],
      },
      {
        title: 'Anchor Entries',
        rows: [
          {
            type: 'table',
            columns: [
              { label: 'Location', inputType: 'text', required: true },
              { label: 'Size', inputType: 'text', required: true },
              { label: 'Embed', inputType: 'text', required: true },
              { label: 'Qty', inputType: 'number', required: true },
              { label: 'Torque / Check', inputType: 'text', required: true },
              { label: 'Notes', inputType: 'text' },
            ],
            rowCount: 5,
          },
        ],
      },
      {
        title: 'Issues / Variations',
        rows: [{ type: 'textarea', label: 'Issues / Variations', placeholder: 'Record rework, substrate issues, or deviations.', rows: 4 }],
      },
    ],
  },
  {
    key: 'area-turnover-form',
    title: 'Area Turnover Form',
    eyebrow: 'Trade Handoff',
    icon: FileText,
    description:
      'Use this worksheet when one crew or trade is turning an area over so status, protection, open items, and constraints do not get lost in verbal handoff.',
    sections: [
      {
        title: 'Turnover Information',
        rows: [
          { type: 'field', label: 'Project / Area', inputType: 'text' },
          { type: 'field', label: 'Turning Over From', inputType: 'signature', required: true },
          { type: 'field', label: 'Turning Over To', inputType: 'signature', required: true },
          { type: 'field', label: 'Date', inputType: 'date' },
          { type: 'field', label: 'Time', inputType: 'time' },
        ],
      },
      {
        title: 'Area Status',
        rows: [
          { type: 'check', label: 'Work area is complete to the current issued information.' },
          { type: 'check', label: 'Installed work is protected and identified as needed.' },
          { type: 'check', label: 'Open issues, hold points, or missing items are listed below.' },
          { type: 'check', label: 'Access, cleanup, and material conditions are acceptable for the next crew.' },
        ],
      },
      {
        title: 'Outstanding Items / Constraints',
        rows: [{ type: 'textarea', label: 'Outstanding Items', placeholder: 'List open issues, punch items, or access constraints.', rows: 5 }],
      },
    ],
  },
  {
    key: 'pre-task-plan',
    title: 'Pre-Task Plan',
    eyebrow: 'Crew Alignment',
    icon: AlertTriangle,
    description:
      'Use this worksheet before work starts to capture scope, sequence, hazard controls, permits, staffing, and critical hold points for the shift.',
    sections: [
      {
        title: 'Task Information',
        rows: [
          { type: 'field', label: 'Project / Site', inputType: 'text' },
          { type: 'field', label: 'Date', inputType: 'date' },
          { type: 'field', label: 'Shift Start', inputType: 'time' },
          { type: 'field', label: 'Foreman / Responsible Lead', inputType: 'signature', required: true },
          { type: 'field', label: 'Task / Work Package', inputType: 'text' },
          { type: 'field', label: 'Crew Size', inputType: 'number', placeholder: '8' },
        ],
      },
      {
        title: 'Plan and Controls',
        rows: [
          { type: 'textarea', label: 'Primary Work Sequence', placeholder: 'Describe the work sequence and major handoff points.', rows: 3 },
          { type: 'field', label: 'Permits / Approvals Required', inputType: 'text' },
          { type: 'field', label: 'Crew / Subcontractors Involved', inputType: 'text' },
          { type: 'field', label: 'Tools / Equipment Needed', inputType: 'text' },
          { type: 'check', label: 'Job hazards, energy sources, and overhead exposures were reviewed.' },
          { type: 'check', label: 'Crew understands stop-work triggers and escalation path.' },
          { type: 'check', label: 'Critical measurements, tolerances, and hold points are known.' },
        ],
      },
      {
        title: 'Hazards / Special Instructions',
        rows: [{ type: 'textarea', label: 'Hazards / Special Instructions', placeholder: 'List fall hazards, live utilities, weather risks, or other critical controls.', rows: 5 }],
      },
    ],
  },
  {
    key: 'concrete-pour-log',
    title: 'Concrete Pour Log',
    eyebrow: 'Placement Tracking',
    icon: FileText,
    description:
      'Use this worksheet to track pour timing, mix details, testing, weather, crew notes, and placement issues while concrete work is active.',
    sections: [
      {
        title: 'Pour Information',
        rows: [
          { type: 'field', label: 'Project / Location', inputType: 'text', required: true },
          { type: 'field', label: 'Placement Area / Elevation', inputType: 'text', required: true },
          { type: 'field', label: 'Pour Date', inputType: 'date', required: true },
          { type: 'field', label: 'Start Time', inputType: 'time', required: true },
          { type: 'field', label: 'Supplier / Mix Design', inputType: 'text', required: true },
          { type: 'field', label: 'Inspector / Lead', inputType: 'signature', required: true },
        ],
      },
      {
        title: 'Placement Log',
        rows: [
          {
            type: 'table',
            columns: [
              { label: 'Truck / Batch', inputType: 'text', required: true },
              { label: 'Arrival', inputType: 'time', required: true },
              { label: 'Discharge', inputType: 'time', required: true },
              { label: 'Slump / Temp', inputType: 'text' },
              { label: 'Qty', inputType: 'number', required: true },
              { label: 'Notes', inputType: 'text' },
            ],
            rowCount: 4,
          },
        ],
      },
      {
        title: 'Inspection / Weather / Issues',
        rows: [{ type: 'textarea', label: 'Inspection / Weather / Issues', placeholder: 'Record weather shifts, delays, cylinder tests, or placement concerns.', rows: 5 }],
      },
    ],
  },
  {
    key: 'delivery-inspection-sheet',
    title: 'Delivery Inspection Sheet',
    eyebrow: 'Receiving Control',
    icon: Truck,
    description:
      'Use this worksheet to inspect incoming deliveries for quantity, condition, paperwork, labeling, and routing before materials disappear into the site flow.',
    sections: [
      {
        title: 'Delivery Information',
        rows: [
          { type: 'field', label: 'Project / Delivery Location', inputType: 'text', required: true },
          { type: 'field', label: 'Date Received', inputType: 'date', required: true },
          { type: 'field', label: 'Time Received', inputType: 'time', required: true },
          { type: 'field', label: 'Vendor / Carrier', inputType: 'text', required: true },
          { type: 'field', label: 'PO / Packing Slip / Ticket', inputType: 'text', required: true },
          { type: 'field', label: 'Received By', inputType: 'signature', required: true },
        ],
      },
      {
        title: 'Receiving Checks',
        rows: [
          { type: 'check', label: 'Material quantity matches the delivery paperwork.' },
          { type: 'check', label: 'Packaging, crates, or bundles arrived without visible damage.' },
          { type: 'check', label: 'Labels, tags, heat numbers, or part IDs are present as required.' },
          { type: 'check', label: 'Material was routed to the correct laydown or work area.' },
          { type: 'check', label: 'Shortages, overages, or freight damage were photographed and reported.' },
        ],
      },
      {
        title: 'Exceptions / Damage / Notes',
        rows: [{ type: 'textarea', label: 'Exceptions / Damage / Notes', placeholder: 'Record shortages, damage, or missing paperwork.', rows: 5 }],
      },
    ],
  },
  {
    key: 'equipment-checklist',
    title: 'Equipment Checklist',
    eyebrow: 'Readiness Verification',
    icon: CheckSquare,
    description:
      'Use this worksheet for daily or shift-start equipment verification so condition, fluids, controls, attachments, and defects are logged before use.',
    sections: [
      {
        title: 'Equipment Information',
        rows: [
          { type: 'field', label: 'Equipment Type / ID', inputType: 'text' },
          { type: 'field', label: 'Operator / User', inputType: 'signature', required: true },
          { type: 'field', label: 'Date', inputType: 'date', required: true },
          { type: 'field', label: 'Shift', inputType: 'select', options: ['Pre-Shift', 'Mid-Shift', 'Post-Shift'], required: true },
          { type: 'field', label: 'Area / Task', inputType: 'text', required: true },
          { type: 'field', label: 'Hour Meter / Mileage', inputType: 'number' },
        ],
      },
      {
        title: 'Condition Checks',
        rows: [
          { type: 'check', label: 'Fluids, leaks, and visible damage were checked.' },
          { type: 'check', label: 'Guards, tires, forks, rigging points, or attachments are serviceable.' },
          { type: 'check', label: 'Controls, alarms, lights, and emergency stop function correctly.' },
          { type: 'check', label: 'Inspection tag, load chart, and required documents are present.' },
          { type: 'check', label: 'Any defects were tagged out or reported before operation.' },
        ],
      },
      {
        title: 'Defects / Repairs / Remarks',
        rows: [{ type: 'textarea', label: 'Defects / Repairs / Remarks', placeholder: 'Describe deficiencies, maintenance requests, or tag-out status.', rows: 5 }],
      },
    ],
  },
]

function getFieldId(sectionIndex, rowIndex, columnIndex = null) {
  if (typeof columnIndex === 'number') {
    return `s${sectionIndex}-r${rowIndex}-c${columnIndex}`
  }

  return `s${sectionIndex}-r${rowIndex}`
}

function getTableCellId(sectionIndex, rowIndex, rowColumnsLength, tableRowIndex, columnIndex) {
  return getFieldId(sectionIndex, rowIndex, tableRowIndex * rowColumnsLength + columnIndex)
}

function getTableErrorId(sectionIndex, rowIndex) {
  return `table-s${sectionIndex}-r${rowIndex}`
}

function createEmptyWorksheetDraft(worksheet) {
  return worksheet.sections.reduce((draft, section, sectionIndex) => {
    section.rows.forEach((row, rowIndex) => {
      if (row.type === 'field' || row.type === 'textarea') {
        draft[getFieldId(sectionIndex, rowIndex)] = ''
      }

      if (row.type === 'check') {
        draft[getFieldId(sectionIndex, rowIndex)] = false
      }

      if (row.type === 'table') {
        Array.from({ length: row.rowCount }).forEach((_, tableRowIndex) => {
          row.columns.forEach((_, columnIndex) => {
            draft[getTableCellId(sectionIndex, rowIndex, row.columns.length, tableRowIndex, columnIndex)] = ''
          })
        })
      }
    })

    return draft
  }, {})
}

function formatTimestamp(value) {
  if (!value) {
    return ''
  }

  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function mergeDraftWithDefaults(worksheet, savedDraft = {}) {
  return { ...createEmptyWorksheetDraft(worksheet), ...savedDraft }
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatInputValue(value, inputType) {
  if (!value) {
    return ''
  }

  if (inputType === 'date') {
    const [year, month, day] = String(value).split('-')
    if (year && month && day) {
      return `${month}/${day}/${year}`
    }
  }

  return String(value)
}

function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === ''
}

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-green-400">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">{title}</h2>
      <div className="mx-auto mt-4 h-px w-32 bg-gradient-to-r from-green-500 via-green-300/60 to-transparent" />
      <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-white/68 md:text-lg">{description}</p>
    </div>
  )
}

function getInputProps(inputType) {
  if (inputType === 'number') {
    return { inputMode: 'decimal', type: 'number' }
  }

  if (inputType === 'date') {
    return { type: 'date' }
  }

  if (inputType === 'time') {
    return { type: 'time' }
  }

  return { type: 'text' }
}

function getFieldPill(inputType) {
  if (inputType === 'signature') {
    return 'Signature'
  }

  if (inputType === 'date') {
    return 'Date'
  }

  if (inputType === 'time') {
    return 'Time'
  }

  if (inputType === 'select') {
    return 'Pick'
  }

  if (inputType === 'number') {
    return 'Numeric'
  }

  return null
}

function getRowValue(draft, sectionIndex, rowIndex) {
  return draft[getFieldId(sectionIndex, rowIndex)]
}

function getTableRowValues(draft, sectionIndex, rowIndex, row, tableRowIndex) {
  return row.columns.map((_, columnIndex) => draft[getTableCellId(sectionIndex, rowIndex, row.columns.length, tableRowIndex, columnIndex)] || '')
}

function getValidationErrors(worksheet, draft) {
  const errors = []
  const fieldErrors = {}

  function addError(message, fieldId) {
    errors.push(message)
    if (fieldId && !fieldErrors[fieldId]) {
      fieldErrors[fieldId] = message
    }
  }

  worksheet.sections.forEach((section, sectionIndex) => {
    section.rows.forEach((row, rowIndex) => {
      if ((row.type === 'field' || row.type === 'textarea') && row.required && isBlank(getRowValue(draft, sectionIndex, rowIndex))) {
        addError(`${row.label} is required.`, getFieldId(sectionIndex, rowIndex))
      }

      if (row.type === 'table' && worksheet.key === 'concrete-pour-log') {
        let hasAnyEntry = false

        Array.from({ length: row.rowCount }, (_, tableRowIndex) => {
          const values = getTableRowValues(draft, sectionIndex, rowIndex, row, tableRowIndex)
          const rowHasData = values.some((value) => !isBlank(value))
          if (!rowHasData) {
            return
          }

          hasAnyEntry = true
          row.columns.forEach((column, columnIndex) => {
            if (column.required && isBlank(values[columnIndex])) {
              addError(
                `Concrete Pour Log row ${tableRowIndex + 1}: ${column.label} is required when the row has data.`,
                getTableCellId(sectionIndex, rowIndex, row.columns.length, tableRowIndex, columnIndex)
              )
            }
          })
        })

        if (!hasAnyEntry) {
          addError('Concrete Pour Log requires at least one completed placement row.', getTableErrorId(sectionIndex, rowIndex))
        }
      }

      if (row.type === 'table' && worksheet.key === 'anchor-log') {
        let hasAnyEntry = false

        Array.from({ length: row.rowCount }, (_, tableRowIndex) => {
          const values = getTableRowValues(draft, sectionIndex, rowIndex, row, tableRowIndex)
          const rowHasData = values.some((value) => !isBlank(value))
          if (!rowHasData) {
            return
          }

          hasAnyEntry = true
          row.columns.forEach((column, columnIndex) => {
            if (column.required && isBlank(values[columnIndex])) {
              addError(
                `Anchor Log row ${tableRowIndex + 1}: ${column.label} is required when the row has data.`,
                getTableCellId(sectionIndex, rowIndex, row.columns.length, tableRowIndex, columnIndex)
              )
            }
          })
        })

        if (!hasAnyEntry) {
          addError('Anchor Log requires at least one completed anchor entry row.', getTableErrorId(sectionIndex, rowIndex))
        }
      }
    })
  })

  if (worksheet.key === 'delivery-inspection-sheet') {
    const checksSection = worksheet.sections[1]
    const notesField = getRowValue(draft, 2, 0)
    const hasUncheckedItem = checksSection.rows.some((_, rowIndex) => !draft[getFieldId(1, rowIndex)])

    if (hasUncheckedItem && isBlank(notesField)) {
      addError('Delivery Inspection Sheet requires Exceptions / Damage / Notes when any receiving check is not confirmed.', getFieldId(2, 0))
    }
  }

  if (worksheet.key === 'equipment-checklist') {
    const checksSection = worksheet.sections[1]
    const notesField = getRowValue(draft, 2, 0)
    const uncheckedItems = checksSection.rows.filter((_, rowIndex) => !draft[getFieldId(1, rowIndex)]).length

    if (uncheckedItems > 0 && isBlank(notesField)) {
      addError('Equipment Checklist requires Defects / Repairs / Remarks when any condition check is not confirmed.', getFieldId(2, 0))
    }

    if (uncheckedItems === checksSection.rows.length) {
      addError('Equipment Checklist requires at least one confirmed condition check before export.', getTableErrorId(1, 0))
    }
  }

  return { errors, fieldErrors }
}

function optimizeSignatureDataUrl(sourceCanvas, qualityMode = 'high') {
  const targetCanvas = document.createElement('canvas')
  const maxWidth = qualityMode === 'low' ? 300 : 520
  const aspectRatio = sourceCanvas.height / sourceCanvas.width
  targetCanvas.width = maxWidth
  targetCanvas.height = Math.max(96, Math.round(maxWidth * aspectRatio))
  const context = targetCanvas.getContext('2d')
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, targetCanvas.width, targetCanvas.height)
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(sourceCanvas, 0, 0, targetCanvas.width, targetCanvas.height)
  return targetCanvas.toDataURL('image/jpeg', qualityMode === 'low' ? 0.58 : 0.88)
}

function getImageFormatFromDataUrl(value) {
  if (typeof value === 'string' && value.startsWith('data:image/jpeg')) {
    return 'JPEG'
  }

  return 'PNG'
}

function createPdfBlob(worksheet, draft, qualityMode) {
  const doc = exportWorksheetPdf(worksheet, draft, { shouldSave: false, qualityMode })
  return doc.output('blob')
}

function createJsonPayloadForWorksheet(worksheet, draft) {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    source: 'RuntWerkx Construction Worksheets',
    worksheetKey: worksheet.key,
    worksheetTitle: worksheet.title,
    draft,
  }
}

function createJsonBlob(payload) {
  return new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' })
}

function buildWorksheetHtml(worksheet, draft) {
  const body = worksheet.sections
    .map((section, sectionIndex) => {
      const rows = section.rows
        .map((row, rowIndex) => {
          if (row.type === 'field') {
            const value = draft[getFieldId(sectionIndex, rowIndex)]

            if (row.inputType === 'signature' && !isBlank(value)) {
              return `<div class="signature-row"><span class="label">${escapeHtml(row.label)}</span><div class="signature-value"><img src="${value}" alt="${escapeHtml(row.label)} signature" /></div></div>`
            }

            return `<div class="line-row"><span class="label">${escapeHtml(row.label)}</span><span class="line-value">${escapeHtml(
              formatInputValue(value, row.inputType)
            )}</span></div>`
          }

          if (row.type === 'check') {
            return `<div class="check-row"><span class="box">${draft[getFieldId(sectionIndex, rowIndex)] ? '&#10003;' : ''}</span><span>${escapeHtml(
              row.label
            )}</span></div>`
          }

          if (row.type === 'textarea') {
            return `<div class="textarea-block"><div class="textarea-label">${escapeHtml(row.label)}</div><div class="blank-block">${escapeHtml(
              draft[getFieldId(sectionIndex, rowIndex)]
            ).replace(/\n/g, '<br />')}</div></div>`
          }

          if (row.type === 'table') {
            const header = `<div class="table header columns-${row.columns.length}">${row.columns
              .map((column) => `<span>${escapeHtml(column.label)}</span>`)
              .join('')}</div>`
            const dataRows = Array.from({ length: row.rowCount }, (_, tableRowIndex) => {
              return `<div class="table row columns-${row.columns.length}">${row.columns
                .map((column, columnIndex) => {
                  const value = draft[getTableCellId(sectionIndex, rowIndex, row.columns.length, tableRowIndex, columnIndex)]
                  return `<span>${escapeHtml(formatInputValue(value, column.inputType))}</span>`
                })
                .join('')}</div>`
            }).join('')

            return header + dataRows
          }

          return ''
        })
        .join('')

      return `<section><h2>${escapeHtml(section.title)}</h2>${rows}</section>`
    })
    .join('')

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(worksheet.title)}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111; margin: 32px; }
          h1 { margin-bottom: 4px; }
          p.meta { color: #4b5563; margin-bottom: 24px; }
          section { margin-top: 24px; }
          h2 { font-size: 16px; border-bottom: 1px solid #d1d5db; padding-bottom: 8px; margin-bottom: 12px; }
          .line-row, .signature-row { display: flex; gap: 12px; margin: 12px 0; align-items: center; }
          .label { min-width: 180px; font-weight: 600; }
          .line-value { flex: 1; border-bottom: 1px solid #111; min-height: 24px; padding: 2px 0; }
          .signature-value { flex: 1; border: 1px solid #111; min-height: 74px; display: flex; align-items: center; justify-content: center; }
          .signature-value img { max-width: 100%; max-height: 68px; }
          .check-row { display: flex; gap: 12px; margin: 10px 0; align-items: flex-start; }
          .box { width: 16px; height: 16px; border: 1px solid #111; margin-top: 2px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; }
          .textarea-label { font-weight: 600; margin-top: 14px; }
          .blank-block { border: 1px solid #111; min-height: 72px; margin: 12px 0; padding: 8px; white-space: pre-wrap; }
          .table { display: grid; gap: 8px; margin: 8px 0; }
          .columns-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .columns-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }
          .table span { border: 1px solid #111; min-height: 28px; padding: 6px; }
          .table.header span { font-weight: 700; background: #f3f4f6; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(worksheet.title)}</h1>
        <p class="meta">${escapeHtml(worksheet.eyebrow)}</p>
        ${body}
      </body>
    </html>
  `
}

function drawPdfField(doc, label, valueLines, cursorY) {
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(23, 23, 23)
  doc.text(label, 18, cursorY)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(52, 52, 52)
  valueLines.forEach((line, index) => {
    doc.text(line, 70, cursorY + index * 5)
  })

  const height = Math.max(7, valueLines.length * 5)
  doc.setDrawColor(190, 190, 190)
  doc.line(70, cursorY + 1, 192, cursorY + 1)
  return cursorY + height
}

function ensurePdfSpace(doc, cursorY, requiredHeight) {
  if (cursorY + requiredHeight <= 274) {
    return cursorY
  }

  doc.addPage()
  return 20
}

function exportWorksheetPdf(worksheet, draft, options = {}) {
  const { shouldSave = true, qualityMode = 'high' } = options
  const doc = new jsPDF({ unit: 'mm', format: 'letter', compress: qualityMode === 'low', putOnlyUsedFonts: true })
  const pageWidth = doc.internal.pageSize.getWidth()

  doc.setFillColor(15, 23, 42)
  doc.rect(0, 0, pageWidth, 28, 'F')
  doc.setFillColor(22, 163, 74)
  doc.rect(0, 28, pageWidth, 4, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('RuntWerkx Construction Worksheet', 18, 16)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`${worksheet.title} | ${worksheet.eyebrow}`, 18, 23)

  let cursorY = 42

  worksheet.sections.forEach((section, sectionIndex) => {
    cursorY = ensurePdfSpace(doc, cursorY, 18)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(18, 18, 18)
    doc.setFontSize(12)
    doc.text(section.title, 18, cursorY)
    doc.setDrawColor(34, 197, 94)
    doc.line(18, cursorY + 2, 192, cursorY + 2)
    cursorY += 9

    section.rows.forEach((row, rowIndex) => {
      if (row.type === 'field') {
        const value = draft[getFieldId(sectionIndex, rowIndex)]

        if (row.inputType === 'signature' && !isBlank(value)) {
          cursorY = ensurePdfSpace(doc, cursorY, 26)
          doc.setFont('helvetica', 'bold')
          doc.text(row.label, 18, cursorY)
          doc.rect(70, cursorY - 5, 70, 18)
          doc.addImage(value, getImageFormatFromDataUrl(value), 72, cursorY - 3.5, 66, 15)
          cursorY += 18
          return
        }

        const displayValue = formatInputValue(value, row.inputType) || ' '
        const valueLines = doc.splitTextToSize(displayValue, 120)
        cursorY = ensurePdfSpace(doc, cursorY, Math.max(10, valueLines.length * 5 + 4))
        cursorY = drawPdfField(doc, row.label, valueLines, cursorY) + 3
      }

      if (row.type === 'check') {
        cursorY = ensurePdfSpace(doc, cursorY, 8)
        const isChecked = Boolean(draft[getFieldId(sectionIndex, rowIndex)])
        doc.setDrawColor(40, 40, 40)
        doc.rect(18, cursorY - 4, 4, 4)
        if (isChecked) {
          doc.setFont('helvetica', 'bold')
          doc.text('X', 18.9, cursorY - 0.7)
        }
        doc.setFont('helvetica', 'normal')
        doc.text(doc.splitTextToSize(row.label, 165), 26, cursorY)
        cursorY += 8
      }

      if (row.type === 'textarea') {
        const value = draft[getFieldId(sectionIndex, rowIndex)] || ' '
        const valueLines = doc.splitTextToSize(value, 168)
        const blockHeight = Math.max(18, valueLines.length * 5 + 8)
        cursorY = ensurePdfSpace(doc, cursorY, blockHeight + 6)
        doc.setFont('helvetica', 'bold')
        doc.text(row.label, 18, cursorY)
        cursorY += 3
        doc.rect(18, cursorY, 174, blockHeight)
        doc.setFont('helvetica', 'normal')
        doc.text(valueLines, 21, cursorY + 6)
        cursorY += blockHeight + 8
      }

      if (row.type === 'table') {
        const columnWidth = 174 / row.columns.length
        const headerHeight = 9
        const rowHeight = 11
        const tableHeight = headerHeight + row.rowCount * rowHeight
        cursorY = ensurePdfSpace(doc, cursorY, tableHeight + 6)

        row.columns.forEach((column, columnIndex) => {
          const x = 18 + columnIndex * columnWidth
          doc.setFillColor(240, 240, 240)
          doc.rect(x, cursorY, columnWidth, headerHeight, 'FD')
          doc.setFont('helvetica', 'bold')
          doc.setFontSize(8)
          doc.text(doc.splitTextToSize(column.label, columnWidth - 2), x + 1, cursorY + 4)
        })

        Array.from({ length: row.rowCount }, (_, tableRowIndex) => {
          const y = cursorY + headerHeight + tableRowIndex * rowHeight
          row.columns.forEach((column, columnIndex) => {
            const x = 18 + columnIndex * columnWidth
            const value = formatInputValue(
              draft[getTableCellId(sectionIndex, rowIndex, row.columns.length, tableRowIndex, columnIndex)],
              column.inputType
            )

            doc.rect(x, y, columnWidth, rowHeight)
            doc.setFont('helvetica', 'normal')
            doc.setFontSize(8)
            doc.text(doc.splitTextToSize(value || ' ', columnWidth - 2), x + 1, y + 4)
          })
        })

        doc.setFontSize(10)
        cursorY += tableHeight + 8
      }
    })
  })

  if (shouldSave) {
    doc.save(`${worksheet.key}.pdf`)
  }

  return doc
}

function SignaturePad({ value, onChange, error, qualityMode }) {
  const canvasRef = useRef(null)
  const wrapperRef = useRef(null)
  const drawingRef = useRef(false)
  const lastPointRef = useRef(null)
  const lastMidPointRef = useRef(null)
  const [isLandscapeMobile, setIsLandscapeMobile] = useState(false)

  function getCanvas() {
    return canvasRef.current
  }

  function initializeCanvas(canvas, preserveValue = value) {
    if (!canvas) {
      return
    }

    const wrapper = wrapperRef.current
    const ratio = window.devicePixelRatio || 1
    const displayWidth = Math.max(Math.floor(wrapper?.clientWidth || 520), 280)
    const mobileLandscape = window.innerWidth < 960 && window.innerWidth > window.innerHeight
    const displayHeight = mobileLandscape ? 112 : 160

    setIsLandscapeMobile(mobileLandscape)
    canvas.width = Math.floor(displayWidth * ratio)
    canvas.height = Math.floor(displayHeight * ratio)
    canvas.style.height = `${displayHeight}px`

    const context = canvas.getContext('2d')
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.scale(ratio, ratio)
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, displayWidth, displayHeight)
    context.strokeStyle = '#111111'
    context.lineCap = 'round'
    context.lineJoin = 'round'

    if (preserveValue) {
      const image = new Image()
      image.onload = () => {
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, displayWidth, displayHeight)
        context.drawImage(image, 0, 0, displayWidth, displayHeight)
      }
      image.src = preserveValue
    }
  }

  useEffect(() => {
    const canvas = getCanvas()
    initializeCanvas(canvas)

    function handleResize() {
      initializeCanvas(canvas, value)
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [value])

  function getPosition(event) {
    const canvas = getCanvas()
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / (rect.width * (window.devicePixelRatio || 1))
    const scaleY = canvas.height / (rect.height * (window.devicePixelRatio || 1))

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
      pressure: event.pressure && event.pressure > 0 ? event.pressure : 0.5,
    }
  }

  function startDraw(event) {
    event.preventDefault()
    const canvas = getCanvas()
    const context = canvas.getContext('2d')
    const point = getPosition(event)
    drawingRef.current = true
    lastPointRef.current = point
    lastMidPointRef.current = point
    canvas.setPointerCapture?.(event.pointerId)
    context.beginPath()
    context.moveTo(point.x, point.y)
    context.lineWidth = 1.2 + point.pressure * 2.8
  }

  function moveDraw(event) {
    if (!drawingRef.current) {
      return
    }

    event.preventDefault()
    const canvas = getCanvas()
    const context = canvas.getContext('2d')
    const point = getPosition(event)
    const lastPoint = lastPointRef.current || point
    const lastMidPoint = lastMidPointRef.current || lastPoint
    const midPoint = {
      x: (lastPoint.x + point.x) / 2,
      y: (lastPoint.y + point.y) / 2,
    }

    context.beginPath()
    context.lineWidth = 1.2 + point.pressure * 2.8
    context.moveTo(lastMidPoint.x, lastMidPoint.y)
    context.quadraticCurveTo(lastPoint.x, lastPoint.y, midPoint.x, midPoint.y)
    context.stroke()
    lastPointRef.current = point
    lastMidPointRef.current = midPoint
  }

  function endDraw(event) {
    if (!drawingRef.current) {
      return
    }

    drawingRef.current = false
    const canvas = getCanvas()
    canvas.releasePointerCapture?.(event.pointerId)
    lastPointRef.current = null
    lastMidPointRef.current = null
    onChange(optimizeSignatureDataUrl(canvas, qualityMode))
  }

  function clearSignature() {
    const canvas = getCanvas()
    initializeCanvas(canvas, '')
    onChange('')
  }

  return (
    <div ref={wrapperRef} className={`rounded-2xl border bg-white/70 p-3 print:border-0 print:bg-transparent print:p-0 ${error ? 'border-rose-500/50 shadow-[0_0_0_1px_rgba(244,63,94,0.18)]' : 'border-black/15'}`}>
      <canvas
        ref={canvasRef}
        tabIndex={0}
        onPointerDown={startDraw}
        onPointerMove={moveDraw}
        onPointerUp={endDraw}
        onPointerLeave={endDraw}
        className={`w-full touch-none rounded-xl border bg-white print:border-0 ${error ? 'border-rose-500/55' : 'border-dashed border-black/20'}`}
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 print:hidden">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
          {isLandscapeMobile ? 'Landscape signature pad optimized for thumb signing' : 'Draw signature with mouse, pen, or touch'}
        </span>
        <button
          type="button"
          onClick={clearSignature}
          className="rounded-full border border-black/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/60 transition hover:border-emerald-700/35 hover:text-black"
        >
          Clear Signature
        </button>
      </div>
      {error ? <p className="mt-2 text-xs leading-5 text-rose-700 print:hidden">{error}</p> : null}
    </div>
  )
}

function renderFieldInput(row, value, onChange, error) {
  const className = `${INPUT_STYLES} ${error ? 'border-rose-500/55 bg-rose-50/80' : ''}`

  if (row.inputType === 'select') {
    return (
      <select value={value ?? ''} onChange={(event) => onChange(event.target.value)} className={className}>
        <option value="">Select option</option>
        {row.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    )
  }

  const inputProps = getInputProps(row.inputType)

  return <input {...inputProps} value={value ?? ''} onChange={(event) => onChange(event.target.value)} className={className} placeholder={row.placeholder || 'Enter value'} />
}

function WorksheetPreview({ worksheet, draft, validationState, onFieldChange, onToggleCheck, onResetDraft, savedStatus, qualityMode }) {
  const validationErrors = validationState.errors
  const fieldErrors = validationState.fieldErrors

  return (
    <div id="printable-worksheet" className="rounded-[2rem] border border-black/10 bg-[#f6f3e8] p-6 text-black shadow-[0_18px_50px_rgba(0,0,0,0.25)] md:p-8 print:shadow-none">
      <div className="border-b border-black/10 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">{worksheet.eyebrow}</p>
        <h3 className="mt-3 text-3xl font-bold tracking-tight">{worksheet.title}</h3>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-black/65">{worksheet.description}</p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white/60 px-4 py-3 text-xs uppercase tracking-[0.18em] text-black/55 print:hidden">
          <span>{savedStatus}</span>
          <button
            type="button"
            onClick={onResetDraft}
            className="rounded-full border border-black/15 px-3 py-1.5 font-semibold tracking-[0.18em] text-black/60 transition hover:border-emerald-600/40 hover:text-black"
          >
            Clear Draft
          </button>
        </div>
        {validationErrors.length ? (
          <div className="mt-5 rounded-2xl border border-amber-600/20 bg-amber-100/65 p-4 text-sm text-amber-950 print:hidden">
            <p className="font-semibold uppercase tracking-[0.18em] text-amber-900">Validation Items</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 leading-6">
              {validationErrors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="mt-6 space-y-6">
        {worksheet.sections.map((section, sectionIndex) => (
          <section key={section.title}>
            <h4 className="border-b border-black/10 pb-2 text-sm font-semibold uppercase tracking-[0.22em] text-black/70">
              {section.title}
            </h4>

            <div className="mt-4 space-y-4">
              {section.rows.map((row, rowIndex) => {
                if (row.type === 'field') {
                  const fieldId = getFieldId(sectionIndex, rowIndex)
                  const fieldPill = getFieldPill(row.inputType)
                  const fieldError = fieldErrors[fieldId]

                  return (
                    <div key={`${section.title}-${row.label}`} data-error-target={fieldId} className="grid gap-2 scroll-mt-28 md:grid-cols-[220px_minmax(0,1fr)] md:items-start">
                      <div className="flex items-center gap-2 pt-2">
                        <span className="text-sm font-semibold text-black/75">{row.label}</span>
                        {fieldPill ? <span className="rounded-full border border-emerald-800/10 bg-emerald-700/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-800/70">{fieldPill}</span> : null}
                        {row.required ? <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-700/80">Required</span> : null}
                      </div>
                      <div>
                        {row.inputType === 'signature' ? (
                          <SignaturePad value={draft[fieldId]} onChange={(nextValue) => onFieldChange(fieldId, nextValue)} error={fieldError} qualityMode={qualityMode} />
                        ) : (
                          renderFieldInput(row, draft[fieldId], (nextValue) => onFieldChange(fieldId, nextValue), fieldError)
                        )}
                        {fieldError && row.inputType !== 'signature' ? <p className="mt-2 text-xs leading-5 text-rose-700 print:hidden">{fieldError}</p> : null}
                      </div>
                    </div>
                  )
                }

                if (row.type === 'check') {
                  const fieldId = getFieldId(sectionIndex, rowIndex)

                  return (
                    <label key={`${section.title}-${row.label}`} className="flex cursor-pointer items-start gap-3 text-sm leading-7 text-black/75">
                      <input
                        type="checkbox"
                        checked={Boolean(draft[fieldId])}
                        onChange={() => onToggleCheck(fieldId)}
                        className="mt-1 h-4 w-4 shrink-0 rounded border-black/60 text-emerald-700 focus:ring-emerald-600"
                      />
                      <span>{row.label}</span>
                    </label>
                  )
                }

                if (row.type === 'textarea') {
                  const fieldId = getFieldId(sectionIndex, rowIndex)
                  const fieldError = fieldErrors[fieldId]

                  return (
                    <div key={`${section.title}-${row.label}`} data-error-target={fieldId} className="space-y-2 scroll-mt-28">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-black/75">{row.label}</span>
                        <span className="rounded-full border border-black/10 bg-black/4 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/55">Notes</span>
                      </div>
                      <textarea
                        value={draft[fieldId] ?? ''}
                        onChange={(event) => onFieldChange(fieldId, event.target.value)}
                        rows={row.rows || 4}
                        className={`${TEXTAREA_STYLES} ${fieldError ? 'border-rose-500/55 bg-rose-50/80' : ''}`}
                        placeholder={row.placeholder || 'Enter notes'}
                      />
                      {fieldError ? <p className="text-xs leading-5 text-rose-700 print:hidden">{fieldError}</p> : null}
                    </div>
                  )
                }

                if (row.type === 'table') {
                  const tableError = fieldErrors[getTableErrorId(sectionIndex, rowIndex)]

                  return (
                    <div key={`${section.title}-table-${rowIndex}`} data-error-target={getTableErrorId(sectionIndex, rowIndex)} className={`overflow-x-auto rounded-2xl border bg-white/45 p-3 scroll-mt-28 ${tableError ? 'border-rose-500/55 shadow-[0_0_0_1px_rgba(244,63,94,0.15)]' : 'border-black/10'}`}>
                      <div className="grid min-w-[840px] gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/70" style={{ gridTemplateColumns: `repeat(${row.columns.length}, minmax(0, 1fr))` }}>
                        {row.columns.map((column) => (
                          <div key={column.label} className="border border-black/15 bg-black/[0.04] px-2 py-2">{column.label}{column.required ? ' *' : ''}</div>
                        ))}
                      </div>
                      <div className="mt-2 space-y-2">
                        {Array.from({ length: row.rowCount }, (_, tableRowIndex) => (
                          <div key={`${section.title}-table-row-${tableRowIndex}`} className="grid min-w-[840px] gap-2" style={{ gridTemplateColumns: `repeat(${row.columns.length}, minmax(0, 1fr))` }}>
                            {row.columns.map((column, columnIndex) => {
                              const fieldId = getTableCellId(sectionIndex, rowIndex, row.columns.length, tableRowIndex, columnIndex)
                              const fieldError = fieldErrors[fieldId]

                              if (column.inputType === 'select') {
                                return (
                                  <select key={fieldId} value={draft[fieldId] ?? ''} onChange={(event) => onFieldChange(fieldId, event.target.value)} className={`${INPUT_STYLES} ${fieldError ? 'border-rose-500/55 bg-rose-50/80' : ''}`}>
                                    <option value="">Select option</option>
                                    {column.options.map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                )
                              }

                              const inputProps = getInputProps(column.inputType)

                              return (
                                <input
                                  key={fieldId}
                                  {...inputProps}
                                  value={draft[fieldId] ?? ''}
                                  onChange={(event) => onFieldChange(fieldId, event.target.value)}
                                  className={`${INPUT_STYLES} ${fieldError ? 'border-rose-500/55 bg-rose-50/80' : ''}`}
                                  placeholder={column.placeholder || 'Entry'}
                                />
                              )
                            })}
                          </div>
                        ))}
                      </div>
                      {tableError ? <p className="mt-3 text-xs leading-5 text-rose-700 print:hidden">{tableError}</p> : null}
                    </div>
                  )
                }

                return null
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

async function shareWorksheetFile({ file, title, text }) {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
    return false
  }

  const sharePayload = { title, text, files: [file] }

  try {
    if (typeof navigator.canShare === 'function' && !navigator.canShare({ files: [file] })) {
      return false
    }

    await navigator.share(sharePayload)
    return true
  } catch {
    return false
  }
}

export default function ConstructionWorksheets() {
  const importPackInputRef = useRef(null)
  const importWorksheetInputRef = useRef(null)
  const [activeKey, setActiveKey] = useState(WORKSHEETS[0].key)
  const [isOnline, setIsOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine))
  const [exportQuality, setExportQuality] = useState('high')
  const [pendingErrorTarget, setPendingErrorTarget] = useState(null)
  const [drafts, setDrafts] = useState(() => {
    if (typeof window === 'undefined') {
      return WORKSHEETS.reduce((accumulator, worksheet) => {
        accumulator[worksheet.key] = createEmptyWorksheetDraft(worksheet)
        return accumulator
      }, {})
    }

    try {
      const savedDrafts = JSON.parse(window.localStorage.getItem(DRAFT_STORAGE_KEY) || '{}')

      return WORKSHEETS.reduce((accumulator, worksheet) => {
        accumulator[worksheet.key] = mergeDraftWithDefaults(worksheet, savedDrafts[worksheet.key])
        return accumulator
      }, {})
    } catch {
      return WORKSHEETS.reduce((accumulator, worksheet) => {
        accumulator[worksheet.key] = createEmptyWorksheetDraft(worksheet)
        return accumulator
      }, {})
    }
  })
  const [savedStatus, setSavedStatus] = useState('Local draft ready')
  const [actionNotice, setActionNotice] = useState('')
  const [queuedActions, setQueuedActions] = useState(() => {
    if (typeof window === 'undefined') {
      return []
    }

    try {
      return JSON.parse(window.localStorage.getItem(OFFLINE_ACTION_QUEUE_KEY) || '[]')
    } catch {
      return []
    }
  })
  const [queueHistory, setQueueHistory] = useState(() => {
    if (typeof window === 'undefined') {
      return []
    }

    try {
      return JSON.parse(window.localStorage.getItem(OFFLINE_ACTION_HISTORY_KEY) || '[]')
    } catch {
      return []
    }
  })

  const activeWorksheet = useMemo(
    () => WORKSHEETS.find((worksheet) => worksheet.key === activeKey) || WORKSHEETS[0],
    [activeKey]
  )

  const activeDraft = useMemo(
    () => drafts[activeKey] || createEmptyWorksheetDraft(activeWorksheet),
    [activeKey, activeWorksheet, drafts]
  )

  const validationByKey = useMemo(
    () =>
      WORKSHEETS.reduce((accumulator, worksheet) => {
        accumulator[worksheet.key] = getValidationErrors(worksheet, drafts[worksheet.key] || createEmptyWorksheetDraft(worksheet))
        return accumulator
      }, {}),
    [drafts]
  )

  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      @media print {
        body * { visibility: hidden; }
        #printable-worksheet, #printable-worksheet * { visibility: visible; }
        #printable-worksheet {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          margin: 0;
          border: none !important;
          box-shadow: none !important;
          background: white !important;
        }
        #printable-worksheet input,
        #printable-worksheet textarea,
        #printable-worksheet select,
        #printable-worksheet button {
          border: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
          resize: none !important;
          appearance: none !important;
        }
      }
    `
    document.head.appendChild(style)

    return () => document.head.removeChild(style)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts))
    setSavedStatus(`Saved locally at ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`)

    return undefined
  }, [drafts])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    window.localStorage.setItem(OFFLINE_ACTION_QUEUE_KEY, JSON.stringify(queuedActions))
    return undefined
  }, [queuedActions])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    window.localStorage.setItem(OFFLINE_ACTION_HISTORY_KEY, JSON.stringify(queueHistory))
    return undefined
  }, [queueHistory])

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
      setActionNotice((currentNotice) => currentNotice || 'Connection restored. Queued share actions are ready to process.')
    }

    function handleOffline() {
      setIsOnline(false)
      setActionNotice('Offline mode detected. Share actions can be queued and processed later.')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (!pendingErrorTarget) {
      return undefined
    }

    const timerId = window.setTimeout(() => {
      const target = document.querySelector(`[data-error-target="${pendingErrorTarget}"]`)
      if (!target) {
        return
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const focusable = target.querySelector('input, textarea, select, canvas, button')
      focusable?.focus?.({ preventScroll: true })
    }, 120)

    return () => window.clearTimeout(timerId)
  }, [activeKey, pendingErrorTarget])

  function updateWorksheetDraft(worksheetKey, fieldId, value) {
    setDrafts((currentDrafts) => {
      const worksheet = WORKSHEETS.find((item) => item.key === worksheetKey) || activeWorksheet
      return {
        ...currentDrafts,
        [worksheetKey]: {
          ...(currentDrafts[worksheetKey] || createEmptyWorksheetDraft(worksheet)),
          [fieldId]: value,
        },
      }
    })
  }

  function updateActiveDraft(fieldId, value) {
    if (pendingErrorTarget === fieldId) {
      setPendingErrorTarget(null)
    }
    updateWorksheetDraft(activeKey, fieldId, value)
  }

  function toggleActiveCheckbox(fieldId) {
    if (pendingErrorTarget === fieldId) {
      setPendingErrorTarget(null)
    }
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [activeKey]: {
        ...(currentDrafts[activeKey] || createEmptyWorksheetDraft(activeWorksheet)),
        [fieldId]: !currentDrafts[activeKey]?.[fieldId],
      },
    }))
  }

  function resetActiveDraft() {
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [activeKey]: createEmptyWorksheetDraft(activeWorksheet),
    }))
    setSavedStatus('Draft cleared locally')
    setActionNotice('')
    setPendingErrorTarget(null)
  }

  function appendHistoryEntry(entry) {
    setQueueHistory((currentHistory) => [
      {
        id: `${entry.status}-${entry.action}-${entry.worksheetKey || 'all'}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...entry,
      },
      ...currentHistory,
    ].slice(0, 30))
  }

  function validateBeforeAction(worksheet) {
    const validationState = validationByKey[worksheet.key] || { errors: [], fieldErrors: {} }
    const errors = validationState.errors
    if (errors.length) {
      setActiveKey(worksheet.key)
      const firstErrorTarget = Object.keys(validationState.fieldErrors)[0] || null
      setPendingErrorTarget(firstErrorTarget)
      setActionNotice(`Fix ${errors.length} validation item${errors.length === 1 ? '' : 's'} before exporting or printing ${worksheet.title}.`)
      return false
    }

    setPendingErrorTarget(null)
    setActionNotice('')
    return true
  }

  function handlePrint(worksheet) {
    if (!validateBeforeAction(worksheet)) {
      return
    }

    setActiveKey(worksheet.key)
    window.setTimeout(() => {
      window.print()
    }, 80)
  }

  function handleDownloadHtml(worksheet) {
    const html = buildWorksheetHtml(worksheet, drafts[worksheet.key] || createEmptyWorksheetDraft(worksheet))
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${worksheet.key}.html`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
    setActionNotice(`${worksheet.title} HTML export downloaded.`)
    appendHistoryEntry({ worksheetKey: worksheet.key, worksheetTitle: worksheet.title, action: 'html-export', status: 'downloaded' })
  }

  function handleExportPdf(worksheet) {
    if (!validateBeforeAction(worksheet)) {
      return
    }

    exportWorksheetPdf(worksheet, drafts[worksheet.key] || createEmptyWorksheetDraft(worksheet), { qualityMode: exportQuality })
    setActionNotice(`${worksheet.title} branded PDF exported.`)
    appendHistoryEntry({ worksheetKey: worksheet.key, worksheetTitle: worksheet.title, action: 'pdf-export', status: `exported-${exportQuality}` })
  }

  function downloadJson(payload, filename) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
  }

  function enqueueOfflineAction(type, worksheet, draftSnapshot) {
    setQueuedActions((currentQueue) => [
      ...currentQueue,
      {
        id: `${type}-${worksheet.key}-${Date.now()}`,
        type,
        worksheetKey: worksheet.key,
        worksheetTitle: worksheet.title,
        draftSnapshot,
        queuedAt: new Date().toISOString(),
      },
    ])
    appendHistoryEntry({ worksheetKey: worksheet.key, worksheetTitle: worksheet.title, action: type, status: 'queued-offline' })
  }

  async function processQueuedAction(queueItem) {
    const worksheet = WORKSHEETS.find((item) => item.key === queueItem.worksheetKey)
    if (!worksheet) {
      setQueuedActions((currentQueue) => currentQueue.filter((item) => item.id !== queueItem.id))
      return
    }

    const draftSnapshot = mergeDraftWithDefaults(worksheet, queueItem.draftSnapshot)

    if (queueItem.type === 'share-json') {
      const payload = createJsonPayloadForWorksheet(worksheet, draftSnapshot)
      const file = new File([createJsonBlob(payload)], `${worksheet.key}-draft.json`, { type: 'application/json' })
      const wasShared = await shareWorksheetFile({
        file,
        title: `${worksheet.title} Draft`,
        text: `RuntWerkx worksheet draft for ${worksheet.title}`,
      })

      if (wasShared) {
        setQueuedActions((currentQueue) => currentQueue.filter((item) => item.id !== queueItem.id))
        setActionNotice(`${worksheet.title} queued draft share completed.`)
        appendHistoryEntry({ worksheetKey: worksheet.key, worksheetTitle: worksheet.title, action: queueItem.type, status: 'shared-from-queue' })
        return
      }

      downloadJson(payload, `${worksheet.key}-draft.json`)
      setQueuedActions((currentQueue) => currentQueue.filter((item) => item.id !== queueItem.id))
      setActionNotice(`Share sheet unavailable, downloaded queued ${worksheet.title} draft instead.`)
      appendHistoryEntry({ worksheetKey: worksheet.key, worksheetTitle: worksheet.title, action: queueItem.type, status: 'downloaded-fallback' })
      return
    }

    if (queueItem.type === 'share-pdf') {
      const blob = createPdfBlob(worksheet, draftSnapshot)
      const file = new File([blob], `${worksheet.key}.pdf`, { type: 'application/pdf' })
      const wasShared = await shareWorksheetFile({
        file,
        title: `${worksheet.title} PDF`,
        text: `RuntWerkx branded worksheet PDF for ${worksheet.title}`,
      })

      if (wasShared) {
        setQueuedActions((currentQueue) => currentQueue.filter((item) => item.id !== queueItem.id))
        setActionNotice(`${worksheet.title} queued PDF share completed.`)
        appendHistoryEntry({ worksheetKey: worksheet.key, worksheetTitle: worksheet.title, action: queueItem.type, status: 'shared-from-queue' })
        return
      }

      exportWorksheetPdf(worksheet, draftSnapshot, { qualityMode: exportQuality })
      setQueuedActions((currentQueue) => currentQueue.filter((item) => item.id !== queueItem.id))
      setActionNotice(`Share sheet unavailable, exported queued ${worksheet.title} PDF instead.`)
      appendHistoryEntry({ worksheetKey: worksheet.key, worksheetTitle: worksheet.title, action: queueItem.type, status: `exported-fallback-${exportQuality}` })
    }
  }

  async function handleShareWorksheetJson(worksheet) {
    const payload = createJsonPayloadForWorksheet(worksheet, drafts[worksheet.key] || createEmptyWorksheetDraft(worksheet))
    if (!isOnline) {
      enqueueOfflineAction('share-json', worksheet, payload.draft)
      setActionNotice(`${worksheet.title} draft share queued for later.`)
      return
    }

    const file = new File([createJsonBlob(payload)], `${worksheet.key}-draft.json`, { type: 'application/json' })
    const wasShared = await shareWorksheetFile({
      file,
      title: `${worksheet.title} Draft`,
      text: `RuntWerkx worksheet draft for ${worksheet.title}`,
    })

    if (wasShared) {
      setActionNotice(`${worksheet.title} draft shared.`)
      appendHistoryEntry({ worksheetKey: worksheet.key, worksheetTitle: worksheet.title, action: 'share-json', status: 'shared' })
      return
    }

    downloadJson(payload, `${worksheet.key}-draft.json`)
    setActionNotice(`Share sheet unavailable, downloaded ${worksheet.title} draft instead.`)
    appendHistoryEntry({ worksheetKey: worksheet.key, worksheetTitle: worksheet.title, action: 'share-json', status: 'downloaded-fallback' })
  }

  async function handleShareWorksheetPdf(worksheet) {
    if (!validateBeforeAction(worksheet)) {
      return
    }

    if (!isOnline) {
      enqueueOfflineAction('share-pdf', worksheet, drafts[worksheet.key] || createEmptyWorksheetDraft(worksheet))
      setActionNotice(`${worksheet.title} PDF share queued for later.`)
      return
    }

    const blob = createPdfBlob(worksheet, drafts[worksheet.key] || createEmptyWorksheetDraft(worksheet), exportQuality)
    const file = new File([blob], `${worksheet.key}.pdf`, { type: 'application/pdf' })
    const wasShared = await shareWorksheetFile({
      file,
      title: `${worksheet.title} PDF`,
      text: `RuntWerkx branded worksheet PDF for ${worksheet.title}`,
    })

    if (wasShared) {
      setActionNotice(`${worksheet.title} PDF shared.`)
      appendHistoryEntry({ worksheetKey: worksheet.key, worksheetTitle: worksheet.title, action: 'share-pdf', status: `shared-${exportQuality}` })
      return
    }

    handleExportPdf(worksheet)
  }

  async function handleProcessNextQueuedAction() {
    if (!queuedActions.length) {
      setActionNotice('No queued actions waiting to process.')
      return
    }

    if (!isOnline) {
      setActionNotice('Still offline. Reconnect before processing queued share actions.')
      return
    }

    await processQueuedAction(queuedActions[0])
  }

  function handleClearQueuedActions() {
    setQueuedActions([])
    setActionNotice('Queued share actions cleared.')
    appendHistoryEntry({ action: 'queue', status: 'cleared', worksheetKey: 'all', worksheetTitle: 'All queued actions' })
  }

  function handleExportDrafts() {
    downloadJson(
      {
        version: 1,
        exportedAt: new Date().toISOString(),
        source: 'RuntWerkx Construction Worksheets',
        drafts,
      },
      `runtwerkx-construction-drafts-${new Date().toISOString().slice(0, 10)}.json`
    )
    setActionNotice('Full worksheet draft pack exported.')
    appendHistoryEntry({ action: 'draft-pack-export', status: 'downloaded', worksheetKey: 'all', worksheetTitle: 'Full worksheet draft pack' })
  }

  function handleExportSingleWorksheet(worksheet) {
    downloadJson(createJsonPayloadForWorksheet(worksheet, drafts[worksheet.key] || createEmptyWorksheetDraft(worksheet)), `${worksheet.key}-draft.json`)
    setActionNotice(`${worksheet.title} draft exported.`)
    appendHistoryEntry({ worksheetKey: worksheet.key, worksheetTitle: worksheet.title, action: 'single-draft-export', status: 'downloaded' })
  }

  function handleImportDraftPack(event) {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'))
        const importedDrafts = parsed.drafts || parsed

        setDrafts(
          WORKSHEETS.reduce((accumulator, worksheet) => {
            accumulator[worksheet.key] = mergeDraftWithDefaults(worksheet, importedDrafts[worksheet.key])
            return accumulator
          }, {})
        )
        setActionNotice(`Imported full draft pack at ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}.`)
        appendHistoryEntry({ action: 'draft-pack-import', status: 'imported', worksheetKey: 'all', worksheetTitle: 'Full worksheet draft pack' })
      } catch {
        setActionNotice('Import failed: invalid draft pack file.')
        appendHistoryEntry({ action: 'draft-pack-import', status: 'failed', worksheetKey: 'all', worksheetTitle: 'Full worksheet draft pack' })
      }

      event.target.value = ''
    }
    reader.readAsText(file)
  }

  function handleImportSingleWorksheet(event) {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'))
        const worksheetKey = parsed.worksheetKey || activeKey
        const targetWorksheet = WORKSHEETS.find((worksheet) => worksheet.key === worksheetKey)
        const importedDraft = parsed.draft || parsed

        if (!targetWorksheet) {
          setActionNotice('Worksheet import failed: unknown worksheet key.')
          event.target.value = ''
          return
        }

        setDrafts((currentDrafts) => ({
          ...currentDrafts,
          [worksheetKey]: mergeDraftWithDefaults(targetWorksheet, importedDraft),
        }))
        setActiveKey(worksheetKey)
        setActionNotice(`${targetWorksheet.title} draft imported.`)
        appendHistoryEntry({ worksheetKey, worksheetTitle: targetWorksheet.title, action: 'single-draft-import', status: 'imported' })
      } catch {
        setActionNotice('Worksheet import failed: invalid worksheet draft file.')
        appendHistoryEntry({ worksheetKey: activeKey, worksheetTitle: activeWorksheet.title, action: 'single-draft-import', status: 'failed' })
      }

      event.target.value = ''
    }
    reader.readAsText(file)
  }

  function handleEmail(worksheet) {
    if (!validateBeforeAction(worksheet)) {
      return
    }

    const subject = encodeURIComponent(`${worksheet.title} | RuntWerkx Construction Worksheets`)
    const body = encodeURIComponent(
      `Open this construction worksheet page for ${worksheet.title}: ${window.location.href}\n\nYou can also export a branded PDF directly from the worksheet panel before sending.`
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <Helmet>
        <title>Construction Worksheets | RuntWerkx</title>
        <meta
          name="description"
          content="Fill, sign, validate, print, export branded PDFs, and move worksheet drafts for daily construction forms including site checklists, pre-task plans, pour logs, delivery inspections, and equipment checks."
        />
        <link rel="canonical" href={PAGE_URL} />
      </Helmet>

      <Navbar />

      <div
        className="fixed inset-0 z-0 h-full w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: PAGE_BACKGROUND_IMAGE_SRC ? `url(${PAGE_BACKGROUND_IMAGE_SRC})` : 'none' }}
      />
      <div className="fixed inset-0 z-0 bg-black/56" />
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.10),transparent_34%),linear-gradient(to_bottom,rgba(0,0,0,0.12),rgba(0,0,0,0.58))]" />

      <main className="relative z-10 overflow-hidden">
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-7xl px-6 pb-16 pt-20">
            <div className="mb-8 flex flex-wrap gap-3">
              <Link
                to="/knowledge-library/construction"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm text-white/70 transition hover:border-green-400/50 hover:text-white"
              >
                ← Back to Construction
              </Link>
              <Link
                to="/knowledge-library"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm text-white/70 transition hover:border-green-400/50 hover:text-white"
              >
                Knowledge Library
              </Link>
            </div>

            <div className="mx-auto max-w-5xl rounded-[2rem] bg-black/55 px-6 py-12 text-center backdrop-blur-[2px] md:px-10 md:py-12">
              <p className="text-sm font-semibold uppercase tracking-[0.30em] text-green-400">― Construction Tools ―</p>
              <h1 className="mt-5 text-4xl font-black leading-tight text-white md:text-6xl">Construction Worksheets</h1>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/72 md:text-lg">
                Fill, sign, save locally, validate, print, export branded PDFs, and share field-ready worksheets used in daily construction work.
              </p>
              <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-white/60">
                These sheets are built for real site use: daily readiness, pre-task planning, lift prep, delivery receiving, equipment checks, anchor records, pour tracking, and clean area turnover between crews or trades.
              </p>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-7xl px-6 py-14">
          <SectionHeader
            eyebrow="― Worksheet Library ―"
            title="Daily construction forms crews can fill, sign, and move"
            description="Pick a worksheet, fill it directly in the browser, capture real handwritten signatures, validate critical fields, export a branded PDF, move either one worksheet or the full draft pack between devices, print it, or download a filled HTML copy."
          />

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.20em] text-white/70">
              <span>Export Quality</span>
              <div className="inline-flex overflow-hidden rounded-full border border-white/10">
                <button
                  type="button"
                  onClick={() => setExportQuality('low')}
                  className={`px-3 py-1.5 transition ${exportQuality === 'low' ? 'bg-white text-black' : 'bg-transparent text-white/70 hover:text-white'}`}
                >
                  Low
                </button>
                <button
                  type="button"
                  onClick={() => setExportQuality('high')}
                  className={`px-3 py-1.5 transition ${exportQuality === 'high' ? 'bg-green-400 text-black' : 'bg-transparent text-white/70 hover:text-white'}`}
                >
                  High
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={handleExportDrafts}
              className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-500/[0.08] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.20em] text-green-300 transition hover:-translate-y-0.5 hover:border-green-400/40 hover:bg-green-500/[0.12] hover:text-white"
            >
              <Download className="h-4 w-4" />
              Export Draft Pack
            </button>
            <button
              type="button"
              onClick={() => importPackInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.20em] text-white/70 transition hover:-translate-y-0.5 hover:border-green-400/30 hover:text-white"
            >
              <Upload className="h-4 w-4" />
              Import Draft Pack
            </button>
            <input ref={importPackInputRef} type="file" accept="application/json" onChange={handleImportDraftPack} className="hidden" />
          </div>

          {!isOnline || queuedActions.length ? (
            <div className="mx-auto mt-6 flex max-w-4xl flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              <div>
                <p className="font-semibold uppercase tracking-[0.18em] text-amber-200">Offline Queue</p>
                <p className="mt-1 text-sm leading-6 text-amber-100/80">
                  {isOnline
                    ? `${queuedActions.length} queued action${queuedActions.length === 1 ? '' : 's'} ready to process.`
                    : `${queuedActions.length} queued action${queuedActions.length === 1 ? '' : 's'} stored locally while offline.`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleProcessNextQueuedAction}
                  className="rounded-full border border-amber-300/30 bg-amber-200/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.20em] text-amber-100 transition hover:border-amber-200/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
                  disabled={!queuedActions.length || !isOnline}
                >
                  Process Next
                </button>
                <button
                  type="button"
                  onClick={handleClearQueuedActions}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.20em] text-white/70 transition hover:border-amber-300/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
                  disabled={!queuedActions.length}
                >
                  Clear Queue
                </button>
              </div>
            </div>
          ) : null}

          {actionNotice ? (
            <div className="mx-auto mt-6 max-w-4xl rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-center text-sm text-white/74">
              {actionNotice}
            </div>
          ) : null}

          {queueHistory.length ? (
            <div className="mx-auto mt-6 max-w-5xl rounded-[1.75rem] border border-white/10 bg-black/35 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.20em] text-green-300">Queue Activity</p>
                  <p className="mt-2 text-sm leading-6 text-white/60">Recent share, export, import, and queue events saved locally for supervisor review.</p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                  {queueHistory.length} saved event{queueHistory.length === 1 ? '' : 's'}
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {queueHistory.slice(0, 10).map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-white">{item.worksheetTitle}</p>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-green-300">{item.action}</p>
                    <p className="mt-2 text-sm leading-6 text-white/55">{formatTimestamp(item.timestamp)}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-12 grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
            <div className="space-y-5">
              {WORKSHEETS.map((worksheet) => {
                const Icon = worksheet.icon
                const isActive = worksheet.key === activeWorksheet.key
                const worksheetErrors = validationByKey[worksheet.key]?.errors || []

                return (
                  <div
                    key={worksheet.key}
                    className={`rounded-[1.75rem] border p-5 transition duration-300 ${
                      isActive
                        ? 'border-green-400/35 bg-green-500/[0.08] shadow-[0_0_24px_rgba(34,197,94,0.12)]'
                        : 'border-white/10 bg-black/45 hover:border-green-400/25'
                    }`}
                  >
                    <button type="button" onClick={() => setActiveKey(worksheet.key)} className="w-full text-left">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-green-500/20 bg-green-500/10 text-green-300">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-green-400">{worksheet.eyebrow}</p>
                            {worksheetErrors.length ? (
                              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200">
                                {worksheetErrors.length} validation item{worksheetErrors.length === 1 ? '' : 's'}
                              </span>
                            ) : (
                              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                                ready
                              </span>
                            )}
                          </div>
                          <h3 className="mt-2 text-2xl font-bold text-white">{worksheet.title}</h3>
                          <p className="mt-3 text-sm leading-7 text-white/68">{worksheet.description}</p>
                        </div>
                      </div>
                    </button>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => handleExportPdf(worksheet)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-green-400/20 bg-green-500/[0.08] px-4 py-3 text-xs font-semibold uppercase tracking-[0.20em] text-green-300 transition hover:-translate-y-0.5 hover:border-green-400/40 hover:bg-green-500/[0.12] hover:text-white"
                      >
                        <FileSignature className="h-4 w-4" />
                        Export PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePrint(worksheet)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-semibold uppercase tracking-[0.20em] text-white/65 transition hover:-translate-y-0.5 hover:border-green-400/30 hover:text-white"
                      >
                        <Printer className="h-4 w-4" />
                        Print / Save PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExportSingleWorksheet(worksheet)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-3 text-xs font-semibold uppercase tracking-[0.20em] text-white/65 transition hover:-translate-y-0.5 hover:border-green-400/30 hover:text-white"
                      >
                        <Download className="h-4 w-4" />
                        Export Form JSON
                      </button>
                      <button
                        type="button"
                        onClick={() => handleShareWorksheetPdf(worksheet)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-3 text-xs font-semibold uppercase tracking-[0.20em] text-white/65 transition hover:-translate-y-0.5 hover:border-green-400/30 hover:text-white"
                      >
                        <Share2 className="h-4 w-4" />
                        Share PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEmail(worksheet)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-3 text-xs font-semibold uppercase tracking-[0.20em] text-white/65 transition hover:-translate-y-0.5 hover:border-green-400/30 hover:text-white"
                      >
                        <Mail className="h-4 w-4" />
                        Email Link
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/45 p-6 backdrop-blur-sm md:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-400">― Live Worksheet ―</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">{activeWorksheet.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/60">Entries save automatically in this browser for this device. Handwritten signatures are compressed for lighter exports, field-level validation is shown inline, offline share intents can be queued locally, and the first invalid field is brought into view automatically.</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleExportPdf(activeWorksheet)}
                    className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-500/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-[0.20em] text-green-300 transition hover:-translate-y-0.5 hover:border-green-400/40 hover:bg-green-500/[0.12] hover:text-white"
                  >
                    <FileSignature className="h-4 w-4" />
                    Branded PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePrint(activeWorksheet)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.20em] text-white/65 transition hover:-translate-y-0.5 hover:border-green-400/30 hover:text-white"
                  >
                    <Printer className="h-4 w-4" />
                    Print Preview
                  </button>
                </div>
              </div>

              <div className="mb-6 flex flex-wrap gap-3 print:hidden">
                <button
                  type="button"
                  onClick={() => handleExportSingleWorksheet(activeWorksheet)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.20em] text-white/70 transition hover:-translate-y-0.5 hover:border-green-400/30 hover:text-white"
                >
                  <Download className="h-4 w-4" />
                  Export This Worksheet
                </button>
                <button
                  type="button"
                  onClick={() => handleShareWorksheetJson(activeWorksheet)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.20em] text-white/70 transition hover:-translate-y-0.5 hover:border-green-400/30 hover:text-white"
                >
                  <Share2 className="h-4 w-4" />
                  Share Worksheet JSON
                </button>
                <button
                  type="button"
                  onClick={() => handleShareWorksheetPdf(activeWorksheet)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.20em] text-white/70 transition hover:-translate-y-0.5 hover:border-green-400/30 hover:text-white"
                >
                  <Share2 className="h-4 w-4" />
                  Share Worksheet PDF
                </button>
                <button
                  type="button"
                  onClick={() => importWorksheetInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.20em] text-white/70 transition hover:-translate-y-0.5 hover:border-green-400/30 hover:text-white"
                >
                  <Upload className="h-4 w-4" />
                  Import Worksheet
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadHtml(activeWorksheet)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.20em] text-white/70 transition hover:-translate-y-0.5 hover:border-green-400/30 hover:text-white"
                >
                  <Download className="h-4 w-4" />
                  Download HTML
                </button>
                <input ref={importWorksheetInputRef} type="file" accept="application/json" onChange={handleImportSingleWorksheet} className="hidden" />
              </div>

              <WorksheetPreview
                worksheet={activeWorksheet}
                draft={activeDraft}
                validationState={validationByKey[activeWorksheet.key] || { errors: [], fieldErrors: {} }}
                onFieldChange={updateActiveDraft}
                onToggleCheck={toggleActiveCheckbox}
                onResetDraft={resetActiveDraft}
                savedStatus={savedStatus}
                qualityMode={exportQuality}
              />
            </div>
          </div>

          <section className="mt-12 rounded-[2rem] border border-green-500/15 bg-zinc-950/45 p-8 backdrop-blur-sm">
            <SectionHeader
              eyebrow="― Workflow Notes ―"
              title="Signatures, validation, and per-form transfer are live"
              description="This page now supports handwritten signature capture on canvas, worksheet-level validation for critical logs and receiving forms, and single-worksheet draft export/import in addition to the full draft pack workflow."
            />

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5">
                <div className="flex items-center gap-2 text-green-300">
                  <FileSignature className="h-5 w-5" />
                  <h3 className="text-lg font-bold text-white">Real signature capture</h3>
                </div>
                <p className="mt-3 text-sm leading-7 text-white/68">Signature fields now use smoother pointer-based strokes with pressure-aware line width where supported, and low/high export quality modes control how aggressively signatures and PDFs are compressed.</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5">
                <div className="flex items-center gap-2 text-green-300">
                  <CalendarDays className="h-5 w-5" />
                  <h3 className="text-lg font-bold text-white">Critical field validation</h3>
                </div>
                <p className="mt-3 text-sm leading-7 text-white/68">Concrete Pour Log, Delivery Inspection Sheet, Anchor Log, and Equipment Checklist now enforce stricter required-field and conditional-note rules, and the exact invalid fields are highlighted and scrolled into view directly in the form.</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5">
                <div className="flex items-center gap-2 text-green-300">
                  <Share2 className="h-5 w-5" />
                  <h3 className="text-lg font-bold text-white">Share one worksheet</h3>
                </div>
                <p className="mt-3 text-sm leading-7 text-white/68">Supported mobile browsers can now open the native share sheet with either the single-form JSON draft or the generated PDF attached, and offline share requests plus their statuses are queued and logged locally for later processing and review.</p>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  )
}
