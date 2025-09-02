"use client"

import { useState } from "react"
import { DirectorDashboard } from "@/components/director/director-dashboard"

const userData = {
  name: "Dr. Roberto Silva",
  title: "Director General",
  role: "director" as const,
  gender: "male",
}

export default function DirectorPage() {
  return <DirectorDashboard userData={userData} />
}