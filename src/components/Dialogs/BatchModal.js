"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Mock data for trainers and courses
const trainers = ["Alice", "Bob", "Charlie", "Diana"]
const courses = ["Web Development", "App Development", "Python Development"]

export function BatchModal() {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Batch</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Batch</DialogTitle>
        </DialogHeader>
        <BatchForm />
      </DialogContent>
    </Dialog>
  )
}

function BatchForm({ className }) {
  return (
    <form className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="batch-name">Batch Name</Label>
        <Input required type="text" id="batch-name" placeholder="Enter batch name" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="merged">Merged</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="trainer">Trainer</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select trainer" />
          </SelectTrigger>
          <SelectContent>
            {trainers.map((trainer, index) => (
              <SelectItem key={index} value={trainer.toLowerCase()}>
                {trainer}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="students">No. of Students</Label>
        <Input required type="number" id="students" placeholder="Enter number of students" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="course">Course</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course, index) => (
              <SelectItem key={index} value={course.toLowerCase()}>
                {course}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Add Batch</Button>
    </form>
  )
}
