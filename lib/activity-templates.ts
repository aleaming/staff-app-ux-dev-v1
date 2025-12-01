/**
 * Activity Templates and Checklists
 * Defines the structure for each activity type with their required tasks
 */

export type ActivityType = 
  | "adhoc"
  | "deprovisioning"
  | "meet-greet"
  | "maid-service"
  | "provisioning"
  | "turn"

export type TaskAction = 
  | "Check"
  | "Bag and tag"
  | "Seal"
  | "Prepare For Guest"
  | "Connect"
  | "Leave out"
  | "Set"
  | "Troubleshoot"
  | "Sweep"
  | "Quality check"
  | "Secure"
  | "Turn off"
  | "Empty"
  | "Fill out"
  | "Vacuum"
  | "Test"
  | "Verify"
  | "Photograph"
  | "Show"
  | "Explain"
  | "Demonstrate"
  | "Review"
  | "Welcome"
  | "Answer Questions"

export interface TaskTemplate {
  id: string
  name: string
  description: string
  required: boolean
  estimatedTime: number // minutes
  photoRequired: boolean
  photoCount?: number // number of photos required
  order: number
  dependencies?: string[] // task IDs that must complete first
  // Phase-based fields
  action?: TaskAction
  subject?: string
  location?: string
  priority?: "high" | "medium" | "low"
  conditional?: {
    season?: "summer" | "winter"
    occupancy?: "booking" | "empty" | "host"
  }
}

export interface RoomTemplate {
  id: string
  code: string
  name: string
  location?: string
  tasks: TaskTemplate[]
}

export interface PhaseTemplate {
  id: string
  name: "arrive" | "during" | "depart"
  order: number
  rooms?: RoomTemplate[]
  tasks?: TaskTemplate[]
}

export interface PropertyMetadata {
  propertyCode: string
  propertyName: string
  version: string
  sensitivityLevel: "low" | "medium" | "high"
  hasDoorman: boolean
  storage: string[]
  heating: {
    type: string
    location: string
    summerSetting: string
    winterSettings: Record<string, string>
  }
  wifi: Array<{
    name: string
    password: string
    location?: string
  }>
  alerts: Array<{
    type: "critical" | "warning" | "info"
    message: string
  }>
  exitInstructions?: {
    locking?: string
    refuse?: string
    checkout?: string
  }
  checkInstructions?: string[]
}

export interface ActivityTemplate {
  type: ActivityType
  name: string
  description: string
  estimatedTotalTime: number // minutes
  tasks: TaskTemplate[]
  // Phase-based fields (for provisioning and other structured activities)
  phases?: PhaseTemplate[]
  metadata?: PropertyMetadata
}

