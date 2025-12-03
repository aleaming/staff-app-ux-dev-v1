import type { ActivityTemplate } from "../activity-templates"

/**
 * COS285 Cockspur Street Provisioning Data
 * Property-specific provisioning checklist with phases, rooms, and tasks
 */
export const cos285ProvisioningData: ActivityTemplate = {
  type: "provisioning",
  name: "Provisioning - COS285",
  description: "Complete provisioning for Cockspur Street property",
  estimatedTotalTime: 120,
  metadata: {
    propertyCode: "COS285",
    propertyName: "Cockspur Street",
    version: "107",
    sensitivityLevel: "low",
    hasDoorman: false,
    storage: [
      "Left-hand wardrobe in double bedroom",
      "Cupboard below bookshelves (NOT under kitchen sink)"
    ],
    heating: {
      type: "Hive smart thermostat",
      location: "Hall",
      summerSetting: "OFF / Snowflake",
      winterSettings: {
        booking: "21°C",
        empty: "5°C",
        hostReturn: "15°C"
      }
    },
    wifi: [
      {
        name: "EE-BrightBox-5g2t9g",
        password: "[PASSWORD]",
        location: "Master Bedroom - left bedside table"
      },
      {
        name: "BT4G-HOMEHUB-9117",
        password: "[PASSWORD]",
        location: "Sitting Room"
      }
    ],
    alerts: [
      {
        type: "critical",
        message: "NEVER leave OFS fans in the home (ceiling fans present in bedrooms)"
      },
      {
        type: "critical",
        message: "Water plants, don't close curtains (plants will die)"
      },
      {
        type: "warning",
        message: "Bathroom sensors look like blown bulbs - DON'T report as broken"
      },
      {
        type: "warning",
        message: "DO NOT water artificial plants"
      }
    ],
    checkInstructions: [
      "Report blown light bulbs",
      "Check TV remote batteries",
      "Store HO linens in bedroom cupboards (NEVER under kitchen sink)"
    ],
    exitInstructions: {
      locking: "Close/lock windows, turn off lights, double lock front door (can't open from outside when closed)",
      refuse: "Take to bins on Warwick House Street (turn left, halfway down street)",
      checkout: "Leave one key set in kitchen, double lock door, post second set through letterbox in provided envelope"
    }
  },
  phases: [
    {
      id: "arrive",
      name: "arrive",
      order: 1,
      tasks: [
        {
          id: "arrive-1",
          name: "Bag and tag host bedding",
          description: "Bag and tag all host bedding for storage",
          action: "Bag and tag",
          subject: "host bedding",
          required: true,
          estimatedTime: 10,
          photoRequired: true,
          photoCount: 2,
          order: 1,
          priority: "high"
        },
        {
          id: "arrive-2",
          name: "Check linen quantity & rejects",
          description: "Verify sufficient linen quantity and check for any damaged items",
          action: "Check",
          subject: "linen quantity & rejects",
          required: true,
          estimatedTime: 5,
          photoRequired: false,
          order: 2,
          priority: "high"
        },
        {
          id: "arrive-3",
          name: "Check iron & ironing board present",
          description: "Verify iron and ironing board are present and functional",
          action: "Check",
          subject: "iron & ironing board",
          required: true,
          estimatedTime: 2,
          photoRequired: false,
          order: 3,
          priority: "medium"
        },
        {
          id: "arrive-4",
          name: "Check vacuum cleaner",
          description: "Verify vacuum cleaner is present, has bag, and works",
          action: "Check",
          subject: "vacuum cleaner (present, has bag, works)",
          required: true,
          estimatedTime: 3,
          photoRequired: false,
          order: 4,
          priority: "medium"
        },
        {
          id: "arrive-5",
          name: "Test WiFi connection",
          description: "Test WiFi connection and signal strength throughout property",
          action: "Test",
          subject: "WiFi connection & signal strength",
          required: true,
          estimatedTime: 5,
          photoRequired: false,
          order: 5,
          priority: "high"
        },
        {
          id: "arrive-6",
          name: "Verify host items",
          description: "Verify host items match ITT and Booking Record",
          action: "Verify",
          subject: "host items match ITT and Booking Record",
          required: true,
          estimatedTime: 10,
          photoRequired: true,
          photoCount: 3,
          order: 6,
          priority: "high"
        },
        {
          id: "arrive-7",
          name: "Photograph surfaces and furniture",
          description: "Take photographs of all surfaces and furniture for record",
          action: "Photograph",
          subject: "surfaces and furniture",
          required: true,
          estimatedTime: 10,
          photoRequired: true,
          photoCount: 8,
          order: 7,
          priority: "medium"
        },
        {
          id: "arrive-8",
          name: "Connect WiFi Network 1",
          description: "Connect to primary WiFi network in Master Bedroom",
          action: "Connect",
          subject: "WiFi Network (Master Bedroom)",
          location: "Master Bedroom - left bedside table",
          required: true,
          estimatedTime: 3,
          photoRequired: false,
          order: 8,
          priority: "high"
        },
        {
          id: "arrive-9",
          name: "Connect WiFi Network 2",
          description: "Connect to secondary WiFi network in Sitting Room",
          action: "Connect",
          subject: "second WiFi Network (Sitting Room)",
          location: "Sitting Room",
          required: true,
          estimatedTime: 3,
          photoRequired: false,
          order: 9,
          priority: "high"
        }
      ]
    },
    {
      id: "during",
      name: "during",
      order: 2,
      rooms: [
        {
          id: "hall",
          code: "H",
          name: "Hall",
          tasks: [
            {
              id: "hall-1",
              name: "Sweep under and behind furniture",
              description: "Sweep under and behind all furniture in the hall",
              action: "Sweep",
              subject: "under and behind furniture",
              location: "Hall",
              required: true,
              estimatedTime: 5,
              photoRequired: false,
              order: 1,
              priority: "medium"
            },
            {
              id: "hall-2",
              name: "Leave out window key",
              description: "Leave window key on magnetic bulls eye near door",
              action: "Leave out",
              subject: "window key",
              location: "On magnetic bulls eye near door",
              required: true,
              estimatedTime: 1,
              photoRequired: false,
              order: 2,
              priority: "high"
            },
            {
              id: "hall-3",
              name: "Seal cupboard",
              description: "Seal cupboard with tamper ribbon",
              action: "Seal",
              subject: "cupboard",
              location: "Hall",
              required: true,
              estimatedTime: 2,
              photoRequired: true,
              photoCount: 1,
              order: 3,
              priority: "medium"
            },
            {
              id: "hall-4-summer",
              name: "Set Hive heating control (Summer)",
              description: "Set Hive to OFF / Snowflake for summer",
              action: "Set",
              subject: "Hive heating control",
              location: "Hall",
              required: true,
              estimatedTime: 2,
              photoRequired: false,
              order: 4,
              priority: "high",
              conditional: {
                season: "summer"
              }
            },
            {
              id: "hall-4-winter",
              name: "Set Hive heating control (Winter)",
              description: "Set Hive to 21°C for booking, 5°C when empty, or 15°C for host return",
              action: "Set",
              subject: "Hive heating control",
              location: "Hall",
              required: true,
              estimatedTime: 2,
              photoRequired: false,
              order: 4,
              priority: "high",
              conditional: {
                season: "winter"
              }
            }
          ]
        },
        {
          id: "second-bedroom",
          code: "SDB",
          name: "Second Bedroom",
          location: "First bedroom on left",
          tasks: [
            {
              id: "sdb-1",
              name: "Bag and tag host bedding/linen",
              description: "Bag and tag all host bedding/linen, use OFS linen",
              action: "Bag and tag",
              subject: "all host bedding/linen, use OFS linen",
              location: "Second Bedroom",
              required: true,
              estimatedTime: 10,
              photoRequired: true,
              photoCount: 2,
              order: 1,
              priority: "high"
            },
            {
              id: "sdb-2",
              name: "Sweep under and behind furniture",
              description: "Sweep under and behind all furniture",
              action: "Sweep",
              subject: "under and behind furniture",
              location: "Second Bedroom",
              required: true,
              estimatedTime: 5,
              photoRequired: false,
              order: 2,
              priority: "medium"
            },
            {
              id: "sdb-3",
              name: "Check bed slats",
              description: "Check bed slats, raise ticket if broken",
              action: "Check",
              subject: "bed slats (raise ticket if broken)",
              location: "Second Bedroom",
              required: true,
              estimatedTime: 2,
              photoRequired: false,
              order: 3,
              priority: "high"
            },
            {
              id: "sdb-4",
              name: "Seal right wardrobe",
              description: "Seal right wardrobe (use for storage), bag and tag host clutter",
              action: "Seal",
              subject: "right wardrobe",
              location: "Second Bedroom",
              required: true,
              estimatedTime: 5,
              photoRequired: true,
              photoCount: 2,
              order: 4,
              priority: "medium"
            },
            {
              id: "sdb-5",
              name: "Leave out host hangers",
              description: "Leave out host hangers in left wardrobe (don't seal)",
              action: "Leave out",
              subject: "host hangers in left wardrobe",
              location: "Second Bedroom - left wardrobe",
              required: true,
              estimatedTime: 2,
              photoRequired: false,
              order: 5,
              priority: "low"
            }
          ]
        },
        {
          id: "master-bedroom",
          code: "MB",
          name: "Master Bedroom",
          tasks: [
            {
              id: "mb-1",
              name: "Bag and tag host clutter",
              description: "Bag and tag host clutter in left wardrobe",
              action: "Bag and tag",
              subject: "host clutter in left wardrobe",
              location: "Master Bedroom - left wardrobe",
              required: true,
              estimatedTime: 5,
              photoRequired: true,
              photoCount: 2,
              order: 1,
              priority: "medium"
            },
            {
              id: "mb-2",
              name: "Check HIVE router",
              description: "Check HIVE router is on (bottom drawer of left bedside cabinet) - unplug/replug if needed",
              action: "Check",
              subject: "HIVE router is on",
              location: "Bottom drawer of left bedside cabinet",
              required: true,
              estimatedTime: 3,
              photoRequired: false,
              order: 2,
              priority: "high"
            },
            {
              id: "mb-3",
              name: "Check bed slats",
              description: "Check bed slats for any damage",
              action: "Check",
              subject: "bed slats",
              location: "Master Bedroom",
              required: true,
              estimatedTime: 2,
              photoRequired: false,
              order: 3,
              priority: "high"
            },
            {
              id: "mb-4",
              name: "Bag and tag wardrobe clutter",
              description: "Bag and tag host clutter in wardrobe",
              action: "Bag and tag",
              subject: "host clutter in wardrobe",
              location: "Master Bedroom",
              required: true,
              estimatedTime: 5,
              photoRequired: true,
              photoCount: 2,
              order: 4,
              priority: "medium"
            },
            {
              id: "mb-5",
              name: "Leave out host hangers",
              description: "Leave out host hangers",
              action: "Leave out",
              subject: "host hangers",
              location: "Master Bedroom",
              required: true,
              estimatedTime: 1,
              photoRequired: false,
              order: 5,
              priority: "low"
            },
            {
              id: "mb-6",
              name: "Prepare wardrobe for guest",
              description: "Prepare wardrobe for guest use",
              action: "Prepare For Guest",
              subject: "Wardrobe",
              location: "Master Bedroom",
              required: true,
              estimatedTime: 3,
              photoRequired: false,
              order: 6,
              priority: "high"
            },
            {
              id: "mb-7",
              name: "Prepare right cupboard for guest",
              description: "Prepare right cupboard for guest use",
              action: "Prepare For Guest",
              subject: "right cupboard",
              location: "Master Bedroom",
              required: true,
              estimatedTime: 2,
              photoRequired: false,
              order: 7,
              priority: "high"
            },
            {
              id: "mb-8",
              name: "Prepare left cupboard for guest",
              description: "Prepare left cupboard for guest use",
              action: "Prepare For Guest",
              subject: "left cupboard",
              location: "Master Bedroom",
              required: true,
              estimatedTime: 2,
              photoRequired: false,
              order: 8,
              priority: "high"
            }
          ]
        },
        {
          id: "shower-bathroom",
          code: "SBTH",
          name: "Shower Bathroom",
          location: "Red tiles",
          tasks: [
            {
              id: "sbth-1",
              name: "Seal mirrored cabinet",
              description: "Seal mirrored cabinet behind door",
              action: "Seal",
              subject: "mirrored cabinet",
              location: "Behind door",
              required: true,
              estimatedTime: 2,
              photoRequired: true,
              photoCount: 1,
              order: 1,
              priority: "medium"
            },
            {
              id: "sbth-2",
              name: "Report any mould",
              description: "Troubleshoot: Report any mould found",
              action: "Troubleshoot",
              subject: "Report any mould",
              location: "Shower Bathroom",
              required: true,
              estimatedTime: 3,
              photoRequired: true,
              photoCount: 2,
              order: 2,
              priority: "high"
            },
            {
              id: "sbth-3",
              name: "Bag and tag host clutter",
              description: "Bag and tag any host clutter",
              action: "Bag and tag",
              subject: "host clutter",
              location: "Shower Bathroom",
              required: true,
              estimatedTime: 3,
              photoRequired: false,
              order: 3,
              priority: "medium"
            }
          ]
        },
        {
          id: "master-bathroom",
          code: "B",
          name: "Master Bathroom",
          location: "Black tiles",
          tasks: [
            {
              id: "b-1",
              name: "Report any mould",
              description: "Troubleshoot: Report any mould found",
              action: "Troubleshoot",
              subject: "Report any mould",
              location: "Master Bathroom",
              required: true,
              estimatedTime: 3,
              photoRequired: true,
              photoCount: 2,
              order: 1,
              priority: "high"
            },
            {
              id: "b-2",
              name: "Bag and tag host clutter",
              description: "Bag and tag any host clutter",
              action: "Bag and tag",
              subject: "host clutter",
              location: "Master Bathroom",
              required: true,
              estimatedTime: 3,
              photoRequired: false,
              order: 2,
              priority: "medium"
            }
          ]
        },
        {
          id: "sitting-room",
          code: "SR",
          name: "Sitting Room",
          tasks: [
            {
              id: "sr-1",
              name: "Vacuum with Amazon Basics hoover",
              description: "Use Amazon Basics hoover to vacuum sitting room",
              action: "Vacuum",
              subject: "Sitting Room with Amazon Basics hoover",
              location: "Sitting Room",
              required: true,
              estimatedTime: 10,
              photoRequired: false,
              order: 1,
              priority: "high"
            },
            {
              id: "sr-2",
              name: "Bag and tag host clutter",
              description: "Bag and tag any host clutter",
              action: "Bag and tag",
              subject: "host clutter",
              location: "Sitting Room",
              required: true,
              estimatedTime: 5,
              photoRequired: false,
              order: 2,
              priority: "medium"
            },
            {
              id: "sr-3",
              name: "Seal wooden cabinet drawers",
              description: "Seal wooden cabinet drawers (right side as you enter)",
              action: "Seal",
              subject: "wooden cabinet drawers",
              location: "Right side as you enter",
              required: true,
              estimatedTime: 3,
              photoRequired: true,
              photoCount: 1,
              order: 3,
              priority: "medium"
            }
          ]
        },
        {
          id: "kitchen",
          code: "K",
          name: "Kitchen",
          tasks: [
            {
              id: "k-1",
              name: "Bag and tag host clutter",
              description: "Bag and tag any host clutter",
              action: "Bag and tag",
              subject: "host clutter",
              location: "Kitchen",
              required: true,
              estimatedTime: 5,
              photoRequired: false,
              order: 1,
              priority: "medium"
            },
            {
              id: "k-2",
              name: "Check cutlery & crockery",
              description: "Check cutlery & crockery (cleanliness, quantity vs max occupancy)",
              action: "Check",
              subject: "cutlery & crockery",
              location: "Kitchen",
              required: true,
              estimatedTime: 5,
              photoRequired: false,
              order: 2,
              priority: "high"
            },
            {
              id: "k-3",
              name: "Empty washing machine",
              description: "Empty washing machine with dryer",
              action: "Empty",
              subject: "washing machine with dryer",
              location: "Kitchen",
              required: true,
              estimatedTime: 3,
              photoRequired: false,
              order: 3,
              priority: "medium"
            }
          ]
        }
      ]
    },
    {
      id: "depart",
      name: "depart",
      order: 3,
      tasks: [
        {
          id: "depart-1",
          name: "Quality check: Cleaning",
          description: "Perform final quality check for cleaning standards",
          action: "Quality check",
          subject: "Cleaning",
          required: true,
          estimatedTime: 10,
          photoRequired: true,
          photoCount: 5,
          order: 1,
          priority: "high"
        },
        {
          id: "depart-2",
          name: "Quality check: Maintenance",
          description: "Perform final quality check for maintenance issues",
          action: "Quality check",
          subject: "Maintenance",
          required: true,
          estimatedTime: 10,
          photoRequired: true,
          photoCount: 3,
          order: 2,
          priority: "high"
        },
        {
          id: "depart-3",
          name: "Fill out activity report",
          description: "Complete and submit activity report",
          action: "Fill out",
          subject: "activity report",
          required: true,
          estimatedTime: 5,
          photoRequired: false,
          order: 3,
          priority: "high"
        },
        {
          id: "depart-4",
          name: "Note TL & TM hours",
          description: "Record Team Leader and Team Member hours",
          action: "Fill out",
          subject: "TL & TM hours",
          required: true,
          estimatedTime: 2,
          photoRequired: false,
          order: 4,
          priority: "high"
        },
        {
          id: "depart-5",
          name: "Close & lock all outside doors",
          description: "Secure all external doors with proper locks",
          action: "Secure",
          subject: "Close & lock all outside doors",
          required: true,
          estimatedTime: 3,
          photoRequired: false,
          order: 5,
          priority: "high"
        },
        {
          id: "depart-6",
          name: "Close & lock all windows",
          description: "Secure all windows throughout the property",
          action: "Secure",
          subject: "Close & lock all windows",
          required: true,
          estimatedTime: 5,
          photoRequired: false,
          order: 6,
          priority: "high"
        },
        {
          id: "depart-7",
          name: "Turn off all lights",
          description: "Ensure all lights are switched off",
          action: "Turn off",
          subject: "all lights",
          required: true,
          estimatedTime: 3,
          photoRequired: false,
          order: 7,
          priority: "high"
        }
      ]
    }
  ],
  tasks: [] // Empty for phase-based provisioning
}

