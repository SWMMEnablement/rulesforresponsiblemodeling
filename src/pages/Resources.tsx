import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, BookOpen, FileText, Video, Code, Users, GraduationCap } from "lucide-react";

const Resources = () => {
  return (
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
  );
};

export default Resources;
