using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.BL.Domain.Analyses
{
    public class ClusterDistanceCenter
    {
        [Key]
        public long Id { get; set; }

        public long ClusterId { get; set; }
        public double Distance { get; set; }
    }
}
