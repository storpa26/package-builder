/**
 * Ajax Hub 2 Page
 * 
 * This page displays information about the Ajax Hub 2 security control panel
 * with photo verification capabilities and comprehensive system features.
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Wifi, Smartphone, Battery, Clock, Users, CheckCircle, Star, Zap, Eye, Lock, Radio, Camera, Signal, Globe, Server, Cpu, AlertTriangle, Play, Pause, RotateCcw, Home, Siren, Puzzle } from 'lucide-react';

/**
 * Ajax Hub 2 Page Component
 * 
 * @returns {React.ReactElement} - Page component
 */
export default function AjaxStarterKit() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [selectedComponent, setSelectedComponent] = useState('hub2');
  const [photoDemo, setPhotoDemo] = useState({ isPlaying: false, currentPhoto: 0 });
  const [selectedProtocol, setSelectedProtocol] = useState('jeweller');

  // Photo verification demo
  const demoPhotos = [
    { id: 1, timestamp: '14:32:01', description: 'Motion detected in living room' },
    { id: 2, timestamp: '14:32:03', description: 'Person entering frame' },
    { id: 3, timestamp: '14:32:05', description: 'Clear view of intruder' },
    { id: 4, timestamp: '14:32:07', description: 'Movement towards exit' },
    { id: 5, timestamp: '14:32:09', description: 'Final verification shot' }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (photoDemo.isPlaying) {
      interval = setInterval(() => {
        setPhotoDemo(prev => ({
          ...prev,
          currentPhoto: (prev.currentPhoto + 1) % demoPhotos.length
        }));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [photoDemo.isPlaying, demoPhotos.length]);

  const heroFeatures = [
    {
      icon: <Camera className="h-6 w-6" />,
      title: "Photo Verification",
      description: "1-5 photos delivered in under 9 seconds",
      highlight: true
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "OS Malevich",
      description: "Virus-immune real-time operating system"
    },
    {
      icon: <Signal className="h-6 w-6" />,
      title: "Dual Protocols",
      description: "Jeweller + Wings for complete coverage"
    }
  ];

  const hub2Components = {
    hub2: {
      name: "Ajax Hub 2",
      subtitle: "Intelligent Security Control Panel",
      icon: Server,
      image: "/api/placeholder/400/300",
      features: ["Photo Verification", "OS Malevich", "Dual Protocols", "100 Devices"],
      specs: {
        "Communication": "Jeweller + Wings protocols",
        "Range": "Up to 2000m (Jeweller), 1000m (Wings)",
        "Capacity": "100 devices, 50 users, 25 rooms",
        "Power": "110-240V AC, 6h backup battery"
      }
    },
    motioncam: {
      name: "MotionCam",
      subtitle: "Motion Detector with Photo Verification",
      icon: Camera,
      image: "/api/placeholder/400/300",
      features: ["Photo Verification", "12m Detection", "Pet Immunity", "Night Vision"],
      specs: {
        "Detection Range": "Up to 12m",
        "Photo Delivery": "1-5 photos in 9 seconds",
        "Pet Immunity": "Up to 20kg",
        "Battery Life": "Up to 4 years"
      }
    },
    doorprotect: {
      name: "DoorProtect Plus",
      subtitle: "Door/Window Sensor with Tilt Detection",
      icon: Shield,
      image: "/api/placeholder/400/300",
      features: ["Magnetic + Tilt", "Tamper Protection", "7-Year Battery", "Jeweller Protocol"],
      specs: {
        "Detection Method": "Magnetic contact + tilt sensor",
        "Battery Life": "Up to 7 years",
        "Range": "Up to 1700m",
        "Operating Temperature": "-25°C to +60°C"
      }
    },
    keypad: {
      name: "KeyPad TouchScreen",
      subtitle: "Wireless Touch Keypad",
      icon: Smartphone,
      image: "/api/placeholder/400/300",
      features: ["Touch Screen", "RFID Cards", "Duress Code", "Night Backlight"],
      specs: {
        "Display": "2.4\" TFT color display",
        "Power": "4 × CR123A batteries",
        "Battery Life": "Up to 2 years",
        "Cards Supported": "Up to 100 RFID cards"
      }
    }
  };
  const hub2Product = {
    name: "Ajax Hub 2",
    description: "Professional security control panel with photo verification capabilities and virus-immune OS Malevich operating system.",
    keyFeatures: [
      "Photo verification in under 9 seconds",
      "OS Malevich - virus-immune operating system",
      "Dual radio protocols (Jeweller + Wings)",
      "Supports up to 100 devices and 50 users",
      "Multiple communication channels",
      "Professional monitoring integration"
    ],
    specifications: {
      "Communication Protocols": "Jeweller (868.0-868.6 MHz), Wings (868.7-869.2 MHz)",
      "Radio Range": "Up to 2000m (Jeweller), 1000m (Wings)",
      "Device Capacity": "100 devices, 50 users, 25 rooms, 50 scenarios",
      "Power Supply": "110-240V AC, 6-hour backup battery",
      "Connectivity": "Ethernet, 2G/4G SIM, Wi-Fi (Hub 2 Plus)",
      "Operating System": "OS Malevich with OTA updates",
      "Photo Verification": "1-5 photos delivered in 9 seconds",
      "Encryption": "AES-128 + Malevich encryption",
      "Operating Temperature": "-10°C to +40°C",
      "Dimensions": "163 × 163 × 36 mm"
    }
  };

  const communicationProtocols = {
    jeweller: {
      name: "Jeweller Protocol",
      frequency: "868.0-868.6 MHz",
      range: "Up to 2000m",
      features: ["Encrypted communication", "Anti-jamming", "Two-way communication", "Battery monitoring"],
      description: "Primary protocol for security devices with maximum range and reliability"
    },
    wings: {
      name: "Wings Protocol", 
      frequency: "868.7-869.2 MHz",
      range: "Up to 1000m",
      features: ["Photo transmission", "High data rate", "MotionCam support", "Optimized for media"],
      description: "Specialized protocol for photo verification and high-bandwidth devices"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                  <Camera className="h-3 w-3 mr-1" />
                  Photo Verification Technology
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Ajax Hub 2
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Professional security control panel with revolutionary photo verification. 
                  Get 1-5 photos delivered in under 9 seconds with virus-immune OS Malevich.
                </p>
              </div>
              
              <div className="grid sm:grid-cols-3 gap-4">
                {heroFeatures.map((feature, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                      feature.highlight 
                        ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20' 
                        : 'bg-card/50 border-border hover:border-primary/30'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                      feature.highlight ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                    }`}>
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                  Get Professional Quote
                </Button>
                <Button variant="outline" size="lg" className="px-8">
                  See Photo Demo
                </Button>
              </div>

              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-3">Trusted by security professionals</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm font-medium">4.9/5 from 2,847 reviews</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <Card className="overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-card to-card/50">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        Photo Verification Demo
                      </CardTitle>
                      <CardDescription>Real-time intrusion detection</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPhotoDemo(prev => ({ ...prev, isPlaying: !prev.isPlaying }))}
                      >
                        {photoDemo.isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPhotoDemo({ isPlaying: false, currentPhoto: 0 })}
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Photo Display */}
                    <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                      <div className="text-center z-10">
                        <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm font-medium">Photo {photoDemo.currentPhoto + 1} of {demoPhotos.length}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {demoPhotos[photoDemo.currentPhoto]?.timestamp}
                        </p>
                      </div>
                      {photoDemo.isPlaying && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium animate-pulse">
                          LIVE
                        </div>
                      )}
                    </div>

                    {/* Photo Description */}
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm font-medium mb-1">Detection Event</p>
                      <p className="text-xs text-muted-foreground">
                        {demoPhotos[photoDemo.currentPhoto]?.description}
                      </p>
                    </div>

                    {/* Timeline */}
                    <div className="flex justify-between items-center">
                      {demoPhotos.map((photo, index) => (
                        <div
                          key={photo.id}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index <= photoDemo.currentPhoto ? 'bg-primary' : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border/50">
                      <div className="text-center">
                        <p className="text-lg font-bold text-primary">&lt; 9s</p>
                        <p className="text-xs text-muted-foreground">Delivery Time</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-primary">1-5</p>
                        <p className="text-xs text-muted-foreground">Photos</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-primary">100%</p>
                        <p className="text-xs text-muted-foreground">Verified</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Verification Technology Section */}
      <section className="py-16 bg-gradient-to-br from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-4">
              <Camera className="h-3 w-3 mr-1" />
              Revolutionary Technology
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Photo Verification in Action
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how Ajax Hub 2 delivers instant photo verification when motion is detected. 
              Get visual confirmation of every alarm in under 9 seconds.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Interactive Demo */}
            <div className="order-2 lg:order-1">
              <Card className="overflow-hidden shadow-xl">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Live Detection Sequence
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={photoDemo.isPlaying ? "default" : "outline"}
                        onClick={() => setPhotoDemo(prev => ({ ...prev, isPlaying: !prev.isPlaying }))}
                      >
                        {photoDemo.isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                        {photoDemo.isPlaying ? 'Pause' : 'Play'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPhotoDemo({ isPlaying: false, currentPhoto: 0 })}
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Photo Viewer */}
                  <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
                    
                    {/* Simulated Camera View */}
                    <div className="absolute inset-4 border-2 border-white/20 rounded-lg flex items-center justify-center">
                      <div className="text-center text-white">
                        <Camera className="h-16 w-16 mx-auto mb-4 opacity-60" />
                        <div className="space-y-2">
                          <p className="text-lg font-semibold">
                            Detection #{photoDemo.currentPhoto + 1}
                          </p>
                          <p className="text-sm opacity-80">
                            {demoPhotos[photoDemo.currentPhoto]?.timestamp}
                          </p>
                          <p className="text-xs opacity-60 max-w-48">
                            {demoPhotos[photoDemo.currentPhoto]?.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Indicators */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        photoDemo.isPlaying ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-500 text-white'
                      }`}>
                        {photoDemo.isPlaying ? 'RECORDING' : 'STANDBY'}
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 text-white text-xs font-mono">
                      {demoPhotos[photoDemo.currentPhoto]?.timestamp}
                    </div>

                    {/* Progress Timeline */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex justify-between items-center mb-2">
                        {demoPhotos.map((photo, index) => (
                          <div
                            key={photo.id}
                            className={`w-3 h-3 rounded-full transition-all duration-500 ${
                              index <= photoDemo.currentPhoto 
                                ? 'bg-primary shadow-lg shadow-primary/50' 
                                : 'bg-white/30'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="bg-white/20 rounded-full h-1 overflow-hidden">
                        <div 
                          className="bg-primary h-full transition-all duration-500"
                          style={{ width: `${((photoDemo.currentPhoto + 1) / demoPhotos.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Photo Info Panel */}
                  <div className="p-4 bg-muted/30">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {photoDemo.currentPhoto + 1}/{demoPhotos.length}
                        </p>
                        <p className="text-xs text-muted-foreground">Photos Captured</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {photoDemo.isPlaying ? '< 9s' : '0s'}
                        </p>
                        <p className="text-xs text-muted-foreground">Delivery Time</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">100%</p>
                        <p className="text-xs text-muted-foreground">Verification Rate</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Features List */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">How Photo Verification Works</h3>
                <p className="text-muted-foreground">
                  When motion is detected, MotionCam devices automatically capture and transmit 
                  high-quality photos to your Ajax Hub 2 using the Wings protocol.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    step: "1",
                    title: "Motion Detection",
                    description: "MotionCam detects movement and triggers photo capture",
                    icon: <AlertTriangle className="h-5 w-5" />
                  },
                  {
                    step: "2", 
                    title: "Instant Capture",
                    description: "1-5 high-resolution photos captured automatically",
                    icon: <Camera className="h-5 w-5" />
                  },
                  {
                    step: "3",
                    title: "Rapid Transmission",
                    description: "Photos transmitted via Wings protocol in under 9 seconds",
                    icon: <Signal className="h-5 w-5" />
                  },
                  {
                    step: "4",
                    title: "Instant Verification",
                    description: "Visual confirmation sent to your phone and monitoring center",
                    icon: <Smartphone className="h-5 w-5" />
                  }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-lg bg-card/50 border border-border/50">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">{item.step}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-primary">{item.icon}</div>
                        <h4 className="font-semibold">{item.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Why Photo Verification Matters</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Eliminate false alarms and get instant visual confirmation of security events. 
                  Perfect for insurance claims and police response prioritization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications & Communication Protocols */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-4">
              <Cpu className="h-3 w-3 mr-1" />
              Technical Excellence
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Advanced Communication Protocols
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ajax Hub 2 features dual radio protocols for maximum reliability and performance. 
              Jeweller for security devices, Wings for photo verification.
            </p>
          </div>

          {/* Protocol Selector */}
          <div className="flex justify-center mb-8">
            <div className="bg-muted/50 p-1 rounded-lg">
              {Object.entries(communicationProtocols).map(([key, protocol]) => (
                <Button
                  key={key}
                  variant={selectedProtocol === key ? "default" : "ghost"}
                  onClick={() => setSelectedProtocol(key)}
                  className="mx-1"
                >
                  <Radio className="h-4 w-4 mr-2" />
                  {protocol.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Protocol Details */}
            <div className="space-y-6">
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                  <CardTitle className="flex items-center gap-2">
                    <Signal className="h-5 w-5" />
                    {communicationProtocols[selectedProtocol].name}
                  </CardTitle>
                  <CardDescription>
                    {communicationProtocols[selectedProtocol].description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-sm text-muted-foreground mb-1">Frequency</p>
                        <p className="font-semibold">{communicationProtocols[selectedProtocol].frequency}</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-sm text-muted-foreground mb-1">Range</p>
                        <p className="font-semibold">{communicationProtocols[selectedProtocol].range}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Key Features</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {communicationProtocols[selectedProtocol].features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Range Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Communication Range</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-lg overflow-hidden">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-4 h-4 bg-primary rounded-full ml-4 shadow-lg"></div>
                        <div className="flex-1 text-center">
                          <p className="text-sm font-medium">Hub 2</p>
                        </div>
                        <div className="w-4 h-4 bg-secondary rounded-full mr-4 shadow-lg"></div>
                      </div>
                      <div className="absolute bottom-2 left-4 right-4 text-center">
                        <p className="text-xs text-muted-foreground">
                          {selectedProtocol === 'jeweller' ? 'Up to 2000m range' : 'Up to 1000m range'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Hub 2 Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {Object.entries(hub2Product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-start py-2 border-b border-border/50 last:border-0">
                        <span className="text-sm text-muted-foreground font-medium">{key}</span>
                        <span className="text-sm font-semibold text-right max-w-48">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Capacity Showcase */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    System Capacity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { label: "Devices", value: 100, max: 100, color: "bg-primary" },
                      { label: "Users", value: 50, max: 50, color: "bg-secondary" },
                      { label: "Rooms", value: 25, max: 25, color: "bg-green-500" },
                      { label: "Scenarios", value: 50, max: 50, color: "bg-blue-500" }
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{item.label}</span>
                          <span className="text-muted-foreground">Up to {item.value}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${item.color} transition-all duration-1000`}
                            style={{ width: `${(item.value / item.max) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Components Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Complete Security Kit Components
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Each component works seamlessly together to create an impenetrable security ecosystem
            </p>
          </div>

          {/* Device Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: Shield, label: "Security", count: "25+ devices", color: "text-red-500" },
               { icon: Camera, label: "Cameras", count: "15+ models", color: "text-blue-500" },
               { icon: Home, label: "Automation", count: "20+ devices", color: "text-green-500" },
               { icon: Siren, label: "Sirens", count: "10+ options", color: "text-orange-500" }
            ].map((category, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <category.icon className={`h-8 w-8 mx-auto mb-3 ${category.color}`} />
                <h3 className="font-semibold mb-1">{category.label}</h3>
                <p className="text-sm text-muted-foreground">{category.count}</p>
              </Card>
            ))}
          </div>

          {/* Interactive Device Showcase */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Device Selector */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Compatible Devices</CardTitle>
                  <CardDescription>
                    Select a component to view details
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {Object.entries(hub2Components).map(([key, component]) => (
                      <Button
                        key={key}
                        variant={selectedComponent === key ? "secondary" : "ghost"}
                        onClick={() => setSelectedComponent(key)}
                        className="w-full justify-start p-4 h-auto"
                      >
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                             {React.createElement(component.icon, { className: "h-5 w-5" })}
                           </div>
                          <div className="text-left">
                            <p className="font-medium">{component.name}</p>
                            <p className="text-xs text-muted-foreground">{component.subtitle}</p>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Selected Device Details */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                       {React.createElement(hub2Components[selectedComponent].icon, { className: "h-6 w-6 text-primary" })}
                     </div>
                    <div>
                      <CardTitle>{hub2Components[selectedComponent].name}</CardTitle>
                      <CardDescription>{hub2Components[selectedComponent].subtitle}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Device Image */}
                   <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted rounded-lg flex items-center justify-center">
                     {React.createElement(hub2Components[selectedComponent].icon, { className: "h-16 w-16 text-muted-foreground/50" })}
                   </div>

                  {/* Key Features */}
                  <div>
                    <h4 className="font-semibold mb-3">Key Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {hub2Components[selectedComponent].features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technical Specs */}
                  <div>
                    <h4 className="font-semibold mb-3">Specifications</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(hub2Components[selectedComponent].specs).map(([key, value]) => (
                        <div key={key} className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">{key}</p>
                          <p className="text-sm font-medium">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Expansion Benefits */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Easy Installation",
                description: "Add new devices in minutes with wireless connectivity and guided setup"
              },
              {
                icon: Smartphone,
                title: "Unified Control",
                description: "Manage all devices from a single Ajax app with intuitive controls"
              },
              {
                icon: Shield,
                title: "Enhanced Security",
                description: "Each device adds another layer of protection to your security system"
              }
            ].map((benefit, index) => (
              <Card key={index} className="text-center p-6">
                <benefit.icon className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* OS Malevich Security Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-4">
              <Server className="h-3 w-3 mr-1" />
              OS Malevich
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Military-Grade Operating System
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built on OS Malevich, Ajax Hub 2 delivers enterprise-level security with 
              automatic updates, virus protection, and advanced threat detection.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Security Features */}
            <div className="space-y-6">
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-red-500/10 to-orange-500/10">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-500" />
                    Advanced Security
                  </CardTitle>
                  <CardDescription>
                    Multi-layered protection against cyber threats
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { icon: Lock, title: "AES-128 Encryption", description: "Military-grade encryption for all communications" },
                      { icon: Eye, title: "Intrusion Detection", description: "Real-time monitoring for unauthorized access attempts" },
                      { icon: AlertTriangle, title: "Anti-Jamming", description: "Frequency-hopping technology prevents signal interference" },
                      { icon: Zap, title: "Tamper Protection", description: "Physical security alerts for device manipulation" }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                        <feature.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-sm">{feature.title}</h4>
                          <p className="text-xs text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-500" />
                    Over-The-Air Updates
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">System Status</span>
                      </div>
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">Up to Date</span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p>• Automatic security patches</p>
                      <p>• New feature rollouts</p>
                      <p>• Performance optimizations</p>
                      <p>• Zero downtime updates</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Architecture */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    System Architecture
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Architecture Diagram */}
                    <div className="relative">
                      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-6">
                        <div className="grid grid-cols-3 gap-4 items-center">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-primary rounded-lg mx-auto mb-2 flex items-center justify-center">
                              <Shield className="h-6 w-6 text-white" />
                            </div>
                            <p className="text-xs font-medium">Security Layer</p>
                          </div>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-secondary rounded-lg mx-auto mb-2 flex items-center justify-center">
                              <Server className="h-6 w-6 text-white" />
                            </div>
                            <p className="text-xs font-medium">OS Malevich</p>
                          </div>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-green-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                              <Radio className="h-6 w-6 text-white" />
                            </div>
                            <p className="text-xs font-medium">Communication</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-primary mb-1">99.9%</div>
                        <div className="text-xs text-muted-foreground">Uptime</div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-secondary mb-1">&lt;1s</div>
                        <div className="text-xs text-muted-foreground">Response Time</div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-500 mb-1">256-bit</div>
                        <div className="text-xs text-muted-foreground">Encryption</div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-500 mb-1">24/7</div>
                        <div className="text-xs text-muted-foreground">Monitoring</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Threat Protection
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {[
                      { threat: "DDoS Attacks", status: "Protected", color: "text-green-500" },
                      { threat: "Signal Jamming", status: "Mitigated", color: "text-green-500" },
                      { threat: "Physical Tampering", status: "Detected", color: "text-blue-500" },
                      { threat: "Unauthorized Access", status: "Blocked", color: "text-red-500" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/30">
                        <span className="text-sm font-medium">{item.threat}</span>
                        <span className={`text-xs font-semibold ${item.color}`}>{item.status}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Integration & Camera Support */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-4">
              <Camera className="h-3 w-3 mr-1" />
              Integration Ready
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Seamless Camera Integration
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect IP cameras from leading manufacturers with RTSP support. 
              View live feeds, receive photo verification, and manage everything from one app.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Camera Brands */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Compatible Camera Brands
                  </CardTitle>
                  <CardDescription>
                    Works with major IP camera manufacturers
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: "Hikvision", supported: true },
                      { name: "Dahua", supported: true },
                      { name: "Axis", supported: true },
                      { name: "Bosch", supported: true },
                      { name: "Uniview", supported: true },
                      { name: "Hanwha", supported: true },
                      { name: "Vivotek", supported: true },
                      { name: "Generic RTSP", supported: true }
                    ].map((brand, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm font-medium">{brand.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Integration Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { 
                        icon: Eye, 
                        title: "Live Video Streaming", 
                        description: "Real-time camera feeds in Ajax app",
                        status: "Available"
                      },
                      { 
                        icon: Camera, 
                        title: "Photo Verification", 
                        description: "Instant photos on alarm triggers",
                        status: "Available"
                      },
                      { 
                        icon: Server, 
                        title: "RTSP Protocol", 
                        description: "Standard protocol support",
                        status: "Supported"
                      },
                      { 
                        icon: Smartphone, 
                        title: "Mobile Access", 
                        description: "View cameras from anywhere",
                        status: "Included"
                      }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                        <feature.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-sm">{feature.title}</h4>
                            <span className="text-xs text-green-600 font-medium">{feature.status}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Integration Setup */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Easy Setup Process
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { 
                        step: 1, 
                        title: "Connect Camera", 
                        description: "Add IP camera to your network",
                        icon: Camera
                      },
                      { 
                        step: 2, 
                        title: "Configure RTSP", 
                        description: "Enter camera RTSP stream URL",
                        icon: Globe
                      },
                      { 
                        step: 3, 
                        title: "Link to Hub", 
                        description: "Connect camera to Ajax Hub 2",
                        icon: Radio
                      },
                      { 
                        step: 4, 
                        title: "Test & Verify", 
                        description: "Confirm live feed and alerts",
                        icon: CheckCircle
                      }
                    ].map((step, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                          <p className="text-xs text-muted-foreground">{step.description}</p>
                        </div>
                        <step.icon className="h-5 w-5 text-muted-foreground mt-1" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Technical Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { label: "Supported Cameras", value: "Up to 100 IP cameras" },
                      { label: "Video Resolution", value: "Up to 4K (3840×2160)" },
                      { label: "Streaming Protocol", value: "RTSP/RTP" },
                      { label: "Video Codecs", value: "H.264, H.265, MJPEG" },
                      { label: "Recording", value: "Cloud & Local NVR" },
                      { label: "Mobile Viewing", value: "iOS & Android apps" }
                    ].map((spec, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                        <span className="text-sm text-muted-foreground">{spec.label}</span>
                        <span className="text-sm font-semibold">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Integration Benefits */}
          <div className="mt-12 grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Eye,
                title: "Visual Verification",
                description: "See what triggered the alarm with instant photos"
              },
              {
                icon: Smartphone,
                title: "Remote Monitoring",
                description: "Access live feeds from anywhere in the world"
              },
              {
                icon: Shield,
                title: "Enhanced Security",
                description: "Combine motion detection with visual confirmation"
              },
              {
                icon: Zap,
                title: "Quick Response",
                description: "Faster emergency response with visual evidence"
              }
            ].map((benefit, index) => (
              <Card key={index} className="text-center p-6">
                <benefit.icon className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Ajax Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Why Security Professionals Choose Ajax
            </h2>
            <p className="text-xl text-muted-foreground">
              Trusted by over 2 million users worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Shield className="h-8 w-8" />, title: "Military-Grade Encryption", desc: "Bank-level security protocols" },
              { icon: <Zap className="h-8 w-8" />, title: "Lightning Fast Setup", desc: "Professional installation in 30 minutes" },
              { icon: <Battery className="h-8 w-8" />, title: "7-Year Battery Life", desc: "Maintenance-free operation" },
              { icon: <Smartphone className="h-8 w-8" />, title: "Smart App Control", desc: "Complete remote management" }
            ].map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="text-primary mb-4 flex justify-center">{item.icon}</div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <CardContent className="p-8 lg:p-12 text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Ready to Secure Your Property?
              </h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Join millions of satisfied customers who trust Ajax for their security needs. 
                Professional installation and lifetime support included.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="px-8">
                  Get Professional Quote
                </Button>
                <Button size="lg" variant="outline" className="px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  Schedule Consultation
                </Button>
              </div>
              <div className="mt-8 pt-8 border-t border-primary-foreground/20">
                <p className="text-sm opacity-75">
                  ✓ Free professional consultation ✓ 30-day money-back guarantee ✓ Lifetime technical support
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}