"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Ship, MapPin, Fuel, DollarSign, Calculator, TrendingUp, X, Share2 } from "lucide-react"
import React from "react"
import { useToast, toast } from "@/components/ui/use-toast"

// Sample data - in a real app this would come from APIs
const ports = [
  // Asia
  { code: "CNSHA", name: "Shanghai", country: "China", lat: 31.2304, lng: 121.4737 },
  { code: "SGSIN", name: "Singapore", country: "Singapore", lat: 1.2966, lng: 103.7764 },
  { code: "CNNGB", name: "Ningbo-Zhoushan", country: "China", lat: 29.8683, lng: 121.5440 },
  { code: "CNSZX", name: "Shenzhen", country: "China", lat: 22.5431, lng: 114.0579 },
  { code: "CNGHZ", name: "Guangzhou", country: "China", lat: 23.1291, lng: 113.2644 },
  { code: "HKHKG", name: "Hong Kong", country: "China", lat: 22.3193, lng: 114.1694 },
  { code: "KRINC", name: "Incheon", country: "South Korea", lat: 37.4563, lng: 126.7052 },
  { code: "JPYOK", name: "Yokohama", country: "Japan", lat: 35.4437, lng: 139.6380 },
  { code: "JPKOB", name: "Kobe", country: "Japan", lat: 34.6901, lng: 135.1955 },
  { code: "TWKHH", name: "Kaohsiung", country: "Taiwan", lat: 22.6273, lng: 120.3014 },
  { code: "MYPEN", name: "Port Klang", country: "Malaysia", lat: 3.0000, lng: 101.4000 },
  { code: "IDTPP", name: "Tanjung Priok", country: "Indonesia", lat: -6.0850, lng: 106.8800 },
  { code: "INMUN", name: "Mumbai", country: "India", lat: 19.0760, lng: 72.8777 },
  { code: "INJNP", name: "Jawaharlal Nehru", country: "India", lat: 18.9490, lng: 72.9525 },
  { code: "INCHN", name: "Chennai", country: "India", lat: 13.0827, lng: 80.2707 },
  { code: "AEJEA", name: "Jebel Ali", country: "UAE", lat: 25.0089, lng: 55.0707 },
  { code: "AEDXB", name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708 },
  { code: "SAJED", name: "Jeddah", country: "Saudi Arabia", lat: 21.5433, lng: 39.1728 },
  { code: "QAWAK", name: "Hamad", country: "Qatar", lat: 25.2854, lng: 51.5310 },
  { code: "KWMKU", name: "Mubarak Al-Kabeer", country: "Kuwait", lat: 29.3759, lng: 47.9774 },

  // Europe
  { code: "NLRTM", name: "Rotterdam", country: "Netherlands", lat: 51.9244, lng: 4.4777 },
  { code: "BEANR", name: "Antwerp", country: "Belgium", lat: 51.2195, lng: 4.4024 },
  { code: "DEHAM", name: "Hamburg", country: "Germany", lat: 53.5511, lng: 9.9937 },
  { code: "ESVLC", name: "Valencia", country: "Spain", lat: 39.4699, lng: -0.3763 },
  { code: "ESALG", name: "Algeciras", country: "Spain", lat: 36.1408, lng: -5.4565 },
  { code: "GRPIR", name: "Piraeus", country: "Greece", lat: 37.9485, lng: 23.6425 },
  { code: "ITGIT", name: "Gioia Tauro", country: "Italy", lat: 38.4467, lng: 15.9033 },
  { code: "ITCAG", name: "Cagliari", country: "Italy", lat: 39.2238, lng: 9.1217 },
  { code: "FRFOS", name: "Fos-sur-Mer", country: "France", lat: 43.4377, lng: 4.9446 },
  { code: "GBFXT", name: "Felixstowe", country: "UK", lat: 51.9617, lng: 1.3512 },
  { code: "GBLON", name: "London Gateway", country: "UK", lat: 51.5074, lng: 0.1278 },
  { code: "GBSOU", name: "Southampton", country: "UK", lat: 50.9097, lng: -1.4044 },
  { code: "DKCPH", name: "Copenhagen", country: "Denmark", lat: 55.6761, lng: 12.5683 },
  { code: "SEGOT", name: "Gothenburg", country: "Sweden", lat: 57.7089, lng: 11.9746 },
  { code: "NOOSL", name: "Oslo", country: "Norway", lat: 59.9139, lng: 10.7522 },
  { code: "PLGDN", name: "Gdansk", country: "Poland", lat: 54.3520, lng: 18.6466 },
  { code: "PLGDY", name: "Gdynia", country: "Poland", lat: 54.5189, lng: 18.5305 },
  { code: "RUULU", name: "Ust-Luga", country: "Russia", lat: 59.6667, lng: 28.3000 },
  { code: "RUKAA", name: "Kaliningrad", country: "Russia", lat: 54.7104, lng: 20.4522 },
  { code: "TRIST", name: "Istanbul", country: "Turkey", lat: 41.0082, lng: 28.9784 },

  // North America
  { code: "USHOU", name: "Houston", country: "USA", lat: 29.7604, lng: -95.3698 },
  { code: "USNYC", name: "New York", country: "USA", lat: 40.7128, lng: -74.0060 },
  { code: "USLGB", name: "Long Beach", country: "USA", lat: 33.7701, lng: -118.1937 },
  { code: "USLAX", name: "Los Angeles", country: "USA", lat: 34.0522, lng: -118.2437 },
  { code: "USSAV", name: "Savannah", country: "USA", lat: 32.0809, lng: -81.0912 },
  { code: "USCHS", name: "Charleston", country: "USA", lat: 32.7765, lng: -79.9311 },
  { code: "USMIA", name: "Miami", country: "USA", lat: 25.7617, lng: -80.1918 },
  { code: "USSEA", name: "Seattle", country: "USA", lat: 47.6062, lng: -122.3321 },
  { code: "USTAC", name: "Tacoma", country: "USA", lat: 47.2529, lng: -122.4443 },
  { code: "USORF", name: "Norfolk", country: "USA", lat: 36.8508, lng: -76.2859 },
  { code: "CAVAN", name: "Vancouver", country: "Canada", lat: 49.2827, lng: -123.1207 },
  { code: "CAMTR", name: "Montreal", country: "Canada", lat: 45.5017, lng: -73.5673 },
  { code: "CAHAL", name: "Halifax", country: "Canada", lat: 44.6488, lng: -63.5752 },
  { code: "MXVER", name: "Veracruz", country: "Mexico", lat: 19.1738, lng: -96.1342 },
  { code: "MXMAN", name: "Manzanillo", country: "Mexico", lat: 19.0519, lng: -104.3158 },

  // South America
  { code: "BRRIO", name: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lng: -43.1729 },
  { code: "BRSAN", name: "Santos", country: "Brazil", lat: -23.9608, lng: -46.3339 },
  { code: "BRSSZ", name: "Suape", country: "Brazil", lat: -8.3942, lng: -34.9432 },
  { code: "ARBUE", name: "Buenos Aires", country: "Argentina", lat: -34.6037, lng: -58.3816 },
  { code: "CLVAP", name: "Valparaiso", country: "Chile", lat: -33.0472, lng: -71.6127 },
  { code: "PECLL", name: "Callao", country: "Peru", lat: -12.0464, lng: -77.0428 },
  { code: "COBUN", name: "Buenaventura", country: "Colombia", lat: 3.8801, lng: -77.0312 },
  { code: "ECGYE", name: "Guayaquil", country: "Ecuador", lat: -2.1894, lng: -79.8891 },
  { code: "UYMVD", name: "Montevideo", country: "Uruguay", lat: -34.9011, lng: -56.1645 },

  // Africa
  { code: "EGALY", name: "Alexandria", country: "Egypt", lat: 31.2001, lng: 29.9187 },
  { code: "EGPSD", name: "Port Said", country: "Egypt", lat: 31.2667, lng: 32.3000 },
  { code: "ZADUR", name: "Durban", country: "South Africa", lat: -29.8587, lng: 31.0218 },
  { code: "ZACPT", name: "Cape Town", country: "South Africa", lat: -33.9249, lng: 18.4241 },
  { code: "NGAPP", name: "Apapa", country: "Nigeria", lat: 6.4541, lng: 3.3947 },
  { code: "KEMBA", name: "Mombasa", country: "Kenya", lat: -4.0435, lng: 39.6682 },
  { code: "TZTZA", name: "Dar es Salaam", country: "Tanzania", lat: -6.7924, lng: 39.2083 },
  { code: "MAMAS", name: "Casablanca", country: "Morocco", lat: 33.5731, lng: -7.5898 },

  // Oceania
  { code: "AUBNE", name: "Brisbane", country: "Australia", lat: -27.4698, lng: 153.0251 },
  { code: "AUSYD", name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 },
  { code: "AUMEL", name: "Melbourne", country: "Australia", lat: -37.8136, lng: 144.9631 },
  { code: "AUFRE", name: "Fremantle", country: "Australia", lat: -32.0567, lng: 115.7478 },
  { code: "NZAKL", name: "Auckland", country: "New Zealand", lat: -36.8509, lng: 174.7645 },
  { code: "NZWLG", name: "Wellington", country: "New Zealand", lat: -41.2866, lng: 174.7756 },

  // --- Additional European & Med Ports ---
  { code: "FRLEH", name: "Le Havre", country: "France", lat: 49.4939, lng: 0.1079 },
  { code: "BEZEE", name: "Zeebrugge", country: "Belgium", lat: 51.3310, lng: 3.2010 },
  { code: "DEBRV", name: "Bremerhaven", country: "Germany", lat: 53.5396, lng: 8.5809 },
  { code: "RULED", name: "St. Petersburg", country: "Russia", lat: 59.9343, lng: 30.3351 },
  { code: "IEDUB", name: "Dublin", country: "Ireland", lat: 53.3498, lng: -6.2603 },
  { code: "FIHEL", name: "Helsinki", country: "Finland", lat: 60.1699, lng: 24.9384 },
  { code: "DKAAR", name: "Aarhus", country: "Denmark", lat: 56.1629, lng: 10.2039 },
  { code: "GBIMM", name: "Immingham", country: "UK", lat: 53.6150, lng: -0.1820 },
  { code: "GBTEE", name: "Teesport", country: "UK", lat: 54.6013, lng: -1.1380 },
  { code: "ESBIO", name: "Bilbao", country: "Spain", lat: 43.2630, lng: -2.9349 },
  { code: "PTLIS", name: "Lisbon", country: "Portugal", lat: 38.7223, lng: -9.1393 },
  { code: "PTSIE", name: "Sines", country: "Portugal", lat: 37.9561, lng: -8.8697 },
  { code: "PTSET", name: "Setubal", country: "Portugal", lat: 38.5244, lng: -8.8882 },
  { code: "ESBCN", name: "Barcelona", country: "Spain", lat: 41.3851, lng: 2.1734 },
  { code: "ESTAR", name: "Tarragona", country: "Spain", lat: 41.1189, lng: 1.2445 },
  { code: "ESCAR", name: "Cartagena", country: "Spain", lat: 37.6257, lng: -0.9966 },
  { code: "ITGOA", name: "Genoa", country: "Italy", lat: 44.4056, lng: 8.9463 },
  { code: "ITLSP", name: "La Spezia", country: "Italy", lat: 44.1025, lng: 9.8241 },
  { code: "ITLIV", name: "Livorno", country: "Italy", lat: 43.5485, lng: 10.3106 },
  { code: "ITTRS", name: "Trieste", country: "Italy", lat: 45.6495, lng: 13.7768 },
  { code: "ITVCE", name: "Venice", country: "Italy", lat: 45.4408, lng: 12.3155 },
  { code: "FRMRS", name: "Marseille", country: "France", lat: 43.2965, lng: 5.3698 },
  { code: "FRBOD", name: "Bordeaux", country: "France", lat: 44.8378, lng: -0.5792 },
  { code: "ITCIV", name: "Civitavecchia", country: "Italy", lat: 42.0924, lng: 11.7956 },
  { code: "MTMLA", name: "Valletta", country: "Malta", lat: 35.8989, lng: 14.5146 },
  { code: "GRSKG", name: "Thessaloniki", country: "Greece", lat: 40.6401, lng: 22.9444 },
  { code: "ROCND", name: "Constanta", country: "Romania", lat: 44.1598, lng: 28.6348 },
  { code: "BGBGS", name: "Burgas", country: "Bulgaria", lat: 42.5048, lng: 27.4626 },
  { code: "BGVAR", name: "Varna", country: "Bulgaria", lat: 43.2141, lng: 27.9147 },
  { code: "TRIZM", name: "Izmir", country: "Turkey", lat: 38.4192, lng: 27.1287 },
  { code: "TRMER", name: "Mersin", country: "Turkey", lat: 36.8121, lng: 34.6415 },
  { code: "TRALI", name: "Aliaga", country: "Turkey", lat: 38.7996, lng: 26.9723 },
  { code: "ILASH", name: "Ashdod", country: "Israel", lat: 31.8014, lng: 34.6435 },
  { code: "ILHFA", name: "Haifa", country: "Israel", lat: 32.7940, lng: 34.9896 },
  { code: "CYLMS", name: "Limassol", country: "Cyprus", lat: 34.7071, lng: 33.0226 },
  { code: "CYLCA", name: "Larnaca", country: "Cyprus", lat: 34.9003, lng: 33.6232 },
  { code: "DZALG", name: "Algiers", country: "Algeria", lat: 36.7538, lng: 3.0588 },
  { code: "DZSKI", name: "Skikda", country: "Algeria", lat: 36.8796, lng: 6.9063 },
  { code: "DZAAE", name: "Annaba", country: "Algeria", lat: 36.9040, lng: 7.7558 },
  { code: "TNTUN", name: "Tunis / La Goulette", country: "Tunisia", lat: 36.8065, lng: 10.1815 },
  { code: "TNRAD", name: "Rades", country: "Tunisia", lat: 36.7681, lng: 10.2753 },
  { code: "LYTIP", name: "Tripoli", country: "Libya", lat: 32.8872, lng: 13.1913 },
  { code: "LYMRA", name: "Misurata", country: "Libya", lat: 32.3754, lng: 15.0925 },
  { code: "SIKOP", name: "Koper", country: "Slovenia", lat: 45.5481, lng: 13.7300 },
  { code: "MEBAR", name: "Bar", country: "Montenegro", lat: 42.0970, lng: 19.1003 },
  { code: "ALDRZ", name: "Durres", country: "Albania", lat: 41.3231, lng: 19.4416 },
  { code: "HRSPU", name: "Split", country: "Croatia", lat: 43.5081, lng: 16.4402 },
  { code: "HRRJK", name: "Rijeka", country: "Croatia", lat: 45.3271, lng: 14.4422 },
  { code: "RUNVS", name: "Novorossiysk", country: "Russia", lat: 44.7234, lng: 37.7689 },
  { code: "UAODS", name: "Odessa", country: "Ukraine", lat: 46.4825, lng: 30.7233 },
]

