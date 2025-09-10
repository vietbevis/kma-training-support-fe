import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { KyHoc } from '@/shared/lib/enum'
import { useQuery } from '@tanstack/react-query'

/**
 * Interface for classroom availability request params
 */
interface ClassroomAvailabilityParams {
  buildingId: string
  date: string
  timeSlot?: string
}

/**
 * Interface for classroom occupancy details
 */
export interface OccupancyDetails {
  timeSlot: string
  startDate: string
  endDate: string
  dayOfWeek: number
  timetableId: string
}

/**
 * Interface for classroom data
 */
export interface Classroom {
  id: string
  name: string
  type: string
  description: string | null
  isOccupied: boolean
  occupancyDetails?: OccupancyDetails
}

/**
 * Interface for building data
 */
export interface Building {
  id: string
  name: string
  description: string
}

/**
 * Interface for summary data
 */
export interface Summary {
  total: number
  occupied: number
  available: number
}

/**
 * Interface for classroom availability response
 */
export interface ClassroomAvailabilityResponse {
  building: Building
  date: string
  classrooms: Classroom[]
  summary: Summary
}

/**
 * Hook to get classroom availability
 */
export const useGetClassroomAvailabilityQuery = ({ buildingId, date, timeSlot }: ClassroomAvailabilityParams) => {
  return useQuery({
    queryKey: ['classroom-availability', buildingId, date, timeSlot],
    queryFn: () =>
      api.get<ClassroomAvailabilityResponse>(API_ROUTES.CLASSROOM_AVAILABILITY, {
        params: { buildingId, date, timeSlot }
      }),
    enabled: !!buildingId && !!date
  })
}

/**
 * Hook to get all available timeslots
 */
export const useGetClassroomTimeslotsQuery = () => {
  return useQuery({
    queryKey: ['classroom-timeslots'],
    queryFn: () => api.get<string[]>(API_ROUTES.CLASSROOM_TIMESLOTS)
  })
}

/**
 * Interface for timetable detail time slot
 */
export interface DetailTimeSlot {
  dayOfWeek: number
  timeSlot: string
  roomName: string
  buildingName?: string
  startDate: string
  endDate: string
}

/**
 * Interface for timetable details
 */
export interface TimetableDetails {
  id: string
  className: string
  semester: KyHoc
  classType: string
  studentCount: number
  theoryHours: number
  crowdClassCoefficient: number
  actualHours: number
  overtimeCoefficient: number
  standardHours: number
  startDate: string
  endDate: string
  lecturerName?: string
  courseId: string
  academicYearId: string
  course?: {
    id: string
    courseCode: string
    courseName: string
    credits: number
  }
  academicYear?: {
    id: string
    yearCode: string
  }
}

/**
 * Hook to get timetable details by ID
 */
export const useGetTimetableDetailsByIdQuery = (id: string, options = {}) => {
  return useQuery({
    queryKey: ['timetable-details', id],
    queryFn: () => api.get<TimetableDetails>(`${API_ROUTES.TIMETABLES}/${id}`),
    enabled: !!id,
    ...options
  })
}
