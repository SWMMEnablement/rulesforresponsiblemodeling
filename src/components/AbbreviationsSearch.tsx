import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Abbreviation {
  abbr: string;
  definition: string;
}

const generalTerms: Abbreviation[] = [
  { abbr: "3G", definition: "three generation(s) (approx. 75 years)" },
  { abbr: "3GM", definition: "three generation modelling" },
  { abbr: "AES", definition: "Atmospheric Environment Services" },
  { abbr: "ANSI", definition: "American National Standards Institute" },
  { abbr: "AOC", definition: "area of concern" },
  { abbr: "ASCE", definition: "American Society of Civil Engineers" },
  { abbr: "BBS", definition: "bulletin board system" },
  { abbr: "BMP", definition: "best management practice" },
  { abbr: "BOD", definition: "biological oxygen demand" },
  { abbr: "CAD", definition: "computer aided design/drafting" },
  { abbr: "CAE", definition: "computer aided engineering" },
  { abbr: "CBSQMP", definition: "combinations of better stormwater quality management proposals" },
  { abbr: "CDM", definition: "Camp Dresser McKee (a consulting engineering company)" },
  { abbr: "CF", definition: "continuous flow" },
  { abbr: "CFS", definition: "cubic feet per second" },
  { abbr: "CPU", definition: "central processing unit" },
  { abbr: "CSCE", definition: "Canadian Society of Civil Engineers" },
  { abbr: "CSO", definition: "combined sewer overflow" },
  { abbr: "CSWQMM", definition: "continuous storm water quality management modelling" },
  { abbr: "DEIS", definition: "draft environmental impact statement" },
  { abbr: "dpi", definition: "dots per inch" },
  { abbr: "DSS", definition: "decision support system" },
  { abbr: "DWF", definition: "dry weather flow" },
  { abbr: "EPA", definition: "Environmental Protection Agency" },
  { abbr: "GRU", definition: "grouped response units" },
  { abbr: "GUI", definition: "graphical user interface" },
  { abbr: "HRU", definition: "homogeneous response units" },
  { abbr: "HSI", definition: "habitat suitability indices" },
  { abbr: "IAHR", definition: "International Association for Hydraulic Research" },
  { abbr: "IAWPRC", definition: "International Association for Water Pollution Research and Control" },
  { abbr: "IBM", definition: "International Business Machines" },
  { abbr: "IDF", definition: "Intensity-Duration-Frequency curves" },
  { abbr: "IET", definition: "inter-event time" },
  { abbr: "Mb", definition: "Mega bytes (millions of bytes)" },
  { abbr: "MDP", definition: "master drainage plan" },
  { abbr: "MIPS", definition: "million instruction sets per second" },
  { abbr: "MOEE", definition: "(Ontario) Ministry of Environment and Energy" },
  { abbr: "NPDES", definition: "National Pollution Discharge Elimination System" },
  { abbr: "NPS", definition: "nonpoint source" },
  { abbr: "NURP", definition: "Nationwide Urban Runoff Program" },
  { abbr: "OMNR", definition: "Ontario Ministry of Natural Resources" },
  { abbr: "PC", definition: "personal computer" },
  { abbr: "PCP", definition: "pollution control plan" },
  { abbr: "pdf's", definition: "probability density functions" },
  { abbr: "PF", definition: "plug flow" },
  { abbr: "pH", definition: "negative log of hydrogen ion concentration" },
  { abbr: "PWQO", definition: "Provincial Water Quality Objectives" },
  { abbr: "RTC", definition: "real time control" },
  { abbr: "SCS", definition: "Soil Conservation Service" },
  { abbr: "SS", definition: "suspended solids" },
  { abbr: "TBRG", definition: "tipping bucket rain gages" },
  { abbr: "TS", definition: "time series" },
  { abbr: "TSM", definition: "time series management" },
  { abbr: "TSS", definition: "total suspended solids" },
  { abbr: "USEPA", definition: "United States Environmental Protection Agency" },
  { abbr: "USGS", definition: "United States Geological Survey" },
  { abbr: "UWRRC", definition: "Urban Water Resources Research Council" },
  { abbr: "UZS", definition: "upper zone storage" },
  { abbr: "VGA", definition: "video graphics array" },
  { abbr: "WIMP", definition: "windows-icons-menus-pointing devices" },
  { abbr: "ZUM", definition: "zones of uniform meteorology" },
];

