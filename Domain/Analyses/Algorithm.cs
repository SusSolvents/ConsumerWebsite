using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.BL.Domain.Analyses
{
    public class Algorithm
    {
        [Key]
        public long Id { get; set; }
        public AlgorithmName AlgorithmName { get; set; }
        public long ProcessTime { get; set; }
        public string GeneralResult { get; set; }
        public ICollection<Parameter> Parameters { get; set; }
        public ICollection<Cluster> Clusters { get; set; }
    }
}
