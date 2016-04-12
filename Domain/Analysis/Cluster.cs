using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.BL.Domain.Analysis
{
    public class Cluster
    {
        [Key]
        public long Id { get; set; }
        public int Number { get; set; }
        public double ClusterCenter { get; set; }
    }
}
