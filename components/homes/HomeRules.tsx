"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { FileText, AlertCircle, Ban, Info, CheckCircle2 } from "lucide-react"

interface HomeRulesProps {
  homeCode: string
}

export function HomeRules({ homeCode }: HomeRulesProps) {
  // Get storage key for this home
  const storageKey = `home-rules-acknowledged-${homeCode}`
  
  // Load acknowledged rules from localStorage
  const [acknowledgedRules, setAcknowledgedRules] = useState<Set<number>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey)
      return saved ? new Set(JSON.parse(saved)) : new Set()
    }
    return new Set()
  })

  // Save to localStorage whenever acknowledgedRules changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(acknowledgedRules)))
    }
  }, [acknowledgedRules, storageKey])

  const toggleAcknowledgment = (index: number) => {
    setAcknowledgedRules(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

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

  const acknowledgedCount = acknowledgedRules.size
  const totalRules = houseRules.length
  const progress = (acknowledgedCount / totalRules) * 100
  const allAcknowledged = acknowledgedCount === totalRules

  return (
    <div className="space-y-6">
      {/* Intro Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Intro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No data found</p>
        </CardContent>
      </Card>

      {/* Progress Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              House Rules Acknowledgment
            </CardTitle>
            {allAcknowledged && (
              <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                All Acknowledged
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">
                {acknowledgedCount} of {totalRules} rules acknowledged
              </p>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <p className="text-sm text-muted-foreground">
            Please read and acknowledge each rule by checking the box. This helps ensure you're aware of all important guidelines.
          </p>
        </CardContent>
      </Card>

      {/* House Rules Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            House Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {houseRules.map((rule, index) => {
            const isAcknowledged = acknowledgedRules.has(index)
            
            return (
              <div 
                key={index} 
                className={`p-4 border rounded-lg transition-colors ${
                  isAcknowledged 
                    ? "bg-green-50/50 dark:bg-green-950/50 border-green-200 dark:border-green-800" 
                    : "bg-background"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Large Checkbox */}
                  <div className="flex-shrink-0 pt-1">
                    <Checkbox
                      id={`rule-${index}`}
                      checked={isAcknowledged}
                      onCheckedChange={() => toggleAcknowledgment(index)}
                      className="h-6 w-6 border-2"
                    />
                  </div>
                  
                  {/* Rule Content */}
                  <div className="flex-1 min-w-0">
                    <label 
                      htmlFor={`rule-${index}`}
                      className="cursor-pointer block"
                    >
                      <div className="mb-2">
                        <p
                          className="text-sm text-foreground"
                          dangerouslySetInnerHTML={{ __html: formatRuleText(rule.text) }}
                        />
                      </div>
                      {rule.subItems && (
                        <ul className="mt-2 ml-6 space-y-1 list-disc">
                          {rule.subItems.map((item, subIndex) => (
                            <li key={subIndex} className="text-sm text-muted-foreground">
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </label>
                  </div>
                  
                  {/* Priority Badge */}
                  <div className="flex-shrink-0">
                    <Badge 
                      variant={rule.priority === "high" ? "destructive" : rule.priority === "medium" ? "default" : "secondary"}
                    >
                      {rule.priority === "high" ? "High" : rule.priority === "medium" ? "Medium" : "Low"}
                    </Badge>
                    {isAcknowledged && (
                      <div className="mt-2 flex justify-end">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Important Warnings */}
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
            <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-300 mb-1">Boiling Water Tap</p>
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                This home has a boiling water tap in the kitchen - please take extreme care when using.
              </p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
              <p className="text-sm font-semibold text-orange-900 dark:text-orange-300 mb-1">Gym Equipment</p>
              <p className="text-sm text-orange-800 dark:text-orange-300">
                Gym use requires experience and full acceptance of responsibility. Use at your own risk.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

