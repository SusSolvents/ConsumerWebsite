using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.BL.Domain.Analyses
{
    public class ClassifiedInstance
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string CasNumber { get; set; }
        public int ClusterNumber { get; set; }
        public ICollection<Feature> Features { get; set; }  
        public double DistanceToClusterCenter { get; set; }
    }
}
