using SS.BL.Domain.Analyses;
using SS.BL.Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.BL.Analyses
{
    public interface IAnalysisManager
    {
        //Algorithm
        Algorithm CreateAlgorithm(AlgorithmName algorithmName, long processTime, string generalResult);

        //Analysis
        Analysis CreateAnalysis(string name, DateTime dateCreated, string sourcefileUrl, User createdBy);

        //Cluster
        Cluster CreateCluster(int number, double clusterCenter);

        //Feature
        Feature CreateFeature(FeatureName featureName, double value);

        //Parameter
        Parameter CreateParameter(string name, double value);

        //Solvent
        Solvent CreateSolvent(int number, string name, string casNr, double distanceToClusterCenter);
    }
}
