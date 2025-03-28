"use client"

import { useState } from "react"
import ChatPage from "@/components/chat-page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

// Sample doctors data (you would fetch this from your API)
const sampleDoctors = [
  {
    _id: "1",
    name: "Sarah Johnson",
    specialization: "Cardiology",
    profileImage: "/placeholder.svg?height=100&width=100",
    status: "online",
  },
  {
    _id: "2",
    name: "Michael Chen",
    specialization: "Neurology",
    profileImage: "/placeholder.svg?height=100&width=100",
    status: "offline",
  },
  {
    _id: "3",
    name: "Priya Patel",
    specialization: "Pediatrics",
    profileImage: "/placeholder.svg?height=100&width=100",
    status: "online",
  },
]

export default function ChatPageWrapper() {
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDoctors = sampleDoctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleBack = () => {
    setSelectedDoctor(null)
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Healthcare Chat</h1>

      {selectedDoctor ? (
        <ChatPage doctor={selectedDoctor} onBack={handleBack} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Available Doctors</CardTitle>
                <CardDescription>Select a doctor to start a conversation</CardDescription>
                <div className="relative mt-2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search doctors..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => (
                    <div
                      key={doctor._id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => setSelectedDoctor(doctor)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={doctor.profileImage} alt={doctor.name} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {doctor.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${doctor.status === "online" ? "bg-green-500" : "bg-gray-400"}`}
                        ></span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">Dr. {doctor.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {doctor.specialization}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {doctor.status === "online" ? "Online" : "Offline"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">No doctors found matching your search</div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Select a Doctor</CardTitle>
                <CardDescription>Choose a doctor from the list to start a conversation</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center text-center p-12">
                <div>
                  <div className="mx-auto bg-gray-100 p-6 rounded-full mb-4 w-16 h-16 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                    Select a doctor from the list to view your conversation history or start a new chat.
                  </p>
                  <Button variant="outline" onClick={() => setSelectedDoctor(sampleDoctors[0])}>
                    Start a new conversation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

