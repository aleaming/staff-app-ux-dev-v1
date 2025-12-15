"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Ban, Info } from "lucide-react"

interface HomeRulesProps {
  homeCode: string
}

export function HomeRules({ homeCode }: HomeRulesProps) {
  // Intro data - in production, this would come from the API
  // Set to null to hide the section when no data exists
  const introContent: string | null = null

  // House Rules extracted from the image
  const houseRules = [
    {
      text: "Please **don't** smoke inside the home.",
      priority: "high"
    },
    {
      text: "Please **don't** open rooms, cupboards or drawers sealed with red tape or ribbon.",
      priority: "high"
    },
    {
      text: "We know accidents happen so if you spill or mark any item in the home especially marble surfaces, flooring or soft furnishings, please call us and we can advise you accordingly. Please do not use any cleaning products to try and clean this, even water, as this can create further damage and additional costs.",
      priority: "high"
    },
    {
      text: "The marble can stain if you leave citrus, red wine, soy sauce etc. without cleaning.",
      priority: "high"
    },
    {
      text: "Please note this home has a boiling water tap in the kitchen, please take care when using.",
      priority: "high"
    },
    {
      text: "The piano is not for guest use.",
      priority: "medium"
    },
    {
      text: "Please be careful of the sitting room coffee table as the green frame scratches easily.",
      priority: "medium"
    },
    {
      text: "Please be careful not to mark walls or wall paper.",
      priority: "medium"
    },
    {
      text: "Please be aware you are more than welcome to use the gym but only on the following basis:",
      subItems: [
        "You are an experienced user of gym equipment.",
        "You make your own assessment of all aspects of the safety of the equipment.",
        "You accept full responsibility for any injury that may arise from your use of the equipment.",
        "You will not directly or indirectly seek any recompense of any nature from the owner for any such injury."
      ],
      priority: "high"
    },
    {
      text: "Please do not place anything, particularly not food or drinks, on the piano in the sitting room as it is extremely precious and scratches easily.",
      priority: "high"
    },
    {
      text: "Please use coasters on the surfaces throughout the home and especially in the sitting room.",
      priority: "medium"
    },
    {
      text: "Please be careful with the sofa in the formal sitting room at the front of the home, especially by not drinking red wine in here. Please do not attempt to clean any spillages on this sofa and contact onefinestay instead.",
      priority: "high"
    },
    {
      text: "Please be careful with large bags and buggies against the radiator cover in the entrance hallway as the paint on it easily chips.",
      priority: "medium"
    },
    {
      text: "Please do not put excessive weight on the outer edges of the marble kitchen island, and please do not allow small children to climb or swing on it.",
      priority: "high"
    },
    {
      text: "Please do not eat food in the formal sitting room at the front of the home.",
      priority: "medium"
    },
    {
      text: "Please wipe down the exercise bike after each use.",
      priority: "low"
    },
    {
      text: "Please remove your shoes upon entering the home.",
      priority: "medium"
    }
  ]

  const formatRuleText = (text: string) => {
    // Convert markdown-style bold to HTML
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  }

  return (
    <div className="space-y-6">
      {/* Critical Warnings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ban className="h-5 w-5" />
            Critical Warnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm font-semibold text-red-900 dark:text-red-300 mb-1">Marble Surfaces</p>
              <p className="text-sm text-red-800 dark:text-red-300">
                Marble can stain from citrus, red wine, soy sauce, etc. Do not use cleaning products or water on spills - contact us immediately.
              </p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm font-semibold text-red-900 dark:text-red-300 mb-1">Boiling Water Tap</p>
              <p className="text-sm text-red-800 dark:text-red-300">
                This home has a boiling water tap in the kitchen - please take extreme care when using.
              </p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm font-semibold text-red-900 dark:text-red-300 mb-1">Gym Equipment</p>
              <p className="text-sm text-red-800 dark:text-red-300">
                Gym use requires experience and full acceptance of responsibility. Use at your own risk.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Intro Section - only show if intro data exists */}
      {introContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Intro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{introContent}</p>
          </CardContent>
        </Card>
      )}

      {/* House Rules Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            House Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {houseRules.map((rule, index) => (
            <div 
              key={index} 
              className="p-3 border rounded-lg bg-background"
            >
              <p
                className="text-sm text-foreground"
                dangerouslySetInnerHTML={{ __html: formatRuleText(rule.text) }}
              />
              {rule.subItems && (
                <ul className="mt-2 ml-4 space-y-1 list-disc">
                  {rule.subItems.map((item, subIndex) => (
                    <li key={subIndex} className="text-sm text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

