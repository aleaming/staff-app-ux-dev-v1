import type { ActivityTemplate } from "../activity-templates"

/**
 * Sample Meet & Greet Data (Based on ALB134 - Albert Bridge Road II)
 * Comprehensive guest arrival and orientation checklist
 */
export const sampleGreetData: ActivityTemplate = {
  type: "meet-greet",
  name: "Meet & Greet - ALB134",
  description: "Welcome guest and provide comprehensive home orientation",
  estimatedTotalTime: 45,
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
        message: "Toilet has environmentally friendly low flow flush - may need multiple flushes to clear bowl"
      },
      {
        type: "info",
        message: "Communal hallway lights are NOT on a timer - must be turned off manually when not needed"
      },
      {
        type: "warning",
        message: "Guests should NOT use the vinyl player located in the sitting room"
      },
      {
        type: "info",
        message: "For stays over 8 nights: Explain maid service availability and scheduling"
      }
    ],
    checkInstructions: [
      "Show guest how to operate all TVs in the property",
      "Explain heating controls - boiler in kitchen, portable thermostat in entrance hall",
      "Demonstrate kitchen appliances and explain usage",
      "Show guest how to access and use the guest app",
      "Review house rules: communal lights, vinyl player restriction, no smoking",
      "Show refuse & recycling location outside building",
      "Provide WiFi network name and password",
      "For stays 8+ nights: Explain maid service schedule and procedures"
    ],
    exitInstructions: {
      locking: "During stay: Close and lock all windows, double lock front door when leaving. At checkout: Double lock door, ensure all windows secured.",
      refuse: "Refuse and recycling is collected from communal bins outside the building. Turn left when exiting, bins are to your left by the white pillar marked 'Mansions'. DO NOT leave rubbish bags on the pavement.",
      checkout: "Ensure all windows closed and locked, heating set appropriately, all lights off, front door double locked"
    }
  },
  phases: [
    // Phase 1: Arrival & Welcome
    {
      id: "arrival",
      name: "arrive",
      order: 1,
      tasks: [
        {
          id: "arrival-1",
          name: "Welcome Guest",
          description: "Greet guest warmly upon arrival, verify booking details and identity",
          action: "Welcome",
          subject: "guest and verify identity",
          required: true,
          estimatedTime: 3,
          photoRequired: false,
          order: 1,
          priority: "high"
        },
        {
          id: "arrival-2",
          name: "Key Handover",
          description: "Provide keys to guest and explain key usage",
          action: "Show",
          subject: "keys and access",
          required: true,
          estimatedTime: 2,
          photoRequired: true,
          photoCount: 1,
          order: 2,
          priority: "high"
        },
        {
          id: "arrival-3",
          name: "Explain Door Locking",
          description: "Demonstrate how to lock and unlock the front door, explain double-locking procedure",
          action: "Demonstrate",
          subject: "door locking mechanism",
          location: "Front Door",
          required: true,
          estimatedTime: 2,
          photoRequired: false,
          order: 3,
          priority: "high"
        }
      ]
    },
    // Phase 2: Home Tour
    {
      id: "home-tour",
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
              name: "Show heating thermostat",
              description: "Demonstrate portable thermostat in entrance hall and explain temperature controls",
              action: "Demonstrate",
              subject: "heating thermostat",
              location: "Entrance Hall",
              required: true,
              estimatedTime: 3,
              photoRequired: false,
              order: 1,
              priority: "high"
            },
            {
              id: "hall-2",
              name: "Explain communal hallway lights",
              description: "Explain that communal hallway lights are NOT on a timer and must be turned off manually",
              action: "Explain",
              subject: "communal hallway lights",
              location: "Communal Areas",
              required: true,
              estimatedTime: 1,
              photoRequired: false,
              order: 2,
              priority: "medium"
            },
            {
              id: "hall-3",
              name: "Show hallway cupboard",
              description: "Show hallway cupboard with cleaning supplies and extra linens",
              action: "Show",
              subject: "hallway cupboard storage",
              location: "Entrance Hall",
              required: true,
              estimatedTime: 1,
              photoRequired: false,
              order: 3,
              priority: "low"
            },
            {
              id: "hall-4",
              name: "Explain window locking",
              description: "Demonstrate how to close and lock all windows properly",
              action: "Demonstrate",
              subject: "window locking",
              location: "Throughout Home",
              required: true,
              estimatedTime: 2,
              photoRequired: false,
              order: 4,
              priority: "high"
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
              name: "Show boiler controls",
              description: "Demonstrate boiler location and basic heating/hot water controls",
              action: "Demonstrate",
              subject: "boiler controls",
              location: "Kitchen",
              required: true,
              estimatedTime: 3,
              photoRequired: false,
              order: 1,
              priority: "high"
            },
            {
              id: "kitchen-2",
              name: "Demonstrate kitchen appliances",
              description: "Show how to operate oven, dishwasher, and other kitchen appliances",
              action: "Demonstrate",
              subject: "kitchen appliances",
              location: "Kitchen",
              required: true,
              estimatedTime: 4,
              photoRequired: false,
              order: 2,
              priority: "medium"
            },
            {
              id: "kitchen-3",
              name: "Show kitchen amenities",
              description: "Point out coffee maker, kettle, and basic kitchen supplies provided",
              action: "Show",
              subject: "kitchen amenities",
              location: "Kitchen",
              required: true,
              estimatedTime: 2,
              photoRequired: false,
              order: 3,
              priority: "low"
            }
          ]
        },
        {
          id: "living-areas",
          code: "LIVING",
          name: "Living Areas / Sitting Room",
          tasks: [
            {
              id: "living-1",
              name: "Demonstrate TV operation",
              description: "Show guest how to operate all TVs in the property",
              action: "Demonstrate",
              subject: "TV operation",
              location: "Living Areas",
              required: true,
              estimatedTime: 3,
              photoRequired: false,
              order: 1,
              priority: "medium"
            },
            {
              id: "living-2",
              name: "Explain vinyl player restriction",
              description: "Inform guest that the vinyl player is NOT to be used during their stay",
              action: "Explain",
              subject: "vinyl player restriction",
              location: "Sitting Room",
              required: true,
              estimatedTime: 1,
              photoRequired: false,
              order: 2,
              priority: "high"
            },
            {
              id: "living-3",
              name: "Show entertainment features",
              description: "Explain any other entertainment features or systems available",
              action: "Show",
              subject: "entertainment features",
              location: "Living Areas",
              required: false,
              estimatedTime: 2,
              photoRequired: false,
              order: 3,
              priority: "low"
            }
          ]
        },
        {
          id: "bedrooms",
          code: "BED",
          name: "Bedrooms",
          tasks: [
            {
              id: "bedroom-1",
              name: "Show bedroom features",
              description: "Point out bedroom amenities, wardrobe space, and lighting controls",
              action: "Show",
              subject: "bedroom features",
              location: "Bedrooms",
              required: true,
              estimatedTime: 2,
              photoRequired: false,
              order: 1,
              priority: "low"
            },
            {
              id: "bedroom-2",
              name: "Explain storage locations",
              description: "Show guests where to find extra pillows, blankets, and storage space",
              action: "Show",
              subject: "storage locations",
              location: "Bedrooms",
              required: false,
              estimatedTime: 2,
              photoRequired: false,
              order: 2,
              priority: "low"
            }
          ]
        },
        {
          id: "bathrooms",
          code: "BATH",
          name: "Bathrooms",
          tasks: [
            {
              id: "bathroom-1",
              name: "Explain toilet flush",
              description: "Explain that toilet has low flow flush and may require multiple flushes to clear bowl",
              action: "Explain",
              subject: "toilet low flow flush",
              location: "Bathrooms",
              required: true,
              estimatedTime: 1,
              photoRequired: false,
              order: 1,
              priority: "medium"
            },
            {
              id: "bathroom-2",
              name: "Show bathroom amenities",
              description: "Point out towels, toiletries, and bathroom features",
              action: "Show",
              subject: "bathroom amenities",
              location: "Bathrooms",
              required: true,
              estimatedTime: 1,
              photoRequired: false,
              order: 2,
              priority: "low"
            }
          ]
        }
      ]
    },
    // Phase 3: Information & Departure
    {
      id: "departure-info",
      name: "depart",
      order: 3,
      tasks: [
        {
          id: "info-1",
          name: "Provide WiFi information",
          description: "Give guest WiFi network name (BT-F8CTWR) and password (3p7VDRCdcQNpcf)",
          action: "Explain",
          subject: "WiFi network and password",
          required: true,
          estimatedTime: 2,
          photoRequired: false,
          order: 1,
          priority: "high"
        },
        {
          id: "info-2",
          name: "Explain guest app",
          description: "Demonstrate how to use the hosted guest app for support and information",
          action: "Demonstrate",
          subject: "guest app features",
          required: true,
          estimatedTime: 3,
          photoRequired: false,
          order: 2,
          priority: "high"
        },
        {
          id: "info-3",
          name: "Review house rules",
          description: "Summarize key house rules: no smoking, communal lights, vinyl player restriction",
          action: "Review",
          subject: "house rules",
          required: true,
          estimatedTime: 2,
          photoRequired: false,
          order: 3,
          priority: "high"
        },
        {
          id: "info-4",
          name: "Explain refuse & recycling",
          description: "Show location of communal bins outside building (turn left, by white pillar marked 'Mansions'). Emphasize not to leave bags on pavement.",
          action: "Explain",
          subject: "refuse and recycling instructions",
          required: true,
          estimatedTime: 2,
          photoRequired: false,
          order: 4,
          priority: "medium"
        },
        {
          id: "info-5",
          name: "Provide emergency contacts",
          description: "Give guest emergency contact information and 24/7 support details",
          action: "Review",
          subject: "emergency contacts",
          required: true,
          estimatedTime: 1,
          photoRequired: false,
          order: 5,
          priority: "high"
        },
        {
          id: "info-6",
          name: "Explain maid service (if applicable)",
          description: "For stays over 8 nights, explain maid service schedule and what to expect",
          action: "Explain",
          subject: "maid service schedule",
          required: false,
          estimatedTime: 2,
          photoRequired: false,
          order: 6,
          priority: "low",
          conditional: {
            occupancy: "booking"
          }
        },
        {
          id: "info-7",
          name: "Answer guest questions",
          description: "Allow time for guest questions and provide any additional information needed",
          action: "Answer Questions",
          subject: "guest inquiries",
          required: true,
          estimatedTime: 3,
          photoRequired: false,
          order: 7,
          priority: "medium"
        },
        {
          id: "info-8",
          name: "Final walkthrough photo",
          description: "Take photo with guest confirming successful meet & greet completion",
          action: "Photograph",
          subject: "meet & greet completion",
          required: false,
          estimatedTime: 1,
          photoRequired: true,
          photoCount: 1,
          order: 8,
          priority: "low"
        }
      ]
    }
  ]
}

