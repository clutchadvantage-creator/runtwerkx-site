import { recommendationCategoryToRoute } from '../../src/shared/consult/recommendationRoutes.js'

export const sampleBuildRequest = {
  fullName: 'Jordan Smith',
  email: 'jordan@example.com',
  company: 'Smith Fabrication',
  phone: '+1 (417) 555-0199',
  preferredDate: '2026-07-13',
  preferredTime: 'Morning (8:00 AM - 12:00 PM)',
  notes: 'Need help aligning production handoffs.',
  honeypot: '',
}

export const sampleAssessmentPackage = {
  route: recommendationCategoryToRoute.workflowConsulting,
  headline: 'Recommended path: Workflow Consulting',
  body: 'Workflow issues first.',
  category: 'workflowConsulting',
  stagedPath: ['workflowConsulting', 'operationalTooling'],
  capturedAt: '2026-07-12T12:00:00.000Z',
  answers: [
    {
      questionId: 'intro',
      questionText: 'Is your business or operation experiencing unnecessary friction?',
      answerId: 'yes',
      answerText: 'YES',
      answerTags: [],
    },
    {
      questionId: 'friction-area',
      questionText: 'Which area is causing the most operational friction?',
      answerId: 'Production bottlenecks',
      answerText: 'Production bottlenecks',
      answerTags: ['workflowConsulting'],
    },
    {
      questionId: 'process-management',
      questionText: 'How is this process currently managed?',
      answerId: 'A mix of manual and digital steps',
      answerText: 'A mix of manual and digital steps',
      answerTags: ['workflowConsulting', 'operationalTooling'],
    },
    {
      questionId: 'affected',
      questionText: 'Who is most affected by this issue?',
      answerId: 'Shop floor / production',
      answerText: 'Shop floor / production',
      answerTags: ['workflowConsulting'],
    },
    {
      questionId: 'outcome',
      questionText: 'What outcome matters most right now?',
      answerId: 'Reduce bottlenecks',
      answerText: 'Reduce bottlenecks',
      answerTags: ['workflowConsulting'],
    },
    {
      questionId: 'urgency',
      questionText: 'How urgent is the issue?',
      answerId: 'This quarter',
      answerText: 'This quarter',
      answerTags: ['workflowConsulting'],
    },
    {
      questionId: 'fit-check',
      questionText: 'If this needs a solution, which path feels most realistic?',
      answerId: 'Workflow consulting first',
      answerText: 'Workflow consulting first',
      answerTags: ['workflowConsulting'],
    },
  ],
}
