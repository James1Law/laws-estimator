"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Ship, MapPin, Fuel, DollarSign, Calculator, TrendingUp } from "lucide-react"

// Sample data - in a real app this would come from APIs
const ports = [
  { code: "USHOU", name: "Houston", country: "USA", lat: 29.7604, lng: -95.3698 },
  { code: "NLRTM", name: "Rotterdam", country: "Netherlands", lat: 51.9244, lng: 4.4777 },
  { code: "SGSIN", name: "Singapore", country: "Singapore", lat: 1.2966, lng: 103.7764 },
  { code: "AEDXB", name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708 },
  { code: "BRRIO", name: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lng: -43.1729 },
  { code: "CNSHA", name: "Shanghai", country: "China", lat: 31.2304, lng: 121.4737 },
  { code: "JPYOK", name: "Yokohama", country: "Japan", lat: 35.4437, lng: 139.638 },
  { code: "INMUN", name: "Mumbai", country: "India", lat: 19.076, lng: 72.8777 },
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

export default function VoyageEstimator() {
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
  const [voyageDays, setVoyageDays] = useState("14")

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

    // Calculate TCE
    const voyageDaysNum = Number.parseFloat(voyageDays)
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
    setVoyageDays("14")
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
                <div key={idx} className="flex items-center gap-2">
                  <Label className="text-xs">Port {idx + 1}</Label>
                  <Select
                    value={portObj.code}
                    onValueChange={(val) => { updatePortCode(idx, val); clearHighlight(`port${idx}`) }}
                  >
                    <SelectTrigger
                      className={`h-9 w-40${highlighted[`port${idx}`] ? ' ring-2 ring-red-500' : ''}`}
                      ref={(el) => { portsRefs.current[idx] = el }}
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {ports.map((port) => (
                        <SelectItem key={port.code} value={port.code}>
                          {port.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={portObj.op} onValueChange={(val) => updatePortOp(idx, val as any)}>
                    <SelectTrigger className="h-9 w-28">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="load">Load</SelectItem>
                      <SelectItem value="discharge">Discharge</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                  {portsInRoute.length > 2 && (
                    <Button type="button" size="icon" variant="outline" onClick={() => removePort(idx)}>
                      -
                    </Button>
                  )}
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

            <div>
              <Label className="text-xs">Voyage Days</Label>
              <Input
                type="number"
                placeholder="14"
                value={voyageDays}
                onChange={(e) => setVoyageDays(e.target.value)}
              />
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
