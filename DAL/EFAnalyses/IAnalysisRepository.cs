using SS.BL.Domain.Analyses;
using SS.BL.Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.DAL.EFAnalyses
{
    public interface IAnalysisRepository
    {
        //Algorithm
        Algorithm CreateAlgorithm(Algorithm algorithm);

        //Analysis
        Analysis CreateAnalysis(Analysis analysis, User createdBy);

        //Cluster
        Cluster CreateCluster(Cluster cluster);

        //Feature
        Feature CreateFeature(Feature feature);

        //Parameter
        Parameter CreateParameter(Parameter parameter);

        //Solvent
        Solvent CreateSolvent(Solvent solvent);
    }
}
