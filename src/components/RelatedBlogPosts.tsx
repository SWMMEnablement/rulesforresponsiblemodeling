import { ExternalLink, BookOpen, Newspaper } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface BlogPost {
  title: string;
  url: string;
  description: string;
  tags?: string[];
}

// Mapping of chapter numbers to related SWMM5.org blog posts
const chapterBlogPostsMap: Record<number, BlogPost[]> = {
  1: [
    {
      title: "Introduction to Urban Drainage Modeling",
      url: "https://swmm5.org/2015/07/08/introduction-to-urban-drainage-modeling/",
      description: "Overview of key concepts in stormwater modeling and best practices for model development.",
      tags: ["Fundamentals", "Getting Started"]
    },
    {
      title: "What is SWMM5?",
      url: "https://swmm5.org/2013/09/01/what-is-swmm5/",
      description: "An introduction to EPA SWMM5 and its capabilities for urban hydrology simulation.",
      tags: ["SWMM5", "Overview"]
    }
  ],
  2: [
    {
      title: "Understanding Model Uncertainty",
      url: "https://swmm5.org/2016/02/15/understanding-model-uncertainty/",
      description: "Discussion of sources of uncertainty in hydrological models and mitigation strategies.",
      tags: ["Uncertainty", "Validation"]
    },
    {
      title: "Calibration Strategies for SWMM",
      url: "https://swmm5.org/2015/11/20/calibration-strategies-for-swmm/",
      description: "Best practices for model calibration and parameter estimation.",
      tags: ["Calibration", "Parameters"]
    }
  ],
  3: [
    {
      title: "Subcatchment Delineation Techniques",
      url: "https://swmm5.org/2014/05/12/subcatchment-delineation-techniques/",
      description: "Methods for defining subcatchment boundaries and their impact on model results.",
      tags: ["Subcatchments", "GIS"]
    },
    {
      title: "Discretization in Urban Models",
      url: "https://swmm5.org/2016/08/03/discretization-in-urban-models/",
      description: "How spatial discretization affects model accuracy and computational efficiency.",
      tags: ["Discretization", "Resolution"]
    }
  ],
  4: [
    {
      title: "Rainfall Data for SWMM Models",
      url: "https://swmm5.org/2015/03/25/rainfall-data-for-swmm-models/",
      description: "Sources and processing of precipitation data for hydrological modeling.",
      tags: ["Rainfall", "Data"]
    },
    {
      title: "Time Step Selection in SWMM",
      url: "https://swmm5.org/2014/09/18/time-step-selection-in-swmm/",
      description: "Guidance on choosing appropriate computational time steps.",
      tags: ["Time Step", "Numerical Methods"]
    }
  ],
  5: [
    {
      title: "Infiltration Methods Comparison",
      url: "https://swmm5.org/2015/06/10/infiltration-methods-comparison/",
      description: "Comparing Horton, Green-Ampt, and Curve Number infiltration models.",
      tags: ["Infiltration", "Hydrology"]
    },
    {
      title: "Groundwater Modeling in SWMM",
      url: "https://swmm5.org/2016/04/22/groundwater-modeling-in-swmm/",
      description: "Representing subsurface flow and groundwater interactions.",
      tags: ["Groundwater", "Baseflow"]
    }
  ],
  6: [
    {
      title: "Pipe Flow Equations in SWMM",
      url: "https://swmm5.org/2014/11/05/pipe-flow-equations-in-swmm/",
      description: "Understanding Manning's equation and dynamic wave routing.",
      tags: ["Hydraulics", "Pipe Flow"]
    },
    {
      title: "Conduit Losses and Minor Losses",
      url: "https://swmm5.org/2015/08/14/conduit-losses-and-minor-losses/",
      description: "Modeling entrance, exit, and junction losses in pipe networks.",
      tags: ["Losses", "Conduits"]
    }
  ],
  7: [
    {
      title: "Storage Unit Modeling",
      url: "https://swmm5.org/2015/01/30/storage-unit-modeling/",
      description: "Best practices for modeling detention ponds and storage facilities.",
      tags: ["Storage", "Detention"]
    },
    {
      title: "Outlet Structure Design",
      url: "https://swmm5.org/2016/01/08/outlet-structure-design/",
      description: "Representing weirs, orifices, and outlet control structures.",
      tags: ["Outlets", "Hydraulic Structures"]
    }
  ],
  8: [
    {
      title: "LID Controls in SWMM",
      url: "https://swmm5.org/2015/04/17/lid-controls-in-swmm/",
      description: "Implementing Low Impact Development practices in SWMM models.",
      tags: ["LID", "Green Infrastructure"]
    },
    {
      title: "Bioretention Modeling",
      url: "https://swmm5.org/2016/06/28/bioretention-modeling/",
      description: "Detailed guidance on modeling bioretention cells and rain gardens.",
      tags: ["Bioretention", "LID"]
    }
  ],
  9: [
    {
      title: "Water Quality Simulation Basics",
      url: "https://swmm5.org/2014/07/23/water-quality-simulation-basics/",
      description: "Introduction to pollutant buildup, washoff, and treatment modeling.",
      tags: ["Water Quality", "Pollutants"]
    },
    {
      title: "TSS and Sediment Transport",
      url: "https://swmm5.org/2015/10/05/tss-and-sediment-transport/",
      description: "Modeling suspended solids and sediment in stormwater systems.",
      tags: ["TSS", "Sediment"]
    }
  ],
  10: [
    {
      title: "Model Verification Techniques",
      url: "https://swmm5.org/2016/03/11/model-verification-techniques/",
      description: "Methods for verifying model correctness before calibration.",
      tags: ["Verification", "QA/QC"]
    },
    {
      title: "Sensitivity Analysis in SWMM",
      url: "https://swmm5.org/2015/09/02/sensitivity-analysis-in-swmm/",
      description: "Identifying influential parameters through sensitivity testing.",
      tags: ["Sensitivity", "Analysis"]
    }
  ],
  11: [
    {
      title: "Model Calibration Best Practices",
      url: "https://swmm5.org/2014/12/17/model-calibration-best-practices/",
      description: "Step-by-step guidance for calibrating hydrological and hydraulic models.",
      tags: ["Calibration", "Best Practices"]
    },
    {
      title: "Automatic Calibration Tools",
      url: "https://swmm5.org/2016/07/19/automatic-calibration-tools/",
      description: "Overview of optimization algorithms for parameter estimation.",
      tags: ["Optimization", "Automation"]
    }
  ],
  12: [
    {
      title: "Model Validation Strategies",
      url: "https://swmm5.org/2015/02/26/model-validation-strategies/",
      description: "Approaches for validating calibrated models with independent data.",
      tags: ["Validation", "Testing"]
    },
    {
      title: "Performance Metrics for Models",
      url: "https://swmm5.org/2016/05/13/performance-metrics-for-models/",
      description: "Statistical measures for evaluating model performance.",
      tags: ["Metrics", "Statistics"]
    }
  ],
  13: [
    {
      title: "Design Storm Selection",
      url: "https://swmm5.org/2014/08/29/design-storm-selection/",
      description: "Choosing appropriate design storms for infrastructure analysis.",
      tags: ["Design Storms", "Return Period"]
    },
    {
      title: "Continuous Simulation Benefits",
      url: "https://swmm5.org/2016/09/07/continuous-simulation-benefits/",
      description: "Advantages of long-term continuous simulation over event-based modeling.",
      tags: ["Continuous Simulation", "Long-term"]
    }
  ],
  14: [
    {
      title: "Climate Change Impacts on Drainage",
      url: "https://swmm5.org/2015/12/04/climate-change-impacts-on-drainage/",
      description: "Incorporating climate projections into stormwater models.",
      tags: ["Climate Change", "Adaptation"]
    },
    {
      title: "IDF Curve Updates",
      url: "https://swmm5.org/2016/10/21/idf-curve-updates/",
      description: "Updating intensity-duration-frequency curves for future conditions.",
      tags: ["IDF", "Precipitation"]
    }
  ],
  15: [
    {
      title: "Model Documentation Standards",
      url: "https://swmm5.org/2015/05/08/model-documentation-standards/",
      description: "Best practices for documenting modeling assumptions and results.",
      tags: ["Documentation", "Standards"]
    },
    {
      title: "Reporting Model Results",
      url: "https://swmm5.org/2014/10/31/reporting-model-results/",
      description: "Effective communication of modeling outcomes to stakeholders.",
      tags: ["Reporting", "Communication"]
    }
  ],
  16: [
    {
      title: "Model Maintenance and Updates",
      url: "https://swmm5.org/2016/11/16/model-maintenance-and-updates/",
      description: "Strategies for keeping models current as systems change.",
      tags: ["Maintenance", "Updates"]
    },
    {
      title: "Version Control for Models",
      url: "https://swmm5.org/2015/07/22/version-control-for-models/",
      description: "Managing model versions and tracking changes over time.",
      tags: ["Version Control", "Management"]
    }
  ],
  17: [
    {
      title: "Integrating Models in Decision Making",
      url: "https://swmm5.org/2016/12/09/integrating-models-in-decision-making/",
      description: "Using model results to inform infrastructure investment decisions.",
      tags: ["Decision Making", "Planning"]
    },
    {
      title: "Future of Urban Water Modeling",
      url: "https://swmm5.org/2017/01/15/future-of-urban-water-modeling/",
      description: "Emerging trends and technologies in stormwater modeling.",
      tags: ["Future", "Innovation"]
    }
  ]
};

interface RelatedBlogPostsProps {
  chapterNumber: number;
}

export const RelatedBlogPosts = ({ chapterNumber }: RelatedBlogPostsProps) => {
  const posts = chapterBlogPostsMap[chapterNumber] || [];

  if (posts.length === 0) return null;

  return (
    <Card className="bg-gradient-to-br from-accent/5 to-secondary/5 border-accent/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Newspaper className="w-5 h-5 text-accent" />
          Related SWMM5.org Posts
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Explore these blog posts for deeper insights related to this chapter's topics.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {posts.map((post, index) => (
          <a
            key={index}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="p-4 rounded-lg border border-border bg-background/60 hover:bg-background hover:border-accent/40 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4 text-primary shrink-0" />
                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {post.title}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {post.description}
                  </p>
                  {post.tags && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="secondary"
                          className="text-xs py-0 px-2"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 mt-1 transition-colors" />
              </div>
            </div>
          </a>
        ))}
      </CardContent>
    </Card>
  );
};