// Vessel and cargo mapping based on Yieldstreet
const vesselCargoMap: { [key: string]: string[] } = {
  // Dry Bulk Carriers
  "Handysize": ["Iron Ore", "Coal", "Grains"],
  "Handymax": ["Iron Ore", "Coal", "Grains"],
  "Supramax": ["Iron Ore", "Coal", "Grains"],
  "Ultramax": ["Iron Ore", "Coal", "Grains"],
  "Panamax": ["Iron Ore", "Coal", "Grains"],
  "Kamsarmax": ["Iron Ore", "Coal", "Grains"],
  "Post-Panamax Bulk": ["Iron Ore", "Coal", "Grains"],
  "Capesize": ["Iron Ore", "Coal", "Grains"],
  // Tankers
  "Handysize Tanker": ["Crude Oil", "Diesel", "Gasoline"],
  "MR (Medium Range) Tanker": ["Crude Oil", "Diesel", "Gasoline"],
  "LR1 Tanker": ["Crude Oil", "Diesel", "Gasoline"],
  "Aframax": ["Crude Oil", "Diesel", "Gasoline"],
  "Suezmax": ["Crude Oil", "Diesel", "Gasoline"],
  "VLCC": ["Crude Oil", "Diesel", "Gasoline"],
  // Container Vessels
  "Feeder": ["Containers", "Consumer Goods", "Electronics"],
  "Intermediate": ["Containers", "Consumer Goods", "Electronics"],
  "Neo-Panamax": ["Containers", "Consumer Goods", "Electronics"],
  "Post-Panamax Container": ["Containers", "Consumer Goods", "Electronics"],
}

