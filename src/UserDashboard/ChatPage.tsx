"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Send, Paperclip, MoreVertical, ArrowLeft, Clock } from "lucide-react"
import axios from "axios"
import { useAuth } from "../AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Skeleton } from "../components/ui/skeleton"
import { Badge } from "../components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
// import { format } from "date-fns"
import { cn } from "../lib/utils";

interface Doctor {
  _id: string
  name: string
  specialization: string
  profileImage?: string
}

interface Message {
  _id: string
  sender: string
  receiver: string
  content: string
  createdAt: string
  status?: "sending" | "sent" | "delivered" | "read"
}

interface ChatPageProps {
  doctor: Doctor | null
  onBack?: () => void
}

const ChatPage: React.FC<ChatPageProps> = ({ doctor, onBack }) => {
  const { authToken, userId } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [doctorId, setDoctorId] = useState(doctor ? doctor._id : "")
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(doctor)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    fetchDoctors()
  }, [])

  useEffect(() => {
    if (userId && doctorId) {
      fetchMessages()
    }
  }, [userId, doctorId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (doctor && doctors.length > 0) {
      const foundDoctor = doctors.find((doc) => doc._id === doctor._id)
      if (foundDoctor) {
        setSelectedDoctor(foundDoctor)
      }
    }
  }, [doctor, doctors])

  const fetchDoctors = async () => {
    try {
      setIsLoading(true)
      const res = await axios.get("https://healthcare-backend-a66n.onrender.com/api/doctors/available")

      if (res.data && Array.isArray(res.data.doctors)) {
        setDoctors(res.data.doctors)

        // If doctor was passed as prop, find the full doctor object
        if (doctor) {
          const foundDoctor = res.data.doctors.find((doc: Doctor) => doc._id === doctor._id)
          if (foundDoctor) {
            setSelectedDoctor(foundDoctor)
          }
        }
      } else {
        setDoctors([])
        console.error("Doctors data is not an array:", res.data)
      }
    } catch (error) {
      console.error("Error fetching doctors", error)
      setDoctors([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMessages = async () => {
    if (!doctorId || !userId) return

    setIsLoading(true)
    // Ensure chatId always follows the same format
    const chatId = userId < doctorId ? `${userId}_${doctorId}` : `${doctorId}_${userId}`

    try {
      const res = await axios.get(`https://healthcare-backend-a66n.onrender.com/api/interactions/messages/${chatId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })

      if (Array.isArray(res.data)) {
        // Add status to messages
        const messagesWithStatus = res.data.map((msg: any) => ({
          ...msg,
          status: "delivered",
        }))
        setMessages(messagesWithStatus)
      } else {
        console.error("Messages response is not an array:", res.data)
        setMessages([])
      }
    } catch (error) {
      console.error("Error fetching messages", error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !doctorId || !userId) return

    // Create a temporary message with sending status
    const tempMessage: Message = {
      _id: Date.now().toString(),
      sender: userId,
      receiver: doctorId,
      content: newMessage,
      createdAt: new Date().toISOString(),
      status: "sending",
    }

    // Add to messages immediately for better UX
    setMessages((prev) => [...prev, tempMessage])
    setNewMessage("")

    // Focus back on input
    inputRef.current?.focus()

    try {
      setIsSending(true)
      const res = await axios.post(
        "https://healthcare-backend-a66n.onrender.com/api/interactions/messages",
        { sender: userId, receiver: doctorId, content: tempMessage.content },
        { headers: { Authorization: `Bearer ${authToken}` } },
      )

      // Replace temp message with actual message from server
      setMessages((prev) =>
        prev.map((msg) => (msg._id === tempMessage._id ? { ...res.data.data, status: "sent" } : msg)),
      )

      // Scroll to bottom
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    } catch (error) {
      console.error("Error sending message", error)

      // Mark the message as failed
      setMessages((prev) => prev.map((msg) => (msg._id === tempMessage._id ? { ...msg, status: "failed" } : msg)))
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleDoctorSelect = (docId: string) => {
    setDoctorId(docId)
    const selected = doctors.find((doc) => doc._id === docId)
    setSelectedDoctor(selected || null)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  const formatMessageTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "h:mm a")
    } catch (error) {
      return ""
    }
  }

  const renderMessageStatus = (status?: string) => {
    switch (status) {
      case "sending":
        return <Clock className="h-3 w-3 text-gray-400" />
      case "sent":
        return <span className="text-xs text-gray-400">✓</span>
      case "delivered":
        return <span className="text-xs text-gray-400">✓✓</span>
      case "read":
        return <span className="text-xs text-blue-500">✓✓</span>
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
      {/* Chat Header */}
      <div className="bg-white p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-1">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}

          {selectedDoctor ? (
            <>
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedDoctor.profileImage} alt={selectedDoctor.name} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(selectedDoctor.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">Dr. {selectedDoctor.name}</h2>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="text-xs text-gray-500">Online</span>
                  <Badge variant="outline" className="text-xs">
                    {selectedDoctor.specialization}
                  </Badge>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1">
              <h2 className="font-semibold">Healthcare Chat</h2>
              <p className="text-xs text-gray-500">Select a doctor to start chatting</p>
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Clear Chat</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Block Doctor</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Doctor Selection (if no doctor is passed) */}
      {!doctor && (
        <div className="p-4 bg-white border-b">
          <select
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={doctorId}
            onChange={(e) => handleDoctorSelect(e.target.value)}
          >
            <option value="">Select a Doctor</option>
            {Array.isArray(doctors) && doctors.length > 0 ? (
              doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name} - {doc.specialization}
                </option>
              ))
            ) : (
              <option disabled>No doctors available yet</option>
            )}
          </select>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {isLoading ? (
          // Loading skeletons
          <>
            <div className="flex justify-start">
              <div className="flex items-start gap-2 max-w-[80%]">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-20 w-64 rounded-lg" />
              </div>
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-16 w-48 rounded-lg" />
            </div>
            <div className="flex justify-start">
              <div className="flex items-start gap-2 max-w-[80%]">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-12 w-56 rounded-lg" />
              </div>
            </div>
          </>
        ) : messages.length > 0 ? (
          messages.map((msg, index) => {
            const isUser = msg.sender === userId
            const showAvatar = index === 0 || messages[index - 1].sender !== msg.sender

            return (
              <div key={msg._id} className={cn("flex items-end gap-2", isUser ? "justify-end" : "justify-start")}>
                {!isUser && showAvatar && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedDoctor?.profileImage} alt={selectedDoctor?.name || "Doctor"} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {selectedDoctor ? getInitials(selectedDoctor.name) : "DR"}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className={cn("max-w-[80%] group", isUser ? "order-1" : "order-2")}>
                  <div
                    className={cn(
                      "px-4 py-2 rounded-2xl",
                      isUser
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none",
                    )}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>

                  <div
                    className={cn(
                      "flex items-center mt-1 text-xs text-gray-500",
                      isUser ? "justify-end" : "justify-start",
                    )}
                  >
                    <span>{formatMessageTime(msg.createdAt)}</span>
                    {isUser && <span className="ml-1">{renderMessageStatus(msg.status)}</span>}
                  </div>
                </div>

                {isUser && showAvatar && (
                  <Avatar className="h-8 w-8 order-2">
                    <AvatarFallback className="bg-blue-100 text-blue-600">ME</AvatarFallback>
                  </Avatar>
                )}
              </div>
            )
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-8">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <Send className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No messages yet</h3>
            <p className="text-sm max-w-md">
              {doctorId
                ? "Start the conversation by sending a message to the doctor."
                : "Select a doctor from the dropdown to start a conversation."}
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full" disabled={!doctorId}>
            <Paperclip className="h-5 w-5 text-gray-500" />
          </Button>

          <Input
            ref={inputRef}
            type="text"
            className="flex-1"
            placeholder={doctorId ? "Type a message..." : "Select a doctor to start chatting"}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!doctorId || isSending}
          />

          <Button
            onClick={sendMessage}
            className="rounded-full"
            size="icon"
            disabled={!newMessage.trim() || !doctorId || isSending}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChatPage

