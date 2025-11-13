import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { ArrowLeft, ExternalLink, BookOpen, FileText, Video, Code, Users, GraduationCap } from "lucide-react";

const Resources = () => {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary via-primary-light to-secondary py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/">
            <Button variant="ghost" className="mb-6 text-white hover:text-white hover:bg-white/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Water Modeling Resources
          </h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Comprehensive collection of tools, documentation, tutorials, and communities for urban water systems modeling.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        
        {/* EPA SWMM Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Code className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">EPA SWMM</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Official Documentation
              </h3>
              <p className="text-muted-foreground mb-4">
                Complete EPA SWMM5 reference manual, user guide, and technical documentation.
              </p>
              <a 
                href="https://www.epa.gov/water-research/storm-water-management-model-swmm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                Visit EPA SWMM <ExternalLink className="w-4 h-4" />
              </a>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                SWMM Applications Manual
              </h3>
              <p className="text-muted-foreground mb-4">
                Practical guidance on applying SWMM to various urban drainage problems.
              </p>
              <a 
                href="https://nepis.epa.gov/Exe/ZyPDF.cgi/P100S2T9.PDF?Dockey=P100S2T9.PDF" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                Download PDF <ExternalLink className="w-4 h-4" />
              </a>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
                <Code className="w-5 h-5" />
                Source Code Repository
              </h3>
              <p className="text-muted-foreground mb-4">
                Open-source SWMM code on GitHub for developers and advanced users.
              </p>
              <a 
                href="https://github.com/USEPA/Stormwater-Management-Model" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                View on GitHub <ExternalLink className="w-4 h-4" />
              </a>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" />
                SWMM User Community
              </h3>
              <p className="text-muted-foreground mb-4">
                Active community forum for questions, discussions, and shared experiences.
              </p>
              <a 
                href="https://www.openswmm.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                Join Community <ExternalLink className="w-4 h-4" />
              </a>
            </Card>
          </div>
        </section>

        {/* CHI & PCSWMM Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">CHI & PCSWMM</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Rules for Responsible Modeling
              </h3>
              <p className="text-muted-foreground mb-4">
                William James' comprehensive guide to deterministic modeling practices (this textbook's source).
              </p>
              <a 
                href="https://www.chiwater.com/Company/Staff/WJamesWebpage/original/homepage/Research/R184Pweb.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                Access Publication <ExternalLink className="w-4 h-4" />
              </a>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
                <Code className="w-5 h-5" />
                PCSWMM Software
              </h3>
              <p className="text-muted-foreground mb-4">
                Professional interface for SWMM with GIS integration, visualization, and advanced tools.
              </p>
              <a 
                href="https://www.chiwater.com/Software/PCSWMM/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                Learn More <ExternalLink className="w-4 h-4" />
              </a>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
                <Video className="w-5 h-5" />
                PCSWMM Training
              </h3>
              <p className="text-muted-foreground mb-4">
                Online and in-person training workshops for beginner to advanced users.
              </p>
              <a 
                href="https://www.chiwater.com/Training/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                View Training Options <ExternalLink className="w-4 h-4" />
              </a>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Journal of Water Management Modeling
              </h3>
              <p className="text-muted-foreground mb-4">
                Open-access peer-reviewed journal with latest research and case studies.
              </p>
              <a 
                href="https://www.chijournal.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                Browse Journal <ExternalLink className="w-4 h-4" />
              </a>
            </Card>
          </div>
        </section>

        {/* Academic & Research Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Academic & Research Resources</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-primary mb-3">Hydrology Textbooks</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Applied Hydrology - Chow, Maidment & Mays</li>
                <li>• Urban Stormwater Management - Akan & Houghtalen</li>
                <li>• Hydraulics in Civil Engineering - Chadwick & Morfett</li>
                <li>• Hydrology and Floodplain Analysis - Bedient et al.</li>
              </ul>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-primary mb-3">Professional Organizations</h3>
              <div className="space-y-3">
                <a 
                  href="https://www.asce.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-muted-foreground hover:text-primary"
                >
                  • American Society of Civil Engineers (ASCE) <ExternalLink className="w-3 h-3 inline" />
                </a>
                <a 
                  href="https://www.iahr.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-muted-foreground hover:text-primary"
                >
                  • International Association for Hydro-Environment Engineering <ExternalLink className="w-3 h-3 inline" />
                </a>
                <a 
                  href="https://www.wef.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-muted-foreground hover:text-primary"
                >
                  • Water Environment Federation (WEF) <ExternalLink className="w-3 h-3 inline" />
                </a>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-primary mb-3">Research Databases</h3>
              <div className="space-y-3">
                <a 
                  href="https://scholar.google.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-muted-foreground hover:text-primary"
                >
                  • Google Scholar <ExternalLink className="w-3 h-3 inline" />
                </a>
                <a 
                  href="https://www.sciencedirect.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-muted-foreground hover:text-primary"
                >
                  • ScienceDirect <ExternalLink className="w-3 h-3 inline" />
                </a>
                <a 
                  href="https://ascelibrary.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-muted-foreground hover:text-primary"
                >
                  • ASCE Library <ExternalLink className="w-3 h-3 inline" />
                </a>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-primary mb-3">Standards & Guidelines</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• ASCE/EWRI Standards for Urban Drainage</li>
                <li>• EPA Best Management Practices Guidelines</li>
                <li>• Local Municipal Design Standards</li>
                <li>• International Stormwater BMP Database</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Video Tutorials & Online Learning */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Video className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Video Tutorials & Online Learning</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-primary mb-3">YouTube Channels</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• CHI Water Official Channel - PCSWMM tutorials</li>
                <li>• EPA Water Research - SWMM webinars</li>
                <li>• University lecture series on hydrology</li>
                <li>• Professional training organizations</li>
              </ul>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-primary mb-3">Online Courses</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Coursera - Hydrology & Water Resources</li>
                <li>• edX - Environmental Engineering courses</li>
                <li>• LinkedIn Learning - GIS for Water Management</li>
                <li>• University extension programs</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Data & GIS Resources */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Data & GIS Resources</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-primary mb-3">Spatial Data Sources</h3>
              <div className="space-y-3">
                <a 
                  href="https://www.usgs.gov/products/data-and-tools/real-time-data" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-muted-foreground hover:text-primary"
                >
                  • USGS Water Data <ExternalLink className="w-3 h-3 inline" />
                </a>
                <a 
                  href="https://earthexplorer.usgs.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-muted-foreground hover:text-primary"
                >
                  • USGS Earth Explorer (DEMs, imagery) <ExternalLink className="w-3 h-3 inline" />
                </a>
                <a 
                  href="https://www.ncei.noaa.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-muted-foreground hover:text-primary"
                >
                  • NOAA Climate Data <ExternalLink className="w-3 h-3 inline" />
                </a>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-primary mb-3">GIS Software & Tools</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• ArcGIS - Professional GIS platform</li>
                <li>• QGIS - Free open-source GIS</li>
                <li>• HEC-GeoHMS - Watershed delineation</li>
                <li>• Google Earth Engine - Cloud GIS platform</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Abbreviations and Acronyms */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Abbreviations and Acronyms</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* General Abbreviations */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4">General Terms</h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-[auto,1fr] gap-3">
                  <span className="font-semibold text-foreground">3G</span>
                  <span className="text-muted-foreground">three generation(s) (approx. 75 years)</span>
                  <span className="font-semibold text-foreground">3GM</span>
                  <span className="text-muted-foreground">three generation modelling</span>
                  <span className="font-semibold text-foreground">AES</span>
                  <span className="text-muted-foreground">Atmospheric Environment Services</span>
                  <span className="font-semibold text-foreground">ANSI</span>
                  <span className="text-muted-foreground">American National Standards Institute</span>
                  <span className="font-semibold text-foreground">AOC</span>
                  <span className="text-muted-foreground">area of concern</span>
                  <span className="font-semibold text-foreground">ASCE</span>
                  <span className="text-muted-foreground">American Society of Civil Engineers</span>
                  <span className="font-semibold text-foreground">BBS</span>
                  <span className="text-muted-foreground">bulletin board system</span>
                  <span className="font-semibold text-foreground">BMP</span>
                  <span className="text-muted-foreground">best management practice</span>
                  <span className="font-semibold text-foreground">BOD</span>
                  <span className="text-muted-foreground">biological oxygen demand</span>
                  <span className="font-semibold text-foreground">CAD</span>
                  <span className="text-muted-foreground">computer aided design/drafting</span>
                  <span className="font-semibold text-foreground">CAE</span>
                  <span className="text-muted-foreground">computer aided engineering</span>
                  <span className="font-semibold text-foreground">CBSQMP</span>
                  <span className="text-muted-foreground">combinations of better stormwater quality management proposals</span>
                  <span className="font-semibold text-foreground">CDM</span>
                  <span className="text-muted-foreground">Camp Dresser McKee (a consulting engineering company)</span>
                  <span className="font-semibold text-foreground">CF</span>
                  <span className="text-muted-foreground">continuous flow</span>
                  <span className="font-semibold text-foreground">CFS</span>
                  <span className="text-muted-foreground">cubic feet per second</span>
                  <span className="font-semibold text-foreground">CPU</span>
                  <span className="text-muted-foreground">central processing unit</span>
                  <span className="font-semibold text-foreground">CSCE</span>
                  <span className="text-muted-foreground">Canadian Society of Civil Engineers</span>
                  <span className="font-semibold text-foreground">CSO</span>
                  <span className="text-muted-foreground">combined sewer overflow</span>
                  <span className="font-semibold text-foreground">CSWQMM</span>
                  <span className="text-muted-foreground">continuous storm water quality management modelling</span>
                  <span className="font-semibold text-foreground">DEIS</span>
                  <span className="text-muted-foreground">draft environmental impact statement</span>
                  <span className="font-semibold text-foreground">dpi</span>
                  <span className="text-muted-foreground">dots per inch</span>
                  <span className="font-semibold text-foreground">DSS</span>
                  <span className="text-muted-foreground">decision support system</span>
                  <span className="font-semibold text-foreground">DWF</span>
                  <span className="text-muted-foreground">dry weather flow</span>
                  <span className="font-semibold text-foreground">EPA</span>
                  <span className="text-muted-foreground">Environmental Protection Agency</span>
                  <span className="font-semibold text-foreground">GRU</span>
                  <span className="text-muted-foreground">grouped response units</span>
                  <span className="font-semibold text-foreground">GUI</span>
                  <span className="text-muted-foreground">graphical user interface</span>
                  <span className="font-semibold text-foreground">HRU</span>
                  <span className="text-muted-foreground">homogeneous response units</span>
                  <span className="font-semibold text-foreground">HSI</span>
                  <span className="text-muted-foreground">habitat suitability indices</span>
                  <span className="font-semibold text-foreground">IAHR</span>
                  <span className="text-muted-foreground">International Association for Hydraulic Ressearch</span>
                  <span className="font-semibold text-foreground">IAWPRC</span>
                  <span className="text-muted-foreground">International Association for Water Pollution Research and Control</span>
                  <span className="font-semibold text-foreground">IBM</span>
                  <span className="text-muted-foreground">International Business Machines</span>
                  <span className="font-semibold text-foreground">IDF</span>
                  <span className="text-muted-foreground">Intensity-Duration-Frequency curves</span>
                  <span className="font-semibold text-foreground">IET</span>
                  <span className="text-muted-foreground">inter-event time</span>
                  <span className="font-semibold text-foreground">Mb</span>
                  <span className="text-muted-foreground">Mega bytes (millions of bytes)</span>
                  <span className="font-semibold text-foreground">MDP</span>
                  <span className="text-muted-foreground">master drainage plan</span>
                  <span className="font-semibold text-foreground">MIPS</span>
                  <span className="text-muted-foreground">million instruction sets per second</span>
                  <span className="font-semibold text-foreground">MOEE</span>
                  <span className="text-muted-foreground">(Ontario) Ministry of Environment and Energy</span>
                  <span className="font-semibold text-foreground">NPDES</span>
                  <span className="text-muted-foreground">National Pollution Discharge Elimination System</span>
                  <span className="font-semibold text-foreground">NPS</span>
                  <span className="text-muted-foreground">nonpoint source</span>
                  <span className="font-semibold text-foreground">NURP</span>
                  <span className="text-muted-foreground">Nationwide Urban Runoff Program</span>
                  <span className="font-semibold text-foreground">OMNR</span>
                  <span className="text-muted-foreground">Ontario Ministry of Natural Resources</span>
                  <span className="font-semibold text-foreground">PC</span>
                  <span className="text-muted-foreground">personal computer</span>
                  <span className="font-semibold text-foreground">PCP</span>
                  <span className="text-muted-foreground">pollution control plan</span>
                  <span className="font-semibold text-foreground">pdf's</span>
                  <span className="text-muted-foreground">probability density functions</span>
                  <span className="font-semibold text-foreground">PF</span>
                  <span className="text-muted-foreground">plug flow</span>
                  <span className="font-semibold text-foreground">pH</span>
                  <span className="text-muted-foreground">negative log of hydrogen ion concentration</span>
                  <span className="font-semibold text-foreground">PWQO</span>
                  <span className="text-muted-foreground">Provincial Water Quality Objectives</span>
                  <span className="font-semibold text-foreground">RTC</span>
                  <span className="text-muted-foreground">real time control</span>
                  <span className="font-semibold text-foreground">SCS</span>
                  <span className="text-muted-foreground">Soil Conservation Service</span>
                  <span className="font-semibold text-foreground">SS</span>
                  <span className="text-muted-foreground">suspended solids</span>
                  <span className="font-semibold text-foreground">TBRG</span>
                  <span className="text-muted-foreground">tipping bucket rain gages</span>
                  <span className="font-semibold text-foreground">TS</span>
                  <span className="text-muted-foreground">time series</span>
                  <span className="font-semibold text-foreground">TSM</span>
                  <span className="text-muted-foreground">time series management</span>
                  <span className="font-semibold text-foreground">TSS</span>
                  <span className="text-muted-foreground">total suspended solids</span>
                  <span className="font-semibold text-foreground">USEPA</span>
                  <span className="text-muted-foreground">United States Environmental Protection Agency</span>
                  <span className="font-semibold text-foreground">USGS</span>
                  <span className="text-muted-foreground">United States Geological Survey</span>
                  <span className="font-semibold text-foreground">UWRRC</span>
                  <span className="text-muted-foreground">Urban Water Resources Research Council</span>
                  <span className="font-semibold text-foreground">UZS</span>
                  <span className="text-muted-foreground">upper zone storage</span>
                  <span className="font-semibold text-foreground">VGA</span>
                  <span className="text-muted-foreground">video graphics array</span>
                  <span className="font-semibold text-foreground">WIMP</span>
                  <span className="text-muted-foreground">windows-icons-menus-pointing devices</span>
                  <span className="font-semibold text-foreground">ZUM</span>
                  <span className="text-muted-foreground">zones of uniform meteorology</span>
                </div>
              </div>
            </Card>

            {/* Models and Programs */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4">Models and Programs</h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-[auto,1fr] gap-3">
                  <span className="font-semibold text-foreground">ARCINFO</span>
                  <span className="text-muted-foreground">a GIS program</span>
                  <span className="font-semibold text-foreground">AutoCAD®</span>
                  <span className="text-muted-foreground">an automated computer aided drafting package</span>
                  <span className="font-semibold text-foreground">BASIC</span>
                  <span className="text-muted-foreground">a programming language</span>
                  <span className="font-semibold text-foreground">BMP-Planner</span>
                  <span className="text-muted-foreground">an OOP for hydrology and planning</span>
                  <span className="font-semibold text-foreground">C, C++</span>
                  <span className="text-muted-foreground">a programming language</span>
                  <span className="font-semibold text-foreground">DBMS</span>
                  <span className="text-muted-foreground">database management system</span>
                  <span className="font-semibold text-foreground">EXTRAN</span>
                  <span className="text-muted-foreground">Extended transport program</span>
                  <span className="font-semibold text-foreground">FORTRAN</span>
                  <span className="text-muted-foreground">a programming language</span>
                  <span className="font-semibold text-foreground">GIS</span>
                  <span className="text-muted-foreground">Geographic Information System</span>
                  <span className="font-semibold text-foreground">HEC</span>
                  <span className="text-muted-foreground">Hydrologic Engineering Center (US Army Corps of Engineers)</span>
                  <span className="font-semibold text-foreground">HSPF</span>
                  <span className="text-muted-foreground">Hydrologic Simulation Program-Fortran</span>
                  <span className="font-semibold text-foreground">HYMO</span>
                  <span className="text-muted-foreground">a hydrologic model</span>
                  <span className="font-semibold text-foreground">LEAP</span>
                  <span className="text-muted-foreground">a program to compute eutrophication effects in small lakes</span>
                  <span className="font-semibold text-foreground">PCSWMM</span>
                  <span className="text-muted-foreground">Personal Computer version of SWMM</span>
                  <span className="font-semibold text-foreground">PRMS</span>
                  <span className="text-muted-foreground">Precipitation-Runoff Modelling System</span>
                  <span className="font-semibold text-foreground">QuattroPRO</span>
                  <span className="text-muted-foreground">a spreadsheet program</span>
                  <span className="font-semibold text-foreground">QuickBASIC</span>
                  <span className="text-muted-foreground">a programming language</span>
                  <span className="font-semibold text-foreground">RUNOFF</span>
                  <span className="text-muted-foreground">hydrology module in SWMM</span>
                  <span className="font-semibold text-foreground">STATISTICS</span>
                  <span className="text-muted-foreground">a post-processor in SWMM</span>
                  <span className="font-semibold text-foreground">STORM</span>
                  <span className="text-muted-foreground">Storage Treatment Overflow Runoff Model</span>
                  <span className="font-semibold text-foreground">SWMM</span>
                  <span className="text-muted-foreground">Storm Water Management Model</span>
                  <span className="font-semibold text-foreground">TRANSPORT</span>
                  <span className="text-muted-foreground">a drainage system of pipes, conduits and structures module in SWMM</span>
                  <span className="font-semibold text-foreground">TurboVision</span>
                  <span className="text-muted-foreground">an application framework for Borland's C++ compiler</span>
                  <span className="font-semibold text-foreground">WATFLOOD</span>
                  <span className="text-muted-foreground">a hydrologic program</span>
                  <span className="font-semibold text-foreground">XP-SWMM</span>
                  <span className="text-muted-foreground">SWMM Graphic based platform</span>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Additional Tools */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Additional Modeling Tools</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-4">
              <h3 className="font-bold text-primary mb-2">HEC-RAS</h3>
              <p className="text-sm text-muted-foreground mb-3">River hydraulics and flood modeling from US Army Corps of Engineers</p>
              <a 
                href="https://www.hec.usace.army.mil/software/hec-ras/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Learn More <ExternalLink className="w-3 h-3" />
              </a>
            </Card>

            <Card className="p-4">
              <h3 className="font-bold text-primary mb-2">HEC-HMS</h3>
              <p className="text-sm text-muted-foreground mb-3">Hydrologic modeling for watershed precipitation-runoff simulation</p>
              <a 
                href="https://www.hec.usace.army.mil/software/hec-hms/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Learn More <ExternalLink className="w-3 h-3" />
              </a>
            </Card>

            <Card className="p-4">
              <h3 className="font-bold text-primary mb-2">MIKE URBAN</h3>
              <p className="text-sm text-muted-foreground mb-3">Commercial urban drainage and water distribution modeling suite</p>
              <a 
                href="https://www.mikepoweredbydhi.com/products/mike-urban" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Learn More <ExternalLink className="w-3 h-3" />
              </a>
            </Card>

            <Card className="p-4">
              <h3 className="font-bold text-primary mb-2">InfoWorks ICM</h3>
              <p className="text-sm text-muted-foreground mb-3">Integrated catchment modeling for urban drainage networks</p>
              <a 
                href="https://www.autodesk.com/products/infowater/overview" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Learn More <ExternalLink className="w-3 h-3" />
              </a>
            </Card>

            <Card className="p-4">
              <h3 className="font-bold text-primary mb-2">EPANET</h3>
              <p className="text-sm text-muted-foreground mb-3">Water distribution system modeling software from EPA</p>
              <a 
                href="https://www.epa.gov/water-research/epanet" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Learn More <ExternalLink className="w-3 h-3" />
              </a>
            </Card>

            <Card className="p-4">
              <h3 className="font-bold text-primary mb-2">OpenFOAM</h3>
              <p className="text-sm text-muted-foreground mb-3">Open-source CFD toolkit for advanced hydraulic modeling</p>
              <a 
                href="https://www.openfoam.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Learn More <ExternalLink className="w-3 h-3" />
              </a>
            </Card>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="bg-muted/30 py-8 px-6 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            This resource collection is maintained to support learning and professional development in water systems modeling.
            <br />
            Links are provided for educational purposes. Please verify current availability and access requirements.
          </p>
          <div className="mt-4">
            <Link to="/">
              <Button variant="outline">
                Return to Book Home
              </Button>
            </Link>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
};

export default Resources;
