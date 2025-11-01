// API
export * from './api/AcademicCredentialService'

// Components
export { AcademicCredentialForm, ComboboxAcademicCredential } from './components'
export { AcademicCredentialFilters } from './components/AcademicCredentialFilters'
export { default as AcademicCredentialTable } from './components/AcademicCredentialTable'

// Pages should only be lazy loaded in App.tsx, not exported here
