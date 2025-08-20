"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Upload, Camera, MapPin, Calendar, User, Brain, CheckCircle, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { LostItem } from "@/lib/types"

export default function LostFoundPage() {
  const [items, setItems] = useState<LostItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isReporting, setIsReporting] = useState(false)
  const [reportForm, setReportForm] = useState({
    title: "",
    description: "",
    location: "",
    contactInfo: "",
    type: "lost" as "lost" | "found",
  })

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await fetch("/api/lost-found-items")
        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Loaded items:", data.items)
          setItems(data.items || [])
        }
      } catch (error) {
        console.error("Failed to load items:", error)
      }
    }
    loadItems()
  }, [])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  const handleVisualSearch = async () => {
    if (!selectedImage) return

    setIsSearching(true)
    try {
      const formData = new FormData()
      formData.append("image", selectedImage)

      const response = await fetch("/api/visual-search", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Search failed")

      const results = await response.json()
      const matchedItems = items.filter((item) => results.matches.includes(item.id))
      setItems(matchedItems.length > 0 ? matchedItems : items)
    } catch (error) {
      console.error("Visual search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  // Enhanced report item handling with logging
  const handleReportItem = async () => {
    if (
      !reportForm.title ||
      !reportForm.description ||
      !reportForm.location ||
      !reportForm.contactInfo ||
      !selectedImage
    ) {
      alert("Please fill all fields and upload an image")
      return
    }

    setIsReporting(true)
    try {
      const formData = new FormData()
      formData.append("title", reportForm.title)
      formData.append("description", reportForm.description)
      formData.append("location", reportForm.location)
      formData.append("contactInfo", reportForm.contactInfo)
      formData.append("type", reportForm.type)
      formData.append("image", selectedImage)

      const response = await fetch("/api/report-item", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Report failed")

      const newItem = await response.json()
      console.log("[v0] New item reported:", newItem)
      setItems((prev) => [newItem, ...prev])
      setReportForm({ title: "", description: "", location: "", contactInfo: "", type: "lost" })
      setSelectedImage(null)
      alert("Item reported successfully!")
    } catch (error) {
      console.error("Report item error:", error)
      alert("Failed to report item. Please try again.")
    } finally {
      setIsReporting(false)
    }
  }

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const lostItems = filteredItems.filter((item) => item.status === "lost")
  const foundItems = filteredItems.filter((item) => item.status === "found")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">SRM IST AI Assistant</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Lost & Found</p>
                </div>
              </Link>
            </div>

          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Search className="h-8 w-8 text-green-500" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">SRM IST Lost & Found</h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upload real images of lost or found items from your device and connect with fellow SRM students.
          </p>
        </div>

        {/* Search & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Text Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Search className="h-5 w-5" />
                Text Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Search by item name, description, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Visual Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Camera className="h-5 w-5" />
                Visual Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input type="file" accept="image/*" onChange={handleImageUpload} />
              <Button onClick={handleVisualSearch} disabled={!selectedImage || isSearching} className="w-full">
                {isSearching ? "Searching..." : "Search by Image"}
              </Button>
            </CardContent>
          </Card>

          {/* Report Item */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Upload className="h-5 w-5" />
                Report Item
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">Report Lost/Found Item</Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Report an Item</DialogTitle>
                    <DialogDescription>
                      Upload a real photo and provide your contact details to help connect with other SRM students.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={reportForm.type === "lost" ? "default" : "outline"}
                        onClick={() => setReportForm((prev) => ({ ...prev, type: "lost" }))}
                      >
                        Lost Item
                      </Button>
                      <Button
                        variant={reportForm.type === "found" ? "default" : "outline"}
                        onClick={() => setReportForm((prev) => ({ ...prev, type: "found" }))}
                      >
                        Found Item
                      </Button>
                    </div>

                    <div>
                      <Label htmlFor="image" className="text-red-600">
                        Upload Image (Required) *
                      </Label>
                      <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} required />
                      {selectedImage && (
                        <p className="text-sm text-green-600 mt-1">✓ Image selected: {selectedImage.name}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="title">Item Title *</Label>
                      <Input
                        id="title"
                        value={reportForm.title}
                        onChange={(e) => setReportForm((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Black iPhone 14, Red Backpack"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={reportForm.description}
                        onChange={(e) => setReportForm((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Detailed description of the item..."
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="location">SRM Campus Location *</Label>
                      <Input
                        id="location"
                        value={reportForm.location}
                        onChange={(e) => setReportForm((prev) => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g., Library, CSE Block, Cafeteria, Hostel"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="contact">Your Contact Info *</Label>
                      <Input
                        id="contact"
                        value={reportForm.contactInfo}
                        onChange={(e) => setReportForm((prev) => ({ ...prev, contactInfo: e.target.value }))}
                        placeholder="Your email or WhatsApp number"
                        required
                      />
                    </div>

                    <Button
                      onClick={handleReportItem}
                      disabled={
                        isReporting ||
                        !selectedImage ||
                        !reportForm.title ||
                        !reportForm.description ||
                        !reportForm.location ||
                        !reportForm.contactInfo
                      }
                      className="w-full"
                    >
                      {isReporting ? "Uploading..." : "Report Item"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Items Display */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Items ({filteredItems.length})</TabsTrigger>
            <TabsTrigger value="lost">Lost Items ({lostItems.length})</TabsTrigger>
            <TabsTrigger value="found">Found Items ({foundItems.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items reported yet</h3>
                <p className="text-gray-600">Be the first to report a lost or found item!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="lost" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lostItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="found" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foundItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ItemCard({ item }: { item: LostItem }) {
  const formatDate = (dateValue: string | Date) => {
    const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
    return date.toLocaleDateString()
  }

  const handleContact = () => {
    const contactInfo = item.contactInfo
    if (contactInfo.includes("@")) {
      // Email contact
      window.open(`mailto:${contactInfo}?subject=Regarding ${item.title} - SRM Lost & Found`)
    } else if (contactInfo.match(/^\d+$/)) {
      // Phone number contact
      window.open(`tel:${contactInfo}`)
    } else {
      // Generic contact - copy to clipboard
      navigator.clipboard.writeText(contactInfo)
      alert(`Contact info copied: ${contactInfo}`)
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square relative">
        <Image
          src={item.imageUrl || "/placeholder.svg"}
          alt={item.title}
          fill
          className="object-cover"
          onError={(e) => {
            console.log("[v0] Image load error for:", item.title)
          }}
        />
        <Badge
          className={`absolute top-2 right-2 ${
            item.status === "lost" ? "bg-red-500" : item.status === "found" ? "bg-green-500" : "bg-blue-500"
          }`}
        >
          {item.status === "lost" ? "Lost" : item.status === "found" ? "Found" : "Claimed"}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{item.description}</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>{formatDate(item.dateReported)}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span>{item.reportedBy}</span>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button size="sm" className="flex-1" onClick={handleContact}>
            <Mail className="h-4 w-4 mr-1" />
            Contact
          </Button>
          {item.status !== "claimed" && (
            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
              <CheckCircle className="h-4 w-4 mr-1" />
              Claim
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