const vesselTypes = [
  // Dry Bulk
  { name: "Handysize", size: "15,000-35,000 DWT", category: "Dry Bulk", consumption: { laden: 18, ballast: 15 } },
  { name: "Handymax", size: "35,000-48,000 DWT", category: "Dry Bulk", consumption: { laden: 22, ballast: 18 } },
  { name: "Supramax", size: "48,000-60,000 DWT", category: "Dry Bulk", consumption: { laden: 25, ballast: 20 } },
  { name: "Ultramax", size: "60,000-65,000 DWT", category: "Dry Bulk", consumption: { laden: 28, ballast: 22 } },
  { name: "Panamax", size: "65,000-80,000 DWT", category: "Dry Bulk", consumption: { laden: 32, ballast: 25 } },
  { name: "Kamsarmax", size: "80,000-85,000 DWT", category: "Dry Bulk", consumption: { laden: 34, ballast: 27 } },
  { name: "Post-Panamax Bulk", size: "85,000-110,000 DWT", category: "Dry Bulk", consumption: { laden: 38, ballast: 30 } },
  { name: "Capesize", size: "110,000-200,000 DWT", category: "Dry Bulk", consumption: { laden: 45, ballast: 38 } },
  // Tankers
  { name: "Handysize Tanker", size: "10,000-40,000 DWT", category: "Tanker", consumption: { laden: 20, ballast: 16 } },
  { name: "MR (Medium Range) Tanker", size: "40,000-55,000 DWT", category: "Tanker", consumption: { laden: 24, ballast: 19 } },
  { name: "LR1 Tanker", size: "55,000-80,000 DWT", category: "Tanker", consumption: { laden: 28, ballast: 22 } },
  { name: "Aframax", size: "80,000-120,000 DWT", category: "Tanker", consumption: { laden: 45, ballast: 38 } },
  { name: "Suezmax", size: "120,000-200,000 DWT", category: "Tanker", consumption: { laden: 65, ballast: 55 } },
  { name: "VLCC", size: "200,000-320,000 DWT", category: "Tanker", consumption: { laden: 85, ballast: 75 } },
  // Container
  { name: "Feeder", size: "<3,000 TEU", category: "Container", consumption: { laden: 12, ballast: 10 } },
  { name: "Intermediate", size: "3,000-7,999 TEU", category: "Container", consumption: { laden: 18, ballast: 15 } },
  { name: "Neo-Panamax", size: "8,000-14,999 TEU", category: "Container", consumption: { laden: 28, ballast: 22 } },
  { name: "Post-Panamax Container", size: ">15,000 TEU", category: "Container", consumption: { laden: 38, ballast: 30 } },
]

// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3440.065 // Earth's radius in nautical miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// AutocompletePortInput: custom typeahead for port selection
const AutocompletePortInput = ({ value, onChange, className, inputRef, placeholder }: {
  value: string,
  onChange: (val: string) => void,
  className?: string,
  inputRef?: React.Ref<HTMLInputElement>,
  placeholder?: string
}) => {
  const [search, setSearch] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Filter ports only if 3+ chars
  const filteredPorts = search.length >= 3
    ? ports.filter(port =>
        port.name.toLowerCase().includes(search.toLowerCase()) ||
        port.code.toLowerCase().includes(search.toLowerCase()) ||
        port.country.toLowerCase().includes(search.toLowerCase())
      )
    : []

  // Handle outside click to close dropdown
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClick)
    } else {
      document.removeEventListener('mousedown', handleClick)
    }
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showDropdown])

  // When value changes externally, update search
  React.useEffect(() => {
    if (!value) {
      setSearch("")
    } else {
      const port = ports.find(p => p.code === value)
      setSearch(port ? port.name : value)
    }
  }, [value])

  return (
    <div ref={containerRef} className="relative w-full">
      <Input
        ref={inputRef}
        value={search}
        onChange={e => {
          setSearch(e.target.value)
          onChange("") // Clear selection until user picks
          setShowDropdown(true)
        }}
        onFocus={() => setShowDropdown(true)}
        placeholder={placeholder || "Type at least 3 letters..."}
        className={className + " !w-64 md:!w-64"}
        autoComplete="off"
        spellCheck={false}
      />
      {showDropdown && filteredPorts.length > 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredPorts.map(port => (
            <div
              key={port.code}
              className="px-4 py-2 cursor-pointer hover:bg-blue-50"
              onMouseDown={e => { e.preventDefault(); onChange(port.code); setSearch(port.name); setShowDropdown(false) }}
            >
              <div className="font-medium text-gray-900">{port.name}</div>
              <div className="text-xs text-gray-500">{port.country} ({port.code})</div>
            </div>
          ))}
        </div>
      )}
      {showDropdown && search.length >= 3 && filteredPorts.length === 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div className="px-4 py-2 text-gray-500 text-sm">No matching ports</div>
        </div>
      )}
    </div>
  )
}

