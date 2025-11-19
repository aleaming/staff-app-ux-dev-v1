"use client"

import Link from "next/link"
import { useState } from "react"
import { MessageSquare, Bell, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { testNotifications } from "@/lib/test-data"

export type NotificationType = "message" | "alert" | "activity-update"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  read: boolean
  link?: string
}

interface NotificationsMessagesProps {
  notifications?: Notification[]
  isLoading?: boolean
}

export function NotificationsMessages({ 
  notifications = [], 
  isLoading = false 
}: NotificationsMessagesProps) {
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "alerts">("all")

  // Use provided notifications or fall back to test data
  const now = new Date()
  const displayNotifications: Notification[] = notifications.length > 0 ? notifications : testNotifications

  const unreadCount = displayNotifications.filter(n => !n.read).length
  const alertsCount = displayNotifications.filter(n => n.type === "alert").length

  const filteredNotifications = displayNotifications.filter(notification => {
    if (activeTab === "unread") return !notification.read
    if (activeTab === "alerts") return notification.type === "alert"
    return true
  })

  const formatTimeAgo = (date: Date): string => {
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "message":
        return MessageSquare
      case "alert":
        return AlertTriangle
      case "activity-update":
        return CheckCircle
      default:
        return Bell
    }
  }

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case "message":
        return "bg-blue-500"
      case "alert":
        return "bg-red-500"
      case "activity-update":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notifications & Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-row items-start sm:items-center justify-between gap-3 sm:gap-2">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2 flex-wrap">
            <span className="break-words">Notifications & Messages</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">{unreadCount} unread</Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" asChild className="text-xs sm:text-sm">
            <Link href="/notifications">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-3 text-xs">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
            <TabsTrigger value="alerts">
              Alerts {alertsCount > 0 && `(${alertsCount})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No notifications</p>
              </div>
            ) : (
              <div className="space-y-2 flex flex-col">
                {filteredNotifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type)
                  const color = getNotificationColor(notification.type)

                  const content = (
                    <Card className={`hover:bg-muted/50 transition-colors ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}>
                      <CardContent className="p-2.5 sm:p-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${color} text-background`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-sm">{notification.title}</p>
                                  {!notification.read && (
                                    <Badge variant="default" className="h-2 w-2 p-0 rounded-full" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">
                                  {formatTimeAgo(notification.timestamp)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )

                  if (notification.link) {
                    return (
                      <Link key={notification.id} href={notification.link}>
                        {content}
                      </Link>
                    )
                  }

                  return <div key={notification.id}>{content}</div>
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

