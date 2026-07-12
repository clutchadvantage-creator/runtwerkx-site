export const assessmentConversation = {
  intro: {
    id: 'intro',
    role: 'assistant',
    prompt: 'Is your business or operation experiencing unnecessary friction?',
    kind: 'binary',
    options: [
      { label: 'YES', value: 'yes' },
      { label: 'NO', value: 'no' },
    ],
    next: (answer) => (answer === 'yes' ? 'friction-area' : 'no-friction'),
  },
  'friction-area': {
    id: 'friction-area',
    role: 'assistant',
    transitionLine: "I'm beginning to understand your operation.",
    prompt: 'Which area is causing the most operational friction?',
    kind: 'dropdown',
    options: [
      { label: 'Production bottlenecks', value: 'Production bottlenecks', tags: ['workflowConsulting'] },
      { label: 'Reporting / visibility', value: 'Reporting / visibility', tags: ['platformEngineering'] },
      { label: 'Paper forms', value: 'Paper forms', tags: ['operationalTooling'] },
      { label: 'Too many spreadsheets', value: 'Too many spreadsheets', tags: ['operationalTooling'] },
      { label: 'Duplicate data entry', value: 'Duplicate data entry', tags: ['operationalTooling'] },
      { label: 'Systems do not communicate', value: 'Systems do not communicate', tags: ['platformEngineering'] },
      { label: 'Employees waste time searching for information', value: 'Employees waste time searching for information', tags: ['workflowConsulting'] },
    ],
    next: 'process-management',
  },
  'process-management': {
    id: 'process-management',
    role: 'assistant',
    transitionLine: 'How is this process currently managed?',
    prompt: 'How is this process currently managed?',
    kind: 'dropdown',
    options: [
      { label: 'Mostly manual with spreadsheets', value: 'Mostly manual with spreadsheets', tags: ['operationalTooling'] },
      { label: 'Paper-based and tracked by hand', value: 'Paper-based and tracked by hand', tags: ['operationalTooling'] },
      { label: 'Several software tools that do not connect', value: 'Several software tools that do not connect', tags: ['platformEngineering'] },
      {
        label: 'An ERP or platform that does not fit our workflow',
        value: 'An ERP or platform that does not fit our workflow',
        tags: ['workflowConsulting', 'platformEngineering'],
      },
      { label: 'A mix of manual and digital steps', value: 'A mix of manual and digital steps', tags: ['workflowConsulting', 'operationalTooling'] },
      { label: 'We do not have a consistent process yet', value: 'We do not have a consistent process yet', tags: ['workflowConsulting'] },
    ],
    next: 'affected',
  },
  affected: {
    id: 'affected',
    role: 'assistant',
    transitionLine: 'Thank you. One more question.',
    prompt: 'Who is most affected by this issue?',
    kind: 'dropdown',
    options: [
      { label: 'Shop floor / production', value: 'Shop floor / production', tags: ['workflowConsulting'] },
      { label: 'Supervisors / managers', value: 'Supervisors / managers', tags: ['workflowConsulting'] },
      { label: 'Operations team', value: 'Operations team', tags: ['operationalTooling'] },
      { label: 'Office / admin team', value: 'Office / admin team', tags: ['operationalTooling'] },
      { label: 'Leadership', value: 'Leadership', tags: ['platformEngineering'] },
      { label: 'Multiple departments', value: 'Multiple departments', tags: ['platformEngineering'] },
    ],
    next: 'outcome',
  },
  outcome: {
    id: 'outcome',
    role: 'assistant',
    transitionLine: 'Understood. What outcome matters most right now?',
    prompt: 'What outcome matters most right now?',
    kind: 'dropdown',
    options: [
      { label: 'Reduce bottlenecks', value: 'Reduce bottlenecks', tags: ['workflowConsulting'] },
      { label: 'Improve visibility', value: 'Improve visibility', tags: ['platformEngineering'] },
      { label: 'Eliminate repeat work', value: 'Eliminate repeat work', tags: ['operationalTooling'] },
      { label: 'Improve handoffs', value: 'Improve handoffs', tags: ['workflowConsulting', 'platformEngineering'] },
      { label: 'Replace manual steps', value: 'Replace manual steps', tags: ['operationalTooling'] },
      { label: 'Create a better tool or platform', value: 'Create a better tool or platform', tags: ['platformEngineering'] },
    ],
    next: 'urgency',
  },
  urgency: {
    id: 'urgency',
    role: 'assistant',
    transitionLine: 'That helps. How urgent is the issue?',
    prompt: 'How urgent is the issue?',
    kind: 'dropdown',
    options: [
      { label: 'Immediate / blocking work', value: 'Immediate / blocking work', tags: ['workflowConsulting', 'operationalTooling'] },
      { label: 'This quarter', value: 'This quarter', tags: ['workflowConsulting'] },
      { label: 'Planning stage', value: 'Planning stage', tags: ['workflowConsulting'] },
      { label: 'Exploring options', value: 'Exploring options', tags: ['workflowConsulting'] },
    ],
    next: 'fit-check',
  },
  'fit-check': {
    id: 'fit-check',
    role: 'assistant',
    transitionLine: 'I have enough context for one final question.',
    prompt: 'If this needs a solution, which path feels most realistic?',
    kind: 'dropdown',
    options: [
      { label: 'Workflow consulting first', value: 'Workflow consulting first', tags: ['workflowConsulting'] },
      { label: 'A focused operational tool', value: 'A focused operational tool', tags: ['operationalTooling'] },
      { label: 'A connected platform approach', value: 'A connected platform approach', tags: ['platformEngineering'] },
      {
        label: 'Use current ERP/software better with process and integration support',
        value: 'Use current ERP/software better with process and integration support',
        tags: ['workflowConsulting', 'platformEngineering'],
      },
      {
        label: 'Need licensed accounting, payroll, tax, legal, or medical expertise',
        value: 'Need licensed accounting, payroll, tax, legal, or medical expertise',
        tags: ['betterFitElsewhere'],
      },
      {
        label: 'Need hardware-only repair or maintenance services',
        value: 'Need hardware-only repair or maintenance services',
        tags: ['betterFitElsewhere'],
      },
    ],
    next: 'analyze',
  },
  analyze: {
    id: 'analyze',
    role: 'assistant',
    prompt: 'I have enough information to make a recommendation.',
    kind: 'analysis',
  },
  'no-friction': {
    id: 'no-friction',
    role: 'assistant',
    prompt: "That's good to hear.",
    followup: 'If your operation changes in the future, RuntWerkx will be here.',
    kind: 'close',
  },
}

export function getTransitionLine(currentNodeId) {
  const node = assessmentConversation[currentNodeId]
  return node?.transitionLine || "I'm beginning to understand your operation."
}

export function getNextConversationNode(currentNodeId, answerValue) {
  const currentNode = assessmentConversation[currentNodeId]

  if (!currentNode) {
    return null
  }

  if (typeof currentNode.next === 'function') {
    return currentNode.next(answerValue)
  }

  return currentNode.next || null
}