export default function VoyageEstimator() {
  const { toast } = useToast()
  const [portsInRoute, setPortsInRoute] = useState<{ code: string, op: 'load' | 'discharge' | 'both' | 'none' }[]>([{ code: '', op: 'none' }, { code: '', op: 'none' }])
  const [loadPort, setLoadPort] = useState("")
  const [dischargePort, setDischargePort] = useState("")
  const [vesselType, setVesselType] = useState("")
  const [cargoType, setCargoType] = useState("")
  const [cargoQuantity, setCargoQuantity] = useState("")
  const [rateType, setRateType] = useState("")
  const [rate, setRate] = useState("")
  const [fuelPrice, setFuelPrice] = useState("")
  const [commission, setCommission] = useState("2.5")

  const [flatRate, setFlatRate] = useState("0.01")
  const [worldscaleYear, setWorldscaleYear] = useState("2025")
  const [fixedDiff, setFixedDiff] = useState("0.00")

  const [results, setResults] = useState<any>(null)

  // Add refs for required fields
  const cargoTypeRef = useRef<HTMLButtonElement>(null)
  const cargoQuantityRef = useRef<HTMLInputElement>(null)
  const rateRef = useRef<HTMLInputElement>(null)
  const fuelPriceRef = useRef<HTMLInputElement>(null)
  const vesselTypeRef = useRef<HTMLButtonElement>(null)
  const portsRefs = useRef<(HTMLButtonElement | null)[]>([])

  const [highlighted, setHighlighted] = useState<{ [key: string]: boolean }>({})

  const scrollToAndHighlight = (ref: HTMLElement | null, key: string) => {
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "center" })
      ref.focus()
      setHighlighted((h) => ({ ...h, [key]: true }))
    }
  }

  const clearHighlight = (key: string) => setHighlighted((h) => ({ ...h, [key]: false }))

  const addPort = () => setPortsInRoute([...portsInRoute, { code: '', op: 'none' }])
  const removePort = (idx: number) => setPortsInRoute(portsInRoute.length > 2 ? portsInRoute.filter((_, i) => i !== idx) : portsInRoute)
  const updatePortCode = (idx: number, value: string) => setPortsInRoute(portsInRoute.map((p, i) => i === idx ? { ...p, code: value } : p))
  const updatePortOp = (idx: number, op: 'load' | 'discharge' | 'both' | 'none') => setPortsInRoute(portsInRoute.map((p, i) => i === idx ? { ...p, op } : p))

  const resultsRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  const calculateVoyage = () => {
    // Validation: at least 2 ports, all codes filled, at least one load and one discharge
    if (portsInRoute.length < 2 || portsInRoute.some((p) => !p.code)) {
      const idx = portsInRoute.findIndex((p) => !p.code)
      scrollToAndHighlight(portsRefs.current[idx], `port${idx}`)
      return
    }
    if (!portsInRoute.some((p) => p.op === 'load' || p.op === 'both')) {
      scrollToAndHighlight(portsRefs.current[0], 'load')
      return
    }
    if (!portsInRoute.some((p) => p.op === 'discharge' || p.op === 'both')) {
      scrollToAndHighlight(portsRefs.current[0], 'discharge')
      return
    }
    if (!vesselType) {
      scrollToAndHighlight(vesselTypeRef.current, 'vesselType')
      return
    }
    if (!cargoType) {
      scrollToAndHighlight(cargoTypeRef.current, 'cargoType')
      return
    }
    if (!cargoQuantity) {
      scrollToAndHighlight(cargoQuantityRef.current, 'cargoQuantity')
      return
    }
    if (!rate) {
      scrollToAndHighlight(rateRef.current, 'rate')
      return
    }
    if (!fuelPrice) {
      scrollToAndHighlight(fuelPriceRef.current, 'fuelPrice')
      return
    }

    console.log('Calculate Voyage clicked')
    console.log('Required fields:', {
      portsInRoute,
      loadPort,
      dischargePort,
      vesselType,
      cargoType,
      cargoQuantity,
      rate,
      fuelPrice
    })

    if (
      portsInRoute.length < 2 ||
      portsInRoute.some((p) => !p.code) ||
      !portsInRoute.some((p) => p.op === 'load' || p.op === 'both') ||
      !portsInRoute.some((p) => p.op === 'discharge' || p.op === 'both') ||
      !vesselType ||
      !cargoType ||
      !cargoQuantity ||
      !rate ||
      !fuelPrice
    ) {
      console.log('Missing required fields')
      return
    }

    const selectedPorts = portsInRoute.map((p) => ports.find((port) => port.code === p.code)!)
    const ops = portsInRoute.map((p) => p.op)
    const selectedVessel = vesselTypes.find((v) => v.name === vesselType)!
    const selectedCargo = vesselType && cargoType ? vesselCargoMap[vesselType].find((c: string) => c === cargoType) : undefined

    // Calculate total distance and segment types
    let totalDistance = 0
    let ladenDistance = 0
    let ballastDistance = 0
    let isLaden = false

    for (let i = 0; i < selectedPorts.length - 1; i++) {
      const dist = calculateDistance(
        selectedPorts[i].lat,
        selectedPorts[i].lng,
        selectedPorts[i + 1].lat,
        selectedPorts[i + 1].lng,
      )
      totalDistance += dist
      // Determine if this segment is laden or ballast
      // If current port is a load or both, set isLaden true
      if (ops[i] === 'load' || ops[i] === 'both') isLaden = true
      // If current port is a discharge or both, set isLaden false after this segment
      if (isLaden) {
        ladenDistance += dist
      } else {
        ballastDistance += dist
      }
      if (ops[i] === 'discharge' || ops[i] === 'both') isLaden = false
    }

    // Calculate fuel consumption
    const ladenConsumption = (ladenDistance / 24 / 12) * selectedVessel.consumption.laden // Assuming 12 knots average speed
    const ballastConsumption = (ballastDistance / 24 / 12) * selectedVessel.consumption.ballast
    const totalFuelMT = ladenConsumption + ballastConsumption
    const fuelCost = totalFuelMT * Number.parseFloat(fuelPrice)

    // Calculate revenue
    let grossRevenue = 0
    const cargoQty = Number.parseFloat(cargoQuantity)

    if (rateType === "freight") {
      grossRevenue = cargoQty * Number.parseFloat(rate)
    } else if (rateType === "lumpsum") {
      grossRevenue = Number.parseFloat(rate)
    } else if (rateType === "worldscale") {
      // Worldscale calculation using flat rate and WS percentage
      const flatRateValue = Number.parseFloat(flatRate)
      const wsPercentage = Number.parseFloat(rate)
      const fixedDiffValue = Number.parseFloat(fixedDiff)
      grossRevenue = cargoQty * (flatRateValue * (wsPercentage / 100) + fixedDiffValue)
    }

    const commissionCost = grossRevenue * (Number.parseFloat(commission) / 100)
    const netRevenue = grossRevenue - commissionCost

    // Calculate voyage days automatically
    const speed = 12 // knots
    const voyageDaysNum = totalDistance / (speed * 24)

    // Calculate TCE
    const tce = (netRevenue - fuelCost) / voyageDaysNum

    setResults({
      totalDistance: Math.round(totalDistance),
      ladenDistance: Math.round(ladenDistance),
      ballastDistance: Math.round(ballastDistance),
      totalFuelMT: Math.round(totalFuelMT * 10) / 10,
      fuelCost: Math.round(fuelCost),
      grossRevenue: Math.round(grossRevenue),
      commissionCost: Math.round(commissionCost),
      netRevenue: Math.round(netRevenue),
      tce: Math.round(tce),
      voyageDays: Math.round(voyageDaysNum * 10) / 10,
      loadPortName: selectedPorts[0].name,
      dischargePortName: selectedPorts[selectedPorts.length - 1].name,
    })
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        resultsRef.current.focus()
      }
    }, 100)
  }

  // In the component, filter cargo types based on vesselType
  const filteredCargoTypes = vesselType ? vesselCargoMap[vesselType] || [] : []

  const resetForm = () => {
    setPortsInRoute([{ code: '', op: 'none' }, { code: '', op: 'none' }])
    setVesselType("")
    setCargoType("")
    setCargoQuantity("")
    setRateType("")
    setRate("")
    setFuelPrice("")
    setCommission("2.5")
    setFlatRate("0.01")
    setWorldscaleYear("2025")
    setFixedDiff("0.00")
    setResults(null)
    setTimeout(() => {
      if (headerRef.current) {
        headerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        headerRef.current.focus()
      }
    }, 100)
  }

  const generateShareableUrl = () => {
    const params = new URLSearchParams()
    
    // Add ports and their operations
    params.set('ports', JSON.stringify(portsInRoute))
    
    // Add other form values
    params.set('vesselType', vesselType)
    params.set('cargoType', cargoType)
    params.set('cargoQuantity', cargoQuantity)
    params.set('rateType', rateType)
    params.set('rate', rate)
    params.set('fuelPrice', fuelPrice)
    params.set('commission', commission)
    params.set('flatRate', flatRate)
    params.set('worldscaleYear', worldscaleYear)
    params.set('fixedDiff', fixedDiff)
    
    // Add results
    if (results) {
      params.set('results', JSON.stringify(results))
    }
    
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`
  }

  const handleShare = async () => {
    console.log('Share button clicked')
    const shareUrl = generateShareableUrl()
    console.log('Generated share URL:', shareUrl)
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Link copied!",
        description: "Share this link to show your voyage calculation",
      })
    } catch (err) {
      console.error('Clipboard error:', err)
      toast({
        title: "Failed to copy",
        description: "Please try copying the link manually",
        variant: "destructive",
      })
    }
  }

  // Add URL parameter handling
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    
    if (params.has('ports')) {
      try {
        const ports = JSON.parse(params.get('ports') || '[]')
        setPortsInRoute(ports)
      } catch (e) {
        console.error('Failed to parse ports from URL')
      }
    }
    
    if (params.has('vesselType')) setVesselType(params.get('vesselType') || '')
    if (params.has('cargoType')) setCargoType(params.get('cargoType') || '')
    if (params.has('cargoQuantity')) setCargoQuantity(params.get('cargoQuantity') || '')
    if (params.has('rateType')) setRateType(params.get('rateType') || '')
    if (params.has('rate')) setRate(params.get('rate') || '')
    if (params.has('fuelPrice')) setFuelPrice(params.get('fuelPrice') || '')
    if (params.has('commission')) setCommission(params.get('commission') || '')
    if (params.has('flatRate')) setFlatRate(params.get('flatRate') || '')
    if (params.has('worldscaleYear')) setWorldscaleYear(params.get('worldscaleYear') || '')
    if (params.has('fixedDiff')) setFixedDiff(params.get('fixedDiff') || '')

    let restoredResults = null
    if (params.has('results')) {
      try {
        restoredResults = JSON.parse(params.get('results') || '{}')
        setResults(restoredResults)
      } catch (e) {
        console.error('Failed to parse results from URL')
      }
    }

    // Scroll to results if present in URL
    setTimeout(() => {
      if (restoredResults && resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        resultsRef.current.focus()
      }
    }, 200)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-6" ref={headerRef} tabIndex={-1}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Ship className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Voyage Estimator</h1>
          </div>
          <p className="text-gray-600">Calculate TCE for your voyage</p>
        </div>

        {/* Route Selection */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5" />
              Route Planning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {portsInRoute.map((portObj, idx) => (
                <div key={idx} className="relative flex flex-col gap-2 w-full bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                  {/* Remove Port Button (X icon) */}
                  {portsInRoute.length > 2 && (
                    <button
                      type="button"
                      aria-label="Remove port"
                      onClick={() => removePort(idx)}
                      className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100 focus:bg-red-200 transition-colors border border-transparent focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </button>
                  )}
                  <Label className="text-xs">Port {idx + 1}</Label>
                  <AutocompletePortInput
                    value={portObj.code}
                    onChange={val => { updatePortCode(idx, val); clearHighlight(`port${idx}`) }}
                    className={`port-input-style${highlighted[`port${idx}`] ? ' ring-2 ring-red-500' : ''}`}
                    placeholder="Type at least 3 letters..."
                  />
                  <div className="flex flex-wrap gap-3 mt-1">
                    {['none', 'load', 'discharge', 'both'].map((op) => (
                      <label key={op} className="flex items-center gap-1 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name={`port-op-${idx}`}
                          value={op}
                          checked={portObj.op === op}
                          onChange={() => updatePortOp(idx, op as any)}
                          className="accent-blue-600"
                        />
                        {op.charAt(0).toUpperCase() + op.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <Button type="button" variant="secondary" onClick={addPort} className="mt-2">+ Add Port</Button>
            </div>
          </CardContent>
        </Card>

        {/* Vessel & Cargo */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Ship className="h-5 w-5" />
              Vessel & Cargo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs">Vessel Type</Label>
              <Select
                value={vesselType}
                onValueChange={(val) => { setVesselType(val); setCargoType(""); clearHighlight('vesselType') }}
              >
                <SelectTrigger
                  className={highlighted['vesselType'] ? 'ring-2 ring-red-500' : ''}
                  ref={vesselTypeRef}
                >
                  <SelectValue placeholder="Select vessel type" />
                </SelectTrigger>
                <SelectContent>
                  {vesselTypes.map((vessel) => (
                    <SelectItem key={vessel.name} value={vessel.name}>
                      {vessel.name} ({vessel.size})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Cargo Type</Label>
                <Select
                  value={cargoType}
                  onValueChange={(val) => { setCargoType(val); clearHighlight('cargoType') }}
                >
                  <SelectTrigger
                    className={highlighted['cargoType'] ? 'ring-2 ring-red-500' : ''}
                    ref={cargoTypeRef}
                  >
                    <SelectValue placeholder="Select cargo type (required)" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCargoTypes.map((cargo: string) => (
                      <SelectItem key={cargo} value={cargo}>
                        {cargo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Quantity (MT)</Label>
                <Input
                  type="number"
                  placeholder="50000"
                  value={cargoQuantity}
                  onChange={(e) => { setCargoQuantity(e.target.value); clearHighlight('cargoQuantity') }}
                  ref={cargoQuantityRef}
                  className={highlighted['cargoQuantity'] ? 'ring-2 ring-red-500' : ''}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rates & Costs */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5" />
              Rates & Costs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Calculation Type</Label>
                <Select value={rateType} onValueChange={setRateType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select calculation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="freight">Freight rate</SelectItem>
                    <SelectItem value="worldscale">Worldscale</SelectItem>
                    <SelectItem value="lumpsum">Lump sum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dynamic Rate Inputs */}
              {rateType === "lumpsum" && (
                <div>
                  <Label className="text-xs text-red-600">* Lump sum</Label>
                  <div className="flex">
                    <div className="bg-gray-100 border border-r-0 rounded-l-md px-3 py-2 text-sm text-gray-600">
                      USD
                    </div>
                    <Input
                      type="number"
                      placeholder="1,000,000.00"
                      value={rate}
                      onChange={(e) => { setRate(e.target.value); clearHighlight('rate') }}
                      ref={rateRef}
                      className={highlighted['rate'] ? 'ring-2 ring-red-500' : 'rounded-l-none'}
                    />
                  </div>
                </div>
              )}

              {rateType === "worldscale" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">* Worldscale rate</Label>
                      <div className="flex">
                        <div className="bg-gray-100 border border-r-0 rounded-l-md px-3 py-2 text-sm text-gray-600">
                          WS
                        </div>
                        <Input
                          type="number"
                          placeholder="100"
                          value={rate}
                          onChange={(e) => { setRate(e.target.value); clearHighlight('rate') }}
                          ref={rateRef}
                          className={highlighted['rate'] ? 'ring-2 ring-red-500' : 'rounded-l-none'}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">* Flat rate</Label>
                      <div className="flex">
                        <Input
                          type="number"
                          placeholder="0.01"
                          value={flatRate}
                          onChange={(e) => { setFlatRate(e.target.value); clearHighlight('flatRate') }}
                          className="rounded-r-none"
                        />
                        <div className="bg-gray-100 border border-l-0 rounded-r-md px-3 py-2 text-sm text-gray-600">
                          USD/mt
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Worldscale year</Label>
                      <Select value={worldscaleYear} onValueChange={setWorldscaleYear}>
                        <SelectTrigger>
                          <SelectValue placeholder="2025" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2025">2025</SelectItem>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2023">2023</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Fixed diff</Label>
                      <div className="flex">
                        <div className="bg-gray-100 border border-r-0 rounded-l-md px-3 py-2 text-sm text-gray-600">
                          USD
                        </div>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={fixedDiff}
                          onChange={(e) => { setFixedDiff(e.target.value); clearHighlight('fixedDiff') }}
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {rateType === "freight" && (
                <div>
                  <Label className="text-xs text-red-600">* Freight rate</Label>
                  <div className="flex">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={rate}
                      onChange={(e) => { setRate(e.target.value); clearHighlight('rate') }}
                      ref={rateRef}
                      className={highlighted['rate'] ? 'ring-2 ring-red-500' : 'rounded-r-none'}
                    />
                    <div className="bg-gray-100 border border-l-0 rounded-r-md px-3 py-2 text-sm text-gray-600">
                      USD/mt
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Fuel Price ($/MT)</Label>
                <Input
                  type="number"
                  placeholder="650"
                  value={fuelPrice}
                  onChange={(e) => { setFuelPrice(e.target.value); clearHighlight('fuelPrice') }}
                  ref={fuelPriceRef}
                  className={highlighted['fuelPrice'] ? 'ring-2 ring-red-500' : ''}
                />
              </div>
              <div>
                <Label className="text-xs">Commission (%)</Label>
                <Input
                  type="number"
                  placeholder="2.5"
                  value={commission}
                  onChange={(e) => setCommission(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calculate Button */}
        <Button onClick={calculateVoyage} className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700">
          <Calculator className="h-5 w-5 mr-2" />
          Calculate Voyage
        </Button>

        {/* Results */}
        {results && (
          <Card
            className="border-green-200 bg-green-50"
            ref={resultsRef}
            tabIndex={-1}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-green-800">
                <TrendingUp className="h-5 w-5" />
                Voyage Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Route Summary */}
              <div className="bg-white rounded-lg p-3">
                <h4 className="font-semibold text-sm mb-2">Route Summary</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Load:</span>
                    <span className="font-medium">{results.loadPortName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discharge:</span>
                    <span className="font-medium">{results.dischargePortName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Distance:</span>
                    <span className="font-medium">{results.totalDistance} nm</span>
                  </div>
                </div>
              </div>

              {/* Fuel Costs */}
              <div className="bg-white rounded-lg p-3">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                  <Fuel className="h-4 w-4" />
                  Fuel Analysis
                </h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Laden Distance:</span>
                    <span>{results.ladenDistance} nm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ballast Distance:</span>
                    <span>{results.ballastDistance} nm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Fuel:</span>
                    <span className="font-medium">{results.totalFuelMT} MT</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Fuel Cost:</span>
                    <span className="font-bold">${results.fuelCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Voyage Days:</span>
                    <span className="font-medium">{results.voyageDays}</span>
                  </div>
                </div>
                <div className="mt-3 p-2 rounded bg-blue-50 border border-blue-200 text-xs">
                  <div>
                    <span className="font-semibold">Calculation Details:</span>
                  </div>
                  <div>Speed used: <span className="font-mono">12 knots</span></div>
                  <div>
                    Daily consumption (laden):{" "}
                    <span className="font-mono">
                      {vesselTypes.find((v) => v.name === vesselType)?.consumption.laden ?? '-'} MT/day
                    </span>
                  </div>
                  <div>
                    Daily consumption (ballast):{" "}
                    <span className="font-mono">
                      {vesselTypes.find((v) => v.name === vesselType)?.consumption.ballast ?? '-'} MT/day
                    </span>
                  </div>
                  <div className="mt-1 text-gray-500">
                    <span className="font-semibold">Formula:</span> <br />
                    <span>
                      Fuel (MT) = (Laden nm / 24 / 12) × Laden MT/day + (Ballast nm / 24 / 12) × Ballast MT/day
                    </span>
                  </div>
                </div>
              </div>

              {/* Revenue */}
              <div className="bg-white rounded-lg p-3">
                <h4 className="font-semibold text-sm mb-2">Revenue Breakdown</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Gross Revenue:</span>
                    <span className="font-medium">${results.grossRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-orange-600">
                    <span>Commission:</span>
                    <span>-${results.commissionCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Net Revenue:</span>
                    <span className="font-bold">${results.netRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* TCE */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 text-white text-center">
                <div className="text-sm opacity-90 mb-1">Time Charter Equivalent</div>
                <div className="text-3xl font-bold">${results.tce.toLocaleString()}</div>
                <div className="text-sm opacity-90">per day</div>
                <Badge
                  variant={results.tce > 15000 ? "default" : results.tce > 10000 ? "secondary" : "destructive"}
                  className="mt-2"
                >
                  {results.tce > 15000 ? "Excellent" : results.tce > 10000 ? "Good" : "Poor"}
                </Badge>
                
                {/* Share Button */}
                <Button
                  onClick={handleShare}
                  className="mt-4 w-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  size="sm"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Results
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reset Form Button */}
        <Button
          className="w-full mt-4 bg-gray-200 text-gray-800 hover:bg-gray-300"
          onClick={resetForm}
          type="button"
        >
          Reset Form
        </Button>
      </div>
    </div>
  )
}
