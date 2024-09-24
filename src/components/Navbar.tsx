'use client'

import * as React from "react"
import { Home, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
const Navbar = () => {

  const categories = ["Image converter"]

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
              <Home className="h-5 w-5 mr-2" />
              Home
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800 ml-4">
                  Categories
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 text-gray-100 border-gray-700">
                {categories.map((category) => (
                  <DropdownMenuItem key={category} className="hover:bg-gray-700 focus:bg-gray-700">
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
            About
          </Button>
        </div>
      </div>
    </nav>
  )
}
  export default Navbar;