const userData = {
  id: "user-1",
  name: "Marco",
  surname: "Rossi",
  email: "marco.rossi@bitrock.it",
  role: "developer",
  avatar: "/placeholder.svg",
}

// Mock user summary data
const userSummary = {
  hoursWorked: 120,
  vacationDaysLeft: 15,
  vacationDaysTotal: 25,
  activeProjects: 3,
  totalProjects: 5,
  pendingRequests: 2,
}

// Mock hours data
const hoursData = {
  weekly: [
    { label: "Lun", hours: 8 },
    { label: "Mar", hours: 7.5 },
    { label: "Mer", hours: 8 },
    { label: "Gio", hours: 6 },
    { label: "Ven", hours: 8 },
  ],
  monthly: [
    { label: "Sett 1", hours: 38 },
    { label: "Sett 2", hours: 40 },
    { label: "Sett 3", hours: 35 },
    { label: "Sett 4", hours: 42 },
  ],
}

// Mock notifications
const notifications = [
  {
    title: "Richiesta ferie in attesa",
    description: "La tua richiesta ferie dal 15/08 al 22/08 è in attesa di approvazione",
    requiresAction: false,
  },
  {
    title: "Approvazione richiesta",
    description: "Devi approvare la richiesta di permesso di Laura Bianchi",
    requiresAction: true,
  },
]

// Mock recent requests
const recentRequests = [
  {
    type: "Ferie",
    period: "15/08/2023 - 22/08/2023",
    status: "pending",
  },
  {
    type: "Permesso",
    period: "05/07/2023",
    status: "approved",
  },
  {
    type: "Malattia",
    period: "20/06/2023 - 22/06/2023",
    status: "approved",
  },
]

// Mock projects
const projects = [
  { id: "project-1", name: "Progetto Alpha" },
  { id: "project-2", name: "Progetto Beta" },
  { id: "project-3", name: "Progetto Gamma" },
  { id: "project-4", name: "Progetto Delta" },
  { id: "project-5", name: "Progetto Epsilon" },
]

// Mock time entries
const timeEntries = [
  {
    date: "2023-07-10",
    project: "project-1",
    hours: 8,
    description: "Sviluppo frontend dashboard",
    status: "approved",
  },
  {
    date: "2023-07-11",
    project: "project-1",
    hours: 7.5,
    description: "Implementazione API",
    status: "approved",
  },
  {
    date: "2023-07-12",
    project: "project-2",
    hours: 8,
    description: "Meeting e pianificazione sprint",
    status: "approved",
  },
  {
    date: "2023-07-13",
    project: "project-2",
    hours: 6,
    description: "Debugging e fix",
    status: "pending",
  },
  {
    date: "2023-07-14",
    project: "project-3",
    hours: 8,
    description: "Sviluppo nuove funzionalità",
    status: "pending",
  },
]

// Mock leave requests
const leaveRequests = [
  {
    type: "vacation",
    period: "15/08/2023 - 22/08/2023",
    days: 5,
    reason: "Vacanza estiva",
    status: "pending",
  },
  {
    type: "permission",
    period: "05/07/2023",
    days: 1,
    reason: "Visita medica",
    status: "approved",
  },
  {
    type: "sickness",
    period: "20/06/2023 - 22/06/2023",
    days: 3,
    reason: "Influenza",
    status: "approved",
  },
  {
    type: "vacation",
    period: "10/04/2023 - 14/04/2023",
    days: 5,
    reason: "Vacanza pasquale",
    status: "approved",
  },
]

// Export functions to get mock data
export const getUserData = () => userData
export const getUserSummary = () => userSummary
export const getHoursData = () => hoursData
export const getNotifications = () => notifications
export const getRecentRequests = () => recentRequests
export const getProjects = () => projects
export const getTimeEntries = () => timeEntries
export const getLeaveRequests = () => leaveRequests