export const activityTemplates: Record<ActivityType, ActivityTemplate> = {
  "adhoc": {
    type: "adhoc",
    name: "Adhoc",
    description: "General maintenance or one-off tasks",
    estimatedTotalTime: 30,
    tasks: [
      {
        id: "adhoc-1",
        name: "Assess Situation",
        description: "Review the adhoc request and assess what needs to be done",
        required: true,
        estimatedTime: 5,
        photoRequired: true,
        photoCount: 2,
        order: 1
      },
      {
        id: "adhoc-2",
        name: "Complete Task",
        description: "Perform the requested adhoc task",
        required: true,
        estimatedTime: 20,
        photoRequired: true,
        photoCount: 3,
        order: 2,
        dependencies: ["adhoc-1"]
      },
      {
        id: "adhoc-3",
        name: "Verify Completion",
        description: "Verify that the task has been completed satisfactorily",
        required: true,
        estimatedTime: 5,
        photoRequired: false,
        order: 3,
        dependencies: ["adhoc-2"]
      }
    ]
  },
  "deprovisioning": {
    type: "deprovisioning",
    name: "De-provisioning",
    description: "Preparing home for guest departure",
    estimatedTotalTime: 60,
    tasks: [
      {
        id: "depro-1",
        name: "Check Guest Departure",
        description: "Verify guest has checked out and belongings are removed",
        required: true,
        estimatedTime: 5,
        photoRequired: true,
        photoCount: 2,
        order: 1
      },
      {
        id: "depro-2",
        name: "Inventory Check",
        description: "Check all items are present and in good condition",
        required: true,
        estimatedTime: 15,
        photoRequired: true,
        photoCount: 5,
        order: 2
      },
      {
        id: "depro-3",
        name: "Damage Assessment",
        description: "Document any damage or issues found",
        required: true,
        estimatedTime: 10,
        photoRequired: true,
        photoCount: 3,
        order: 3
      },
      {
        id: "depro-4",
        name: "Secure Property",
        description: "Lock all doors, windows, and secure the property",
        required: true,
        estimatedTime: 5,
        photoRequired: false,
        order: 4
      }
    ]
  },
  "meet-greet": {
    type: "meet-greet",
    name: "Meet & Greet",
    description: "Guest arrival and orientation",
    estimatedTotalTime: 30,
    tasks: [
      {
        id: "meet-1",
        name: "Welcome Guest",
        description: "Greet guest upon arrival and verify identity",
        required: true,
        estimatedTime: 5,
        photoRequired: false,
        order: 1
      },
      {
        id: "meet-2",
        name: "Property Tour",
        description: "Provide tour of the property and explain key features",
        required: true,
        estimatedTime: 15,
        photoRequired: true,
        photoCount: 2,
        order: 2
      },
      {
        id: "meet-3",
        name: "Key Handover",
        description: "Hand over keys and explain access procedures",
        required: true,
        estimatedTime: 5,
        photoRequired: true,
        photoCount: 1,
        order: 3
      },
      {
        id: "meet-4",
        name: "Documentation",
        description: "Provide welcome materials and emergency contacts",
        required: true,
        estimatedTime: 5,
        photoRequired: false,
        order: 4
      }
    ]
  },
  "maid-service": {
    type: "maid-service",
    name: "Maid Service",
    description: "Cleaning and housekeeping",
    estimatedTotalTime: 90,
    tasks: [
      {
        id: "maid-1",
        name: "Bedroom Cleaning",
        description: "Clean all bedrooms, make beds, and organize",
        required: true,
        estimatedTime: 20,
        photoRequired: true,
        photoCount: 2,
        order: 1
      },
      {
        id: "maid-2",
        name: "Bathroom Cleaning",
        description: "Clean all bathrooms, restock supplies",
        required: true,
        estimatedTime: 20,
        photoRequired: true,
        photoCount: 2,
        order: 2
      },
      {
        id: "maid-3",
        name: "Kitchen Cleaning",
        description: "Clean kitchen, appliances, and restock basics",
        required: true,
        estimatedTime: 20,
        photoRequired: true,
        photoCount: 3,
        order: 3
      },
      {
        id: "maid-4",
        name: "Living Areas",
        description: "Clean living rooms, dining areas, and common spaces",
        required: true,
        estimatedTime: 20,
        photoRequired: true,
        photoCount: 2,
        order: 4
      },
      {
        id: "maid-5",
        name: "Final Inspection",
        description: "Final walkthrough to ensure everything is clean",
        required: true,
        estimatedTime: 10,
        photoRequired: true,
        photoCount: 1,
        order: 5,
        dependencies: ["maid-1", "maid-2", "maid-3", "maid-4"]
      }
    ]
  },
  "provisioning": {
    type: "provisioning",
    name: "Provisioning",
    description: "Preparing home for guest arrival",
    estimatedTotalTime: 75,
    tasks: [
      {
        id: "prov-1",
        name: "Welcome Package",
        description: "Prepare and place welcome package",
        required: true,
        estimatedTime: 10,
        photoRequired: true,
        photoCount: 2,
        order: 1
      },
      {
        id: "prov-2",
        name: "Stock Supplies",
        description: "Stock kitchen, bathroom, and household supplies",
        required: true,
        estimatedTime: 20,
        photoRequired: true,
        photoCount: 3,
        order: 2
      },
      {
        id: "prov-3",
        name: "Linen Setup",
        description: "Prepare all beds with fresh linens",
        required: true,
        estimatedTime: 15,
        photoRequired: true,
        photoCount: 2,
        order: 3
      },
      {
        id: "prov-4",
        name: "Property Check",
        description: "Final check that everything is ready for guest",
        required: true,
        estimatedTime: 10,
        photoRequired: true,
        photoCount: 3,
        order: 4
      },
      {
        id: "prov-5",
        name: "Documentation",
        description: "Prepare welcome materials and instructions",
        required: true,
        estimatedTime: 10,
        photoRequired: false,
        order: 5
      },
      {
        id: "prov-6",
        name: "Key Preparation",
        description: "Prepare keys and access codes for guest",
        required: true,
        estimatedTime: 10,
        photoRequired: true,
        photoCount: 1,
        order: 6
      }
    ]
  },
  "turn": {
    type: "turn",
    name: "Turn",
    description: "Complete home turnover between guests",
    estimatedTotalTime: 180,
    tasks: [
      {
        id: "turn-1",
        name: "Guest Departure Check",
        description: "Verify guest has checked out and property is clear",
        required: true,
        estimatedTime: 10,
        photoRequired: true,
        photoCount: 3,
        order: 1
      },
      {
        id: "turn-2",
        name: "Deep Clean",
        description: "Complete deep cleaning of entire property",
        required: true,
        estimatedTime: 60,
        photoRequired: true,
        photoCount: 8,
        order: 2,
        dependencies: ["turn-1"]
      },
      {
        id: "turn-3",
        name: "Linen Change",
        description: "Change all linens and towels",
        required: true,
        estimatedTime: 20,
        photoRequired: true,
        photoCount: 3,
        order: 3,
        dependencies: ["turn-2"]
      },
      {
        id: "turn-4",
        name: "Restock Supplies",
        description: "Restock all consumables and supplies",
        required: true,
        estimatedTime: 20,
        photoRequired: true,
        photoCount: 4,
        order: 4,
        dependencies: ["turn-2"]
      },
      {
        id: "turn-5",
        name: "Property Inspection",
        description: "Complete inspection for damage and maintenance issues",
        required: true,
        estimatedTime: 20,
        photoRequired: true,
        photoCount: 5,
        order: 5,
        dependencies: ["turn-2", "turn-3", "turn-4"]
      },
      {
        id: "turn-6",
        name: "Welcome Setup",
        description: "Prepare welcome package and documentation",
        required: true,
        estimatedTime: 15,
        photoRequired: true,
        photoCount: 2,
        order: 6,
        dependencies: ["turn-5"]
      },
      {
        id: "turn-7",
        name: "Final Verification",
        description: "Final walkthrough to ensure property is ready",
        required: true,
        estimatedTime: 15,
        photoRequired: true,
        photoCount: 3,
        order: 7,
        dependencies: ["turn-6"]
      }
    ]
  }
}

