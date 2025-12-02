import type { ActivityTemplate } from "../activity-templates"

/**
 * Deprovision Activity Template
 * Comprehensive property preparation after guest departure
 * Based on ALB134 (Albert Bridge Road II) but used as default for all deprovision activities
 */
export const sampleDeprovisionData: ActivityTemplate = {
  type: "deprovisioning",
  name: "Deprovision",
  description: "Prepare property after guest departure",
  estimatedTotalTime: 90,
  tasks: [], // Tasks are organized in phases below
  metadata: {
    propertyCode: "ALB134",
    propertyName: "Albert Bridge Road II",
    version: "1.0.0",
    sensitivityLevel: "medium",
    hasDoorman: false,
    storage: ["Hallway cupboard for cleaning supplies and extra linens"],
    heating: {
      type: "Boiler with portable thermostat",
      location: "Boiler in kitchen, portable thermostat in entrance hall",
      summerSetting: "Auto",
      winterSettings: {
        day: "20°C",
        night: "18°C",
        away: "15°C"
      }
    },
    wifi: [
      {
        name: "BT-F8CTWR",
        password: "3p7VDRCdcQNpcf",
        location: "Main network throughout property"
      }
    ],
    alerts: [
      {
        type: "warning",
        message: "Toilet has environmentally friendly low flow flush - may need multiple flushes"
      },
      {
        type: "info",
        message: "Communal hallway lights are NOT on a timer - must be turned off manually"
      },
      {
        type: "warning",
        message: "Do not use the vinyl player located in the sitting room"
      }
    ],
    exitInstructions: {
      locking: "During stay: Close and lock all windows, double lock front door. At checkout: Double lock door, ensure all windows secured and locked.",
      refuse: "Refuse and recycling collected from communal bins outside building. Turn left when exiting, bins are to your left by white pillar marked 'Mansions'. DO NOT leave rubbish bags on pavement.",
      checkout: "Ensure all windows closed and locked, heating set appropriately, all lights off, front door double locked, all OFS items collected"
    },
    checkInstructions: [
      "Check two sets of guest keys are present",
      "Verify vacuum is present, has bags, and works properly",
      "Check all assets: hairdryer, fan, hangers, cafetiere",
      "Test heating and hot water functionality",
      "Collect all guest keys and check iPhone checkout procedure",
      "Photograph any maintenance issues found",
      "Take panorama photos of all rooms",
      "Test WiFi connection and signal strength",
      "Check boiler cupboard for cleaning kit",
      "Bag and tag all host belongings with appropriate labels",
      "Document any damage, wear, scratches, or chips",
      "Photograph carpet, surfaces, walls, and other details in each room",
      "Take overview photos showing furniture arrangement",
      "Unseal items as appropriate",
      "Clear and prepare all spaces for host return",
      "Collect all OFS items (cleaning kit, teatowels, hairdryers, fans)",
      "Video the locking procedure showing which locks are used",
      "Complete supervisor and cleaner timesheets",
      "Photograph all refuse (Host/Guest/OFS)",
      "Perform quality checks on cleaning and maintenance",
      "Complete full activity report",
      "Turn off all lights before departure"
    ]
  },
  phases: [
    // Phase 1: Arrival
    {
      id: "arrival",
      name: "arrive",
      order: 1,
      tasks: [
        {
          id: "arrival-1",
          name: "Check two sets of guest keys",
          description: "Verify both sets of guest keys are present and accounted for",
          action: "Check",
          subject: "guest keys (2 sets)",
          required: true,
          estimatedTime: 2,
          photoRequired: false,
          order: 1,
          priority: "high"
        },
        {
          id: "arrival-2",
          name: "Check vacuum present, has bags & works",
          description: "Verify vacuum cleaner is present, has bags, and is in working condition",
          action: "Check",
          subject: "vacuum condition",
          required: true,
          estimatedTime: 3,
          photoRequired: false,
          order: 2
        },
        {
          id: "arrival-3",
          name: "Check assets - hairdryer/fan/hangers/cafetiere",
          description: "Verify all property assets are present and in good condition",
          action: "Check",
          subject: "property assets",
          required: true,
          estimatedTime: 5,
          photoRequired: false,
          order: 3
        },
        {
          id: "arrival-4",
          name: "Check heating",
          description: "Test heating system to ensure it's functioning properly",
          action: "Check",
          subject: "heating system",
          required: true,
          estimatedTime: 3,
          photoRequired: false,
          order: 4
        },
        {
          id: "arrival-5",
          name: "Check hot water",
          description: "Test hot water supply to ensure it's working",
          action: "Check",
          subject: "hot water",
          required: true,
          estimatedTime: 2,
          photoRequired: false,
          order: 5
        },
        {
          id: "arrival-6",
          name: "Collect guest keys and iPhone by checking checkout procedure",
          description: "Follow guest checkout procedure to collect keys and iPhone if applicable",
          action: "Collect",
          subject: "guest keys & iPhone",
          required: true,
          estimatedTime: 5,
          photoRequired: true,
          photoCount: 1,
          order: 6,
          priority: "high"
        },
        {
          id: "arrival-7",
          name: "Photograph maintenance issues",
          description: "Document any maintenance issues found during initial inspection",
          action: "Photograph",
          subject: "maintenance issues",
          required: true,
          estimatedTime: 5,
          photoRequired: true,
          photoCount: 3,
          order: 7
        },
        {
          id: "arrival-8",
          name: "Photograph things around including surfaces and furniture",
          description: "Take photos of surfaces, furniture, and general condition",
          action: "Photograph",
          subject: "surfaces & furniture",
          required: true,
          estimatedTime: 5,
          photoRequired: true,
          photoCount: 3,
          order: 8
        },
        {
          id: "arrival-9",
          name: "Photograph panoramas",
          description: "Take panoramic photos of each room for documentation",
          action: "Photograph",
          subject: "room panoramas",
          required: true,
          estimatedTime: 10,
          photoRequired: true,
          photoCount: 4,
          order: 9
        },
        {
          id: "arrival-10",
          name: "Test WiFi connection, signal strength & internet connection",
          description: "Verify WiFi is working properly with good signal strength",
          action: "Test",
          subject: "WiFi connection",
          required: true,
          estimatedTime: 3,
          photoRequired: false,
          order: 10
        },
        {
          id: "arrival-11",
          name: "Check cleaning kit in boiler cupboard",
          description: "Verify cleaning kit is present in boiler cupboard (Kitchen)",
          action: "Check",
          subject: "cleaning kit",
          location: "Kitchen > Boiler cupboard",
          required: true,
          estimatedTime: 2,
          photoRequired: false,
          order: 11
        },
        {
          id: "arrival-12",
          name: "Mark incomplete bedding with red sticker",
          description: "Tag any incomplete or damaged bedding with red stickers",
          action: "Check",
          subject: "bedding condition",
          required: true,
          estimatedTime: 5,
          photoRequired: false,
          order: 12
        },
        {
          id: "arrival-13",
          name: "Photograph & bag up all lost property",
          description: "Document and bag any items left behind by guests",
          action: "Photograph",
          subject: "lost property",
          required: true,
          estimatedTime: 5,
          photoRequired: true,
          photoCount: 2,
          order: 13
        }
      ]
    },
    // Phase 2: During - Room by Room
    {
      id: "room-tasks",
      name: "during",
      order: 2,
      rooms: [
        {
          id: "entrance-hall",
          code: "HALL",
          name: "Entrance Hall / Hallway",
          tasks: [
            {
              id: "hall-1",
              name: "Check all light bulbs work",
              description: "Test all light bulbs in entrance hall",
              action: "Check",
              subject: "light bulbs",
              location: "Entrance Hall",
              required: true,
              estimatedTime: 2,
              photoRequired: false,
              order: 1
            },
            {
              id: "hall-2",
              name: "Bag & Tag - Host belongings, bags and tags",
              description: "Bag and properly tag all host belongings for storage",
              action: "Bag and tag",
              subject: "host belongings",
              location: "Entrance Hall",
              required: true,
              estimatedTime: 10,
              photoRequired: true,
              photoCount: 2,
              order: 2
            },
            {
              id: "hall-3",
              name: "Damage & Maintenance - Damage, wear, scratches and chips",
              description: "Document any damage, wear, scratches or chips",
              action: "Photograph",
              subject: "damage & wear",
              location: "Entrance Hall",
              required: true,
              estimatedTime: 5,
              photoRequired: true,
              photoCount: 2,
              order: 3
            },
            {
              id: "hall-4",
              name: "Detail - Carpet, surfaces, walls and other items",
              description: "Photograph carpet, surfaces, walls and other details",
              action: "Photograph",
              subject: "room details",
              location: "Entrance Hall",
              required: true,
              estimatedTime: 5,
              photoRequired: true,
              photoCount: 3,
              order: 4
            },
            {
              id: "hall-5",
              name: "Overview - Overview of the room, arrangement of furniture",
              description: "Take overview photo showing room layout and furniture",
              action: "Photograph",
              subject: "room overview",
              location: "Entrance Hall",
              required: true,
              estimatedTime: 2,
              photoRequired: true,
              photoCount: 1,
              order: 5
            },
            {
              id: "hall-6",
              name: "Fill out report - Broken seals",
              description: "Document any broken seals found",
              action: "Fill out",
              subject: "broken seals report",
              location: "Entrance Hall",
              required: false,
              estimatedTime: 3,
              photoRequired: false,
              order: 6
            },
            {
              id: "hall-7",
              name: "Unseal items",
              description: "Remove seals from appropriate items",
              action: "Unseal",
              subject: "sealed items",
              location: "Entrance Hall",
              required: true,
              estimatedTime: 3,
              photoRequired: false,
              order: 7
            },
            {
              id: "hall-8",
              name: "Clear cupboard - Prepare for host",
              description: "Clear and prepare cupboard for host return",
              action: "Clear",
              subject: "cupboard",
              location: "Entrance Hall > Cupboard",
              required: true,
              estimatedTime: 5,
              photoRequired: false,
              order: 8
            },
            {
              id: "hall-9",
              name: "Unseal corresponding phone socket",
              description: "Remove seal from phone socket",
              action: "Unseal",
              subject: "phone socket",
              location: "Entrance Hall > Cupboard",
              required: true,
              estimatedTime: 1,
              photoRequired: false,
              order: 9
            },
            {
              id: "hall-10",
              name: "Check heating & hot water instructions followed",
              description: "Verify heating controls are set per exit instructions",
              action: "Check",
              subject: "heating settings",
              location: "Entrance Hall",
              required: true,
              estimatedTime: 2,
              photoRequired: false,
              order: 10
            },
            {
              id: "hall-11",
              name: "Collect OFS Cleaning Items",
              description: "Collect all OFS cleaning items",
              action: "Collect",
              subject: "OFS cleaning items",
              location: "Entrance Hall",
              required: true,
              estimatedTime: 3,
              photoRequired: false,
              order: 11
            },
            {
              id: "hall-12",
              name: "Collect OFS Teatowel",
              description: "Collect OFS teatowel",
              action: "Collect",
              subject: "OFS teatowel",
              location: "Entrance Hall",
              required: true,
              estimatedTime: 1,
              photoRequired: false,
              order: 12
            },
            {
              id: "hall-13",
              name: "Remove all refuse/waste",
              description: "Remove all refuse and waste from hall area",
              action: "Remove",
              subject: "refuse/waste",
              location: "Entrance Hall",
              required: true,
              estimatedTime: 3,
              photoRequired: false,
              order: 13
            }
          ]
        },
        {
          id: "kitchen",
          code: "KITCH",
          name: "Kitchen",
          tasks: [
            {
              id: "kitchen-1",
              name: "Clear - Prepare for host",
              description: "Clear and prepare kitchen for host return",
              action: "Clear",
              subject: "kitchen",
              location: "Kitchen",
              required: true,
              estimatedTime: 10,
              photoRequired: false,
              order: 1
            },
            {
              id: "kitchen-2",
              name: "Check heating & hot water instructions in boiler cupboard",
              description: "Verify boiler settings match exit instructions",
              action: "Check",
              subject: "boiler settings",
              location: "Kitchen > Boiler cupboard",
              required: true,
              estimatedTime: 3,
              photoRequired: false,
              order: 2
            },
            {
              id: "kitchen-3",
              name: "Check all light bulbs work",
              description: "Test all kitchen light bulbs",
              action: "Check",
              subject: "light bulbs",
              location: "Kitchen",
              required: true,
              estimatedTime: 2,
              photoRequired: false,
              order: 3
            },
            {
              id: "kitchen-4",
              name: "Bag & Tag - Host belongings",
              description: "Bag and tag all host belongings",
              action: "Bag and tag",
              subject: "host belongings",
              location: "Kitchen",
              required: true,
              estimatedTime: 8,
              photoRequired: true,
              photoCount: 2,
              order: 4
            },
            {
              id: "kitchen-5",
              name: "Damage & Maintenance - Document damage and wear",
              description: "Photograph any damage, wear, scratches or chips",
              action: "Photograph",
              subject: "damage & wear",
              location: "Kitchen",
              required: true,
              estimatedTime: 5,
              photoRequired: true,
              photoCount: 2,
              order: 5
            },
            {
              id: "kitchen-6",
              name: "Detail - Carpet, surfaces, walls",
              description: "Photograph surfaces, walls and other kitchen details",
              action: "Photograph",
              subject: "room details",
              location: "Kitchen",
              required: true,
              estimatedTime: 5,
              photoRequired: true,
              photoCount: 3,
              order: 6
            },
            {
              id: "kitchen-7",
              name: "Overview - Room arrangement",
              description: "Take overview photo of kitchen layout",
              action: "Photograph",
              subject: "room overview",
              location: "Kitchen",
              required: true,
              estimatedTime: 2,
              photoRequired: true,
              photoCount: 1,
              order: 7
            },
            {
              id: "kitchen-8",
              name: "Remove all refuse/waste",
              description: "Remove all refuse and waste from kitchen",
              action: "Remove",
              subject: "refuse/waste",
              location: "Kitchen",
              required: true,
              estimatedTime: 5,
              photoRequired: false,
              order: 8
            },
            {
              id: "kitchen-9",
              name: "Fill out report - Broken seals",
              description: "Document any broken seals",
              action: "Fill out",
              subject: "broken seals report",
              location: "Kitchen",
              required: false,
              estimatedTime: 3,
              photoRequired: false,
              order: 9
            },
            {
              id: "kitchen-10",
              name: "Unseal items",
              description: "Remove seals from appropriate items",
              action: "Unseal",
              subject: "sealed items",
              location: "Kitchen",
              required: true,
              estimatedTime: 3,
              photoRequired: false,
              order: 10
            }
          ]
        },
        {
          id: "sitting-room",
          code: "LIVING",
          name: "Sitting Room",
          tasks: [
            {
              id: "sitting-1",
              name: "Unseal items",
              description: "Remove seals from appropriate items",
              action: "Unseal",
              subject: "sealed items",
              location: "Sitting Room",
              required: true,
              estimatedTime: 3,
              photoRequired: false,
              order: 1
            },
            {
              id: "sitting-2",
              name: "Unribbon items on either side of room",
              description: "Remove ribbons from items",
              action: "Unribbon",
              subject: "ribboned items",
              location: "Sitting Room",
              required: true,
              estimatedTime: 3,
              photoRequired: false,
              order: 2
            },
            {
              id: "sitting-3",
              name: "Check all light bulbs work",
              description: "Test all sitting room light bulbs",
              action: "Check",
              subject: "light bulbs",
              location: "Sitting Room",
              required: true,
              estimatedTime: 2,
              photoRequired: false,
              order: 3
            },
            {
              id: "sitting-4",
              name: "Bag & Tag - Host belongings",
              description: "Bag and tag all host belongings",
              action: "Bag and tag",
              subject: "host belongings",
              location: "Sitting Room",
              required: true,
              estimatedTime: 10,
              photoRequired: true,
              photoCount: 2,
              order: 4
            },
            {
              id: "sitting-5",
              name: "Damage & Maintenance - Document damage",
              description: "Photograph any damage, wear or chips",
              action: "Photograph",
              subject: "damage & wear",
              location: "Sitting Room",
              required: true,
              estimatedTime: 5,
              photoRequired: true,
              photoCount: 2,
              order: 5
            },
            {
              id: "sitting-6",
              name: "Detail - Carpet, surfaces, walls",
              description: "Photograph carpet, surfaces and walls",
              action: "Photograph",
              subject: "room details",
              location: "Sitting Room",
              required: true,
              estimatedTime: 5,
              photoRequired: true,
              photoCount: 3,
              order: 6
            },
            {
              id: "sitting-7",
              name: "Overview - Room arrangement",
              description: "Take overview photo showing furniture layout",
              action: "Photograph",
              subject: "room overview",
              location: "Sitting Room",
              required: true,
              estimatedTime: 2,
              photoRequired: true,
              photoCount: 1,
              order: 7
            },
            {
              id: "sitting-8",
              name: "Fill out report - Broken seals",
              description: "Document any broken seals",
              action: "Fill out",
              subject: "broken seals report",
              location: "Sitting Room",
              required: false,
              estimatedTime: 3,
              photoRequired: false,
              order: 8
            }
          ]
        },
        {
          id: "bathroom",
          code: "BATH",
          name: "Bathroom",
          tasks: [
            {
              id: "bath-1",
              name: "Check all light bulbs work",
              description: "Test all bathroom light bulbs",
              action: "Check",
              subject: "light bulbs",
              location: "Bathroom",
              required: true,
              estimatedTime: 2,
              photoRequired: false,
              order: 1
            },
            {
              id: "bath-2",
              name: "Bag & Tag - Host belongings",
              description: "Bag and tag all host belongings",
              action: "Bag and tag",
              subject: "host belongings",
              location: "Bathroom",
              required: true,
              estimatedTime: 5,
              photoRequired: true,
              photoCount: 1,
              order: 2
            },
            {
              id: "bath-3",
              name: "Damage & Maintenance - Document damage",
              description: "Photograph any damage or wear",
              action: "Photograph",
              subject: "damage & wear",
              location: "Bathroom",
              required: true,
              estimatedTime: 5,
              photoRequired: true,
              photoCount: 2,
              order: 3
            },
            {
              id: "bath-4",
              name: "Detail - Surfaces, walls and fixtures",
              description: "Photograph surfaces, walls and fixtures",
              action: "Photograph",
              subject: "room details",
              location: "Bathroom",
              required: true,
              estimatedTime: 5,
              photoRequired: true,
              photoCount: 2,
              order: 4
            },
            {
              id: "bath-5",
              name: "Overview - Room arrangement",
              description: "Take overview photo of bathroom",
              action: "Photograph",
              subject: "room overview",
              location: "Bathroom",
              required: true,
              estimatedTime: 2,
              photoRequired: true,
              photoCount: 1,
              order: 5
            },
            {
              id: "bath-6",
              name: "Fill out report - Broken seals",
              description: "Document any broken seals",
              action: "Fill out",
              subject: "broken seals report",
              location: "Bathroom",
              required: false,
              estimatedTime: 3,
              photoRequired: false,
              order: 6
            }
          ]
        },
        {
          id: "second-bedroom",
          code: "BED2",
          name: "Second Bedroom",
          tasks: [
            {
              id: "bed2-1",
              name: "Remove & return OFS items to warehouse",
              description: "Remove all OFS items and prepare for warehouse return",
              action: "Remove",
              subject: "OFS items",
              location: "Second Bedroom",
              required: true,
              estimatedTime: 5,
              photoRequired: false,
              order: 1
            },
            {
              id: "bed2-2",
              name: "Check all light bulbs work",
              description: "Test all bedroom light bulbs",
              action: "Check",
              subject: "light bulbs",
              location: "Second Bedroom",
              required: true,
              estimatedTime: 2,
              photoRequired: false,
              order: 2
            },
            {
              id: "bed2-3",
              name: "Collect OFS Hairdryer",
              description: "Collect OFS hairdryer",
              action: "Collect",
              subject: "OFS hairdryer",
              location: "Second Bedroom",
              required: true,
              estimatedTime: 1,
              photoRequired: false,
              order: 3
            },
            {
              id: "bed2-4",
              name: "Bag & Tag - Host belongings",
              description: "Bag and tag all host belongings",
              action: "Bag and tag",
              subject: "host belongings",
              location: "Second Bedroom",
              required: true,
              estimatedTime: 8,
              photoRequired: true,
              photoCount: 2,
              order: 4
            },
            {
              id: "bed2-5",
              name: "Damage & Maintenance - Document damage",
              description: "Photograph any damage or wear",
              action: "Photograph",
              subject: "damage & wear",
              location: "Second Bedroom",
              required: true,
              estimatedTime: 5,
              photoRequired: true,
              photoCount: 2,
              order: 5
            },
            {
              id: "bed2-6",
              name: "Detail - Carpet, surfaces, walls",
              description: "Photograph room details",
              action: "Photograph",
              subject: "room details",
              location: "Second Bedroom",
              required: true,
              estimatedTime: 5,
              photoRequired: true,
              photoCount: 3,
              order: 6
            },
            {
              id: "bed2-7",
              name: "Overview - Room arrangement",
              description: "Take overview photo of bedroom layout",
              action: "Photograph",
              subject: "room overview",
              location: "Second Bedroom",
              required: true,
              estimatedTime: 2,
              photoRequired: true,
              photoCount: 1,
              order: 7
            },
            {
              id: "bed2-8",
              name: "Remove OFS fans",
              description: "Remove all OFS fans",
              action: "Remove",
              subject: "OFS fans",
              location: "Second Bedroom",
              required: true,
              estimatedTime: 2,
              photoRequired: false,
              order: 8
            },
            {
              id: "bed2-9",
              name: "Fill out report - Broken seals",
              description: "Document any broken seals",
              action: "Fill out",
              subject: "broken seals report",
              location: "Second Bedroom",
              required: false,
              estimatedTime: 3,
              photoRequired: false,
              order: 9
            },
            {
              id: "bed2-10",
              name: "Detail - Bed frame, host linen and pillows",
              description: "Photograph bed frame and host linens",
              action: "Photograph",
              subject: "bed & linens",
              location: "Second Bedroom",
              required: true,
              estimatedTime: 3,
              photoRequired: true,
              photoCount: 2,
              order: 10
            }
          ]
        },
        {
          id: "master-bedroom",
          code: "BED1",
          name: "Master Bedroom",
          tasks: [
            {
              id: "bed1-1",
              name: "Unribbon (RHS)",
              description: "Remove ribbon from right-hand side",
              action: "Unribbon",
              subject: "ribboned items",
              location: "Master Bedroom",
              required: true,
              estimatedTime: 2,
              photoRequired: false,
              order: 1
            },
            {
              id: "bed1-2",
              name: "Check all light bulbs work",
              description: "Test all master bedroom light bulbs",
              action: "Check",
              subject: "light bulbs",
              location: "Master Bedroom",
              required: true,
              estimatedTime: 2,
              photoRequired: false,
              order: 2
            },
            {
              id: "bed1-3",
              name: "Collect OFS Hairdryer",
              description: "Collect OFS hairdryer",
              action: "Collect",
              subject: "OFS hairdryer",
              location: "Master Bedroom",
              required: true,
              estimatedTime: 1,
              photoRequired: false,
              order: 3
            },
            {
              id: "bed1-4",
              name: "Bag & Tag - Host belongings",
              description: "Bag and tag all host belongings",
              action: "Bag and tag",
              subject: "host belongings",
              location: "Master Bedroom",
              required: true,
              estimatedTime: 10,
              photoRequired: true,
              photoCount: 2,
              order: 4
            },
            {
              id: "bed1-5",
              name: "Damage & Maintenance - Document damage",
              description: "Photograph any damage or wear",
              action: "Photograph",
              subject: "damage & wear",
              location: "Master Bedroom",
              required: true,
              estimatedTime: 5,
              photoRequired: true,
              photoCount: 2,
              order: 5
            },
            {
              id: "bed1-6",
              name: "Detail - Carpet, surfaces, walls",
              description: "Photograph room details",
              action: "Photograph",
              subject: "room details",
              location: "Master Bedroom",
              required: true,
              estimatedTime: 5,
              photoRequired: true,
              photoCount: 3,
              order: 6
            },
            {
              id: "bed1-7",
              name: "Overview - Room arrangement",
              description: "Take overview photo of bedroom layout",
              action: "Photograph",
              subject: "room overview",
              location: "Master Bedroom",
              required: true,
              estimatedTime: 2,
              photoRequired: true,
              photoCount: 1,
              order: 7
            },
            {
              id: "bed1-8",
              name: "Remove OFS fans",
              description: "Remove all OFS fans",
              action: "Remove",
              subject: "OFS fans",
              location: "Master Bedroom",
              required: true,
              estimatedTime: 2,
              photoRequired: false,
              order: 8
            },
            {
              id: "bed1-9",
              name: "Fill out report - Broken seals",
              description: "Document any broken seals",
              action: "Fill out",
              subject: "broken seals report",
              location: "Master Bedroom",
              required: false,
              estimatedTime: 3,
              photoRequired: false,
              order: 9
            },
            {
              id: "bed1-10",
              name: "Detail - Bed frame, host linen and pillows",
              description: "Photograph bed frame and host linens",
              action: "Photograph",
              subject: "bed & linens",
              location: "Master Bedroom",
              required: true,
              estimatedTime: 3,
              photoRequired: true,
              photoCount: 2,
              order: 10
            }
          ]
        }
      ]
    },
    // Phase 3: Departure
    {
      id: "departure",
      name: "depart",
      order: 3,
      tasks: [
        {
          id: "depart-1",
          name: "Collect OFS Cleaning Kit",
          description: "Collect OFS cleaning kit and prepare for return",
          action: "Collect",
          subject: "OFS cleaning kit",
          required: true,
          estimatedTime: 3,
          photoRequired: false,
          order: 1,
          priority: "high"
        },
        {
          id: "depart-2",
          name: "Video locking of doors showing which locks used",
          description: "Record video of door locking procedure showing all locks",
          action: "Video",
          subject: "locking procedure",
          required: true,
          estimatedTime: 3,
          photoRequired: true,
          photoCount: 1,
          order: 2,
          priority: "high"
        },
        {
          id: "depart-3",
          name: "Note supervisor & cleaner timesheets",
          description: "Record timesheet information for supervisor and cleaner",
          action: "Note",
          subject: "timesheets",
          required: true,
          estimatedTime: 5,
          photoRequired: false,
          order: 3
        },
        {
          id: "depart-4",
          name: "Photograph refuse (Host/Guest/OFS)",
          description: "Document all refuse categories: Host, Guest, and OFS",
          action: "Photograph",
          subject: "refuse",
          required: true,
          estimatedTime: 5,
          photoRequired: true,
          photoCount: 2,
          order: 4
        },
        {
          id: "depart-5",
          name: "Quality check - Cleaning",
          description: "Perform final quality check on cleaning standards",
          action: "Quality check",
          subject: "cleaning",
          required: true,
          estimatedTime: 10,
          photoRequired: false,
          order: 5,
          priority: "high"
        },
        {
          id: "depart-6",
          name: "Quality check - Maintenance",
          description: "Perform final quality check on maintenance issues",
          action: "Quality check",
          subject: "maintenance",
          required: true,
          estimatedTime: 10,
          photoRequired: false,
          order: 6,
          priority: "high"
        },
        {
          id: "depart-7",
          name: "Fill out activity report",
          description: "Complete comprehensive activity report",
          action: "Fill out",
          subject: "activity report",
          required: true,
          estimatedTime: 10,
          photoRequired: false,
          order: 7,
          priority: "high"
        },
        {
          id: "depart-8",
          name: "Turn off all lights",
          description: "Ensure all lights are turned off before departure",
          action: "Turn off",
          subject: "lights",
          required: true,
          estimatedTime: 3,
          photoRequired: false,
          order: 8,
          priority: "high"
        }
      ]
    }
  ]
}

