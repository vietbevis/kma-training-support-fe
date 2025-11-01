// API
export * from './api/ClassroomService'

// Components
export { ClassroomForm } from './components'
export { ClassroomFilters } from './components/ClassroomFilters'
export { default as ClassroomTable } from './components/ClassroomTable'

// Pages should only be lazy loaded in App.tsx, not exported here