/**
 * Get activity template by type, optionally with property-specific data
 * @param type Activity type
 * @param propertyCode Optional property code for property-specific templates (e.g., "COS285", "ALB134")
 */
export function getActivityTemplate(type: ActivityType, propertyCode?: string): ActivityTemplate {
  // For provisioning with a property code, check for property-specific data
  if (type === "provisioning" && propertyCode) {
    try {
      // Try to load property-specific provisioning data
      // For now, we only have COS285
      if (propertyCode === "COS285") {
        const { cos285ProvisioningData } = require("./provisioning-data/cos285")
        return cos285ProvisioningData
      }
    } catch (error) {
      console.warn(`No property-specific data found for ${propertyCode}, using default template`)
    }
  }
  
  // For meet-greet with a property code, check for property-specific data
  if (type === "meet-greet" && propertyCode) {
    try {
      // Try to load property-specific meet-greet data
      // For demo/sample property (ALB134)
      if (propertyCode === "SAMPLE" || propertyCode === "ALB134") {
        const { sampleGreetData } = require("./greet-data/sample-greet")
        return sampleGreetData
      }
    } catch (error) {
      console.warn(`No meet-greet data found for ${propertyCode}, using default template`)
    }
  }
  
  return activityTemplates[type]
}

export function getAllActivityTypes(): ActivityType[] {
  return Object.keys(activityTemplates) as ActivityType[]
}

