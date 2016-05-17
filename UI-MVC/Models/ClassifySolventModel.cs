using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SS.BL.Domain.Analyses;

namespace SS.UI.Web.MVC.Models
{
    public class ClassifySolventModel
    {
        public string Name { get; set; }
        public string CasNumber { get; set; }
        public double[] Values { get; set; }
        public string[] FeatureNames { get; set; }
        public AnalysisModel[] AnalysisModels { get; set; }
        public long UserId { get; set; }
    }
}