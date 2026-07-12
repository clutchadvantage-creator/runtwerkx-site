import agtToolImage from '../assets/agttool.png'
import fileRouterImage from '../assets/filerouter.png'
import hrisImage from '../assets/HRIS.png'
import cardWerkxImage from '../assets/cardwerkx.png'
import workflowImage from '../assets/workflow.png'
import productionImage from '../assets/production.png'

export const recommendationRoutes = {
  workflowConsulting: '/recommendation/workflow-consulting',
  customTools: '/recommendation/custom-tools',
  platformEngineering: '/recommendation/platform-engineering',
  alternatePath: '/recommendation/alternate-path',
}

export const recommendationPageConfigs = {
  [recommendationRoutes.workflowConsulting]: {
    route: recommendationRoutes.workflowConsulting,
    title: 'Workflow Consulting',
    heroEyebrow: 'Recommended Next Step',
    heroTitle: 'Workflow Consulting',
    heroBody:
      'This recommendation is for organizations that need process clarity before software is built. It is the right path when workflow friction, unclear handoffs, and operational confusion need to be understood before deciding what to change.',
    explanation:
      'Workflow Consulting helps RuntWerkx evaluate how work actually moves through your operation, where friction accumulates, and what should be improved before technology decisions are made.',
    whyRecommended: [
      'Your responses suggest the root issue may involve workflow alignment rather than a single missing tool.',
      'This path is best when processes are messy, handoffs are weak, or the real cause of friction is not fully defined.',
      'It creates a practical foundation for process improvement, custom tooling, or platform development later if needed.',
    ],
    whatHappensNext: [
      'Review current workflows and operational handoffs.',
      'Map process paths, bottlenecks, and decision points.',
      'Identify where software fit, visibility, or execution structure is breaking down.',
      'Develop a roadmap for process improvement, tooling, or platform work.',
    ],
    outcomes: [
      'Workflow review',
      'Process mapping',
      'Bottleneck identification',
      'Handoff analysis',
      'Roadmap development',
      'Recommendations for process improvement, tooling, or platform engineering',
    ],
    customWorkflowPanels: [
      {
        type: 'image',
        title: 'Workflow Consulting Overview',
        label: 'Workflow Consulting Overview',
        imageSrc: workflowImage,
      },
      {
        type: 'text',
        title: 'Operationally Crafted',
        body: 'RuntWerkx builds around real-world execution, turning fragmented process steps into structured workflows that teams can run with confidence.',
      },
      {
        type: 'text',
        title: 'Built For Production',
        body: 'Every solution is crafted to improve efficiency, reduce manual drag, and support stronger output from day-to-day operations.',
      },
      {
        type: 'image',
        title: 'RuntWerkx Workflow Example',
        label: 'Production Workflow Example',
        imageSrc: productionImage,
      },
    ],
    ctaLabel: 'Connect With RuntWerkx',
  },
  [recommendationRoutes.customTools]: {
    route: recommendationRoutes.customTools,
    title: 'Custom Tools',
    heroEyebrow: 'Recommended Next Step',
    heroTitle: 'Custom Tools',
    heroBody:
      'This recommendation is for operations dealing with spreadsheets, repetitive tasks, paper processes, or internal workflow gaps that need focused software built around how the team actually works.',
    explanation:
      'Custom Tools is the right path when the friction is specific, repeated, and operational. The goal is not generic software. The goal is purpose-built internal tools that remove drag and improve execution.',
    whyRecommended: [
      'Your responses indicate manual work, duplicate entry, or internal process gaps that can be solved with focused operational software.',
      'This path is best when a large platform is unnecessary but the team still needs better execution support.',
      'RuntWerkx can build tools around real workflows instead of forcing teams into rigid software patterns.',
    ],
    whatHappensNext: [
      'Review the specific manual or repetitive work creating friction.',
      'Define the smallest useful toolset needed to remove operational drag.',
      'Design the experience around how people actually execute work.',
      'Build, refine, and deploy the tool into the operational environment.',
    ],
    outcomes: [
      'Purpose-built internal tools',
      'Dashboards',
      'Forms and workflow utilities',
      'Reporting tools',
      'Data cleanup or process support systems',
      'Tools shaped around actual team behavior',
    ],
    customWorkflowPanels: [
      {
        type: 'image',
        title: 'Workflow Tooling Mockup',
        label: 'Workflow Tooling Mockup',
        imageSrc: agtToolImage,
      },
      {
        type: 'text',
        title: 'Custom Workflow Tools',
        body: 'Custom workflow tools remove repeat tasks, speed up handoffs, and help teams execute with less operational drag.',
      },
      {
        type: 'text',
        title: 'Efficiency + Production',
        body: 'Purpose-built systems increase efficiency and production by aligning software to how your team actually works every day.',
      },
      {
        type: 'image',
        title: 'Operations Dashboard Concept',
        label: 'Operations Dashboard Concept',
        imageSrc: fileRouterImage,
      },
    ],
    ctaLabel: 'Discuss A Custom Tool',
  },
  [recommendationRoutes.platformEngineering]: {
    route: recommendationRoutes.platformEngineering,
    title: 'Platform Engineering',
    heroEyebrow: 'Recommended Next Step',
    heroTitle: 'Platform Engineering',
    heroBody:
      'This recommendation is for organizations that need connected systems across departments, stronger visibility, workflow automation, or an internal platform that centralizes execution.',
    explanation:
      'Platform Engineering is the right path when the challenge is bigger than one isolated tool. It is about connected workflows, shared visibility, integrations, and scalable operational architecture.',
    whyRecommended: [
      'Your responses suggest fragmented systems, leadership visibility gaps, or cross-department execution challenges.',
      'This path fits organizations that need portals, dashboards, automation, or connected operational layers.',
      'RuntWerkx can help unify execution systems into a more scalable operating model.',
    ],
    whatHappensNext: [
      'Review current systems, teams, and workflow dependencies.',
      'Identify missing visibility, integration gaps, and high-friction handoffs.',
      'Define the architecture for a connected internal platform or operational layer.',
      'Plan phased implementation around practical operational value.',
    ],
    outcomes: [
      'Internal platforms',
      'Connected workflows',
      'Dashboards and visibility systems',
      'Integrations',
      'Multi-department operating systems',
      'Scalable architecture for growth',
    ],
    customWorkflowPanels: [
      {
        type: 'image',
        title: 'HRIS Platform View',
        label: 'HRIS Platform View',
        imageSrc: hrisImage,
      },
      {
        type: 'text',
        title: 'Connected Operations',
        body: 'Platform engineering aligns departments through shared workflows, visibility, and operational reliability at scale.',
      },
      {
        type: 'text',
        title: 'Integrated Execution',
        body: 'RuntWerkx designs integration-ready systems that reduce handoff friction and create stronger cross-team execution.',
      },
      {
        type: 'image',
        title: 'Platform Architecture Overview',
        label: 'Platform Architecture Overview',
        imageSrc: cardWerkxImage,
      },
    ],
    ctaLabel: 'Plan A Platform With RuntWerkx',
  },
  [recommendationRoutes.alternatePath]: {
    route: recommendationRoutes.alternatePath,
    title: 'Alternate Path',
    heroEyebrow: 'Trusted Guidance',
    heroTitle: 'Alternate Path',
    heroBody:
      'Some problems are best solved by existing software, internal IT, licensed specialists, ERP providers, hardware vendors, or other outside providers. This is not a rejection. It is guidance toward the most practical next step.',
    explanation:
      'RuntWerkx may still be able to help evaluate the situation if the challenge touches operations, workflows, systems, software, or process design. The recommendation simply means the primary need may live outside the core build scope.',
    whyRecommended: [
      'Your responses indicate the issue may require a specialist outside RuntWerkx core delivery scope.',
      'This can include accounting, payroll, tax, legal, medical, hardware, or vendor-specific support needs.',
      'RuntWerkx can still help evaluate the operational layer if workflow or system friction is part of the broader problem.',
    ],
    whatHappensNext: [
      'Clarify whether the challenge is operational, technical, specialist-driven, or vendor-driven.',
      'Determine whether current software, internal IT, or outside providers should lead the next step.',
      'If workflows or systems are still part of the issue, assess whether RuntWerkx should help evaluate the situation.',
    ],
    outcomes: [
      'Trusted guidance on best-fit next steps',
      'Clearer separation between software, workflow, and specialist needs',
      'Better understanding of whether RuntWerkx should stay involved as an evaluator or systems advisor',
    ],
    hideCraftedSection: true,
    closingMessageTitle: 'Our Goal For You',
    closingMessageBody:
      'Our main mission is to help your operation improve performance, remove friction, and increase production in practical, measurable ways. If we are not the right fit for what you need, we will tell you directly and help point you toward the best next step.',
    ctaLabel: 'Talk Through The Situation',
  },
}

export const recommendationCategoryToRoute = {
  workflowConsulting: recommendationRoutes.workflowConsulting,
  operationalTooling: recommendationRoutes.customTools,
  platformEngineering: recommendationRoutes.platformEngineering,
  betterFitElsewhere: recommendationRoutes.alternatePath,
}

export function getRecommendationPageConfig(route) {
  return recommendationPageConfigs[route] || null
}

export function getRecommendationMetadata({ category, stagedPath, headline, body }) {
  const primaryKey = stagedPath?.[0] || category || 'workflowConsulting'
  const secondaryKey = stagedPath?.[1] || null
  const route = recommendationCategoryToRoute[primaryKey] || recommendationRoutes.workflowConsulting
  const config = recommendationPageConfigs[route]

  return {
    title: config?.title || 'Recommendation',
    route,
    primaryRecommendation: primaryKey,
    secondaryRecommendation: secondaryKey,
    reasoning: body,
    continueLabel: 'Continue',
    headline,
    body,
  }
}