const modelsAndPrograms: Abbreviation[] = [
  { abbr: "ARCINFO", definition: "a GIS program" },
  { abbr: "AutoCAD®", definition: "an automated computer aided drafting package" },
  { abbr: "BASIC", definition: "a programming language" },
  { abbr: "BMP-Planner", definition: "an OOP for hydrology and planning" },
  { abbr: "C, C++", definition: "a programming language" },
  { abbr: "DBMS", definition: "database management system" },
  { abbr: "EXTRAN", definition: "Extended transport program" },
  { abbr: "FORTRAN", definition: "a programming language" },
  { abbr: "GIS", definition: "Geographic Information System" },
  { abbr: "HEC", definition: "Hydrologic Engineering Center (US Army Corps of Engineers)" },
  { abbr: "HSPF", definition: "Hydrologic Simulation Program-Fortran" },
  { abbr: "HYMO", definition: "a hydrologic model" },
  { abbr: "LEAP", definition: "a program to compute eutrophication effects in small lakes" },
  { abbr: "PCSWMM", definition: "Personal Computer version of SWMM" },
  { abbr: "PRMS", definition: "Precipitation-Runoff Modelling System" },
  { abbr: "QuattroPRO", definition: "a spreadsheet program" },
  { abbr: "QuickBASIC", definition: "a programming language" },
  { abbr: "RUNOFF", definition: "hydrology module in SWMM" },
  { abbr: "STATISTICS", definition: "a post-processor in SWMM" },
  { abbr: "STORM", definition: "Storage Treatment Overflow Runoff Model" },
  { abbr: "SWMM", definition: "Storm Water Management Model" },
  { abbr: "TRANSPORT", definition: "a drainage system of pipes, conduits and structures module in SWMM" },
  { abbr: "TurboVision", definition: "an application framework for Borland's C++ compiler" },
  { abbr: "WATFLOOD", definition: "a hydrologic program" },
  { abbr: "XP-SWMM", definition: "SWMM Graphic based platform" },
];

const highlightMatch = (text: string, query: string) => {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) => 
    regex.test(part) ? <mark key={i} className="bg-primary/30 text-foreground rounded px-0.5">{part}</mark> : part
  );
};

export const AbbreviationsSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGeneral = useMemo(() => {
    if (!searchQuery.trim()) return generalTerms;
    const query = searchQuery.toLowerCase();
    return generalTerms.filter(
      item => item.abbr.toLowerCase().includes(query) || item.definition.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const filteredModels = useMemo(() => {
    if (!searchQuery.trim()) return modelsAndPrograms;
    const query = searchQuery.toLowerCase();
    return modelsAndPrograms.filter(
      item => item.abbr.toLowerCase().includes(query) || item.definition.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const totalResults = filteredGeneral.length + filteredModels.length;
  const totalItems = generalTerms.length + modelsAndPrograms.length;

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <Search className="w-8 h-8 text-primary" />
        <h2 className="text-3xl font-bold text-foreground">Abbreviations and Acronyms</h2>
      </div>

      {/* Search Input */}
      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search abbreviations or definitions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
            onClick={() => setSearchQuery("")}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Results Count */}
      {searchQuery && (
        <p className="text-sm text-muted-foreground mb-4">
          Showing {totalResults} of {totalItems} terms
          {totalResults === 0 && " — try a different search term"}
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* General Abbreviations */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-primary mb-4">
            General Terms
            {searchQuery && <span className="text-sm font-normal text-muted-foreground ml-2">({filteredGeneral.length})</span>}
          </h3>
          {filteredGeneral.length > 0 ? (
            <div className="space-y-2 text-sm max-h-[500px] overflow-y-auto pr-2">
              <div className="grid grid-cols-[auto,1fr] gap-3">
                {filteredGeneral.map((item) => (
                  <>
                    <span key={`${item.abbr}-abbr`} className="font-semibold text-foreground">
                      {highlightMatch(item.abbr, searchQuery)}
                    </span>
                    <span key={`${item.abbr}-def`} className="text-muted-foreground">
                      {highlightMatch(item.definition, searchQuery)}
                    </span>
                  </>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm italic">No matching terms found</p>
          )}
        </Card>

        {/* Models and Programs */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-primary mb-4">
            Models and Programs
            {searchQuery && <span className="text-sm font-normal text-muted-foreground ml-2">({filteredModels.length})</span>}
          </h3>
          {filteredModels.length > 0 ? (
            <div className="space-y-2 text-sm max-h-[500px] overflow-y-auto pr-2">
              <div className="grid grid-cols-[auto,1fr] gap-3">
                {filteredModels.map((item) => (
                  <>
                    <span key={`${item.abbr}-abbr`} className="font-semibold text-foreground">
                      {highlightMatch(item.abbr, searchQuery)}
                    </span>
                    <span key={`${item.abbr}-def`} className="text-muted-foreground">
                      {highlightMatch(item.definition, searchQuery)}
                    </span>
                  </>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm italic">No matching programs found</p>
          )}
        </Card>
      </div>
    </section>
  );
};
